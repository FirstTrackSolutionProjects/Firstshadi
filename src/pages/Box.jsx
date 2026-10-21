// src/pages/Box.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const profileOptions = [
  { label: 'Myself', emoji: '🙋' },
  { label: 'My Son', emoji: '👦' },
  { label: 'My Daughter', emoji: '👧' },
  { label: 'My Brother', emoji: '👨' },
  { label: 'My Sister', emoji: '👩' },
  { label: 'My Friend', emoji: '🤝' },
  { label: 'My Relative', emoji: '👪' },
];

const genderOptions = [
  { label: 'Male', emoji: '👨' },
  { label: 'Female', emoji: '👩' },
];

const profilesWithGender = ['Myself', 'My Relative', 'My Friend'];

const CheckBadge = () => (
  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-700 text-white ring-2 ring-white">
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </span>
);

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const Box = () => {
  const [profileFor, setProfileFor] = useState('');
  const [gender, setGender] = useState('');
  const navigate = useNavigate();

  const showGender = profilesWithGender.includes(profileFor);
  const isFormComplete = Boolean(showGender ? profileFor && gender : profileFor);

  const handleContinue = () => {
    if (isFormComplete) {
      navigate('/boxsc', { state: { profileFor, gender } }); // navigate to Boxsc instead of Preview
    }
  };

  const handleSelectProfile = (opt) => {
    setProfileFor(opt);
    if (!profilesWithGender.includes(opt)) setGender('');
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-red-50 px-4 py-10">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-2xl shadow-red-100 overflow-hidden">
          {/* LEFT: HERO IMAGE */}
          <div className="relative h-56 sm:h-72 md:h-auto min-h-[260px]">
            <img
              src="/image/s18.jpg"
              alt="Happy couple"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-red-950/85 via-red-900/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
              <span className="inline-block mb-3 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-semibold">
                Create your profile
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">Find your perfect match</h1>
              <p className="mt-2 text-sm md:text-base text-white/85 max-w-sm">
                Tell us who this profile is for, and we'll guide you through the rest.
              </p>
            </div>
          </div>

          {/* RIGHT: FORM */}
          <div className="p-6 sm:p-8 md:p-10 flex flex-col">
            <h2 className="text-xl font-bold text-red-800">This Profile is for</h2>
            <p className="text-sm text-gray-500 mt-1">Choose one option to continue.</p>

            <div role="radiogroup" aria-label="This profile is for" className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {profileOptions.map(({ label, emoji }) => {
                const selected = profileFor === label;
                return (
                  <button
                    key={label}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => handleSelectProfile(label)}
                    className={`relative flex flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-4 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                      selected
                        ? 'border-red-700 bg-red-50 text-red-800 shadow-md shadow-red-100 -translate-y-0.5'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-red-300 hover:bg-red-50/50 hover:-translate-y-0.5'
                    }`}
                  >
                    {selected && <CheckBadge />}
                    <span className="text-2xl leading-none" aria-hidden="true">{emoji}</span>
                    {label}
                  </button>
                );
              })}
            </div>

            {/* GENDER (slides open for Myself / My Relative / My Friend) */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-out ${
                showGender ? 'max-h-48 opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'
              }`}
              aria-hidden={!showGender}
            >
              <h3 className="text-base font-bold text-red-800 mb-3">Gender</h3>
              <div role="radiogroup" aria-label="Gender" className="grid grid-cols-2 gap-3 p-1">
                {genderOptions.map(({ label, emoji }) => {
                  const selected = gender === label;
                  return (
                    <button
                      key={label}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      tabIndex={showGender ? 0 : -1}
                      onClick={() => setGender(label)}
                      className={`relative flex items-center justify-center gap-2 rounded-2xl border-2 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                        selected
                          ? 'border-red-700 bg-red-50 text-red-800 shadow-md shadow-red-100'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-red-300 hover:bg-red-50/50'
                      }`}
                    >
                      {selected && <CheckBadge />}
                      <span className="text-lg leading-none" aria-hidden="true">{emoji}</span>
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SUMMARY */}
            <div className="mt-6 min-h-[44px] flex items-center">
              {profileFor ? (
                <p className="text-sm text-gray-600 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 w-full">
                  Creating profile for{' '}
                  <span className="font-semibold text-red-800">{profileFor}</span>
                  {gender && (
                    <>
                      {' '}·{' '}
                      <span className="font-semibold text-red-800">{gender}</span>
                    </>
                  )}
                </p>
              ) : (
                <p className="text-sm text-gray-400 px-1">Nothing selected yet.</p>
              )}
            </div>

            {/* ACTIONS */}
            <div className="mt-auto pt-6 flex gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-full border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 hover:border-gray-400 transition"
              >
                <BackIcon /> Back
              </button>
              <button
                type="button"
                onClick={handleContinue}
                disabled={!isFormComplete}
                className={`flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-full font-semibold text-white transition-all ${
                  isFormComplete
                    ? 'bg-gradient-to-r from-red-700 to-red-900 shadow-lg shadow-red-200 hover:shadow-xl hover:-translate-y-0.5'
                    : 'bg-red-400 cursor-not-allowed opacity-50'
                }`}
              >
                Continue <ArrowIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Box;