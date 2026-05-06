const { validationResult } = require('express-validator');
const Project = require('../models/Project');
const Task = require('../models/Task');

exports.getProjects = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { members: req.user._id };
    const projects = await Project.find(filter)
      .populate('members', 'name email role')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members', 'name email role')
      .populate('createdBy', 'name email');
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const isMember = project.members.some(m => m._id.toString() === req.user._id.toString());
    if (req.user.role !== 'admin' && !isMember)
      return res.status(403).json({ message: 'Access denied' });

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { title, description, members } = req.body;
    const memberIds = members || [];
    if (!memberIds.includes(req.user._id.toString())) memberIds.push(req.user._id);
    const project = await Project.create({ title, description, members: memberIds, createdBy: req.user._id });
    const populated = await project.populate('members', 'name email role');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('members', 'name email role');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    await Task.deleteMany({ projectId: req.params.id });
    res.json({ message: 'Project and its tasks deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
