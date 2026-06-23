const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect("mongodb://localhost:27017/indexpoc");

async function seed() {

    await User.deleteMany();

    const users = [];

    for (let i = 0; i < 100000; i++) {

        users.push({
            name: `User${i}`,
            email: `user${i}@gmail.com`,
            age: Math.floor(Math.random() * 60),
            status: i % 2 === 0 // Compound Index - added new field
                ? "active"
                : "inactive",
            skills: [ // Multikey Index - added new field
                "Node",
                "React",
                "MongoDB"
            ],
            bio: `Senior MERN Stack Developer ${i}` // Text Index - added new field
        });
    }

    await User.insertMany(users);

    console.log("Inserted");

    process.exit();
}

seed();