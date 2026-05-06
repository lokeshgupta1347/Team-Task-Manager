import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import {
  SquaresFour, Folder, ListChecks, Users, SignOut, List, X
} from '@phosphor-icons/react';

const navItems = [
  { to: '/dashboard', icon: SquaresFour, label: 'Dashboard' },
  { to: '/projects', icon: Folder, label: 'Projects' },
  { to: '/tasks', icon: ListChecks, label: 'Tasks' },
];

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-ink-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-volt-400 rounded-lg flex items-center justify-center">
            <span className="text-ink-900 font-display font-bold text-sm">TT</span>
          </div>
          <span className="font-display font-bold text-lg text-ink-50">TeamTask</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-volt-400/10 text-volt-400 border border-volt-400/20'
                  : 'text-ink-400 hover:text-ink-100 hover:bg-ink-700'
              }`
            }
          >
            <Icon size={18} weight="duotone" />
            {label}
          </NavLink>
        ))}
        {isAdmin && (
          <NavLink to="/users" onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-volt-400/10 text-volt-400 border border-volt-400/20'
                  : 'text-ink-400 hover:text-ink-100 hover:bg-ink-700'
              }`
            }
          >
            <Users size={18} weight="duotone" />
            Users
          </NavLink>
        )}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-ink-700">
        <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-volt-400 to-teal flex items-center justify-center text-ink-900 font-bold text-sm flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-ink-100 truncate">{user?.name}</p>
            <p className="text-xs text-ink-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ink-400 hover:text-coral hover:bg-coral/10 transition-all duration-200"
        >
          <SignOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-ink-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 bg-ink-800 border-r border-ink-700 flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-60 bg-ink-800 flex flex-col animate-slide-in">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-ink-400 hover:text-ink-100">
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-ink-800 border-b border-ink-700">
          <button onClick={() => setMobileOpen(true)} className="text-ink-400 hover:text-ink-100">
            <List size={22} />
          </button>
          <span className="font-display font-bold text-ink-50">TeamTask</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
