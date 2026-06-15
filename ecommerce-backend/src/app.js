require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();

console.log(process.env.MONGO_URI);

mongoose
    .connect(process.env.MONGO_URI)
    .then(async() => {
        console.log("Mongo Connected");
        const user = await User.create({
            name: "Keerthana",
            email: "keerthana@gmail.com"
        });
        console.log(user);
    })
    .catch((err) => console.log(err));

app.listen(3000, () => {
    console.log("Server running");
});