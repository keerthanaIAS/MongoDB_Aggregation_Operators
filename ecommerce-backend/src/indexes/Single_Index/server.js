const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();

mongoose.connect(
    "mongodb://localhost:27017/indexpoc"
);

app.use(express.json());

app.get("/user/:email", async (req,res)=>{

    const start = Date.now();

    const user =
    await User.findOne({
        email:req.params.email
    });

    const end = Date.now();

    res.json({
        time:`${end-start}ms`,
        user
    });
});

app.listen(3000, () => {
    console.log("Server Running");
});