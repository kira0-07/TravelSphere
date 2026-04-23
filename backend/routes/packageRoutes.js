const express = require('express');
const router = express.Router();
const {
  getPackages,
  getFeaturedPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  getAdminPackages
} = require('../controllers/packageController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// IMPORTANT: Featured route must come BEFORE :id route
// Otherwise Express will treat "featured" as an ID parameter
router.get('/featured', getFeaturedPackages);

// Public routes
router.get('/', getPackages);
router.get('/:id', getPackageById);

// Admin routes
router.get('/admin/my', protect, admin, getAdminPackages);
router.post('/', protect, admin, createPackage);
router.put('/:id', protect, admin, updatePackage);
router.delete('/:id', protect, admin, deletePackage);

module.exports = router;
