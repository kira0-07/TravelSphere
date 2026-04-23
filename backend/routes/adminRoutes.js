const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getRecentBookings,
  getRevenueSummary,
  updateBookingStatus,
  getSystemStatus
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// All routes are protected and require admin access
router.get('/stats', protect, admin, getDashboardStats);
router.get('/status', protect, admin, getSystemStatus);
router.get('/bookings/recent', protect, admin, getRecentBookings);
router.get('/revenue', protect, admin, getRevenueSummary);
router.put('/bookings/:id/status', protect, admin, updateBookingStatus);

module.exports = router;
