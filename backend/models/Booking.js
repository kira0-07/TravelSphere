const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user ID']
  },
  userName: {
    type: String,
    required: [true, 'Please provide a user name']
  },
  userEmail: {
    type: String,
    required: [true, 'Please provide a user email']
  },
  packageId: {
    type: String,
    required: [true, 'Please provide a package ID']
  },
  packageTitle: {
    type: String,
    required: [true, 'Please provide a package title']
  },
  destination: {
    type: String,
    required: [true, 'Please provide a destination']
  },
  image: {
    type: String,
    default: ''
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide an end date']
  },
  travelers: {
    type: Number,
    required: [true, 'Please provide number of travelers'],
    min: [1, 'At least 1 traveler required']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Please provide total amount']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  bookingRef: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Generate booking ID and reference before saving
bookingSchema.pre('save', async function(next) {
  if (!this.id) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Booking').countDocuments();
    this.id = `BK-${year}-${String(count + 1).padStart(3, '0')}`;
  }

  if (!this.bookingRef) {
    const destinationCode = this.destination
      .split(',')[0]
      .trim()
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'XX';
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingRef = `TS-${destinationCode}-${String(count + 1).padStart(3, '0')}`;
  }

  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
