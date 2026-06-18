const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Review = require("../models/Review");


// ==================================================
// $match
// Filter documents
// Similar to find()
// ==================================================

exports.matchUsers = async (req, res) => {
  const users = await User.aggregate([
    {
      $match: {
        age: { $gte: 25 }
      }
    }
  ]);

  res.json(users);
};


// ==================================================
// $project
// Select, remove, rename fields
// ==================================================

exports.projectUsers = async (req, res) => {
  const users = await User.aggregate([
    {
      $project: {
        name: 1,
        email: 1,
        age: 1
      }
    }
  ]);

  res.json(users);
};


// ==================================================
// $addFields
// Add new fields without removing old fields
// ==================================================

exports.addFieldsUsers = async (req, res) => {
  const users = await User.aggregate([
    {
      $addFields: {
        annualSalary: {
          $multiply: ["$salary", 12]
        }
      }
    }
  ]);

  res.json(users);
};


// ==================================================
// $unset
// Remove field(s)
// ==================================================

exports.unsetUsers = async (req, res) => {
  const users = await User.aggregate([
    {
      $unset: ["password", "__v"]
    }
  ]);

  res.json(users);
};


// ==================================================
// $limit
// Return first N documents
// ==================================================

exports.limitUsers = async (req, res) => {
  const users = await User.aggregate([
    {
      $limit: 5
    }
  ]);

  res.json(users);
};


// ==================================================
// $skip
// Skip first N documents
// ==================================================

exports.skipUsers = async (req, res) => {
  const users = await User.aggregate([
    {
      $skip: 5
    }
  ]);

  res.json(users);
};


// ==================================================
// $sort
// Sort documents
// 1 = ASC
// -1 = DESC
// ==================================================

exports.sortUsers = async (req, res) => {
  const users = await User.aggregate([
    {
      $sort: {
        salary: -1
      }
    }
  ]);

  res.json(users);
};


// ==================================================
// $group
// Group documents
// Used with accumulators
// ==================================================

exports.groupUsers = async (req, res) => {
  const users = await User.aggregate([
    {
      $group: {
        _id: "$department",
        totalSalary: {
          $sum: "$salary"
        }
      }
    }
  ]);

  res.json(users);
};


// ==================================================
// $unwind
// Convert array elements into documents
// ==================================================

exports.unwindUsers = async (req, res) => {
  const users = await User.aggregate([
    {
      $unwind: "$skills"
    }
  ]);

  res.json(users);
};


// ==================================================
// $lookup
// Join collections
// ==================================================

exports.lookupOrders = async (req, res) => {
  const orders = await Order.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    }
  ]);

  res.json(orders);
};


// ==================================================
// $lookup with pipeline
// Advanced join
// ==================================================

exports.lookupPipelineOrders = async (req, res) => {
  const orders = await Order.aggregate([
    {
      $lookup: {
        from: "users",
        let: {
          uid: "$userId"
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$uid"]
              }
            }
          },
          {
            $project: {
              name: 1,
              email: 1
            }
          }
        ],
        as: "user"
      }
    }
  ]);

  res.json(orders);
};


// ==================================================
// $count
// Count documents
// ==================================================

exports.countUsers = async (req, res) => {
  const users = await User.aggregate([
    {
      $match: {
        age: { $gte: 18 }
      }
    },
    {
      $count: "totalUsers"
    }
  ]);

  res.json(users);
};


// ==================================================
// $facet
// Multiple pipelines in one query
// ==================================================

exports.facetUsers = async (req, res) => {
  const users = await User.aggregate([
    {
      $facet: {
        activeUsers: [
          {
            $match: {
              isActive: true
            }
          }
        ],

        inactiveUsers: [
          {
            $match: {
              isActive: false
            }
          }
        ]
      }
    }
  ]);

  res.json(users);
};


// ==================================================
// $bucket
// Manual ranges
// ==================================================

exports.bucketUsers = async (req, res) => {
  const users = await User.aggregate([
    {
      $bucket: {
        groupBy: "$age",
        boundaries: [20, 30, 40, 50],
        default: "Others"
      }
    }
  ]);

  res.json(users);
};


// ==================================================
// $bucketAuto
// Mongo creates ranges automatically
// ==================================================

exports.bucketAutoUsers = async (req, res) => {
  const users = await User.aggregate([
    {
      $bucketAuto: {
        groupBy: "$salary",
        buckets: 5
      }
    }
  ]);

  res.json(users);
};


// ==================================================
// $sample
// Random documents
// ==================================================

exports.sampleProducts = async (req, res) => {
  const products = await Product.aggregate([
    {
      $sample: {
        size: 5
      }
    }
  ]);

  res.json(products);
};


// ==================================================
// $replaceRoot
// Replace whole document
// ==================================================

exports.replaceRootOrders = async (req, res) => {
  const orders = await Order.aggregate([
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
  ]);

  res.json(orders);
};


// ==================================================
// $unionWith
// Merge collections
// ==================================================

exports.unionUsersReviews = async (req, res) => {
  const data = await User.aggregate([
    {
      $unionWith: {
        coll: "reviews"
      }
    }
  ]);

  res.json(data);
};


// ==================================================
// $merge
// Save result into another collection
// ==================================================

exports.mergeUsers = async (req, res) => {
  await User.aggregate([
    {
      $group: {
        _id: "$department",
        totalSalary: {
          $sum: "$salary"
        }
      }
    },
    {
      $merge: "departmentreports"
    }
  ]);

  res.json({
    message: "Merged Successfully"
  });
};


// ==================================================
// $out
// Create/Replace collection
// ==================================================

exports.outUsers = async (req, res) => {
  await User.aggregate([
    {
      $match: {
        isActive: true
      }
    },
    {
      $out: "activeusers"
    }
  ]);

  res.json({
    message: "Collection Created"
  });
};

// ==================================================
//                EXAMPLES
// ==================================================

// Top 5 Highest Paid Users
exports.topPaidUsers = async (req, res) => {
  const data = await User.aggregate([
    {
      $sort: { salary: -1 }
    },
    {
      $limit: 5
    },
    {
      $project: {
        name: 1,
        email: 1,
        salary: 1
      }
    }
  ]);

  res.json(data);
};

// Department-wise Analytics Dashboard
exports.departmentAnalytics = async (req, res) => {
  const data = await User.aggregate([
    {
      $group: {
        _id: "$department",

        totalUsers: { $sum: 1 },
        totalSalary: { $sum: "$salary" },
        avgSalary: { $avg: "$salary" },
        maxSalary: { $max: "$salary" },
        minSalary: { $min: "$salary" }
      }
    },
    {
      $sort: { totalSalary: -1 }
    }
  ]);

  res.json(data);
};

// Product Order Revenue Report
// Assuming:
// Order has items: [{ productId, qty, price }]
exports.productRevenueReport = async (req, res) => {
  const data = await Order.aggregate([
    { $unwind: "$items" },

    {
      $group: {
        _id: "$items.productId",

        totalRevenue: {
          $sum: {
            $multiply: ["$items.qty", "$items.price"]
          }
        },

        totalQty: { $sum: "$items.qty" }
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

    { $unwind: "$product" },

    {
      $project: {
        productName: "$product.name",
        totalRevenue: 1,
        totalQty: 1
      }
    },

    {
      $sort: { totalRevenue: -1 }
    }
  ]);

  res.json(data);
};

// Review Sentiment Grouping
// Assuming:
// Review has rating: 1–5
exports.reviewSentiment = async (req, res) => {
  const data = await Review.aggregate([
    {
      $project: {
        productId: 1,
        rating: 1,

        sentiment: {
          $cond: {
            if: { $gte: ["$rating", 4] },
            then: "POSITIVE",
            else: {
              $cond: {
                if: { $eq: ["$rating", 3] },
                then: "NEUTRAL",
                else: "NEGATIVE"
              }
            }
          }
        }
      }
    },

    {
      $group: {
        _id: "$sentiment",
        count: { $sum: 1 }
      }
    }
  ]);

  res.json(data);
};

// Active vs Inactive Users Segmentation
// Assuming:
// isActive: true/false
exports.userSegmentation = async (req, res) => {
  const data = await User.aggregate([
    {
      $facet: {
        activeUsers: [
          { $match: { isActive: true } },
          { $count: "count" }
        ],

        inactiveUsers: [
          { $match: { isActive: false } },
          { $count: "count" }
        ],

        totalUsers: [
          { $count: "count" }
        ]
      }
    }
  ]);

  res.json(data);
};



// ==================================================
//            REAL INTERVIEW TRAPS
// ==================================================

// Trap 1: $match position matters (BIG ONE)
// Wrong (slow, expensive)
User.aggregate([
  {
    $project: { name: 1, salary: 1 }
  },
  {
    $match: { salary: { $gt: 50000 } }
  }
]);
// Correct (fast)
User.aggregate([
  {
    $match: { salary: { $gt: 50000 } }
  },
  {
    $project: { name: 1, salary: 1 }
  }
]);

// Trap 2: $unwind explosion
// Dangerous pipeline
User.aggregate([
  { $unwind: "$orders" },
  { $unwind: "$orders.items" }
]);
// Problem:
// If 1 user → 100 orders → 10 items each
// You just created 1000 documents per user

// Trap 3: $lookup misuse
// Bad
Order.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user"
    }
  }
]);
// Problem:
// No filtering before join
// Joins huge datasets
// Fix mindset:
// 👉 Always $match before $lookup

// Trap 4: $group on massive dataset
// Bad
Order.aggregate([
  { $group: { _id: "$userId", total: { $sum: "$amount" } } }
]);
// Problem:
// grouping millions of records without filtering
// Fix:
Order.aggregate([
  { $match: { status: "PAID" } },
  { $group: { _id: "$userId", total: { $sum: "$amount" } } }
]);




// ==================================================
//          MULTI-COLLECTION DEEP PIPELINES
// ==================================================
// Question : “Get top 3 users by total order value including user details and only paid orders”
// Answer:
exports.topUsersByRevenue = async (req, res) => {
  const data = await Order.aggregate([
    // STEP 1: filter early
    {
      $match: {
        status: "PAID"
      }
    },

    // STEP 2: calculate revenue per order item
    {
      $unwind: "$items"
    },

    {
      $group: {
        _id: "$userId",
        totalRevenue: {
          $sum: {
            $multiply: ["$items.qty", "$items.price"]
          }
        }
      }
    },

    // STEP 3: join user collection
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user"
      }
    },

    { $unwind: "$user" },

    // STEP 4: shape output
    {
      $project: {
        name: "$user.name",
        email: "$user.email",
        totalRevenue: 1
      }
    },

    // STEP 5: ranking
    { $sort: { totalRevenue: -1 } },
    { $limit: 3 }
  ]);

  res.json(data);
};



// ==================================================
//          PERFORMANCE OPTIMIZATION RULES
// ==================================================

// Rule 1: $match first ALWAYS
// Why:
// reduces dataset early
// enables index usage

// Rule 2: Index-aware filtering
// If you run:
// { $match: { email: "test@gmail.com" } }
// Make sure index exists:
// db.users.createIndex({ email: 1 });

// Rule 3: Push $match before $lookup
// Bad:
// [ lookup → match ]
// Good:
// [ match → lookup ]

// Rule 4: Avoid $project too early (in complex flows)
// Why?
// You might remove fields needed later
// Rule 5: Limit early when possible
// [
//   { $match: {...} },
//   { $sort: {...} },
//   { $limit: 100 },
//   { $lookup: {...} }
// ]
// Don’t join 1M rows if you only need 100

// Rule 6: Avoid deep $unwind unless necessary
// If data is deeply nested:
// consider restructuring schema instead




// ==================================================
//          DESIGN AGGREGATIONS
// ==================================================

// Final structure ALWAYS:
// $match → $sort → $group → $lookup → $project → $limit

