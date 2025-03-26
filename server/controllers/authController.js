const User = require('../models/userModel');
const { Storage, File } = require('megajs');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

if (!global.crypto || !global.crypto.getRandomValues) {
  global.crypto = {
    getRandomValues: (array) => crypto.randomFillSync(array),
  };
}



const imageCache = new Map();

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No profile picture uploaded' });
    }

    const storage = new Storage({
      email: process.env.MEGA_EMAIL,
      password: process.env.MEGA_PASSWORD,
    });
    await storage.ready;

    let profilePicsFolder = storage.root.children.find(
      (child) => child.name === 'ProfilePics' && child.directory
    );
    if (!profilePicsFolder) {
      profilePicsFolder = await storage.mkdir({ name: 'ProfilePics' });
    }

    const uploadOptions = {
      name: `${Date.now()}-${file.originalname}`,
      allowUploadBuffering: true,
    };
    const uploadedFile = await profilePicsFolder.upload(uploadOptions, file.buffer).complete;
    const photoUrl = await uploadedFile.link();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = new User({ name, email, password, photoPath: photoUrl });
    await user.save();

    const token = jwt.sign(
      { user: user.name, email: user.email, _id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { name: user.name, email: user.email, userId: user._id, photoPath: user.photoPath },
    });
  } catch (error) {
    console.error('Error in register:', error.message);
    res.status(500).json({ error: 'Failed to register user.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { user: user.name, email: user.email, _id: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    res.status(200).json({ message: 'Login Successful', token, user });
  } catch (error) {
    console.error('Error in login:', error.message);
    res.status(500).json({ error: 'Failed to login.' });
  }
};

exports.verify = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Token Not Found' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({
      message: 'Valid token',
      user: decoded,
    });
  } catch (error) {
    console.error('Error in verify:', error.message);
    res.status(401).json({ message: 'Expired Token' });
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
      console.log('Serving from cache:', url);
      return res.json({ success: true, imageData: imageCache.get(url) });
    }

    if (!url.startsWith('https://mega.nz/')) {
      console.log('Invalid Mega.nz URL:', url);
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
    console.error('Error in getImageData:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = exports;