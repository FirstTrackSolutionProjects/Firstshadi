// src/pages/admin/AdminPayments.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { adminService } from '../../services/adminService';

/* ------------------------------ HELPERS ------------------------------ */

const money = (n) =>
  `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const STATUS_STYLES = {
  completed: { badge: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  pending: { badge: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  refunded: { badge: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
  failed: { badge: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
};

// completed / pending / refunded ke alawa sab "failed" bucket me
const bucket = (status) => (STATUS_STYLES[status] ? status : 'failed');

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'completed', label: 'Completed' },
  { key: 'pending', label: 'Pending' },
  { key: 'refunded', label: 'Refunded' },
  { key: 'failed', label: 'Failed' },
];

const formatDate = (value) => {
  const d = new Date(value);
  if (isNaN(d)) return { date: '—', time: '' };
  return {
    date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  };
};

const initial = (name) => (name ? String(name).trim().charAt(0).toUpperCase() : '?');

const cap = (s) => (s ? String(s).charAt(0).toUpperCase() + String(s).slice(1) : '—');

/* ------------------------------ SMALL PARTS ------------------------------ */

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLES[bucket(status)];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {cap(status)}
    </span>
  );
};

const Summary = ({ label, value, sub, tone }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-5">
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <p className={`text-2xl font-bold mt-1.5 ${tone}`}>{value}</p>
    {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
  </div>
);

const SkeletonRows = () =>
  [...Array(5)].map((_, i) => (
    <tr key={i} className="border-b border-slate-100 animate-pulse">
      {[...Array(8)].map((__, j) => (
        <td key={j} className="px-5 py-4">
          <div className="h-4 rounded bg-slate-200" />
        </td>
      ))}
    </tr>
  ));

/* ------------------------------ PAGE ------------------------------ */

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.getPayments({ limit: 100, offset: 0 });
      if (res.success) setPayments(res.data);
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

  const counts = useMemo(() => {
    const c = { all: payments.length, completed: 0, pending: 0, refunded: 0, failed: 0 };
    payments.forEach((p) => {
      c[bucket(p.status)] += 1;
    });
    return c;
  }, [payments]);

  const revenue = useMemo(
    () => payments.filter((p) => p.status === 'completed').reduce((sum, p) => sum + Number(p.total_amount || 0), 0),
    [payments]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return payments.filter((p) => {
      if (filter !== 'all' && bucket(p.status) !== filter) return false;
      if (!q) return true;
      return [p.order_id, p.user_name, p.user_email, p.plan]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [payments, query, filter]);

  return (
    <div className="space-y-6">
      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Summary label="Total payments" value={counts.all} tone="text-slate-800" />
        <Summary label="Completed" value={counts.completed} tone="text-green-600" />
        <Summary label="Pending" value={counts.pending} tone="text-amber-600" />
        <Summary label="Revenue" value={money(revenue)} sub="From completed payments" tone="text-purple-600" />
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* TOOLBAR */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 border-b border-slate-100">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition ${
                    active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                  <span className={`ml-1.5 text-xs ${active ? 'text-slate-300' : 'text-slate-400'}`}>{counts[f.key]}</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search order, name, email or plan"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent focus:bg-white transition"
            />
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="m-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <button onClick={load} className="font-semibold underline hover:no-underline">
              Try again
            </button>
          </div>
        )}

        {/* TABLE */}
        {!error && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr className="text-xs font-semibold uppercase tracking-wider">
                  <th className="px-5 py-3.5 text-left">Order ID</th>
                  <th className="px-5 py-3.5 text-left">User</th>
                  <th className="px-5 py-3.5 text-left">Plan</th>
                  <th className="px-5 py-3.5 text-right">Amount</th>
                  <th className="px-5 py-3.5 text-right">Total</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-left">Method</th>
                  <th className="px-5 py-3.5 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading && <SkeletonRows />}

                {!loading &&
                  visible.map((p) => {
                    const dt = formatDate(p.created_at);
                    return (
                      <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 transition">
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{p.order_id}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600 text-sm font-bold">
                              {initial(p.user_name)}
                            </span>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-800 truncate">{p.user_name || '—'}</p>
                              <p className="text-xs text-slate-500 truncate">{p.user_email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold">{cap(p.plan)}</span>
                        </td>
                        <td className="px-5 py-4 text-right text-slate-600 whitespace-nowrap">{money(p.amount)}</td>
                        <td className="px-5 py-4 text-right font-bold text-slate-800 whitespace-nowrap">{money(p.total_amount)}</td>
                        <td className="px-5 py-4 text-center">
                          <StatusBadge status={p.status} />
                        </td>
                        <td className="px-5 py-4 text-slate-600">{cap(p.payment_method)}</td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <p className="text-slate-800">{dt.date}</p>
                          <p className="text-xs text-slate-400">{dt.time}</p>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>

            {/* EMPTY STATE */}
            {!loading && visible.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center py-16 px-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
                  <CardIcon />
                </span>
                <p className="font-semibold text-slate-700">
                  {payments.length === 0 ? 'No payments found' : 'No payments match your search'}
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  {payments.length === 0
                    ? 'Payments will show up here once users purchase a plan.'
                    : 'Try a different keyword or clear the filter.'}
                </p>
                {payments.length > 0 && (
                  <button
                    onClick={() => {
                      setQuery('');
                      setFilter('all');
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* FOOTER */}
        {!loading && !error && visible.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-500">
            Showing {visible.length} of {payments.length} payments
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayments;