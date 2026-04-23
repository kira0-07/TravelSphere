const User = require('../models/User');
const Booking = require('../models/Booking');
const Destination = require('../models/Destination');
const Package = require('../models/Package');
const Hotel = require('../models/Hotel');
const mongoose = require('mongoose');

// @desc    Get system status
// @route   GET /api/admin/status
// @access  Private/Admin
const getSystemStatus = async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStatusMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };
    
    res.json({
      website: 'online',
      database: dbStatusMap[dbState] || 'unknown',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('System status error:', error);
    res.status(500).json({ website: 'online', database: 'error', success: false });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalBookings,
      totalDestinations,
      totalPackages,
      totalHotels
    ] = await Promise.all([
      User.countDocuments(),
      Booking.countDocuments(),
      Destination.countDocuments(),
      Package.countDocuments(),
      Hotel.countDocuments()
    ]);

    // Calculate total revenue from confirmed/completed bookings
    const revenueResult = await Booking.aggregate([
      {
        $match: {
          status: { $in: ['confirmed', 'completed'] }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.json({
      totalUsers,
      totalBookings,
      totalRevenue,
      totalDestinations,
      totalPackages,
      totalHotels
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// @desc    Get recent bookings
// @route   GET /api/admin/bookings/recent
// @access  Private/Admin
const getRecentBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(bookings);
  } catch (error) {
    console.error('Get recent bookings error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// @desc    Get revenue summary
// @route   GET /api/admin/revenue
// @access  Private/Admin
const getRevenueSummary = async (req, res) => {
  try {
    // Get revenue by month for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          status: { $in: ['confirmed', 'completed'] },
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          bookings: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1 }
      },
      {
        $limit: 6
      }
    ]);

    // Get revenue by destination
    const destinationRevenue = await Booking.aggregate([
      {
        $match: {
          status: { $in: ['confirmed', 'completed'] }
        }
      },
      {
        $group: {
          _id: '$destination',
          revenue: { $sum: '$totalAmount' },
          bookings: { $sum: 1 }
        }
      },
      {
        $sort: { revenue: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Get total revenue
    const totalResult = await Booking.aggregate([
      {
        $match: {
          status: { $in: ['confirmed', 'completed'] }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalBookings: { $sum: 1 }
        }
      }
    ]);

    res.json({
      monthly: monthlyRevenue.map(item => ({
        month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
        revenue: item.revenue,
        bookings: item.bookings
      })),
      byDestination: destinationRevenue.map(item => ({
        destination: item._id,
        revenue: item.revenue,
        bookings: item.bookings
      })),
      summary: {
        totalRevenue: totalResult[0]?.totalRevenue || 0,
        totalBookings: totalResult[0]?.totalBookings || 0
      }
    });
  } catch (error) {
    console.error('Get revenue summary error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// @desc    Update booking status
// @route   PUT /api/admin/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status', success: false });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found', success: false });
    }

    booking.status = status;
    await booking.save();

    res.json({ message: 'Booking status updated successfully', success: true, booking });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

module.exports = {
  getDashboardStats,
  getRecentBookings,
  getRevenueSummary,
  updateBookingStatus,
  getSystemStatus
};
