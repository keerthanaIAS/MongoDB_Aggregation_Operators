const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    category: String,
    subcategory: String,
    price: Number,
    cost: Number,
    stock: Number,
    rating: Number,
    specs: {
        brand: String,
        ram: String,
        storage: String,
        size: String,
        color: String,
        type: String,
        author: String,
        pages: Number,
        format: String
    },
    tags: [String]
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);