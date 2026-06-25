const mongoose = require("mongoose");
const Location = require("./models/Location");

mongoose.connect("mongodb://localhost:27017/geopoc");

async function seed() {
    await Location.deleteMany({});

    const cities = [
        { name: "New York", coords: [-74.006, 40.7128] },
        { name: "Los Angeles", coords: [-118.2437, 34.0522] },
        { name: "Chicago", coords: [-87.6298, 41.8781] },
        { name: "San Francisco", coords: [-122.4194, 37.7749] },
        { name: "Miami", coords: [-80.1918, 25.7617] }
    ];

    const types = ["restaurant", "driver", "hospital", "school"];
    const locations = [];

    for (let i = 0; i < 10000; i++) {
        const city = cities[Math.floor(Math.random() * cities.length)];
        
        // Scatter points around city center
        const lng = city.coords[0] + (Math.random() - 0.5) * 0.1;
        const lat = city.coords[1] + (Math.random() - 0.5) * 0.1;

        locations.push({
            name: `${types[i % 4]}_${i}`,
            type: types[i % 4],
            location: {
                type: "Point",
                coordinates: [lng, lat]  // [longitude, latitude]
            },
            city: city.name,
            rating: Math.floor(Math.random() * 5) + 1
        });
    }

    await Location.insertMany(locations);
    console.log("✅ 10,000 locations seeded");
    process.exit();
}

seed();