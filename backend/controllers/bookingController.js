const Booking = require('../models/Booking');
const Package = require('../models/Package');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const {
      packageId,
      packageTitle,
      destination,
      image,
      startDate,
      endDate,
      travelers,
      totalAmount
    } = req.body;

    // Verify package exists
    const pkg = await Package.findOne({ id: packageId });
    if (!pkg) {
      return res.status(404).json({ message: 'Package not found', success: false });
    }

    // Create booking
    const booking = await Booking.create({
      userId: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      packageId,
      packageTitle,
      destination,
      image,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      travelers,
      totalAmount
    });

    // Return populated booking
    const populatedBooking = await Booking.findById(booking._id)
      .populate('userId', 'name email');

    res.status(201).json(populatedBooking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      $or: [
        { _id: req.params.id },
        { id: req.params.id }
      ],
      userId: req.user._id
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found', success: false });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// @desc    Cancel booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      {
        $or: [
          { _id: req.params.id },
          { id: req.params.id }
        ],
        userId: req.user._id
      },
      { status: 'cancelled' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found', success: false });
    }

    res.json(booking);
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings/admin/all
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// @desc    Update booking status (admin)
// @route   PATCH /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status', success: false });
    }

    const booking = await Booking.findOneAndUpdate(
      {
        $or: [
          { _id: req.params.id },
          { id: req.params.id }
        ]
      },
      { status },
      { new: true }
    ).populate('userId', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found', success: false });
    }

    res.json(booking);
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus
};
