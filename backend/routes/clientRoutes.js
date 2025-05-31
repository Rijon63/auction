const express = require('express');
const Client = require('../models/Client');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Get all clients (Admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const clients = await Client.find().select('-password');
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single client by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).select('-password');
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update client
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const updated = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete client
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
