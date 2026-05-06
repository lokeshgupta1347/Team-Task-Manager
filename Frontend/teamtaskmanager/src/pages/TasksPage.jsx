import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getTasks, updateTask, deleteTask } from '../services/api';
import { useAuth } from '../Context/AuthContext';
import { format, isPast } from 'date-fns';

const StatusBadge = ({ status, dueDate }) => {
  const overdue = dueDate && isPast(new Date(dueDate)) && status !== 'Done';
  if (overdue) return <span className="badge-overdue">Overdue</span>;
  if (status === 'Done') return <span className="badge-done">Done</span>;
  if (status === 'In Progress') return <span className="badge-progress">In Progress</span>;
  return <span className="badge-todo">To-Do</span>;
};

export default function TasksPage() {
  const { isAdmin, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getTasks()
      .then(res => setTasks(res.data))
      .catch(() => toast.error('Failed to load tasks'))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (taskId, status) => {
    try {
      const { data } = await updateTask(taskId, { status });
      setTasks(prev => prev.map(t => t._id === taskId ? data : t));
    } catch { toast.error('Failed to update status'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try { await deleteTask(id); setTasks(prev => prev.filter(t => t._id !== id)); toast.success('Task deleted'); }
    catch { toast.error('Failed to delete task'); }
  };

  const filtered = tasks.filter(t => {
    const matchStatus = statusFilter === 'All' || t.status === statusFilter ||
      (statusFilter === 'Overdue' && t.dueDate && isPast(new Date(t.dueDate)) && t.status !== 'Done');
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.projectId?.title?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const grouped = {
    'To-Do': filtered.filter(t => t.status === 'To-Do'),
    'In Progress': filtered.filter(t => t.status === 'In Progress'),
    'Done': filtered.filter(t => t.status === 'Done'),
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-50">Tasks</h1>
          <p className="text-ink-400 text-sm mt-0.5">{tasks.length} total task{tasks.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input className="input-field sm:w-64" placeholder="Search tasks or projects..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className="flex gap-2 flex-wrap">
          {['All', 'To-Do', 'In Progress', 'Done', 'Overdue'].map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${statusFilter === f
                ? f === 'Overdue' ? 'bg-coral text-white border-coral font-semibold' : 'bg-volt-400 text-ink-900 border-volt-400 font-semibold'
                : 'bg-ink-800 text-ink-400 border-ink-700 hover:border-ink-500'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-volt-400 border-t-transparent rounded-full animate-spin" /></div>
      ) : statusFilter === 'Overdue' ? (
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="card text-center py-10 text-ink-400">No overdue tasks 🎉</div>
          ) : filtered.map(task => <TaskRow key={task._id} task={task} isAdmin={isAdmin} onStatusChange={handleStatusChange} onDelete={handleDelete} />)}
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-4">
          {Object.entries(grouped).map(([status, statusTasks]) => (
            <div key={status} className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-sm text-ink-300">{status}</h3>
                <span className="text-xs bg-ink-700 text-ink-400 px-2 py-0.5 rounded-full">{statusTasks.length}</span>
              </div>
              {statusTasks.length === 0 ? (
                <div className="text-center py-6 text-ink-600 text-sm border border-dashed border-ink-700 rounded-xl">Empty</div>
              ) : statusTasks.map(task => <TaskRow key={task._id} task={task} isAdmin={isAdmin} onStatusChange={handleStatusChange} onDelete={handleDelete} />)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TaskRow({ task, isAdmin, onStatusChange, onDelete }) {
  const overdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'Done';
  return (
    <div className={`p-4 rounded-xl border transition-all group ${overdue ? 'bg-coral/5 border-coral/20' : 'bg-ink-800 border-ink-700 hover:border-ink-500'}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className={`text-sm font-medium leading-snug ${task.status === 'Done' ? 'line-through text-ink-500' : 'text-ink-100'}`}>{task.title}</p>
        <StatusBadge status={task.status} dueDate={task.dueDate} />
      </div>
      {task.description && <p className="text-xs text-ink-500 mb-2 line-clamp-1">{task.description}</p>}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          {task.projectId && (
            <Link to={`/projects/${task.projectId._id}`} className="text-xs text-volt-400 hover:text-volt-300">{task.projectId.title}</Link>
          )}
          {task.assignedTo && <span className="text-xs text-ink-500">→ {task.assignedTo.name}</span>}
          {task.dueDate && <span className={`text-xs ${overdue ? 'text-coral font-medium' : 'text-ink-500'}`}>{overdue ? '⚠ ' : ''}Due {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <select value={task.status} onChange={e => onStatusChange(task._id, e.target.value)}
            className="text-xs bg-ink-700 border border-ink-600 text-ink-300 rounded px-1.5 py-1 focus:outline-none focus:border-volt-400">
            {['To-Do', 'In Progress', 'Done'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {isAdmin && (
            <button onClick={() => onDelete(task._id)} className="text-xs px-2 py-1 bg-red-900/30 text-red-400 rounded hover:bg-red-900/50 opacity-0 group-hover:opacity-100 transition-opacity">Del</button>
          )}
        </div>
      </div>
    </div>
  );
}
