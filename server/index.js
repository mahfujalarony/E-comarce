const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const createDefaultAdmin = require('./utils/createAdmin'); 
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productsRoutes = require('./routes/productsRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("public/uploads"));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', productsRoutes);
app.use('/api', orderRoutes);
app.use('/api', cartRoutes);

// MongoDB কানেকশন
let isConnected = false;
const connectToDatabase = async () => {
  if (!isConnected) {
    try {
      await connectDB();
      await createDefaultAdmin();
      isConnected = true;
      console.log('MongoDB connected');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error; // এরর থাকলে ফাংশন বন্ধ হবে
    }
  }
};

// Vercel-এর জন্য এক্সপোর্ট
module.exports = async (req, res) => {
  try {
    await connectToDatabase();
    return app(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};