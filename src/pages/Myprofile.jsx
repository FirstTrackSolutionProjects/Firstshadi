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
      <div className="min-h-screen bg-slate-100 flex items-center justify-center font-sans">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-slate-700">Loading Profile...</h2>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center font-sans">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-slate-700">{error || 'No profile yet'}</h2>
          <a href="/box" className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded">
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

  const filled = rows.filter((r) => r.value !== null && r.value !== undefined && String(r.value).trim() !== '').length;
  const completeness = rows.length ? Math.round((filled / rows.length) * 100) : 0;

  const chips = [
    displayProfile.age ? `${displayProfile.age} yrs` : null,
    displayProfile.religion,
    displayProfile.city,
  ].filter(Boolean);

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-pink-50/40 font-sans px-4 pb-16">
        <div className="mx-auto w-full max-w-4xl pt-8">
          {/* HERO CARD */}
          <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/60 overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 relative">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_60%,white,transparent_35%)]" />
            </div>

            <div className="px-6 sm:px-10 pb-8">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16">
                <div className="relative self-center sm:self-auto">
                  <img
                    src={displayProfile.profile_photos?.[0] || 'https://placehold.co/200x200/e2e8f0/475569?text=Photo'}
                    alt="Profile"
                    className="w-32 h-32 sm:w-36 sm:h-36 object-cover rounded-full ring-4 ring-white shadow-lg bg-white"
                  />
                  {isEditing && (
                    <button
                      onClick={handleImageClick}
                      className="absolute bottom-1 right-1 bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center ring-4 ring-white hover:bg-indigo-700 transition"
                      title="Change profile image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                    </button>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </div>

                <div className="flex-grow text-center sm:text-left sm:pb-2">
                  <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">{profileName}</h1>
                  {displayProfile.email && <p className="text-slate-500 mt-1">{displayProfile.email}</p>}
                  {chips.length > 0 && (
                    <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
                      {chips.map((c, i) => (
                        <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-center gap-2 sm:pb-2">
                  {isEditing ? (
                    <>
                      <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold shadow-md shadow-emerald-200 hover:bg-emerald-600 transition disabled:opacity-50">
                        <SaveIcon /> {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button onClick={handleCancel} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition">
                        <CancelIcon /> Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={handleEdit} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5 transition">
                        <EditIcon /> Edit Profile
                      </button>
                      <button onClick={handleDelete} title="Delete profile" className="flex items-center px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition">
                        <DeleteIcon />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* COMPLETENESS */}
              <div className="mt-8">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-semibold text-slate-700">Profile completeness</span>
                  <span className="font-bold text-indigo-600">{completeness}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 transition-all duration-700"
                    style={{ width: `${completeness}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTIONS */}
          <div className="mt-6 space-y-6">
            {sections.map((section) => (
              <div key={section.title} className="bg-white rounded-3xl shadow-lg shadow-slate-200/60 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-lg">{section.icon}</span>
                  <h2 className="text-lg font-bold text-slate-800">{section.title}</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {section.items.map(({ label, value, path }, idx) => {
                    const isDate = /date of birth/i.test(label);
                    return (
                      <div
                        key={idx}
                        className={`rounded-2xl p-4 border transition ${
                          isEditing
                            ? 'bg-white border-slate-200'
                            : 'bg-slate-50/70 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40'
                        }`}
                      >
                        <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                          {label}
                        </span>
                        {isEditing ? (
                          <input
                            type={isDate ? 'date' : 'text'}
                            value={isDate ? String(value).slice(0, 10) : String(value)}
                            onChange={(e) => handleChange(path, e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                          />
                        ) : (
                          <span className="block text-slate-800 font-semibold break-words">
                            {formatValue(value)}
                          </span>
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