const Restaurant = require("../models/Restaurant");
const mongoose = require("mongoose");

// ============================================
// 1. $near - Find Nearby Restaurants
// ============================================
exports.getNearbyRestaurants = async (req, res) => {
  try {
    const { longitude, latitude, distance = 5000, limit = 20 } = req.query;

    const restaurants = await Restaurant.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseInt(distance),
        },
      },
    }).limit(parseInt(limit));

    res.json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ============================================
// 2. $centerSphere - Find Within Radius
// ============================================
exports.getWithinRadius = async (req, res) => {
  try {
    const { longitude, latitude, radius = 5 } = req.query;

    const restaurants = await Restaurant.find({
      location: {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(longitude), parseFloat(latitude)],
            parseFloat(radius) / 6378.1, // Convert km to radians
          ],
        },
      },
    });

    res.json({
      success: true,
      count: restaurants.length,
      radius: `${radius} km`,
      data: restaurants,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ============================================
// 3. $geoWithin - Restaurants Inside City (Polygon)
// ============================================
exports.getRestaurantsInsideCity = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const geometry = await db
      .collection("geometries")
      .findOne({ name: "Hyderabad" });

    if (!geometry) {
      return res.status(404).json({
        success: false,
        error: "City boundary not found",
      });
    }

    const restaurants = await Restaurant.find({
      location: {
        $geoWithin: {
          $geometry: geometry.boundary,
        },
      },
    });

    res.json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ============================================
// 4. $geoNear - Near a Route (LineString)
// ============================================
exports.getRestaurantsNearRoute = async (req, res) => {
  try {
    const { maxDistance = 1000 } = req.query;

    const db = mongoose.connection.db;
    const geometry = await db
      .collection("geometries")
      .findOne({ name: "Hyderabad" });

    if (!geometry || !geometry.route) {
      return res.status(404).json({
        success: false,
        error: "Route not found",
      });
    }

    const restaurants = await Restaurant.aggregate([
      {
        $geoNear: {
          near: {
            type: "LineString",
            coordinates: geometry.route.coordinates,
          },
          distanceField: "distance",
          maxDistance: parseInt(maxDistance),
          spherical: true,
        },
      },
    ]);

    res.json({
      success: true,
      count: restaurants.length,
      maxDistance: `${maxDistance}m`,
      data: restaurants,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ============================================
// 5. $geoNear - Nearest Restaurants with Distance
// ============================================
exports.getNearestRestaurants = async (req, res) => {
  try {
    const { longitude, latitude, limit = 5 } = req.query;

    const restaurants = await Restaurant.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: "distance",
          spherical: true,
        },
      },
      {
        $limit: parseInt(limit),
      },
      {
        $project: {
          name: 1,
          cuisine: 1,
          rating: 1,
          priceRange: 1,
          distance: 1,
        },
      },
    ]);

    res.json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ============================================
// 6. Filtered Search - $geoNear + $match
// ============================================
// http://localhost:3000/restaurants/nearby?longitude=78.4867&latitude=17.3850&distance=3000
exports.getFilteredRestaurants = async (req, res) => {
  try {
    const {
      longitude,
      latitude,
      cuisine,
      minRating,
      maxDistance = 5000,
      limit = 10,
    } = req.query;

    const pipeline = [
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: "distance",
          spherical: true,
          maxDistance: parseInt(maxDistance),
        },
      },
    ];

    // Build match stage
    const match = {};
    if (cuisine) match.cuisine = cuisine;
    if (minRating) match.rating = { $gte: parseFloat(minRating) };

    if (Object.keys(match).length > 0) {
      pipeline.push({ $match: match });
    }

    pipeline.push({ $limit: parseInt(limit) });

    const restaurants = await Restaurant.aggregate(pipeline);

    res.json({
      success: true,
      count: restaurants.length,
      filters: { cuisine, minRating, maxDistance },
      data: restaurants,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ============================================
// 7. Top Rated Nearby - $geoNear + $match + $sort
// ============================================
exports.getTopRatedNearby = async (req, res) => {
  try {
    const { longitude, latitude, minRating = 4.5, limit = 5 } = req.query;

    const restaurants = await Restaurant.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: "distance",
          spherical: true,
        },
      },
      {
        $match: {
          rating: { $gte: parseFloat(minRating) },
        },
      },
      {
        $sort: {
          distance: 1,
          rating: -1,
        },
      },
      {
        $limit: parseInt(limit),
      },
    ]);

    res.json({
      success: true,
      count: restaurants.length,
      minRating,
      data: restaurants,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ==============================================
// 8. Calculate Distances - $geoNear + $addFields
// ==============================================
exports.calculateDistances = async (req, res) => {
  try {
    const { longitude, latitude, limit = 5 } = req.query;

    const restaurants = await Restaurant.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: "distance",
          spherical: true,
        },
      },
      {
        $addFields: {
          distanceKm: { $divide: ["$distance", 1000] },
          distanceMiles: {
            $divide: [{ $multiply: ["$distance", 0.621371] }, 1000],
          },
        },
      },
      {
        $limit: parseInt(limit),
      },
      {
        $project: {
          name: 1,
          cuisine: 1,
          rating: 1,
          distanceKm: 1,
          distanceMiles: 1,
        },
      },
    ]);

    res.json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ============================================
// 9. $geoWithin + Polygon - In Polygon Query
// ============================================
exports.getInPolygon = async (req, res) => {
  try {
    const { coordinates } = req.query;

    // Parse polygon coordinates from query string
    // Example: coordinates = 78.4700,17.3700| 78.5000,17.3700| 78.5000,17.4000| 78.4700,17.4000
    const points = coordinates.split("|").map((p) => {
      const [lng, lat] = p.split(",").map(Number);
      return [lng, lat];
    });

    // Close the polygon
    points.push(points[0]);

    const polygon = {
      type: "Polygon",
      coordinates: [points],
    };

    const restaurants = await Restaurant.find({
      location: {
        $geoWithin: {
          $geometry: polygon,
        },
      },
    });

    res.json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ============================================
// 10. $geoIntersects - Intersecting Geometries
// ============================================
exports.getIntersecting = async (req, res) => {
  try {
    // Use a line string to find restaurants that intersect
    const lineString = {
      type: "LineString",
      coordinates: [
        [78.4700, 17.3750],
        [78.4800, 17.3850],
        [78.4900, 17.3950],
        [78.5000, 17.4050],
      ],
    };

    const restaurants = await Restaurant.find({
      location: {
        $geoIntersects: {
          $geometry: lineString,
        },
      },
    });

    res.json({
      success: true,
      count: restaurants.length,
      note: "Points must lie exactly on the line to intersect",
      data: restaurants,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ============================================
// 11. Pagination with Geospatial
// ============================================
exports.getPaginatedNearby = async (req, res) => {
  try {
    const {
      longitude,
      latitude,
      page = 1,
      limit = 5,
      distance = 5000,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const results = await Restaurant.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: "distance",
          spherical: true,
          maxDistance: parseInt(distance),
        },
      },
      { $skip: skip },
      { $limit: parseInt(limit) },
    ]);

    // Get total count for pagination
    const total = await Restaurant.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: "distance",
          spherical: true,
          maxDistance: parseInt(distance),
        },
      },
      { $count: "total" },
    ]);

    const totalCount = total.length > 0 ? total[0].total : 0;

    res.json({
      success: true,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / parseInt(limit)),
      },
      data: results,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};