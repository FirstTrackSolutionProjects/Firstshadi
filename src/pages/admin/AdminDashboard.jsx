import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';

const StatCard = ({ title, value, accent = 'blue' }) => {
  const accents = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    yellow: 'from-yellow-500 to-amber-500',
    red: 'from-red-500 to-rose-500',
    purple: 'from-purple-500 to-pink-500',
    indigo: 'from-indigo-500 to-blue-500',
  };
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition">
      <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${accents[accent]} mb-3`} />
      <p className="text-xs text-slate-500 uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await adminService.getStats();
        if (res.success) setStats(res.data);
        else setError(res.message);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="text-slate-500">Loading stats…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!stats) return null;

  return (
    <div className="space-y-8">
      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Link to="/admin/users" className="rounded-xl bg-blue-50 border border-blue-200 p-4 hover:bg-blue-100 transition">
          <p className="font-semibold text-blue-700 text-sm">Users</p>
          <p className="text-xs text-blue-500 mt-0.5">Verify · Premium · Suspend</p>
        </Link>
        <Link to="/admin/payments" className="rounded-xl bg-green-50 border border-green-200 p-4 hover:bg-green-100 transition">
          <p className="font-semibold text-green-700 text-sm">Payments</p>
          <p className="text-xs text-green-500 mt-0.5">View transactions</p>
        </Link>
        <Link to="/admin/reports" className="rounded-xl bg-red-50 border border-red-200 p-4 hover:bg-red-100 transition">
          <p className="font-semibold text-red-700 text-sm">Reports</p>
          <p className="text-xs text-red-500 mt-0.5">Fake profile complaints</p>
        </Link>
        <Link to="/admin/contacts" className="rounded-xl bg-amber-50 border border-amber-200 p-4 hover:bg-amber-100 transition">
          <p className="font-semibold text-amber-700 text-sm">Contacts</p>
          <p className="text-xs text-amber-500 mt-0.5">User enquiries</p>
        </Link>
        <Link to="/admin/stories" className="rounded-xl bg-purple-50 border border-purple-200 p-4 hover:bg-purple-100 transition">
          <p className="font-semibold text-purple-700 text-sm">Stories</p>
          <p className="text-xs text-purple-500 mt-0.5">Success stories CMS</p>
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Users" value={stats.users?.total_users || 0} accent="blue" />
        <StatCard title="Verified Users" value={stats.users?.verified_users || 0} accent="green" />
        <StatCard title="Premium Users" value={stats.users?.premium_users || 0} accent="yellow" />
        <StatCard title="Free Users" value={stats.users?.free_users || 0} accent="purple" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Profiles" value={stats.profiles?.total_profiles || 0} accent="indigo" />
        <StatCard title="Pending Requests" value={stats.connections?.pending_requests || 0} accent="yellow" />
        <StatCard title="Accepted Connections" value={stats.connections?.accepted_connections || 0} accent="green" />
        <StatCard title="Pending Reports" value={stats.reports?.pending_reports || 0} accent="red" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Payments" value={stats.payments?.total_payments || 0} accent="blue" />
        <StatCard title="Completed" value={stats.payments?.completed_payments || 0} accent="green" />
        <StatCard title="Pending" value={stats.payments?.pending_payments || 0} accent="yellow" />
        <StatCard title="Total Revenue (₹)" value={Number(stats.payments?.total_revenue || 0).toLocaleString()} accent="purple" />
      </div>

      {/* Registrations chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Registrations (last 7 days)</h2>
        {stats.dailyRegistrations?.length ? (
          <div className="flex items-end gap-3 h-40">
            {stats.dailyRegistrations.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
                  style={{ height: `${Math.max(8, d.count * 20)}px` }}
                />
                <span className="text-xs mt-2 text-slate-500">{String(d.date).slice(5)}</span>
                <span className="text-xs font-bold text-slate-700">{d.count}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">No recent registrations.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;