const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  lotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lot', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  amount: { type: Number, required: true },
  placedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bid', bidSchema);
