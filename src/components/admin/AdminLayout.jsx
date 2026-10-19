// src/components/admin/AdminLayout.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Menu, Bell, ShieldCheck, Flag, Mail } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';
import { api } from '../../services/api';

const pageMeta = {
  '/admin': { title: 'Dashboard', subtitle: 'Overview of your platform' },
  '/admin/users': { title: 'Manage Users', subtitle: 'Verify, upgrade or suspend members' },
  '/admin/payments': { title: 'Payments', subtitle: 'Track every transaction' },
  '/admin/reports': { title: 'Reports', subtitle: 'Review fake profile complaints' },
  '/admin/contacts': { title: 'Contact Messages', subtitle: 'Enquiries from your visitors' },
  '/admin/stories': { title: 'Success Stories', subtitle: 'Manage couple stories on the website' },
};

const getMeta = (pathname) => {
  const path = pathname.replace(/\/$/, '') || '/';
  const key = Object.keys(pageMeta)
    .filter((k) => path === k || (k !== '/admin' && path.startsWith(`${k}/`)))
    .sort((a, b) => b.length - a.length)[0];
  return pageMeta[key] || { title: 'Admin', subtitle: '' };
};

const AdminLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [counts, setCounts] = useState({ reports: 0, contacts: 0 });
  const bellRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleNavigate = () => {
    setMobileOpen(false);
    setBellOpen(false);
  };

  const { title, subtitle } = getMeta(location.pathname);

  // Pending counts refresh on every page change, so badges stay fresh after resolving items
  useEffect(() => {
    let alive = true;
    (async () => {
      const [statsRes, contactsRes] = await Promise.allSettled([
        adminService.getStats(),
        api.get('/contact/admin?status=new&limit=100'),
      ]);
      if (!alive) return;
      const reports =
        statsRes.status === 'fulfilled' && statsRes.value?.success
          ? statsRes.value.data?.reports?.pending_reports || 0
          : 0;
      const contacts =
        contactsRes.status === 'fulfilled' && contactsRes.value?.success && Array.isArray(contactsRes.value.data)
          ? contactsRes.value.data.length
          : 0;
      setCounts({ reports: Number(reports), contacts });
    })();
    return () => {
      alive = false;
    };
  }, [location.pathname]);

  // Close notification dropdown on outside click / Escape; Escape also closes mobile menu
  useEffect(() => {
    const onClick = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setBellOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const badges = { '/admin/reports': counts.reports, '/admin/contacts': counts.contacts };
  const totalPending = counts.reports + counts.contacts;

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Desktop sidebar (sticky, so Logout is always visible) */}
      <div className="hidden md:block sticky top-0 h-screen flex-shrink-0">
        <AdminSidebar onNavigate={handleNavigate} onLogout={handleLogout} badges={badges} />
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${mobileOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!mobileOpen}
      >
        <div
          className={`absolute inset-0 bg-slate-900/60 transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`relative z-50 h-full w-64 transition-transform duration-300 ease-out ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <AdminSidebar
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            onClose={() => setMobileOpen(false)}
            badges={badges}
          />
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white/85 backdrop-blur border-b border-slate-200 px-4 md:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 transition"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-slate-700" />
            </button>
            <span className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-bold text-slate-800 leading-tight truncate">{title}</h1>
              {subtitle && <p className="hidden sm:block text-xs text-slate-500 leading-tight mt-0.5 truncate">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            {/* Notifications */}
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => setBellOpen((v) => !v)}
                className="relative p-2.5 rounded-xl hover:bg-slate-100 transition"
                aria-label="Notifications"
                aria-expanded={bellOpen}
              >
                <Bell className="w-5 h-5 text-slate-600" />
                {totalPending > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-rose-600 ring-2 ring-white" />
                )}
              </button>

              {bellOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-800">Notifications</p>
                  </div>
                  {totalPending === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <span className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                        <ShieldCheck className="w-5 h-5" />
                      </span>
                      <p className="text-sm font-semibold text-slate-700">You're all caught up</p>
                      <p className="text-xs text-slate-400 mt-0.5">No pending reports or messages.</p>
                    </div>
                  ) : (
                    <div className="p-2">
                      {counts.reports > 0 && (
                        <Link
                          to="/admin/reports"
                          onClick={handleNavigate}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition"
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
                            <Flag className="w-4 h-4" />
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {counts.reports} pending report{counts.reports > 1 ? 's' : ''}
                            </p>
                            <p className="text-xs text-slate-500">Needs your review</p>
                          </div>
                        </Link>
                      )}
                      {counts.contacts > 0 && (
                        <Link
                          to="/admin/contacts"
                          onClick={handleNavigate}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition"
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                            <Mail className="w-4 h-4" />
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {counts.contacts} new message{counts.contacts > 1 ? 's' : ''}
                            </p>
                            <p className="text-xs text-slate-500">Waiting for a reply</p>
                          </div>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User */}
            <div className="flex items-center gap-3 pl-3 sm:pl-5 border-l border-slate-200">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-slate-800 leading-tight">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-xs text-slate-500 leading-tight">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-bold shadow-md shadow-rose-200">
                {(user?.name?.[0] || 'A').toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;