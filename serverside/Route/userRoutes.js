const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../DB-Models/auth');

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        console.log('User not found');
        return res.status(400).json({ message: 'User not found' });
      }
      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordValid) {
        console.log('Invalid password');
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('Login successful');
      res.status(200).json({ token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  });
  

module.exports = router;
