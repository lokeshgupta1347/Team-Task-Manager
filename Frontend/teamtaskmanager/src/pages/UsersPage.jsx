import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getUsers, updateUserRole, deleteUser } from '../services/api';
import { useAuth } from '../Context/AuthContext';

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers().then(res => setUsers(res.data)).finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (id, role) => {
    try {
      const { data } = await updateUserRole(id, role);
      setUsers(prev => prev.map(u => u._id === id ? data : u));
      toast.success('Role updated');
    } catch { toast.error('Failed to update role'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try { await deleteUser(id); setUsers(prev => prev.filter(u => u._id !== id)); toast.success('User deleted'); }
    catch { toast.error('Failed to delete user'); }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-50">Team Members</h1>
        <p className="text-ink-400 text-sm mt-0.5">{users.length} user{users.length !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-volt-400 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full">
            <thead className="border-b border-ink-700">
              <tr>
                {['Member', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-ink-400 uppercase tracking-wider px-5 py-3 first:pl-5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-700">
              {users.map(u => (
                <tr key={u._id} className="hover:bg-ink-700/30 transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-volt-400 to-teal flex items-center justify-center text-ink-900 font-bold text-sm flex-shrink-0">
                        {u.name?.[0]}
                      </div>
                      <span className="text-sm font-medium text-ink-100">{u.name}</span>
                      {u._id === currentUser._id && <span className="text-xs text-volt-400">(you)</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-ink-400">{u.email}</td>
                  <td className="px-5 py-3.5">
                    {u._id === currentUser._id ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-volt-400/20 text-volt-400' : 'bg-ink-700 text-ink-400'}`}>
                        {u.role}
                      </span>
                    ) : (
                      <select value={u.role} onChange={e => handleRoleChange(u._id, e.target.value)}
                        className="text-xs bg-ink-700 border border-ink-600 text-ink-300 rounded px-2 py-1 focus:outline-none focus:border-volt-400">
                        <option value="member">member</option>
                        <option value="admin">admin</option>
                      </select>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-ink-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5">
                    {u._id !== currentUser._id && (
                      <button onClick={() => handleDelete(u._id)}
                        className="text-xs text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
