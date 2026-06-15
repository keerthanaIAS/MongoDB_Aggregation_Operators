const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    _id: Number,
    userId: {
        type: Number,
        ref: 'User'
    },
    productId: {
        type: Number,
        ref: 'Product'
    },
    rating: Number,
    review: String,
    date: Date,
    helpful: Number
}, {
    timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);