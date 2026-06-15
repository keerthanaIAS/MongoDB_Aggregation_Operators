const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');

// ============================================
// BASIC AGGREGATION OPERATIONS
// ============================================

/**
 * $match - Filtering Documents
 * WHAT: Filters documents based on conditions
 * WHEN: Always put $match FIRST to reduce data for next stages
 * WHY: Earlier filtering = faster queries = less memory usage
 */
exports.basicMatch = async (req, res) => {
    try {
        // Get all premium users
        const premiumUsers = await User.aggregate([
            {
                $match: {
                    membership: "premium"
                }
            }
        ]);
        console.log('Premium Users:', premiumUsers.length);

        // Premium users from USA with age >= 25
        const usaPremiumUsers = await User.aggregate([
            {
                $match: {
                    membership: "premium",
                    country: "USA",
                    age: { $gte: 25 }
                }
            }
        ]);
        console.log('USA Premium Users:', usaPremiumUsers);

        // Orders between specific dates
        const februaryOrders = await Order.aggregate([
            {
                $match: {
                    orderDate: {
                        $gte: new Date("2024-02-01"),
                        $lte: new Date("2024-02-15")
                    },
                    status: { $ne: "cancelled" }
                }
            }
        ]);
        console.log('February Orders:', februaryOrders.length);

        // Array matching - Users with specific interests
        const techUsers = await User.aggregate([
            {
                $match: {
                    tags: { $in: ["tech", "gaming"] }
                }
            }
        ]);
        console.log('Tech/Gaming Users:', techUsers.length);

        res.json({
            success: true,
            message: "$match operations completed",
            data: {
                premiumUsersCount: premiumUsers.length,
                usaPremiumUsersCount: usaPremiumUsers.length,
                februaryOrdersCount: februaryOrders.length,
                techUsersCount: techUsers.length
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * $project - Selecting & Transforming Fields
 * WHAT: Selects specific fields, creates computed fields, reshapes documents
 * WHEN: Need specific fields for API response or want calculated values
 * WHY: Reduces network transfer, transforms data at database level
 */
exports.basicProject = async (req, res) => {
    try {
        // Select specific fields
        const userBasicInfo = await User.aggregate([
            {
                $project: {
                    name: 1,
                    email: 1,
                    country: 1,
                    _id: 0  // Exclude _id
                }
            }
        ]);
        console.log('User Basic Info:', userBasicInfo[0]);

        // Create computed fields from orders
        const orderSummary = await Order.aggregate([
            {
                $project: {
                    userId: 1,
                    totalAmount: 1,
                    // NEW FIELD: Calculate estimated profit (30% margin)
                    estimatedProfit: { 
                        $round: [{ $multiply: ["$totalAmount", 0.3] }, 2] 
                    },
                    // NEW FIELD: Count items in order
                    itemCount: { $size: "$items" },
                    // NEW FIELD: Is express shipping?
                    isExpress: { 
                        $eq: ["$shipping.method", "express"] 
                    },
                    // NEW FIELD: Order category
                    orderCategory: {
                        $cond: {
                            if: { $gte: ["$totalAmount", 1000] },
                            then: "High Value",
                            else: "Regular"
                        }
                    }
                }
            }
        ]);
        console.log('Order Summary Sample:', orderSummary[0]);

        // Product price analysis
        const productAnalysis = await Product.aggregate([
            {
                $project: {
                    name: 1,
                    originalPrice: "$price",
                    // 20% discount price
                    discountPrice: { 
                        $round: [{ $multiply: ["$price", 0.8] }, 2] 
                    },
                    // Profit per item
                    profit: { 
                        $round: [{ $subtract: ["$price", "$cost"] }, 2] 
                    },
                    // Profit margin percentage
                    marginPercent: {
                        $round: [
                            { 
                                $multiply: [
                                    { $divide: [{ $subtract: ["$price", "$cost"] }, "$price"] },
                                    100
                                ]
                            },
                            1
                        ]
                    },
                    // Stock status
                    stockStatus: {
                        $switch: {
                            branches: [
                                { case: { $gte: ["$stock", 100] }, then: "✅ In Stock" },
                                { case: { $gte: ["$stock", 50] }, then: "⚠️ Low Stock" },
                            ],
                            default: "🚨 Critical"
                        }
                    }
                }
            }
        ]);
        console.log('Product Analysis Sample:', productAnalysis[0]);

        res.json({
            success: true,
            message: "$project operations completed",
            data: {
                userBasicInfo: userBasicInfo[0],
                orderSummary: orderSummary[0],
                productAnalysis: productAnalysis
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * $group - Aggregating Data
 * WHAT: Groups documents and performs calculations (sum, avg, count)
 * WHEN: Need reports, summaries, statistics
 * WHY: Database-level calculations are faster than application-level
 */
exports.basicGroup = async (req, res) => {
    try {
        // Orders by status
        const ordersByStatus = await Order.aggregate([
            {
                $group: {
                    _id: "$status",
                    orderCount: { $sum: 1 },
                    totalRevenue: { $sum: "$totalAmount" },
                    avgOrderValue: { $avg: "$totalAmount" }
                }
            },
            { $sort: { orderCount: -1 } }
        ]);
        console.log('Orders by Status:', ordersByStatus);

        // Customer spending analysis
        const customerSpending = await Order.aggregate([
            {
                $group: {
                    _id: "$userId",
                    orderCount: { $sum: 1 },
                    totalSpent: { 
                        $round: [{ $sum: "$totalAmount" }, 2] 
                    },
                    avgSpent: { 
                        $round: [{ $avg: "$totalAmount" }, 2] 
                    },
                    minOrder: { $min: "$totalAmount" },
                    maxOrder: { $max: "$totalAmount" }
                }
            },
            { $sort: { totalSpent: -1 } }
        ]);
        console.log('Customer Spending:', customerSpending);

        // Products by category
        const productsByCategory = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    productCount: { $sum: 1 },
                    avgPrice: { $round: [{ $avg: "$price" }, 2] },
                    totalStock: { $sum: "$stock" },
                    totalValue: { 
                        $round: [{ $sum: { $multiply: ["$price", "$stock"] } }, 2] 
                    }
                }
            }
        ]);
        console.log('Products by Category:', productsByCategory);

        // Group with array accumulators
        const usersByCountry = await User.aggregate([
            {
                $group: {
                    _id: "$country",
                    userCount: { $sum: 1 },
                    users: { $push: "$name" },         // All names
                    uniqueTags: { $addToSet: "$tags" }, // Unique tags only
                    avgAge: { $avg: "$age" }
                }
            }
        ]);
        console.log('Users by Country:', usersByCountry);

        res.json({
            success: true,
            message: "$group operations completed",
            data: {
                ordersByStatus,
                customerSpending,
                productsByCategory,
                usersByCountry
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ============================================
// INTERMEDIATE OPERATIONS
// ============================================

/**
 * $unwind - Deconstructing Arrays
 * WHAT: Takes array field and creates separate document for each element
 * WHEN: Need to analyze individual items in arrays
 * WHY: Can't group array elements without unwinding them first
 */
exports.intermediateUnwind = async (req, res) => {
    try {
        // See what unwind does
        const singleOrder = await Order.aggregate([
            { $match: { _id: 1001 } },
            { $unwind: "$items" },
            {
                $project: {
                    productId: "$items.productId",
                    quantity: "$items.quantity",
                    price: "$items.priceAtPurchase",
                    lineTotal: {
                        $multiply: ["$items.quantity", "$items.priceAtPurchase"]
                    }
                }
            }
        ]);
        console.log('Unwound Order:', singleOrder);

        // Product sales analysis (REAL USE CASE)
        const productSales = await Order.aggregate([
            // Step 1: Only completed orders
            { $match: { status: "delivered" } },
            
            // Step 2: Unwind to analyze each product separately
            { $unwind: "$items" },
            
            // Step 3: Group by product
            {
                $group: {
                    _id: "$items.productId",
                    totalQuantity: { $sum: "$items.quantity" },
                    totalRevenue: {
                        $sum: {
                            $multiply: ["$items.quantity", "$items.priceAtPurchase"]
                        }
                    },
                    timesOrdered: { $sum: 1 },
                    avgPrice: { $avg: "$items.priceAtPurchase" }
                }
            },
            
            // Step 4: Join with product details
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productInfo"
                }
            },
            { $unwind: "$productInfo" },
            
            // Step 5: Format output
            {
                $project: {
                    productName: "$productInfo.name",
                    category: "$productInfo.category",
                    totalQuantity: 1,
                    totalRevenue: { $round: ["$totalRevenue", 2] },
                    avgPrice: { $round: ["$avgPrice", 2] },
                    timesOrdered: 1,
                    _id: 0
                }
            },
            
            // Step 6: Sort by best seller
            { $sort: { totalRevenue: -1 } }
        ]);
        console.log('Product Sales Analysis:', productSales);

        res.json({
            success: true,
            message: "$unwind operations completed",
            data: {
                unwoundOrder: singleOrder,
                productSalesAnalysis: productSales
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * $lookup - Joining Collections (MongoDB's JOIN)
 * WHAT: Performs left outer join with another collection
 * WHEN: Need data from multiple collections in one query
 * WHY: Avoids N+1 problem and multiple database queries
 */
exports.intermediateLookup = async (req, res) => {
    try {
        // Orders with customer details
        const ordersWithCustomers = await Order.aggregate([
            {
                $lookup: {
                    from: "users",          // Collection to join
                    localField: "userId",   // Field from orders
                    foreignField: "_id",    // Field from users
                    as: "customer"          // Output field name
                }
            },
            { $unwind: "$customer" },       // Lookup returns array, unwind it
            {
                $project: {
                    orderId: "$_id",
                    customerName: "$customer.name",
                    customerEmail: "$customer.email",
                    customerCountry: "$customer.country",
                    totalAmount: 1,
                    status: 1,
                    orderDate: 1,
                    _id: 0
                }
            }
        ]);
        console.log('Orders with Customers:', ordersWithCustomers[0]);

        // Advanced lookup with pipeline (Premium customers only)
        const premiumCustomerOrders = await Order.aggregate([
            {
                $lookup: {
                    from: "users",
                    let: { userId: "$userId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$_id", "$$userId"] },
                                membership: "premium"
                            }
                        },
                        {
                            $project: { name: 1, email: 1, membership: 1, _id: 0 }
                        }
                    ],
                    as: "premiumCustomer"
                }
            },
            { $match: { "premiumCustomer": { $ne: [] } } },
            { $unwind: "$premiumCustomer" },
            {
                $project: {
                    orderId: "$_id",
                    customer: "$premiumCustomer.name",
                    membership: "$premiumCustomer.membership",
                    totalAmount: 1,
                    status: 1,
                    _id: 0
                }
            }
        ]);
        console.log('Premium Customer Orders:', premiumCustomerOrders);

        // Complete order details (Orders + Users + Products + Reviews)
        const completeOrders = await Order.aggregate([
            // Join with users
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            
            // Unwind items for product join
            { $unwind: "$items" },
            
            // Join with products
            {
                $lookup: {
                    from: "products",
                    localField: "items.productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            
            // Join with reviews (did this customer review this product?)
            {
                $lookup: {
                    from: "reviews",
                    let: {
                        prodId: "$items.productId",
                        custId: "$userId"
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$productId", "$$prodId"] },
                                        { $eq: ["$userId", "$$custId"] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "review"
                }
            },
            
            // Format final output
            {
                $project: {
                    orderId: "$_id",
                    customerName: "$user.name",
                    customerEmail: "$user.email",
                    productName: "$product.name",
                    category: "$product.category",
                    quantity: "$items.quantity",
                    price: "$items.priceAtPurchase",
                    lineTotal: {
                        $multiply: ["$items.quantity", "$items.priceAtPurchase"]
                    },
                    orderStatus: "$status",
                    orderDate: 1,
                    reviewed: {
                        $cond: {
                            if: { $gt: [{ $size: "$review" }, 0] },
                            then: true,
                            else: false
                        }
                    },
                    _id: 0
                }
            }
        ]);
        console.log('Complete Orders Sample:', completeOrders[0]);

        res.json({
            success: true,
            message: "$lookup operations completed",
            data: {
                ordersWithCustomers: ordersWithCustomers[0],
                premiumCustomerOrders,
                completeOrderSample: completeOrders[0]
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ============================================
// ADVANCED OPERATIONS
// ============================================

/**
 * $facet - Multi-dimensional Analysis (DASHBOARD)
 * WHAT: Runs multiple pipelines simultaneously on same data
 * WHEN: Building dashboards with multiple metrics
 * WHY: One query instead of multiple = faster response time
 */
exports.advancedFacet = async (req, res) => {
    try {
        // COMPLETE BUSINESS DASHBOARD
        const dashboard = await Order.aggregate([
            {
                $facet: {
                    // Panel 1: Revenue by status
                    "revenueByStatus": [
                        {
                            $group: {
                                _id: "$status",
                                orderCount: { $sum: 1 },
                                revenue: { 
                                    $round: [{ $sum: "$totalAmount" }, 2] 
                                },
                                avgValue: { 
                                    $round: [{ $avg: "$totalAmount" }, 2] 
                                }
                            }
                        }
                    ],
                    
                    // Panel 2: Top customers
                    "topCustomers": [
                        {
                            $group: {
                                _id: "$userId",
                                totalSpent: { $sum: "$totalAmount" },
                                orderCount: { $sum: 1 }
                            }
                        },
                        { $sort: { totalSpent: -1 } },
                        { $limit: 3 },
                        {
                            $lookup: {
                                from: "users",
                                localField: "_id",
                                foreignField: "_id",
                                as: "user"
                            }
                        },
                        { $unwind: "$user" },
                        {
                            $project: {
                                name: "$user.name",
                                email: "$user.email",
                                totalSpent: { $round: ["$totalSpent", 2] },
                                orderCount: 1,
                                _id: 0
                            }
                        }
                    ],
                    
                    // Panel 3: Payment method analysis
                    "paymentAnalysis": [
                        {
                            $group: {
                                _id: "$payment.method",
                                count: { $sum: 1 },
                                totalAmount: { $sum: "$totalAmount" }
                            }
                        }
                    ],
                    
                    // Panel 4: Monthly trend
                    "monthlyTrend": [
                        {
                            $group: {
                                _id: {
                                    year: { $year: "$orderDate" },
                                    month: { $month: "$orderDate" }
                                },
                                revenue: { $sum: "$totalAmount" },
                                orders: { $sum: 1 }
                            }
                        },
                        { $sort: { "_id.year": 1, "_id.month": 1 } },
                        {
                            $project: {
                                period: {
                                    $concat: [
                                        { $toString: "$_id.year" },
                                        "-",
                                        { $toString: "$_id.month" }
                                    ]
                                },
                                revenue: { $round: ["$revenue", 2] },
                                orders: 1,
                                _id: 0
                            }
                        }
                    ],
                    
                    // Panel 5: Shipping analysis
                    "shippingAnalysis": [
                        {
                            $group: {
                                _id: "$shipping.method",
                                count: { $sum: 1 },
                                totalCost: { $sum: "$shipping.cost" },
                                avgCost: { $round: [{ $avg: "$shipping.cost" }, 2] }
                            }
                        }
                    ]
                }
            }
        ]);

        console.log('Dashboard Generated Successfully');

        res.json({
            success: true,
            message: "Business Dashboard ($facet) completed",
            data: dashboard[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * $bucket - Data Binning/Segmentation
 * WHAT: Groups data into predefined ranges
 * WHEN: Creating segments, ranges, distribution analysis
 * WHY: Better than multiple group stages for range-based analysis
 */
exports.advancedBucket = async (req, res) => {
    try {
        // Order value distribution
        const orderDistribution = await Order.aggregate([
            {
                $bucket: {
                    groupBy: "$totalAmount",
                    boundaries: [0, 500, 1000, 1500, 2000],
                    default: "2000+",
                    output: {
                        count: { $sum: 1 },
                        orders: { $push: "$_id" },
                        totalRevenue: { $round: [{ $sum: "$totalAmount" }, 2] }
                    }
                }
            }
        ]);
        console.log('Order Distribution:', orderDistribution);

        // Customer segmentation by spending
        const customerSegments = await Order.aggregate([
            {
                $group: {
                    _id: "$userId",
                    totalSpent: { $sum: "$totalAmount" },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $bucket: {
                    groupBy: "$totalSpent",
                    boundaries: [0, 500, 1000, 2000, 3000],
                    default: "3000+",
                    output: {
                        customerCount: { $sum: 1 },
                        customers: { $push: "$_id" },
                        totalRevenue: { $round: [{ $sum: "$totalSpent" }, 2] }
                    }
                }
            }
        ]);
        console.log('Customer Segments:', customerSegments);

        res.json({
            success: true,
            message: "$bucket operations completed",
            data: {
                orderDistribution,
                customerSegments
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ============================================
// LEVEL 4: REAL-WORLD ANALYTICS APIS
// ============================================

/**
 * Customer Lifetime Value Analysis
 * Combines: $match, $group, $addFields, $lookup, $project
 */
exports.customerLifetimeValue = async (req, res) => {
    try {
        const clv = await Order.aggregate([
            // Step 1: Only successful orders
            { 
                $match: { 
                    status: { $ne: "cancelled" } 
                } 
            },
            
            // Step 2: Group by customer with statistics
            {
                $group: {
                    _id: "$userId",
                    totalSpent: { $sum: "$totalAmount" },
                    orderCount: { $sum: 1 },
                    firstOrder: { $min: "$orderDate" },
                    lastOrder: { $max: "$orderDate" },
                    avgOrderValue: { $avg: "$totalAmount" }
                }
            },
            
            // Step 3: Add calculated fields
            {
                $addFields: {
                    // Customer segment based on spending
                    segment: {
                        $switch: {
                            branches: [
                                { 
                                    case: { $gte: ["$totalSpent", 1500] }, 
                                    then: "VIP 🏆" 
                                },
                                { 
                                    case: { $gte: ["$totalSpent", 500] }, 
                                    then: "Regular ⭐" 
                                },
                            ],
                            default: "New 🌱"
                        }
                    },
                    // Days since last order
                    daysSinceLastOrder: {
                        $dateDiff: {
                            startDate: "$lastOrder",
                            endDate: new Date(),
                            unit: "day"
                        }
                    },
                    // Customer lifetime in days
                    lifetimeDays: {
                        $dateDiff: {
                            startDate: "$firstOrder",
                            endDate: new Date(),
                            unit: "day"
                        }
                    }
                }
            },
            
            // Step 4: Join user details
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            
            // Step 5: Format final output
            {
                $project: {
                    customerId: "$_id",
                    name: "$userDetails.name",
                    email: "$userDetails.email",
                    country: "$userDetails.country",
                    membership: "$userDetails.membership",
                    totalSpent: { $round: ["$totalSpent", 2] },
                    orderCount: 1,
                    avgOrderValue: { $round: ["$avgOrderValue", 2] },
                    segment: 1,
                    daysSinceLastOrder: 1,
                    lifetimeDays: 1,
                    _id: 0
                }
            },
            
            // Step 6: Sort by value
            { $sort: { totalSpent: -1 } }
        ]);

        // Calculate overall metrics
        const totalCustomers = clv.length;
        const vipCustomers = clv.filter(c => c.segment === "VIP 🏆").length;
        const atRiskCustomers = clv.filter(c => c.daysSinceLastOrder > 30).length;

        console.log(`CLV Analysis: ${totalCustomers} customers, ${vipCustomers} VIPs, ${atRiskCustomers} at risk`);

        res.json({
            success: true,
            message: "Customer Lifetime Value Analysis",
            summary: {
                totalCustomers,
                vipCustomers,
                atRiskCustomers,
                averageOrderValue: (clv.reduce((sum, c) => sum + c.avgOrderValue, 0) / totalCustomers).toFixed(2)
            },
            data: clv
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Product Performance with Reviews
 * Combines: $unwind, $group, $lookup, $addFields, $project
 */
exports.productPerformance = async (req, res) => {
    try {
        const performance = await Order.aggregate([
            // Only delivered orders
            { $match: { status: "delivered" } },
            
            // Unwind to analyze each product
            { $unwind: "$items" },
            
            // Group by product
            {
                $group: {
                    _id: "$items.productId",
                    unitsSold: { $sum: "$items.quantity" },
                    revenue: {
                        $sum: {
                            $multiply: ["$items.quantity", "$items.priceAtPurchase"]
                        }
                    },
                    orderCount: { $sum: 1 }
                }
            },
            
            // Join product details
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            
            // Join reviews
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "productId",
                    as: "reviews"
                }
            },
            
            // Calculate performance metrics
            {
                $addFields: {
                    avgRating: { $round: [{ $avg: "$reviews.rating" }, 1] },
                    reviewCount: { $size: "$reviews" },
                    revenuePerUnit: { $round: [{ $divide: ["$revenue", "$unitsSold"] }, 2] },
                    estimatedProfit: {
                        $round: [
                            { $subtract: ["$revenue", { $multiply: ["$unitsSold", "$product.cost"] }] },
                            2
                        ]
                    },
                    profitMargin: {
                        $round: [
                            {
                                $multiply: [
                                    {
                                        $divide: [
                                            { $subtract: ["$revenue", { $multiply: ["$unitsSold", "$product.cost"] }] },
                                            "$revenue"
                                        ]
                                    },
                                    100
                                ]
                            },
                            1
                        ]
                    }
                }
            },
            
            // Format output
            {
                $project: {
                    productName: "$product.name",
                    category: "$product.category",
                    currentPrice: "$product.price",
                    currentStock: "$product.stock",
                    unitsSold: 1,
                    revenue: { $round: ["$revenue", 2] },
                    estimatedProfit: 1,
                    profitMargin: 1,
                    avgRating: 1,
                    reviewCount: 1,
                    revenuePerUnit: 1,
                    _id: 0
                }
            },
            
            // Sort by best performer
            { $sort: { revenue: -1 } }
        ]);

        // Summary
        const totalRevenue = performance.reduce((sum, p) => sum + p.revenue, 0);
        const bestProduct = performance[0];
        const worstProduct = performance[performance.length - 1];

        console.log(`Product Performance: ${performance.length} products analyzed`);

        res.json({
            success: true,
            message: "Product Performance Analysis",
            summary: {
                totalProducts: performance.length,
                totalRevenue: totalRevenue.toFixed(2),
                bestPerformer: `${bestProduct.productName} ($${bestProduct.revenue})`,
                needsImprovement: `${worstProduct.productName} ($${worstProduct.revenue})`
            },
            data: performance
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Real-time Inventory Health Check
 * Combines: $lookup, $addFields, $project, $sort
 */
exports.inventoryHealth = async (req, res) => {
    try {
        const inventory = await Product.aggregate([
            // Get reviews for each product
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "productId",
                    as: "reviews"
                }
            },
            
            // Calculate health metrics
            {
                $addFields: {
                    avgRating: { $round: [{ $avg: "$reviews.rating" }, 1] },
                    reviewCount: { $size: "$reviews" },
                    
                    // Profit margin
                    marginPercent: {
                        $round: [
                            { 
                                $multiply: [
                                    { $divide: [{ $subtract: ["$price", "$cost"] }, "$price"] },
                                    100
                                ]
                            },
                            1
                        ]
                    },
                    
                    // Inventory value
                    inventoryValue: { 
                        $round: [{ $multiply: ["$price", "$stock"] }, 2] 
                    },
                    
                    // Health status
                    healthStatus: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$stock", 0] }, then: "🔴 Out of Stock" },
                                { case: { $lte: ["$stock", 20] }, then: "🟡 Critical" },
                                { case: { $lte: ["$stock", 50] }, then: "🟠 Low" },
                            ],
                            default: "🟢 Healthy"
                        }
                    },
                    
                    // Stock to sales ratio (placeholder - in real app you'd have sales data)
                    needsRestock: { $lte: ["$stock", 50] }
                }
            },
            
            // Format output
            {
                $project: {
                    name: 1,
                    category: 1,
                    price: 1,
                    cost: 1,
                    marginPercent: 1,
                    stock: 1,
                    inventoryValue: 1,
                    avgRating: 1,
                    reviewCount: 1,
                    healthStatus: 1,
                    needsRestock: 1,
                    _id: 0
                }
            },
            
            // Critical items first
            { $sort: { stock: 1 } }
        ]);

        // Summary
        const criticalItems = inventory.filter(i => i.needsRestock);
        const healthyItems = inventory.filter(i => !i.needsRestock);
        const totalInventoryValue = inventory.reduce((sum, i) => sum + i.inventoryValue, 0);

        console.log(`Inventory Health: ${criticalItems.length} items need restock`);

        res.json({
            success: true,
            message: "Inventory Health Check",
            summary: {
                totalProducts: inventory.length,
                criticalItems: criticalItems.length,
                healthyItems: healthyItems.length,
                totalInventoryValue: totalInventoryValue.toFixed(2),
                alerts: criticalItems.map(i => `${i.name}: ${i.stock} units left - ${i.healthStatus}`)
            },
            data: inventory
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Complete Business Intelligence Report
 * Combines: EVERYTHING - $match, $facet, $group, $lookup, $unwind, $project
 */
exports.businessReport = async (req, res) => {
    try {
        const { year = 2024, month } = req.query;
        
        const report = await Order.aggregate([
            // Optional date filter
            ...(month ? [{
                $match: {
                    $expr: {
                        $and: [
                            { $eq: [{ $year: "$orderDate" }, parseInt(year)] },
                            { $eq: [{ $month: "$orderDate" }, parseInt(month)] }
                        ]
                    }
                }
            }] : [{
                $match: {
                    $expr: { $eq: [{ $year: "$orderDate" }, parseInt(year)] }
                }
            }]),
            
            // Multi-dimensional analysis
            {
                $facet: {
                    // 1. Executive Summary (KPIs)
                    "executiveSummary": [
                        {
                            $group: {
                                _id: null,
                                grossRevenue: {
                                    $sum: {
                                        $cond: [
                                            { $ne: ["$status", "cancelled"] },
                                            "$totalAmount",
                                            0
                                        ]
                                    }
                                },
                                totalOrders: { $sum: 1 },
                                completedOrders: {
                                    $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] }
                                },
                                cancelledOrders: {
                                    $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] }
                                },
                                uniqueCustomers: { $addToSet: "$userId" },
                                avgOrderValue: { $avg: "$totalAmount" }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                grossRevenue: { $round: ["$grossRevenue", 2] },
                                totalOrders: 1,
                                completedOrders: 1,
                                cancelledOrders: 1,
                                cancellationRate: {
                                    $round: [
                                        { $multiply: [{ $divide: ["$cancelledOrders", "$totalOrders"] }, 100] },
                                        1
                                    ]
                                },
                                uniqueCustomers: { $size: "$uniqueCustomers" },
                                avgOrderValue: { $round: ["$avgOrderValue", 2] }
                            }
                        }
                    ],
                    
                    // 2. Geographic Analysis
                    "geographicAnalysis": [
                        {
                            $lookup: {
                                from: "users",
                                localField: "userId",
                                foreignField: "_id",
                                as: "user"
                            }
                        },
                        { $unwind: "$user" },
                        {
                            $group: {
                                _id: {
                                    country: "$user.country",
                                    city: "$user.city"
                                },
                                orderCount: { $sum: 1 },
                                revenue: { $sum: "$totalAmount" },
                                customers: { $addToSet: "$userId" }
                            }
                        },
                        {
                            $group: {
                                _id: "$_id.country",
                                totalRevenue: { $sum: "$revenue" },
                                totalOrders: { $sum: "$orderCount" },
                                cities: {
                                    $push: {
                                        city: "$_id.city",
                                        revenue: { $round: ["$revenue", 2] },
                                        orders: "$orderCount"
                                    }
                                }
                            }
                        },
                        { $sort: { totalRevenue: -1 } }
                    ],
                    
                    // 3. Payment Method Analysis
                    "paymentAnalysis": [
                        {
                            $group: {
                                _id: "$payment.method",
                                count: { $sum: 1 },
                                totalAmount: { $sum: "$totalAmount" }
                            }
                        },
                        {
                            $project: {
                                method: "$_id",
                                count: 1,
                                totalAmount: { $round: ["$totalAmount", 2] },
                                _id: 0
                            }
                        }
                    ],
                    
                    // 4. Customer Segments
                    "customerSegments": [
                        {
                            $lookup: {
                                from: "users",
                                localField: "userId",
                                foreignField: "_id",
                                as: "user"
                            }
                        },
                        { $unwind: "$user" },
                        {
                            $group: {
                                _id: "$user.membership",
                                customerCount: { $addToSet: "$userId" },
                                orderCount: { $sum: 1 },
                                revenue: { $sum: "$totalAmount" }
                            }
                        },
                        {
                            $project: {
                                segment: "$_id",
                                customerCount: { $size: "$customerCount" },
                                orderCount: 1,
                                revenue: { $round: ["$revenue", 2] },
                                _id: 0
                            }
                        }
                    ],
                    
                    // 5. Daily Performance
                    "dailyPerformance": [
                        {
                            $group: {
                                _id: {
                                    $dateToString: { format: "%Y-%m-%d", date: "$orderDate" }
                                },
                                orders: { $sum: 1 },
                                revenue: { $sum: "$totalAmount" }
                            }
                        },
                        { $sort: { "_id": 1 } },
                        {
                            $project: {
                                date: "$_id",
                                orders: 1,
                                revenue: { $round: ["$revenue", 2] },
                                _id: 0
                            }
                        }
                    ]
                }
            }
        ]);

        console.log(`Business Report Generated for ${year}${month ? '/'+month : ''}`);

        res.json({
            success: true,
            message: `Business Intelligence Report ${year}${month ? ' - Month '+month : ''}`,
            report: report[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Performance Check - Explain Query Performance
 */
exports.explainPerformance = async (req, res) => {
    try {
        const explanation = await Order.aggregate([
            { $match: { status: "delivered" } },
            { $group: { _id: "$userId", total: { $sum: "$totalAmount" } } }
        ]).explain("executionStats");

        const metrics = {
            executionTime: explanation.executionStats.executionTimeMillis + 'ms',
            documentsExamined: explanation.executionStats.totalDocsExamined,
            documentsReturned: explanation.executionStats.nReturned,
            indexesUsed: explanation.executionStats.usedIndexes || 'No indexes used',
            stages: explanation.stages.map(stage => ({
                stage: stage.$cursor ? 'FETCH' : Object.keys(stage)[0],
                docsExamined: stage.nReturned || 0
            }))
        };

        console.log('Query Performance:', metrics);

        res.json({
            success: true,
            message: "Query Performance Analysis",
            metrics
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};