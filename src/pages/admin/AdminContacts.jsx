import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../../services/api';

/* ------------------------------ HELPERS ------------------------------ */

const initial = (name) => (name ? String(name).trim().charAt(0).toUpperCase() : '?');

const timeAgo = (value) => {
  const d = new Date(value);
  if (isNaN(d)) return '';
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const fullDate = (value) => {
  const d = new Date(value);
  return isNaN(d) ? '' : d.toLocaleString();
};

const LONG_TEXT = 180;

const AVATAR_TONES = [
  'bg-rose-50 text-rose-600',
  'bg-indigo-50 text-indigo-600',
  'bg-amber-50 text-amber-600',
  'bg-emerald-50 text-emerald-600',
  'bg-purple-50 text-purple-600',
  'bg-cyan-50 text-cyan-600',
];

const toneFor = (key) => {
  const s = String(key || '');
  let hash = 0;
  for (let i = 0; i < s.length; i += 1) hash = (hash * 31 + s.charCodeAt(i)) % 997;
  return AVATAR_TONES[hash % AVATAR_TONES.length];
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

const MailIcon = ({ size = 16 }) => (
  <svg {...svgProps} width={size} height={size}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </svg>
);

const CheckIcon = () => (
  <svg {...svgProps} width="16" height="16">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const InboxIcon = () => (
  <svg {...svgProps} width="30" height="30" strokeWidth="1.8">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" />
  </svg>
);

/* ------------------------------ SMALL PARTS ------------------------------ */

const MessageCard = ({ contact, busy, onResolve }) => {
  const [expanded, setExpanded] = useState(false);
  const text = contact.message || '';
  const isLong = text.length > LONG_TEXT;

  const replyHref =
    `mailto:${contact.email}` +
    `?subject=${encodeURIComponent('Re: Your enquiry to First Marriage')}` +
    `&body=${encodeURIComponent(`Hi ${contact.name || ''},\n\n`)}`;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="flex flex-col sm:flex-row gap-4 p-5 sm:p-6">
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold ${toneFor(contact.email || contact.name)}`}>
          {initial(contact.name)}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <div className="min-w-0">
              <p className="font-bold text-slate-800 truncate">{contact.name || 'Unknown'}</p>
              <a href={`mailto:${contact.email}`} className="text-sm text-slate-500 hover:text-rose-600 hover:underline break-all">
                {contact.email}
              </a>
            </div>
            <span className="text-xs text-slate-400 whitespace-nowrap" title={fullDate(contact.created_at)}>
              {timeAgo(contact.created_at)}
            </span>
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
            <p className={`text-sm text-slate-700 whitespace-pre-line break-words ${!expanded && isLong ? 'line-clamp-3' : ''}`}>
              {text}
            </p>
            {isLong && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="mt-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700"
              >
                {expanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
            <a
              href={replyHref}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
            >
              <MailIcon /> Reply
            </a>
            <button
              onClick={onResolve}
              disabled={busy}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 shadow-sm transition disabled:opacity-50"
            >
              <CheckIcon /> {busy ? 'Resolving...' : 'Resolve'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse flex gap-4">
    <div className="h-12 w-12 rounded-full bg-slate-200 shrink-0" />
    <div className="flex-1 space-y-3">
      <div className="h-4 w-40 rounded bg-slate-200" />
      <div className="h-3 w-52 rounded bg-slate-100" />
      <div className="h-14 rounded-xl bg-slate-100" />
    </div>
  </div>
);

/* ------------------------------ PAGE ------------------------------ */

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState(null); // { type, text }

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/contact/admin?status=new&limit=100');
      if (res.success) setContacts(res.data);
      else setError(res.message || 'Failed to load messages');
    } catch (e) {
      console.error(e);
      setError(e.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resolve = async (id) => {
    setBusyId(id);
    try {
      await api.put(`/contact/admin/${id}/resolve`);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      showToast('success', 'Message marked as resolved');
    } catch (e) {
      showToast('error', e.message || 'Could not resolve message');
    } finally {
      setBusyId(null);
    }
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter((c) =>
      [c.name, c.email, c.message].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [contacts, query]);

  return (
    <div className="space-y-6">
      {/* HEADER ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-slate-800">New messages</h2>
          {!loading && !error && (
            <span className="min-w-[28px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-sm font-bold text-center">
              {contacts.length}
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
            placeholder="Search name, email or message"
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button onClick={load} className="font-semibold underline hover:no-underline">
            Try again
          </button>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* LIST */}
      {!loading && !error && visible.length > 0 && (
        <div className="space-y-4">
          {visible.map((c) => (
            <MessageCard key={c.id} contact={c} busy={busyId === c.id} onResolve={() => resolve(c.id)} />
          ))}
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && visible.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center py-20 px-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 mb-4">
            <InboxIcon />
          </span>
          <p className="font-semibold text-slate-800">
            {contacts.length === 0 ? 'Inbox is empty' : 'No messages match your search'}
          </p>
          <p className="text-sm text-slate-400 mt-1 max-w-sm">
            {contacts.length === 0
              ? 'New enquiries from the Contact Us page will show up here.'
              : 'Try a different keyword.'}
          </p>
          {contacts.length > 0 && (
            <button
              onClick={() => setQuery('')}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold text-white ${
            toast.type === 'success' ? 'bg-slate-900' : 'bg-red-600'
          }`}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
};

export default AdminContacts;