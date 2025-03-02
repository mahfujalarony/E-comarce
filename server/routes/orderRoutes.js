const express = require('express');
const router = express.Router();
const { placeOrder, getOrders } = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

router.post('/placeOrder', authMiddleware, placeOrder);
router.get('/myOrders', authMiddleware, getOrders);

module.exports = router;