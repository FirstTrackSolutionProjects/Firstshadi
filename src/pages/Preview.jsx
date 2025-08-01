// src/pages/Preview.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const prettify = (str) =>
  str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .replace('Dob', 'Date of Birth');

const isFile = (v) => typeof File !== 'undefined' && v instanceof File;

const flatten = (data, path = '') => {
  const rows = [];

  if (
    data == null ||
    ['string', 'number', 'boolean'].includes(typeof data) ||
    isFile(data)
  ) {
    rows.push({
      label: prettify(path.trim()),
      value: isFile(data) ? data.name : data,
    });
    return rows;
  }

  if (Array.isArray(data)) {
    if (data.length && isFile(data[0])) return rows; // skip displaying file data in list
    data.forEach((item, i) => rows.push(...flatten(item, `${path} ${i + 1}`)));
    return rows;
  }

  Object.entries(data).forEach(([k, v]) =>
    rows.push(...flatten(v, `${path} ${prettify(k)}`))
  );
  return rows;
};

const Preview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [thumbs, setThumbs] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!state?.firstName) navigate('/box');
  }, [state, navigate]);

  useEffect(() => {
    // Create blob URLs for image previews
    const files = Array.isArray(state.photos) ? state.photos.filter(Boolean) : [];
    const urls = files.map((f) => URL.createObjectURL(f));
    setThumbs(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [state.photos]);

  if (!state?.firstName) return null;

  const handleConfirm = () => {
    if (saving) return; // prevent double clicks

    if (!window.FileReader) {
      alert('FileReader API is not supported in your browser.');
      return;
    }

    setSaving(true);

    const fileReaders = (state.photos || [])
      .filter(Boolean)
      .map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => {
              console.error('Error reading file', file.name);
              reject(new Error('File reading error'));
            };
            reader.readAsDataURL(file);
          })
      );

    Promise.all(fileReaders)
      .then((photoBase64List) => {
        const finalProfile = {
          ...state,
          photos: [], // Remove actual File objects
          uploadedImages: photoBase64List,
        };

        try {
          localStorage.setItem('myProfile', JSON.stringify(finalProfile));
          console.log('Profile saved to localStorage:', finalProfile);
          navigate('/myprofile');
        } catch (e) {
          if (e.name === 'QuotaExceededError') {
            alert(
              'Storage quota exceeded! Please remove some photos or use smaller images.'
            );
            console.error('QuotaExceededError:', e);
          } else {
            alert('Failed to save profile. Please try again.');
            console.error(e);
          }
          setSaving(false);
        }
      })
      .catch((error) => {
        console.error('Error processing files:', error);
        alert('Failed to save profile photos. Please try again.');
        setSaving(false);
      });
  };

  const rows = flatten({ ...state, photos: undefined });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-xl font-semibold text-center text-red-800 mb-6">
          Preview Your Profile
        </h1>

        {thumbs.length > 0 && (
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {thumbs.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Photo ${idx + 1}`}
                className="w-24 h-24 object-cover rounded border"
              />
            ))}
          </div>
        )}

        <div className="space-y-3 text-gray-800">
          {rows.map(({ label, value }, idx) =>
            value ? (
              <div key={idx} className="flex justify-between border-b pb-1">
                <span className="font-medium">{label}:</span>
                <span className="text-right ml-3 break-all">{String(value)}</span>
              </div>
            ) : null
          )}
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={() => navigate(-1)}
            className="w-1/2 py-2 rounded-full text-white bg-gray-600 hover:bg-gray-800"
            disabled={saving}
          >
            Edit
          </button>
          <button
            onClick={handleConfirm}
            className="w-1/2 py-2 rounded-full text-white bg-red-700 hover:bg-red-900 disabled:opacity-50"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Preview;
