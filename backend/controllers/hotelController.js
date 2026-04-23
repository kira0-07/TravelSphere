const Hotel = require('../models/Hotel');

// @desc    Get all hotels
// @route   GET /api/hotels
// @access  Public
const getHotels = async (req, res) => {
  try {
    const { destination, search, type, minStars } = req.query;
    let query = {};

    // Filter by destination
    if (destination) {
      query.destinationId = destination;
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    // Filter by minimum stars
    if (minStars) {
      query.stars = { $gte: parseInt(minStars) };
    }

    // Search by name or destination
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } }
      ];
    }

    const hotels = await Hotel.find(query).sort({ rating: -1 });

    res.json(hotels);
  } catch (error) {
    console.error('Get hotels error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// @desc    Get single hotel by ID
// @route   GET /api/hotels/:id
// @access  Public
const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ id: req.params.id });

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found', success: false });
    }

    res.json(hotel);
  } catch (error) {
    console.error('Get hotel error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// @desc    Create hotel
// @route   POST /api/hotels
// @access  Private/Admin
const createHotel = async (req, res) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json(hotel);
  } catch (error) {
    console.error('Create hotel error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Private/Admin
const updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found', success: false });
    }

    res.json(hotel);
  } catch (error) {
    console.error('Update hotel error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Private/Admin
const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findOneAndDelete({ id: req.params.id });

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found', success: false });
    }

    res.json({ message: 'Hotel removed', success: true });
  } catch (error) {
    console.error('Delete hotel error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

module.exports = {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel
};
