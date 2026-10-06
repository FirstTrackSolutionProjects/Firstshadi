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
} from 'lucide-react';

const navItems = [
  { to: '/admin',           label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/users',     label: 'Users',     icon: Users },
  { to: '/admin/payments',  label: 'Payments',  icon: CreditCard },
  { to: '/admin/reports',   label: 'Reports',   icon: Flag },
  { to: '/admin/contacts',  label: 'Contacts',  icon: Mail },
  { to: '/admin/stories',   label: 'Stories',   icon: BookHeart },
];

const AdminSidebar = ({ onNavigate, onLogout }) => {
  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex-shrink-0 flex flex-col">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center font-bold text-white">
          F
        </div>
        <div>
          <p className="text-sm font-bold leading-tight">First Marriage</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-400">Owner Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        <NavLink
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          <Home className="w-4 h-4" /> View Public Site
        </NavLink>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-300 hover:bg-red-900/40 hover:text-white"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;