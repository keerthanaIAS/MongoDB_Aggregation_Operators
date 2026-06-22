const { default: mongoose } = require("mongoose");

// 1. Creating Indexes in Mongoose
// ===============================
// Single Field Index
const SingleUserSchema = new mongoose.Schema({
  name: String,
  email: { 
    type: String, 
    unique: true,  // Automatically creates index
    index: true    // Explicitly create index
  },
  age: Number,
  createdAt: Date
});

// Or create index separately
SingleUserSchema.index({ email: 1 });     // 1 = ascending order
SingleUserSchema.index({ age: -1 });      // -1 = descending order

// Complete Schema with Indexes
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  age: Number,
  city: String,
  createdAt: { type: Date, default: Date.now }
});

// Create indexes
UserSchema.index({ email: 1 });           // Single index
UserSchema.index({ age: 1 });             // Single index
UserSchema.index({ city: 1, age: -1 });   // Compound index
UserSchema.index({ createdAt: -1 });      // For sorting

const User = mongoose.model('User', UserSchema);


// 2. Understanding COLLSCAN vs IXSCAN
// ====================================
// COLLSCAN (Collection Scan) - BAD
// No index on 'age'
db.users.find({ age: { $gt: 25 } })
// explain() shows:
// {
//   "stage": "COLLSCAN",     // ← Scanning entire collection
//   "totalDocsExamined": 1000000,  // Checked ALL documents
//   "totalKeysExamined": 0,
//   "executionTimeMillis": 2500
// }

// IXSCAN (Index Scan) - GOOD
// Create index first
db.users.createIndex({ age: 1 })
// Same query
db.users.find({ age: { $gt: 25 } })
// explain() shows:
// {
//   "stage": "IXSCAN",       // ← Using index!
//   "totalDocsExamined": 50000,   // Only checked matching docs
//   "totalKeysExamined": 50000,
//   "executionTimeMillis": 50
// }


// 3. Using explain() in Mongoose
// ==============================
// Basic explain()
// Find users with explain
const result = await User.find({ age: { $gt: 25 } })
  .explain('executionStats');
console.log(result);
// What explain() Tells You:
// {
//   "queryPlanner": {
//     "winningPlan": {
//       "stage": "COLLSCAN",  // or "IXSCAN"
//       "direction": "forward"
//     }
//   },
//   "executionStats": {
//     "executionSuccess": true,
//     "nReturned": 50000,      // How many documents returned
//     "executionTimeMillis": 2500,  // How long it took
//     "totalKeysExamined": 0,      // Index keys examined
//     "totalDocsExamined": 1000000, // Documents examined
//     "executionStages": {
//       "stage": "COLLSCAN",
//       "nReturned": 50000,
//       "docsExamined": 1000000   // ← This is IMPORTANT!
//     }
//   }
// }

// Comparing Two Queries:
// Query 1: Without index
const result1 = await User.find({ email: "john@example.com" })
  .explain('executionStats');
// totalDocsExamined: 1000000 (SCAN EVERYTHING!)
// executionTimeMillis: 2500

// Create index
await User.createIndex({ email: 1 });
// Query 2: With index
const result2 = await User.find({ email: "john@example.com" })
  .explain('executionStats');
// totalDocsExamined: 1 (ONLY MATCHING DOC!)
// executionTimeMillis: 2


// 4. Compound Indexes
// ======================================
// Compound Index = Index on MULTIPLE fields.

// Example 1: Two-Field Compound Index
// Schema
const UserSchema = new mongoose.Schema({
  name: String,
  city: String,
  age: Number
});
// Create compound index
UserSchema.index({ city: 1, age: -1 });
// 1 = ascending, -1 = descending
// This index helps these queries:
await User.find({ city: "New York" });           // Uses index
await User.find({ city: "New York", age: 25 });  // Uses index
await User.find({ city: "New York" }).sort({ age: -1 }); // Uses index
// This query DOES NOT use the index:
await User.find({ age: 25 });  // Doesn't use index (no city)

// Example 2: Order Matters!
// Index: { city: 1, age: -1, name: 1 }
// Uses full index
await User.find({ city: "NY", age: 30, name: "John" });
// Uses city + age part of index
await User.find({ city: "NY", age: 30 });
// Uses city part of index
await User.find({ city: "NY" });
// Does NOT use index (missing first field)
await User.find({ age: 30 });
// Does NOT use index (missing first field)
await User.find({ name: "John" });
// Uses index partially (only city)
await User.find({ city: "NY", name: "John" });

// Real-World Example:
const ProductSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  inStock: Boolean,
  createdAt: Date
});
// Compound index for common queries
ProductSchema.index({ category: 1, price: -1 });
ProductSchema.index({ category: 1, inStock: 1, price: 1 });
ProductSchema.index({ createdAt: -1 });
// These queries are FAST:
await ProductSchema.find({ category: "Electronics", price: { $lt: 100 } });
await ProductSchema.find({ category: "Books", inStock: true }).sort({ price: 1 });
await ProductSchema.find().sort({ createdAt: -1 }).limit(10);


// 5. Index Properties
// =============================================
// Unique Index:
UserSchema.index({ email: 1 }, { unique: true });
// Prevents duplicate emails

// Trying to save duplicate:
const user1 = new User({ email: "john@email.com" });
await user1.save(); // Success

const user2 = new User({ email: "john@email.com" });
await user2.save(); // Error: Duplicate key

// Sparse Index (Only for documents with the field):
UserSchema.index({ phoneNumber: 1 }, { sparse: true });
// Only indexes documents that have 'phoneNumber'
// Saves space if many documents don't have this field

// TTL Index (Auto-delete after time):
UserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });
// Documents auto-delete after 1 hour (3600 seconds)

// Text Index (For search):
PostSchema.index({ 
  title: 'text', 
  content: 'text' 
});
// Search query:
await Post.find({ 
  $text: { $search: "mongodb indexing" } 
});


// 6. Check Existing Indexes
// ===========================================
// In Mongoose
const indexes = await User.collection.getIndexes();
console.log(indexes);
// Output:
// {
//   "v": 2,
//   "key": { "_id": 1 },
//   "name": "_id_"
// },
// {
//   "v": 2,
//   "key": { "email": 1 },
//   "name": "email_1",
//   "unique": true
// },
// {
//   "v": 2,
//   "key": { "city": 1, "age": -1 },
//   "name": "city_1_age_-1"
// }


// 7. Sharding Basics
// =============================================
// Sharding = Splitting data across multiple servers.

// Why Shard?
// 1. Too much data for one server
// 2. Too many writes for one server
// 3. Need better performance

// Sharding Structure:
// Application
//     |
//     ↓
// MongoDB Router (mongos)
//     |
//     ↓
// Shard 1    Shard 2    Shard 3
// (Data A)   (Data B)   (Data C)

// Sharding Example:
// 1. Enable sharding on database
sh.enableSharding("myDB");

// 2. Choose shard key (which field to split data on)
sh.shardCollection("myDB.users", { "userId": 1 });

// 3. Now data is distributed:
// userId: 1-10000 → Shard 1
// userId: 10001-20000 → Shard 2
// userId: 20001+ → Shard 3

// Query:
db.users.find({ userId: 5000 })
// Router sends query only to Shard 1 (FAST!)

db.users.find({ name: "John" })
// Router sends query to ALL shards (SLOW!)
// This is why choose shard key carefully!

// Choosing Shard Key:
// BAD Shard Key (doesn't distribute well)
sh.shardCollection("myDB.users", { "status": 1 });
// Problem: Only 'active' and 'inactive' → only 2 shards used

// GOOD Shard Key (distributes well)
sh.shardCollection("myDB.users", { "userId": 1 });
// Good: UserId is unique, distributes across shards

// GOOD Shard Key (high cardinality)
sh.shardCollection("myDB.orders", { "orderId": 1 });
// Good: Unique order IDs

// BAD Shard Key (low cardinality)
sh.shardCollection("myDB.products", { "category": 1 });
// Bad: Only few categories


// 8. Indexing Best Practices
// ===================================================
// DO:
// Create indexes for frequently used queries
UserSchema.index({ email: 1 });  // Frequent login lookups

// Create compound indexes for multiple fields
UserSchema.index({ city: 1, age: -1 }); // Common filter

// Use unique indexes for unique fields
UserSchema.index({ email: 1 }, { unique: true });

// Add indexes for sorting
UserSchema.index({ createdAt: -1 });

// Use explain() to verify indexes work
await User.find({ email: "john@example.com" }).explain();

// DON'T:
// Don't create too many indexes (slows writes)
// Each index = slower inserts/updates

// Don't index fields with low selectivity
UserSchema.index({ gender: 1 }); // Only 'male'/'female'

// Don't create indexes you don't use
// Check with: db.collection.getIndexes()

// Don't create huge compound indexes
UserSchema.index({ 
  field1: 1, field2: 1, field3: 1, 
  field4: 1, field5: 1, field6: 1 
}); // Too large!