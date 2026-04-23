const express = require('express');
const router = express.Router();
const {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel
} = require('../controllers/hotelController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// Public routes
router.get('/', getHotels);
router.get('/:id', getHotelById);

// Admin routes
router.post('/', protect, admin, createHotel);
router.put('/:id', protect, admin, updateHotel);
router.delete('/:id', protect, admin, deleteHotel);

module.exports = router;
