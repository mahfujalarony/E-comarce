const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Mongodb Connected');
  createDefaultAdmin()
})
  .catch(err => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  photoPath: String,
  role: { type: String, default: 'user' },
});

const User = mongoose.model('User', userSchema);

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const defaultAdmin = new User({
        name: 'Default Admin',
        email: 'admin@example.com',
        password: 'admin',
        photoPath: null,
        role: 'admin'
      });
      await defaultAdmin.save();
      console.log('Create a default admin!');
    } else {
      console.log('Already admin।');
    }
  } catch (error) {
    console.error('Error create default admin:', error);
  }
};

const isAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token missing !' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Only for admin !' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Wrong Token !' });
  }
};

app.put('/api/make-admin', isAdmin, async (req, res) => {
  const { email } = req.body; 
  try {
    const user = await User.findOne({ email }); // Fixed: Added query object
    if (!user) {
      return res.status(404).json({ message: 'No user found !' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'User Already Admin !' });
    }

    user.role = 'admin';
    await user.save();

    res.status(200).json({ message: 'User now Admin!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to make Admin !' });
  }
});

app.put('/api/remove-admin', isAdmin, async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email }); // Fixed: Added query object
    if (!user) {
      return res.status(404).json({ message: 'User Not Found!' });
    }
    if (user.role !== 'admin') {
      return res.status(400).json({ message: 'User Not Admin !' });
    }

    user.role = 'user';
    await user.save();

    res.status(200).json({ message: 'Remove Admin !' });
  } catch (error) {
    console.error('Error :', error);
    res.status(500).json({ message: 'Failed to remove Admin!' });
  }
});

app.delete('/api/delete-user', isAdmin, async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOneAndDelete({ email }); // Fixed: Added query object
    if (!user) {
      return res.status(404).json({ message: 'User Not Found !' });
    }

    res.status(200).json({ message: 'User Delete Successfully !' });
  } catch (error) {
    console.error('Error :', error);
    res.status(500).json({ message: 'Failed to Delete User !' });
  }
});

app.post('/api/register', upload.single('photo'), async (req, res) => {
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

    const userData = { name: user.name, email: user.email, photoPath: user.photoPath };
    console.log('Response data:', { message: 'User registered successfully', token, user: userData });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userData 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ message: 'Registration failed', error: error.message });
  }
});

app.post('/api/login', async(req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if(!user) {
      return res.status(400).json({ message: 'No user with this email !'})
    }

    if (user.password !== password) {
      return res.status(400).json({ message: 'Wrong password'});
    }

    const token = jwt.sign({ user: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET);

    res.status(200).json({ message: 'Login Successful', // Fixed: Typo corrected
      token,
      user: { 
      name: user.name, 
      email: user.email, 
      photoPath: user.photoPath 
    }})
  } catch(err) {
    console.log('error: ', err.message);
    res.status(500).json({ message: 'Failed Login', err: err.message })
  }
})

app.get('/api/users', isAdmin, async (req, res) => {
  try {
    const result = await User.find();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server Problem', error });
  }
});

// Get user photo by email
app.get('/api/user/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ photoPath: user.photoPath });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/verify-token', (req, res) => {
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
    res.status(401).json({ message: 'Expired Token' }); // Fixed: Typo corrected
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));