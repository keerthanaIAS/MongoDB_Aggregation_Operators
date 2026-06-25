const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    name: String,
    type: {
        type: String,
        enum: ["restaurant", "driver", "hospital", "school"]
    },
    location: {
        type: {
            type: String,
            default: "Point"
        },
        coordinates: {
            type: [Number],  // [longitude, latitude]
            required: true
        }
    },
    city: String,
    rating: Number
});

// Create 2dsphere index
locationSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Location", locationSchema);