const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
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
  country: {
    type: String,
    required: [true, 'Please provide a country'],
    trim: true
  },
  region: {
    type: String,
    enum: ['Europe', 'Asia', 'Americas', 'Africa', 'Oceania'],
    required: [true, 'Please provide a region']
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL']
  },
  heroImage: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  tags: [{
    type: String
  }],
  climate: {
    type: String,
    default: ''
  },
  bestMonths: [{
    type: String
  }],
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
  highlights: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for search
destinationSchema.index({ name: 'text', country: 'text' });

module.exports = mongoose.model('Destination', destinationSchema);
