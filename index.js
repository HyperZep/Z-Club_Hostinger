const express = require('express');
const mongoose = require('mongoose');
const morgan = require("morgan");
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const slotRoutes = require('./routes/slotRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
app.use(morgan("dev"));

// Middleware
app.use(express.json());

// Connect to MongoDB  1
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DataBase connection successful"))
  .catch((err) => console.log(err));

// Routes
app.use('/auth', authRoutes);
app.use('/api', slotRoutes);
app.use('/api', bookingRoutes);

// Start the server
app.listen(process.env.PORT, () => {
  console.log('Server is running');
});
