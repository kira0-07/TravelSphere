const Package = require('../models/Package');

// @desc    Get all packages
// @route   GET /api/packages
// @access  Public
const getPackages = async (req, res) => {
  try {
    const { destinationId, search, badge, maxPrice, difficulty, tag } = req.query;
    let query = {};

    // Filter by destination
    if (destinationId) {
      query.destinationId = destinationId;
    }

    // Filter by badge
    if (badge) {
      query.badge = badge;
    }

    // Filter by max price
    if (maxPrice) {
      query.price = { $lte: parseFloat(maxPrice) };
    }

    // Filter by difficulty
    if (difficulty) {
      query.difficulty = difficulty;
    }

    // Filter by tag
    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Search by title or destination
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } }
      ];
    }

    const packages = await Package.find(query).sort({ createdAt: -1 });

    res.json(packages);
  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// @desc    Get featured packages
// @route   GET /api/packages/featured
// @access  Public
const getFeaturedPackages = async (req, res) => {
  try {
    const packages = await Package.find({ featured: true }).sort({ rating: -1 });
    res.json(packages);
  } catch (error) {
    console.error('Get featured packages error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// @desc    Get single package by ID
// @route   GET /api/packages/:id
// @access  Public
const getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findOne({ id: req.params.id });

    if (!pkg) {
      return res.status(404).json({ message: 'Package not found', success: false });
    }

    res.json(pkg);
  } catch (error) {
    console.error('Get package error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// @desc    Create package
// @route   POST /api/packages
// @access  Private/Admin
const createPackage = async (req, res) => {
  try {
    const packageData = { ...req.body, createdBy: req.user._id };
    const pkg = await Package.create(packageData);
    res.status(201).json(pkg);
  } catch (error) {
    console.error('Create package error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// @desc    Update package
// @route   PUT /api/packages/:id
// @access  Private/Admin
const updatePackage = async (req, res) => {
  try {
    let pkg = await Package.findOne({ id: req.params.id });

    if (!pkg) {
      return res.status(404).json({ message: 'Package not found', success: false });
    }

    // Check ownership
    if (pkg.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this package', success: false });
    }

    pkg = await Package.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    res.json(pkg);
  } catch (error) {
    console.error('Update package error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// @desc    Delete package
// @route   DELETE /api/packages/:id
// @access  Private/Admin
const deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findOne({ id: req.params.id });

    if (!pkg) {
      return res.status(404).json({ message: 'Package not found', success: false });
    }

    // Check ownership
    if (pkg.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this package', success: false });
    }

    await Package.findOneAndDelete({ id: req.params.id });

    res.json({ message: 'Package removed', success: true });
  } catch (error) {
    console.error('Delete package error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// @desc    Get packages created by current admin
// @route   GET /api/packages/admin/my
// @access  Private/Admin
const getAdminPackages = async (req, res) => {
  try {
    const packages = await Package.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(packages);
  } catch (error) {
    console.error('Get admin packages error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

module.exports = {
  getPackages,
  getFeaturedPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  getAdminPackages
};
