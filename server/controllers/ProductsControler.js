const { Storage, File } = require('megajs');
const Product = require('../models/ProductModel');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const mega = require('megajs');
const crypto = require('crypto');
const { ObjectId } = require('mongodb');
require('dotenv').config();

if (!global.crypto || !global.crypto.getRandomValues) {
  global.crypto = {
    getRandomValues: (array) => crypto.randomFillSync(array),
  };
}


const imageCache = new Map();

exports.createProduct = async (req, res) => {
  try {
    console.log('Starting createProduct...');
    const { name, description, price, stock, category, brand } = req.body;
    const files = req.files;


    if (!files || files.length === 0) {
      console.log('No images uploaded');
      return res.status(400).json({ error: 'No images uploaded' });
    }

    console.log('Connecting to Mega.nz...');
    const storage = new Storage({
      email: process.env.MEGA_EMAIL,
      password: process.env.MEGA_PASSWORD,
    });

    await storage.ready;
    console.log('Mega.nz connected');


    let productsFolder = storage.root.children.find(
      (child) => child.name === 'Products' && child.directory
    );


    if (!productsFolder) {
      productsFolder = await storage.mkdir({ name: 'Products' });
    }

    const imageLinks = [];
    for (const file of files) {
      console.log('Uploading file:', file.originalname);
      const uploadOptions = {
        name: `${Date.now()}-${file.originalname}`,
        allowUploadBuffering: true,
      };
      const uploadedFile = await productsFolder.upload(uploadOptions, file.buffer).complete;
      const fileLink = await uploadedFile.link();
      imageLinks.push(fileLink);
      console.log('File uploaded:', fileLink);
    }

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      brand,
      images: imageLinks,
    });

    await product.save();


    res.status(201).json({ message: 'Product created successfully!', product });
  } catch (error) {

    res.status(500).json({ error: 'Failed to create product.', details: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const query = search ? { name: { $regex: search, $options: 'i' } } : {};

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      products,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
  
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found!' });
    }
    res.status(200).json(product);
  } catch (error) {
 
    res.status(500).json({ error: 'Failed to fetch product.' });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
 
    console.log('Received ID for deletion:', id);

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    const userRole = decoded.role;

    if (userRole !== 'admin') {
      console.log('User is not admin');
      return res.status(403).json({ message: 'Only admins can delete products' });
    }

    let productId;
    try {
      productId = new ObjectId(id);
      console.log('Converted to ObjectId:', productId);
    } catch (error) {

      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);
    console.log('Deleted product:', deletedProduct);
    if (!deletedProduct) {
  
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
  
    res.status(500).json({ error: 'Failed to delete product', details: error.message });
  }
};


exports.getImageData = async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
   

    if (imageCache.has(url)) {
      return res.json({ success: true, imageData: imageCache.get(url) });
    }

    if (!url.startsWith('https://mega.nz/')) {
      return res.status(400).json({ error: 'Invalid Mega.nz URL' });
    }

    const file = File.fromURL(url);
    await file.loadAttributes();

    const downloadPath = path.join('/tmp', `${Date.now()}-temp.jpg`);
    const downloadStream = fs.createWriteStream(downloadPath);

    await new Promise((resolve, reject) => {
      file.download().pipe(downloadStream).on('finish', resolve).on('error', reject);
    });

    const fileBuffer = fs.readFileSync(downloadPath);
    const base64Image = fileBuffer.toString('base64');
    const mimeType = 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    fs.unlinkSync(downloadPath); 
    imageCache.set(url, dataUrl);

    res.json({ success: true, imageData: dataUrl });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = exports;