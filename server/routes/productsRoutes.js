const express = require("express");
const productController = require("../controllers/ProductsControler");
const upload = require("../utils/upload");

const router = express.Router();


router.post("/products", upload.array("images", 5), productController.createProduct);
router.get('/products', productController.getProducts)
router.get("/products/:id", productController.getProductById)

module.exports = router;