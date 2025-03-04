const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartContriller');

router.post('/cart/add', cartController.addToCart);
router.get('/cart/:userId', cartController.getCart);
router.post('/cart/remove', cartController.removeFromCart);

module.exports = router;