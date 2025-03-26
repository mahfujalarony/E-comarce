const express = require('express');
const productController = require('../controllers/ProductsControler');
const upload = require('../utils/upload');

const router = express.Router();

router.post('/products', upload.array('images', 20), productController.createProduct);
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);
router.get('/image-data', productController.getImageData);
router.delete('products/:id', productController.deleteProduct);

module.exports = router;