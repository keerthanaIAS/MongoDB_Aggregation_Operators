const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    cuisine: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3.5,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
    priceRange: {
      type: String,
      enum: ["$", "$$", "$$$", "$$$$"],
      default: "$$",
    },
    features: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// CRITICAL: 2dsphere index for geospatial queries
restaurantSchema.index({ location: "2dsphere" });

// Compound index for filters
restaurantSchema.index({ cuisine: 1, rating: -1 });

// Virtual for formatted address
restaurantSchema.virtual("fullAddress").get(function () {
  const parts = [];
  if (this.address?.street) parts.push(this.address.street);
  if (this.address?.city) parts.push(this.address.city);
  if (this.address?.state) parts.push(this.address.state);
  if (this.address?.zip) parts.push(this.address.zip);
  return parts.join(", ");
});

// Enable virtuals in JSON output
restaurantSchema.set("toJSON", { virtuals: true });
restaurantSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Restaurant", restaurantSchema);

// Why this structure?

// MongoDB stores geospatial data using GeoJSON.

// A Point always looks like

// {
//    type: "Point",
//    coordinates: [longitude, latitude]
// }

// NOT

// [latitude, longitude]

// Always

// [longitude, latitude]

// Interview Question ⭐

// Why longitude first?

// Because GeoJSON specification defines coordinate order as

// [x, y]

// which is

// longitude
// latitude