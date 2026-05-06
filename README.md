# 📋 TeamTask Manager

A modern, full-stack task management application built with the MERN stack. Organize projects, assign tasks, track progress, and collaborate with your team — all in one place.

![Tech Stack](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## ✨ Features

### 🔐 Authentication & Authorization
- Secure JWT-based authentication
- Role-based access control (Admin & Member roles)
- Protected routes and API endpoints
- Demo accounts for quick testing

### 📊 Dashboard
- Real-time task statistics (Total, To-Do, In Progress, Completed, Overdue)
- Recent tasks overview with status indicators
- Project summary cards
- Personalized greeting with date display

### 📁 Project Management
- Create, edit, and delete projects (Admin only)
- Assign team members to projects
- Project descriptions and metadata
- View all tasks within a project
- Progress tracking with visual indicators

### ✅ Task Management
- Create, update, and delete tasks
- Task status workflow: To-Do → In Progress → Done
- Assign tasks to team members
- Set due dates with overdue detection
- Filter tasks by status
- Search tasks by title or project
- Kanban-style board view
- Task descriptions and details

### 👥 User Management (Admin)
- View all team members
- Update user roles (Admin/Member)
- Delete users
- User activity tracking

### 🎨 Modern UI/UX
- Dark theme with custom color palette (Volt, Ink, Teal, Coral)
- Fully responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Toast notifications for user feedback
- Modal dialogs for forms
- Loading states and error handling

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **React Hot Toast** - Toast notifications
- **Phosphor Icons** - Icon library
- **date-fns** - Date formatting and manipulation
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

---

## 📂 Project Structure

```
Team Task Manager/
├── Backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── seed.js            # Database seeding script
│   ├── controllers/
│   │   ├── authController.js  # Auth logic (signup, login)
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js            # JWT verification & role checks
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Project.js         # Project schema
│   │   └── Task.js            # Task schema
│   ├── routes/
│   │   ├── auth.js            # Auth routes
│   │   ├── projects.js        # Project routes
│   │   ├── tasks.js           # Task routes
│   │   └── users.js           # User routes
│   ├── .env                   # Environment variables
│   ├── .env.example           # Example env file
│   ├── package.json
│   └── server.js              # Express app entry point
│
└── Frontend/
    └── teamtaskmanager/
        ├── public/
        │   ├── favicon.svg
        │   └── icons.svg
        ├── src/
        │   ├── assets/         # Images and static files
        │   ├── components/
        │   │   └── shared/
        │   │       ├── Layout.jsx    # Main layout with sidebar
        │   │       └── Modal.jsx     # Reusable modal component
        │   ├── Context/
        │   │   └── AuthContext.jsx   # Auth state management
        │   ├── pages/
        │   │   ├── DashboardPage.jsx
        │   │   ├── LoginPage.jsx
        │   │   ├── SignupPage.jsx
        │   │   ├── ProjectsPage.jsx
        │   │   ├── ProjectDetailPage.jsx
        │   │   ├── TasksPage.jsx
        │   │   └── UsersPage.jsx
        │   ├── services/
        │   │   └── api.js            # Axios instance & API calls
        │   ├── App.jsx               # Main app component
        │   ├── main.jsx              # React entry point
        │   └── index.css             # Global styles (Tailwind)
        ├── .env                      # Environment variables
        ├── .env.example              # Example env file
        ├── tailwind.config.js        # Tailwind configuration
        ├── postcss.config.js         # PostCSS configuration
        ├── vite.config.js            # Vite configuration
        └── package.json
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn**

### 1️⃣ Clone the Repository
```bash
git clone <your-repo-url>
cd "Team Task Manager"
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend folder
cd Backend

# Install dependencies
npm install

# Create .env file (or copy from .env.example)
# Add your MongoDB URI and JWT secret
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/teamtaskmanager
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# (Optional) Seed the database with demo data
npm run seed

# Start the backend server
npm run dev
```

Backend will run on **http://localhost:5000**

### 3️⃣ Frontend Setup

```bash
# Navigate to frontend folder (from project root)
cd Frontend/teamtaskmanager

# Install dependencies
npm install

# Create .env file
VITE_API_URL=http://localhost:5000/api

# Start the frontend dev server
npm run dev
```

Frontend will run on **http://localhost:5173**

---

## 🎯 Usage

### Demo Accounts (After Seeding)
After running `npm run seed` in the Backend folder, you can use these accounts:

**Admin Account:**
- Email: `admin@demo.com`
- Password: `Admin@123`

**Member Account:**
- Email: `bob@demo.com`
- Password: `Member@123`

### User Roles

**Admin:**
- Full access to all features
- Create, edit, delete projects
- Create, edit, delete tasks
- Manage users (view, update roles, delete)
- Assign team members to projects

**Member:**
- View assigned projects and tasks
- Update task status
- View dashboard and statistics
- Cannot create/delete projects or tasks
- Cannot access user management

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Users
| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/api/users` | Get all users | Yes | No |
| PUT | `/api/users/:id/role` | Update user role | Yes | Yes |
| DELETE | `/api/users/:id` | Delete user | Yes | Yes |

### Projects
| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/api/projects` | Get all projects | Yes | No |
| GET | `/api/projects/:id` | Get project by ID | Yes | No |
| POST | `/api/projects` | Create project | Yes | Yes |
| PUT | `/api/projects/:id` | Update project | Yes | Yes |
| DELETE | `/api/projects/:id` | Delete project | Yes | Yes |

### Tasks
| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/api/tasks` | Get all tasks | Yes | No |
| GET | `/api/tasks/stats` | Get dashboard stats | Yes | No |
| GET | `/api/tasks/:id` | Get task by ID | Yes | No |
| POST | `/api/tasks` | Create task | Yes | Yes |
| PUT | `/api/tasks/:id` | Update task | Yes | No |
| DELETE | `/api/tasks/:id` | Delete task | Yes | Yes |

---

## 🎨 Color Palette

The app uses a custom dark theme:

- **Volt (Primary):** `#c8f500` - Accent color for CTAs and highlights
- **Ink (Background):** `#0a0a1a` to `#e0e0eb` - Dark theme shades
- **Teal (Success):** `#00d4aa` - Completed tasks
- **Amber (Warning):** `#f59e0b` - In-progress tasks
- **Coral (Error):** `#ff6b6b` - Overdue tasks

---

## 🔒 Security Features

- **Password Hashing:** bcryptjs with salt rounds
- **JWT Tokens:** 7-day expiration
- **Protected Routes:** Middleware-based authentication
- **Role-Based Access:** Admin-only endpoints
- **Input Validation:** express-validator for all inputs
- **CORS Configuration:** Restricted origins
- **Environment Variables:** Sensitive data in .env files

---

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string in `.env`
- Ensure MongoDB is running (local) or accessible (Atlas)
- Verify all dependencies are installed: `npm install`

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in `Frontend/teamtaskmanager/.env`
- Verify `CLIENT_URL` in `Backend/.env` matches frontend port (5173)

### CORS errors
- Update `CLIENT_URL` in `Backend/.env` to match your frontend URL
- Restart the backend server after changing .env

### Database connection errors
- Remove deprecated options from `config/db.js` (already fixed)
- Check MongoDB URI format and credentials
- Ensure IP whitelist in MongoDB Atlas (if using cloud)

---

## 🚧 Future Improvements

- [ ] Real-time updates with WebSockets
- [ ] File attachments for tasks
- [ ] Task comments and activity log
- [ ] Email notifications for deadlines
- [ ] Calendar view for tasks
- [ ] Task priority levels
- [ ] Drag-and-drop task reordering
- [ ] Export projects/tasks to CSV
- [ ] Dark/Light theme toggle
- [ ] Mobile app (React Native)
- [ ] Advanced filtering and sorting
- [ ] Task templates
- [ ] Time tracking
- [ ] Gantt chart view

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Design inspiration from modern project management tools
- Icons by [Phosphor Icons](https://phosphoricons.com/)
- Color palette inspired by cyberpunk aesthetics

---

## 📸 Screenshots

### Login Page
![Login Page](screenshots/login.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Projects
![Projects](screenshots/projects.png)

### Task Board
![Task Board](screenshots/tasks.png)

---

**⭐ If you found this project helpful, please give it a star!**
