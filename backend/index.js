const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdf = require('pdf-parse');
const { MongoClient, ObjectId, GridFSBucket } = require('mongodb');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(express.json({ limit: '5mb' }));

// CORS: allow frontend dev server and any other origins
const allowedOrigins = (process.env.ALLOWED_ORIGIN || 'http://localhost:5173').split(',').map(s => s.trim());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Be permissive in development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

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
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('MongoDB connected.');
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
    console.log('Gemini AI initialized.');
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ ok: true, status: 'running', timestamp: new Date().toISOString() });
});

// Upload PDF
app.post('/api/admin/upload', upload.single('file'), async (req, res) => {
  try {
    await ensureConn();
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided. Please upload a PDF.' });
    }
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Only PDF files are supported.' });
    }

    console.log(`Uploading: ${req.file.originalname} (${(req.file.size / 1024 / 1024).toFixed(2)} MB)`);

    // Store file in GridFS
    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
      metadata: {},
    });
    uploadStream.end(req.file.buffer);
    const fileId = await new Promise((resolve, reject) => {
      uploadStream.on('finish', () => resolve(uploadStream.id));
      uploadStream.on('error', reject);
    });

    // Parse PDF text
    const data = await pdf(req.file.buffer);
    const text = (data.text || '').replace(/\r/g, '');

    if (!text.trim()) {
      return res.status(400).json({ error: 'Could not extract text from PDF. The file may be image-based or corrupted.' });
    }

    // Save document metadata
    const doc = {
      filename: req.file.originalname,
      fileId,
      size: req.file.size,
      pages: data.numpages || null,
      uploadedAt: new Date(),
    };
    const { insertedId } = await documents.insertOne(doc);

    // Chunk and embed
    const parts = chunkText(text, 1000, 100);
    console.log(`  → ${parts.length} chunks to embed...`);

    for (let i = 0; i < parts.length; i++) {
      const e = await embed(parts[i]);
      await chunks.insertOne({
        docId: insertedId,
        filename: doc.filename,
        chunk: i,
        page: null,
        text: parts[i],
        embedding: e,
      });
    }

    console.log(`  ✓ Done: ${req.file.originalname} — ${parts.length} chunks indexed.`);
    res.json({ ok: true, documentId: insertedId, chunks: parts.length });
  } catch (e) {
    console.error('Upload error:', e);
    if (e.message === 'Only PDF files are allowed') {
      return res.status(400).json({ error: e.message });
    }
    res.status(500).json({ error: 'Upload failed. Please try again.' });
  }
});

// List documents
app.get('/api/admin/docs', async (req, res) => {
  try {
    await ensureConn();
    const list = await documents
      .find({}, { projection: { filename: 1, uploadedAt: 1, pages: 1, size: 1 } })
      .sort({ uploadedAt: -1 })
      .toArray();
    res.json(list);
  } catch (e) {
    console.error('List docs error:', e);
    res.status(500).json({ error: 'Failed to list documents.' });
  }
});

// Delete document
app.delete('/api/admin/docs/:id', async (req, res) => {
  try {
    await ensureConn();
    const id = new ObjectId(req.params.id);
    const doc = await documents.findOne({ _id: id });
    if (!doc) return res.status(404).json({ error: 'Document not found.' });

    // Delete chunks
    const chunkResult = await chunks.deleteMany({ docId: id });
    console.log(`Deleted ${chunkResult.deletedCount} chunks for doc ${req.params.id}`);

    // Delete GridFS file
    if (doc.fileId) {
      try { await bucket.delete(new ObjectId(doc.fileId)); } catch (_) {}
    }

    // Delete document record
    await documents.deleteOne({ _id: id });
    res.json({ ok: true });
  } catch (e) {
    console.error('Delete error:', e);
    res.status(500).json({ error: 'Failed to delete document.' });
  }
});

// Chat sessions
app.get('/api/chat/sessions', async (req, res) => {
  try {
    await ensureConn();
    const list = await sessions.find({}, { projection: { messages: 0 }, sort: { updatedAt: -1 } }).toArray();
    res.json(list);
  } catch (e) {
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
    res.status(500).json({ error: 'save_session_failed' });
  }
});

app.delete('/api/chat/sessions/:id', async (req, res) => {
  try {
    await ensureConn();
    await sessions.deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'delete_session_failed' });
  }
});

// Chat streaming (SSE)
app.get('/api/chat/stream', async (req, res) => {
  try {
    await ensureConn();
    const q = String(req.query.q || '').trim();
    if (!q) return res.status(400).end();

    const qEmb = await embed(q);

    // Try vector search first, fall back to basic text search
    let agg = [];
    try {
      agg = await chunks.aggregate([
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
    } catch (searchErr) {
      console.warn('Vector search failed, falling back to basic query:', searchErr.message);
      // Fallback: fetch most recent chunks
      agg = await chunks.find({}).sort({ _id: -1 }).limit(5).toArray();
      agg = agg.map(c => ({ ...c, score: 0.5 }));
    }

    const context = agg.map((c, i) => `Source ${i + 1} | ${c.filename} | chunk ${c.chunk} | page ${c.page ?? 'n/a'}:\n${c.text}`).join('\n\n');

    const prompt = [
      'You are a corporate SOP assistant. Answer strictly using the provided sources.',
      'Cite your sources inline like [Source k] and include a bullet list of sources at the end.',
      'If the answer is not in the sources, say: "I don\'t have enough information in the uploaded SOPs to answer this question. Please upload relevant documents first."',
      `User question:\n${q}`,
      `Sources:\n${context || 'No documents have been uploaded to the knowledge base yet.'}`
    ].join('\n\n');

    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
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
    } catch (aiError) {
      console.error('AI generation error:', aiError);
      const fallback = 'I encountered an error processing your question. Please try again.';
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
    console.error('Stream error:', e);
    try {
      res.write(`data: ${JSON.stringify({ delta: 'Sorry, an error occurred. Please ensure the backend is configured correctly.' })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (_) {}
  }
});

// Error handling middleware for multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds 50 MB limit.' });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

const port = Number(process.env.PORT || 7001);
app.listen(port, () => {
    console.log(`OpsMind Backend running on port ${port}`);
    console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});
