const express = require("express");
const router = express.Router();
const Location = require("../models/Location");

// 1. Find nearby locations
router.get("/nearby", async (req, res) => {
    const { lng, lat, maxDistance = 5000 } = req.query;
    
    const explain = await Location.find({
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [parseFloat(lng), parseFloat(lat)]
                },
                $maxDistance: parseInt(maxDistance)
            }
        }
    }).explain("executionStats");

    res.json({
        stage: explain.executionStats.executionStages.stage,
        docsExamined: explain.executionStats.totalDocsExamined,
        time: `${explain.executionStats.executionTimeMillis}ms`
    });
});

// 2. Find within polygon (area)
router.get("/within", async (req, res) => {
    const polygon = [
        [-74.02, 40.70],
        [-73.98, 40.70],
        [-73.98, 40.73],
        [-74.02, 40.73],
        [-74.02, 40.70]
    ];

    const explain = await Location.find({
        location: {
            $geoWithin: {
                $geometry: {
                    type: "Polygon",
                    coordinates: [polygon]
                }
            }
        }
    }).explain("executionStats");

    res.json({
        stage: explain.executionStats.executionStages.stage,
        docsExamined: explain.executionStats.totalDocsExamined,
        time: `${explain.executionStats.executionTimeMillis}ms`
    });
});

module.exports = router;