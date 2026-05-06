import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../Context/AuthContext';
import { signup } from '../services/api';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await signup(form);
      loginUser(data.token, data.user);
      toast.success('Account created! Welcome aboard.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center p-6">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-volt-400 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-ink-900 font-display font-bold text-lg">TT</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-ink-50">Create your account</h1>
          <p className="text-ink-400 text-sm mt-1">Join your team on TeamTask</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-ink-300 mb-1.5">Full Name</label>
            <input type="text" className="input-field" placeholder="Alice Johnson"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm text-ink-300 mb-1.5">Email</label>
            <input type="email" className="input-field" placeholder="alice@company.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm text-ink-300 mb-1.5">Password</label>
            <input type="password" className="input-field" placeholder="Min 6 characters"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm text-ink-300 mb-1.5">Role</label>
            <select className="input-field" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" disabled={loading}
            className="w-full btn-primary py-2.5 flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <div className="w-4 h-4 border-2 border-ink-900 border-t-transparent rounded-full animate-spin" /> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-ink-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-volt-400 hover:text-volt-300 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
