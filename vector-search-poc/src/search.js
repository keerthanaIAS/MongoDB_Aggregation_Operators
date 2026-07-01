const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://admin:password123@localhost:27017';
const DB_NAME = 'vector_search_demo';
const COLLECTION_NAME = 'documents';

// Simulate query embedding generation (same as document embedding)
function generateEmbedding(text) {
  const seed = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const embedding = [];
  
  for (let i = 0; i < 128; i++) {
    const val = Math.sin(seed * (i + 1) * 0.1) * 0.5 + 0.5;
    embedding.push(val);
  }
  
  return embedding;
}

async function vectorSearch(query, limit = 5) {
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    // Generate query embedding
    const queryEmbedding = generateEmbedding(query);
    
    console.log(`🔍 Query: "${query}"`);
    console.log(`📊 Embedding dimension: ${queryEmbedding.length}\n`);
    console.log('=' .repeat(60));
    
    // Perform vector search using $vectorSearch
    const pipeline = [
      {
        $vectorSearch: {
          index: 'vector_index',
          path: 'embedding',
          queryVector: queryEmbedding,
          numCandidates: 10,
          limit: limit
        }
      },
      {
        $project: {
          title: 1,
          content: 1,
          category: 1,
          tags: 1,
          score: { $meta: 'vectorSearchScore' }
        }
      }
    ];
    
    const results = await collection.aggregate(pipeline).toArray();
    
    if (results.length === 0) {
      console.log('❌ No results found');
      return;
    }
    
    console.log(`📝 Found ${results.length} results:\n`);
    
    results.forEach((doc, index) => {
      console.log(`${index + 1}. ${doc.title}`);
      console.log(`   Category: ${doc.category}`);
      console.log(`   Tags: ${doc.tags.join(', ')}`);
      console.log(`   Content: ${doc.content.substring(0, 100)}...`);
      console.log(`   Score: ${doc.score.toFixed(4)}`);
      console.log('-' .repeat(40));
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

// Test different queries
async function runSearchTests() {
  console.log('🚀 Starting Vector Search Tests\n');
  console.log('=' .repeat(60));
  
  const queries = [
    'mongodb database tutorial',
    'ai and machine learning',
    'search algorithms',
    'natural language processing'
  ];
  
  for (const query of queries) {
    await vectorSearch(query);
    console.log('\n' + '=' .repeat(60) + '\n');
  }
}

// Run tests
if (require.main === module) {
  runSearchTests();
}

module.exports = { vectorSearch, generateEmbedding };