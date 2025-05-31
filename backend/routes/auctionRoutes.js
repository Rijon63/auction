const express = require('express');
const router = express.Router();
const Auction = require('../models/Auction');
const Lot = require('../models/Lot');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// 🔒 Admin: Create Auction
router.post('/', protect, adminOnly, async (req, res) => {
  const { title, date } = req.body;
  try {
    const auction = await Auction.create({ title, date });
    res.status(201).json(auction);
  } catch (err) {
    res.status(500).json({ message: 'Create auction error' });
  }
});

// 🔒 Admin: Add Lot
router.post('/lot', protect, adminOnly, async (req, res) => {
  const lotData = req.body;
  try {
    const lot = await Lot.create(lotData);
    res.status(201).json(lot);
  } catch (err) {
    res.status(500).json({ message: 'Create lot error' });
  }
});

// 🔒 Admin: Update Lot
router.put('/lot/:id', protect, adminOnly, async (req, res) => {
  try {
    const lot = await Lot.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(lot);
  } catch (err) {
    res.status(500).json({ message: 'Update error' });
  }
});

// 🔒 Admin: Delete Lot
router.delete('/lot/:id', protect, adminOnly, async (req, res) => {
  try {
    await Lot.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lot deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete error' });
  }
});

// 🌐 Public: View Lots
router.get('/lots', async (req, res) => {
  const lots = await Lot.find();
  res.json(lots);
});

// 🌐 Public: Search Lots
router.get('/search', async (req, res) => {
  const { artist, subject, category } = req.query;
  const query = {};

  if (artist) query.artist = { $regex: artist, $options: 'i' };
  if (subject) query.subject = { $regex: subject, $options: 'i' };
  if (category) query.category = category;

  const results = await Lot.find(query);
  res.json(results);
});

module.exports = router;
