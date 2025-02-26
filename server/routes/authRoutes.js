const express = require('express');
const { register, login, upload } = require('../controllers/authController');

const router = express.Router();

router.post('/register', upload.single('photo'), register);
router.post('/login', login);

module.exports = router;
