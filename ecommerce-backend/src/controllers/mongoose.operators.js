const User = require("../models/User");

// ==================================================
// MONGOOSE METHODS
// ==================================================

// create
exports.createUser = async (req, res) => {
  const user = await User.create({
    name: "John",
    email: "john@gmail.com",
    age: 25
  });

  res.json(user);
};

// find
exports.findUsers = async (req, res) => {
  const users = await User.find();

  res.json(users);
};

// findOne
exports.findOneUser = async (req, res) => {
  const user = await User.findOne({
    email: "john@gmail.com"
  });

  res.json(user);
};

// findById
exports.findUserById = async (req, res) => {
  const user = await User.findById(req.params.id);

  res.json(user);
};

// updateOne
exports.updateOneUser = async (req, res) => {
  const result = await User.updateOne(
    { email: "john@gmail.com" },
    {
      age: 30
    }
  );

  res.json(result);
};

// updateMany
exports.updateManyUsers = async (req, res) => {
  const result = await User.updateMany(
    { department: "IT" },
    {
      bonus: 5000
    }
  );

  res.json(result);
};

// deleteOne
exports.deleteOneUser = async (req, res) => {
  const result = await User.deleteOne({
    email: "john@gmail.com"
  });

  res.json(result);
};

// deleteMany
exports.deleteManyUsers = async (req, res) => {
  const result = await User.deleteMany({
    department: "HR"
  });

  res.json(result);
};

// findByIdAndUpdate
exports.findByIdAndUpdateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      age: 35
    },
    {
      new: true
    }
  );

  res.json(user);
};

// findByIdAndDelete
exports.findByIdAndDeleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(
    req.params.id
  );

  res.json(user);
};

// countDocuments
exports.countUsers = async (req, res) => {
  const count = await User.countDocuments();

  res.json({ count });
};

// distinct
exports.distinctDepartments = async (req, res) => {
  const departments = await User.distinct(
    "department"
  );

  res.json(departments);
};


// ==================================================
// QUERY OPERATORS
// ==================================================

// $eq
exports.eqUsers = async (req, res) => {
  const users = await User.find({
    age: {
      $eq: 25
    }
  });

  res.json(users);
};

// $ne
exports.neUsers = async (req, res) => {
  const users = await User.find({
    age: {
      $ne: 25
    }
  });

  res.json(users);
};

// $gt
exports.gtUsers = async (req, res) => {
  const users = await User.find({
    salary: {
      $gt: 50000
    }
  });

  res.json(users);
};

// $gte
exports.gteUsers = async (req, res) => {
  const users = await User.find({
    salary: {
      $gte: 50000
    }
  });

  res.json(users);
};

// $lt
exports.ltUsers = async (req, res) => {
  const users = await User.find({
    salary: {
      $lt: 50000
    }
  });

  res.json(users);
};

// $lte
exports.lteUsers = async (req, res) => {
  const users = await User.find({
    salary: {
      $lte: 50000
    }
  });

  res.json(users);
};

// $in
exports.inUsers = async (req, res) => {
  const users = await User.find({
    department: {
      $in: ["IT", "HR"]
    }
  });

  res.json(users);
};

// $nin
exports.ninUsers = async (req, res) => {
  const users = await User.find({
    department: {
      $nin: ["IT", "HR"]
    }
  });

  res.json(users);
};

// $and
exports.andUsers = async (req, res) => {
  const users = await User.find({
    $and: [
      {
        age: {
          $gte: 25
        }
      },
      {
        salary: {
          $gte: 50000
        }
      }
    ]
  });

  res.json(users);
};

// $or
exports.orUsers = async (req, res) => {
  const users = await User.find({
    $or: [
      {
        department: "IT"
      },
      {
        department: "HR"
      }
    ]
  });

  res.json(users);
};

// $not
exports.notUsers = async (req, res) => {
  const users = await User.find({
    age: {
      $not: {
        $gt: 30
      }
    }
  });

  res.json(users);
};

// $exists
exports.existsUsers = async (req, res) => {
  const users = await User.find({
    phone: {
      $exists: true
    }
  });

  res.json(users);
};

// $regex
exports.regexUsers = async (req, res) => {
  const users = await User.find({
    name: {
      $regex: /^jo/i
    }
  });

  res.json(users);
};

// $elemMatch
exports.elemMatchUsers = async (req, res) => {
  const users = await User.find({
    orders: {
      $elemMatch: {
        qty: {
          $gt: 2
        },
        price: {
          $gt: 100
        }
      }
    }
  });

  res.json(users);
};

// $size
exports.sizeUsers = async (req, res) => {
  const users = await User.find({
    skills: {
      $size: 3
    }
  });

  res.json(users);
};


// ==================================================
// UPDATE OPERATORS
// ==================================================

// $set
exports.setUser = async (req, res) => {
  const result = await User.updateOne(
    { email: "john@gmail.com" },
    {
      $set: {
        age: 30
      }
    }
  );

  res.json(result);
};

// $unset
exports.unsetUser = async (req, res) => {
  const result = await User.updateOne(
    { email: "john@gmail.com" },
    {
      $unset: {
        phone: ""
      }
    }
  );

  res.json(result);
};

// $inc
exports.incUser = async (req, res) => {
  const result = await User.updateOne(
    { email: "john@gmail.com" },
    {
      $inc: {
        salary: 1000
      }
    }
  );

  res.json(result);
};

// $push
exports.pushSkill = async (req, res) => {
  const result = await User.updateOne(
    { email: "john@gmail.com" },
    {
      $push: {
        skills: "Redis"
      }
    }
  );

  res.json(result);
};

// $pull
exports.pullSkill = async (req, res) => {
  const result = await User.updateOne(
    { email: "john@gmail.com" },
    {
      $pull: {
        skills: "Redis"
      }
    }
  );

  res.json(result);
};

// $addToSet
exports.addToSetSkill = async (req, res) => {
  const result = await User.updateOne(
    { email: "john@gmail.com" },
    {
      $addToSet: {
        skills: "Redis"
      }
    }
  );

  res.json(result);
};