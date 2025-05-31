const mongoose = require('mongoose');

const baseFields = {
  lotNumber: { type: String, unique: true, required: true },
  artist: String,
  year: Number,
  subject: String,
  description: String,
  auctionDate: Date,
  estimatedPrice: Number,
  category: {
    type: String,
    enum: ['painting', 'drawing', 'photo', 'sculpture', 'carving'],
    required: true
  }
};

const categorySpecificFields = {
  painting: {
    medium: String,
    framed: Boolean,
    dimensions: { height: Number, length: Number }
  },
  drawing: {
    medium: String,
    framed: Boolean,
    dimensions: { height: Number, length: Number }
  },
  photo: {
    imageType: String,
    dimensions: { height: Number, length: Number }
  },
  sculpture: {
    material: String,
    dimensions: { height: Number, length: Number, width: Number },
    weight: Number
  },
  carving: {
    material: String,
    dimensions: { height: Number, length: Number, width: Number },
    weight: Number
  }
};

const lotSchema = new mongoose.Schema({
  ...baseFields,
  details: mongoose.Schema.Types.Mixed // Will contain category-specific details
});

module.exports = mongoose.model('Lot', lotSchema);
