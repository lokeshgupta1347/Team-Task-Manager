const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getProjects, getProject, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, getProjects);
router.get('/:id', protect, getProject);
router.post('/', protect, adminOnly, [
  body('title').trim().notEmpty().withMessage('Project title is required'),
], createProject);
router.put('/:id', protect, adminOnly, updateProject);
router.delete('/:id', protect, adminOnly, deleteProject);

module.exports = router;
