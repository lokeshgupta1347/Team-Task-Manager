import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats, getTasks, getProjects } from '../services/api';
import { useAuth } from '../Context/AuthContext';
import { format, isPast, isToday } from 'date-fns';

const StatCard = ({ label, value, color, sub }) => (
  <div className="card flex flex-col gap-2 animate-fade-up">
    <span className="text-xs font-medium text-ink-400 uppercase tracking-wider">{label}</span>
    <span className={`font-display text-3xl font-bold ${color}`}>{value}</span>
    {sub && <span className="text-xs text-ink-500">{sub}</span>}
  </div>
);

const StatusBadge = ({ status, dueDate }) => {
  const overdue = dueDate && isPast(new Date(dueDate)) && status !== 'Done';
  if (overdue) return <span className="badge-overdue">Overdue</span>;
  if (status === 'Done') return <span className="badge-done">Done</span>;
  if (status === 'In Progress') return <span className="badge-progress">In Progress</span>;
  return <span className="badge-todo">To-Do</span>;
};

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardStats(),
      getTasks(),
      getProjects(),
    ]).then(([s, t, p]) => {
      setStats(s.data);
      setTasks(t.data.slice(0, 8));
      setProjects(p.data.slice(0, 4));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-volt-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const overdueCount = tasks.filter(t => t.dueDate && isPast(new Date(t.dueDate)) && t.status !== 'Done').length;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-50">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
          <span className="text-volt-400">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-ink-400 text-sm mt-1">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard label="Total Tasks" value={stats?.total ?? 0} color="text-ink-100" />
        <StatCard label="To-Do" value={stats?.todo ?? 0} color="text-ink-300" />
        <StatCard label="In Progress" value={stats?.inProgress ?? 0} color="text-amber" />
        <StatCard label="Completed" value={stats?.done ?? 0} color="text-teal" />
        <StatCard label="Overdue" value={stats?.overdue ?? 0} color="text-coral" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-ink-100">Recent Tasks</h2>
            <Link to="/tasks" className="text-xs text-volt-400 hover:text-volt-300">View all →</Link>
          </div>
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <p className="text-ink-400 text-sm text-center py-6">No tasks yet</p>
            ) : tasks.map(task => {
              const overdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'Done';
              return (
                <div key={task._id} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  overdue ? 'bg-coral/5 border-coral/20' : 'bg-ink-700/30 border-ink-700 hover:border-ink-600'
                }`}>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${task.status === 'Done' ? 'line-through text-ink-500' : 'text-ink-100'}`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-ink-500 truncate">{task.projectId?.title}</p>
                  </div>
                  <StatusBadge status={task.status} dueDate={task.dueDate} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Projects */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-ink-100">Projects</h2>
            <Link to="/projects" className="text-xs text-volt-400 hover:text-volt-300">View all →</Link>
          </div>
          <div className="space-y-2">
            {projects.length === 0 ? (
              <p className="text-ink-400 text-sm text-center py-6">No projects yet</p>
            ) : projects.map(p => (
              <Link key={p._id} to={`/projects/${p._id}`}
                className="block p-3 rounded-lg bg-ink-700/30 border border-ink-700 hover:border-ink-500 transition-all group">
                <p className="text-sm font-medium text-ink-100 group-hover:text-volt-400 transition-colors">{p.title}</p>
                <p className="text-xs text-ink-500 mt-0.5">{p.members?.length} member{p.members?.length !== 1 ? 's' : ''}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
