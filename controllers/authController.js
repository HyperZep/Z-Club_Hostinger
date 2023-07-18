// controllers/authController.js
const bcrypt = require('bcrypt');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Save the OTP and its expiration time to the user document
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 600000; // OTP expires after 10 minutes
    await user.save();

    // Create a transporter for sending emails
    const transporter = nodemailer.createTransport({
      service: 'gmail', // e.g., 'gmail'
      auth: {
        user: 'zclubboxcricket@gmail.com',
        pass: 'elfgewwxbvltbcma',
      },
    });

    // Define the email message
    const mailOptions = {
      from: 'elfgewwxbvltbcma',
      to: email,
      subject: 'Password Reset OTP',
      text: `Your password reset OTP is ${otp}.`,
    };

    // Send the email with the OTP
    await transporter.sendMail(mailOptions);

    res.json({ message: 'OTP sent to your email address' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
