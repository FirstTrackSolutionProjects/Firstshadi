import React, { useEffect, useRef, useState } from 'react';
import Footer from '../components/Footer';
import { profileService } from '../services/profileService';

/* ------------------------------ ICONS ------------------------------ */

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
    <path d="m15 5 4 4"/>
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    <line x1="10" y1="11" x2="10" y2="17"/>
    <line x1="14" y1="11" x2="14" y2="17"/>
  </svg>
);

const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
);

const CancelIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

/* ------------------------------ HELPERS ------------------------------ */

const prettify = (str) =>
  str
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bDob\b/, 'Date of Birth');

const HIDDEN_KEYS = ['profile_photos', 'family_members', 'id', 'user_id', 'created_at', 'updated_at'];

const ISO_DATE = /^\d{4}-\d{2}-\d{2}(T.*)?$/;

const formatValue = (value) => {
  if (value === '' || value === null || value === undefined) return '—';
  if (typeof value === 'string' && ISO_DATE.test(value)) {
    const d = new Date(value);
    if (!isNaN(d)) {
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
  }
  return String(value);
};

const GROUPS = [
  { title: 'Family Details', icon: '🏠', test: /family|father|mother(?! tongue)|brother|sister|sibling/i },
  { title: 'Religion & Community', icon: '🕉️', test: /religion|community|caste|gotra|manglik|rashi|horoscope/i },
  { title: 'Education & Career', icon: '🎓', test: /educat|qualif|occupation|profession|job|company|employ|income|salary|work/i },
  { title: 'Location', icon: '📍', test: /city|state|country|address|pincode|zip|location|residen/i },
  { title: 'Lifestyle & Interests', icon: '✨', test: /diet|smok|drink|hobb|interest|food|lifestyle/i },
  { title: 'Personal Details', icon: '👤', test: /first name|last name|date of birth|\bage\b|gender|marital|height|weight|complexion|body|blood|disab|tongue|language/i },
];

const groupRows = (rows) => {
  const buckets = GROUPS.map((g) => ({ ...g, items: [] }));
  const other = { title: 'More Details', icon: '📋', items: [] };
  rows.forEach((row) => {
    if (row.value === null || row.value === undefined) return;
    const bucket = buckets.find((b) => b.test.test(row.label)) || other;
    bucket.items.push(row);
  });
  // Personal pehle dikhe
  const ordered = [buckets[5], buckets[1], buckets[2], buckets[3], buckets[0], buckets[4], other];
  return ordered.filter((b) => b.items.length > 0);
};

const flatten = (data, prefix = '', path = []) => {
  const rows = [];
  if (data == null || ['string', 'number', 'boolean'].includes(typeof data)) {
    if (prefix.trim().length > 0) {
      rows.push({ label: prettify(prefix.trim()), value: data, path });
    }
    return rows;
  }
  if (Array.isArray(data)) {
    data.forEach((item, i) =>
      rows.push(...flatten(item, `${prefix} ${i + 1}`, [...path, i]))
    );
    return rows;
  }
  Object.entries(data).forEach(([k, v]) => {
    if (!HIDDEN_KEYS.includes(k)) {
      rows.push(...flatten(v, `${prefix} ${prettify(k)}`, [...path, k]));
    }
  });
  return rows;
};

/* ------------------------------ COMPONENT ------------------------------ */

const Myprofile = () => {
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await profileService.getProfile();
        if (res.success) {
          setProfile(res.data);
          setEditedProfile(res.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your profile?')) return;
    try {
      await profileService.deleteProfile();
      setProfile(null);
      setEditedProfile(null);
      window.location.href = '/';
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await profileService.updateProfile(editedProfile);
      if (res.success) {
        setProfile(res.data);
        setEditedProfile(res.data);
        setIsEditing(false);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleChange = (path, value) => {
    setEditedProfile((currentProfile) => {
      const newProfile = JSON.parse(JSON.stringify(currentProfile));
      let temp = newProfile;
      for (let i = 0; i < path.length - 1; i++) {
        if (!temp[path[i]]) temp[path[i]] = typeof path[i + 1] === 'number' ? [] : {};
        temp = temp[path[i]];
      }
      temp[path[path.length - 1]] = value;
      return newProfile;
    });
  };

  const handleImageClick = () => {
    if (isEditing && fileInputRef.current) fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await profileService.uploadPhotos([file]);
      if (res.success) {
        setProfile(res.data);
        setEditedProfile(res.data);
      }
    } catch (err) {
      alert(err.message);
    }
  };

    if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#faf7f5] px-4 font-sans">
        <div className="w-full max-w-md rounded-3xl border border-rose-100 bg-white p-10 text-center shadow-xl shadow-rose-100/60">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-rose-100 border-t-rose-800" />
          <h2 className="text-lg font-semibold text-gray-800">Loading your profile...</h2>
          <p className="mt-1 text-sm text-gray-500">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#faf7f5] px-4 font-sans">
        <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-rose-100 bg-white p-10 text-center shadow-xl shadow-rose-100/60">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-800 via-[#e0b46a] to-rose-800" />
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-3xl ring-4 ring-rose-100">
            👤
          </div>
          <h2 className="text-xl font-bold text-gray-900">{error || 'No profile yet'}</h2>
          <p className="mt-1 text-sm text-gray-500">Create your profile to start finding matches.</p>
          <a
            href="/box"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-rose-800 px-6 py-3 font-semibold text-white shadow-lg shadow-rose-800/30 transition-all hover:-translate-y-0.5 hover:bg-rose-900"
          >
            Create Profile
          </a>
        </div>
      </div>
    );
  }

  const displayProfile = isEditing ? editedProfile : profile;
  const rows = flatten(displayProfile);
  const sections = groupRows(rows);
  const profileName = [displayProfile.first_name, displayProfile.last_name].filter(Boolean).join(' ') || 'My Profile';
  const chips = [
    displayProfile.age ? `${displayProfile.age} yrs` : null,
    displayProfile.religion,
    displayProfile.community,
    displayProfile.city,
  ].filter(Boolean);

  const filled = rows.filter((r) => r.value !== null && r.value !== undefined && String(r.value).trim() !== '').length;
  const completeness = rows.length ? Math.round((filled / rows.length) * 100) : 0;

    const filledLabel = `${filled} of ${rows.length} fields filled`;

  return (
    <div>
      <div className="min-h-screen bg-[#faf7f5] px-4 pb-20 font-sans">
        <div className="pointer-events-none fixed -top-24 -left-24 h-96 w-96 rounded-full bg-rose-100/60 blur-3xl" />
        <div className="pointer-events-none fixed -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#e0b46a]/10 blur-3xl" />

        <div className="relative mx-auto w-full max-w-4xl pt-8">
          {/* editing banner */}
          {isEditing && (
            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-[#e0b46a]/50 bg-[#e0b46a]/10 px-5 py-3 text-sm font-medium text-[#8a6320]">
              <EditIcon />
              You are in editing mode. Make your changes and click Save.
            </div>
          )}

          {/* HERO CARD */}
          <div className="relative overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-2xl shadow-rose-100/60">
            <div className="relative h-44 bg-gradient-to-br from-rose-800 via-rose-800 to-rose-900">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-800 via-[#e0b46a] to-rose-800" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(224,180,106,0.35),transparent_40%),radial-gradient(circle_at_85%_70%,rgba(255,255,255,0.18),transparent_35%)]" />
              <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
              <div className="absolute -bottom-12 right-32 h-32 w-32 rounded-full bg-white/10" />
            </div>

            <div className="px-6 pb-8 sm:px-10">
              <div className="-mt-16 flex flex-col gap-4 sm:flex-row sm:items-end">
                {/* avatar */}
                <div className="relative self-center sm:self-auto">
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-rose-800/40 via-[#e0b46a]/50 to-rose-800/40 blur-lg" />
                  <div className="relative rounded-full bg-gradient-to-br from-rose-800 via-[#e0b46a] to-rose-800 p-1.5">
                    <img
                      src={displayProfile.profile_photos?.[0] || 'https://placehold.co/200x200/9f1239/ffffff?text=Photo'}
                      alt="Profile"
                      className="h-32 w-32 rounded-full border-4 border-white bg-white object-cover sm:h-36 sm:w-36"
                    />
                  </div>
                  {isEditing && (
                    <button
                      onClick={handleImageClick}
                      className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-rose-800 text-white ring-4 ring-white transition hover:bg-rose-900"
                      title="Change profile image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                    </button>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </div>

                {/* name + chips */}
                <div className="flex-grow text-center sm:pb-2 sm:text-left">
                  <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    {profileName}
                  </h1>
                  {displayProfile.email && <p className="mt-1 text-sm text-gray-500">{displayProfile.email}</p>}
                  {(chips.length > 0 || displayProfile.diet) && (
                    <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                      {chips.map((c, i) => (
                        <span
                          key={i}
                          className="rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-800"
                        >
                          {c}
                        </span>
                      ))}
                      {displayProfile.diet && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e0b46a]/50 bg-[#e0b46a]/10 px-3 py-1 text-xs font-semibold text-[#8a6320]">
                          <span
                            aria-hidden="true"
                            className={`h-2.5 w-2.5 rounded-full ${
                              displayProfile.diet.toLowerCase().replace(/\s+/g, '') === 'veg' ? 'bg-green-600' : 'bg-red-600'
                            }`}
                          />
                          {displayProfile.diet}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* actions */}
                <div className="flex justify-center gap-2 sm:pb-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 rounded-xl bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-800/30 transition-all hover:-translate-y-0.5 hover:bg-rose-900 disabled:opacity-50"
                      >
                        <SaveIcon /> {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-rose-800 hover:text-rose-800"
                      >
                        <CancelIcon /> Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleEdit}
                        className="flex items-center gap-2 rounded-xl bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-800/30 transition-all hover:-translate-y-0.5 hover:bg-rose-900 hover:shadow-xl"
                      >
                        <EditIcon /> Edit Profile
                      </button>
                      <button
                        onClick={handleDelete}
                        title="Delete profile"
                        className="flex items-center rounded-xl border border-transparent px-3 py-2.5 text-gray-400 transition hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                      >
                        <DeleteIcon />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* completeness */}
              <div className="mt-8 rounded-2xl border border-rose-100 bg-[#faf7f5] p-5">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-800">Profile completeness</span>
                  <span className="font-bold text-rose-800">{completeness}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-rose-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-800 to-[#e0b46a] transition-all duration-700"
                    style={{ width: `${completeness}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">{filledLabel}</p>
              </div>
            </div>
          </div>

          {/* SECTIONS */}
          <div className="mt-6 space-y-6">
            {sections.map((section) => (
              <div
                key={section.title}
                className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-lg shadow-rose-100/30 transition-all duration-500 hover:border-rose-200 hover:shadow-xl hover:shadow-rose-100/60 sm:p-8"
              >
                <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-rose-800 via-[#e0b46a] to-rose-800 transition-transform duration-500 group-hover:scale-x-100" />

                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-rose-50 to-rose-100 text-xl ring-1 ring-rose-100">
                    {section.icon}
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
                    <p className="text-xs text-gray-400">{section.items.length} details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {section.items.map(({ label, value, path }, idx) => {
                    const isDate = /date of birth/i.test(label);
                    const isDiet = path[path.length - 1] === 'diet';
                    const inputClass =
                      'w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 outline-none transition focus:border-rose-800 focus:ring-2 focus:ring-rose-800/20';
                    return (
                      <div
                        key={idx}
                        className={`rounded-2xl border p-4 transition-all duration-300 ${
                          isEditing
                            ? 'border-gray-200 bg-white'
                            : 'border-gray-100 bg-[#faf7f5] hover:-translate-y-0.5 hover:border-rose-200 hover:bg-rose-50/60'
                        }`}
                      >
                        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                          {label}
                        </span>
                        {isEditing ? (
                          isDiet ? (
                            <select
                              value={value || ''}
                              onChange={(e) => handleChange(path, e.target.value)}
                              className={inputClass}
                            >
                              <option value="">Select diet</option>
                              <option value="Veg">Veg</option>
                              <option value="Non Veg">Non Veg</option>
                            </select>
                          ) : (
                            <input
                              type={isDate ? 'date' : 'text'}
                              value={isDate ? String(value).slice(0, 10) : String(value)}
                              onChange={(e) => handleChange(path, e.target.value)}
                              className={inputClass}
                            />
                          )
                        ) : (
                          <span className="block break-words font-semibold text-gray-900">{formatValue(value)}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Myprofile;
