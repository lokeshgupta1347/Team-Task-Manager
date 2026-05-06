const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./db');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

const seed = async () => {
  await connectDB();
  await User.deleteMany();
  await Project.deleteMany();
  await Task.deleteMany();

  const hashedAdmin = await bcrypt.hash('Admin@123', 10);
  const hashedMember = await bcrypt.hash('Member@123', 10);

  const admin = await User.create({ name: 'Alice Admin', email: 'admin@demo.com', password: hashedAdmin, role: 'admin' });
  const member1 = await User.create({ name: 'Bob Builder', email: 'bob@demo.com', password: hashedMember, role: 'member' });
  const member2 = await User.create({ name: 'Carol Coder', email: 'carol@demo.com', password: hashedMember, role: 'member' });

  const project1 = await Project.create({
    title: 'Website Redesign',
    description: 'Revamp the company website with modern UI/UX',
    members: [admin._id, member1._id, member2._id],
    createdBy: admin._id
  });

  const project2 = await Project.create({
    title: 'Mobile App MVP',
    description: 'Build the first version of our mobile application',
    members: [admin._id, member2._id],
    createdBy: admin._id
  });

  const today = new Date();
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 7);
  const nextMonth = new Date(today); nextMonth.setDate(today.getDate() + 30);

  await Task.insertMany([
    { title: 'Design Homepage Mockup', description: 'Create wireframes and high-fidelity designs', status: 'Done', assignedTo: member1._id, projectId: project1._id, dueDate: yesterday, createdBy: admin._id },
    { title: 'Implement Navigation', description: 'Build responsive navbar with mobile menu', status: 'In Progress', assignedTo: member1._id, projectId: project1._id, dueDate: nextWeek, createdBy: admin._id },
    { title: 'SEO Optimization', description: 'Add meta tags, sitemaps, and structured data', status: 'To-Do', assignedTo: member2._id, projectId: project1._id, dueDate: nextMonth, createdBy: admin._id },
    { title: 'Performance Audit', description: 'Run Lighthouse audit and fix issues', status: 'To-Do', assignedTo: member2._id, projectId: project1._id, dueDate: yesterday, createdBy: admin._id },
    { title: 'Set Up React Native', description: 'Initialize project with Expo and configure CI', status: 'Done', assignedTo: member2._id, projectId: project2._id, dueDate: yesterday, createdBy: admin._id },
    { title: 'User Auth Screens', description: 'Build login, signup, and forgot password screens', status: 'In Progress', assignedTo: member2._id, projectId: project2._id, dueDate: nextWeek, createdBy: admin._id },
    { title: 'API Integration', description: 'Connect frontend with backend REST APIs', status: 'To-Do', assignedTo: member1._id, projectId: project2._id, dueDate: nextMonth, createdBy: admin._id },
  ]);

  console.log('✅ Database seeded successfully!');
  console.log('Admin: admin@demo.com / Admin@123');
  console.log('Member: bob@demo.com / Member@123');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
