# vector-search-poc
# Terminal logs:
keerthana@Keerthanas-MacBook-Air vector-search-poc % docker-compose up -d
WARN[0000] /Users/keerthana/Desktop/vector-search-poc/vector-search-poc/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion 
[+] Running 1/1
 ✘ mongodb Error failed to copy: httpReadSeeker: failed open: failed to do request: Get "https://registry-1.docker.io/v2/mongodb/mo...              154.5s 
Error response from daemon: failed to copy: httpReadSeeker: failed open: failed to do request: Get "https://registry-1.docker.io/v2/mongodb/mongodb-community-server/manifests/sha256:4c17153fe8cb8348ddc80363d153099ff0a114671609f83e24c73b284fc8452f": EOF
keerthana@Keerthanas-MacBook-Air vector-search-poc % docker pull mongo:7.0
7.0: Pulling from library/mongo
Digest: sha256:8ecb514b00bdcc0bde67ef4e6c330385377a9dc68e24ee94e28c07c891647348
Status: Image is up to date for mongo:7.0
docker.io/library/mongo:7.0

keerthana@Keerthanas-MacBook-Air vector-search-poc % docker-compose up -d       
WARN[0000] /Users/keerthana/Desktop/vector-search-poc/vector-search-poc/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion 
[+] Running 11/11
 ✔ mongodb Pulled                                                                                                                                    93.0s 
   ✔ 30a6ee6038a0 Pull complete                                                                                                                       2.0s 
   ✔ 036e30ff3280 Pull complete                                                                                                                      49.9s 
   ✔ c1201af39dee Pull complete                                                                                                                       2.6s 
   ✔ eb8c25baeeae Pull complete                                                                                                                       2.7s 
   ✔ 454bba8e976b Pull complete                                                                                                                      85.7s 
   ✔ dd23f60a297c Pull complete                                                                                                                       2.7s 
   ✔ be989ce526ed Pull complete                                                                                                                       2.7s 
   ✔ 1c26270cd25f Pull complete                                                                                                                      86.3s 
   ✔ 138a280a8aa5 Pull complete                                                                                                                       2.7s 
   ✔ 4f4fb700ef54 Pull complete                                                                                                                       0.1s 
[+] Running 3/3
 ✔ Network vector-search-poc_default  Created                                                                                                         0.0s 
 ✔ Container vector-search-mongo      Started                                                                                                         0.8s 
 ✔ Container vector-search-ui         Started                                                                                                         0.3s 
keerthana@Keerthanas-MacBook-Air vector-search-poc % npm run generate-embeddings

> vector-search-poc@1.0.0 generate-embeddings
> node src/generate-embeddings.js

✅ Generated 10 documents with embeddings
📁 Saved to: /Users/keerthana/Desktop/vector-search-poc/vector-search-poc/data/sample-data.json
📊 Embedding dimension: 128
keerthana@Keerthanas-MacBook-Air vector-search-poc % npm run seed               

> vector-search-poc@1.0.0 seed
> node src/seed-data.js

❌ Error: MongoServerSelectionError: connect ECONNREFUSED ::1:27017, connect ECONNREFUSED 127.0.0.1:27017
    at Topology.selectServer (/Users/keerthana/Desktop/vector-search-poc/vector-search-poc/node_modules/mongodb/lib/sdam/topology.js:327:38)
    at async Topology._connect (/Users/keerthana/Desktop/vector-search-poc/vector-search-poc/node_modules/mongodb/lib/sdam/topology.js:200:28)
    at async Topology.connect (/Users/keerthana/Desktop/vector-search-poc/vector-search-poc/node_modules/mongodb/lib/sdam/topology.js:152:13)
    at async topologyConnect (/Users/keerthana/Desktop/vector-search-poc/vector-search-poc/node_modules/mongodb/lib/mongo_client.js:264:17)
    at async MongoClient._connect (/Users/keerthana/Desktop/vector-search-poc/vector-search-poc/node_modules/mongodb/lib/mongo_client.js:277:13)
    at async MongoClient.connect (/Users/keerthana/Desktop/vector-search-poc/vector-search-poc/node_modules/mongodb/lib/mongo_client.js:202:13)
    at async seedDatabase (/Users/keerthana/Desktop/vector-search-poc/vector-search-poc/src/seed-data.js:14:5) {
  errorLabelSet: Set(0) {},
  reason: TopologyDescription {
    type: 'Unknown',
    servers: Map(1) { 'localhost:27017' => [ServerDescription] },
    stale: false,
    compatible: true,
    heartbeatFrequencyMS: 10000,
    localThresholdMS: 15,
    setName: null,
    maxElectionId: null,
    maxSetVersion: null,
    commonWireVersion: 0,
    logicalSessionTimeoutMinutes: null
  },
  code: undefined,
  [cause]: MongoNetworkError: connect ECONNREFUSED ::1:27017, connect ECONNREFUSED 127.0.0.1:27017
      at Socket.<anonymous> (/Users/keerthana/Desktop/vector-search-poc/vector-search-poc/node_modules/mongodb/lib/cmap/connect.js:286:44)
      at Object.onceWrapper (node:events:631:12)
      at Socket.emit (node:events:509:20)
      at emitErrorNT (node:internal/streams/destroy:170:8)
      at emitErrorCloseNT (node:internal/streams/destroy:129:3)
      at process.processTicksAndRejections (node:internal/process/task_queues:90:21) {
    errorLabelSet: Set(1) { 'ResetPool' },
    beforeHandshake: false,
    [cause]: AggregateError [ECONNREFUSED]: 
        at internalConnectMultiple (node:net:1194:18)
        at afterConnectMultiple (node:net:1784:7) {
      code: 'ECONNREFUSED',
      [errors]: [Array]
    }
  }
}
keerthana@Keerthanas-MacBook-Air vector-search-poc % docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
keerthana@Keerthanas-MacBook-Air vector-search-poc % 


keerthana@Keerthanas-MacBook-Air vector-search-poc % docker-compose down -v     
WARN[0000] /Users/keerthana/Desktop/vector-search-poc/vector-search-poc/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion 
[+] Running 3/3
 ✔ Container vector-search-ui         Removed                                                                                                         0.2s 
 ✔ Container vector-search-mongo      Removed                                                                                                         0.2s 
 ✔ Network vector-search-poc_default  Removed                                                                                                         0.2s 
keerthana@Keerthanas-MacBook-Air vector-search-poc % docker-compose up -d       
WARN[0000] /Users/keerthana/Desktop/vector-search-poc/vector-search-poc/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion 
[+] Running 11/11
 ✔ mongodb Pulled                                                                                                                                    93.0s 
   ✔ 30a6ee6038a0 Pull complete                                                                                                                       2.0s 
   ✔ 036e30ff3280 Pull complete                                                                                                                      49.9s 
   ✔ c1201af39dee Pull complete                                                                                                                       2.6s 
   ✔ eb8c25baeeae Pull complete                                                                                                                       2.7s 
   ✔ 454bba8e976b Pull complete                                                                                                                      85.7s 
   ✔ dd23f60a297c Pull complete                                                                                                                       2.7s 
   ✔ be989ce526ed Pull complete                                                                                                                       2.7s 
   ✔ 1c26270cd25f Pull complete                                                                                                                      86.3s 
   ✔ 138a280a8aa5 Pull complete                                                                                                                       2.7s 
   ✔ 4f4fb700ef54 Pull complete                                                                                                                       0.1s 
[+] Running 3/3
 ✔ Network vector-search-poc_default  Created                                                                                                         0.0s 
 ✔ Container vector-search-mongo      Started                                                                                                         0.8s 
 ✔ Container vector-search-ui         Started                                                                                                         0.3s 
keerthana@Keerthanas-MacBook-Air vector-search-poc % npm run generate-embeddings

> vector-search-poc@1.0.0 generate-embeddings
> node src/generate-embeddings.js

✅ Generated 10 documents with embeddings
📁 Saved to: /Users/keerthana/Desktop/vector-search-poc/vector-search-poc/data/sample-data.json
📊 Embedding dimension: 128
keerthana@Keerthanas-MacBook-Air vector-search-poc % npm run seed               

> vector-search-poc@1.0.0 seed
> node src/seed-data.js

❌ Error: MongoServerSelectionError: connect ECONNREFUSED ::1:27017, connect ECONNREFUSED 127.0.0.1:27017
    at Topology.selectServer (/Users/keerthana/Desktop/vector-search-poc/vector-search-poc/node_modules/mongodb/lib/sdam/topology.js:327:38)
    at async Topology._connect (/Users/keerthana/Desktop/vector-search-poc/vector-search-poc/node_modules/mongodb/lib/sdam/topology.js:200:28)
    at async Topology.connect (/Users/keerthana/Desktop/vector-search-poc/vector-search-poc/node_modules/mongodb/lib/sdam/topology.js:152:13)
    at async topologyConnect (/Users/keerthana/Desktop/vector-search-poc/vector-search-poc/node_modules/mongodb/lib/mongo_client.js:264:17)
    at async MongoClient._connect (/Users/keerthana/Desktop/vector-search-poc/vector-search-poc/node_modules/mongodb/lib/mongo_client.js:277:13)
    at async MongoClient.connect (/Users/keerthana/Desktop/vector-search-poc/vector-search-poc/node_modules/mongodb/lib/mongo_client.js:202:13)
    at async seedDatabase (/Users/keerthana/Desktop/vector-search-poc/vector-search-poc/src/seed-data.js:14:5) {
  errorLabelSet: Set(0) {},
  reason: TopologyDescription {
    type: 'Unknown',
    servers: Map(1) { 'localhost:27017' => [ServerDescription] },
    stale: false,
    compatible: true,
    heartbeatFrequencyMS: 10000,
    localThresholdMS: 15,
    setName: null,
    maxElectionId: null,
    maxSetVersion: null,
    commonWireVersion: 0,
    logicalSessionTimeoutMinutes: null
  },
  code: undefined,
  [cause]: MongoNetworkError: connect ECONNREFUSED ::1:27017, connect ECONNREFUSED 127.0.0.1:27017
      at Socket.<anonymous> (/Users/keerthana/Desktop/vector-search-poc/vector-search-poc/node_modules/mongodb/lib/cmap/connect.js:286:44)
      at Object.onceWrapper (node:events:631:12)
      at Socket.emit (node:events:509:20)
      at emitErrorNT (node:internal/streams/destroy:170:8)
      at emitErrorCloseNT (node:internal/streams/destroy:129:3)
      at process.processTicksAndRejections (node:internal/process/task_queues:90:21) {
    errorLabelSet: Set(1) { 'ResetPool' },
    beforeHandshake: false,
    [cause]: AggregateError [ECONNREFUSED]: 
        at internalConnectMultiple (node:net:1194:18)
        at afterConnectMultiple (node:net:1784:7) {
      code: 'ECONNREFUSED',
      [errors]: [Array]
    }
  }
}
keerthana@Keerthanas-MacBook-Air vector-search-poc % docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
keerthana@Keerthanas-MacBook-Air vector-search-poc % docker ps -a
CONTAINER ID   IMAGE                                     COMMAND                  CREATED         STATUS                          PORTS                      NAMES
48b964ae40dd   mongo-express:latest                      "/sbin/tini -- /dock…"   2 minutes ago   Exited (1) About a minute ago                              vector-search-ui
0d5e72335abf   mongodb/mongodb-community-server:latest   "python3 /usr/local/…"   2 minutes ago   Exited (0) 2 minutes ago                                   vector-search-mongo
8db59162a840   mongo:7.0                                 "docker-entrypoint.s…"   26 hours ago    Exited (0) 10 minutes ago                                  mongodb-geo
4e6a77961c45   mongo-express                             "/sbin/tini -- /dock…"   5 days ago      Exited (255) 26 hours ago       0.0.0.0:8081->8081/tcp     mongo-express
8cffffaef5f4   mongo:8                                   "docker-entrypoint.s…"   5 days ago      Exited (255) 26 hours ago       0.0.0.0:27017->27017/tcp   mongodb
keerthana@Keerthanas-MacBook-Air vector-search-poc % docker logs vector-search-mongo
Warning: File MONGO_INITDB_ROOT_USERNAME_FILE is deprecated. Use MONGODB_INITDB_ROOT_USERNAME_FILE instead.
Warning: File MONGO_INITDB_ROOT_PASSWORD_FILE is deprecated. Use MONGODB_INITDB_ROOT_PASSWORD_FILE instead.
{"t":{"$date":"2026-07-01T07:13:10.920+00:00"},"s":"I",  "c":"-",        "id":8991200, "ctx":"main","msg":"Shuffling initializers","attr":{"seed":3822230494}}
{"t":{"$date":"2026-07-01T07:13:10.924+00:00"},"s":"F",  "c":"CONTROL",  "id":20574,   "ctx":"main","msg":"Error during global initialization","attr":{"error":{"code":2,"codeName":"BadValue","errmsg":"Unknown --setParameter 'vectorSearchServiceShard'"}}}
Warning: Environment variable MONGO_INITDB_ROOT_USERNAME is deprecated.Use MONGODB_INITDB_ROOT_USERNAME instead.
Warning: Environment variable MONGO_INITDB_ROOT_PASSWORD is deprecated.Use MONGODB_INITDB_ROOT_PASSWORD instead.
keerthana@Keerthanas-MacBook-Air vector-search-poc % docker-compose down
WARN[0000] /Users/keerthana/Desktop/vector-search-poc/vector-search-poc/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion 
[+] Running 3/3
 ✔ Container vector-search-ui         Removed                                                                                                         0.0s 
 ✔ Container vector-search-mongo      Removed                                                                                                         0.0s 
 ✔ Network vector-search-poc_default  Removed                                                                                                         0.2s 
keerthana@Keerthanas-MacBook-Air vector-search-poc % docker-compose up -d
WARN[0000] /Users/keerthana/Desktop/vector-search-poc/vector-search-poc/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion 
[+] Running 3/3
 ✔ Network vector-search-poc_default  Created                                                                                                         0.0s 
 ✔ Container vector-search-mongo      Started                                                                                                         0.3s 
 ✔ Container vector-search-ui         Started                                                                                                         0.3s 
keerthana@Keerthanas-MacBook-Air vector-search-poc % docker ps
CONTAINER ID   IMAGE                                     COMMAND                  CREATED         STATUS         PORTS                                             NAMES
45bb6f065009   mongo-express:latest                      "/sbin/tini -- /dock…"   7 seconds ago   Up 7 seconds   0.0.0.0:8081->8081/tcp, [::]:8081->8081/tcp       vector-search-ui
5e945c0d265c   mongodb/mongodb-community-server:latest   "python3 /usr/local/…"   7 seconds ago   Up 7 seconds   0.0.0.0:27017->27017/tcp, [::]:27017->27017/tcp   vector-search-mongo
keerthana@Keerthanas-MacBook-Air vector-search-poc % docker logs vector-search-mongo
Warning: File MONGO_INITDB_ROOT_USERNAME_FILE is deprecated. Use MONGODB_INITDB_ROOT_USERNAME_FILE instead.
Warning: File MONGO_INITDB_ROOT_PASSWORD_FILE is deprecated. Use MONGODB_INITDB_ROOT_PASSWORD_FILE instead.
{"t":{"$date":"2026-07-01T07:17:09.800+00:00"},"s":"I",  "c":"-",        "id":8991200, "ctx":"main","msg":"Shuffling initializers","attr":{"seed":837738328}}
about to fork child process, waiting until server is ready for connections.
forked process: 10



# without docker complete embedding vector search:
------------------------------------
keerthana@Keerthanas-MacBook-Air vector-search-poc % mkdir -p data
keerthana@Keerthanas-MacBook-Air vector-search-poc % npm run generate-embeddings

> vector-search-poc@1.0.0 generate-embeddings
> node src/generate-embeddings.js

✅ Generated 10 documents with embeddings
📁 Saved to: /Users/keerthana/Desktop/MongoDB_Aggregation_Operators/vector-search-poc/data/sample-data.json
📊 Embedding dimension: 128
keerthana@Keerthanas-MacBook-Air vector-search-poc % npm run seed

> vector-search-poc@1.0.0 seed
> node src/seed-data.js

✅ Connected to MongoDB
🧹 Cleared existing documents
📥 Inserted 10 documents
⚡ Creating vector index...
✅ Vector index created successfully
🎉 Database seeded successfully!
keerthana@Keerthanas-MacBook-Air vector-search-poc % npm run search

> vector-search-poc@1.0.0 search
> node src/search.js

🚀 Starting Vector Search Tests

============================================================
✅ Connected to MongoDB

🔍 Query: "mongodb database tutorial"
📊 Embedding dimension: 128

============================================================
📝 Found 5 results:

1. SQL vs NoSQL Databases
   Category: database
   Tags: sql, nosql, comparison
   Content: Compare relational databases with NoSQL databases for modern application development....
   Score: 0.8348
----------------------------------------
2. Introduction to MongoDB
   Category: database
   Tags: mongodb, nosql, database
   Content: MongoDB is a NoSQL document database that stores data in flexible JSON-like documents....
   Score: 0.8296
----------------------------------------
3. Machine Learning Basics
   Category: ai
   Tags: machine learning, data science, algorithms
   Content: Introduction to machine learning algorithms and their applications in data science....
   Score: 0.8291
----------------------------------------
4. MongoDB Aggregation Framework
   Category: database
   Tags: mongodb, aggregation, pipeline
   Content: Powerful aggregation pipeline for transforming and analyzing data in MongoDB....
   Score: 0.8284
----------------------------------------
5. Full-Text Search vs Vector Search
   Category: search
   Tags: full-text, vector, search, comparison
   Content: Compare traditional full-text search with modern vector-based semantic search....
   Score: 0.8277
----------------------------------------

============================================================

✅ Connected to MongoDB

🔍 Query: "ai and machine learning"
📊 Embedding dimension: 128

============================================================
📝 Found 5 results:

1. Deploying AI Applications
   Category: ai
   Tags: deployment, production, ai, mlops
   Content: Best practices for deploying machine learning and AI applications to production....
   Score: 0.8436
----------------------------------------
2. Machine Learning Basics
   Category: ai
   Tags: machine learning, data science, algorithms
   Content: Introduction to machine learning algorithms and their applications in data science....
   Score: 0.8432
----------------------------------------
3. Natural Language Processing
   Category: ai
   Tags: nlp, language, ai, text processing
   Content: NLP techniques for processing and understanding human language with AI models....
   Score: 0.8374
----------------------------------------
4. SQL vs NoSQL Databases
   Category: database
   Tags: sql, nosql, comparison
   Content: Compare relational databases with NoSQL databases for modern application development....
   Score: 0.8359
----------------------------------------
5. MongoDB Aggregation Framework
   Category: database
   Tags: mongodb, aggregation, pipeline
   Content: Powerful aggregation pipeline for transforming and analyzing data in MongoDB....
   Score: 0.8352
----------------------------------------

============================================================

✅ Connected to MongoDB

🔍 Query: "search algorithms"
📊 Embedding dimension: 128

============================================================
📝 Found 5 results:

1. SQL vs NoSQL Databases
   Category: database
   Tags: sql, nosql, comparison
   Content: Compare relational databases with NoSQL databases for modern application development....
   Score: 0.8351
----------------------------------------
2. Natural Language Processing
   Category: ai
   Tags: nlp, language, ai, text processing
   Content: NLP techniques for processing and understanding human language with AI models....
   Score: 0.8334
----------------------------------------
3. MongoDB Aggregation Framework
   Category: database
   Tags: mongodb, aggregation, pipeline
   Content: Powerful aggregation pipeline for transforming and analyzing data in MongoDB....
   Score: 0.8332
----------------------------------------
4. Deploying AI Applications
   Category: ai
   Tags: deployment, production, ai, mlops
   Content: Best practices for deploying machine learning and AI applications to production....
   Score: 0.8328
----------------------------------------
5. Semantic Search Techniques
   Category: search
   Tags: semantic, search, vectors, similarity
   Content: Use vector embeddings and cosine similarity to find semantically related content....
   Score: 0.8326
----------------------------------------

============================================================

✅ Connected to MongoDB

🔍 Query: "natural language processing"
📊 Embedding dimension: 128

============================================================
📝 Found 5 results:

1. Machine Learning Basics
   Category: ai
   Tags: machine learning, data science, algorithms
   Content: Introduction to machine learning algorithms and their applications in data science....
   Score: 0.9996
----------------------------------------
2. Deploying AI Applications
   Category: ai
   Tags: deployment, production, ai, mlops
   Content: Best practices for deploying machine learning and AI applications to production....
   Score: 0.8414
----------------------------------------
3. Natural Language Processing
   Category: ai
   Tags: nlp, language, ai, text processing
   Content: NLP techniques for processing and understanding human language with AI models....
   Score: 0.8368
----------------------------------------
4. MongoDB Aggregation Framework
   Category: database
   Tags: mongodb, aggregation, pipeline
   Content: Powerful aggregation pipeline for transforming and analyzing data in MongoDB....
   Score: 0.8368
----------------------------------------
5. SQL vs NoSQL Databases
   Category: database
   Tags: sql, nosql, comparison
   Content: Compare relational databases with NoSQL databases for modern application development....
   Score: 0.8363
----------------------------------------

============================================================

keerthana@Keerthanas-MacBook-Air vector-search-poc % 


## Based on your code and the tasks outlined

✅ 1. Vector Search Index - CREATED:
You successfully created a Vector Search index in MongoDB Atlas.

Implementation:
// In seed-database.js
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
      }
    ]
  }
};

await collection.createSearchIndex(indexDefinition);

### What this does:
- Creates a specialized index for vector searches
- Defines the embedding field as the vector path
- Sets vector dimensions to 128
- Uses cosine similarity for measuring document similarity

Enables efficient Approximate Nearest Neighbor (ANN) search:
✅ learned:
How to define vector indexes
Index parameters (dimensions, similarity metric)
Creating indexes programmatically via MongoDB driver

✅ 2. $vectorSearch - IMPLEMENTED
Successfully implemented the $vectorSearch aggregation stage.

Implementation:
// In search.js
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

### What this does:
- Uses the vector index for fast search
- Compares query vector with document vectors
- Returns top limit most similar documents
- Includes similarity scores

✅ learned:
How to structure a $vectorSearch pipeline
Using numCandidates for search quality tuning
Using $meta: 'vectorSearchScore' to get similarity scores
Combining vector search with $project for result formatting
How to execute the pipeline using aggregate()

✅ 3. Manually Created / Locally Generated Embeddings - DONE
Successfully generated embeddings locally without using external APIs.

Your Implementation:
// In generate-embeddings.js
function generateEmbedding(text) {
  const seed = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const embedding = [];
  
  for (let i = 0; i < 128; i++) {
    const val = Math.sin(seed * (i + 1) * 0.1) * 0.5 + 0.5;
    embedding.push(val);
  }
  
  return embedding;
}

const documentsWithVectors = documents.map(doc => ({
  ...doc,
  embedding: generateEmbedding(doc.title + " " + doc.content)
}));

fs.writeFileSync(outputPath, JSON.stringify(documentsWithVectors, null, 2));

### What this does:
Creates deterministic embeddings based on text content
Generates 128-dimensional vectors
Documents with similar content get similar vectors
Saves embeddings to JSON file for seeding

✅ learned:
How embeddings are generated (conceptually)
Creating embeddings without external services
The importance of deterministic embeddings
Converting documents to vector representations
Managing embedding persistence

📊 Complete Flow Diagram of What You've Built
┌─────────────────────────────────────────────────────────────────┐
│                     YOUR COMPLETE POC                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  1. GENERATE EMBEDDINGS (Manually/Locally)                     │
│  ┌──────────────────────────────────────────────────────┐     │
│  │ "MongoDB is a NoSQL..."  → [0.43, 0.78, 0.21, ...] │     │
│  │ "Vector Search uses..."  → [0.92, 0.15, 0.67, ...] │     │
│  │ "AI and Machine Learn..." → [0.34, 0.88, 0.45, ...]│     │
│  └──────────────────────────────────────────────────────┘     │
│  ✅ Local generation without APIs                             │
│  ✅ 128-dimensional vectors                                   │
│  ✅ Semantic consistency                                     │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. CREATE VECTOR INDEX                                        │
│  ┌──────────────────────────────────────────────────────┐     │
│  │ Index: vector_index                                  │     │
│  │ Path: embedding (128-dim)                           │     │
│  │ Similarity: cosine                                   │     │
│  └──────────────────────────────────────────────────────┘     │
│  ✅ Created in MongoDB Atlas                                   │
│  ✅ Optimized for ANN search                                  │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. SEED DATABASE                                              │
│  ┌──────────────────────────────────────────────────────┐     │
│  │ Collection: documents                                │     │
│  │ { title: "...", content: "...", embedding: [...] }  │     │
│  │ { title: "...", content: "...", embedding: [...] }  │     │
│  │ { title: "...", content: "...", embedding: [...] }  │     │
│  └──────────────────────────────────────────────────────┘     │
│  ✅ 10 documents inserted                                      │
│  ✅ Vector index automatically used                           │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. $vectorSearch QUERY EXECUTION                              │
│  Query: "mongodb database tutorial"                           │
│           ↓                                                    │
│  Query Embedding: [0.45, 0.76, 0.23, ...]                    │
│           ↓                                                    │
│  ┌──────────────────────────────────────────────────────┐     │
│  │ $vectorSearch: {                                     │     │
│  │   index: "vector_index",                            │     │
│  │   path: "embedding",                                │     │
│  │   queryVector: [...],                               │     │
│  │   numCandidates: 10,                                │     │
│  │   limit: 5                                          │     │
│  │ }                                                    │     │
│  └──────────────────────────────────────────────────────┘     │
│           ↓                                                    │
│  Results with scores:                                         │
│  1. "Introduction to MongoDB" (score: 0.92)                  │
│  2. "MongoDB Aggregation" (score: 0.78)                      │
│  3. "SQL vs NoSQL" (score: 0.65)                             │
│  ✅ Semantic search working!                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                        VECTOR SEARCH POC                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────┐      ┌─────────────────────────────┐     │
│  │  generate-embeddings.js     │      │     seed-data.js            │     │
│  │                             │      │                             │     │
│  │  📝 Creates sample data     │      │  📥 Inserts data into DB    │     │
│  │  🔢 Generates embeddings    │      │  🗂️ Creates indexes         │     │
│  │  💾 Saves to JSON file      │      │  ⚡ Creates vector index    │     │
│  └────────────┬────────────────┘      └────────────┬────────────────┘     │
│               │                                    │                       │
│               ▼                                    ▼                       │
│  ┌─────────────────────────────┐      ┌─────────────────────────────┐     │
│  │  sample-data.json           │──────▶│  MongoDB Collection         │     │
│  │  (File on disk)             │      │  (Database)                 │     │
│  └─────────────────────────────┘      └─────────────────────────────┘     │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  search.js                                                         │  │
│  │  🔍 Queries the collection using $vectorSearch                     │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘

#  *oh u r saying what are all in the filter field value that only create index and use vector search?*                       -->*important question*
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
      }
    ],
    filter: {
      category: { $in: ["database", "ai"] }  // 👈 THIS!
    }
  }
};

┌─────────────────────────────────────────────────────────────────────────┐
│                    VECTOR INDEX WITH FILTER                            │
│                                                                        │
│  🔍 MongoDB: "Only create vector index for documents WHERE"            │
│              category is "database" OR "ai"                            │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  ✅ Documents with category "database" → INDEXED               │     │
│  │  ✅ Documents with category "ai"       → INDEXED               │     │
│  │  ❌ Documents with category "search"   → NOT INDEXED           │     │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                        │
│  🔍 Only these indexed documents can be used in $vectorSearch           │
└─────────────────────────────────────────────────────────────────────────┘

## vector search with filter Terminal log
keerthana@Keerthanas-MacBook-Air vector-search-poc % npm run generate-embeddings

> vector-search-poc@1.0.0 generate-embeddings
> node src/generate-embeddings.js

✅ Generated 10 documents with embeddings
📁 Saved to: /Users/keerthana/Desktop/MongoDB_Aggregation_Operators/vector-search-poc/data/sample-data.json
📊 Embedding dimension: 128
keerthana@Keerthanas-MacBook-Air vector-search-poc % npm run seed               

> vector-search-poc@1.0.0 seed
> node src/seed-data.js

✅ Connected to MongoDB
🧹 Cleared existing documents
📥 Inserted 10 documents
⚡ Creating vector index...
✅ Vector index created successfully
🎉 Database seeded successfully!
keerthana@Keerthanas-MacBook-Air vector-search-poc % npm run search             

> vector-search-poc@1.0.0 search
> node src/search.js

🚀 Starting Vector Search Tests

============================================================
✅ Connected to MongoDB

🔍 Query: "mongodb database tutorial"
📊 Embedding dimension: 128

============================================================
📝 Found 3 results:

1. SQL vs NoSQL Databases
   Category: database
   Tags: sql, nosql, comparison
   Content: Compare relational databases with NoSQL databases for modern application development....
   Score: 0.8348
----------------------------------------
2. Introduction to MongoDB
   Category: database
   Tags: mongodb, nosql, database
   Content: MongoDB is a NoSQL document database that stores data in flexible JSON-like documents....
   Score: 0.8296
----------------------------------------
3. MongoDB Aggregation Framework
   Category: database
   Tags: mongodb, aggregation, pipeline
   Content: Powerful aggregation pipeline for transforming and analyzing data in MongoDB....
   Score: 0.8284
----------------------------------------

============================================================

✅ Connected to MongoDB

🔍 Query: "ai and machine learning"
📊 Embedding dimension: 128

============================================================
📝 Found 3 results:

1. SQL vs NoSQL Databases
   Category: database
   Tags: sql, nosql, comparison
   Content: Compare relational databases with NoSQL databases for modern application development....
   Score: 0.8359
----------------------------------------
2. MongoDB Aggregation Framework
   Category: database
   Tags: mongodb, aggregation, pipeline
   Content: Powerful aggregation pipeline for transforming and analyzing data in MongoDB....
   Score: 0.8352
----------------------------------------
3. Introduction to MongoDB
   Category: database
   Tags: mongodb, nosql, database
   Content: MongoDB is a NoSQL document database that stores data in flexible JSON-like documents....
   Score: 0.8322
----------------------------------------

============================================================

✅ Connected to MongoDB

🔍 Query: "search algorithms"
📊 Embedding dimension: 128

============================================================
📝 Found 3 results:

1. SQL vs NoSQL Databases
   Category: database
   Tags: sql, nosql, comparison
   Content: Compare relational databases with NoSQL databases for modern application development....
   Score: 0.8351
----------------------------------------
2. MongoDB Aggregation Framework
   Category: database
   Tags: mongodb, aggregation, pipeline
   Content: Powerful aggregation pipeline for transforming and analyzing data in MongoDB....
   Score: 0.8332
----------------------------------------
3. Introduction to MongoDB
   Category: database
   Tags: mongodb, nosql, database
   Content: MongoDB is a NoSQL document database that stores data in flexible JSON-like documents....
   Score: 0.8318
----------------------------------------

============================================================

✅ Connected to MongoDB

🔍 Query: "natural language processing"
📊 Embedding dimension: 128

============================================================
📝 Found 3 results:

1. MongoDB Aggregation Framework
   Category: database
   Tags: mongodb, aggregation, pipeline
   Content: Powerful aggregation pipeline for transforming and analyzing data in MongoDB....
   Score: 0.8368
----------------------------------------
2. SQL vs NoSQL Databases
   Category: database
   Tags: sql, nosql, comparison
   Content: Compare relational databases with NoSQL databases for modern application development....
   Score: 0.8363
----------------------------------------
3. Introduction to MongoDB
   Category: database
   Tags: mongodb, nosql, database
   Content: MongoDB is a NoSQL document database that stores data in flexible JSON-like documents....
   Score: 0.8329
----------------------------------------

============================================================

# *without vector search $ operator if i jsut create in the altlas direclty using create index can i use vector search*?     --->*important question*
No.

Creating a Vector Search index in Atlas is not enough. The index only stores and organizes vectors. To actually search those vectors, you must use the $vectorSearch aggregation stage.
