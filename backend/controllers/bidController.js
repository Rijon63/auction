const Bid = require('../models/Bid');

// @desc    Place a bid
// @route   POST /api/bids
// @access  Private
const placeBid = async (req, res) => {
  try {
    const { lotId, amount } = req.body;
    const bid = await Bid.create({ lotId, clientId: req.user._id, amount });
    res.status(201).json(bid);
  } catch (err) {
    res.status(500).json({ message: 'Server error placing bid' });
  }
};

// @desc    Get bids for a specific lot
// @route   GET /api/bids/lot/:lotId
// @access  Private
const getBidsForLot = async (req, res) => {
  try {
    const bids = await Bid.find({ lotId: req.params.lotId })
      .sort({ amount: -1 })
      .populate('clientId', 'name');
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching bids' });
  }
};

module.exports = {
  placeBid,
  getBidsForLot,
};
