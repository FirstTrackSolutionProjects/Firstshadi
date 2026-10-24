// src/pages/Mymatch.jsx
import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { connectionService } from '../services/connectionService';

/* ------------------------------ ICONS ------------------------------ */

const iconProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const InboxIcon = () => (
  <svg {...iconProps}>
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" />
  </svg>
);

const HeartIcon = () => (
  <svg {...iconProps}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const XCircleIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const CheckIcon = () => (
  <svg {...iconProps} width={16} height={16}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CloseIcon = () => (
  <svg {...iconProps} width={16} height={16}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const EyeIcon = () => (
  <svg {...iconProps} width={16} height={16}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const MailIcon = () => (
  <svg {...iconProps} width={18} height={18}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </svg>
);

const FlagIcon = () => (
  <svg {...iconProps} width={18} height={18}>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
);

const CalendarIcon = () => (
  <svg {...iconProps} width={18} height={18}>
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

/* ------------------------------ COMPONENT ------------------------------ */

const Mymatch = () => {
  const [requested, setRequested] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [declined, setDeclined] = useState([]);
  const [selectedTab, setSelectedTab] = useState('request');
  const [viewingProfile, setViewingProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [reqRes, accRes] = await Promise.all([
        connectionService.getReceivedRequests(),
        connectionService.getAcceptedConnections(),
      ]);
      if (reqRes.success) setRequested(reqRes.data || []);
      if (accRes.success) setAccepted(accRes.data || []);
      // Declined not exposed by backend; leave empty or filter locally
      setDeclined([]);
    } catch (e) {
      console.error('Failed to load matches', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // close modal with Esc
  useEffect(() => {
    if (!viewingProfile) return;
    const onKey = (e) => { if (e.key === 'Escape') setViewingProfile(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [viewingProfile]);

  const acceptRequest = async (conn) => {
    try {
      const res = await connectionService.acceptRequest(conn.id);
      if (res.success) loadAll();
    } catch (e) {
      alert(e.message);
    }
  };

  const declineRequest = async (conn) => {
    try {
      const res = await connectionService.declineRequest(conn.id);
      if (res.success) loadAll();
    } catch (e) {
      alert(e.message);
    }
  };

  const closeModal = () => setViewingProfile(null);

  const displayName = (c) => {
    if (!c) return 'User';
    // For received requests, the requester is the "from_user"
    return c.from_user_name || c.to_user_name || 'User';
  };

  const displayImage = (c) => {
    if (!c) return '/default-avatar.png';
    return c.profile_photo || c.from_user_photo || c.to_user_photo || '/default-avatar.png';
  };

  const displayEmail = (c) => c.from_user_email || c.to_user_email || '';

  const tabs = [
    { key: 'request', label: 'Requests', icon: <InboxIcon />, count: requested.length },
    { key: 'accepted', label: 'Accepted', icon: <HeartIcon />, count: accepted.length },
    { key: 'declined', label: 'Declined', icon: <XCircleIcon />, count: declined.length },
  ];

  const tabTitles = {
    request: { title: 'Pending Requests', sub: 'People who want to connect with you' },
    accepted: { title: 'Accepted Profiles', sub: 'Your connected matches' },
    declined: { title: 'Declined Profiles', sub: 'Requests you have declined' },
  };

  const emptyText = {
    request: 'No pending requests right now. New requests will appear here.',
    accepted: 'You have no accepted matches yet. Accept a request to get started.',
    declined: 'Declined requests are not stored.',
  };

  const btnPrimary =
    'inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-800 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-rose-800/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-900';
  const btnOutline =
    'inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-300 hover:border-rose-800 hover:bg-rose-50 hover:text-rose-800';

  const renderCards = (list, kind) => {
    if (loading) {
      return (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="animate-pulse rounded-3xl border border-gray-200 bg-white p-8">
              <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-rose-100" />
              <div className="mx-auto mb-2 h-4 w-32 rounded bg-gray-200" />
              <div className="mx-auto h-3 w-40 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      );
    }

    if (list.length === 0) {
      return (
        <div className="mt-8 rounded-3xl border border-dashed border-rose-200 bg-white p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100 text-rose-800 ring-1 ring-rose-100">
            {kind === 'request' ? <InboxIcon /> : kind === 'accepted' ? <HeartIcon /> : <XCircleIcon />}
          </div>
          <p className="font-display text-xl font-bold text-gray-900">No profiles found</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">{emptyText[kind]}</p>
        </div>
      );
    }

    return (
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((conn) => (
          <div
            key={conn.id}
            className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 text-center transition-all duration-500 hover:-translate-y-2 hover:border-rose-200 hover:shadow-2xl hover:shadow-rose-100"
          >
            <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-rose-800 via-[#e0b46a] to-rose-800 transition-transform duration-500 group-hover:scale-x-100" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-rose-100/0 blur-2xl transition-all duration-500 group-hover:bg-rose-100/80" />

            <div className="relative">
              <div className="relative mx-auto mb-4 inline-flex">
                <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-rose-800/30 via-[#e0b46a]/40 to-rose-800/30 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative rounded-full bg-gradient-to-br from-rose-800 via-[#e0b46a] to-rose-800 p-1">
                  <img
                    src={displayImage(conn)}
                    alt={displayName(conn)}
                    className="h-24 w-24 rounded-full border-4 border-white bg-white object-cover"
                    onError={(e) => { e.target.src = '/default-avatar.png'; }}
                  />
                </div>
              </div>

              <h4 className="font-display text-lg font-bold text-gray-900">{displayName(conn)}</h4>
              <p className="mt-1 break-all text-sm text-gray-500">{displayEmail(conn)}</p>

              {kind === 'request' && (
                <div className="mt-6 flex justify-center gap-3">
                  <button onClick={() => acceptRequest(conn)} className={btnPrimary}>
                    <CheckIcon /> Accept
                  </button>
                  <button onClick={() => declineRequest(conn)} className={btnOutline}>
                    <CloseIcon /> Decline
                  </button>
                </div>
              )}

              {kind === 'accepted' && (
                <div className="mt-6 flex justify-center gap-3">
                  <button onClick={() => setViewingProfile(conn)} className={btnPrimary}>
                    <EyeIcon /> View Profile
                  </button>
                  <button onClick={() => declineRequest(conn)} className={btnOutline}>
                    <CloseIcon /> Remove
                  </button>
                </div>
              )}

              {kind === 'declined' && (
                <div className="mt-6 flex justify-center">
                  <button onClick={() => acceptRequest(conn)} className={btnPrimary}>
                    <CheckIcon /> Accept
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="relative flex-grow overflow-hidden bg-[#faf7f5] px-4 py-14">
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-rose-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#e0b46a]/15 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          {/* HEADER */}
          <div className="mb-10 text-center">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-800 shadow-sm">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              Connections
            </span>
            <h2 className="font-display text-4xl font-bold text-gray-900 sm:text-5xl">
              My <span className="italic text-rose-800">Matches</span>
            </h2>
            <div className="my-5 flex items-center justify-center gap-3">
              <span className="h-px w-14 bg-gradient-to-r from-transparent to-[#e0b46a]" />
              <span className="h-1.5 w-1.5 rotate-45 bg-[#e0b46a]" />
              <span className="h-px w-14 bg-gradient-to-l from-transparent to-[#e0b46a]" />
            </div>
          </div>

          {/* TABS */}
          <div className="mb-10 flex justify-center">
            <div className="inline-flex flex-wrap justify-center gap-1 rounded-2xl border border-rose-100 bg-white p-1.5 shadow-lg shadow-rose-100/50">
              {tabs.map((t) => {
                const active = selectedTab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setSelectedTab(t.key)}
                    className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                      active
                        ? 'bg-rose-800 text-white shadow-md shadow-rose-800/30'
                        : 'text-gray-600 hover:bg-rose-50 hover:text-rose-800'
                    }`}
                  >
                    {t.icon}
                    {t.label}
                    {t.count > 0 && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                          active ? 'bg-white text-rose-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {t.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB CONTENT */}
          <div>
            <h3 className="font-display text-2xl font-bold text-gray-900">{tabTitles[selectedTab].title}</h3>
            <p className="mt-1 text-sm text-gray-500">{tabTitles[selectedTab].sub}</p>
            {renderCards(
              selectedTab === 'request' ? requested : selectedTab === 'accepted' ? accepted : declined,
              selectedTab
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* PROFILE MODAL */}
      {viewingProfile && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-lg overflow-auto rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-28 bg-gradient-to-br from-rose-800 via-rose-800 to-rose-900">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-800 via-[#e0b46a] to-rose-800" />
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
              <button
                onClick={closeModal}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="px-6 pb-8">
              <div className="-mt-14 mb-5 flex flex-col items-center text-center">
                <div className="rounded-full bg-gradient-to-br from-rose-800 via-[#e0b46a] to-rose-800 p-1.5 shadow-lg">
                  <img
                    src={displayImage(viewingProfile)}
                    alt={displayName(viewingProfile)}
                    className="h-28 w-28 rounded-full border-4 border-white bg-white object-cover"
                    onError={(e) => { e.target.src = '/default-avatar.png'; }}
                  />
                </div>
                <h2 className="mt-4 font-display text-2xl font-bold text-gray-900">{displayName(viewingProfile)}</h2>
              </div>

              <div className="space-y-3">
                {[
                  { icon: <MailIcon />, label: 'Email', value: displayEmail(viewingProfile) || '—' },
                  { icon: <FlagIcon />, label: 'Status', value: viewingProfile.status || '—' },
                  {
                    icon: <CalendarIcon />,
                    label: 'Connected since',
                    value: new Date(viewingProfile.updated_at || viewingProfile.created_at).toLocaleDateString(),
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-[#faf7f5] p-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-50 to-rose-100 text-rose-800 ring-1 ring-rose-100">
                      {row.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{row.label}</p>
                      <p className="break-all font-semibold capitalize text-gray-900">{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mymatch;