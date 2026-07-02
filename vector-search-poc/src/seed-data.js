const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://admin:password123@localhost:27017';
const DB_NAME = 'vector_search_demo';
const COLLECTION_NAME = 'documents';

async function seedDatabase() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Load sample data
    const dataPath = path.join(__dirname, '../data/sample-data.json');
    const documents = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // Clear existing data
    await collection.deleteMany({});
    console.log('🧹 Cleared existing documents');

    // Insert documents
    const result = await collection.insertMany(documents);   // all collections are inserted from the sample JSON
    console.log(`📥 Inserted ${result.insertedCount} documents`);

    // Create vector index
    console.log('⚡ Creating vector index...');
    await createVectorIndex(db);

    console.log('🎉 Database seeded successfully!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

async function createVectorIndex(db) {
  const collection = db.collection(COLLECTION_NAME);

  try {
    // Define vector index
    const indexDefinition = {
      name: 'vector_index',
      type: 'vectorSearch',
      definition: {
        fields: [
          {
            type: 'vector',
            path: 'embedding',
            numDimensions: 128,
            similarity: 'cosine'
          },
          // Add a filter field for category and create index for it
          {
            type: "filter",
            path: "category"
          }
        ]
      }
    };

    // Create index
    await collection.createSearchIndex(indexDefinition);
    console.log('✅ Vector index created successfully');

  } catch (error) {
    if (error.code === 67) { // NamespaceExists
      console.log('⚠️ Index already exists');
    } else {
      throw error;
    }
  }
}

// Run seeding
seedDatabase();