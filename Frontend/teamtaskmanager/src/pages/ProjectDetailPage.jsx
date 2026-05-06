import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getProject, getTasks, createTask, updateTask, deleteTask, getUsers } from '../services/api';
import { useAuth } from '../Context/AuthContext';
import { format, isPast } from 'date-fns';
import Modal from '../components/shared/Modal';

const STATUS_OPTIONS = ['To-Do', 'In Progress', 'Done'];

const TaskCard = ({ task, isAdmin, onEdit, onDelete, onStatusChange }) => {
  const overdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'Done';
  return (
    <div className={`p-4 rounded-xl border transition-all group ${overdue ? 'bg-coral/5 border-coral/20' : 'bg-ink-700/40 border-ink-700 hover:border-ink-500'}`}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className={`font-medium text-sm ${task.status === 'Done' ? 'line-through text-ink-500' : 'text-ink-100'}`}>{task.title}</p>
          {task.description && <p className="text-xs text-ink-500 mt-1 line-clamp-2">{task.description}</p>}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {task.assignedTo && (
              <span className="text-xs text-ink-400 flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-gradient-to-br from-volt-400 to-teal inline-flex items-center justify-center text-ink-900 font-bold" style={{fontSize: '8px'}}>{task.assignedTo.name?.[0]}</span>
                {task.assignedTo.name}
              </span>
            )}
            {task.dueDate && (
              <span className={`text-xs ${overdue ? 'text-coral' : 'text-ink-500'}`}>
                {overdue ? '⚠ ' : ''}Due {format(new Date(task.dueDate), 'MMM d')}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <select value={task.status}
            onChange={e => onStatusChange(task._id, e.target.value)}
            className="text-xs bg-ink-800 border border-ink-600 text-ink-300 rounded-lg px-2 py-1 focus:outline-none focus:border-volt-400">
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {isAdmin && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onEdit(task)} className="text-xs px-2 py-1 bg-ink-700 text-ink-300 rounded hover:bg-ink-600">Edit</button>
              <button onClick={() => onDelete(task._id)} className="text-xs px-2 py-1 bg-red-900/30 text-red-400 rounded hover:bg-red-900/50">Del</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', status: 'To-Do', assignedTo: '', dueDate: '', projectId: id });
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    Promise.all([getProject(id), getTasks({ projectId: id }), isAdmin ? getUsers() : Promise.resolve({ data: [] })])
      .then(([p, t, u]) => { setProject(p.data); setTasks(t.data); setUsers(u.data); })
      .catch(() => toast.error('Failed to load project'))
      .finally(() => setLoading(false));
  }, [id, isAdmin]);

  const openCreate = () => { setEditing(null); setForm({ title: '', description: '', status: 'To-Do', assignedTo: '', dueDate: '', projectId: id }); setShowModal(true); };
  const openEdit = (t) => { setEditing(t); setForm({ title: t.title, description: t.description || '', status: t.status, assignedTo: t.assignedTo?._id || '', dueDate: t.dueDate ? t.dueDate.split('T')[0] : '', projectId: id }); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        const { data } = await updateTask(editing._id, form);
        setTasks(prev => prev.map(t => t._id === editing._id ? data : t));
        toast.success('Task updated');
      } else {
        const { data } = await createTask(form);
        setTasks(prev => [data, ...prev]);
        toast.success('Task created');
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try { await deleteTask(taskId); setTasks(prev => prev.filter(t => t._id !== taskId)); toast.success('Task deleted'); }
    catch { toast.error('Failed to delete task'); }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      const { data } = await updateTask(taskId, { status });
      setTasks(prev => prev.map(t => t._id === taskId ? data : t));
    } catch { toast.error('Failed to update status'); }
  };

  const filtered = filter === 'All' ? tasks : tasks.filter(t => t.status === filter);
  const byStatus = (s) => tasks.filter(t => t.status === s).length;

  if (loading) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-volt-400 border-t-transparent rounded-full animate-spin" /></div>;
  if (!project) return <div className="text-center py-16 text-ink-400">Project not found</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link to="/projects" className="text-xs text-ink-400 hover:text-ink-200 mb-2 block">← Projects</Link>
          <h1 className="font-display text-2xl font-bold text-ink-50">{project.title}</h1>
          {project.description && <p className="text-ink-400 text-sm mt-1">{project.description}</p>}
        </div>
        {isAdmin && <button onClick={openCreate} className="btn-primary flex-shrink-0">+ New Task</button>}
      </div>

      {/* Progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-ink-300 font-medium">Progress</span>
          <span className="text-xs text-ink-500">{byStatus('Done')} / {tasks.length} done</span>
        </div>
        <div className="h-2 bg-ink-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-teal to-volt-400 rounded-full transition-all duration-500"
            style={{ width: tasks.length ? `${(byStatus('Done') / tasks.length) * 100}%` : '0%' }} />
        </div>
        <div className="flex gap-4 mt-3 text-xs text-ink-500">
          <span>{byStatus('To-Do')} To-Do</span>
          <span className="text-amber">{byStatus('In Progress')} In Progress</span>
          <span className="text-teal">{byStatus('Done')} Done</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['All', 'To-Do', 'In Progress', 'Done'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${filter === f ? 'bg-volt-400 text-ink-900 border-volt-400 font-semibold' : 'bg-ink-800 text-ink-400 border-ink-700 hover:border-ink-500'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Tasks */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="card text-center py-10 text-ink-400">No tasks {filter !== 'All' ? `with status "${filter}"` : 'yet'}</div>
        ) : filtered.map(task => (
          <TaskCard key={task._id} task={task} isAdmin={isAdmin} onEdit={openEdit} onDelete={handleDelete} onStatusChange={handleStatusChange} />
        ))}
      </div>

      {showModal && (
        <Modal title={editing ? 'Edit Task' : 'New Task'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm text-ink-300 mb-1.5">Title *</label>
              <input className="input-field" placeholder="Task title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm text-ink-300 mb-1.5">Description</label>
              <textarea className="input-field resize-none" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-ink-300 mb-1.5">Status</label>
                <select className="input-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-ink-300 mb-1.5">Due Date</label>
                <input type="date" className="input-field" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
              </div>
            </div>
            {users.length > 0 && (
              <div>
                <label className="block text-sm text-ink-300 mb-1.5">Assign To</label>
                <select className="input-field" value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })}>
                  <option value="">Unassigned</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                </select>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
