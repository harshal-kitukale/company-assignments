const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
require("dotenv").config();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role, // 'user' or 'vendor'
    });
    // Save the user to the database
    await user.save();
    res.status(201).json({ user});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Verify the password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Create and send a JWT token for authentication
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY);

    // Redirect the user based on their role
    if (user.role === 'user') {
      res.status(200).json({ message: 'User logged in', token });
    } else if (user.role === 'vendor') {
      res.status(200).json({ message: 'Vendor logged in', token });
    } else {
      res.status(400).json({ message: 'Invalid role' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

