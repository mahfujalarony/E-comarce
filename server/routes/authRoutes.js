// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const upload = require('../utils/profile');

const router = express.Router();

router.post('/register', upload.single('photo'), authController.register);
router.post('/login', authController.login);
router.get('/verify-token', authController.verify);
router.get('/image-data', authController.getImageData);

module.exports = router;