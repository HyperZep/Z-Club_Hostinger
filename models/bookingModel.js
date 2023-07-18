// bookingModel.js

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slot',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  bookingDate: {
    type: Date,
    required: true,
    index: true // Add index on bookingDate field
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
