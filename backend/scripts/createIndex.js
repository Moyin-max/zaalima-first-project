const { MongoClient } = require('mongodb');
require('dotenv').config();

async function run() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || 'opsmind');
  const cmd = {
    createSearchIndexes: 'chunks',
    indexes: [
      {
        name: 'rag_index',
        type: 'vectorSearch',
        definition: {
          fields: [
            {
              type: 'vector',
              path: 'embedding',
              numDimensions: 768,
              similarity: 'cosine'
            }
          ]
        }
      }
    ]
  };
  try {
    const r = await db.command(cmd);
    console.log('Index created successfully:', r);
  } catch (e) {
    console.error('Error creating index:', e);
  } finally {
    await client.close();
  }
}
run();
