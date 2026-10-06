import React, { useEffect, useRef, useState } from 'react';
import Footer from '../components/Footer';
import { profileService } from '../services/profileService';

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

const prettify = (str) =>
  str.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()).replace('Dob', 'Date of Birth');

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
    if (k !== 'profile_photos' && k !== 'family_members') {
      rows.push(...flatten(v, `${prefix} ${prettify(k)}`, [...path, k]));
    }
  });
  return rows;
};

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
  const profileName = [displayProfile.first_name, displayProfile.last_name].filter(Boolean).join(' ') || 'My Profile';

  return (
    <div>
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 transition-all">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
            <div className="relative mb-4 sm:mb-0 sm:mr-6">
              <img
                src={displayProfile.profile_photos?.[0] || 'https://placehold.co/200x200/e2e8f0/475569?text=Photo'}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md"
              />
              {isEditing && (
                <button
                  onClick={handleImageClick}
                  className="absolute bottom-0 right-0 bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center border-4 border-white hover:bg-indigo-700 transition"
                  title="Change profile image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h3"/><path d="m17.5 9.5-2.2-2.2c-.4-.4-1-.4-1.4 0L5.5 15.7c-.2.2-.3.4-.3.7v2.8c0 .3.3.5.5.5h2.8c.3 0 .5-.1.7-.3l8.4-8.4c.4-.4.4-1 0-1.4Z"/></svg>
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>
            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-slate-800">{profileName}</h1>
              <p className="text-slate-500 mt-1">{displayProfile.email || ''}</p>
              <div className="mt-4 flex justify-center sm:justify-start space-x-2">
                {isEditing ? (
                  <>
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition disabled:opacity-50">
                      <SaveIcon /> {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={handleCancel} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-500 text-white text-sm font-semibold hover:bg-slate-600 transition">
                      <CancelIcon /> Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={handleEdit} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition">
                      <EditIcon /> Edit Profile
                    </button>
                    <button onClick={handleDelete} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-transparent text-slate-500 text-sm font-semibold hover:bg-red-50 hover:text-red-600 transition">
                      <DeleteIcon />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <hr className="my-8 border-slate-200" />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-700 mb-4">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              {rows.map(({ label, value, path }, idx) =>
                value !== null && value !== undefined ? (
                  <div key={idx} className="flex flex-col">
                    <span className="text-sm font-medium text-slate-500 mb-1">{label}</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={String(value)}
                        onChange={(e) => handleChange(path, e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-md text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      />
                    ) : (
                      <span className="text-slate-800 font-semibold text-base break-words">
                        {String(value)}
                      </span>
                    )}
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Myprofile;