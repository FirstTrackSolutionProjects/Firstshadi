import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

// Format keys for display
const prettify = (str) =>
  str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .replace('Dob', 'Date of Birth');

// Flatten nested object to label-value pairs for display/edit
const flatten = (data, path = '') => {
  const rows = [];
  if (data == null || ['string', 'number', 'boolean'].includes(typeof data)) {
    rows.push({ label: prettify(path.trim()), value: data });
    return rows;
  }
  if (Array.isArray(data)) {
    data.forEach((item, i) => rows.push(...flatten(item, `${path} ${i + 1}`)));
    return rows;
  }
  Object.entries(data).forEach(([k, v]) =>
    rows.push(...flatten(v, `${path} ${prettify(k)}`))
  );
  return rows;
};

const Myprofile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem('myProfile');
    if (stored) {
      const parsed = JSON.parse(stored);
      setProfile(parsed);
      setEditedProfile(parsed);
    }
  }, []);

  const handleDelete = () => {
    if (!window.confirm('Are you sure you want to delete your profile?')) return;
    localStorage.removeItem('myProfile');
    const saved = JSON.parse(localStorage.getItem('savedConnections') || '[]');
    const filtered = saved.filter((p) =>
      p.email && profile?.email
        ? p.email !== profile.email
        : JSON.stringify(p) !== JSON.stringify(profile)
    );
    localStorage.setItem('savedConnections', JSON.stringify(filtered));
    navigate('/');
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    localStorage.setItem('myProfile', JSON.stringify(editedProfile));
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  // Update nested editedProfile state by flat label
  const handleChange = (label, value) => {
    const updated = { ...editedProfile };
    const keys = label
      .split(' ')
      .map((k) => k.trim().toLowerCase())
      .filter((k) => k.length > 0);
    let current = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setEditedProfile(updated);
  };

  const handleImageClick = () => {
    if (isEditing && fileInputRef.current) fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const newImg = reader.result;
      const imgs = [...(editedProfile.uploadedImages || [])];
      imgs[0] = newImg;
      const updated = { ...editedProfile, uploadedImages: imgs };
      setEditedProfile(updated);
      if (!isEditing) {
        setProfile(updated);
        localStorage.setItem('myProfile', JSON.stringify(updated));
      }
    };
    reader.readAsDataURL(file);
  };

  // Save entire profile object into savedConnections (deduplicate by email if exists)
  const handleSaveToConnect = () => {
    if (!profile) return;

    const saved = JSON.parse(localStorage.getItem('savedConnections') || '[]');

    // Check duplicate by email or full JSON string match
    const exists = profile.email
      ? saved.some((p) => p.email === profile.email)
      : saved.some((p) => JSON.stringify(p) === JSON.stringify(profile));

    if (exists) {
      alert('Profile already saved to connect.');
      return;
    }

    saved.push(profile);
    localStorage.setItem('savedConnections', JSON.stringify(saved));
    alert('Profile saved to connect successfully.');
    window.dispatchEvent(new Event('connections-updated'));
    navigate('/connections'); // Navigate to connections list page
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-6">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-lg font-semibold text-red-800">No Profile Found</h2>
        </div>
      </div>
    );
  }

  const displayProfile = isEditing ? editedProfile : profile;
  const rows = flatten({ ...displayProfile, uploadedImages: undefined });

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 px-4 py-6">
      <div className="p-4 rounded-lg shadow-lg w-full max-w-md bg-[#FBF5DE]">
        <div className="flex justify-center mb-3 relative">
          <img
            src={displayProfile.uploadedImages?.[0] || '/default-avatar.png'}
            alt="Profile"
            className="w-28 h-28 object-cover rounded-full border-4 border-red-400 shadow cursor-pointer"
            onClick={handleImageClick}
            title={isEditing ? 'Click to change profile image' : ''}
            style={{ touchAction: 'manipulation' }}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <h1 className="text-lg font-bold text-center text-red-800 mb-3">
          My Profile
        </h1>

        {displayProfile.uploadedImages?.length > 1 && (
          <div className="flex flex-wrap gap-2 justify-center mb-3">
            {displayProfile.uploadedImages.slice(1).map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Photo ${idx + 2}`}
                className="w-14 h-14 object-cover rounded-full border border-gray-300"
              />
            ))}
          </div>
        )}

        <div className="bg-red-100 p-3 rounded-lg shadow-inner space-y-2 text-sm">
          {rows.map(({ label, value }, idx) =>
            value !== null && value !== undefined ? (
              <div
                key={idx}
                className="flex justify-between items-start border-b border-dashed pb-1"
              >
                <span className="font-medium text-gray-700">{label}:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={String(value)}
                    onChange={(e) => handleChange(label, e.target.value)}
                    className="ml-3 p-1 border rounded text-gray-800 w-1/2"
                  />
                ) : (
                  <span className="text-right ml-3 text-gray-800 break-words">
                    {String(value)}
                  </span>
                )}
              </div>
            ) : null
          )}
        </div>

        <div className="mt-5 text-center flex flex-wrap justify-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-full bg-green-600 text-white hover:bg-green-800 text-sm transition-all active:scale-95"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-5 py-2 rounded-full bg-gray-600 text-white hover:bg-gray-800 text-sm transition-all active:scale-95"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEdit}
                className="px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-800 text-sm transition-all active:scale-95"
              >
                Edit Profile
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 rounded-full bg-red-600 text-white hover:bg-red-800 text-sm transition-all active:scale-95"
              >
                Delete Profile
              </button>
              <button
                onClick={handleSaveToConnect}
                className="px-5 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-800 text-sm transition-all active:scale-95"
              >
                Save to Connect
              </button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Myprofile;
