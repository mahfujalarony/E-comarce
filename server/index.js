const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const createDefaultAdmin = require('./utils/createAdmin'); 
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productsRoutes = require('./routes/productsRoutes');
const orderRoutes = require('./routes/orderRoutes')

dotenv.config();
const app = express();


app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));


connectDB().then(() => {
  createDefaultAdmin(); 
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', productsRoutes);
app.use('/api', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
