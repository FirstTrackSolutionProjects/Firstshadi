// src/components/admin/AdminSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Flag,
  Mail,
  BookHeart,
  LogOut,
  Home,
  X,
} from 'lucide-react';

const navItems = [
  { to: '/admin',           label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/users',     label: 'Users',     icon: Users },
  { to: '/admin/payments',  label: 'Payments',  icon: CreditCard },
  { to: '/admin/reports',   label: 'Reports',   icon: Flag },
  { to: '/admin/contacts',  label: 'Contacts',  icon: Mail },
  { to: '/admin/stories',   label: 'Stories',   icon: BookHeart },
];

// badges: { '/admin/reports': 3, '/admin/contacts': 5 }
const AdminSidebar = ({ onNavigate, onLogout, onClose, badges = {} }) => {
  return (
    <aside className="relative w-64 h-full bg-slate-900 text-slate-100 flex-shrink-0 flex flex-col overflow-hidden">
      {/* soft glow */}
      <div className="pointer-events-none absolute -top-24 -left-16 h-56 w-56 rounded-full bg-rose-600/20 blur-3xl" />

      {/* Brand */}
      <div className="relative px-5 py-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center font-bold text-white shadow-lg shadow-rose-900/40">
          F
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold leading-tight truncate">First Marriage</p>
          <p className="text-xs text-slate-400 leading-tight mt-0.5">Owner Panel</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="md:hidden p-2 -mr-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="relative flex-1 px-3 py-4 overflow-y-auto" aria-label="Admin navigation">
        <p className="px-3 mb-2 text-xs font-semibold text-slate-500">Menu</p>
        <div className="space-y-1">
          {navItems.map((item) => {
            const { to, label, end } = item;
            const Icon = item.icon;
            const count = badges[to] || 0;
            return (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 pl-3 pr-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-900/30'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-rose-400" />
                    )}
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${
                        isActive ? 'bg-white/20' : 'bg-slate-800 group-hover:bg-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="flex-1">{label}</span>
                    {count > 0 && (
                      <span
                        className={`min-w-[22px] h-[22px] px-1.5 rounded-full text-xs font-bold flex items-center justify-center ${
                          isActive ? 'bg-white text-rose-600' : 'bg-rose-600 text-white'
                        }`}
                      >
                        {count > 99 ? '99+' : count}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="relative p-3 border-t border-slate-800 space-y-1">
        <NavLink
          to="/"
          onClick={onNavigate}
          className="group flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800/80 hover:text-white transition"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 group-hover:bg-slate-700 transition">
            <Home className="w-4 h-4" />
          </span>
          View Public Site
        </NavLink>
        <button
          onClick={onLogout}
          className="group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-300 hover:bg-red-900/40 hover:text-white transition"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-900/30 group-hover:bg-red-800/60 transition">
            <LogOut className="w-4 h-4" />
          </span>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;