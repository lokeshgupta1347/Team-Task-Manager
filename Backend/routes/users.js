const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole, deleteUser } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, getAllUsers);
router.put('/:id/role', protect, adminOnly, updateUserRole);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
