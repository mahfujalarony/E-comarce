const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();


const uploadDir = path.join(__dirname, "../uploads/profile-pic");


if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); 
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Register User
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const photoPath = req.file ? `/uploads/profile-pic/${req.file.filename}` : null;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const user = new User({ name, email, password, photoPath });
        await user.save();

        const token = jwt.sign({ user: user.name, email: user.email, userId: user._id, role: user.role }, process.env.JWT_SECRET);
        
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { name: user.name, email: user.email, photoPath: user.photoPath }
        });
    } catch (error) {
        res.status(400).json({ message: 'Registration failed', error: error.message });
    }
};

// Login User
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ user: user.name, email: user.email, userId: user._id, role: user.role }, process.env.JWT_SECRET);
        res.status(200).json({ message: 'Login Successful', token, user });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

// Verify Token
const verify = async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Token Not Found' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({
            message: 'Valid token',
            user: decoded
        });
    } catch (error) {
        res.status(401).json({ message: 'Expire Token' });
    }
};

module.exports = { register, login, verify, upload };
