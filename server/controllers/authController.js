const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const multer = require('multer');

// Multer Setup for File Upload
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Register User
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = new User({ name, email, password, photoPath });
    await user.save();

    const token = jwt.sign({ user: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET);
    
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

    const token = jwt.sign({ user: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET);
    res.status(200).json({ message: 'Login Successful', token, user });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

module.exports = { register, login, upload };
