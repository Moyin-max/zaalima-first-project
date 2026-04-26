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

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

const client = new MongoClient(process.env.MONGODB_URI, { ignoreUndefined: true });
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

async function embed(text) {
  const r = await embedModel.embedContent(text);
  return r.embedding.values;
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
    embedModel = genAI.getGenerativeModel({ model: process.env.GEMINI_EMBEDDING_MODEL || 'text-embedding-004' });
    chatModel = genAI.getGenerativeModel({ model: process.env.GEMINI_CHAT_MODEL || 'gemini-1.5-flash' });
  }
}

app.post('/api/admin/upload', upload.single('file'), async (req, res) => {
  try {
    await ensureConn();
    if (!req.file || req.file.mimetype !== 'application/pdf') return res.status(400).json({ error: 'PDF required' });
    const uploadStream = bucket.openUploadStream(req.file.originalname, { contentType: req.file.mimetype, metadata: {} });
    uploadStream.end(req.file.buffer);
    const fileId = await new Promise((resolve, reject) => {
      uploadStream.on('finish', () => resolve(uploadStream.id));
      uploadStream.on('error', reject);
    });
    const data = await pdf(req.file.buffer);
    const text = (data.text || '').replace(/\r/g, '');
    const doc = { filename: req.file.originalname, fileId, size: req.file.size, pages: data.numpages || null, uploadedAt: new Date() };
    const { insertedId } = await documents.insertOne(doc);
    const parts = chunkText(text, 1000, 100);
    for (let i = 0; i < parts.length; i++) {
      const e = await embed(parts[i]);
      await chunks.insertOne({
        docId: insertedId,
        filename: doc.filename,
        chunk: i,
        page: null,
        text: parts[i],
        embedding: e
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
    const list = await documents.find({}, { projection: { filename: 1, uploadedAt: 1, pages: 1, size: 1 } }).toArray();
    res.json(list);
  } catch (e) {
    console.error('Failed to list documents:', e);
    res.status(500).json({ error: 'list_failed' });
  }
});

app.delete('/api/admin/docs/:id', async (req, res) => {
  try {
    await ensureConn();
    const id = new ObjectId(req.params.id);
    const doc = await documents.findOne({ _id: id });
    if (!doc) return res.status(404).json({ error: 'not_found' });
    await chunks.deleteMany({ docId: id });
    if (doc.fileId) {
      try { await bucket.delete(new ObjectId(doc.fileId)); } catch (_) {}
    }
    await documents.deleteOne({ _id: id });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'delete_failed' });
  }
});

app.get('/api/chat/sessions', async (req, res) => {
  try {
    await ensureConn();
    const list = await sessions.find({}, { projection: { messages: 0 }, sort: { updatedAt: -1 } }).toArray();
    res.json(list);
  } catch (e) {
    console.error('Failed to list chat sessions:', e);
    res.status(500).json({ error: 'sessions_failed' });
  }
});

app.get('/api/chat/sessions/:id', async (req, res) => {
  try {
    await ensureConn();
    const s = await sessions.findOne({ _id: new ObjectId(req.params.id) });
    if (!s) return res.status(404).json({ error: 'not_found' });
    res.json(s);
  } catch (e) {
    console.error('Failed to fetch chat session:', e);
    res.status(500).json({ error: 'fetch_session_failed' });
  }
});

app.post('/api/chat/sessions', async (req, res) => {
  try {
    await ensureConn();
    const { id, title, messages } = req.body;
    const update = { 
      title: title || 'New Chat', 
      messages: messages || [], 
      updatedAt: new Date() 
    };
    
    if (id && ObjectId.isValid(id)) {
      await sessions.updateOne({ _id: new ObjectId(id) }, { $set: update }, { upsert: true });
      res.json({ ok: true, id });
    } else {
      const { insertedId } = await sessions.insertOne({ ...update, createdAt: new Date() });
      res.json({ ok: true, id: insertedId });
    }
  } catch (e) {
    console.error('Failed to save chat session:', e);
    res.status(500).json({ error: 'save_session_failed' });
  }
});

app.delete('/api/chat/sessions/:id', async (req, res) => {
  try {
    await ensureConn();
    await sessions.deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ ok: true });
  } catch (e) {
    console.error('Failed to delete chat session:', e);
    res.status(500).json({ error: 'delete_session_failed' });
  }
});

app.get('/api/chat/stream', async (req, res) => {
  try {
    await ensureConn();
    const q = String(req.query.q || '').trim();
    if (!q) return res.status(400).end();
    const qEmb = await embed(q);
    const agg = await chunks.aggregate([
      {
        $vectorSearch: {
          index: 'rag_index',
          path: 'embedding',
          queryVector: qEmb,
          numCandidates: 200,
          limit: 5
        }
      },
      {
        $project: {
          text: 1,
          filename: 1,
          docId: 1,
          page: 1,
          chunk: 1,
          score: { $meta: 'vectorSearchScore' }
        }
      }
    ]).toArray();
    const context = agg.map((c, i) => `Source ${i + 1} | ${c.filename} | chunk ${c.chunk} | page ${c.page ?? 'n/a'}:\n${c.text}`).join('\n\n');
    const prompt = [
      'You are a corporate SOP assistant. Answer strictly using the provided sources.',
      'Cite your sources inline like [Source k] and include a bullet list of sources at the end.',
      'If the answer is not in the sources, say: "I don’t know."',
      `User question:\n${q}`,
      `Sources:\n${context}`
    ].join('\n\n');

    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    try {
      const result = await chatModel.generateContentStream({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
      for await (const chunk of result.stream) {
        const t = chunk.text();
        if (t) res.write(`data: ${JSON.stringify({ delta: t })}\n\n`);
      }
      res.write(`data: ${JSON.stringify({ sources: agg })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (_) {
      const fallback = 'I don’t know.';
      let i = 0;
      const timer = setInterval(() => {
        if (i >= fallback.length) {
          clearInterval(timer);
          res.write('data: [DONE]\n\n');
          res.end();
        } else {
          const end = Math.min(i + 3, fallback.length);
          res.write(`data: ${JSON.stringify({ delta: fallback.slice(i, end) })}\n\n`);
          i = end;
        }
      }, 25);
    }
  } catch (e) {
    console.error('Failed to stream chat response:', e);
    try {
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (_) {}
  }
});

const port = Number(process.env.PORT || 7001);
app.listen(port, () => {
    console.log(`OpsMind Backend running on port ${port}`);
});
