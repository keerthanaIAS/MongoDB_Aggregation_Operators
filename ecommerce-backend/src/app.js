require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

// Import Models
const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");
const Review = require("./models/Review");

// Import routes
const analyticsRoutes = require("./routes/analytics");

const app = express();
app.use(express.json());

// Routes
app.use("/api", analyticsRoutes);

// ============================================
// WELCOME ROUTE - Shows all available endpoints
// ============================================
app.get("/", (req, res) => {
    res.json({
        message: " MongoDB Operations Guide",
        sections: {
            basic_operations: {
                description: "Basic CRUD with Mongoose Models",
                endpoints: {
                    count_documents: "GET /basic/count",
                    find_all: "GET /basic/find-all",
                    find_filtered: "GET /basic/find-filtered?country=USA",
                    find_one: "GET /basic/find-one/1",
                    create: "POST /basic/create",
                    update: "PUT /basic/update/1",
                    delete: "DELETE /basic/delete/5"
                }
            },
            aggregation: {
                description: "MongoDB Aggregation Pipeline",
                endpoints: {
                    match: "GET /api/basic/match",
                    project: "GET /api/basic/project",
                    group: "GET /api/basic/group",
                    unwind: "GET /api/intermediate/unwind",
                    lookup: "GET /api/intermediate/lookup",
                    facet: "GET /api/advanced/facet",
                    bucket: "GET /api/advanced/bucket",
                    customer_analysis: "GET /api/analytics/customer-lifetime-value",
                    product_performance: "GET /api/analytics/product-performance",
                    business_report: "GET /api/analytics/business-report?year=2024&month=2"
                }
            }
        }
    });
});

// ============================================
// 1: BASIC MONGODB OPERATIONS
// ============================================

/**
 * 1. COUNT DOCUMENTS
 * WHAT: Counts documents in collection
 * WHEN: Need to know how many records exist
 * WHY: Quick statistics without fetching data
 * 
 * db.collection.countDocuments()
 * db.collection.estimatedDocumentCount() - faster but less accurate
 * db.collection.countDocuments({ filter }) - count with conditions
 */
app.get("/basic/count", async (req, res) => {
    try {
        // 1: countDocuments() - Most accurate
        // Reads actual documents, respects queries
        const totalUsers = await User.countDocuments();
        console.log(`Total Users: ${totalUsers}`);

        // 2: estimatedDocumentCount() - Faster
        // Uses collection metadata, doesn't scan documents
        const estimatedProducts = await Product.estimatedDocumentCount();
        console.log(`Estimated Products: ${estimatedProducts}`);

        // 3: countDocuments() with filter
        // Count premium users only
        const premiumUsers = await User.countDocuments({ membership: "premium" });
        console.log(`Premium Users: ${premiumUsers}`);

        // 4: Count with complex conditions
        const usaUsers = await User.countDocuments({ 
            country: "USA",
            age: { $gte: 25 }
        });
        console.log(`USA Users (age >= 25): ${usaUsers}`);

        // 5: Count orders by status
        const deliveredOrders = await Order.countDocuments({ status: "delivered" });
        const cancelledOrders = await Order.countDocuments({ status: "cancelled" });
        console.log(`Delivered: ${deliveredOrders}, Cancelled: ${cancelledOrders}`);

        res.json({
            success: true,
            message: "Count operations",
            data: {
                totalUsers,
                estimatedProducts,
                premiumUsers,
                usaUsers,
                orders: {
                    delivered: deliveredOrders,
                    cancelled: cancelledOrders,
                    total: deliveredOrders + cancelledOrders
                }
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * 2. FIND ALL DOCUMENTS
 * WHAT: Retrieves all documents from collection
 * WHEN: Need to display all records
 * WHY: Basic data retrieval
 * 
 * Model.find() - returns all documents
 * Model.find({ filter }) - returns filtered documents
 */
app.get("/basic/find-all", async (req, res) => {
    try {
        // 1: find() - Get all documents
        const allUsers = await User.find();
        console.log(`Found ${allUsers.length} users`);
        console.log('First user:', allUsers[0]?.name);

        // 2: find() with select - Get specific fields only
        const userNamesOnly = await User.find({}, { name: 1, email: 1, _id: 0 });
        console.log('Users (names only):', userNamesOnly[0]);

        // 3: find() with sort - Get sorted results
        const usersSortedByAge = await User.find().sort({ age: -1 }); // Descending
        console.log('Oldest user:', usersSortedByAge[0]?.name, usersSortedByAge[0]?.age);

        // 4: find() with limit - Get top N results
        const top3Users = await User.find().limit(3);
        console.log('Top 3 users:', top3Users.map(u => u.name));

        // 5: find() with skip - Pagination
        const page2 = await User.find().skip(2).limit(2);
        console.log('Page 2:', page2.map(u => u.name));

        res.json({
            success: true,
            message: "Find operations",
            data: {
                totalUsers: allUsers.length,
                firstUser: allUsers[0],
                namesOnly: userNamesOnly,
                oldestUser: usersSortedByAge[0],
                top3Users,
                page2Users: page2
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * 3. FIND WITH FILTERS
 * WHAT: Find documents matching specific conditions
 * WHEN: Need specific records
 * WHY: Most common database operation
 */
app.get("/basic/find-filtered", async (req, res) => {
    try {
        const { country, membership } = req.query;

        // 1: Simple equality
        const usaUsers = await User.find({ country: "USA" });
        console.log(`USA Users: ${usaUsers.length}`);

        // 2: Multiple conditions (AND)
        const premiumUSA = await User.find({ 
            country: "USA", 
            membership: "premium" 
        });
        console.log(`Premium USA: ${premiumUSA.length}`);

        // 3: Comparison operators
        const youngUsers = await User.find({ age: { $lt: 30 } }); // Less than 30
        console.log(`Young users: ${youngUsers.length}`);

        // 4: $in operator - Match any value in array
        const selectedUsers = await User.find({ 
            country: { $in: ["USA", "UK"] } 
        });
        console.log(`USA/UK Users: ${selectedUsers.length}`);

        // 5: $ne - Not equal
        const notPremium = await User.find({ membership: { $ne: "premium" } });
        console.log(`Non-premium users: ${notPremium.length}`);

        // 6: $exists - Field exists
        const usersWithTags = await User.find({ tags: { $exists: true } });
        console.log(`Users with tags: ${usersWithTags.length}`);

        // 7: Dynamic filter from query params
        let filter = {};
        if (country) filter.country = country;
        if (membership) filter.membership = membership;
        
        const dynamicResults = await User.find(filter);
        console.log(`Dynamic filter results: ${dynamicResults.length}`);

        res.json({
            success: true,
            message: "Filter operations",
            filters_used: {
                equality: "country: USA",
                and_condition: "country: USA AND membership: premium",
                comparison: "age < 30",
                in_operator: "country in [USA, UK]",
                not_equal: "membership != premium",
                exists: "tags field exists"
            },
            data: {
                usaUsers: usaUsers.length,
                premiumUSA: premiumUSA.length,
                youngUsers: youngUsers.length,
                usaukUsers: selectedUsers.length,
                notPremium: notPremium.length,
                withTags: usersWithTags.length,
                dynamicResults: dynamicResults.length
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * 4. FIND ONE DOCUMENT
 * WHAT: Find single document by condition
 * WHEN: Need specific record by ID or unique field
 * WHY: More efficient than find() when you need one result
 */
app.get("/basic/find-one/:id", async (req, res) => {
    try {
        const userId = req.params.id;

        // 1: findById() - Find by _id
        const userById = await User.findById(userId);
        console.log('User by ID:', userById?.name);

        // 2: findOne() - Find first match
        const firstPremiumUser = await User.findOne({ membership: "premium" });
        console.log('First premium user:', firstPremiumUser?.name);

        // 3: findOne() with sort - Find latest
        const latestOrder = await Order.findOne().sort({ orderDate: -1 });
        console.log('Latest order:', latestOrder?._id, latestOrder?.totalAmount);

        // 4: findOne() with select - Get specific fields
        const userEmailOnly = await User.findOne(
            { _id: userId },
            { email: 1, _id: 0 }
        );
        console.log('User email:', userEmailOnly?.email);

        res.json({
            success: true,
            message: "Find One operations",
            data: {
                findById: userById,
                findOne: firstPremiumUser,
                latestOrder: {
                    id: latestOrder?._id,
                    amount: latestOrder?.totalAmount,
                    date: latestOrder?.orderDate
                },
                emailOnly: userEmailOnly
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * 5. CREATE DOCUMENTS
 * WHAT: Insert new documents
 * WHEN: Adding new records
 * WHY: Basic data entry
 */
app.post("/basic/create", async (req, res) => {
    try {
        // 1: create() - Single document
        const newUser = await User.create({
            _id: 6,
            name: "Test User",
            email: "test@email.com",
            age: 30,
            city: "Paris",
            country: "France",
            membership: "basic",
            tags: ["test"],
            preferences: { newsletter: true, notifications: "email" }
        });
        console.log('Created user:', newUser.name);

        // 2: insertMany() - Multiple documents
        const newProducts = await Product.insertMany([
            {
                _id: 106,
                name: "Wireless Mouse",
                category: "Electronics",
                price: 49.99,
                cost: 25.00,
                stock: 300,
                rating: 4.5,
                tags: ["accessories", "computer"]
            },
            {
                _id: 107,
                name: "USB-C Cable",
                category: "Electronics",
                price: 19.99,
                cost: 5.00,
                stock: 1000,
                rating: 4.3,
                tags: ["accessories", "cable"]
            }
        ]);
        console.log(`Created ${newProducts.length} products`);

        // 3: new Model() + save()
        const review = new Review({
            _id: 2006,
            userId: 6,
            productId: 106,
            rating: 5,
            review: "Great mouse!",
            date: new Date(),
            helpful: 0
        });
        await review.save();
        console.log('Saved review');

        res.json({
            success: true,
            message: "Create operations",
            data: {
                userCreated: newUser.name,
                productsCreated: newProducts.length,
                reviewCreated: review.review
            }
        });
    } catch (error) {
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({ 
                error: "Document already exists with this ID" 
            });
        }
        res.status(500).json({ error: error.message });
    }
});

/**
 * 6. UPDATE DOCUMENTS
 * WHAT: Modify existing documents
 * WHEN: Need to change data
 * WHY: Maintain accurate data
 */
app.put("/basic/update/:id", async (req, res) => {
    try {
        const userId = req.params.id;

        // 1: findByIdAndUpdate() - Find and update
        // Returns old document by default
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
                $set: { membership: "premium" }  // $set updates specific field
            },
            { new: true }  // Returns updated document
        );
        console.log('Updated user membership:', updatedUser?.name);

        // 2: updateOne() - Update first match
        const updateResult = await Order.updateOne(
            { _id: 1001 },
            { 
                $set: { status: "shipped" },
                $push: { "items": { productId: 103, quantity: 1, priceAtPurchase: 129.99 } }
            }
        );
        console.log('Modified:', updateResult.modifiedCount, 'documents');

        // 3: updateMany() - Update all matches
        const bulkUpdate = await User.updateMany(
            { country: "USA" },
            { $set: { "preferences.notifications": "email" } }
        );
        console.log(`Updated ${bulkUpdate.modifiedCount} USA users`);

        // 4: findOneAndUpdate() - More control
        const updatedOrder = await Order.findOneAndUpdate(
            { _id: 1002 },
            { 
                $inc: { totalAmount: 10 },  // Increment
                $set: { "shipping.method": "express" }
            },
            { new: true }
        );
        console.log('Updated order amount:', updatedOrder?.totalAmount);

        // Revert changes for demonstration
        await User.findByIdAndUpdate(userId, { $set: { membership: "basic" } });
        await Order.updateOne(
            { _id: 1001 }, 
            { $set: { status: "delivered" } }
        );

        res.json({
            success: true,
            message: "Update operations",
            data: {
                updatedUser: updatedUser?.name,
                orderModified: updateResult.modifiedCount,
                bulkUpdated: bulkUpdate.modifiedCount,
                orderAmountIncreased: updatedOrder?.totalAmount
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * 7. DELETE DOCUMENTS
 * WHAT: Remove documents
 * WHEN: Need to delete records
 * WHY: Data cleanup
 */
app.delete("/basic/delete/:id", async (req, res) => {
    try {
        // First create a temp document to delete
        const tempUser = await User.create({
            _id: 999,
            name: "Temp User",
            email: "temp@email.com",
            age: 25,
            city: "Test",
            country: "Test",
            membership: "basic"
        });

        // 1: findByIdAndDelete()
        const deletedUser = await User.findByIdAndDelete(tempUser._id);
        console.log('Deleted user:', deletedUser?.name);

        // 2: deleteOne() - Delete first match
        const deleteResult = await Review.deleteOne({ _id: 2006 });
        console.log('Deleted reviews:', deleteResult.deletedCount);

        // 3: deleteMany() - Delete all matches
        // CAREFUL! This deletes all matching documents
        const bulkDelete = await Review.deleteMany({ 
            userId: 999 
        });
        console.log(`Bulk deleted ${bulkDelete.deletedCount} reviews`);

        res.json({
            success: true,
            message: "Delete operations",
            data: {
                deletedUser: deletedUser?.name,
                singleDelete: deleteResult.deletedCount,
                bulkDelete: bulkDelete.deletedCount,
                note: "Temp documents were created and deleted for demo"
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * 8. DISTINCT VALUES
 * WHAT: Get unique values of a field
 * WHEN: Need dropdown options, unique categories
 * WHY: Quick way to get unique values without aggregation
 */
app.get("/basic/distinct", async (req, res) => {
    try {
        // 1: distinct() - Get unique values
        const uniqueCountries = await User.distinct("country");
        console.log('Countries:', uniqueCountries);

        // 2: distinct() with filter
        const premiumCountries = await User.distinct("country", { 
            membership: "premium" 
        });
        console.log('Countries with premium users:', premiumCountries);

        // 3: Get unique categories
        const categories = await Product.distinct("category");
        console.log('Categories:', categories);

        // 4: Get unique tags across all users
        const allTags = await User.distinct("tags");
        console.log('All tags:', allTags);

        res.json({
            success: true,
            message: "Distinct operations",
            data: {
                uniqueCountries,
                premiumCountries,
                categories,
                allTags
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * 9. AGGREGATION COUNTING (Using aggregate for counts)
 * WHAT: Count using aggregation pipeline
 * WHEN: Need grouped counts or complex counting logic
 * WHY: More powerful than simple countDocuments
 */
app.get("/basic/aggregate-count", async (req, res) => {
    try {
        // 1: Simple count with $count stage
        const totalUsers = await User.aggregate([
            { $count: "total" }
        ]);
        console.log('Total users via aggregation:', totalUsers[0]?.total);

        // 2: Count by group
        const usersByCountry = await User.aggregate([
            {
                $group: {
                    _id: "$country",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);
        console.log('Users by country:', usersByCountry);

        // 3: Count with condition
        const usersByMembership = await User.aggregate([
            {
                $group: {
                    _id: "$membership",
                    count: { $sum: 1 },
                    avgAge: { $avg: "$age" }
                }
            }
        ]);
        console.log('Users by membership:', usersByMembership);

        // 4: Multiple count metrics
        const orderStats = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$totalAmount" },
                    avgOrderValue: { $avg: "$totalAmount" },
                    minOrder: { $min: "$totalAmount" },
                    maxOrder: { $max: "$totalAmount" }
                }
            }
        ]);
        console.log('Order stats:', orderStats[0]);

        res.json({
            success: true,
            message: "Aggregation count operations",
            data: {
                totalUsers: totalUsers[0]?.total,
                usersByCountry,
                usersByMembership,
                orderStats: orderStats[0]
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * 10. COMPARISON: Mongoose vs Aggregation
 * Shows when to use each approach
 */
app.get("/basic/comparison", async (req, res) => {
    try {
        // USING MONGOOSE (Simple query)
        // Best for: Simple CRUD, finding documents, simple counts
        const mongooseStart = Date.now();
        const premiumUsers = await User.find({ membership: "premium" });
        const mongooseCount = await User.countDocuments({ membership: "premium" });
        const mongooseTime = Date.now() - mongooseStart;

        // USING AGGREGATION (Complex query)
        // Best for: Grouping, calculations, transformations, joins
        const aggregateStart = Date.now();
        const premiumAnalysis = await User.aggregate([
            { $match: { membership: "premium" } },
            {
                $group: {
                    _id: "$country",
                    count: { $sum: 1 },
                    avgAge: { $avg: "$age" },
                    users: { $push: "$name" }
                }
            }
        ]);
        const aggregateTime = Date.now() - aggregateStart;

        res.json({
            success: true,
            message: "Mongoose vs Aggregation Comparison",
            guidance: {
                use_mongoose_for: [
                    "Simple CRUD operations",
                    "Finding documents by ID",
                    "Simple filtering and sorting",
                    "Basic counting"
                ],
                use_aggregation_for: [
                    "Grouping and summarizing data",
                    "Complex calculations (sum, avg, etc.)",
                    "Joining multiple collections",
                    "Data transformation and reshaping",
                    "Dashboards and reports"
                ]
            },
            comparison: {
                mongoose: {
                    time_ms: mongooseTime,
                    result: `${mongooseCount} premium users found`,
                    operation: "Simple find + count"
                },
                aggregation: {
                    time_ms: aggregateTime,
                    result: premiumAnalysis,
                    operation: "Grouped analysis by country"
                }
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// ALL MONGODB QUERY OPERATORS
// ============================================

/**
 * COMPARISON OPERATORS
 * Used to compare field values
 */
app.get("/operators/comparison", async (req, res) => {
    try {
        // $eq - EQUAL TO
        // Same as { field: value }
        const equalExample = await User.find({ 
            country: { $eq: "USA" }  // country equals "USA"
        });
        console.log(`$eq - Users from USA: ${equalExample.length}`);

        // $ne - NOT EQUAL TO
        const notEqualExample = await User.find({ 
            membership: { $ne: "premium" }  // membership not premium
        });
        console.log(`$ne - Non-premium users: ${notEqualExample.length}`);

        // $gt - GREATER THAN
        const greaterThanExample = await User.find({ 
            age: { $gt: 30 }  // age > 30
        });
        console.log(`$gt - Users older than 30: ${greaterThanExample.map(u => u.name)}`);

        // $gte - GREATER THAN OR EQUAL
        const greaterOrEqualExample = await Product.find({ 
            price: { $gte: 500 }  // price >= 500
        });
        console.log(`$gte - Products >= $500: ${greaterOrEqualExample.map(p => p.name)}`);

        // $lt - LESS THAN
        const lessThanExample = await User.find({ 
            age: { $lt: 30 }  // age < 30
        });
        console.log(`$lt - Users younger than 30: ${lessThanExample.map(u => u.name)}`);

        // $lte - LESS THAN OR EQUAL
        const lessOrEqualExample = await Product.find({ 
            stock: { $lte: 50 }  // stock <= 50
        });
        console.log(`$lte - Low stock products: ${lessOrEqualExample.map(p => p.name)}`);

        // $in - MATCHES ANY VALUE IN ARRAY
        // Checks if field value exists in given array
        const inExample = await User.find({ 
            country: { $in: ["USA", "UK"] }  // country is USA or UK
        });
        console.log(`$in - USA/UK users: ${inExample.map(u => u.name)}`);

        // $nin - NOT IN ARRAY
        const notInExample = await User.find({ 
            country: { $nin: ["USA", "UK"] }  // country is NOT USA or UK
        });
        console.log(`$nin - Non USA/UK users: ${notInExample.map(u => u.name)}`);

        res.json({
            success: true,
            message: "Comparison Operators",
            operators: {
                "$eq": {
                    description: "Equal to",
                    syntax: '{ field: { $eq: value } }',
                    example: 'country: { $eq: "USA" }',
                    sameAs: '{ country: "USA" }',
                    result: `${equalExample.length} users`
                },
                "$ne": {
                    description: "Not equal to",
                    syntax: '{ field: { $ne: value } }',
                    example: 'membership: { $ne: "premium" }',
                    result: `${notEqualExample.length} users`
                },
                "$gt": {
                    description: "Greater than",
                    syntax: '{ field: { $gt: value } }',
                    example: 'age: { $gt: 30 }',
                    result: greaterThanExample.map(u => u.name)
                },
                "$gte": {
                    description: "Greater than or equal",
                    syntax: '{ field: { $gte: value } }',
                    example: 'price: { $gte: 500 }',
                    result: greaterOrEqualExample.map(p => p.name)
                },
                "$lt": {
                    description: "Less than",
                    syntax: '{ field: { $lt: value } }',
                    example: 'age: { $lt: 30 }',
                    result: lessThanExample.map(u => u.name)
                },
                "$lte": {
                    description: "Less than or equal",
                    syntax: '{ field: { $lte: value } }',
                    example: 'stock: { $lte: 50 }',
                    result: lessOrEqualExample.map(p => p.name)
                },
                "$in": {
                    description: "Matches any value in array",
                    syntax: '{ field: { $in: [value1, value2] } }',
                    example: 'country: { $in: ["USA", "UK"] }',
                    useCase: "When you need to match multiple possible values",
                    result: inExample.map(u => u.name)
                },
                "$nin": {
                    description: "Matches none of the values",
                    syntax: '{ field: { $nin: [value1, value2] } }',
                    example: 'country: { $nin: ["USA", "UK"] }',
                    result: notInExample.map(u => u.name)
                }
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * LOGICAL OPERATORS
 * Combine multiple conditions
 */
app.get("/operators/logical", async (req, res) => {
    try {
        // $and - ALL conditions must be true
        // Implicit AND: { field1: value1, field2: value2 }
        // Explicit AND: { $and: [ {field1: value1}, {field2: value2} ] }
        const andExample1 = await User.find({
            $and: [
                { country: "USA" },
                { membership: "premium" },
                { age: { $gte: 25 } }
            ]
        });
        console.log(`$and - USA premium users >= 25: ${andExample1.map(u => u.name)}`);

        // $and is useful when you need same field with multiple conditions
        const andExample2 = await Product.find({
            $and: [
                { price: { $gte: 100 } },
                { price: { $lte: 1000 } }
            ]
        });
        console.log(`$and - Products $100-$1000: ${andExample2.map(p => p.name)}`);

        // $or - AT LEAST ONE condition must be true
        const orExample = await User.find({
            $or: [
                { country: "USA" },
                { country: "UK" }
            ]
        });
        console.log(`$or - USA or UK users: ${orExample.map(u => u.name)}`);

        // $or with different fields
        const orMultipleFields = await Order.find({
            $or: [
                { status: "cancelled" },
                { totalAmount: { $gt: 1500 } }
            ]
        });
        console.log(`$or - Cancelled OR high value: ${orMultipleFields.length} orders`);

        // $nor - NONE of the conditions are true (opposite of $or)
        const norExample = await User.find({
            $nor: [
                { country: "USA" },
                { membership: "premium" }
            ]
        });
        console.log(`$nor - Not USA and not premium: ${norExample.map(u => u.name)}`);

        // $not - Inverts a condition
        const notExample = await User.find({
            age: { $not: { $gte: 30 } }  // age is NOT >= 30 (same as age < 30)
        });
        console.log(`$not - Age not >= 30: ${notExample.map(u => u.name)}`);

        // REAL-WORLD EXAMPLE: Complex search
        const complexSearch = await User.find({
            $or: [
                // Either from USA and premium
                {
                    $and: [
                        { country: "USA" },
                        { membership: "premium" }
                    ]
                },
                // OR from UK and age over 30
                {
                    $and: [
                        { country: "UK" },
                        { age: { $gt: 30 } }
                    ]
                }
            ]
        });
        console.log(`Complex search: ${complexSearch.map(u => u.name)}`);

        res.json({
            success: true,
            message: "Logical Operators",
            operators: {
                "$and": {
                    description: "ALL conditions must be true",
                    syntax: '{ $and: [{cond1}, {cond2}] }',
                    when_to_use: "When you need multiple conditions on the SAME field",
                    note: "Simple AND can use comma: { field1: val1, field2: val2 }",
                    example: 'Products priced between $100 AND $1000',
                    result: andExample2.map(p => `${p.name} ($${p.price})`)
                },
                "$or": {
                    description: "AT LEAST ONE condition must be true",
                    syntax: '{ $or: [{cond1}, {cond2}] }',
                    when_to_use: "When you need to match ANY of multiple conditions",
                    example: 'Users from USA OR UK',
                    result: orExample.map(u => `${u.name} (${u.country})`)
                },
                "$nor": {
                    description: "NONE of the conditions are true",
                    syntax: '{ $nor: [{cond1}, {cond2}] }',
                    when_to_use: "When you want to exclude multiple conditions",
                    example: 'Not USA and not premium',
                    result: norExample.map(u => `${u.name} (${u.country}, ${u.membership})`)
                },
                "$not": {
                    description: "Inverts a condition",
                    syntax: '{ field: { $not: { condition } } }',
                    when_to_use: "When you need to negate a specific condition",
                    example: 'Age NOT >= 30 (same as age < 30)',
                    result: notExample.map(u => `${u.name} (age: ${u.age})`)
                }
            },
            complexExample: complexSearch.map(u => ({
                name: u.name,
                country: u.country,
                membership: u.membership,
                age: u.age
            }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * ELEMENT OPERATORS
 * Check field existence and type
 */
app.get("/operators/element", async (req, res) => {
    try {
        // $exists - Field exists or not
        const hasTags = await User.find({ 
            tags: { $exists: true }  // tags field exists
        });
        console.log(`$exists - Users with tags: ${hasTags.length}`);

        const noPhone = await User.find({ 
            phone: { $exists: false }  // phone field doesn't exist
        });
        console.log(`$exists false - Users without phone: ${noPhone.length}`);

        // $type - Check field type
        // Types: "string", "number", "array", "object", "bool", "date", etc.
        const stringAge = await User.find({ 
            age: { $type: "number" }  // age is number type
        });
        console.log(`$type - Users with number age: ${stringAge.length}`);

        const arrayTags = await User.find({ 
            tags: { $type: "array" }  // tags is array type
        });
        console.log(`$type - Users with array tags: ${arrayTags.length}`);

        res.json({
            success: true,
            message: "Element Operators",
            operators: {
                "$exists": {
                    description: "Check if field exists",
                    syntax: '{ field: { $exists: true/false } }',
                    when_to_use: "When you need to find documents with/without a field",
                    example: 'Find users who have tags field',
                    result: `${hasTags.length} users have tags`
                },
                "$type": {
                    description: "Check field type",
                    syntax: '{ field: { $type: "string" } }',
                    types: ["string", "number", "array", "object", "bool", "date", "null"],
                    when_to_use: "When you need documents with specific data types",
                    result: `${stringAge.length} users have number age`
                }
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * ARRAY OPERATORS
 * Query arrays in documents
 */
app.get("/operators/array", async (req, res) => {
    try {
        // $all - Array contains ALL specified elements
        // Order doesn't matter
        const hasAllTags = await User.find({ 
            tags: { $all: ["tech", "gaming"] }  // has BOTH tech AND gaming
        });
        console.log(`$all - Users with tech AND gaming: ${hasAllTags.map(u => u.name)}`);

        // $size - Array has exact length
        const twoTags = await User.find({ 
            tags: { $size: 2 }  // exactly 2 tags
        });
        console.log(`$size - Users with 2 tags: ${twoTags.map(u => u.name)}`);

        // $elemMatch - At least one element matches ALL conditions
        // Used for array of objects
        const ordersWithExpensiveItems = await Order.find({
            items: {
                $elemMatch: {
                    priceAtPurchase: { $gt: 1000 },
                    quantity: { $gte: 1 }
                }
            }
        });
        console.log(`$elemMatch - Orders with items > $1000: ${ordersWithExpensiveItems.length}`);

        // $elemMatch is DIFFERENT from simple dot notation
        // Simple dot notation: ANY element can match each condition separately
        // $elemMatch: SAME element must match ALL conditions

        const ordersWithHighQuantity = await Order.find({
            items: {
                $elemMatch: {
                    quantity: { $gte: 2 }
                }
            }
        });
        console.log(`Orders with quantity >= 2: ${ordersWithHighQuantity.map(o => o._id)}`);

        res.json({
            success: true,
            message: "Array Operators",
            operators: {
                "$all": {
                    description: "Array contains ALL specified elements",
                    syntax: '{ tags: { $all: ["tech", "gaming"] } }',
                    when_to_use: "When you need array to contain multiple specific values",
                    example: 'Users with BOTH tech AND gaming tags',
                    result: hasAllTags.map(u => u.name)
                },
                "$size": {
                    description: "Array has exact length",
                    syntax: '{ tags: { $size: 2 } }',
                    when_to_use: "When you need arrays of specific length",
                    example: 'Users with exactly 2 tags',
                    result: twoTags.map(u => u.name)
                },
                "$elemMatch": {
                    description: "At least one array element matches ALL conditions",
                    syntax: '{ items: { $elemMatch: { field1: val1, field2: val2 } } }',
                    when_to_use: "For arrays of objects - when same element must match all conditions",
                    important: "Different from dot notation where different elements can match different conditions",
                    example: 'Orders where at least one item costs > $1000 AND quantity >= 1',
                    result: `${ordersWithExpensiveItems.length} orders found`
                }
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * EVALUATION OPERATORS
 * Special operators for expressions
 */
app.get("/operators/evaluation", async (req, res) => {
    try {
        // $regex - Pattern matching (text search)
        const regexExample = await User.find({
            name: { $regex: /john/i }  // case-insensitive search for "john"
        });
        console.log(`$regex - Names containing 'john': ${regexExample.map(u => u.name)}`);

        // $regex with options
        const startsWith = await User.find({
            name: { $regex: /^M/ }  // starts with M
        });
        console.log(`$regex - Names starting with M: ${startsWith.map(u => u.name)}`);

        // $expr - Use aggregation expressions in queries
        // Allows comparing fields within the same document
        const expensiveProducts = await Product.find({
            $expr: {
                $gt: ["$price", "$cost"]  // price > cost
            }
        });
        console.log(`$expr - Products where price > cost: ${expensiveProducts.length}`);

        // $expr with multiple conditions
        const highMarginProducts = await Product.find({
            $expr: {
                $gt: [
                    { $subtract: ["$price", "$cost"] },  // profit margin
                    500  // greater than $500
                ]
            }
        });
        console.log(`$expr - Products with profit > $500: ${highMarginProducts.map(p => p.name)}`);

        // $expr comparing fields
        const usersWithMatchingPreferences = await User.find({
            $expr: {
                $eq: ["$preferences.notifications", "$preferences.notifications"]
            }
        });
        console.log(`$expr - Users with notification preferences: ${usersWithMatchingPreferences.length}`);

        res.json({
            success: true,
            message: "Evaluation Operators",
            operators: {
                "$regex": {
                    description: "Pattern matching for strings",
                    syntax: '{ field: { $regex: /pattern/, $options: "i" } }',
                    when_to_use: "Text search, pattern matching",
                    example: 'Names containing "john" (case-insensitive)',
                    result: regexExample.map(u => u.name)
                },
                "$expr": {
                    description: "Use aggregation expressions in find queries",
                    syntax: '{ $expr: { operator: [expressions] } }',
                    when_to_use: "When you need to compare fields within same document",
                    example: 'Products where price > cost',
                    result: `${expensiveProducts.length} products`
                }
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * UPDATE OPERATORS
 * Used in update operations ($set, $inc, $push, etc.)
 */
app.get("/operators/update", async (req, res) => {
    try {
        // Create a test user for demonstrations
        const testUser = await User.create({
            _id: 888,
            name: "Test User",
            email: "test@demo.com",
            age: 25,
            country: "Test",
            membership: "basic",
            tags: ["initial"],
            preferences: { newsletter: false }
        });

        // $set - Set field value
        await User.updateOne(
            { _id: 888 },
            { $set: { membership: "premium" } }
        );
        console.log('$set - Updated membership to premium');

        // $inc - Increment numeric field
        await User.updateOne(
            { _id: 888 },
            { $inc: { age: 1 } }  // age = age + 1
        );
        console.log('$inc - Incremented age by 1');

        // $push - Add element to array
        await User.updateOne(
            { _id: 888 },
            { $push: { tags: "new-tag" } }  // adds "new-tag" to tags array
        );
        console.log('$push - Added tag to array');

        // $addToSet - Add unique element to array (no duplicates)
        await User.updateOne(
            { _id: 888 },
            { $addToSet: { tags: "unique-tag" } }
        );
        console.log('$addToSet - Added unique tag');

        // $pull - Remove element from array
        await User.updateOne(
            { _id: 888 },
            { $pull: { tags: "initial" } }
        );
        console.log('$pull - Removed tag from array');

        // $unset - Remove field
        await User.updateOne(
            { _id: 888 },
            { $unset: { age: "" } }  // removes age field
        );
        console.log('$unset - Removed age field');

        // $rename - Rename field
        await User.updateOne(
            { _id: 888 },
            { $rename: { "membership": "tier" } }
        );
        console.log('$rename - Renamed membership to tier');

        // $mul - Multiply field
        await Product.updateOne(
            { _id: 101 },
            { $mul: { price: 1.1 } }  // price = price * 1.1 (10% increase)
        );
        console.log('$mul - Increased price by 10%');

        // Get updated user
        const updatedUser = await User.findById(888);
        console.log('Final state:', updatedUser);

        // Clean up - delete test user
        await User.deleteOne({ _id: 888 });

        // Reset product price
        await Product.updateOne(
            { _id: 101 },
            { $set: { price: 1299.99 } }
        );

        res.json({
            success: true,
            message: "Update Operators",
            operators: {
                "$set": {
                    description: "Set field value",
                    syntax: '{ $set: { field: value } }',
                    when_to_use: "Update specific fields without affecting others",
                    example: 'Update membership to premium'
                },
                "$inc": {
                    description: "Increment/decrement numeric value",
                    syntax: '{ $inc: { field: amount } }',
                    when_to_use: "Counters, age updates, stock changes",
                    example: 'Increase age by 1, decrease stock by 5'
                },
                "$push": {
                    description: "Add element to array",
                    syntax: '{ $push: { arrayField: value } }',
                    when_to_use: "Adding items to arrays (allows duplicates)",
                    example: 'Add new tag to tags array'
                },
                "$addToSet": {
                    description: "Add unique element to array",
                    syntax: '{ $addToSet: { arrayField: value } }',
                    when_to_use: "Adding items without duplicates",
                    example: 'Add tag only if it doesn\'t exist'
                },
                "$pull": {
                    description: "Remove element from array",
                    syntax: '{ $pull: { arrayField: value } }',
                    when_to_use: "Remove specific items from arrays",
                    example: 'Remove "initial" tag'
                },
                "$unset": {
                    description: "Remove field from document",
                    syntax: '{ $unset: { field: "" } }',
                    when_to_use: "Delete unwanted fields"
                },
                "$rename": {
                    description: "Rename field",
                    syntax: '{ $rename: { oldName: "newName" } }',
                    when_to_use: "Field name changes"
                },
                "$mul": {
                    description: "Multiply field by value",
                    syntax: '{ $mul: { field: multiplier } }',
                    when_to_use: "Percentage changes, calculations"
                }
            },
            testDocument: {
                created: "User 888",
                operations: "Tested $set, $inc, $push, $addToSet, $pull, $unset, $rename",
                cleanedUp: "Test user deleted"
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// OPERATORS THAT YOU NEED TO KNOW
// ============================================

/**
 * UPSERT - UPDATE OR INSERT
 * WHAT: Updates document if exists, inserts if not
 * WHEN: You want to update or create in single operation
 * WHY: Avoids checking if document exists first (race condition safe)
 */
app.get("/operators/upsert", async (req, res) => {
    try {
        console.log('\n===== UPSERT OPERATIONS =====');

        // UPSERT EXAMPLE 1: Basic upsert
        // If user with _id 999 exists, update it
        // If not, create new user
        const upsertResult1 = await User.updateOne(
            { _id: 999 },  // Find this document
            { 
                $set: { 
                    name: "Upserted User",
                    email: "upsert@test.com",
                    country: "India"
                },
                $setOnInsert: {  // Only set these on INSERT (not update)
                    createdAt: new Date(),
                    membership: "basic"
                }
            },
            { upsert: true }  // THIS IS THE KEY! upsert: true
        );
        
        console.log('Upsert Result:');
        console.log('  Matched:', upsertResult1.matchedCount);  // 0 if new, 1 if existing
        console.log('  Modified:', upsertResult1.modifiedCount);
        console.log('  Upserted:', upsertResult1.upsertedId);   // ID if new document created
        console.log('  Upserted Count:', upsertResult1.upsertedCount);

        // Check if document was created
        const newUser = await User.findById(999);
        console.log('Created user:', newUser?.name);

        // UPSERT EXAMPLE 2: findOneAndUpdate with upsert
        // Returns the document (old or new)
        const upsertResult2 = await User.findOneAndUpdate(
            { email: "newuser@test.com" },  // Find by email
            { 
                $set: { name: "Brand New User", country: "Canada" },
                $setOnInsert: { _id: 1000, membership: "premium" }
            },
            { 
                upsert: true,
                new: true,  // Return updated document
                setDefaultsOnInsert: true  // Apply schema defaults on insert
            }
        );
        console.log('Upserted user:', upsertResult2?.name);

        // UPSERT EXAMPLE 3: Increment with upsert (Counter pattern)
        // If counter exists, increment. If not, create with value 1
        const counterResult = await mongoose.connection.db
            .collection('counters')
            .updateOne(
                { _id: "userCounter" },
                { $inc: { count: 1 } },
                { upsert: true }
            );
        console.log('Counter upsert:', counterResult);

        // UPSERT EXAMPLE 4: Real-world use case - Update or create product stock
        const productUpsert = await Product.updateOne(
            { _id: 108 },  // Product may or may not exist
            {
                $set: {
                    name: "New Wireless Earbuds",
                    category: "Electronics",
                    price: 149.99,
                    rating: 4.5
                },
                $setOnInsert: {
                    cost: 75.00,
                    stock: 100
                },
                $inc: { stock: 10 }  // If exists, increment stock
            },
            { upsert: true }
        );
        console.log('Product upsert:', productUpsert);

        // UPSERT EXAMPLE 5: Bulk upsert - Update many, insert if not found
        const bulkOps = [
            {
                updateOne: {
                    filter: { _id: 999 },
                    update: { $set: { lastLogin: new Date() } },
                    upsert: true
                }
            },
            {
                updateOne: {
                    filter: { _id: 1000 },
                    update: { $set: { lastLogin: new Date() } },
                    upsert: true
                }
            }
        ];
        const bulkResult = await User.bulkWrite(bulkOps);
        console.log('Bulk upsert result:', bulkResult);

        // Clean up test data
        await User.deleteMany({ _id: { $in: [999, 1000] } });
        await Product.deleteOne({ _id: 108 });
        await mongoose.connection.db.collection('counters').drop();

        res.json({
            success: true,
            message: "UPSERT Operations ($upsert)",
            what_is_upsert: "Update if exists, Insert if not (Update + Insert = Upsert)",
            
            when_to_use_upsert: [
                "User login tracking (update lastLogin if user exists, create if new)",
                "Shopping cart (update quantity if item exists, add if new)",
                "Counters and sequences",
                "Caching (update cache if exists, create if missing)",
                "Avoiding race conditions in concurrent operations"
            ],
            
            why_upsert_is_important: [
                "Atomic operation - no check-then-act race condition",
                "Single database call instead of find + insert/update",
                "Thread-safe by default",
                "Better performance"
            ],
            
            examples: {
                basic_upsert: {
                    code: `User.updateOne(
    { _id: 999 },
    { $set: { name: "John" } },
    { upsert: true }
)`,
                    result: {
                        matched: upsertResult1.matchedCount,
                        modified: upsertResult1.modifiedCount,
                        upserted: upsertResult1.upsertedCount > 0 ? "New document created" : "Existing updated"
                    }
                },
                
                with_setOnInsert: {
                    code: `User.updateOne(
    { _id: 999 },
    {
        $set: { name: "John" },  // Always applied
        $setOnInsert: { createdAt: new Date() }  // Only on INSERT
    },
    { upsert: true }
)`,
                    explain: "$setOnInsert sets fields ONLY when inserting new document, not on update"
                },
                
                counter_pattern: {
                    code: `db.collection('counters').updateOne(
    { _id: "userCounter" },
    { $inc: { count: 1 } },
    { upsert: true }
)`,
                    use_case: "Auto-incrementing counters without sequences"
                },
                
                findOneAndUpdate_upsert: {
                    code: `User.findOneAndUpdate(
    { email: "new@email.com" },
    { $set: { name: "New User" } },
    { upsert: true, new: true }
)`,
                    benefit: "Returns the document (unlike updateOne which just returns result)"
                }
            },
            
            important_options: {
                "upsert: true": "Enables upsert behavior",
                "new: true": "Return updated document (not old one)",
                "setDefaultsOnInsert: true": "Apply Mongoose schema defaults on insert",
                "$setOnInsert": "Set fields only when inserting (not updating)"
            },
            
            common_mistakes: [
                "Forgetting upsert: true - then it just updates, never inserts",
                "Using upsert without unique index - might create duplicates",
                "Not using $setOnInsert - overwriting data that should only be set once",
                "Expecting updateOne to return document (use findOneAndUpdate for that)"
            ]
        });
    } catch (error) {
        // Handle duplicate key error (if upserting with same unique field)
        if (error.code === 11000) {
            return res.status(400).json({
                error: "Duplicate key - make sure your filter fields have unique index"
            });
        }
        res.status(500).json({ error: error.message });
    }
});

/**
 * $pop - Remove first or last element from array
 */
app.get("/operators/array-pop", async (req, res) => {
    try {
        // Create test user with multiple tags
        await User.create({
            _id: 777,
            name: "Array Test User",
            email: "array@test.com",
            age: 25,
            country: "Test",
            membership: "basic",
            tags: ["first", "second", "third", "fourth"]
        });

        // $pop: 1 - Remove LAST element
        await User.updateOne(
            { _id: 777 },
            { $pop: { tags: 1 } }  // Removes "fourth"
        );
        let user = await User.findById(777);
        console.log('After $pop 1 (remove last):', user.tags);

        // $pop: -1 - Remove FIRST element
        await User.updateOne(
            { _id: 777 },
            { $pop: { tags: -1 } }  // Removes "first"
        );
        user = await User.findById(777);
        console.log('After $pop -1 (remove first):', user.tags);

        // $pullAll - Remove ALL matching values
        await User.updateOne(
            { _id: 777 },
            { $pullAll: { tags: ["second", "third"] } }
        );
        user = await User.findById(777);
        console.log('After $pullAll:', user.tags);

        // $position - Add element at specific position
        await User.updateOne(
            { _id: 777 },
            { 
                $push: { 
                    tags: { 
                        $each: ["inserted1", "inserted2"],
                        $position: 0  // Insert at beginning
                    } 
                } 
            }
        );
        user = await User.findById(777);
        console.log('After $push with $position:', user.tags);

        // $slice - Limit array size after $push
        await User.updateOne(
            { _id: 777 },
            { 
                $push: { 
                    tags: { 
                        $each: ["new1", "new2", "new3", "new4"],
                        $slice: -3  // Keep only last 3 elements
                    } 
                } 
            }
        );
        user = await User.findById(777);
        console.log('After $push with $slice -3:', user.tags);

        // $sort - Sort array after $push
        await User.updateOne(
            { _id: 777 },
            { 
                $push: { 
                    tags: { 
                        $each: ["a-tag", "z-tag", "m-tag"],
                        $sort: 1  // Sort ascending
                    } 
                } 
            }
        );
        user = await User.findById(777);
        console.log('After $push with $sort:', user.tags);

        // Clean up
        await User.deleteOne({ _id: 777 });

        res.json({
            success: true,
            message: "Advanced Array Operators",
            operators: {
                "$pop": {
                    description: "Remove first or last element from array",
                    syntax: '{ $pop: { arrayField: 1 } }  // -1 for first, 1 for last',
                    when_to_use: "Queue operations (FIFO/LIFO)"
                },
                "$pullAll": {
                    description: "Remove all matching values from array",
                    syntax: '{ $pullAll: { arrayField: [val1, val2] } }',
                    when_to_use: "Remove multiple specific values at once",
                    difference_from_pull: "$pull can use conditions, $pullAll uses exact values"
                },
                "$position": {
                    description: "Insert at specific index",
                    syntax: '{ $push: { field: { $each: [vals], $position: 0 } } }',
                    when_to_use: "Insert at beginning or specific position"
                },
                "$slice": {
                    description: "Limit array size after modification",
                    syntax: '{ $push: { field: { $each: [vals], $slice: -5 } } }',
                    when_to_use: "Keep only last N elements (capped arrays)"
                },
                "$sort": {
                    description: "Sort array after modification",
                    syntax: '{ $push: { field: { $each: [vals], $sort: 1 } } }',
                    when_to_use: "Maintain sorted arrays"
                }
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * BITWISE OPERATORS
 * Used for bitwise operations on numbers
 */
app.get("/operators/bitwise", async (req, res) => {
    try {
        // Create test document with permissions
        await User.create({
            _id: 666,
            name: "Bitwise User",
            email: "bits@test.com",
            age: 30,
            country: "Test",
            membership: "basic",
            permissions: 0  // Binary: 0000
        });

        // Permissions mapping:
        // READ = 1   (001)
        // WRITE = 2  (010)
        // DELETE = 4 (100)
        // ADMIN = 8  (1000)

        // $bitsAllSet - Check if ALL specified bits are set
        const usersWithReadWrite = await User.find({
            permissions: { $bitsAllSet: [1, 2] }  // Has both READ and WRITE
        });

        // $bitsAnySet - Check if ANY specified bits are set
        const usersWithAny = await User.find({
            permissions: { $bitsAnySet: [1, 2, 4] }  // Has READ, WRITE, or DELETE
        });

        // $bitsAllClear - Check if ALL specified bits are clear
        const usersAllClear = await User.find({
            permissions: { $bitsAllClear: [4, 8] }  // DELETE and ADMIN are clear
        });

        // Update bits using $bit
        await User.updateOne(
            { _id: 666 },
            { $bit: { permissions: { or: 3 } } }  // Add READ (1) and WRITE (2)
        );
        
        let user = await User.findById(666);
        console.log('Permissions after OR:', user.permissions.toString(2));  // 0011

        await User.updateOne(
            { _id: 666 },
            { $bit: { permissions: { and: ~2 } } }  // Remove WRITE bit
        );
        
        user = await User.findById(666);
        console.log('Permissions after AND:', user.permissions.toString(2));

        // Clean up
        await User.deleteOne({ _id: 666 });

        res.json({
            success: true,
            message: "Bitwise Operators",
            operators: {
                "$bitsAllSet": {
                    description: "Matches if ALL specified bits are 1",
                    syntax: '{ field: { $bitsAllSet: [bit1, bit2] } }',
                    when_to_use: "Permission checking (has all required permissions)"
                },
                "$bitsAnySet": {
                    description: "Matches if ANY specified bits are 1",
                    syntax: '{ field: { $bitsAnySet: [bit1, bit2] } }',
                    when_to_use: "Check if user has any of the permissions"
                },
                "$bitsAllClear": {
                    description: "Matches if ALL specified bits are 0",
                    syntax: '{ field: { $bitsAllClear: [bit1, bit2] } }',
                    when_to_use: "Check permissions are NOT set"
                },
                "$bit": {
                    description: "Update bits using AND, OR, XOR",
                    syntax: '{ $bit: { field: { and/or/xor: value } } }',
                    when_to_use: "Modify individual permission bits"
                }
            },
            common_use_case: "Permission systems, feature flags, settings"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * $currentDate - Set field to current date
 * $min - Update only if new value is LESS than current
 * $max - Update only if new value is GREATER than current
 */
app.get("/operators/special-update", async (req, res) => {
    try {
        // Create test product
        await Product.create({
            _id: 555,
            name: "Special Product",
            category: "Test",
            price: 100,
            cost: 50,
            stock: 100,
            rating: 4.0,
            tags: ["test"]
        });

        // $currentDate - Set field to current date/time
        await Product.updateOne(
            { _id: 555 },
            { 
                $currentDate: { 
                    lastModified: true,  // Sets to current date
                    "specs.lastChecked": { $type: "timestamp" }  // Timestamp type
                } 
            }
        );
        let product = await Product.findById(555);
        console.log('After $currentDate:', product.lastModified);

        // $min - Update only if new value is SMALLER
        // Stock was 100, new value 50 is smaller, so it updates
        await Product.updateOne(
            { _id: 555 },
            { $min: { stock: 50 } }  // Only updates if 50 < current stock
        );
        product = await Product.findById(555);
        console.log('After $min (50):', product.stock);  // 50 (updated)

        // $min - Won't update because 80 > 50
        await Product.updateOne(
            { _id: 555 },
            { $min: { stock: 80 } }  // Won't update because 80 > 50
        );
        product = await Product.findById(555);
        console.log('After $min (80):', product.stock);  // Still 50 (not updated)

        // $max - Update only if new value is LARGER
        await Product.updateOne(
            { _id: 555 },
            { $max: { rating: 4.5 } }  // Updates because 4.5 > 4.0
        );
        product = await Product.findById(555);
        console.log('After $max (4.5):', product.rating);  // 4.5

        // $max - Won't update because 3.0 < 4.5
        await Product.updateOne(
            { _id: 555 },
            { $max: { rating: 3.0 } }  // Won't update because 3.0 < 4.5
        );
        product = await Product.findById(555);
        console.log('After $max (3.0):', product.rating);  // Still 4.5

        // $mul - Multiply field value
        await Product.updateOne(
            { _id: 555 },
            { $mul: { price: 1.2 } }  // price = price * 1.2 (20% increase)
        );
        product = await Product.findById(555);
        console.log('After $mul:', product.price);  // 120

        // Clean up
        await Product.deleteOne({ _id: 555 });

        res.json({
            success: true,
            message: "Special Update Operators",
            operators: {
                "$currentDate": {
                    description: "Set field to current date/time",
                    syntax: '{ $currentDate: { field: true } }',
                    when_to_use: "Tracking last modified timestamps automatically"
                },
                "$min": {
                    description: "Update only if new value is LESS than current",
                    syntax: '{ $min: { field: value } }',
                    when_to_use: "Lowest price tracking, lowest score",
                    example: "Stock was 100, $min: 50 → updates to 50. $min: 80 → no update (80 > 50)"
                },
                "$max": {
                    description: "Update only if new value is GREATER than current",
                    syntax: '{ $max: { field: value } }',
                    when_to_use: "High score tracking, highest bid",
                    example: "Rating was 4.0, $max: 4.5 → updates to 4.5. $max: 3.0 → no update (3.0 < 4.5)"
                },
                "$mul": {
                    description: "Multiply field by value",
                    syntax: '{ $mul: { field: multiplier } }',
                    when_to_use: "Percentage calculations, price adjustments"
                }
            },
            real_world_examples: {
                "$min_stock": "Track lowest stock level ever reached",
                "$max_rating": "Track highest rating ever achieved",
                "$currentDate": "Automatic lastModified timestamp",
                "$mul": "Bulk price increase by percentage"
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * $text - Full Text Search
 * $search - MongoDB Atlas Search (if using Atlas)
 */
app.get("/operators/text-search", async (req, res) => {
    try {
        // First, create text index (you'd typically do this once in setup)
        try {
            await Product.collection.createIndex({ name: "text", category: "text" });
            console.log('Text index created');
        } catch (e) {
            console.log('Text index may already exist');
        }

        // $text - Basic text search
        const searchResults = await Product.find({
            $text: { $search: "macbook pro" }
        });
        console.log('Text search "macbook pro":', searchResults.map(p => p.name));

        // $text with exact phrase
        const phraseSearch = await Product.find({
            $text: { $search: "\"running shoes\"" }  // Exact phrase
        });
        console.log('Phrase search:', phraseSearch.map(p => p.name));

        // $text with exclusions
        const excludeSearch = await Product.find({
            $text: { $search: "apple -phone" }  // apple but not phone
        });
        console.log('Search excluding:', excludeSearch.map(p => p.name));

        // $text with score sorting (relevance)
        const scoredResults = await Product.aggregate([
            { $match: { $text: { $search: "apple electronics" } } },
            { $addFields: { score: { $meta: "textScore" } } },
            { $sort: { score: -1 } },
            { $project: { name: 1, category: 1, score: 1, _id: 0 } }
        ]);
        console.log('Scored results:', scoredResults);

        res.json({
            success: true,
            message: "Text Search Operators",
            setup: "db.collection.createIndex({ field: 'text' })",
            operators: {
                "$text": {
                    description: "Full text search",
                    syntax: '{ $text: { $search: "search terms" } }',
                    features: [
                        "Multi-word search: macbook pro (OR by default)",
                        "Exact phrase: \"running shoes\"",
                        "Exclusion: apple -phone (apple but NOT phone)",
                        "Scoring: { $meta: 'textScore' } for relevance"
                    ],
                    when_to_use: "Search functionality, autocomplete, content search"
                }
            },
            examples: {
                basic_search: searchResults.map(p => p.name),
                phrase_search: phraseSearch.map(p => p.name),
                exclusion_search: excludeSearch.map(p => p.name),
                scored_search: scoredResults
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * $comment - Add comments to queries for logging
 * $explain - Query execution plan
 * $hint - Force index usage
 */
app.get("/operators/query-modifiers", async (req, res) => {
    try {
        // $comment - Add comment to query (appears in logs)
        const users = await User.find({
            country: "USA"
        }).comment("Fetching USA users for dashboard").maxTimeMS(5000);

        // $explain - See query execution plan
        const explainResult = await User.find({
            country: "USA",
            membership: "premium"
        }).explain("executionStats");

        // $hint - Force specific index
        // First create an index
        await User.collection.createIndex({ country: 1, membership: 1 });
        
        const hintedResult = await User.find({
            country: "USA"
        }).hint({ country: 1, membership: 1 });

        // $maxTimeMS - Set query timeout
        // $readPreference - Specify read preference
        const quickUsers = await User.find()
            .maxTimeMS(5000)  // Cancel if takes > 5 seconds
            .read('secondaryPreferred');  // Read from secondary if available

        res.json({
            success: true,
            message: "Query Modifier Operators",
            operators: {
                "$comment": {
                    description: "Add comment to query for logging",
                    syntax: 'Model.find().comment("your comment")',
                    when_to_use: "Debugging, audit logging"
                },
                "$explain": {
                    description: "Show query execution plan",
                    syntax: 'Model.find().explain("executionStats")',
                    when_to_use: "Performance tuning, debugging slow queries"
                },
                "$hint": {
                    description: "Force use of specific index",
                    syntax: 'Model.find().hint({ field: 1 })',
                    when_to_use: "Performance optimization when MongoDB picks wrong index"
                },
                "$maxTimeMS": {
                    description: "Set query timeout in milliseconds",
                    syntax: 'Model.find().maxTimeMS(5000)',
                    when_to_use: "Prevent long-running queries"
                }
            },
            explain_stats: {
                executionTime: explainResult.executionStats?.executionTimeMillis + 'ms',
                documentsExamined: explainResult.executionStats?.totalDocsExamined,
                indexUsed: explainResult.executionStats?.usedIndexes || 'No index'
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * COMPLETE ALL OPERATORS REFERENCE
 */
app.get("/operators/complete-reference", async (req, res) => {
    res.json({
        success: true,
        message: "COMPLETE MONGODB OPERATORS REFERENCE",
        
        query_selectors: {
            comparison: {
                "$eq": "Equal to",
                "$ne": "Not equal to",
                "$gt": "Greater than",
                "$gte": "Greater than or equal",
                "$lt": "Less than",
                "$lte": "Less than or equal",
                "$in": "Matches any in array",
                "$nin": "Matches none in array"
            },
            logical: {
                "$and": "ALL conditions true",
                "$or": "ANY condition true",
                "$nor": "NO condition true",
                "$not": "Inverts condition"
            },
            element: {
                "$exists": "Field exists",
                "$type": "Check type"
            },
            array: {
                "$all": "Contains all values",
                "$size": "Array length",
                "$elemMatch": "Element matches all conditions"
            },
            evaluation: {
                "$regex": "Pattern matching",
                "$expr": "Aggregation expressions",
                "$text": "Full text search",
                "$where": "JavaScript expressions (avoid if possible)"
            },
            bitwise: {
                "$bitsAllSet": "All bits set",
                "$bitsAnySet": "Any bits set",
                "$bitsAllClear": "All bits clear"
            }
        },
        
        update_operators: {
            fields: {
                "$set": "Set value",
                "$unset": "Remove field",
                "$rename": "Rename field",
                "$inc": "Increment",
                "$mul": "Multiply",
                "$min": "Update if less",
                "$max": "Update if greater",
                "$currentDate": "Set to current date"
            },
            array: {
                "$push": "Add to array",
                "$addToSet": "Add unique to array",
                "$pop": "Remove first/last",
                "$pull": "Remove matching",
                "$pullAll": "Remove all matching"
            },
            array_modifiers: {
                "$each": "Add multiple",
                "$position": "Insert at position",
                "$slice": "Limit array size",
                "$sort": "Sort array"
            },
            bitwise: {
                "$bit": "Bit operations {and, or, xor}"
            }
        },
        
        special_operations: {
            "upsert": {
                description: "Update or Insert",
                syntax: '{ upsert: true }',
                when: "Don't know if document exists"
            },
            "$setOnInsert": {
                description: "Set fields only on insert",
                syntax: '{ $setOnInsert: { field: value } }',
                when: "Set default values only for new documents"
            }
        },
        
        endpoints: [
            "GET /operators/comparison",
            "GET /operators/logical",
            "GET /operators/element",
            "GET /operators/array",
            "GET /operators/evaluation",
            "GET /operators/update",
            "GET /operators/upsert",
            "GET /operators/array-pop",
            "GET /operators/bitwise",
            "GET /operators/special-update",
            "GET /operators/text-search",
            "GET /operators/query-modifiers",
            "GET /operators/complete-reference"
        ]
    });
});

// ============================================
// MONGODB CONNECTION
// ============================================
console.log("Connecting to MongoDB:", process.env.MONGO_URI);

mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        console.log(" MongoDB Connected Successfully");
        
        // Quick data check
        const stats = {
            users: await User.countDocuments(),
            products: await Product.countDocuments(),
            orders: await Order.countDocuments(),
            reviews: await Review.countDocuments()
        };
        
        console.log(' Database Statistics:');
        console.log(`   Users: ${stats.users}`);
        console.log(`   Products: ${stats.products}`);
        console.log(`   Orders: ${stats.orders}`);
        console.log(`   Reviews: ${stats.reviews}`);
        console.log('\n Server ready! Visit http://localhost:3000 for API guide\n');
    })
    .catch((err) => {
        console.error(" MongoDB Connection Error:", err);
        process.exit(1);
    });

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`⚡ Server running on http://localhost:${PORT}`);
});