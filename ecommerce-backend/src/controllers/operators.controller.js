const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Review = require("../models/Review");

// ==================================================
// ACCUMULATORS
// ==================================================

// $sum
exports.sumSalary = async (req, res) => {
  const data = await User.aggregate([
    {
      $group: {
        _id: null,
        totalSalary: { $sum: "$salary" }
      }
    }
  ]);
  res.json(data);
};

// $avg
exports.avgSalary = async (req, res) => {
  const data = await User.aggregate([
    {
      $group: {
        _id: null,
        avgSalary: { $avg: "$salary" }
      }
    }
  ]);
  res.json(data);
};

// $min
exports.minSalary = async (req, res) => {
  const data = await User.aggregate([
    {
      $group: {
        _id: null,
        minSalary: { $min: "$salary" }
      }
    }
  ]);
  res.json(data);
};

// $max
exports.maxSalary = async (req, res) => {
  const data = await User.aggregate([
    {
      $group: {
        _id: null,
        maxSalary: { $max: "$salary" }
      }
    }
  ]);
  res.json(data);
};

// $push
exports.pushSkills = async (req, res) => {
  const data = await User.aggregate([
    {
      $group: {
        _id: null,
        allSkills: { $push: "$skills" } // push operator adds values to an array, allowing for duplicates.
      }
    }
  ]);
  res.json(data);
};

// $addToSet
exports.uniqueDepartments = async (req, res) => {
  const data = await User.aggregate([
    {
      $group: {
        _id: null,
        departments: { $addToSet: "$department" } // addToSet operator adds unique values to an array, ensuring that there are no duplicates.
      }
    }
  ]);
  res.json(data);
};

// $first
exports.firstUser = async (req, res) => {
  const data = await User.aggregate([
    { $sort: { createdAt: 1 } },
    {
      $group: {
        _id: null,
        firstUser: { $first: "$name" } // first operator returns the value of the first document in the group. 
        // It is often used in conjunction with $sort to get the first document based on a specific order.
      }
    }
  ]);
  res.json(data);
};

// $last
exports.lastUser = async (req, res) => {
  const data = await User.aggregate([
    { $sort: { createdAt: 1 } },
    {
      $group: {
        _id: null,
        lastUser: { $last: "$name" } // last operator returns the value of the last document in the group.
        // It is often used in conjunction with $sort to get the last document based on a specific order.
      }
    }
  ]);
  res.json(data);
};

// $count (inside group alternative)
exports.countUsers = async (req, res) => {
  const data = await User.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 }
      }
    }
  ]);
  res.json(data);
};


// ==================================================
// ARITHMETIC OPERATORS
// ==================================================

exports.arithmeticExample = async (req, res) => {
  const data = await User.aggregate([
    {
      $project: {
        name: 1,

        add: { $add: ["$salary", 1000] }, // Add 1000 to salary
        subtract: { $subtract: ["$salary", 500] }, // Subtract 500 from salary
        multiply: { $multiply: ["$salary", 12] }, // Multiply salary by 12
        divide: { $divide: ["$salary", 12] }, // value of salary divided by 12
        mod: { $mod: ["$age", 2] } // get remainder of age divided by 2
      }
    }
  ]);

  res.json(data);
};


// ==================================================
// STRING OPERATORS
// ==================================================

exports.stringOps = async (req, res) => {
  const data = await User.aggregate([
    {
      $project: {
        name: 1,

        upper: { $toUpper: "$name" },
        lower: { $toLower: "$name" },

        fullName: {
          $concat: ["$firstName", " ", "$lastName"]
        }
      }
    }
  ]);

  res.json(data);
};


// ==================================================
// ARRAY OPERATORS
// ==================================================

exports.arrayOps = async (req, res) => {
  const data = await User.aggregate([
    {
      $project: {
        name: 1,

        size: { $size: "$skills" },
        firstSkill: { $arrayElemAt: ["$skills", 0] } // arrayElemAt operator retrieves the element at the specified index from an array. 
        // In this case, it retrieves the first skill (index 0) from the skills array.
      }
    }
  ]);

  res.json(data);
};


// ==================================================
// CONDITIONAL OPERATORS
// ==================================================

exports.conditionalOps = async (req, res) => {
  const data = await User.aggregate([
    {
      $project: {
        name: 1,

        phone: {
          $ifNull: ["$phone", "NO_PHONE"] // ifNull operator checks if the phone field is null or missing.
          //  If it is, it returns "NO_PHONE"; otherwise, it returns the actual phone value.
        },

        status: {
          $cond: {
            if: { $gte: ["$salary", 50000] },
            then: "HIGH",
            else: "LOW"
          }
        }
      }
    }
  ]);

  res.json(data);
};


// ==================================================
// COMPARISON OPERATORS
// ==================================================

exports.comparisonOps = async (req, res) => {
  const data = await User.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            { $gt: ["$salary", 30000] },
            { $gte: ["$age", 25] },
            { $lt: ["$age", 60] }
          ]
        }
      }
    }
  ]);

  res.json(data);
};


// ==================================================
// LOGICAL OPERATORS
// ==================================================

exports.logicalOps = async (req, res) => {
  const data = await User.aggregate([
    {
      $match: {
        $expr: {
          $or: [
            { $gt: ["$salary", 70000] },
            { $eq: ["$department", "IT"] }
          ]
        }
      }
    }
  ]);

  res.json(data);
};


// NOT example
exports.notExample = async (req, res) => {
  const data = await User.aggregate([
    {
      $match: {
        $expr: {
          $not: [
            { $gt: ["$salary", 50000] }
          ]
        }
      }
    }
  ]);

  res.json(data);
};

// Easy memory trick:
//====================
// Ask yourself:
// Am I comparing a field to a fixed value?

// salary > 50000
// No $expr.

// Am I using aggregation operators ($gt, $eq, $add, $multiply, $and, etc.) as expressions or comparing fields with fields?

// salary > bonus
// salary * 12 > 600000
// Use $expr.

// A very common interview question is:
// ====================================
// Find users whose annual salary exceeds 600000.

// You cannot do:
// salary * 12 > 600000
// with normal query syntax.

// You must use:
// {
//   $match: {
//     $expr: {
//       $gt: [
//         { $multiply: ["$salary", 12] },
//         600000
//       ]
//     }
//   }
// }
// because $multiply is an aggregation expression.