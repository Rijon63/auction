const Auction = require('../models/Auction');

exports.createAuction = async (req, res) => {
  try {
    const auction = await Auction.create(req.body);
    res.status(201).json(auction);
  } catch (err) {
    res.status(500).json({ message: 'Error creating auction', error: err.message });
  }
};

exports.updateAuction = async (req, res) => {
  try {
    const updated = await Auction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating auction', error: err.message });
  }
};

exports.deleteAuction = async (req, res) => {
  try {
    await Auction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Auction deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting auction', error: err.message });
  }
};

exports.getAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find();
    res.json(auctions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching auctions' });
  }
};

exports.getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    res.json(auction);
  } catch (err) {
    res.status(500).json({ message: 'Auction not found' });
  }
};

exports.simpleSearch = async (req, res) => {
  const { keyword } = req.query;
  try {
    const auctions = await Auction.find({
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ]
    });
    res.json(auctions);
  } catch (err) {
    res.status(500).json({ message: 'Error searching auctions' });
  }
};
