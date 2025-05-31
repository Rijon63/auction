require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');


// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const auctionRoutes = require('./routes/auctionRoutes');
const authRoutes = require('./routes/authRoutes');
const bidRoutes = require('./routes/bidRoutes');

// Use Routes
app.use('/api/auctions', auctionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bids', bidRoutes);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const clientRoutes = require('./routes/clientRoutes');
app.use('/api/clients', clientRoutes);
