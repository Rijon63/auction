const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Client = require('../models/Client');

// 🔐 LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const client = await Client.findOne({ email });

    if (!client) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await client.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: client._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: client._id,
        name: client.name,
        email: client.email,
        role: client.role, // Important for frontend to handle admin/seller/buyer UI
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 📝 REGISTER
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existing = await Client.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Prevent registration as admin unless you explicitly allow it (e.g., during dev seeding)
    const allowedRole = role === 'admin' ? 'buyer' : role;

    const newClient = await Client.create({
      name,
      email,
      password, // hashed in schema
      role: allowedRole,
    });

    const token = jwt.sign({ id: newClient._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
      token,
      user: {
        id: newClient._id,
        name: newClient.name,
        email: newClient.email,
        role: newClient.role,
      },
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔍 Health check route
router.get('/test', (req, res) => {
  res.send('Auth route working ✅');
});

module.exports = router;
