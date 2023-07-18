const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  available: {
    type: Boolean,
    required: true,
    default: true
  }
});

const Slot = mongoose.model('Slot', slotSchema);

module.exports = Slot;
