## What is Populate?
populate() is a Mongoose feature used to replace an ObjectId with the actual document.

## One line:
Populate replaces ObjectId with actual document data.

## Populate vs $lookup
*Populate*
Order.find().populate("userId")
1. Mongoose feature
2. Runs additional query internally
3. Easy to use
*Lookup*
Order.aggregate([
   {
      $lookup:{
         from:"users",
         localField:"userId",
         foreignField:"_id",
         as:"user"
      }
   }
])
1. MongoDB feature
2. Runs inside aggregation
3. Faster for complex joins
4. Works without Mongoose

## Difference between populate and lookup?
Populate	                  Lookup
-----------                 ------------------
Mongoose	                 MongoDB
Separate query	             Aggregation stage
Easy	                     Powerful
Small joins	                 Complex joins

## One-Line Difference
Normal Populate:
---------------
Order -> User
ObjectId exists in current document.

Virtual Populate:
----------------
User -> Orders
ObjectId does NOT exist in current document.

Mongoose creates the relationship virtually.

## Summary (Using ONLY Our Fields)
What you write	                                                    What happens	                                       What you get
---------------                                           ----------------------------------         -------------------------------------------------
.populate('posts')	                                      Replace post IDs with actual posts	     All post fields: title, content, author, comments
.populate({path:'posts', select:'title'})	               Only get title from posts	                      Only: title field from posts
.populate('posts').populate('friends')	                   Populate both posts and friends	                   Both posts and friends as objects
.populate({path:'posts', populate:{path:'comments'}})	   Populate comments inside posts	              Posts with comments populated inside
.populate('postCount')	                                   Virtual populate - count posts	                   Just a number: 2
