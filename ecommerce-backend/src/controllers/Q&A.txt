const Order = require("../models/Order");
const User = require("../models/User");

const employees;

// Interview Problem #1 (Easy-Medium):
// ====================================
// Collections:
// Users:
// {
//   _id: 1,
//   name: "John",
//   department: "IT",
//   salary: 60000
// },
// {
//   _id: 2,
//   name: "Alice",
//   department: "HR",
//   salary: 50000
// },
// {
//   _id: 3,
//   name: "Bob",
//   department: "IT",
//   salary: 70000
// }
// Question:
// Return:
// [
//   {
//     department: "IT",
//     totalEmployees: 2,
//     avgSalary: 65000,
//     highestSalary: 70000
//   },
//   {
//     department: "HR",
//     totalEmployees: 1,
//     avgSalary: 50000,
//     highestSalary: 50000
//   }
// ]

// Requirements:
// Group by department
// Count employees
// Calculate average salary
// Calculate highest salary
// Sort by average salary descending

User.aggregate([
    {
        $group: {
            _id: "$department",
            totalEmployees: { $sum: 1 },
            avgSalary: { $avg: "$salary" },
            highestSalary: { $max: "$salary" }
        }
    },
    {
        project: {
            _id: 0,
            department: "$_id",
            totalEmployees: 1,
            avgSalary: 1,
            highestSalary: 1
        }
    },
    {
        $sort: {
            avgSalary: -1
        }
    }
])

// Small question before Problem #2
// ====================================
// What is the difference between:
totalEmployees: { $sum: 1 }
// Answer: For every document in the group, add 1.
// Mongo does:
// IT = 1 + 1 + 1 = 3
// HR = 1 = 1
// So it counts documents.
// ---and---
totalSalary: { $sum: "$salary" }
// Answer: Mongo adds the value of the salary field from each document.
// IT
// 60000
// IT
// 70000
// Mongo does:
// 60000 + 70000 = 130000
// So it sums field values.
// Interview answer:
// $sum: 1 counts documents in each group.
// $sum: "$salary" adds the salary values from each document in the group.

// Interview Problem #2 (Lookup)
// ===============================
// Collections:
// Users
// {
//   _id: 1,
//   name: "John"
// },
// {
//   _id: 2,
//   name: "Alice"
// }
// Orders
// {
//   _id: 101,
//   userId: 1,
//   amount: 1000
// },
// {
//   _id: 102,
//   userId: 1,
//   amount: 2000
// },
// {
//   _id: 103,
//   userId: 2,
//   amount: 1500
// }
// Question
// Return:
// [
//   {
//     name: "John",
//     totalOrders: 2,
//     totalAmount: 3000
//   },
//   {
//     name: "Alice",
//     totalOrders: 1,
//     totalAmount: 1500
//   }
// ]
// Requirements:
// Start from orders
// Join users
// Group by user
// Count orders
// Calculate total amount
// Return only name, totalOrders, totalAmount

Order.aggregate([
    {
        $group: {
            _id: "$userId",
            totalOrders: { $sum: 1 },
            totalAmount: { $sum: "$amount" }
        }
    },
    {
        $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user"
        }
    },
    {
        $unwind: "$user"
    },
    {
        $project: {
            _id: 0,
            name: "$user.name",
            totalOrders: 1,
            totalAmount: 1
        }
    }
])

// after look up we have [] of value for that we use unwind to get the one document
// Correct. That's the main idea.
// Interview answer:
// Before $unwind:
// ==============
// After lookup:
// {
//   _id: 1,
//   totalOrders: 2,
//   totalAmount: 3000,
//   user: [
//     {
//       _id: 1,
//       name: "John"
//     }
//   ]
// }
// Notice:
// user: []
// is always an array.

// After $unwind:
// =============
// {
//   _id: 1,
//   totalOrders: 2,
//   totalAmount: 3000,
//   user: {
//     _id: 1,
//     name: "John"
//   }
// }
// Now:
// user.name
// is easy to access.

// Why interviewers ask this?
// Because many candidates write:
// name: "$user.name"
// without realizing user is still an array.

// Interview Problem #3 (Real-world level):
// ======================================
// Collections:
// Users
// {
//   _id: 1,
//   name: "John"
// },
// {
//   _id: 2,
//   name: "Alice"
// }
// Orders
// {
//   _id: 101,
//   userId: 1,
//   status: "PAID",
//   amount: 1000
// },
// {
//   _id: 102,
//   userId: 1,
//   status: "PENDING",
//   amount: 2000
// },
// {
//   _id: 103,
//   userId: 2,
//   status: "PAID",
//   amount: 1500
// }
// Question
// Return:
// [
//   {
//     name: "Alice",
//     totalRevenue: 1500
//   },
//   {
//     name: "John",
//     totalRevenue: 1000
//   }
// ]

// Requirements:
// Only PAID orders
// Join users
// Revenue per user
// Sort highest revenue first

// Think about:
// Which collection should start the pipeline?
// Should $match be before or after $lookup?
// When should $group happen?

Order.aggregate([
    {
        $match: {
            status: "PAID"
        }
    },
    {
        $group: {
            _id: "$userId",
            totalRevenue: {
                $sum: "$amount"
            }
        }
    },
    {
        $lookup: {
            from: "users",
            localField: "userID",
            foreignField: "_id",
            as: "user"
        }
    },
    {
        $unwind: "user"
    },
    {
        $project: {
            _id: 0,
            name: "$user.name",
            totalRevenue: 1
        }
    },
    {
        $sort: {
            totalRevenue: -1
        }
    }
])
// Why this stage order?
// $match
// ↓
// Reduce data early (only PAID)

// $group
// ↓
// Calculate revenue per user

// $lookup
// ↓
// Get user details

// $unwind
// ↓
// Convert user array to object

// $project
// ↓
// Shape output

// $sort
// ↓
// Highest revenue first

// Interview Question (1 line answer)
// Why is this better?
// $match → $group → $lookup
// $match → $group → $lookup first we have to filter to reduce the collection volume, 
// then we group to calculate what are the rquirements from the same collection to reduce the data volume,
// then we loopup to get the user details from another collection
// ✅ That's a solid answer.
// A concise interview version:
// $match first reduces the number of documents processed,
// $group aggregates the reduced dataset,
// $lookup is delayed because joins are expensive and should be performed on the smallest possible dataset.
// Score: 8.5/10
// You're starting to think about data flow instead of individual operators.



// Interview Problem #4 (Harder)
// ==================================================
// This introduces:
// $lookup
// $unwind
// $group
// $multiply
// $sum
// $sort
// which is a very common e-commerce interview question.
// Products
// {
//   _id: 1,
//   name: "Laptop"
// },
// {
//   _id: 2,
//   name: "Phone"
// }
// Orders
// {
//   _id: 101,
//   items: [
//     {
//       productId: 1,
//       qty: 2,
//       price: 50000
//     },
//     {
//       productId: 2,
//       qty: 1,
//       price: 20000
//     }
//   ]
// }
// {
//   _id: 102,
//   items: [
//     {
//       productId: 1,
//       qty: 1,
//       price: 50000
//     }
//   ]
// }
// Question
// Return:
// [
//   {
//     productName: "Laptop",
//     totalQty: 3,
//     totalRevenue: 150000
//   },
//   {
//     productName: "Phone",
//     totalQty: 1,
//     totalRevenue: 20000
//   }
// ]
// Requirements:
// Start from Orders
// Each item revenue = qty * price
// Revenue grouped by product
// Include product name
// Highest revenue first
// Think before coding:
// items is an array. What stage is needed first?
// Should $lookup happen before or after $group?
// What field should _id be grouped on?
// Where should $multiply be used?

Order.aggregate([
    {
        $unwind: "$items"
    },
    {
        $group: {
            _id: "$items.productId",
            totalRevenue: {
                $sum: {
                    $multiply: ["$items.qty", "$items.price"]
                }
            },
            totalQty: {
                $sum: "$items.qty"
            }
        }
    },
    {
        $lookup: {
            from: "products",
            localField: "$items.productId",
            foreignField: "_id",
            as: "product"
        }
    },
    {
        $unwind: "$product"
    },
    {
        $project: {
            productName: "$product.name",
            totalQty: 1,
            totalRevenue: 1
        }
    }, {
        $sort: {
            totalRevenue: -1
        }
    }
])

// Very Important Interview Question:
// Suppose there are:
// 1,000,000 orders
// 10 products
// Which is faster?
// A
// $unwind
// → $lookup
// → $group
// B
// $unwind
// → $group
// → $lookup

// And why?
// Answer in 2-3 lines.
// b because first we are grouping to reduce the data set then using the data set
// ✅ Correct.
// A stronger interview answer would be:
// B is faster because $group reduces millions of order-item documents into a much smaller set (one document per product).
// Then $lookup joins only those grouped results instead of joining every order item. This reduces memory, CPU, and join cost.
// Example:
// 1,000,000 order items
// ↓ $group
// 10 products
// ↓ $lookup
// 10 joins
// vs
// 1,000,000 order items
// ↓ $lookup
// 1,000,000 joins
// ↓ $group
// Huge difference.



// Interview Problem #5 (Senior-Level Pattern)
// ==========================================
// This introduces:
// $lookup
// $unwind
// $match
// $group
// $avg
// $sort

// Very common in e-commerce, food delivery, SaaS dashboards.
// Products:
// {
//   _id: 1,
//   name: "Laptop"
// },
// {
//   _id: 2,
//   name: "Phone"
// }
// Reviews
// {
//   _id: 1,
//   productId: 1,
//   rating: 5
// },
// {
//   _id: 2,
//   productId: 1,
//   rating: 4
// },
// {
//   _id: 3,
//   productId: 2,
//   rating: 3
// }
// Question:
// Return:
// [
//   {
//     productName: "Laptop",
//     avgRating: 4.5,
//     totalReviews: 2
//   },
//   {
//     productName: "Phone",
//     avgRating: 3,
//     totalReviews: 1
//   }
// ]
// Requirements:
// Start from Reviews
// Join Products
// Calculate average rating per product
// Count reviews per product
// Sort by average rating descending
// Think before coding:
// Should $lookup happen before or after $group?
// What should _id be?
// How will you get productName?
// Which accumulator counts reviews?

Review.aggregate([
    {
        $group: {
            _id: "$productId",
            avgRating: {
                $avg: "$rating"
            },
            totalReviews: {
                $sum: 1
            }
        }
    },
    {
        $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product"
        }
    },
    {
        $unwind: "$product"
    },

    {
        $project: {
            _id: 0,
            totalReviews: 1,
            avgRating: 1,
            productName: "$product.name"
        }
    },
    {
        $sort: {
            avgRating: -1
        }
    }
])




// Interview Problem #6 (Hard)
// ==========================================
// Now we're mixing:
// $match
// $expr
// $and
// $gt
// $multiply
// $group
// $avg
// $max
// $min
// $sort

// This is much closer to what companies ask.
// Users:
// {
//   name: "John",
//   department: "IT",
//   salary: 60000
// },
// {
//   name: "Alice",
//   department: "IT",
//   salary: 70000
// },
// {
//   name: "Bob",
//   department: "HR",
//   salary: 30000
// },
// {
//   name: "David",
//   department: "HR",
//   salary: 80000
// }
// Question:
// Find departments where:
// annual salary > 600000
// (annual salary = salary × 12)
// Then return:
// [
//   {
//     department: "IT",
//     totalEmployees: 2,
//     avgSalary: 65000,
//     maxSalary: 70000,
//     minSalary: 60000
//   },
//   {
//     department: "HR",
//     totalEmployees: 1,
//     avgSalary: 80000,
//     maxSalary: 80000,
//     minSalary: 80000
//   }
// ]

// Notice:
// Bob (30000)
// must be excluded because:
// 30000 × 12 = 360000
// not greater than 600000.
// Requirements:
// Use:
// $match
// $expr
// $multiply
// $gt
// $group
// $sum
// $avg
// $max
// $min
// $sort

User.aggregate([
    {
        $match: {
            $expr: {
                $gt: [
                    {
                        "$multiply": [
                            "$salary",
                            12
                        ]
                    },
                    600000
                ]
            }
        }
    },
    {
        $group: {
            _id: "$department",
            totalEmployees: {
                $sum: 1
            },
            avgSalary: {
                $avg: "$salary"
            },
            maxSalary: {
                $max: "$salary"
            },
            minSalary: {
                $min: "$salary"
            }
        }
    },
    {
        $project: {
            _id: 0,
            department: "$_id",
            totalEmployees: 1,
            avgSalary: 1,
            maxSalary: 1,
            minSalary: 1
        }
    }
])




// Interview Problem #7 (Real Dashboard Question)
// ==============================================
// Now we're entering conditional aggregation.

// New operators:
// $cond
// $group
// $sum
// $project
// $sort
// Users:
// {
//   name: "John",
//   salary: 70000
// },
// {
//   name: "Alice",
//   salary: 40000
// },
// {
//   name: "Bob",
//   salary: 90000
// },
// {
//   name: "David",
//   salary: 30000
// }
// Question:
// Create a dashboard that returns:
// [
//   {
//     highSalaryEmployees: 2,
//     lowSalaryEmployees: 2
//   }
// ]
// Rule:
// salary >= 50000
// → High Salary
// salary < 50000
// → Low Salary
// Requirement:
// Use:
// $group
// $sum
// $cond
// Hint:
// Inside $sum, $cond can return:
// 1
// or
// 0
// depending on the condition.

user.aggregate([
    {
        $group: {
            _id: null,
            highSalaryEmployees: {
                $sum: {
                    $cond: {
                        if: { $gte: ["$salary", 50000] },
                        then: 1,
                        else: 0
                    }
                }
            },
            lowSalaryEmployees: {
                $sum: {
                    $cond: {
                        if: { $lt: ["$salary", 50000] },
                        then: 1,
                        else: 0
                    }
                }
            }
        }
    },
    {
        $project: {
            _id: 0,
            highSalaryEmployees: 1,
            lowSalaryEmployees: 1
        }
    }
])

// Mini Challenge (1 minute)
// Without writing the full pipeline, tell me what this returns:
// {
//   $sum: {
//     $cond: [
//       { $gte: ["$salary", 50000] },
//       10,
//       5
//     ]
//   }
// }
// What is the final result? This tests whether you truly understand $cond + $sum.
// Answer: if salary >= 50000 it will return 10 else 5 based on this add the sum +10 or +5




// Interview Problem #8 ($ifNull)
// ===============================
// Collections:
// {
//   name: "John",
//   phone: "9876543210"
// },
// {
//   name: "Alice"
// },
// {
//   name: "Bob",
//   phone: null
// }
// Return:
// [
//   {
//     name: "John",
//     phone: "9876543210"
//   },
//   {
//     name: "Alice",
//     phone: "No Phone"
//   },
//   {
//     name: "Bob",
//     phone: "No Phone"
//   }
// ]
// Requirements:
// Use $project
// Use $ifNull
// Think:
// $ifNull: [
//    valueToCheck,
//    replacementValue
// ]
// Write only the $project stage.

User.aggregate([
    {
        $project: {
            name: 1,
            phone: {
                $ifNull: ["$phone", "No Phone"]
            }
        }
    }
])




// Interview Problem #9 ($facet)
// ===============================
// This is a real dashboard pattern.
// Users:
// { name: "John", salary: 70000 }
// { name: "Alice", salary: 30000 }
// { name: "Bob", salary: 90000 }
// { name: "David", salary: 40000 }
// Return:
// {
//   highSalary: [
//     { name: "John", salary: 70000 },
//     { name: "Bob", salary: 90000 }
//   ],

//   lowSalary: [
//     { name: "Alice", salary: 30000 },
//     { name: "David", salary: 40000 }
//   ]
// }
// Requirements:
// Use:
// $facet
// $match
// Question:
// Inside $facet, what are the two pipelines you would write?

User.aggregate([
    {
        $facet: {
            highSalary: [{
                $match: {
                    salary: {
                        $gte: 50000
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                }
            }
            ],
            lowSalary: [{
                $match: {
                    salary: {
                        $lt: 50000
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                }
            }]
        },
    },
])

// What $facet does
// Without $facet:
// Query 1 → High Salary Users
// Query 2 → Low Salary Users
// Two database operations.
// With $facet:
// One dataset
//       |
//       |
//    $facet
//    /    \
// high   low
// Mongo runs multiple pipelines in parallel on the same input.




// Interview Problem #10 ($bucket)
// ==================================================
// Users:
// { name: "John", age: 22 }
// { name: "Alice", age: 28 }
// { name: "Bob", age: 35 }
// { name: "David", age: 42 }
// { name: "Emma", age: 55 }
// Create age groups:
// 20-29
// 30-39
// 40-49
// 50+
// Expected output:
// [
//   {
//     _id: 20,
//     count: 2
//   },
//   {
//     _id: 30,
//     count: 1
//   },
//   {
//     _id: 40,
//     count: 1
//   },
//   {
//     _id: "50+",
//     count: 1
//   }
// ]
// Use:
// $bucket
// $count
// Hint:
// groupBy: "$age"
// boundaries: [...]
// default: "50+"
// Write only the $bucket stage.

User.aggregate([
    {
        $bucket: {
            groupBy: "$age",
            boundaries: [20, 30, 40, 50],
            default: "50+",
            output: {
                count: { $sum: 1 }
            }
        }
    }
])

// But in $bucket, MongoDB automatically creates the _id using the bucket boundaries.
// You write:
// {
//   $bucket: {
//     groupBy: "$age",
//     boundaries: [20,30,40,50]
//   }
// }
// MongoDB internally creates bucket ids like:
// { _id: 20 }
// { _id: 30 }
// { _id: 40 }

// where _id represents the bucket's lower boundary.
// What does groupBy do?
// groupBy: "$age"
// means:
// Take age from each document
// and decide which bucket it belongs to.

// What is output?
// output works like accumulators inside $group.
// Example:
// output: {
//   count: { $sum: 1 }
// }
// means:
// For every bucket,
// count the documents.
// You can use many operators:
// output: {
//   count: { $sum: 1 },
//   avgSalary: { $avg: "$salary" },
//   maxSalary: { $max: "$salary" },
//   users: { $push: "$name" }
// }
// Just like $group.




// Challenge
// ====================================================
// You have 3 collections:
// users
// [
//   {
//     _id: 1,
//     name: "John"
//   },
//   {
//     _id: 2,
//     name: "Mike"
//   }
// ]
// orders:
// [
//   {
//     _id: 101,
//     userId: 1,
//     amount: 500
//   },
//   {
//     _id: 102,
//     userId: 1,
//     amount: 700
//   },
//   {
//     _id: 103,
//     userId: 2,
//     amount: 300
//   }
// ]
// products:
// [
//   {
//     _id: "P1",
//     orderId: 101,
//     category: "Mobile"
//   },
//   {
//     _id: "P2",
//     orderId: 101,
//     category: "Laptop"
//   },
//   {
//     _id: "P3",
//     orderId: 102,
//     category: "Mobile"
//   },
//   {
//     _id: "P4",
//     orderId: 103,
//     category: "TV"
//   }
// ]
// Requirement:
// For every user return:
// [
//   {
//     name: "John",
//     totalOrders: 2,
//     totalSpent: 1200,
//     categories: ["Mobile", "Laptop"]
//   },
//   {
//     name: "Mike",
//     totalOrders: 1,
//     totalSpent: 300,
//     categories: ["TV"]
//   }
// ]
// Rules:
// You must use:
// $lookup
// $unwind
// $group
// $project
// Optional:
// $sort
// $addToSet
// $sum

Order.aggregate([
    {
        $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "orderId",
            as: "products"
        }
    },
    {
        $unwind: "$products"
    },
    {
        $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
        }
    },
    {
        $unwind: "$user"
    },
    {
        $group: {
            _id: "$_id",
            userId: { $first: "$user._id" },
            name: { $first: "$user.name" },
            amount: { $first: "$amount" },
            categories: {
                $push: "$products.category"
            }
        }
    },
    {
        $group: {
            _id: "$userId",
            name: { $first: "$name" },
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: "$amount" },
            categories: {
                $push: "$categories"
            }
        }
    },
    {
        $project: {
            _id: 0,
            name: 1,
            totalOrders: 1,
            totalSpent: 1,
            categories: 1
        }
    }
])

// Why not?
// {
//   $group: {
//     _id: "$userId",
//     name: "$name"
//   }
// }
// MongoDB error.
// Because every field inside $group must use an accumulator.

// Group by user:
// {
//   $group: {
//     _id: "$userId",
//     name: { $first: "$name" }
//   }
// }
// Output:
// {
//   _id: 1,
//   name: "John"
// }

// Interview Memory:
// $first
// Take first value in the group.
// Mostly used to keep fields after grouping.

// Interview Memory
// $setUnion
// Merge arrays and remove duplicates.




// Interview Problem: $replaceRoot
// ===================================
// Collections
// Users
// {
//   _id: 1,
//   name: "John",
//   age: 25
// },
// {
//   _id: 2,
//   name: "Alice",
//   age: 30
// }
// Orders
// {
//   _id: 101,
//   userId: 1,
//   amount: 1000
// },
// {
//   _id: 102,
//   userId: 2,
//   amount: 2000
// }
// Requirement
// Return:
// [
//   {
//     name: "John",
//     age: 25
//   },
//   {
//     name: "Alice",
//     age: 30
//   }
// ]
// Notice:
// NO order fields
// NO user array
// ONLY user document
// Rules:
// Use:
// $lookup
// $unwind
// $replaceRoot

Order.aggregate([
    {
        $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
        }
    },
    {
        $unwind: "$user"
    },
    {
        $replaceRoot: {
            newRoot: "$user"
        }
    }
])

// Think First
// After $lookup:
// {
//   _id: 101,
//   amount: 1000,
//   userId: 1,
//   user: [
//     {
//       _id: 1,
//       name: "John",
//       age: 25
//     }
//   ]
// }

// After $unwind:
// {
//   _id: 101,
//   amount: 1000,
//   userId: 1,
//   user: {
//     _id: 1,
//     name: "John",
//     age: 25
//   }
// }

// After $replaceRoot:
// It does:
// Delete entire current document
// Replace it with user object
// So output becomes:
// {
//   _id: 1,
//   name: "John",
//   age: 25
// }

// Easy Memory Trick:
// Think:
// $project
// --------
// Shape document
// $addFields
// ----------
// Add fields
// $replaceRoot
// ------------
// Throw away whole document
// and use another document instead




// Question 1 — First & Last
// ============================
// Collection:
// employees:
// [
//   {
//     name: "John",
//     department: "IT",
//     joiningYear: 2020
//   },
//   {
//     name: "Sara",
//     department: "IT",
//     joiningYear: 2018
//   },
//   {
//     name: "Mike",
//     department: "IT",
//     joiningYear: 2023
//   },
//   {
//     name: "David",
//     department: "HR",
//     joiningYear: 2019
//   },
//   {
//     name: "Emma",
//     department: "HR",
//     joiningYear: 2021
//   }
// ]
// Requirement:
// For each department return:
// department
// firstEmployee
// lastEmployee
// Rules:
// First employee = earliest joiningYear
// Last employee = latest joiningYear
// Expected IT:-
// {
//   department: "IT",
//   firstEmployee: "Sara",
//   lastEmployee: "Mike"
// }
// Must Use:-
// $sort
// $group
// $first
// $last
// $project
// Questions:-
// Why must $sort come before $group?
// What happens if we remove $sort?
// Write the complete pipeline.

employees.aggregate([
    {
        $sort: {
            joiningYear: 1
        }
    },
    {
        $group: {
            _id: "$department",
            firstEmployee: {
                $first: "$name"
            },
            lastEmployee: {
                $last: "$name"
            }
        }
    },
    {
        $project: {
            _id: 0,
            department: "$_id",
            firstEmployee: 1,
            lastEmployee: 1
        }
    }
])

// Here:
// $first
// $last
// are group accumulators.
// They mean:
// First document entering the group
// Last document entering the group
// Example:
// Documents entering group:
// John  (2020)
// Sara  (2018)
// Mike  (2023)
// Without sorting:
// John enters first
// Mike enters last
// Result:
// {
//   firstEmployee: "John",
//   lastEmployee: "Mike"
// }
// Wrong.
// After sorting by joiningYear:
// Sara  (2018)
// John  (2020)
// Mike  (2023)
// Now:
// $first -> Sara
// $last  -> Mike
// Correct.




// Question 2 — $push vs $addToSet
// ====================================
// Collection:
// [
//   { department:"IT", skill:"Node" },
//   { department:"IT", skill:"MongoDB" },
//   { department:"IT", skill:"Node" },
//   { department:"HR", skill:"Excel" },
//   { department:"HR", skill:"Excel" }
// ]
// Requirement:
// Return for each department:
// department
// allSkills
// uniqueSkills
// Must use:
// $group
// $push
// $addToSet
// $project
// Also answer:
// What is the difference between $push and $addToSet?
//  => Answer push will have the duplicates of elements and addtoset will remove the duplicate of elements.
// More precise:
// $push      → stores every value
// $addToSet  → stores only unique values
// What will IT output look like?

User.aggregate([
    {
        $group: {
            _id: "$department",
            allSkills: {
                $push: "$skill"
            },
            uniqueSkills: {
                $addToSet: "$skill"
            }
        }
    },
    {
        $project: {
            _id: 0,
            department: "$_id",
            allSkills: 1,
            uniqueSkills: 1
        }
    }
])
// Interview Follow-up:
// Suppose we have:
// {
//   department: "IT",
//   employee: "John",
//   skill: "Node"
// }
// and
// {
//   department: "IT",
//   employee: "Sara",
//   skill: "Node"
// }
// Then:
// $addToSet: "$skill"
// returns:
// ["Node"]
// But:
// $addToSet: {
//   employee: "$employee",
//   skill: "$skill"
// }
// returns:
// [
//   { employee:"John", skill:"Node" },
//   { employee:"Sara", skill:"Node" }
// ]
// Because the whole object must be identical to be considered a duplicate.
// Very common interview question.



// Question 3 — Array Operators ($size, $filter, $map)
// ====================================================
// Collection:
// [
//   {
//     name: "John",
//     skills: [
//       { name: "Node", exp: 3 },
//       { name: "MongoDB", exp: 1 }
//     ]
//   },
//   {
//     name: "Sara",
//     skills: [
//       { name: "React", exp: 5 },
//       { name: "Node", exp: 4 }
//     ]
//   }
// ]
// Requirement:
// Return:
// name
// skillCount
// experiencedSkills
// skillNames
// Where:
// skillCount = total skills
// experiencedSkills = only skills with exp > 2
// skillNames = array containing only skill names
// Must Use:-
// $project
// $size
// $filter
// $map
// Expected for John:-
// {
//   name: "John",
//   skillCount: 2,
//   experiencedSkills: [
//     { name:"Node", exp:3 }
//   ],
//   skillNames: [
//     "Node",
//     "MongoDB"
//   ]
// }

User.aggregate([
    {
        $project: {
            _id: 0,
            name: 1,

            skillCount: {
                $size: "$skills"
            },

            experiencedSkills: {
                $filter: {
                    input: "$skills",
                    as: "skill",
                    cond: {
                        $gt: ["$$skill.exp", 2]
                    }
                }
            },

            skillNames: {
                $map: {
                    input: "$skills",
                    as: "skill",
                    in: "$$skill.name"
                }
            }
        }
    }
])




// Interview Question:
// =============================================
// What is the difference?
// $filter
// {
//   $filter: {
//     input: "$skills",
//     as: "skill",
//     cond: {
//       $gt: ["$$skill.exp", 2]
//     }
//   }
// }
// Output:
// [
//   { name:"Node", exp:3 }
// ]
// $map
// {
//   $map: {
//     input: "$skills",
//     as: "skill",
//     in: "$$skill.name"
//   }
// }
// Output:
// ["Node","MongoDB"]
// One line answer:

// $filter = ?
// $map = ?

// Answer:
// $filter = only filter the elements that satisfies the condition
// $map = loop through the array
// ✅ Correct.
// For interview language:
// $filter = returns only the array elements that match a condition.
// $map = transforms each array element and returns a new array.







// Question 4 — String Operators
// =======================================
// Collection:
// [
//   {
//     firstName: " john ",
//     lastName: " doe ",
//     email: "JOHN@GMAIL.COM"
//   },
//   {
//     firstName: " sara ",
//     lastName: " smith ",
//     email: "SARA@GMAIL.COM"
//   }
// ]
// Requirement:
// Return:
// fullName
// upperName
// normalizedEmail
// emailParts
// nameLength
// Where:
// fullName
// Remove spaces and join names.
// "john doe"
// upperName
// "JOHN DOE"
// normalizedEmail
// Convert email to lowercase.
// "john@gmail.com"
// emailParts
// Split email by @
// ["john", "gmail.com"]
// nameLength
// Length of:
// "john doe"
// which is:
// 8
// (4 + 1 + 3)
// Must Use:-
// $project
// $trim
// $concat
// $toUpper
// $toLower
// $split
// $strLenCP
// Expected Output
// {
//   fullName: "john doe",
//   upperName: "JOHN DOE",
//   normalizedEmail: "john@gmail.com",
//   emailParts: ["john","gmail.com"],
//   nameLength: 8
// }
User.aggregate([
    {
        $project: {
            fullName: {
                $concat: [
                    { $trim: { input: "$firstName" } },
                    " ",
                    { $trim: { input: "$lastName" } }
                ]
            },
            upperName: {
                input: {
                    $concat: [
                        { $trim: { input: "$firstName" } },
                        " ",
                        { $trim: { input: "$lastName" } }
                    ]
                }
            },
            normalizedEmail: {
                $toLower: "$email"
            },
            emailParts: {
                $split: [{ $toLower: "$email" }, '@']
            },
            nameLength: {
                $steLenCP: {
                    $concat: [
                        { $trim: { input: "$firstName" } },
                        " ",
                        { $trim: { input: "$lastName" } }
                    ]
                }
            }
        }
    }
])
// Interview Bonus Question:-
// What is the difference between:
// $strLenCP: Length of the string
// and
// $strLenBytes: Length of bytes memory 
// ✅ Mostly correct.
// Better answer:
// Operator	Counts
// $strLenCP	Characters (Unicode code points)
// $strLenBytes	Actual UTF-8 bytes
// Example:
// A
// $strLenCP = 1
// $strLenBytes = 1
// Example:
// 😀
// $strLenCP = 1
// $strLenBytes = 4
// Because one emoji is one character but uses four bytes.





// Question 5 — Set Operators:
// =====================================================
// Collection:
// [
//     {
//         name: "John",
//         skills: ["Node", "MongoDB", "Redis"]
//     },
//     {
//         name: "Sara",
//         skills: ["Node", "React", "AWS"]
//     }
// ]
// Requirement:
// Return:
// commonSkills
// allSkills
// johnOnlySkills
// isSubset
// Must use:
// $setIntersection
// $setUnion
// $setDifference
// $setIsSubset
// Expected:
// {
//     commonSkills: ["Node"],
//     allSkills: ["Node", "MongoDB", "Redis", "React", "AWS"],
//     johnOnlySkills: ["MongoDB", "Redis"],
//     isSubset: false
// }
// Hint:
// You will probably need:
// $arrayElemAt
// to access John's and Sara's skills.

User.aggregate([
    {
        $group: {
            _id: null,
            users: {
                $push: "$$ROOT" // {
                // users: [
                //      {
                //          name: "John",
                //          skills: ["Node", "MongoDB", "Redis"]
                //      },
                //      {
                //          name: "Sara",
                //          skills: ["Node", "React", "MongoDB"]
                //      }
                //  ]
                // }
            }
        }
    },
    {
        $project: {
            commonSkills: {
                $setIntersection: [
                    { $arrayElemAt: ["$users.skills", 0] },
                    { $arrayElemAt: ["$users.skills", 1] }
                ] // ["Node", "MongoDB"]
            },
            allSkills: {
                $setUnion: [
                    { $arrayElemAt: ["$users.skills", 0] },
                    { $arrayElemAt: ["$users.skills", 1] }
                ] // ["Node", "MongoDB", "Redis", "React"]
            },
            johnOnlySkills: {
                $setDifference: [
                    { $arrayElemAt: ["$users.skills", 0] },
                    { $arrayElemAt: ["$users.skills", 1] }
                ] // ["Redis"]
            },
            isSubset: {
                $setIsSubset: [
                    { $arrayElemAt: ["$users.skills", 0] },
                    { $arrayElemAt: ["$users.skills", 1] }
                ] // false
            }
        }
    }
])
// $setIsSubset Rules:
// Returns true when:-
// javascript
// // 1. First array is empty
// $setIsSubset: [[], ["Node", "MongoDB"]]
// // true - empty array is subset of any array
// // 2. All elements of first exist in second
// $setIsSubset: [["Node"], ["Node", "MongoDB", "Redis"]]
// // true - "Node" exists in second array
// // 3. Both arrays are empty
// $setIsSubset: [[], []]
// // true
// // 4. Identical arrays
// $setIsSubset: [["Node", "MongoDB"], ["MongoDB", "Node"]]
// // true - same elements (order doesn't matter)
// Returns false when:-
// javascript
// // 1. Any element in first is missing from second
// $setIsSubset: [["Node", "MongoDB", "Redis"], ["Node", "React", "AWS"]]
// // false - "MongoDB" and "Redis" not in second
// // 2. Second array is empty but first is not
// $setIsSubset: [["Node"], []]
// // false - nothing can be subset of empty array (except empty itself)

// Interview Lesson:
// Whenever you see:
// Compare document A with document B
// Compare user 1 with user 2
// Compare two arrays from different documents
// Think:
// $group
//    ↓
// $push
//    ↓
// $arrayElemAt
//    ↓
// comparison operator
// because MongoDB aggregation normally works on one document at a time.






// Question 6 — Date Operators (Very Common in Real Projects)
// =========================================================
// Collection:
// [
//   {
//     name: "John",
//     joinedAt: ISODate("2023-01-15T10:30:00Z")
//   },
//   {
//     name: "Sara",
//     joinedAt: ISODate("2024-06-20T14:20:00Z")
//   }
// ]
// Requirement:
// Return:
// name
// joinYear
// joinMonth
// formattedDate
// nextYearDate
// experienceDays
// Must Use:
// $project
// $year
// $month
// $dateToString
// $dateAdd
// $dateDiff
// Expected Output For John
// Something like:
// {
//   name: "John",
//   joinYear: 2023,
//   joinMonth: 1,
//   formattedDate: "15-01-2023",
//   nextYearDate: ISODate("2024-01-15T10:30:00Z"),
//   experienceDays: <number_of_days>
// }
User.aggregate([
    {
        $project: {
            _id: 0,
            name: 1,
            joinYear: { $year: "$joinedAt" },
            joinMonth: { $month: "$joinedAt" },
            formattedDate: { $dateToString: { format: "%d-%m-%Y", date: "$joinedAt" } },
            nextYearDate: {
                $dateAdd: {
                    startDate: "$joinedAt",
                    unit: "year",
                    amount: 1
                } // Add 1 year to joinedAt
            },
            experienceDays: {
                $dateDiff: {
                    startDate: "$joinedAt",
                    endDate: "$$NOW",
                    unit: "day"
                } // How many days between joinedAt and now
            }
        }
    }
])
// Bonus Interview Question:-
// What is the difference between:
// $month -> get the month in the date string
// and
// $dateToString -> get the date full
// Operator	         Output
// $month	       Number (1-12)
// $dateToString   Custom formatted string
// Example:
// {
//   $month: "$joinedAt"
// }
// Output:
// 1
// {
//   $dateToString: {
//     format: "%B",
//     date: "$joinedAt"
//   }
// }
// Output:
// January
// So:
// $month → numeric extraction
// $dateToString → formatting




// Question 7 — Mixed Interview Question
// ====================================================
// Now we'll combine almost everything you've learned:
// Must use:
// $match
// $expr
// $filter
// $size
// $map
// $cond
// $multiply
// $dateDiff
// $project
// Collection:
// [
//   {
//     name: "John",
//     salary: 50000,
//     joinedAt: ISODate("2023-01-15"),
//     skills: [
//       { name: "Node", exp: 3 },
//       { name: "MongoDB", exp: 1 }
//     ]
//   },
//   {
//     name: "Sara",
//     salary: 80000,
//     joinedAt: ISODate("2022-01-10"),
//     skills: [
//       { name: "React", exp: 5 },
//       { name: "Node", exp: 4 }
//     ]
//   }
// ]
// Requirement:
// Return only users where:
// salary * 12 > 600000
// AND
// at least 2 skills
User.aggregate([
    {
        $match: {
            $expr: {
                $and: [
                    {
                        $gt: [
                            { $multiply: ["$salary", 12] },
                            600000
                        ]
                    },
                    {
                        $gt: [
                            { $size: "$skills" },
                            1
                        ]
                    }
                ]
            }
        }
    },
    {
        $project: {
            _id: 0,
            name: 1,
            annualSalary: { $multiply: ["$salary", 12] },
            skillCount: { $size: "$skills" },
            experiencedSkills: {
                $filter: {
                    input: "$skills",
                    as: "skill",
                    cond: {
                        $gt: ["$$skill.exp", 2]
                    }
                }
            },
            skillNames: {
                $map: {
                    input: "$skills",
                    as: "skill",
                    in: "$$skill.name"
                }
            },
            experienceDays: {
                $dateDiff: {
                    startDate: "$joinedAt",
                    endDate: "$$NOW",
                    unit: "day"
                }
            },
            level: {
                $cond: {
                    if: { $gt: [{ $multiply: ["$salary", 12] }, 700000] },
                    then: "Senior",
                    else: "Junior"
                }
            },
        }
    }
])
// Shortcut For Interviews
// When reading requirements:

// Contains words like:
// where
// only
// greater than
// less than
// equal
// at least
// Think:
// $match

// Contains words like:
// return
// show
// output
// display
// create field
// calculate field
// format
// Think:
// $project





// Now the Most Important Interview Combination
// =============================================
// Collections:
// users
// [
//   {
//     _id: 1,
//     name: "John"
//   },
//   {
//     _id: 2,
//     name: "Sara"
//   }
// ]
// orders
// [
//   {
//     _id: 101,
//     userId: 1,
//     amount: 5000
//   },
//   {
//     _id: 102,
//     userId: 1,
//     amount: 7000
//   },
//   {
//     _id: 103,
//     userId: 2,
//     amount: 3000
//   }
// ]
// Requirement:
// Return:
// name
// totalOrders
// totalAmount
// avgAmount
// Expected:
// {
//   name: "John",
//   totalOrders: 2,
//   totalAmount: 12000,
//   avgAmount: 6000
// }
// Must Use
// $lookup
// $unwind
// $group
// $sum
// $avg
// $project
Order.aggregate([
    {
        // In $lookup: No $. Field names only.
        $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
        }
    },
    {
        $unwind: "$user"
    },
    {
        $group: {
            _id: "$userId",
            // Why $first?
            // Because every grouped order for the same user has the same name.
            // We just need one copy.
            name: {
                $first: "$user.name"
            },
            totalOrders: {
                $sum: 1
            },
            totalAmount: {
                $sum: "$amount"
            },
            avgAmount: {
                $avg: "$amount"
            }
        }
    },
    {
        $project: {
            name: "$user.name",
            totalOrders: 1,
            totalAmount: 1,
            avgAmount: 1
        }
    }
])




// Collections:
// ===========================================
// users:
// [
//   {
//     _id: 1,
//     name: "John"
//   },
//   {
//     _id: 2,
//     name: "Sara"
//   }
// ]
// orders:
// [
//   {
//     _id: 101,
//     userId: 1,
//     amount: 5000
//   },
//   {
//     _id: 102,
//     userId: 1,
//     amount: 15000
//   },
//   {
//     _id: 103,
//     userId: 2,
//     amount: 2000
//   }
// ]
// Requirement:
// Return users with only high-value orders.
// High-value means:
// amount > 10000
// Expected for John:
// {
//   _id: 1,
//   name: "John",
//   highOrders: [
//     {
//       _id: 102,
//       userId: 1,
//       amount: 15000
//     }
//   ]
// }
// Must use:
// $lookup
// pipeline
// let
// $expr
User.aggregate([
    {
        $lookup: {
            from: "orders",
            let: {
                userId: "$_id"
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$userId", "$$userId"]
                                },
                                {
                                    $gt: ["$amount", 10000]
                                }
                            ]
                        }
                    }
                }
            ],
            as: "highOrders"
        }
    },
    {
        $project: {
            _id: 1,
            name: 1,
            highOrders: 1
        }
    }
])




// First $facet Question
// ==========================================
// Collection::
// [
//   { name: "John", salary: 90000, department: "IT" },
//   { name: "Sara", salary: 40000, department: "HR" },
//   { name: "Mike", salary: 120000, department: "IT" },
//   { name: "Anna", salary: 35000, department: "HR" }
// ]
// Requirement:
// Return in one query:
// {
//   highSalaryUsers: salary > 50000,
//   lowSalaryUsers: salary <= 50000,
//   departmentStats: total employees per department
// }
// Must use:
// $facet
// $match
// $group
// $project
User.aggregate([
    {
        $facet: {
            highSalaryUsers: [
                {
                    $match: {
                        salary: { $gt: 50000 }
                    }
                },
                {
                    $project: {
                        name: 1,
                        salary: 1,
                        department: 1
                    }
                }
            ],
            lowSalaryUsers: [
                {
                    $match: {
                        salary: { $lte: 50000 }
                    }
                },
                {
                    $project: {
                        name: 1,
                        salary: 1,
                        department: 1
                    }
                }
            ],
            departmentStats: [
                {
                    $group: {
                        _id: "$department",
                        totalEmployees: {
                            $sum: 1
                        }
                    }
                }
            ]
        }
    }
])
// Interview Question:
// Why did I not use $expr here?
// {
//   salary: { $gt: 50000 }
// }
// instead of
// {
//   $expr: {
//     $gt: ["$salary", 50000]
//   }
// }
// Answer:-
// because we are checking condition for fixed value
// Use normal query operators when comparing with a fixed value
// {
//   salary: { $gt: 50000 }
// }
// Here MongoDB can directly check:
// salary > 50000
// No expression evaluation is needed.

// Use $expr when comparing fields, variables, or expressions
// Field vs Field:
// {
//   $expr: {
//     $gt: ["$salary", "$bonus"]
//   }
// }
// Meaning:
// salary > bonus




// BUCKET:
// ==============================================
// [
//   { name: "John", age: 25 },
//   { name: "Sara", age: 28 },
//   { name: "Mike", age: 35 },
//   { name: "Anna", age: 42 },
//   { name: "Tom", age: 47 }
// ]
// input:
User.aggregate[{
    $bucket: {
        groupBy: "$age",
        boundaries: [20, 30, 40, 50],
        default: "50+",
        output: {
            count: {
                $sum: 1
            },
            users: {
                $push: "$name"
            }
        }
    }
}]
// output:
// [
//   {
//     _id: 20,
//     count: 2,
//     users: ["John", "Sara"]
//   },
//   {
//     _id: 30,
//     count: 1,
//     users: ["Mike"]
//   },
//   {
//     _id: 40,
//     count: 2,
//     users: ["Anna", "Tom"]
//   }
// ]




// Collections
// ============================================
// users
// [
//   {
//     _id: 1,
//     name: "John",
//     age: 25
//   },
//   {
//     _id: 2,
//     name: "Sara",
//     age: 35
//   },
//   {
//     _id: 3,
//     name: "Mike",
//     age: 45
//   }
// ]
// orders
// [
//   {
//     _id: 101,
//     userId: 1,
//     amount: 1000
//   },
//   {
//     _id: 102,
//     userId: 1,
//     amount: 2000
//   },
//   {
//     _id: 103,
//     userId: 2,
//     amount: 1500
//   },
//   {
//     _id: 104,
//     userId: 3,
//     amount: 3000
//   },
//   {
//     _id: 105,
//     userId: 3,
//     amount: 4000
//   }
// ]
// Requirement
// Return:
// {
//   topCustomers: [
//     {
//       name: "Mike",
//       totalSpent: 7000
//     },
//     {
//       name: "John",
//       totalSpent: 3000
//     }
//   ],
//   ageDistribution: [
//     {
//       _id: 20,
//       count: 1
//     },
//     {
//       _id: 30,
//       count: 1
//     },
//     {
//       _id: 40,
//       count: 1
//     }
//   ]
// }
// Must Use:-
// $lookup
// $unwind
// $group
// $sort
// $limit
// $facet
// $bucket
User.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "userId",
      as: "order"
    }
  },
  {
    $unwind: "$order"
  },
  {
    $group: {
      _id: "$_id",
      name: {
        $first: "$name"
      },
      age: {
        $first: "$age"
      },
      totalSpent: {
        $sum: "$order.amount"
      }
    }
  },
  {
    $facet: {
      topCustomers: [
        {
          $sort: {
            totalSpent: -1
          }
        },
        {
          $limit: 2
        },
        {
          $project: {
            _id: 0,
            name: 1,
            totalSpent: 1
          }
        }
      ],
      ageDistribution: [
        {
          $bucket: {
            groupBy: "$age",
            boundaries: [20, 30, 40, 50],
            default: "50+",
            output: {
              count: {
                $sum: 1
              }
            }
          }
        }
      ]
    }
  }
])