const express = require('express');
const router = express.Router();
const { placeOrder, getOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');
const { isAdmin} = require('../middleware/authMiddleware')

router.post('/placeOrder', authMiddleware, placeOrder);
router.get('/myOrders', authMiddleware, getOrders);
router.get('/admin/orders', isAdmin , getAllOrders);
router.put('/admin/orders/:id', isAdmin, updateOrderStatus);

module.exports = router;