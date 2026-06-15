const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// ============================================
// LEVEL 1: BASIC OPERATIONS
// ============================================

// $match - Filtering
router.get('/basic/match', analyticsController.basicMatch);
// WHY: Always filter first to reduce data

// $project - Transforming
router.get('/basic/project', analyticsController.basicProject);
// WHY: Select needed fields to reduce payload

// $group - Aggregating
router.get('/basic/group', analyticsController.basicGroup);
// WHY: Database-level calculations are faster

// ============================================
// LEVEL 2: INTERMEDIATE OPERATIONS
// ============================================

// $unwind - Array deconstruction
router.get('/intermediate/unwind', analyticsController.intermediateUnwind);
// WHY: Need to analyze array items individually

// $lookup - Joining collections
router.get('/intermediate/lookup', analyticsController.intermediateLookup);
// WHY: Combine data without multiple queries

// ============================================
// LEVEL 3: ADVANCED OPERATIONS
// ============================================

// $facet - Multi-analysis dashboard
router.get('/advanced/facet', analyticsController.advancedFacet);
// WHY: One query instead of multiple

// $bucket - Data segmentation
router.get('/advanced/bucket', analyticsController.advancedBucket);
// WHY: Range-based analysis

// ============================================
// LEVEL 4: REAL-WORLD ANALYTICS
// ============================================

// Customer Lifetime Value
router.get('/analytics/customer-lifetime-value', analyticsController.customerLifetimeValue);
// WHY: Understand customer behavior and segment them

// Product Performance
router.get('/analytics/product-performance', analyticsController.productPerformance);
// WHY: Know which products drive revenue

// Inventory Health
router.get('/analytics/inventory-health', analyticsController.inventoryHealth);
// WHY: Prevent stockouts and manage inventory

// Business Report
router.get('/analytics/business-report', analyticsController.businessReport);
// WHY: Complete business intelligence in one API call
// Query params: ?year=2024&month=2 (optional)

// Performance Check
router.get('/analytics/explain', analyticsController.explainPerformance);
// WHY: Optimize queries by understanding execution

module.exports = router;