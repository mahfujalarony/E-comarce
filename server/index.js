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


app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('public/uploads'));


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', productsRoutes); 
app.use('/api', orderRoutes);    
app.use('/api', cartRoutes);         


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
      throw error;
    }
  }
};


module.exports = async (req, res) => {
  try {
    await connectToDatabase();
    return app(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};



  const PORT = process.env.PORT || 5000;
  const startServer = async () => {
    try {
      await connectToDatabase();
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } catch (error) {
      console.error('Server startup error:', error);
    }
  };
  startServer();
