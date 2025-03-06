const express = require('express');
const { getUsers, makeAdmin, removeAdmin, deleteUser } = require('../controllers/userController');
const { isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', isAdmin, getUsers);
router.put('/make-admin', isAdmin, makeAdmin);
router.put('/remove-admin', isAdmin, removeAdmin);
router.delete('/delete-user', isAdmin, deleteUser);


module.exports = router;
