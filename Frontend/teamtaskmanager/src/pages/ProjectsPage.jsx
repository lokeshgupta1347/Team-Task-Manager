import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getProjects, createProject, updateProject, deleteProject, getUsers } from '../services/api';
import { useAuth } from '../Context/AuthContext';
import Modal from '../components/shared/Modal';

export default function ProjectsPage() {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', members: [] });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([getProjects(), isAdmin ? getUsers() : Promise.resolve({ data: [] })])
      .then(([p, u]) => { setProjects(p.data); setUsers(u.data); })
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const openCreate = () => { setEditing(null); setForm({ title: '', description: '', members: [] }); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ title: p.title, description: p.description || '', members: p.members.map(m => m._id) });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Project title is required');
    setSaving(true);
    try {
      if (editing) {
        const { data } = await updateProject(editing._id, form);
        setProjects(prev => prev.map(p => p._id === editing._id ? data : p));
        toast.success('Project updated');
      } else {
        const { data } = await createProject(form);
        setProjects(prev => [data, ...prev]);
        toast.success('Project created');
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project and all its tasks?')) return;
    try {
      await deleteProject(id);
      setProjects(prev => prev.filter(p => p._id !== id));
      toast.success('Project deleted');
    } catch {
      toast.error('Failed to delete project');
    }
  };

  const toggleMember = (id) => {
    setForm(prev => ({
      ...prev,
      members: prev.members.includes(id) ? prev.members.filter(m => m !== id) : [...prev.members, id]
    }));
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-50">Projects</h1>
          <p className="text-ink-400 text-sm mt-0.5">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        {isAdmin && <button onClick={openCreate} className="btn-primary">+ New Project</button>}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-volt-400 border-t-transparent rounded-full animate-spin" /></div>
      ) : projects.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-ink-400">No projects yet{isAdmin ? ' — create one to get started' : ''}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map(p => (
            <div key={p._id} className="card hover:border-ink-500 transition-all group animate-fade-up">
              <div className="flex items-start justify-between gap-2 mb-3">
                <Link to={`/projects/${p._id}`} className="font-display font-bold text-ink-50 hover:text-volt-400 transition-colors text-lg leading-tight">
                  {p.title}
                </Link>
                {isAdmin && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button onClick={() => openEdit(p)} className="text-xs px-2 py-1 bg-ink-700 text-ink-300 rounded hover:bg-ink-600 transition-all">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="text-xs px-2 py-1 bg-red-900/30 text-red-400 rounded hover:bg-red-900/50 transition-all">Delete</button>
                  </div>
                )}
              </div>
              {p.description && <p className="text-sm text-ink-400 mb-4 line-clamp-2">{p.description}</p>}
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {p.members?.slice(0, 5).map(m => (
                    <div key={m._id} title={m.name}
                      className="w-7 h-7 rounded-full bg-gradient-to-br from-volt-400 to-teal border-2 border-ink-800 flex items-center justify-center text-xs font-bold text-ink-900">
                      {m.name?.[0]}
                    </div>
                  ))}
                  {p.members?.length > 5 && <div className="w-7 h-7 rounded-full bg-ink-700 border-2 border-ink-800 flex items-center justify-center text-xs text-ink-400">+{p.members.length - 5}</div>}
                </div>
                <Link to={`/projects/${p._id}`} className="text-xs text-volt-400 hover:text-volt-300">View tasks →</Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title={editing ? 'Edit Project' : 'New Project'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm text-ink-300 mb-1.5">Project Title *</label>
              <input className="input-field" placeholder="e.g. Website Redesign"
                value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm text-ink-300 mb-1.5">Description</label>
              <textarea className="input-field resize-none" rows={3} placeholder="What's this project about?"
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            {users.length > 0 && (
              <div>
                <label className="block text-sm text-ink-300 mb-2">Team Members</label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {users.map(u => (
                    <label key={u._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-ink-700 cursor-pointer transition-all">
                      <input type="checkbox" className="accent-volt-400"
                        checked={form.members.includes(u._id)}
                        onChange={() => toggleMember(u._id)} />
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-volt-400 to-teal flex items-center justify-center text-xs font-bold text-ink-900">{u.name?.[0]}</div>
                      <span className="text-sm text-ink-200">{u.name}</span>
                      <span className="text-xs text-ink-500 ml-auto capitalize">{u.role}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
