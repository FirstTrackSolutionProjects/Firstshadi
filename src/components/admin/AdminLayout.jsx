// src/components/admin/AdminLayout.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Menu, X, Bell, ShieldCheck } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';

const pageTitles = {
  '/admin': 'Dashboard',
  '/admin/users': 'Manage Users',
  '/admin/payments': 'Payments',
  '/admin/reports': 'Reports',
  '/admin/contacts': 'Contact Messages',
  '/admin/stories': 'Success Stories',
};

const AdminLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleNavigate = () => setMobileOpen(false);
  const title = pageTitles[location.pathname] || 'Admin';

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <AdminSidebar onNavigate={handleNavigate} onLogout={handleLogout} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative z-50">
            <AdminSidebar onNavigate={handleNavigate} onLogout={handleLogout} />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-rose-600" />
              <h1 className="text-lg md:text-xl font-bold text-slate-800">{title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-slate-100" aria-label="Notifications">
              <Bell className="w-5 h-5 text-slate-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-slate-800 leading-tight">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-xs text-slate-500 leading-tight">Administrator</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-bold">
                {(user?.name?.[0] || 'A').toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;