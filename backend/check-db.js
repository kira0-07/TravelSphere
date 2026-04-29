require('dotenv').config();
const mongoose = require('mongoose');
const Destination = require('./models/Destination');

async function checkDestinations() {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/travelsphere';
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    const count = await Destination.countDocuments();
    console.log('Destination count:', count);
    
    if (count > 0) {
      const all = await Destination.find().limit(5);
      console.log('First 5 destinations:', all.map(d => d.name));
    } else {
      console.log('No destinations found in database.');
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkDestinations();
