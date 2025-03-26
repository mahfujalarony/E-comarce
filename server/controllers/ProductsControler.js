const { Storage, File } = require('megajs');
const Product = require('../models/ProductModel');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { ObjectId } = require('mongodb');
require('dotenv').config();

// Crypto ফলব্যাক
if (!global.crypto || !global.crypto.getRandomValues) {
  global.crypto = {
    getRandomValues: (array) => crypto.randomFillSync(array),
  };
}

const imageCache = new Map();

// প্রোডাক্ট তৈরি
exports.createProduct = async (req, res) => {
  try {
    console.log('Starting createProduct...');
    const { name, description, price, stock, category, brand } = req.body;
    const files = req.files || [];
    console.log('Received body:', req.body);
    console.log('Received files:', files);

    if (!files.length) {
      console.log('No images uploaded');
      return res.status(400).json({ error: 'No images uploaded' });
    }

    const storage = new Storage({
      email: process.env.MEGA_EMAIL || 'mahfujalamrony07@gmail.com',
      password: process.env.MEGA_PASSWORD || "MS4i=s+@U'5W%a}",
    });
    await storage.ready;
    console.log('Mega.nz connected');

    let productsFolder = storage.root.children?.find(
      (child) => child.name === 'Products' && child.directory
    );
    if (!productsFolder) {
      console.log('Creating Products folder...');
      productsFolder = await storage.mkdir({ name: 'Products' });
      console.log('Created productsFolder:', productsFolder);
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

    console.log('Saving product to MongoDB...');
    await product.save();
    console.log('Product saved');

    res.status(201).json({ message: 'Product created successfully!', product });
  } catch (error) {
    console.error('Error in createProduct:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to create product', details: error.message });
  }
};

// সব প্রোডাক্ট পাওয়া
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
    console.error('Error in getProducts:', error.message);
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
};

// আইডি দিয়ে প্রোডাক্ট পাওয়া
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let productId;
    try {
      productId = new ObjectId(id);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error in getProductById:', error.message);
    res.status(500).json({ error: 'Failed to fetch product', details: error.message });
  }
};

// প্রোডাক্ট ডিলিট (Mega.nz থেকে ইমেজ ডিলিট সহ)
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
      console.log('Invalid ID format:', error.message);
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      console.log('Product not found in DB');
      return res.status(404).json({ message: 'Product not found' });
    }

    // Mega.nz থেকে ইমেজ ডিলিট (ঐচ্ছিক)
    if (product.images && product.images.length > 0) {
      const storage = new Storage({
        email: process.env.MEGA_EMAIL || 'mahfujalamrony07@gmail.com',
        password: process.env.MEGA_PASSWORD || "MS4i=s+@U'5W%a}",
      });
      await storage.ready;
      console.log('Mega.nz connected for deletion');

      for (const url of product.images) {
        try {
          const file = File.fromURL(url);
          await file.loadAttributes();
          await file.delete();
          console.log(`Deleted file from Mega.nz: ${url}`);
        } catch (error) {
          console.error(`Failed to delete file ${url} from Mega.nz:`, error.message);
        }
      }
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);
    console.log('Deleted product from DB:', deletedProduct);

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error in deleteProduct:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to delete product', details: error.message });
  }
};

// ইমেজ ডাটা পাওয়া
exports.getImageData = async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    console.log('Received URL:', url);

    if (imageCache.has(url)) {
      return res.json({ success: true, imageData: imageCache.get(url) });
    }

    if (!url.startsWith('https://mega.nz/')) {
      return res.status(400).json({ error: 'Invalid Mega.nz URL' });
    }

    const file = File.fromURL(url);
    await file.loadAttributes();

    const tmpDir = path.join(__dirname, '..', 'tmp');
    await fs.promises.mkdir(tmpDir, { recursive: true });
    const downloadPath = path.join(tmpDir, `${Date.now()}-temp.jpg`);
    const downloadStream = fs.createWriteStream(downloadPath);

    await new Promise((resolve, reject) => {
      file.download().pipe(downloadStream).on('finish', resolve).on('error', reject);
    });

    const fileBuffer = await fs.promises.readFile(downloadPath);
    const base64Image = fileBuffer.toString('base64');
    const mimeType = 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    await fs.promises.unlink(downloadPath);
    imageCache.set(url, dataUrl);

    res.json({ success: true, imageData: dataUrl });
  } catch (error) {
    console.error('Error in getImageData:', error.message);
    res.status(500).json({ error: 'Failed to fetch image data', details: error.message });
  }
};

module.exports = exports;