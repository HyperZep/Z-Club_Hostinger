const Slot = require('../models/slotModel');
const Booking = require('../models/bookingModel');

const bookingController = {
  bookSlot: async (req, res) => {
    try {
      const { slotIds, name, phoneNumber } = req.body;

      // Check if slotIds is an array
      if (!Array.isArray(slotIds)) {
        return res.status(400).json({ error: 'slotIds should be an array' });
      }

      const slots = await Slot.find({ _id: { $in: slotIds } });

      if (slots.length !== slotIds.length) {
        return res.status(404).json({ error: 'One or more slots not found' });
      }

      const bookingPromises = [];

      // Create booking for each slot
      for (const slot of slots) {
        if (!slot.available) {
          return res.status(400).json({ error: 'One or more slots are not available' });
        }

        const booking = new Booking({
          slot: slot._id,
          name,
          phoneNumber,
          bookingDate: slot.date,
        });

        bookingPromises.push(booking.save());

        // Update the slot availability
        slot.available = false;
        bookingPromises.push(slot.save());
      }

      await Promise.all(bookingPromises);

      res.status(201).json({ message: 'Slots booked successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },


  getAllBookings: async (req, res) => {
    try {
      const { date } = req.query;

      let bookings;
      if (date) {
        // Filter bookings by date if date parameter is provided
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1); // Add 1 day to get bookings until the end of the specified date

        bookings = await Booking.find({
          bookingDate: {
            $gte: startDate,
            $lt: endDate
          }
        }).populate('slot');
      } else {
        // Retrieve all bookings if date parameter is not provided
        bookings = await Booking.find().populate('slot');
      }

      res.json(bookings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getBookingsByUser: async (req, res) => {
    try {
      const { userId } = req.params;
  
      const bookings = await Booking.find({ user: userId }).populate('slot');
  
      if (bookings.length === 0) {
        return res.status(404).json({ error: 'No bookings found for the user' });
      }
  
      res.json(bookings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  
  getAllBookedDates: async (req, res) => {
    try {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
  
      const bookings = await Booking.find({ bookingDate: { $gte: currentDate } }).populate('slot');
  
      // Group bookings by date
      const bookingsByDate = bookings.reduce((acc, booking) => {
        const date = formatDate(booking.bookingDate);
        if (!acc[date]) {
          acc[date] = [];
        }
        if (booking.slot && !booking.slot.available) { // Check if the slot object exists and is not null
          // Check if the slot already exists in the booked slots for the current date
          const slotIndex = acc[date].findIndex((b) => b.slot._id.toString() === booking.slot._id.toString());
          if (slotIndex === -1) {
            // If the slot doesn't exist, add the booking
            acc[date].push(booking);
          } else {
            // If the slot exists, replace the booking with the current one
            acc[date][slotIndex] = booking;
          }
        }
        return acc;
      }, {});
  
      // Remove empty dates from the result
      for (const date in bookingsByDate) {
        if (bookingsByDate[date].length === 0) {
          delete bookingsByDate[date];
        }
      }
  
      res.json(bookingsByDate);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  
  getBookingById: async (req, res) => {
    try {
      const { bookingId } = req.params;

      const booking = await Booking.findById(bookingId).populate('slot');

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      res.json(booking);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  deleteBooking: async (req, res) => {
    try {
      const { bookingId } = req.params;

      const booking = await Booking.findById(bookingId).populate('slot');

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      const { slot } = booking;

      // Update the slot availability
      slot.available = true;
      await slot.save();

      // Remove the booking from the database
      await booking.remove();

      res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  cancelBooking: async (req, res) => {
    try {
      const { slotId } = req.params;
  
      const slot = await Slot.findById(slotId);
  
      if (!slot) {
        return res.status(404).json({ error: 'Slot not found' });
      }
  
      if (slot.available) {
        return res.status(400).json({ error: 'Slot is already available' });
      }
  
      // Update the slot availability
      slot.available = true;
      await slot.save();
  
      res.json({ message: 'Slot booking canceled successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}


module.exports = bookingController;