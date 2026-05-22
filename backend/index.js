const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdf = require('pdf-parse');
const { MongoClient, ObjectId, GridFSBucket } = require('mongodb');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(express.json({ limit: '5mb' }));
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*', credentials: false }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }
});

const client = new MongoClient(process.env.MONGODB_URI, {
  ignoreUndefined: true,
  tls: true,
  retryWrites: true,
});

let db, documents, chunks, sessions, bucket, genAI, embedModel, chatModel;

function chunkText(text, size = 1000, overlap = 100) {
  const res = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(i + size, text.length);
    const piece = text.slice(i, end).trim();
    if (piece) res.push(piece);
    if (end === text.length) break;
    i = end - overlap;
    if (i < 0) i = 0;
  }
  return res;
}

function tokenizeQuery(query) {
  return String(query || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

async function fallbackRetrieve(query) {
  const terms = [...new Set(tokenizeQuery(query))].slice(0, 8);
  const regex = terms.length ? new RegExp(terms.join('|'), 'i') : /.*/i;

  const candidates = await chunks
    .find(
      {
        $or: [
          { text: regex },
          { filename: regex },
        ],
      },
      {
        projection: {
          _id: 1,
          docId: 1,
          filename: 1,
          text: 1,
          page: 1,
          chunk: 1,
        },
      }
    )
    .limit(20)
    .toArray();

  const scored = candidates
    .map((candidate) => {
      const haystack = `${candidate.filename} ${candidate.text}`.toLowerCase();
      const score = terms.reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0);
      return { ...candidate, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return scored;
}

function buildDemoAnswer(query, sources) {
  if (!sources.length) {
    return [
      'Demo mode is active because the live AI service is currently unavailable.',
      `I could not find a reliable SOP source for "${query}" in the indexed documents.`,
      'Please upload more SOP PDFs or restore the Gemini API quota to enable live answers.',
    ].join('\n\n');
  }

  const sourceLines = sources.map((source, index) => {
    const snippet = String(source.text || '').replace(/\s+/g, ' ').trim().slice(0, 260);
    return `[Source ${index + 1}] ${source.filename}${source.page ? ` (Page ${source.page})` : ''}: ${snippet}`;
  });

  return [
    'Demo mode is active because the live AI service is currently unavailable.',
    `Here are the most relevant SOP excerpts I found for "${query}":`,
    ...sourceLines,
    'Please treat this as a source-grounded demo response until the Gemini API quota is restored.',
  ].join('\n\n');
}

function streamSseMessage(res, payload) {
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function initSse(res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
}

async function getFallbackSources(query) {
  if (!chunks) {
    return [];
  }

  try {
    return await fallbackRetrieve(query);
  } catch (error) {
    console.error('Fallback retrieval failed:', error);
    return [];
  }
}

async function streamDemoFallback(res, query, sources) {
  const answer = buildDemoAnswer(query, sources);
  streamSseMessage(res, { delta: answer });
  streamSseMessage(res, { sources });
  res.write('data: [DONE]\n\n');
  res.end();
}

// ✅ FIXED EMBEDDING FUNCTION (stable across API responses)
async function embed(text) {
  try {
    const r = await embedModel.embedContent(text);
    return r.embedding?.values || r.embedding || [];
  } catch (err) {
    console.error('Embedding failed:', err.message);
    return [];
  }
}

async function ensureConn() {
  if (!db) {
    await client.connect();
    db = client.db(process.env.MONGODB_DB || 'opsmind');
    documents = db.collection('documents');
    chunks = db.collection('chunks');
    sessions = db.collection('sessions');
    bucket = new GridFSBucket(db, { bucketName: 'files' });
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

    // ✅ FIXED MODEL NAMES
    embedModel = genAI.getGenerativeModel({
      model: 'text-embedding-004'
    });

    chatModel = genAI.getGenerativeModel({
      model: process.env.GEMINI_CHAT_MODEL || 'gemini-1.5-flash'
    });
  }
}

app.post('/api/admin/upload', upload.single('file'), async (req, res) => {
  try {
    await ensureConn();

    if (!req.file || req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'PDF required' });
    }

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    uploadStream.end(req.file.buffer);

    const fileId = await new Promise((resolve, reject) => {
      uploadStream.on('finish', () => resolve(uploadStream.id));
      uploadStream.on('error', reject);
    });

    const data = await pdf(req.file.buffer);
    const text = (data.text || '').replace(/\r/g, '');

    const doc = {
      filename: req.file.originalname,
      fileId,
      size: req.file.size,
      pages: data.numpages || null,
      uploadedAt: new Date(),
    };

    const { insertedId } = await documents.insertOne(doc);

    const parts = chunkText(text, 1000, 100);

    for (let i = 0; i < parts.length; i++) {
      const e = await embed(parts[i]);

      if (!e.length) continue; // skip failed embeddings

      await chunks.insertOne({
        docId: insertedId,
        filename: doc.filename,
        chunk: i,
        page: null,
        text: parts[i],
        embedding: e,
      });
    }

    res.json({ ok: true, documentId: insertedId, chunks: parts.length });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'upload_failed' });
  }
});

app.get('/api/admin/docs', async (req, res) => {
  try {
    await ensureConn();
    const list = await documents
      .find({}, { projection: { filename: 1, uploadedAt: 1, pages: 1, size: 1 } })
      .toArray();
    res.json(list);
  } catch (e) {
    console.error('Failed to list documents:', e);
    res.status(500).json({ error: 'list_failed' });
  }
});

app.get('/api/chat/stream', async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q) return res.status(400).end();

  initSse(res);

  try {
    await ensureConn();

    const qEmb = await embed(q);

    let agg = [];

    if (qEmb.length) {
      agg = await chunks
        .aggregate([
          {
            $vectorSearch: {
              index: 'rag_index',
              path: 'embedding',
              queryVector: qEmb,
              numCandidates: 200,
              limit: 5,
            },
          },
          {
            $project: {
              _id: 1,
              docId: 1,
              text: 1,
              filename: 1,
              page: 1,
              chunk: 1,
              score: { $meta: 'vectorSearchScore' },
            },
          },
        ])
        .toArray();
    }

    if (!agg.length) {
      agg = await fallbackRetrieve(q);
    }

    const context = agg
      .map((c, i) => `Source ${i + 1}:\n${c.text}`)
      .join('\n\n');

    const prompt = `Answer using ONLY the sources below. If not found, say "I don't know."\n\nQuestion:\n${q}\n\nSources:\n${context}`;

    const result = await chatModel.generateContentStream({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    for await (const chunk of result.stream) {
      const t = chunk.text();
      if (t) {
        streamSseMessage(res, { delta: t });
      }
    }

    streamSseMessage(res, { sources: agg });
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (e) {
    console.error('Chat failed:', e);
    try {
      const fallbackSources = await getFallbackSources(q);
      await streamDemoFallback(res, q, fallbackSources);
    } catch (fallbackError) {
      console.error('Demo fallback failed:', fallbackError);
      streamSseMessage(res, {
        delta: 'Demo mode could not load source excerpts right now. Please try again shortly.',
      });
      res.write('data: [DONE]\n\n');
      res.end();
    }
  }
});

const port = Number(process.env.PORT || 7001);
app.listen(port, () => {
  console.log(`OpsMind Backend running on port ${port}`);
});
