const mongoose = require('mongoose');

const itineraryDaySchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  activities: [{
    type: String
  }],
  accommodation: {
    type: String,
    default: ''
  }
}, { _id: false });

const groupSizeSchema = new mongoose.Schema({
  min: {
    type: Number,
    default: 1
  },
  max: {
    type: Number,
    default: 20
  }
}, { _id: false });

const packageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Please provide a unique ID'],
    unique: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
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
  duration: {
    type: Number,
    required: [true, 'Please provide duration in days']
  },
  groupSize: {
    type: groupSizeSchema,
    default: () => ({ min: 1, max: 20 })
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price']
  },
  originalPrice: {
    type: Number,
    default: null
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
  badge: {
    type: String,
    enum: ['Best Seller', 'Trending', 'Luxury', 'Adventure', 'Seasonal', 'Popular', 'Extreme', 'Epic', ''],
    default: ''
  },
  tags: [{
    type: String
  }],
  includes: [{
    type: String
  }],
  excludes: [{
    type: String
  }],
  difficulty: {
    type: String,
    enum: ['Easy', 'Moderate', 'Challenging', 'Hard'],
    default: 'Easy'
  },
  itinerary: {
    type: [itineraryDaySchema],
    default: []
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for search
packageSchema.index({ title: 'text', destination: 'text' });

module.exports = mongoose.model('Package', packageSchema);
