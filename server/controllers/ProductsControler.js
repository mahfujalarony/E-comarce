const Product = require("../models/ProductModel");
const upload = require("../utils/upload");


exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category, brand } = req.body;
        const images = req.files.map(file => file.filename); 

        const product = new Product({
            name,
            description,
            price,
            stock,
            category,
            brand,
            images,
        });

        await product.save();
        res.status(201).json({ message: "Product created successfully!", product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find(); // MongoDB থেকে সব প্রোডাক্ট ফেচ করুন
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

