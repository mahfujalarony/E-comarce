const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const createDefaultAdmin = require('./utils/createAdmin'); // অ্যাডমিন তৈরি ফাংশন ইমপোর্ট
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productsRoutes = require('./routes/productsRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// Database Connection + Default Admin Create
connectDB().then(() => {
  createDefaultAdmin(); // অ্যাডমিন চেক ও তৈরি করবে
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', productsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
