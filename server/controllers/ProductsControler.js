const { Storage, File } = require('megajs');
const Product = require('../models/ProductModel');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

// crypto.getRandomValues ফিক্স
if (!global.crypto || !global.crypto.getRandomValues) {
  global.crypto = {
    getRandomValues: (array) => {
      const bytes = crypto.randomBytes(array.length);
      array.set(bytes);
      return array;
    },
  };
}

const imageCache = new Map();

exports.createProduct = async (req, res) => {
  try {
    console.log('Starting createProduct...');
    const { name, description, price, stock, category, brand } = req.body;
    const files = req.files;
    console.log('Received body:', req.body);
    console.log('Received files:', files);

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
    console.log('productsfolder:', { name: productsFolder?.name, nodeId: productsFolder?.nodeId });

    if (!productsFolder) {
      console.log('Creating Products folder...');
      productsFolder = await storage.mkdir({ name: 'Products' });
      console.log('created productsfolder:', { name: productsFolder.name, nodeId: productsFolder.nodeId });
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
    res.status(500).json({ error: 'Failed to create product.', details: error.message });
  }
};

// বাকি ফাংশনগুলো (getProducts, getProductById, getImageData) একই থাকবে
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
    console.error('Error in getProductById:', error.message);
    res.status(500).json({ error: 'Failed to fetch product.' });
  }
};

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

    const storage = new Storage({
      email: process.env.MEGA_EMAIL,
      password: process.env.MEGA_PASSWORD,
    });
    await storage.ready;
    console.log('Mega.nz connected in getImageData');

    const file = File.fromURL(url);
    await file.loadAttributes();

    const tmpDir = 'C:/tmp'; // Vercel-এ /tmp ব্যবহার করো
    await fs.promises.mkdir(tmpDir, { recursive: true });
    const downloadPath = path.join(tmpDir, `${Date.now()}-temp.jpg`);
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
    console.error('Error in getImageData:', error.message, error.code);
    res.status(500).json({ error: 'Failed to fetch image data', details: error.message });
  }
};

module.exports = exports;