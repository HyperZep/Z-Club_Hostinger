// bookingRoutes.js

const express = require('express');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.post('/bookings', bookingController.bookSlot);
router.get('/bookings', bookingController.getAllBookings);
router.get('/bookings/dates', bookingController.getAllBookedDates);
router.get('/bookings/:bookingId', bookingController.getBookingById);
router.put('/bookings/slots/:slotId/cancel', bookingController.cancelBooking);
router.get('/bookings/user/:userId', bookingController.getBookingsByUser);


module.exports = router;
