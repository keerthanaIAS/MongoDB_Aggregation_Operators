const express = require("express");
const router = express.Router();
const controller = require("../controllers/restaurantController");

// Core geospatial routes
router.get("/nearby", controller.getNearbyRestaurants);
router.get("/radius", controller.getWithinRadius);
router.get("/city", controller.getRestaurantsInsideCity);
router.get("/route", controller.getRestaurantsNearRoute);
router.get("/nearest", controller.getNearestRestaurants);

// Advanced queries
router.get("/filter", controller.getFilteredRestaurants);
router.get("/top-rated", controller.getTopRatedNearby);
router.get("/distance", controller.calculateDistances);

// Polygon & geometry queries
router.get("/in-polygon", controller.getInPolygon);
router.get("/intersects", controller.getIntersecting);

// Pagination example
router.get("/paginated", controller.getPaginatedNearby);

module.exports = router;