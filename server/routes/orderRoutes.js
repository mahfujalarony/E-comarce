const express = require('express');
const router = express.Router();
const { placeOrder } = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

router.post('/placeOrder', authMiddleware, placeOrder);

module.exports = router;