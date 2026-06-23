const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
    status:String, // Compound Index - added new field
    skills:[String], // Multikey Index - added new field
    bio: String // ← Text index - added new field
});

userSchema.index({
    email:1,
    status:1
});

module.exports =
mongoose.model("User", userSchema);