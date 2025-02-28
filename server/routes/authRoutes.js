const express = require('express');
const { register, login, verify, upload } = require('../controllers/authController');

const router = express.Router();

router.post('/register', upload.single('photo'), register);
router.post('/login', login);
router.get('/verify-token', verify);


module.exports = router;
