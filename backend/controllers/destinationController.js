const Destination = require('../models/Destination');

// @desc    Get all destinations
// @route   GET /api/destinations
// @access  Public
const getDestinations = async (req, res) => {
  try {
    const { region, tag, search, featured } = req.query;
    let query = {};

    // Filter by region
    if (region) {
      query.region = region;
    }

    // Filter by featured
    if (featured === 'true') {
      query.featured = true;
    }

    // Filter by tag
    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Search by name or country
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } }
      ];
    }

    const destinations = await Destination.find(query).sort({ createdAt: -1 });

    res.json(destinations);
  } catch (error) {
    console.error('Get destinations error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// @desc    Get single destination by ID
// @route   GET /api/destinations/:id
// @access  Public
const getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findOne({ id: req.params.id });

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found', success: false });
    }

    res.json(destination);
  } catch (error) {
    console.error('Get destination error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// @desc    Create destination
// @route   POST /api/destinations
// @access  Private/Admin
const createDestination = async (req, res) => {
  try {
    const destination = await Destination.create(req.body);
    res.status(201).json(destination);
  } catch (error) {
    console.error('Create destination error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// @desc    Update destination
// @route   PUT /api/destinations/:id
// @access  Private/Admin
const updateDestination = async (req, res) => {
  try {
    const destination = await Destination.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found', success: false });
    }

    res.json(destination);
  } catch (error) {
    console.error('Update destination error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// @desc    Delete destination
// @route   DELETE /api/destinations/:id
// @access  Private/Admin
const deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findOneAndDelete({ id: req.params.id });

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found', success: false });
    }

    res.json({ message: 'Destination removed', success: true });
  } catch (error) {
    console.error('Delete destination error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

module.exports = {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination
};
