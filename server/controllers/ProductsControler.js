const Product = require('../models/ProductModel');
const { Storage, File } = require('megajs');
const fs = require('fs');
const path = require('path');

if (!global.crypto) {
    global.crypto = {};
}
global.crypto.getRandomValues = function(array) {
    return require('crypto').webcrypto.getRandomValues(array);
};

const imageCache = new Map();

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category, brand } = req.body;
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No images uploaded' });
        }

        const storage = new Storage({
            email: process.env.MEGA_EMAIL,
            password: process.env.MEGA_PASSWORD,
        });
        await storage.ready;

        let productsFolder = storage.root.children.find(child => child.name === 'Products' && child.directory);
        if (!productsFolder) {
            productsFolder = await storage.mkdir({ name: 'Products' });
        }

        const imageLinks = [];
        for (const file of files) {
            const fileStream = fs.createReadStream(file.path);
            const uploadOptions = { name: file.filename, allowUploadBuffering: true };
            const uploadedFile = await productsFolder.upload(uploadOptions, fileStream).complete;
            const fileLink = await uploadedFile.link();
            imageLinks.push(fileLink);
            fs.unlinkSync(file.path);
        }

        const product = new Product({ name, description, price, stock, category, brand, images: imageLinks });
        await product.save();
        res.status(201).json({ message: 'Product created successfully!', product });
    } catch (error) {
        console.error('Error in createProduct:', error.message);
        res.status(500).json({ error: 'Failed to create product.' });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10; 
        const search = req.query.search || ''; 

        const query = search
            ? { name: { $regex: search, $options: 'i' } }
            : {};

        
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
        const file = File.fromURL(url);
        await file.loadAttributes();
        const downloadPath = path.join(__dirname, '../downloads', `${Date.now()}-temp.jpg`);
        if (!fs.existsSync(path.join(__dirname, '../downloads'))) {
            fs.mkdirSync(path.join(__dirname, '../downloads'), { recursive: true });
        }
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