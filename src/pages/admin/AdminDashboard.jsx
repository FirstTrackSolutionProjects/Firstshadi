import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';

/* ------------------------------ ICONS ------------------------------ */

const ICON_PATHS = {
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  verified: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  crown: (
    <>
      <path d="m2 4 3 12h14l3-12-6 7-4-9-4 9-6-7Z" />
      <path d="M5 20h14" />
    </>
  ),
  user: (
    <>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  profile: (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 21v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </>
  ),
  link: (
    <>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </>
  ),
  flag: (
    <>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1Z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </>
  ),
  card: (
    <>
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </>
  ),
  check: (
    <>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </>
  ),
  rupee: (
    <>
      <path d="M6 3h12" />
      <path d="M6 8h12" />
      <path d="M6 13h4a4 4 0 0 0 0-8" />
      <path d="m6 13 8 8" />
    </>
  ),
  mail: (
    <>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </>
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </>
  ),
  arrow: (
    <>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </>
  ),
  refresh: (
    <>
      <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
      <path d="M21 3v5h-5" />
    </>
  ),
};

const Icon = ({ name, size = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {ICON_PATHS[name]}
  </svg>
);

/* ------------------------------ SMALL PARTS ------------------------------ */

const ACCENTS = {
  blue: { bar: 'from-blue-500 to-cyan-500', icon: 'bg-blue-50 text-blue-600' },
  green: { bar: 'from-green-500 to-emerald-500', icon: 'bg-green-50 text-green-600' },
  yellow: { bar: 'from-yellow-500 to-amber-500', icon: 'bg-amber-50 text-amber-600' },
  red: { bar: 'from-red-500 to-rose-500', icon: 'bg-red-50 text-red-600' },
  purple: { bar: 'from-purple-500 to-pink-500', icon: 'bg-purple-50 text-purple-600' },
  indigo: { bar: 'from-indigo-500 to-blue-500', icon: 'bg-indigo-50 text-indigo-600' },
};

const StatCard = ({ title, value, accent = 'blue', icon, hint }) => {
  const a = ACCENTS[accent];
  return (
    <div className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:shadow-slate-200/70 hover:-translate-y-0.5 transition">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${a.bar}`} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-3xl font-bold text-slate-800 mt-2 truncate">{value}</p>
        </div>
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${a.icon}`}>
          <Icon name={icon} />
        </span>
      </div>
      {hint && <p className="text-xs text-slate-400 mt-3">{hint}</p>}
    </div>
  );
};

const SectionTitle = ({ children }) => (
  <h2 className="text-base font-bold text-slate-800 mb-4">{children}</h2>
);

const QuickLink = ({ to, title, subtitle, tone, icon, badge }) => {
  const tones = {
    blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700 text-blue-500',
    green: 'bg-green-50 border-green-200 hover:bg-green-100 text-green-700 text-green-500',
    red: 'bg-red-50 border-red-200 hover:bg-red-100 text-red-700 text-red-500',
    amber: 'bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-700 text-amber-500',
    purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-700 text-purple-500',
  };
  const [bg, border, hover, titleColor, subColor] = tones[tone].split(' ');
  return (
    <Link
      to={to}
      className={`group relative flex items-center gap-3 rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md ${bg} ${border} ${hover}`}
    >
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80 ${titleColor}`}>
        <Icon name={icon} />
      </span>
      <div className="min-w-0 flex-1">
        <p className={`font-semibold text-sm ${titleColor}`}>{title}</p>
        <p className={`text-xs mt-0.5 truncate ${subColor}`}>{subtitle}</p>
      </div>
      <span className={`opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition ${titleColor}`}>
        <Icon name="arrow" size={16} />
      </span>
      {badge > 0 && (
        <span className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1.5 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center ring-2 ring-white">
          {badge}
        </span>
      )}
    </Link>
  );
};

const Skeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="h-40 rounded-3xl bg-slate-200" />
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-20 rounded-2xl bg-slate-200" />
      ))}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-32 rounded-2xl bg-slate-200" />
      ))}
    </div>
  </div>
);

const formatDay = (d) => {
  const date = new Date(d);
  if (isNaN(date)) return String(d).slice(5);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
};

/* ------------------------------ PAGE ------------------------------ */

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.getStats();
      if (res.success) setStats(res.data);
      else setError(res.message);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <Skeleton />;

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 text-center bg-white rounded-2xl border border-red-200 p-8">
        <p className="font-semibold text-red-600">Could not load dashboard</p>
        <p className="text-sm text-slate-500 mt-1">{error}</p>
        <button
          onClick={load}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition"
        >
          <Icon name="refresh" size={16} /> Try again
        </button>
      </div>
    );
  }

  if (!stats) return null;

  const totalUsers = stats.users?.total_users || 0;
  const verifiedUsers = stats.users?.verified_users || 0;
  const premiumUsers = stats.users?.premium_users || 0;
  const pendingReports = stats.reports?.pending_reports || 0;
  const revenue = Number(stats.payments?.total_revenue || 0);

  const pct = (n) => (totalUsers ? `${Math.round((n / totalUsers) * 100)}% of all users` : undefined);

  const daily = stats.dailyRegistrations || [];
  const maxCount = Math.max(1, ...daily.map((d) => d.count));
  const weekTotal = daily.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="space-y-10">
      {/* HERO SUMMARY */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950 p-6 sm:p-8 text-white shadow-xl shadow-slate-300/50">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-rose-500/20 blur-3xl" />
        <div className="absolute -left-10 -bottom-20 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 items-center">
          <div className="md:col-span-2">
            <p className="text-sm text-slate-300">Total revenue</p>
            <p className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-1">₹{revenue.toLocaleString()}</p>
            <p className="text-sm text-slate-400 mt-2">
              {stats.payments?.completed_payments || 0} completed of {stats.payments?.total_payments || 0} payments
            </p>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <p className="text-sm text-slate-300">Total users</p>
            <p className="text-3xl font-bold mt-1">{totalUsers}</p>
            <p className="text-xs text-slate-400 mt-1">{verifiedUsers} verified</p>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <p className="text-sm text-slate-300">Pending reports</p>
            <p className="text-3xl font-bold mt-1">{pendingReports}</p>
            <p className="text-xs text-slate-400 mt-1">{pendingReports ? 'Needs review' : 'All clear'}</p>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div>
        <SectionTitle>Quick actions</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <QuickLink to="/admin/users" title="Users" subtitle="Verify · Premium · Suspend" tone="blue" icon="users" />
          <QuickLink to="/admin/payments" title="Payments" subtitle="View transactions" tone="green" icon="card" />
          <QuickLink to="/admin/reports" title="Reports" subtitle="Fake profile complaints" tone="red" icon="flag" badge={pendingReports} />
          <QuickLink to="/admin/contacts" title="Contacts" subtitle="User enquiries" tone="amber" icon="mail" />
          <QuickLink to="/admin/stories" title="Stories" subtitle="Success stories CMS" tone="purple" icon="book" />
        </div>
      </div>

      {/* USERS */}
      <div>
        <SectionTitle>Users</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard title="Total Users" value={totalUsers} accent="blue" icon="users" />
          <StatCard title="Verified Users" value={verifiedUsers} accent="green" icon="verified" hint={pct(verifiedUsers)} />
          <StatCard title="Premium Users" value={premiumUsers} accent="yellow" icon="crown" hint={pct(premiumUsers)} />
          <StatCard title="Free Users" value={stats.users?.free_users || 0} accent="purple" icon="user" hint={pct(stats.users?.free_users || 0)} />
        </div>
      </div>

      {/* PROFILES & CONNECTIONS */}
      <div>
        <SectionTitle>Profiles & connections</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard title="Total Profiles" value={stats.profiles?.total_profiles || 0} accent="indigo" icon="profile" />
          <StatCard title="Pending Requests" value={stats.connections?.pending_requests || 0} accent="yellow" icon="clock" />
          <StatCard title="Accepted Connections" value={stats.connections?.accepted_connections || 0} accent="green" icon="link" />
          <StatCard title="Pending Reports" value={pendingReports} accent="red" icon="flag" />
        </div>
      </div>

      {/* PAYMENTS */}
      <div>
        <SectionTitle>Payments</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard title="Total Payments" value={stats.payments?.total_payments || 0} accent="blue" icon="card" />
          <StatCard title="Completed" value={stats.payments?.completed_payments || 0} accent="green" icon="check" />
          <StatCard title="Pending" value={stats.payments?.pending_payments || 0} accent="yellow" icon="clock" />
          <StatCard title="Total Revenue (₹)" value={revenue.toLocaleString()} accent="purple" icon="rupee" />
        </div>
      </div>

      {/* REGISTRATIONS CHART */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-2 mb-8">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Registrations (last 7 days)</h2>
            <p className="text-sm text-slate-500 mt-0.5">New users signing up each day</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-slate-800 leading-none">{weekTotal}</p>
            <p className="text-xs text-slate-500 mt-1">this week</p>
          </div>
        </div>

        {daily.length ? (
          <div className="relative">
            {/* gridlines */}
            <div className="absolute inset-x-0 top-0 h-48 flex flex-col justify-between pointer-events-none">
              {[0, 1, 2].map((i) => (
                <div key={i} className="border-t border-dashed border-slate-200" />
              ))}
            </div>

            <div className="relative flex items-end gap-3 sm:gap-5 h-48">
              {daily.map((d) => (
                <div key={d.date} className="group flex-1 h-full flex flex-col justify-end items-center">
                  <span className="mb-1 text-xs font-bold text-slate-700 opacity-80 group-hover:opacity-100">{d.count}</span>
                  <div
                    title={`${formatDay(d.date)}: ${d.count} registrations`}
                    className="w-full max-w-[56px] rounded-t-lg bg-gradient-to-t from-blue-500 to-blue-300 group-hover:from-blue-600 group-hover:to-blue-400 transition-all"
                    style={{ height: `${Math.max(4, (d.count / maxCount) * 80)}%` }}
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3 sm:gap-5 mt-3">
              {daily.map((d) => (
                <span key={d.date} className="flex-1 text-center text-xs text-slate-500">
                  {formatDay(d.date)}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center">
            <p className="text-sm font-medium text-slate-600">No recent registrations</p>
            <p className="text-xs text-slate-400 mt-1">New sign-ups will show up here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;