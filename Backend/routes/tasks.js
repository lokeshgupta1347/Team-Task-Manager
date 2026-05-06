const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getTasks, getTask, createTask, updateTask, deleteTask, getDashboardStats } = require('../controllers/taskController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/stats', protect, getDashboardStats);
router.get('/', protect, getTasks);
router.get('/:id', protect, getTask);
router.post('/', protect, adminOnly, [
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('projectId').notEmpty().withMessage('Project is required'),
], createTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, adminOnly, deleteTask);

module.exports = router;
