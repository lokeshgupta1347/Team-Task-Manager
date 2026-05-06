const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');

exports.getTasks = async (req, res) => {
  try {
    const { projectId, status, assignedTo } = req.query;
    let filter = {};

    if (projectId) filter.projectId = projectId;
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;

    if (req.user.role === 'member') {
      const memberProjects = await Project.find({ members: req.user._id }).select('_id');
      const projectIds = memberProjects.map(p => p._id);
      filter.projectId = projectId ? projectId : { $in: projectIds };
    }

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('projectId', 'title')
      .populate('createdBy', 'name')
      .sort({ dueDate: 1, createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('projectId', 'title members')
      .populate('createdBy', 'name');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const task = await Task.create({ ...req.body, createdBy: req.user._id });
    const populated = await task.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'projectId', select: 'title' },
      { path: 'createdBy', select: 'name' }
    ]);
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Members can only update status of tasks assigned to them
    if (req.user.role === 'member') {
      if (task.assignedTo?.toString() !== req.user._id.toString())
        return res.status(403).json({ message: 'Not authorized to edit this task' });
      const { status } = req.body;
      task.status = status || task.status;
    } else {
      Object.assign(task, req.body);
    }

    await task.save();
    const populated = await task.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'projectId', select: 'title' },
      { path: 'createdBy', select: 'name' }
    ]);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    let taskFilter = {};
    if (req.user.role === 'member') {
      taskFilter.assignedTo = req.user._id;
    }

    const [todo, inProgress, done, overdue, total] = await Promise.all([
      Task.countDocuments({ ...taskFilter, status: 'To-Do' }),
      Task.countDocuments({ ...taskFilter, status: 'In Progress' }),
      Task.countDocuments({ ...taskFilter, status: 'Done' }),
      Task.countDocuments({ ...taskFilter, status: { $ne: 'Done' }, dueDate: { $lt: new Date() } }),
      Task.countDocuments(taskFilter),
    ]);

    res.json({ todo, inProgress, done, overdue, total });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
