// src/pages/Preview.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { UserCircleIcon, ArrowUturnLeftIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { profileService } from '../services/profileService';

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
    if (data.length && isFile(data[0])) return rows;
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
  const [error, setError] = useState('');

  useEffect(() => {
    if (!state?.firstName) navigate('/box');
  }, [state, navigate]);

  useEffect(() => {
    if (state?.photos) {
      const files = Array.isArray(state.photos) ? state.photos.filter(Boolean) : [];
      const urls = files.map((f) => URL.createObjectURL(f));
      setThumbs(urls);
      return () => urls.forEach((u) => URL.revokeObjectURL(u));
    }
  }, [state?.photos]);

  if (!state?.firstName) return null;

  const handleConfirm = async () => {
    if (saving) return;
    setSaving(true);
    setError('');

    try {
      // Build the payload expected by backend Profile.create
      // Backend uses snake_case field names.
      const s = state;

      const payload = {
        first_name: s.firstName,
        last_name: s.lastName || '',
        dob: s.dob || s.dateOfBirth || null,
        religion: s.religion || null,
        community: s.community || null,
        caste: s.caste || null,
        mother_tongue: s.motherTongue || null,
        marital_status: s.maritalStatus || 'Never Married',
        height: s.height || null,
        weight: s.weight || null,
        body_shape: s.bodyShape || null,
        face_color: s.faceColor || null,
        blood_group: s.bloodGroup || null,
        zodiac: s.rashifal || null,
        manglik: s.manglik || null,
        country: s.country || null,
        state: s.state || null,
        city: s.city || null,
        current_address: s.currentAddress || null,
        permanent_address: s.permanentAddress || null,
        birth_place: s.birthPlace || null,
        education: s.degree || null,
        employed_in: s.employedIn || null,
        occupation: s.occupation || null,
        annual_income: s.income || null,
        hobbies: s.hobby || null,
        about_me: s.about || null,
        favorite_color: s.favoriteColor || null,
        favorite_song: s.favoriteSong || null,
        favorite_movies: s.favoriteMovies || null,
        looking_for: s.gender === 'Male' ? 'Woman' : 'Man',
        profile_for: s.profileFor || 'Myself',
      };

      // 1. Create profile
      const createRes = await profileService.createProfile(payload);

      if (!createRes.success) {
        // If profile already exists, update it instead
        const updateRes = await profileService.updateProfile(payload);
        if (!updateRes.success) {
          throw new Error(updateRes.message || 'Failed to save profile');
        }
      }

      // 2. Upload photos (if any)
      const files = (state.photos || []).filter(Boolean);
      if (files.length > 0) {
        const uploadRes = await profileService.uploadPhotos(files);
        if (!uploadRes.success) {
          console.warn('Photos upload failed:', uploadRes.message);
        }
      }

      // 3. Save family members — (backend model supports family_members on Profile,
      //    but if you want to persist them separately you'd add a controller.
      //    For now we skip if not implemented server-side.)
      // if (state.family) { ... }

      navigate('/myprofile');
    } catch (e) {
      console.error(e);
      setError(e.message || 'Failed to save profile. Please try again.');
      setSaving(false);
    }
  };

  const rows = flatten({ ...state, photos: undefined });

  return (
    <div>
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-10">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200/60 w-full max-w-2xl">
          <div className="flex flex-col items-center text-center mb-8">
            <UserCircleIcon className="h-16 w-16 text-indigo-500 mb-3" />
            <h1 className="text-3xl font-bold text-slate-800">Confirm Your Profile</h1>
            <p className="text-slate-500 mt-2">Please review your information below before saving.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm">{error}</div>
          )}

          {thumbs.length > 0 && (
            <>
              <div className="border-t border-slate-200 my-6"></div>
              <h2 className="text-lg font-semibold text-slate-700 mb-4">Your Photos</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-8">
                {thumbs.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`Photo Preview ${idx + 1}`}
                    className="w-full h-24 object-cover rounded-lg shadow-md border border-slate-200"
                  />
                ))}
              </div>
            </>
          )}

          <div className="border-t border-slate-200 my-6"></div>
          <div className="space-y-4">
            {rows.map(({ label, value }, idx) =>
              value ? (
                <div key={idx} className="grid grid-cols-3 gap-4 items-start">
                  <span className="col-span-1 font-medium text-slate-500">{label}:</span>
                  <span className="col-span-2 font-semibold text-slate-800 break-words">{String(value)}</span>
                </div>
              ) : null
            )}
          </div>

          <div className="border-t border-slate-200 mt-8 pt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-full sm:w-1/2 py-3 px-4 rounded-lg text-slate-700 font-semibold border border-slate-300 hover:bg-slate-100 transition-colors disabled:opacity-50"
              disabled={saving}
            >
              <ArrowUturnLeftIcon className="h-5 w-5 mr-2" />
              Back
            </button>
            <button
              onClick={handleConfirm}
              className="flex items-center justify-center w-full sm:w-1/2 py-3 px-4 rounded-lg text-white font-semibold bg-red-800 hover:bg-red-900 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed"
              disabled={saving}
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Save & Continue
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Preview;














// // src/pages/Preview.jsx
// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import Footer from '../components/Footer';
// import { UserCircleIcon, ArrowUturnLeftIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

// // Helper function to format field labels nicely
// const prettify = (str) =>
//   str
//     .replace(/([A-Z])/g, ' $1')
//     .replace(/^./, (c) => c.toUpperCase())
//     .replace('Dob', 'Date of Birth');

// // Helper to check if a value is a File object
// const isFile = (v) => typeof File !== 'undefined' && v instanceof File;

// // Flattens the nested state object into an array of { label, value } for rendering
// const flatten = (data, path = '') => {
//   const rows = [];

//   if (
//     data == null ||
//     ['string', 'number', 'boolean'].includes(typeof data) ||
//     isFile(data)
//   ) {
//     rows.push({
//       label: prettify(path.trim()),
//       value: isFile(data) ? data.name : data,
//     });
//     return rows;
//   }

//   if (Array.isArray(data)) {
//     if (data.length && isFile(data[0])) return rows; // skip displaying file data
//     data.forEach((item, i) => rows.push(...flatten(item, `${path} ${i + 1}`)));
//     return rows;
//   }

//   Object.entries(data).forEach(([k, v]) =>
//     rows.push(...flatten(v, `${path} ${prettify(k)}`))
//   );
//   return rows;
// };


// const Preview = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const [thumbs, setThumbs] = useState([]);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     // Redirect if no state is passed
//     if (!state?.firstName) navigate('/box');
//   }, [state, navigate]);

//   useEffect(() => {
//     // Create blob URLs for image previews
//     if (state?.photos) {
//       const files = Array.isArray(state.photos) ? state.photos.filter(Boolean) : [];
//       const urls = files.map((f) => URL.createObjectURL(f));
//       setThumbs(urls);
//       // Clean up blob URLs on component unmount
//       return () => urls.forEach((u) => URL.revokeObjectURL(u));
//     }
//   }, [state?.photos]);

//   if (!state?.firstName) return null;

//   const handleConfirm = () => {
//     if (saving) return; // Prevent double clicks

//     if (!window.FileReader) {
//       alert('Your browser does not support the FileReader API.');
//       return;
//     }

//     setSaving(true);

//     const fileReaders = (state.photos || [])
//       .filter(Boolean)
//       .map(
//         (file) =>
//           new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onload = () => resolve(reader.result);
//             reader.onerror = () => {
//               console.error('Error reading file', file.name);
//               reject(new Error('File reading error'));
//             };
//             reader.readAsDataURL(file);
//           })
//       );

//     Promise.all(fileReaders)
//       .then((photoBase64List) => {
//         const finalProfile = {
//           ...state,
//           photos: [], // Remove File objects to avoid serialization issues
//           uploadedImages: photoBase64List,
//         };

//         try {
//           localStorage.setItem('myProfile', JSON.stringify(finalProfile));
//           console.log('Profile saved to localStorage:', finalProfile);
//           navigate('/myprofile');
//         } catch (e) {
//           if (e.name === 'QuotaExceededError') {
//             alert(
//               'Storage quota exceeded! Please remove some photos or use smaller images.'
//             );
//             console.error('QuotaExceededError:', e);
//           } else {
//             alert('Failed to save profile. Please try again.');
//             console.error(e);
//           }
//           setSaving(false);
//         }
//       })
//       .catch((error) => {
//         console.error('Error processing files:', error);
//         alert('Failed to save profile photos. Please try again.');
//         setSaving(false);
//       });
//   };

//   const rows = flatten({ ...state, photos: undefined });

//   return (

//     <div>
//     <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-10">
//       <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200/60 w-full max-w-2xl">

//         {/* Header */}
//         <div className="flex flex-col items-center text-center mb-8">
//           <UserCircleIcon className="h-16 w-16 text-indigo-500 mb-3" />
//           <h1 className="text-3xl font-bold text-slate-800">Confirm Your Profile</h1>
//           <p className="text-slate-500 mt-2">Please review your information below before saving.</p>
//         </div>

//         {/* Photo Gallery */}
//         {thumbs.length > 0 && (
//           <>
//             <div className="border-t border-slate-200 my-6"></div>
//             <h2 className="text-lg font-semibold text-slate-700 mb-4">Your Photos</h2>
//             <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-8">
//               {thumbs.map((src, idx) => (
//                 <img
//                   key={idx}
//                   src={src}
//                   alt={`Photo Preview ${idx + 1}`}
//                   className="w-full h-24 object-cover rounded-lg shadow-md border border-slate-200 hover:opacity-90 transition-opacity"
//                 />
//               ))}
//             </div>
//           </>
//         )}

//         {/* Details Section */}
//         <div className="border-t border-slate-200 my-6"></div>
//         <div className="space-y-4">
//           {rows.map(({ label, value }, idx) =>
//             value ? (
//               <div key={idx} className="grid grid-cols-3 gap-4 items-start">
//                 <span className="col-span-1 font-medium text-slate-500">{label}:</span>
//                 <span className="col-span-2 font-semibold text-slate-800 break-words">{String(value)}</span>
//               </div>
//             ) : null
//           )}
//         </div>

//         {/* Action Buttons */}
//         <div className="border-t border-slate-200 mt-8 pt-6 flex flex-col sm:flex-row gap-4">
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center justify-center w-full sm:w-1/2 py-3 px-4 rounded-lg text-slate-700 font-semibold border border-slate-300 hover:bg-slate-100 transition-colors disabled:opacity-50"
//             disabled={saving}
//           >
//             <ArrowUturnLeftIcon className="h-5 w-5 mr-2" />
//             Back
//           </button>
//           <button
//             onClick={handleConfirm}
//             className="flex items-center justify-center w-full sm:w-1/2 py-3 px-4 rounded-lg text-white font-semibold bg-red-800 hover:bg-red-900 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed"
//             disabled={saving}
//           >
//             {saving ? (
//               <>
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Saving...
//               </>
//             ) : (
//               <>
//                 <CheckCircleIcon className="h-5 w-5 mr-2" />
//                 Save & Continue
//               </>
//             )}
//           </button>
//         </div>
//       </div>
     
//     </div>

//  <Footer />

//     </div>
//   );
// };

// export default Preview;