import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../Context/AuthContext';
import { login } from '../services/api';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await login(form);
      loginUser(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') setForm({ email: 'admin@demo.com', password: 'Admin@123' });
    else setForm({ email: 'bob@demo.com', password: 'Member@123' });
  };

  return (
    <div className="min-h-screen bg-ink-900 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink-800 border-r border-ink-700 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #c8f500 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
        <div className="relative z-10 max-w-sm text-center">
          <div className="w-16 h-16 bg-volt-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-volt-400/20">
            <span className="text-ink-900 font-display font-bold text-2xl">TT</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-ink-50 mb-4">TeamTask</h1>
          <p className="text-ink-400 text-lg leading-relaxed">
            Organize projects, assign tasks, and track progress — all in one place.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[['Projects', '∞'], ['Tasks', '∞'], ['Members', '∞']].map(([label, val]) => (
              <div key={label} className="bg-ink-900/60 rounded-xl p-4 border border-ink-700">
                <div className="text-volt-400 font-display font-bold text-2xl">{val}</div>
                <div className="text-ink-400 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 bg-volt-400 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-ink-900 font-display font-bold text-lg">TT</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-ink-50">TeamTask</h1>
          </div>

          <h2 className="font-display text-2xl font-bold text-ink-50 mb-1">Welcome back</h2>
          <p className="text-ink-400 text-sm mb-6">Sign in to continue to your workspace</p>

          {/* Demo shortcuts */}
          <div className="flex gap-2 mb-6">
            <button onClick={() => fillDemo('admin')}
              className="flex-1 text-xs py-2 px-3 bg-volt-400/10 border border-volt-400/30 text-volt-400 rounded-lg hover:bg-volt-400/20 transition-all">
              Demo Admin
            </button>
            <button onClick={() => fillDemo('member')}
              className="flex-1 text-xs py-2 px-3 bg-ink-700 border border-ink-600 text-ink-300 rounded-lg hover:bg-ink-600 transition-all">
              Demo Member
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-ink-300 mb-1.5">Email</label>
              <input type="email" className="input-field" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm text-ink-300 mb-1.5">Password</label>
              <input type="password" className="input-field" placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button type="submit" disabled={loading}
              className="w-full btn-primary py-2.5 flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <div className="w-4 h-4 border-2 border-ink-900 border-t-transparent rounded-full animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-ink-400 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-volt-400 hover:text-volt-300 font-medium">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
