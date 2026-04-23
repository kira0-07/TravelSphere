const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const Package = require('./models/Package');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/travelsphere')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Test Booking pre-save logic
    try {
      const b = new Booking({
        userId: new mongoose.Types.ObjectId(),
        packageId: 'pkg-test',
        packageTitle: 'Test',
        destination: 'Test, Test',
        startDate: new Date(),
        endDate: new Date(),
        travelers: 1,
        totalAmount: 100
      });
      await b.save();
      console.log('Saved booking:', b);
    } catch (e) {
      console.error('Error saving:', e);
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
