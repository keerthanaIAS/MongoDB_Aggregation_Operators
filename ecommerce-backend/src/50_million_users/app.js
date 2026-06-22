// The Problem: 50 Million Users
// Imagine you have:
// 50 MILLION user documents
// {
//   _id: ObjectId("..."),
//   name: "John Doe",
//   email: "john@example.com",
//   age: 30,
//   city: "New York",
//   country: "USA",
//   isActive: true,
//   lastLogin: ISODate("2024-01-01"),
//   createdAt: ISODate("2020-01-01"),
//   profile: { bio: "...", avatar: "..." },
//   orders: [...],
//   settings: {...}
// }
// Without optimization:
// Finding 1 user = scans 50M documents = minutes
// Counting users = reads 50M documents = minutes
// Simple query = crashes your app

const User;
// 1. Proper Indexes
// =========================================
// Which Indexes to Create:
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: String,
  age: Number,
  city: String,
  country: String,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date
});

// 1. UNIQUE INDEX for login (MOST IMPORTANT!)
UserSchema.index({ email: 1 }, { unique: true });
// Finding user by email: O(log n) = FAST!
// Without this: O(n) = scans ALL 50M users!

// 2. For filtering active users in a city
UserSchema.index({ city: 1, isActive: 1, age: -1 });
// Query: "Find active users in NYC, aged 25-35"
// Uses compound index, only scans relevant documents

// 3. For sorting by login date
UserSchema.index({ lastLogin: -1 });
// Query: "Get users who haven't logged in recently"

// 4. For full-text search
UserSchema.index({ name: 'text' });
// Query: "Find users with name containing 'John'"

// 5. For date range queries
UserSchema.index({ createdAt: 1 });
// Query: "Get users created in last 30 days"

// 6. For counting active users by country
UserSchema.index({ country: 1, isActive: 1 });
// Query: "Count active users in USA"

// Checking Index Usage with explain():
// BAD - No index (COLLSCAN)
const result = await User.find({ email: "john@example.com" })
  .explain('executionStats');
// totalDocsExamined: 50,000,000
// executionTimeMillis: 3500

// GOOD - With index (IXSCAN)
const result2 = await User.find({ email: "john@example.com" })
  .explain('executionStats');
// totalDocsExamined: 1
// executionTimeMillis: 2


// 2. Pagination
// ====================================
// NEVER load all 50M users at once!

// Bad Practice (NEVER DO THIS):
// This will CRASH your server!
const allUsers = await User.find(); // Loads 50M users into memory
// Memory error: Out of memory!

// Good Practice - Offset Pagination:
// GET /users?page=1&limit=50
async function getUsers(page = 1, limit = 50) {
  const skip = (page - 1) * limit;
  
  const users = await User.find({ isActive: true })
    .select('name email age city')  // Projection (explained next)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean(); // Faster, returns plain objects
  
  const total = await User.countDocuments({ isActive: true });
  
  return {
    data: users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}
// Result: Only 50 users loaded at a time

// Better - Cursor-Based Pagination (For Large Data):
// GET /users?cursor=ObjectId&limit=50
async function getUsers(cursor = null, limit = 50) {
  const query = { isActive: true };
  
  if (cursor) {
    query._id = { $gt: ObjectId(cursor) };
  }
  
  const users = await User.find(query)
    .select('name email age city')
    .sort({ _id: 1 })
    .limit(limit)
    .lean();
  
  const nextCursor = users.length === limit ? users[users.length - 1]._id : null;
  
  return {
    data: users,
    nextCursor,
    hasMore: users.length === limit
  };
}
// Better for 50M users! No skip() performance issue

// Keyset Pagination (Best for 50M):
// GET /users?lastLogin=2024-01-01&lastId=ObjectId
async function getUsers(lastLogin = null, lastId = null, limit = 50) {
  const query = { isActive: true };
  
  if (lastLogin && lastId) {
    query.$or = [
      { lastLogin: { $lt: lastLogin } },
      { lastLogin: lastLogin, _id: { $gt: lastId } }
    ];
  }
  
  const users = await User.find(query)
    .select('name email age city lastLogin')
    .sort({ lastLogin: -1, _id: 1 })
    .limit(limit)
    .lean();
  
  const nextLastLogin = users.length ? users[users.length - 1].lastLogin : null;
  const nextLastId = users.length ? users[users.length - 1]._id : null;
  
  return {
    data: users,
    nextLastLogin,
    nextLastId,
    hasMore: users.length === limit
  };
}
// BEST for 50M users! Uses indexes for sorting


// 3. Projection (SELECT Only What You Need)
// ===============================================
// NEVER SELECT ALL FIELDS for 50M users!

// Bad Practice:
// Returns ALL fields (huge documents)
const user = await User.findById(id);
// Returns: _id, name, email, age, city, country, isActive, 
// lastLogin, createdAt, profile, orders, settings... (EVERYTHING)

// Good Practice:
// Only get what you need
const user = await User.findById(id)
  .select('name email age city'); // Only these 4 fields

// Use projection in query
const users = await User.find({ isActive: true })
  .select({
    name: 1,
    email: 1,
    age: 1,
    city: 1,
    _id: 0 // Exclude _id if not needed
  });

// Exclude large fields
const users2 = await User.find({ isActive: true })
  .select('-profile -orders -settings'); // Exclude large fields

// Example Response Size:
// Without projection: 
// Document size = 5KB
// 50 users = 250KB
// 50M users = 250GB

// With projection: 
// Document size = 0.5KB
// 50 users = 25KB
// 50M users = 25GB


// 4. Aggregation Optimization
// =================================================
// Bad Aggregation:
// Processes ALL 50M users
const result = await User.aggregate([
  { $group: { _id: "$city", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);
// Scans 50M documents! SLOW!

// Good Aggregation with Indexes:
// Use indexes and stage ordering
const result = await User.aggregate([
  // 1. FILTER FIRST (use index!)
  { $match: { 
    isActive: true,
    country: "USA",
    age: { $gte: 18, $lte: 65 }
  }},
  // 2. Then group (now on filtered set)
  { $group: { 
    _id: "$city", 
    count: { $sum: 1 },
    avgAge: { $avg: "$age" }
  }},
  { $sort: { count: -1 } },
  { $limit: 10 } // Only top 10 cities
]);
// Indexes used: { country: 1, isActive: 1, age: 1 }
// Only scans matching documents, not all 50M

// Using $match Early (IMPORTANT!):
javascript
// GOOD: $match first
const goodAgg = await User.aggregate([
  { $match: { isActive: true } }, // Filter first
  { $project: { name: 1, age: 1 } },
  { $group: { _id: "$age", count: { $sum: 1 } } }
]);
// Scans only active users

// BAD: $match after expensive operation
const badAgg = await User.aggregate([
  { $project: { name: 1, age: 1 } }, // Processes ALL 50M!
  { $match: { isActive: true } },
  { $group: { _id: "$age", count: { $sum: 1 } } }
]);
// Scans ALL 50M users! SLOW!

// Using allowDiskUse for Large Aggregations:
javascript
const result = await User.aggregate([
  { $match: { isActive: true } },
  { $group: { _id: "$city", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
], { allowDiskUse: true }); // Allows using disk if memory is full


// 5. Sharding (For Very Large Data)
// =========================================
// When to Shard: When a single server can't handle:
// Data size > 1TB
// Writes > 1000/sec
// Reads > 5000/sec

// Setting Up Sharding:
// ========== Step 1: Enable Sharding ==========
// In MongoDB shell
sh.enableSharding("myDB");

// ========== Step 2: Choose Shard Key ==========
// BAD Shard Key (doesn't distribute well)
sh.shardCollection("myDB.users", { "isActive": 1 });
// Problem: Only 2 values (true/false) → uneven distribution

// GOOD Shard Key (distributes evenly)
sh.shardCollection("myDB.users", { "userId": 1 });
// Good: Unique values → even distribution

// BETTER Shard Key (for queries)
sh.shardCollection("myDB.users", { "country": 1, "userId": 1 });
// Good: Common query on country, then distributes by userId

// ========== Step 3: Hashed Sharding ==========
sh.shardCollection("myDB.users", { "_id": "hashed" });
// Best for even distribution! 
// Automatically distributes data across shards

// Sharding Architecture:
// Application (Node.js)
//         |
//         ↓
// MongoDB Router (mongos)
//         |
//         ↓
//   ┌─────┼─────┬─────┐
//   ↓     ↓     ↓     ↓
// Shard1 Shard2 Shard3 Shard4
// (12.5M) (12.5M) (12.5M) (12.5M)

// Query Routing with Sharding:
// Query includes shard key → Goes to ONE shard (FAST!)
await User.find({ userId: 12345 });
// Router: "userId 12345 is on Shard 2"
// → Only queries Shard 2 → FAST!

// Query doesn't include shard key → Goes to ALL shards (SLOW!)
await User.find({ name: "John" });
// Router: "I don't know which shard"
// → Queries ALL shards → SLOW! (but necessary)

// Choosing Shard Key Strategy:
// ========== Scenario 1: Users by Country ==========
// Query pattern: "Find users in USA"
sh.shardCollection("myDB.users", { "country": 1, "email": 1 });
// Good: Common queries use country

// ========== Scenario 2: Time-based Data ==========
// Query pattern: "Get users from last month"
sh.shardCollection("myDB.users", { "createdAt": 1 });
// Good: New data goes to new shards

// ========== Scenario 3: Even Distribution ==========
// Query pattern: "Get user by ID"
sh.shardCollection("myDB.users", { "_id": "hashed" });
// Best for even distribution, but range queries are slow


// 6. Replica Set for Availability
// ==============================================
// Replica Set = Multiple copies of your data for redundancy.

// Structure:
// Primary (Master)
//     |
//     ├── Secondary 1 (Slave)
//     ├── Secondary 2 (Slave)
//     └── Secondary 3 (Slave)

// Setting Up Replica Set:
// ========== MongoDB Configuration ==========
// mongod.conf
replication:
  replSetName: "rs0"

// ========== Initialize Replica Set ==========
// In MongoDB shell on Primary
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "server1:27017" },  // Primary
    { _id: 1, host: "server2:27017" },  // Secondary
    { _id: 2, host: "server3:27017" }   // Secondary
  ]
});

// ========== In Mongoose Connection ==========
mongoose.connect(
  'mongodb://server1:27017,server2:27017,server3:27017/myDB?replicaSet=rs0',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    readPreference: 'secondaryPreferred' // Reads from secondary if available
  }
);

// Read Preferences:
// PRIMARY: Always read from primary
await User.find().read('primary');
// Most consistent, but primary handles all reads

// SECONDARY: Read from secondary only
await User.find().read('secondary');
// Reduces primary load, but data may be slightly stale

// SECONDARY_PREFERRED: Read from secondary if available
await User.find().read('secondaryPreferred');
// Best for read-heavy apps (50M users!)

// NEAREST: Read from closest server
await User.find().read('nearest');
// Lowest latency
