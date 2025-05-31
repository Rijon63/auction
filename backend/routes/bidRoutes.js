const express = require('express');
const router = express.Router();
const { placeBid, getBidsForLot } = require('../controllers/bidController');
const { protect } = require('../middleware/auth');

router.post('/', protect, placeBid);
router.get('/lot/:lotId', protect, getBidsForLot);

module.exports = router;
