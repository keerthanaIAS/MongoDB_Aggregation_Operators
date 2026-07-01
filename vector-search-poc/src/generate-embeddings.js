const fs = require('fs');
const path = require('path');

// Simulate embedding generation (in real app, use sentence-transformers)
function generateEmbedding(text) {
  // Create a deterministic 128-dim vector based on text
  const seed = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const embedding = [];
  
  for (let i = 0; i < 128; i++) {
    // Generate pseudo-random but deterministic values
    const val = Math.sin(seed * (i + 1) * 0.1) * 0.5 + 0.5;
    embedding.push(val);
  }
  
  return embedding;
}

// Sample documents with semantic relationships
const documents = [
  {
    title: "Introduction to MongoDB",
    content: "MongoDB is a NoSQL document database that stores data in flexible JSON-like documents.",
    category: "database",
    tags: ["mongodb", "nosql", "database"]
  },
  {
    title: "Vector Search in MongoDB",
    content: "MongoDB Atlas Vector Search allows you to perform semantic similarity searches on your data.",
    category: "search",
    tags: ["vector", "search", "ai", "embeddings"]
  },
  {
    title: "Building a Chatbot with AI",
    content: "Create intelligent chatbots using natural language processing and vector embeddings.",
    category: "ai",
    tags: ["chatbot", "nlp", "ai", "embeddings"]
  },
  {
    title: "SQL vs NoSQL Databases",
    content: "Compare relational databases with NoSQL databases for modern application development.",
    category: "database",
    tags: ["sql", "nosql", "comparison"]
  },
  {
    title: "Semantic Search Techniques",
    content: "Use vector embeddings and cosine similarity to find semantically related content.",
    category: "search",
    tags: ["semantic", "search", "vectors", "similarity"]
  },
  {
    title: "Machine Learning Basics",
    content: "Introduction to machine learning algorithms and their applications in data science.",
    category: "ai",
    tags: ["machine learning", "data science", "algorithms"]
  },
  {
    title: "MongoDB Aggregation Framework",
    content: "Powerful aggregation pipeline for transforming and analyzing data in MongoDB.",
    category: "database",
    tags: ["mongodb", "aggregation", "pipeline"]
  },
  {
    title: "Natural Language Processing",
    content: "NLP techniques for processing and understanding human language with AI models.",
    category: "ai",
    tags: ["nlp", "language", "ai", "text processing"]
  },
  {
    title: "Full-Text Search vs Vector Search",
    content: "Compare traditional full-text search with modern vector-based semantic search.",
    category: "search",
    tags: ["full-text", "vector", "search", "comparison"]
  },
  {
    title: "Deploying AI Applications",
    content: "Best practices for deploying machine learning and AI applications to production.",
    category: "ai",
    tags: ["deployment", "production", "ai", "mlops"]
  }
];

// Generate embeddings and save
const documentsWithVectors = documents.map(doc => ({
  ...doc,
  embedding: generateEmbedding(doc.title + " " + doc.content)
}));

// Save to file
const outputPath = path.join(__dirname, '../data/sample-data.json');
fs.writeFileSync(outputPath, JSON.stringify(documentsWithVectors, null, 2));

console.log(`✅ Generated ${documentsWithVectors.length} documents with embeddings`);
console.log(`📁 Saved to: ${outputPath}`);
console.log(`📊 Embedding dimension: ${documentsWithVectors[0].embedding.length}`);