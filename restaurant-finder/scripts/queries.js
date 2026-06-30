#!/usr/bin/env node
require("dotenv").config();
const mongoose = require("mongoose");
const Restaurant = require("../models/Restaurant");

const MONGODB_URI = process.env.MONGO_URI;

async function runQueries() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    const lat = 17.3850;
    const lng = 78.4867;

    console.log("=".repeat(70));
    console.log("📊 MONGODB GEOSPATIAL QUERY DEMONSTRATION");
    console.log("=".repeat(70));

    // ============================================
    // QUERY 1: $near - Find Nearby Restaurants
    // ============================================
    console.log("\n1️⃣ $near - Nearby Restaurants (Sorted by Distance)");
    console.log("-".repeat(50));

    const nearby = await Restaurant.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: 3000,
        },
      },
    });

    console.log(`✅ Found ${nearby.length} restaurants within 3km`);
    nearby.forEach((r, i) => {
      console.log(`   ${i + 1}. ${r.name} (${r.cuisine}) - ⭐${r.rating}`);
    });

    // ============================================
    // QUERY 2: $near + Filter
    // ============================================
    console.log("\n2️⃣ $near + Filter - Italian Restaurants");
    console.log("-".repeat(50));

    const italian = await Restaurant.find({
      cuisine: "Italian",
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: 3000,
        },
      },
    });

    console.log(`✅ Found ${italian.length} Italian restaurants`);
    italian.forEach((r) => {
      console.log(`   - ${r.name} (⭐${r.rating})`);
    });

    // ============================================
    // QUERY 3: $near + Rating Filter
    // ============================================
    console.log("\n3️⃣ $near + Rating Filter (>4.5)");
    console.log("-".repeat(50));

    const topRated = await Restaurant.find({
      rating: { $gt: 4.5 },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
        },
      },
    });

    console.log(`✅ Found ${topRated.length} top-rated restaurants`);
    topRated.forEach((r) => {
      console.log(`   - ${r.name} (⭐${r.rating})`);
    });

    // ============================================
    // QUERY 4: $nearSphere - Spherical Search
    // ============================================
    console.log("\n4️⃣ $nearSphere - Spherical Distance");
    console.log("-".repeat(50));

    const sphereResults = await Restaurant.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: 3000,
        },
      },
    });

    console.log(`✅ Found ${sphereResults.length} restaurants within 3km (sphere)`);

    // ============================================
    // QUERY 5: $geoNear - Aggregation with Distance
    // ============================================
    console.log("\n5️⃣ $geoNear - Aggregation with Distance Calculation");
    console.log("-".repeat(50));

    const withDistance = await Restaurant.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng, lat],
          },
          distanceField: "distance",
          spherical: true,
        },
      },
      { $limit: 5 },
      {
        $project: {
          name: 1,
          cuisine: 1,
          rating: 1,
          distance: 1,
          distanceKm: { $divide: ["$distance", 1000] },
        },
      },
    ]);

    console.log(`✅ Top 5 nearest restaurants with distances:`);
    withDistance.forEach((r) => {
      console.log(`   - ${r.name}: ${r.distance.toFixed(0)}m (${r.distanceKm.toFixed(2)}km)`);
    });

    // ============================================
    // QUERY 6: $geoWithin + $centerSphere - Radius Search
    // ============================================
    console.log("\n6️⃣ $geoWithin + $centerSphere - Within 5km Radius");
    console.log("-".repeat(50));

    const withinRadius = await Restaurant.find({
      location: {
        $geoWithin: {
          $centerSphere: [[lng, lat], 5 / 6378.1],
        },
      },
    });

    console.log(`✅ Found ${withinRadius.length} restaurants within 5km`);

    // ============================================
    // QUERY 7: $geoWithin + $box - Rectangle Search
    // ============================================
    console.log("\n7️⃣ $geoWithin + $box - Rectangle Search");
    console.log("-".repeat(50));

    const inBox = await Restaurant.find({
      location: {
        $geoWithin: {
          $box: [
            [78.4800, 17.3800],
            [78.4950, 17.3920],
          ],
        },
      },
    });

    console.log(`✅ Found ${inBox.length} restaurants in bounding box`);

    // ============================================
    // QUERY 8: $geoWithin + Polygon - City Boundary
    // ============================================
    console.log("\n8️⃣ $geoWithin + Polygon - City Boundary");
    console.log("-".repeat(50));

    const db = mongoose.connection.db;
    const geometry = await db.collection("geometries").findOne({ name: "Hyderabad" });

    if (geometry) {
      const inCity = await Restaurant.find({
        location: {
          $geoWithin: {
            $geometry: geometry.boundary,
          },
        },
      });

      console.log(`✅ Found ${inCity.length} restaurants inside Hyderabad city`);
    }

    // ============================================
    // QUERY 9: $geoNear + $match + $sort - Advanced Filtering
    // ============================================
    console.log("\n9️⃣ $geoNear + $match + $sort - Advanced");
    console.log("-".repeat(50));

    const advanced = await Restaurant.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng, lat],
          },
          distanceField: "distance",
          spherical: true,
        },
      },
      {
        $match: {
          rating: { $gte: 4.0 },
          cuisine: { $in: ["Fast Food", "Italian"] },
        },
      },
      {
        $sort: {
          distance: 1,
          rating: -1,
        },
      },
      { $limit: 5 },
    ]);

    console.log(`✅ Found ${advanced.length} matching restaurants:`);
    advanced.forEach((r) => {
      console.log(`   - ${r.name}: ${r.cuisine}, ⭐${r.rating}, ${r.distance}m`);
    });

    // ============================================
    // QUERY 10: Pagination
    // ============================================
    console.log("\n🔟 Pagination - Page 2 (6-10 results)");
    console.log("-".repeat(50));

    const page = 2;
    const limit = 5;
    const skip = (page - 1) * limit;

    const paginated = await Restaurant.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng, lat],
          },
          distanceField: "distance",
          spherical: true,
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]);

    console.log(`✅ Page ${page} results (${skip + 1} - ${skip + limit}):`);
    paginated.forEach((r) => {
      console.log(`   - ${r.name} (${r.cuisine})`);
    });

    // ============================================
    // SUMMARY
    // ============================================
    console.log("\n" + "=".repeat(70));
    console.log("✅ ALL GEOSPATIAL QUERIES COMPLETED".green);
    console.log("=".repeat(70));

    console.log("\n📋 Operators Demonstrated:");
    console.log("   ✅ $near - Find nearby sorted by distance");
    console.log("   ✅ $nearSphere - Spherical distance search");
    console.log("   ✅ $geoNear - Aggregation with distance");
    console.log("   ✅ $geoWithin - Within area");
    console.log("   ✅ $centerSphere - Radius on sphere");
    console.log("   ✅ $box - Rectangle search");
    console.log("   ✅ $geometry - GeoJSON polygon");
    console.log("   ✅ $match - Filter after geo query");
    console.log("   ✅ $sort - Sort by distance/rating");
    console.log("   ✅ $project - Select fields");
    console.log("   ✅ $limit - Limit results");
    console.log("   ✅ $skip - Pagination");
    console.log("   ✅ $addFields - Calculate distance fields");

    await mongoose.connection.close();
    console.log("\n👋 Disconnected");
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.message.includes("ENOTFOUND")) {
      console.log("\n💡 Hint: Check your connection string. Use 'localhost' for Mac/Windows.");
    }
    process.exit(1);
  }
}

runQueries();