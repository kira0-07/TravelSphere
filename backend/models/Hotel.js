const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Please provide a unique ID'],
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  destinationId: {
    type: String,
    required: [true, 'Please provide a destination ID']
  },
  destination: {
    type: String,
    required: [true, 'Please provide a destination display string']
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL']
  },
  stars: {
    type: Number,
    min: 1,
    max: 5
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  pricePerNight: {
    type: Number,
    required: [true, 'Please provide a price per night']
  },
  amenities: [{
    type: String
  }],
  type: {
    type: String,
    default: ''
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for search
hotelSchema.index({ name: 'text', destination: 'text' });

module.exports = mongoose.model('Hotel', hotelSchema);
