import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../../services/api';

/* ------------------------------ HELPERS ------------------------------ */

const initial = (name) => (name ? String(name).trim().charAt(0).toUpperCase() : '?');

const formatDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const LONG_TEXT = 140;

const ACTIONS = {
  suspend: {
    title: 'Suspend this user?',
    body: (name) => `${name || 'The reported user'} will be suspended and this report will be marked as action taken.`,
    button: 'Yes, suspend',
    btnClass: 'bg-amber-600 hover:bg-amber-700',
  },
  delete: {
    title: 'Delete this user?',
    body: (name) => `Delete action will be taken against ${name || 'the reported user'}. This cannot be undone.`,
    button: 'Yes, delete',
    btnClass: 'bg-red-600 hover:bg-red-700',
  },
};

/* ------------------------------ ICONS ------------------------------ */

const svgProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const SearchIcon = () => (
  <svg {...svgProps} width="18" height="18">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ArrowIcon = () => (
  <svg {...svgProps} width="18" height="18">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg {...svgProps} width="30" height="30" strokeWidth="1.8">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const FlagIcon = () => (
  <svg {...svgProps} width="14" height="14">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1Z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
);

/* ------------------------------ SMALL PARTS ------------------------------ */

const Person = ({ label, name, email, tone }) => (
  <div className="flex items-center gap-3 min-w-0">
    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-bold ${tone}`}>
      {initial(name)}
    </span>
    <div className="min-w-0">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className="font-semibold text-slate-800 truncate">{name || '—'}</p>
      <p className="text-xs text-slate-500 truncate">{email}</p>
    </div>
  </div>
);

const ReportCard = ({ report, busy, onDismiss, onAsk }) => {
  const [expanded, setExpanded] = useState(false);
  const details = report.details || '';
  const isLong = details.length > LONG_TEXT;
  const date = formatDate(report.created_at);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-red-500 to-rose-500" />
      <div className="p-5 sm:p-6">
        {/* TOP ROW */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold border border-red-100">
            <FlagIcon /> {report.reason || 'No reason given'}
          </span>
          {date && <span className="text-xs text-slate-400">Reported on {date}</span>}
        </div>

        {/* PEOPLE */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
          <Person label="Reporter" name={report.reporter_name} email={report.reporter_email} tone="bg-slate-100 text-slate-600" />
          <span className="hidden md:flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-400">
            <ArrowIcon />
          </span>
          <Person label="Reported user" name={report.reported_name} email={report.reported_email} tone="bg-rose-50 text-rose-600" />
        </div>

        {/* DETAILS */}
        <div className="mt-5 rounded-xl bg-slate-50 border border-slate-100 p-4">
          <p className="text-xs font-semibold text-slate-400 mb-1">Details</p>
          {details ? (
            <>
              <p className={`text-sm text-slate-700 whitespace-pre-line break-words ${!expanded && isLong ? 'line-clamp-2' : ''}`}>
                {details}
              </p>
              {isLong && (
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="mt-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700"
                >
                  {expanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </>
          ) : (
            <p className="text-sm text-slate-400">No extra details provided.</p>
          )}
        </div>

        {/* ACTIONS */}
        <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
          <button
            onClick={onDismiss}
            disabled={busy}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition disabled:opacity-50"
          >
            Dismiss
          </button>
          <button
            onClick={() => onAsk('suspend')}
            disabled={busy}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-yellow-600 hover:bg-yellow-700 shadow-sm transition disabled:opacity-50"
          >
            Suspend
          </button>
          <button
            onClick={() => onAsk('delete')}
            disabled={busy}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 shadow-sm transition disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse space-y-5">
    <div className="h-6 w-32 rounded-full bg-slate-200" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="h-11 rounded-xl bg-slate-200" />
      <div className="h-11 rounded-xl bg-slate-200" />
    </div>
    <div className="h-16 rounded-xl bg-slate-100" />
  </div>
);

/* ------------------------------ PAGE ------------------------------ */

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [confirm, setConfirm] = useState(null); // { report, action }
  const [query, setQuery] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/reports?status=pending&limit=100');
      if (res.success) setReports(res.data);
      else setError(res.message || 'Failed to load reports');
    } catch (e) {
      console.error(e);
      setError(e.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Escape se modal band ho
  useEffect(() => {
    if (!confirm) return;
    const onKey = (e) => e.key === 'Escape' && setConfirm(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [confirm]);

  const resolve = async (id, action) => {
    setBusyId(id);
    setActionError('');
    try {
      await api.put(`/admin/reports/${id}/resolve`, {
        status: action === 'dismiss' ? 'dismissed' : 'action_taken',
        action,
      });
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      setActionError(e.message || 'Action failed. Please try again.');
    } finally {
      setBusyId(null);
      setConfirm(null);
    }
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return reports;
    return reports.filter((r) =>
      [r.reporter_name, r.reporter_email, r.reported_name, r.reported_email, r.reason, r.details]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [reports, query]);

  const cfg = confirm ? ACTIONS[confirm.action] : null;

  return (
    <div className="space-y-6">
      {/* HEADER ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-slate-800">Pending reports</h2>
          {!loading && !error && (
            <span className="min-w-[28px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-sm font-bold text-center">
              {reports.length}
            </span>
          )}
        </div>

        <div className="relative w-full sm:w-80">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <SearchIcon />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email or reason"
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* ERRORS */}
      {error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button onClick={load} className="font-semibold underline hover:no-underline">
            Try again
          </button>
        </div>
      )}
      {actionError && (
        <div className="flex items-center justify-between gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <span>{actionError}</span>
          <button onClick={() => setActionError('')} className="font-semibold underline hover:no-underline">
            Close
          </button>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="space-y-5">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* LIST */}
      {!loading && !error && visible.length > 0 && (
        <div className="space-y-5">
          {visible.map((r) => (
            <ReportCard
              key={r.id}
              report={r}
              busy={busyId === r.id}
              onDismiss={() => resolve(r.id, 'dismiss')}
              onAsk={(action) => setConfirm({ report: r, action })}
            />
          ))}
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && visible.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center py-20 px-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600 mb-4">
            <ShieldCheckIcon />
          </span>
          <p className="font-semibold text-slate-800">
            {reports.length === 0 ? 'All clear, no pending reports' : 'No reports match your search'}
          </p>
          <p className="text-sm text-slate-400 mt-1 max-w-sm">
            {reports.length === 0
              ? 'Fake profile complaints from users will appear here for review.'
              : 'Try a different keyword.'}
          </p>
          {reports.length > 0 && (
            <button
              onClick={() => setQuery('')}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* CONFIRM MODAL */}
      {confirm && cfg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50"
          onClick={() => setConfirm(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-slate-800">{cfg.title}</h3>
            <p className="text-sm text-slate-600 mt-2">{cfg.body(confirm.report.reported_name)}</p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setConfirm(null)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => resolve(confirm.report.id, confirm.action)}
                disabled={busyId === confirm.report.id}
                className={`px-4 py-2 rounded-xl text-sm font-semibold text-white transition disabled:opacity-50 ${cfg.btnClass}`}
              >
                {busyId === confirm.report.id ? 'Please wait...' : cfg.button}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;