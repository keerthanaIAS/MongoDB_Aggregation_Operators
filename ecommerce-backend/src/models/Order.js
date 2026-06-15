const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    _id: Number,
    userId: {
        type: Number,
        ref: 'User'
    },
    orderDate: Date,
    status: {
        type: String,
        enum: ['delivered', 'processing', 'shipped', 'cancelled']
    },
    items: [{
        productId: {
            type: Number,
            ref: 'Product'
        },
        quantity: Number,
        priceAtPurchase: Number
    }],
    totalAmount: Number,
    payment: {
        method: String,
        transactionId: String
    },
    shipping: {
        address: String,
        cost: Number,
        method: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);