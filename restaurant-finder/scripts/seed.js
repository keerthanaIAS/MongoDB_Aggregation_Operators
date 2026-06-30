require("dotenv").config();
const mongoose = require("mongoose");
const Restaurant = require("../models/Restaurant");

const restaurants = [
  // Hyderabad Restaurants
  {
    name: "Paradise Biryani",
    cuisine: "Hyderabadi",
    rating: 4.8,
    priceRange: "$$",
    location: {
      type: "Point",
      coordinates: [78.4867, 17.3850], // [longitude, latitude]
    },
    address: {
      street: "Banjara Hills",
      city: "Hyderabad",
      state: "Telangana",
      zip: "500034",
      country: "India",
    },
    features: ["Biryani", "Takeout", "Family Dining"],
    isActive: true,
  },
  {
    name: "Mehfil",
    cuisine: "Biryani",
    rating: 4.7,
    priceRange: "$$",
    location: {
      type: "Point",
      coordinates: [78.4855, 17.3840],
    },
    address: {
      street: "Somajiguda",
      city: "Hyderabad",
      state: "Telangana",
      zip: "500082",
      country: "India",
    },
    features: ["Biryani", "Takeout"],
    isActive: true,
  },
  {
    name: "Pizza Hut",
    cuisine: "Italian",
    rating: 4.2,
    priceRange: "$$",
    location: {
      type: "Point",
      coordinates: [78.4920, 17.3900],
    },
    address: {
      street: "Jubilee Hills",
      city: "Hyderabad",
      state: "Telangana",
      zip: "500033",
      country: "India",
    },
    features: ["Pizza", "Delivery", "WiFi"],
    isActive: true,
  },
  {
    name: "Dominos",
    cuisine: "Italian",
    rating: 4.0,
    priceRange: "$",
    location: {
      type: "Point",
      coordinates: [78.4800, 17.3810],
    },
    address: {
      street: "Madhapur",
      city: "Hyderabad",
      state: "Telangana",
      zip: "500081",
      country: "India",
    },
    features: ["Pizza", "Delivery", "Takeout"],
    isActive: true,
  },
  {
    name: "KFC",
    cuisine: "Fast Food",
    rating: 4.1,
    priceRange: "$",
    location: {
      type: "Point",
      coordinates: [78.4895, 17.3875],
    },
    address: {
      street: "Hitech City",
      city: "Hyderabad",
      state: "Telangana",
      zip: "500081",
      country: "India",
    },
    features: ["Fried Chicken", "Takeout", "Drive-through"],
    isActive: true,
  },
  {
    name: "McDonald's",
    cuisine: "Fast Food",
    rating: 4.4,
    priceRange: "$",
    location: {
      type: "Point",
      coordinates: [78.4878, 17.3882],
    },
    address: {
      street: "Gachibowli",
      city: "Hyderabad",
      state: "Telangana",
      zip: "500032",
      country: "India",
    },
    features: ["Burgers", "Drive-through", "WiFi"],
    isActive: true,
  },
  {
    name: "Subway",
    cuisine: "Fast Food",
    rating: 4.3,
    priceRange: "$",
    location: {
      type: "Point",
      coordinates: [78.4815, 17.3825],
    },
    address: {
      street: "Kothaguda",
      city: "Hyderabad",
      state: "Telangana",
      zip: "500084",
      country: "India",
    },
    features: ["Sandwiches", "Salads", "Takeout"],
    isActive: true,
  },
  {
    name: "Barbeque Nation",
    cuisine: "BBQ",
    rating: 4.6,
    priceRange: "$$$",
    location: {
      type: "Point",
      coordinates: [78.4935, 17.3915],
    },
    address: {
      street: "Hi-Tech City",
      city: "Hyderabad",
      state: "Telangana",
      zip: "500081",
      country: "India",
    },
    features: ["BBQ", "Buffet", "Family Dining"],
    isActive: true,
  },
  {
    name: "Sahara Grill",
    cuisine: "BBQ",
    rating: 4.2,
    priceRange: "$$",
    location: {
      type: "Point",
      coordinates: [78.4750, 17.3780],
    },
    address: {
      street: "Kondapur",
      city: "Hyderabad",
      state: "Telangana",
      zip: "500084",
      country: "India",
    },
    features: ["BBQ", "Outdoor Seating"],
    isActive: true,
  },
  {
    name: "Taj Mahal Hotel",
    cuisine: "North Indian",
    rating: 4.9,
    priceRange: "$$$$",
    location: {
      type: "Point",
      coordinates: [78.5000, 17.3950],
    },
    address: {
      street: "Banjara Hills",
      city: "Hyderabad",
      state: "Telangana",
      zip: "500034",
      country: "India",
    },
    features: ["Fine Dining", "Reservations", "Parking"],
    isActive: true,
  },
];

// City Boundary (Polygon) - Hyderabad
const cityBoundary = {
  type: "Polygon",
  coordinates: [
    [
      [78.4700, 17.3700],
      [78.5000, 17.3700],
      [78.5000, 17.4000],
      [78.4700, 17.4000],
      [78.4700, 17.3700], // Close the polygon
    ],
  ],
};

// Route (LineString) - Main Road
const mainRoute = {
  type: "LineString",
  coordinates: [
    [78.4700, 17.3750],
    [78.4800, 17.3850],
    [78.4900, 17.3950],
    [78.5000, 17.4050],
  ],
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Restaurant.deleteMany({});
    console.log("🧹 Cleared existing restaurants");

    // Insert restaurants
    const inserted = await Restaurant.insertMany(restaurants);
    console.log(`✅ Inserted ${inserted.length} restaurants`);

    // Create 2dsphere index
    await Restaurant.collection.createIndex({ location: "2dsphere" });
    console.log("✅ 2dsphere index created");

    // Save city boundary and route for query examples
    const db = mongoose.connection.db;
    await db.collection("geometries").updateOne(
      { name: "Hyderabad" },
      {
        $set: {
          name: "Hyderabad",
          boundary: cityBoundary,
          route: mainRoute,
        },
      },
      { upsert: true }
    );
    console.log("✅ City boundary and route saved");

    // Statistics
    const stats = await Restaurant.aggregate([
      { $group: { _id: "$cuisine", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    console.log("\n📊 Restaurant Statistics:");
    stats.forEach((s) => {
      console.log(`  - ${s._id}: ${s.count} restaurants`);
    });

    console.log("\n💡 Query Examples:");
    console.log("  npm run query");

    await mongoose.connection.close();
    console.log("\n✅ Seed complete!");
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  }
}

seed();