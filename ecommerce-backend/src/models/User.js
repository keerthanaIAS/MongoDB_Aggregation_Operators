const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    email: String,
    age: Number,
    city: String,
    country: String,
    registeredDate: Date,
    membership: {
        type: String,
        enum: ['basic', 'premium']
    },
    tags: [String],
    preferences: {
        newsletter: Boolean,
        notifications: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);