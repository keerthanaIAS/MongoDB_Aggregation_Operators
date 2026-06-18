# **MONGODB AGGREGATION**

### **What is Aggregation?**
Aggregation is like performing complex data analysis operations (filtering, grouping, calculations) on your MongoDB data. Think of it as a "data processing factory" where documents go through different stations (stages) and get transformed.

### **Why We Need Aggregation?**
- **Without Aggregation**: Fetch all data → Process in application code (slow, memory-heavy)
- **With Aggregation**: Database does the heavy lifting → Return only results (fast, efficient)

## **QUICK REFERENCE CHEAT SHEET**

| Stage                 | Purpose|                            | When to Use |
-------                -----------------------                --------------------------------------------
| `$match`              | Filter documents |                  | Early in pipeline to reduce data |
| `$project`            | Select/transform fields|            | When you need specific fields or calculations |
| `$group`              | Aggregate data |                    | For summaries, counts, sums |
| `$sort`               | Order results |                     | Before pagination or for ordered output |
| `$limit`              | Limit results |                     | Pagination or top-N queries |
| `$skip`               | Skip documents |                    | Pagination |
| `$unwind`             | Deconstruct arrays |                | When analyzing array elements individually |
| `$lookup`             | Join collections |                  | Combining data from multiple collections |
| `$facet`              | Multi-dimensional analysis |        | Dashboard with multiple metrics |
| `$bucket`             | Group into ranges |                 | Distribution analysis |
| `$addFields`          | Add new fields |                    | Enriching documents |
| `$merge`/`$out`       | Save results |                      | Materialized views or reports |
| `$redact`             | Restrict access |                   | Security/access control |

## Terminal Logs:-
------------------
keerthana@Keerthanas-MacBook-Air MongoDB_Aggregation_Operators % cd ecommerce-backend  
keerthana@Keerthanas-MacBook-Air ecommerce-backend % docker compose up -d
[+] Running 9/9
 ✔ mongodb Pulled                                                                                                         17.1s 
   ✔ 7c07ef21bab6 Pull complete                                                                                            1.3s 
   ✔ 4b77ccde538a Pull complete                                                                                            1.0s 
   ✔ c5b7a1599606 Pull complete                                                                                            0.6s 
   ✔ f2830fe8a9e3 Pull complete                                                                                            0.9s 
   ✔ fff3795b4371 Pull complete                                                                                            4.4s 
   ✔ 7adb90dbb4c6 Pull complete                                                                                            1.0s 
   ✔ 2c076c059923 Pull complete                                                                                           11.3s 
   ✔ deff5935811e Pull complete                                                                                            0.4s 
[+] Running 3/3
 ✔ Network mongodb_aggregation_operators_default      Created                                                              0.0s 
 ✔ Volume "mongodb_aggregation_operators_mongo-data"  Created                                                              0.0s 
 ✔ Container mongodb                                  Started                                                              0.6s 
keerthana@Keerthanas-MacBook-Air ecommerce-backend % 
keerthana@Keerthanas-MacBook-Air ecommerce-backend % docker compose up -d
[+] Running 1/1
 ✔ Container mongodb  Started                                                                                              0.2s 
keerthana@Keerthanas-MacBook-Air ecommerce-backend % docker exec -it mongodb mongosh
Current Mongosh Log ID: 6a2f8f21271fb48c64d1a7ba
Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.8.3
Using MongoDB:          8.2.11
Using Mongosh:          2.8.3

For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/


To help improve our products, anonymous usage data is collected and sent to MongoDB periodically (https://www.mongodb.com/legal/privacy-policy).
You can opt-out by running the disableTelemetry() command.

------
   The server generated these startup warnings when booting
   2026-06-15T05:32:28.706+00:00: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine. See http://dochub.mongodb.org/core/prodnotes-filesystem
   2026-06-15T05:32:28.760+00:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
   2026-06-15T05:32:28.760+00:00: For customers running the current memory allocator, we suggest changing the contents of the following sysfsFile
   2026-06-15T05:32:28.760+00:00: We suggest setting the contents of sysfsFile to 0.
   2026-06-15T05:32:28.760+00:00: We suggest setting swappiness to 0 or 1, as swapping can cause performance problems.
------

test> show dbs
admin      40.00 KiB
config     12.00 KiB
ecommerce   8.00 KiB
local      40.00 KiB
test> use ecommerce
switched to db ecommerce
ecommerce> show collections
users
ecommerce> db.users.find()
[
  {
    _id: ObjectId('6a2f8f6c156bbdac140738dd'),
    name: 'Keerthana',
    email: 'keerthana@gmail.com',
    __v: 0
  }
]
ecommerce> db.users.insertMany([
|     {
|         _id: 1,
|         name: "John Smith",
|         email: "john@email.com",
|         age: 28,
|         city: "New York",
|         country: "USA",
|         registeredDate: ISODate("2024-01-10"),
|         membership: "premium",
|         tags: ["tech", "gaming"],
|         preferences: { newsletter: true, notifications: "email" }
|     },
|     {
|         _id: 2,
|         name: "Sarah Johnson",
|         email: "sarah@email.com",
|         age: 35,
|         city: "London",
|         country: "UK",
|         registeredDate: ISODate("2024-01-15"),
|         membership: "basic",
|         tags: ["fashion", "beauty"],
|         preferences: { newsletter: false, notifications: "sms" }
|     },
|     {
|         _id: 3,
|         name: "Mike Chen",
|         email: "mike@email.com",
|         age: 42,
|         city: "Tokyo",
|         country: "Japan",
|         registeredDate: ISODate("2024-02-01"),
|         membership: "premium",
|         tags: ["tech", "books"],
|         preferences: { newsletter: true, notifications: "email" }
|     },
|     {
|         _id: 4,
|         name: "Emma Wilson",
|         email: "emma@email.com",
|         age: 25,
|         city: "New York",
|         country: "USA",
|         registeredDate: ISODate("2024-02-15"),
|         membership: "basic",
|         tags: ["sports", "fitness"],
|         preferences: { newsletter: true, notifications: "push" }
|     },
|     {
|         _id: 5,
|         name: "David Brown",
|         email: "david@email.com",
|         age: 31,
|         city: "London",
|         country: "UK",
|         registeredDate: ISODate("2024-03-01"),
|         membership: "premium",
|         tags: ["tech", "gaming", "books"],
|         preferences: { newsletter: true, notifications: "email" }
|     }
| ])
{
  acknowledged: true,
  insertedIds: { '0': 1, '1': 2, '2': 3, '3': 4, '4': 5 }
}
ecommerce> db.products.insertMany([
|     {
|         _id: 101,
|         name: "MacBook Pro",
|         category: "Electronics",
|         subcategory: "Laptops",
|         price: 1299.99,
|         cost: 1000.00,
|         stock: 50,
|         rating: 4.8,
|         specs: { brand: "Apple", ram: "16GB", storage: "512GB" },
|         tags: ["laptop", "apple", "premium"]
|     },
|     {
|         _id: 102,
|         name: "iPhone 15",
|         category: "Electronics",
|         subcategory: "Phones",
|         price: 999.99,
|         cost: 750.00,
|         stock: 100,
|         rating: 4.7,
|         specs: { brand: "Apple", storage: "256GB", color: "Black" },
|         tags: ["phone", "apple", "mobile"]
|     },
|     {
|         _id: 103,
|         name: "Nike Running Shoes",
|         category: "Sports",
|         subcategory: "Footwear",
|         price: 129.99,
|         cost: 80.00,
|         stock: 200,
|         rating: 4.5,
|         specs: { brand: "Nike", size: "10", color: "White" },
|         tags: ["shoes", "running", "sports"]
|     },
|     {
|         _id: 104,
|         name: "Samsung TV 55\"",
|         category: "Electronics",
|         subcategory: "TVs",
|         price: 799.99,
|         cost: 600.00,
|         stock: 30,
|         rating: 4.6,
|         specs: { brand: "Samsung", size: "55inch", type: "OLED" },
|         tags: ["tv", "samsung", "electronics"]
|     },
|     {
|         _id: 105,
|         name: "Programming Book Bundle",
|         category: "Books",
|         subcategory: "Technical",
|         price: 89.99,
|         cost: 50.00,
|         stock: 500,
|         rating: 4.9,
|         specs: { author: "Various", pages: 1500, format: "Paperback" },
|         tags: ["books", "programming", "education"]
|     }
| ])
{
  acknowledged: true,
  insertedIds: { '0': 101, '1': 102, '2': 103, '3': 104, '4': 105 }
}
ecommerce> db.orders.insertMany([
|     {
|         _id: 1001,
|         userId: 1,
|         orderDate: ISODate("2024-01-20"),
|         status: "delivered",
|         items: [
|             { productId: 101, quantity: 1, priceAtPurchase: 1299.99 },
|             { productId: 105, quantity: 2, priceAtPurchase: 89.99 }
|         ],
|         totalAmount: 1479.97,
|         payment: { method: "credit_card", transactionId: "TXN001" },
|         shipping: { address: "123 Main St, NY", cost: 0, method: "express" }
|     },
|     {
|         _id: 1002,
|         userId: 2,
|         orderDate: ISODate("2024-02-05"),
|         status: "delivered",
|         items: [
|             { productId: 103, quantity: 1, priceAtPurchase: 129.99 }
|         ],
|         totalAmount: 129.99,
|         payment: { method: "paypal", transactionId: "TXN002" },
|         shipping: { address: "45 Oxford St, London", cost: 5.99, method: "standard" }
|     },
|     {
|         _id: 1003,
|         userId: 1,
|         orderDate: ISODate("2024-02-10"),
|         status: "processing",
|         items: [
|             { productId: 102, quantity: 1, priceAtPurchase: 999.99 },
|             { productId: 104, quantity: 1, priceAtPurchase: 799.99 }
|         ],
|         totalAmount: 1799.98,
|         payment: { method: "credit_card", transactionId: "TXN003" },
|         shipping: { address: "123 Main St, NY", cost: 0, method: "express" }
|     },
|     {
|         _id: 1004,
|         userId: 3,
|         orderDate: ISODate("2024-02-15"),
|         status: "shipped",
|         items: [
|             { productId: 101, quantity: 1, priceAtPurchase: 1299.99 }
|         ],
|         totalAmount: 1299.99,
|         payment: { method: "bank_transfer", transactionId: "TXN004" },
|         shipping: { address: "789 Tokyo Tower, Tokyo", cost: 15.00, method: "international" }
|     },
|     {
|         _id: 1005,
|         userId: 4,
|         orderDate: ISODate("2024-03-01"),
|         status: "delivered",
|         items: [
|             { productId: 103, quantity: 2, priceAtPurchase: 129.99 },
|             { productId: 105, quantity: 1, priceAtPurchase: 89.99 }
|         ],
|         totalAmount: 349.97,
|         payment: { method: "debit_card", transactionId: "TXN005" },
|         shipping: { address: "567 Broadway, NY", cost: 0, method: "express" }
|     },
|     {
|         _id: 1006,
|         userId: 5,
|         orderDate: ISODate("2024-03-10"),
|         status: "delivered",
|         items: [
|             { productId: 102, quantity: 1, priceAtPurchase: 999.99 },
|             { productId: 105, quantity: 3, priceAtPurchase: 89.99 }
|         ],
|         totalAmount: 1269.96,
|         payment: { method: "credit_card", transactionId: "TXN006" },
|         shipping: { address: "234 Baker St, London", cost: 5.99, method: "standard" }
|     },
|     {
|         _id: 1007,
|         userId: 1,
|         orderDate: ISODate("2024-03-15"),
|         status: "cancelled",
|         items: [
|             { productId: 104, quantity: 1, priceAtPurchase: 799.99 }
|         ],
|         totalAmount: 799.99,
|         payment: { method: "credit_card", transactionId: "TXN007" },
|         shipping: { address: "123 Main St, NY", cost: 0, method: "express" }
|     }
| ])
{
  acknowledged: true,
  insertedIds: {
    '0': 1001,
    '1': 1002,
    '2': 1003,
    '3': 1004,
    '4': 1005,
    '5': 1006,
    '6': 1007
  }
}
ecommerce> db.reviews.insertMany([
|     {
|         _id: 2001,
|         userId: 1,
|         productId: 101,
|         rating: 5,
|         review: "Excellent laptop!",
|         date: ISODate("2024-01-25"),
|         helpful: 10
|     },
|     {
|         _id: 2002,
|         userId: 2,
|         productId: 103,
|         rating: 4,
|         review: "Good shoes for running",
|         date: ISODate("2024-02-10"),
|         helpful: 5
|     },
|     {
|         _id: 2003,
|         userId: 1,
|         productId: 102,
|         rating: 5,
|         review: "Amazing phone!",
|         date: ISODate("2024-02-15"),
|         helpful: 8
|     },
|     {
|         _id: 2004,
|         userId: 3,
|         productId: 101,
|         rating: 4,
|         review: "Great but expensive",
|         date: ISODate("2024-02-20"),
|         helpful: 3
|     },
|     {
|         _id: 2005,
|         userId: 4,
|         productId: 103,
|         rating: 3,
|         review: "Okay for the price",
|         date: ISODate("2024-03-05"),
|         helpful: 2
|     }
| ])
{
  acknowledged: true,
  insertedIds: { '0': 2001, '1': 2002, '2': 2003, '3': 2004, '4': 2005 }
}
ecommerce> %                                                                                                                    
keerthana@Keerthanas-MacBook-Air ecommerce-backend % 


---

## **COMPLETE OPERATIONS CHEAT SHEET**

### **MONGOOSE METHODS (Without Aggregation)**

| Method | Purpose | Example |
|--------|---------|---------|
| `Model.find()` | Find all documents | `User.find()` |
| `Model.find({filter})` | Find with filter | `User.find({country: "USA"})` |
| `Model.findOne()` | Find first match | `User.findOne({email: "john@email.com"})` |
| `Model.findById()` | Find by ID | `User.findById("123")` |
| `Model.create()` | Insert document | `User.create({name: "John"})` |
| `Model.insertMany()` | Insert multiple | `User.insertMany([...])` |
| `Model.findByIdAndUpdate()` | Update by ID | `User.findByIdAndUpdate(id, {$set: {...}})` |
| `Model.updateOne()` | Update first match | `User.updateOne({filter}, {$set: {...}})` |
| `Model.updateMany()` | Update all matches | `User.updateMany({filter}, {$set: {...}})` |
| `Model.findByIdAndDelete()` | Delete by ID | `User.findByIdAndDelete(id)` |
| `Model.deleteOne()` | Delete first match | `User.deleteOne({filter})` |
| `Model.deleteMany()` | Delete all matches | `User.deleteMany({filter})` |
| `Model.countDocuments()` | Count documents | `User.countDocuments({filter})` |
| `Model.distinct()` | Get unique values | `User.distinct("country")` |

### **AGGREGATION OPERATORS**

| Operator | Purpose | When to Use |
|----------|---------|-------------|
| `$match` | Filter documents | First stage to reduce data |
| `$project` | Select/transform fields | Need specific fields or calculations |
| `$group` | Aggregate data | Need summaries, counts, averages |
| `$sort` | Order results | Before pagination or ordered output |
| `$limit` | Limit results | Pagination, top-N queries |
| `$skip` | Skip documents | Pagination |
| `$unwind` | Deconstruct arrays | Analyze array elements individually |
| `$lookup` | Join collections | Combine data from multiple collections |
| `$facet` | Multi-dimensional analysis | Dashboard with multiple metrics |
| `$bucket` | Group into ranges | Distribution analysis |

---

Query Operators (used in find, findOne, countDocuments):
├── Comparison: $eq, $ne, $gt, $gte, $lt, $lte, $in, $nin
├── Logical: $and, $or, $nor, $not
├── Element: $exists, $type
├── Array: $all, $size, $elemMatch
└── Evaluation: $regex, $expr

Update Operators (used in updateOne, updateMany, findByIdAndUpdate):
├── Fields: $set, $unset, $rename, $inc, $mul
├── Arrays: $push, $addToSet, $pull, $pop
└── Modifiers: $each, $slice, $sort

---

## **QUICK DECISION GUIDE: WHEN TO USE WHICH OPERATOR**

### **Scenario 1: Find users from multiple countries**
```javascript
// ❌ BAD: Multiple $or conditions
User.find({
    $or: [
        { country: "USA" },
        { country: "UK" },
        { country: "Japan" }
    ]
})

// ✅ GOOD: Use $in
User.find({
    country: { $in: ["USA", "UK", "Japan"] }
})
```
**WHY**: `$in` is cleaner and faster for matching multiple values of the same field.

---

### **Scenario 2: Find products between $100 and $500**
```javascript
// ✅ Need $and because both conditions are on SAME field
Product.find({
    $and: [
        { price: { $gte: 100 } },
        { price: { $lte: 500 } }
    ]
})
```
**WHY**: You can't write `{ price: { $gte: 100, $lte: 500 } }` - MongoDB would get confused with multiple operators on same field.

---

### **Scenario 3: Find users with BOTH "tech" AND "gaming" tags**
```javascript
// ✅ Use $all
User.find({
    tags: { $all: ["tech", "gaming"] }
})

// ❌ DON'T use $in - this finds users with EITHER tag
User.find({
    tags: { $in: ["tech", "gaming"] }
})
```
**WHY**: `$all` = AND condition, `$in` = OR condition.

---

### **Scenario 4: Find orders where ANY item costs > $1000**
```javascript
// For arrays of subdocuments, use $elemMatch
Order.find({
    items: {
        $elemMatch: {
            priceAtPurchase: { $gt: 1000 }
        }
    }
})
```
**WHY**: `$elemMatch` ensures the SAME array element meets the condition.


---

## **COMPLETE LIST OF ALL OPERATORS I COVERED**

### **Query Operators** (find, findOne)
```javascript
// Comparison
$eq, $ne, $gt, $gte, $lt, $lte, $in, $nin

// Logical  
$and, $or, $nor, $not

// Element
$exists, $type

// Array
$all, $size, $elemMatch

// Evaluation
$regex, $expr, $text

// Bitwise
$bitsAllSet, $bitsAnySet, $bitsAllClear
```

### **Update Operators** (updateOne, updateMany)
```javascript
// Fields
$set, $unset, $rename, $inc, $mul, $min, $max, $currentDate

// Arrays
$push, $addToSet, $pop, $pull, $pullAll

// Array Modifiers (used with $push)
$each, $position, $slice, $sort

// Bitwise
$bit: { and, or, xor }

// Special
$setOnInsert (only for upsert)
```

### **Query Modifiers** (chained methods)
```javascript
.upsert()     - Update or insert
.comment()    - Add log comment
.explain()    - Query plan
.hint()       - Force index
.maxTimeMS()  - Timeout
```
---

Now you have EVERY operator including the ones I missed earlier. The most important ones you should master are:
1. **$upsert** - Probably the most used in real applications
2. **$setOnInsert** - Goes with upsert
3. **$min/$max** - Great for tracking records
4. **$pop/$position/$slice** - Advanced array manipulation
5. **$text** - Search functionality

## COMPLETE OPERATOR REFERENCE TABLE
------------------------------------
# TOP-LEVEL OPERATORS (Used at query root level)
These wrap around conditions, always at the same level as field names.

Operator	Syntax	Example	What It Does
$and	{ $and: [ {cond1}, {cond2} ] }	{ $and: [ {price: {$gt:100}}, {stock: {$lt:50}} ] }	ALL conditions must be true
$or	{ $or: [ {cond1}, {cond2} ] }	{ $or: [ {color:"Red"}, {price: {$gt:500}} ] }	ANY condition true
$nor	{ $nor: [ {cond1}, {cond2} ] }	{ $nor: [ {grade:"C"}, {score: {$lt:70}} ] }	NONE of the conditions true (ALL false)
$expr	{ $expr: { operator: [args] } }	{ $expr: { $gt: ["$price", "$cost"] } }	Compare TWO FIELDS in same document

# FIELD-LEVEL OPERATORS (Used INSIDE field conditions)
These work on specific fields.

Operator	Syntax	Example	What It Does
$eq	{ field: { $eq: value } }	{ age: { $eq: 20 } }	Equals (same as {age: 20})
$ne	{ field: { $ne: value } }	{ color: { $ne: "Black" } }	Not equal
$gt	{ field: { $gt: value } }	{ price: { $gt: 500 } }	Greater than
$gte	{ field: { $gte: value } }	{ price: { $gte: 500 } }	Greater than or equal
$lt	{ field: { $lt: value } }	{ age: { $lt: 18 } }	Less than
$lte	{ field: { $lte: value } }	{ age: { $lte: 18 } }	Less than or equal
$in	{ field: { $in: [val1, val2] } }	{ city: { $in: ["Mumbai","Delhi"] } }	Value IN this list
$nin	{ field: { $nin: [val1, val2] } }	{ city: { $nin: ["Mumbai","Delhi"] } }	Value NOT IN this list
$not	{ field: { $not: { operator } } }	{ price: { $not: { $gt: 500 } } }	Negates an operator condition
$all	{ field: { $all: [val1, val2] } }	{ tags: { $all: ["mongodb","react"] } }	Array contains ALL these values
$size	{ field: { $size: number } }	{ tags: { $size: 3 } }	Array has exact length
$elemMatch	{ field: { $elemMatch: {conds} } }	{ scores: { $elemMatch: {sub:"math", score:{$gt:90}} } }	ONE array element matches ALL conditions
$exists	{ field: { $exists: boolean } }	{ phone: { $exists: false } }	Field exists or not
$type	{ field: { $type: "type" } }	{ age: { $type: "string" } }	Field is of specified BSON type
$regex	{ field: { $regex: /pattern/ } }	{ email: { $regex: /@gmail\.com$/i } }	Pattern matching

# KEY DIFFERENCE: Top-Level vs Field-Level
javascript
// ❌ WRONG - $or used as field-level
{ city: { $or: ["Mumbai", "Delhi"] } }  // Error!

// ✅ CORRECT - $or is TOP-LEVEL
{ $or: [ {city: "Mumbai"}, {city: "Delhi"} ] }

// ✅ CORRECT - $in is FIELD-LEVEL (simpler for same field)
{ city: { $in: ["Mumbai", "Delhi"] } }
javascript
// ❌ WRONG - $nor used as field-level
{ price: { $nor: [70, 90] } }  // Error!

// ✅ CORRECT - $nor is TOP-LEVEL
{ $nor: [ {price: 70}, {price: 90} ] }

// ✅ CORRECT - $nin is FIELD-LEVEL
{ price: { $nin: [70, 90] } }


# QUICK RULES:
Rule	Example
Same field + multiple values	$in / $nin (field-level)
Different fields + conditions	$or / $and / $nor (top-level)
Array contains all values	$all (field-level)
Array element matches all conditions	$elemMatch (field-level)
Compare two fields	$expr (top-level)
Negate an operator	$not (field-level)
Negate multiple conditions	$nor (top-level)