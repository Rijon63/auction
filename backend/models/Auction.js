const mongoose = require('mongoose');

const lotSchema = new mongoose.Schema({
  title: String,
  artist: String,
  category: String,
  price: Number,
  imageUrl: String,
  subjectClassification: String
});

const auctionSchema = new mongoose.Schema({
  name: String,
  date: Date,
  lots: [lotSchema],
  archived: { type: Boolean, default: false }
});

module.exports = mongoose.model('Auction', auctionSchema);
