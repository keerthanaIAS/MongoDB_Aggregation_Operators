const { default: mongoose } = require("mongoose");

// Simple Example Without Populate:
// ================================
// Your User document in database:
// {
//   _id: "123",
//   name: "John",
//   postIds: ["abc", "def"]  // These are just IDs
// }
const User = {
  _id: "123",
  name: "John",
  postIds: ["abc", "def"]  // These are just IDs
}
// When you query:
const user = await User.findById("123");
console.log(user.postIds); 
// Output: ["abc", "def"]  ← Just IDs, not helpful!

// Q: "Is select and post fields from mongoose or just result fields?"
// A: They are fields from your Mongoose Schema (your database structure).
// When you write select: 'title content', you're telling Mongoose: "From the Post documents you're populating,
// only give me the 'title' and 'content' fields."
// Q: "What do I select?"
// A: You select the fields you want to see in the result. 
// If you have a post with 20 fields but you only need 2, use select to save time and memory.

// With Populate:
// Step-by-Step
// ==================
// 1. User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }
});
// User collection:
// {
//   _id: "user1",
//   name: "John",
//   email: "john@email.com",
//   posts: ["post1", "post2"]
// }
// 2. Post Schema
const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
});
// Post collection:
// {
//   _id: "post1",
//   title: "Hello World",
//   content: "This is my first post",
//   author: "user1",
//   comments: ["comment1", "comment2"]
// }
// 3. Comment Schema
const CommentSchema = new mongoose.Schema({
  text: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
// Comment collection:
// {
//   _id: "comment1",
//   text: "Great post!",
//   author: "user1"
// }
// 4. Profile Shema
const ProfileSchema = new mongoose.Schema({
  bio: String,
  avatar: String
});
// 5. Category Schema
const CategorySchema = new mongoose.Schema({
  name: String,
  description: String
});

// 1. BASIC POPULATE (Replace IDs with actual data)
// =============================================
// Get user and replace post IDs with actual posts
const user = await User.findById("user1").populate('posts');
// Result:
// {
//   _id: "user1",
//   name: "John",
//   email: "john@email.com",
//   posts: [  // ← Now posts is an ARRAY of post OBJECTS, not just IDs!
//     { _id: "post1", title: "Hello World", content: "This is my first post" },
//     { _id: "post2", title: "Second Post", content: "Another post" }
//   ]
// }

// 2. POPULATE WITH SELECT (Choose which fields to get)
// ====================================================
// Get user, replace post IDs with posts, but ONLY get title and content
const user = await User.findById("user1").populate({
  path: 'posts',
  select: 'title content'  // ← ONLY these fields from posts
});
// or like this
const user = await User.findById("user1").populate( 'posts', 'title content');
// Result:
// {
//   _id: "user1",
//   name: "John",
//   email: "john@email.com",
//   posts: [
//     { _id: "post1", title: "Hello World", content: "This is my first post" },
       // Notice: NO author field, NO comments field
//     { _id: "post2", title: "Second Post", content: "Another post" }
//   ]
// }

// 3. MULTIPLE POPULATE (Populate multiple fields)
// ===============================================
// Get user, populate both posts AND friends
const user = await User.findById("user1")
  .populate('posts')    // Populate 1st field
  .populate('profile'); // Populate 2nd field
// RESULT:
// {
//   _id: "user1",
//   name: "John",
//   email: "john@email.com",
//   posts: [              // ← Now populated with actual posts
//     { _id: "post1", title: "Hello World", content: "My first post" },
//     { _id: "post2", title: "Second Post", content: "Another post" }
//   ],
//   profile: {            // ← Now populated with actual profile
//     _id: "profile1",
//     bio: "Software Developer",
//     avatar: "avatar.jpg"
//   }
// }

// 4. NESTED POPULATE (Populate inside populated documents)
// =====================================================
// Get user, populate posts, AND inside each post, populate its comments
const user = await User.findById("user1").populate({
  path: 'posts',
  populate: {
    path: 'comments'  // ← Populate comments inside each post!
  }
});
// Result:
// {
//   _id: "user1",
//   name: "John",
//   posts: [
//     {
//       _id: "post1",
//       title: "Hello World",
//       content: "This is my first post",
//       comments: [  // ← Now comments are actual objects, not IDs!
//         { _id: "comment1", text: "Great post!", author: "user1" },
//         { _id: "comment2", text: "Nice work!", author: "user2" }
//       ]
//     }
//   ]
// }

// 5. VIRTUAL POPULATE (Data that doesn't exist in database)
// ========================================================
// Virtual = Fields that Mongoose calculates, not stored in database.
const UserSchema = new mongoose.Schema({
  name: String,
  email: String
});
// Create a virtual field called 'postCount'
UserSchema.virtual('postCount', {
  ref: 'Post',
  localField: '_id',    // User's _id
  foreignField: 'author', // Post's author field
  count: true  // Just count how many posts ---  Only returns count, not the documents - this means return only count of another table not doc.
});

// We're Trying to Do:-
// Goal: From a USER, find all their POSTS.
// Question: How does MongoDB know which posts belong to which user?
// Answer: By looking at the POST's author field which contains the USER's ID!

// Think of it Like This:-
//  localField: '_id',      // User's _id = "user1"
//  foreignField: 'author'  // Post's author = "user1" (matches!)

// I am a USER (John)
// I want to find MY POSTS

// MY ID = "user1"

// Where is "user1" stored in the Post collection?
// → In the 'author' field!

// So I search for posts WHERE author = "user1"
// → That finds all MY posts!
// Now use it:
const user = await User.findById("user1").populate('postCount');
// Result:
// {
//   _id: "user1",
//   name: "John",
//   email: "john@email.com",
//   postCount: 5  // ← This number is CALCULATED, not stored!
// }

// Virtual with Options (Filtering)
userSchema.virtual("recentOrders", {
  ref: "Order",
  localField: "_id",
  foreignField: "userId",
  options: {
    match: { amount: { $gt: 1000 } },  // Only orders > 1000
    sort: { amount: -1 },              // Highest amount first
    limit: 5                           // Only 5 orders
  }
});

// Usage:
const user = await User.findById(1).populate('recentOrders');
// Result: Only gets orders with amount > 1000, sorted highest first

// Virtual Populate:
// Problem:
// User collection:
// {
//    _id:1,
//    name:"John"
// }
// Orders collection:
// {
//    amount:1000,
//    userId:1
// }
// User does NOT have orderIds.
// How to get all orders from User side?
// Answer: Virtual Populate
// ORDER SCHEMA:-
const orderSchema = new mongoose.Schema({
  amount: Number,
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  }
});
// User Schema:-
const userSchema = new mongoose.Schema({
   name:String
});
userSchema.virtual("orders",{
   ref:"Order",
   localField:"_id",
   foreignField:"userId"
});
// Query:-
User.find().populate("orders");
// Output:-
// {
//    _id:1,
//    name:"John",
//    orders:[
//       {
//          amount:1000
//       },
//       {
//          amount:2000
//       }
//    ]
// }

// 6. Deep Nested Populate
// ==========================
const user = await User.findById("user1").populate({
  path: 'posts',
  populate: {
    path: 'comments',
    populate: {
      path: 'author'  // ← Now populate the author of each comment
    }
  }
});
// RESULT:
// {
//   _id: "user1",
//   name: "John",
//   email: "john@email.com",
//   posts: [
//     {
//       _id: "post1",
//       title: "Hello World",
//       content: "My first post",
//       author: "user1",
//       comments: [
//         {
//           _id: "comment1",
//           text: "Great post!",
//           author: {  // ← Now author is an ACTUAL User object!
//             _id: "user1",
//             name: "John",
//             email: "john@email.com",
//             posts: ["post1", "post2"]
//           }
//         }
//       ]
//     }
//   ]
// }

// 7. Using select with Multiple Populate
// ======================================
const user = await User.findById("user1")
  .populate({
    path: 'posts',
    select: 'title content'  // Only get title and content from posts
  })
  .populate({
    path: 'profile',
    select: 'bio'            // Only get bio from profile
  });
// RESULT:
// {
//   _id: "user1",
//   name: "John",
//   email: "john@email.com",
//   posts: [
//     { _id: "post1", title: "Hello World", content: "My first post" },
//     // Notice: NO other post fields
//   ],
//   profile: {
//     _id: "profile1",
//     bio: "Software Developer"
//     // Notice: NO avatar field
//   }
// }

// 8. Populate Multiple Fields from Post
// =====================================
// Post Data:
// {
//   _id: "post1",
//   title: "Hello World",
//   content: "My first post",
//   author: "user1",      // User ID
//   comments: ["comment1", "comment2"], // Comment IDs
//   category: "cat1"      // Category ID
// }
// Multiple Populate on Post:
const post = await Post.findById("post1")
  .populate('author')     // Populate 1st field
  .populate('comments')   // Populate 2nd field
  .populate('category');  // Populate 3rd field
// RESULT:
// {
//   _id: "post1",
//   title: "Hello World",
//   content: "My first post",
//   author: {               // ← Populated
//     _id: "user1",
//     name: "John",
//     email: "john@email.com"
//   },
//   comments: [             // ← Populated
//     { _id: "comment1", text: "Great post!" },
//     { _id: "comment2", text: "Nice work!" }
//   ],
//   category: {             // ← Populated
//     _id: "cat1",
//     name: "Technology",
//     description: "Tech posts"
//   }
// }

// 9. Different Syntax - Same Result
// ==================================
// Method 1: Chaining .populate()
const user1 = await User.findById("user1")
  .populate('posts')
  .populate('profile');

// Method 2: Using array
const user2 = await User.findById("user1")
  .populate(['posts', 'profile']);

// Method 3: Using objects for more control
const user3 = await User.findById("user1")
  .populate({
    path: 'posts',
    select: 'title content'
  })
  .populate({
    path: 'profile',
    select: 'bio'
  });
// ALL THREE give the SAME result!
