// src/pages/Sol.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CakeIcon, UsersIcon, HeartIcon, ChatBubbleLeftRightIcon, BriefcaseIcon,
  AcademicCapIcon, XMarkIcon, CheckCircleIcon, PlusCircleIcon, PhotoIcon,
  MagnifyingGlassIcon, MapPinIcon, CurrencyRupeeIcon,
  EyeIcon, DevicePhoneMobileIcon, ChevronLeftIcon, ChevronRightIcon,
  StarIcon, LockClosedIcon, FilmIcon, MusicalNoteIcon, SparklesIcon,
  PaintBrushIcon, ChevronDownIcon, CheckIcon
} from '@heroicons/react/24/solid';
import Footer from '../components/Footer';
import { profileService } from '../services/profileService';
import { connectionService } from '../services/connectionService';

const casteOptions = [
  "Brahmin", "Rajput", "Kayastha", "Yadav", "Kurmi", "Teli", "Agarwal", "Jat",
  "Kshatriya", "Vaishya", "Baniya", "Gupta", "Kumar", "Thakur", "Chamar", "Nai",
  "Lohar", "Kumbhar", "Bania", "Bhumihar", "Sahu", "Mali", "Kahar", "Vishwakarma",
  "Soni", "Kushwaha", "Sonar", "Bairagi", "SC", "ST", "OBC", "General", "Muslim",
  "Ansari", "Sheikh", "Pathan", "Syed", "Qureshi", "Khan", "Christian", "Sikh",
  "Patel", "Other"
];

const CrownIcon = (props) => (
  <svg width="48" height="48" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="crown-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#FFD700' }} />
        <stop offset="100%" style={{ stopColor: '#FDB813' }} />
      </linearGradient>
    </defs>
    <g>
      <path d="M10 30 L15 70 L85 70 L90 30 L65 50 L50 30 L35 50 Z" fill="url(#crown-gradient)" />
      <circle cx="25" cy="45" r="5" fill="#FFF700" />
      <circle cx="50" cy="40" r="5" fill="#FFF700" />
      <circle cx="75" cy="45" r="5" fill="#FFF700" />
      <rect x="15" y="75" width="70" height="5" fill="url(#crown-gradient)" />
    </g>
  </svg>
);

const Diamond = () => (
  <div className="flex items-center justify-center gap-3">
    <span className="h-px w-14 bg-gradient-to-r from-transparent to-[#e0b46a]" />
    <span className="h-1.5 w-1.5 rotate-45 bg-[#e0b46a]" />
    <span className="h-px w-14 bg-gradient-to-l from-transparent to-[#e0b46a]" />
  </div>
);

/* ------------------------------ MODALS ------------------------------ */

const GalleryModal = ({ images, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const goToPrevious = (e) => { e.stopPropagation(); setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1)); };
  const goToNext = (e) => { e.stopPropagation(); setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1)); };

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!images || images.length === 0) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="relative flex h-full w-full items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25 transition hover:bg-rose-800"
          onClick={onClose}
          aria-label="Close"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        {images.length > 1 && (
          <button
            onClick={goToPrevious}
            aria-label="Previous"
            className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25 transition hover:bg-rose-800"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
        )}
        {images.length > 1 && (
          <button
            onClick={goToNext}
            aria-label="Next"
            className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25 transition hover:bg-rose-800"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        )}
        <div className="relative flex h-full max-h-[90vh] w-auto items-center">
          <img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Profile ${currentIndex + 1}`}
            className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl ring-2 ring-[#e0b46a]/50"
          />
        </div>
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-black/50 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-[#faf7f5] p-3.5">
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-50 to-rose-100 text-rose-800 ring-1 ring-rose-100">
      {icon}
    </span>
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
      <p className="break-words font-semibold text-gray-900">{value || '—'}</p>
    </div>
  </div>
);

const SectionTitle = ({ children }) => (
  <h3 className="mb-4 flex items-center gap-2.5 font-display text-lg font-bold text-gray-900">
    <span className="h-2 w-2 rotate-45 bg-[#e0b46a]" />
    {children}
  </h3>
);

const ProfileModal = ({ user, onClose, openGallery }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!user) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-28 bg-gradient-to-br from-rose-800 via-rose-800 to-rose-900">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-800 via-[#e0b46a] to-rose-800" />
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 pb-8 sm:px-8">
          <div className="-mt-14 mb-6 flex flex-col items-center text-center">
            <div className="relative">
              <div className="rounded-full bg-gradient-to-br from-rose-800 via-[#e0b46a] to-rose-800 p-1.5 shadow-lg">
                <img
                  src={user.profile_photos?.[0] || 'https://placehold.co/200x200/9f1239/ffffff?text=Photo'}
                  alt={user.first_name}
                  onClick={() => openGallery(user.profile_photos || [])}
                  className="h-28 w-28 cursor-pointer rounded-full border-4 border-white bg-white object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              {user.is_premium && (
                <div className="absolute -right-3 -top-3 rotate-12">
                  <CrownIcon className="h-9 w-9" />
                </div>
              )}
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold text-gray-900">
              {user.first_name} <span className="italic text-rose-800">{user.last_name}</span>
            </h2>
            <p className="mt-1 text-sm text-gray-500">A complete profile overview.</p>
            <div className="mt-3"><Diamond /></div>
          </div>

          <div className="space-y-8">
            <div>
              <SectionTitle>Personal Details</SectionTitle>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <DetailItem icon={<CakeIcon className="h-5 w-5" />} label="Age" value={user.age ? `${user.age} Years` : null} />
                <DetailItem icon={<HeartIcon className="h-5 w-5" />} label="Religion" value={user.religion} />
                <DetailItem icon={<AcademicCapIcon className="h-5 w-5" />} label="Caste" value={user.caste} />
                <DetailItem icon={<ChatBubbleLeftRightIcon className="h-5 w-5" />} label="Mother Tongue" value={user.mother_tongue} />
                <DetailItem icon={<SparklesIcon className="h-5 w-5" />} label="Zodiac" value={user.zodiac} />
                <DetailItem icon={<SparklesIcon className="h-5 w-5" />} label="Manglik" value={user.manglik} />
              </div>
            </div>
            <div>
              <SectionTitle>Professional Details</SectionTitle>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <DetailItem icon={<BriefcaseIcon className="h-5 w-5" />} label="Occupation" value={user.occupation} />
                <DetailItem icon={<CurrencyRupeeIcon className="h-5 w-5" />} label="Annual Income" value={user.annual_income} />
              </div>
            </div>
            <div>
              <SectionTitle>Location</SectionTitle>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <DetailItem icon={<MapPinIcon className="h-5 w-5" />} label="City" value={user.city} />
                <DetailItem icon={<MapPinIcon className="h-5 w-5" />} label="State" value={user.state} />
              </div>
            </div>
            <div>
              <SectionTitle>Preferences & Interests</SectionTitle>
              <div className="grid grid-cols-1 gap-3">
                <DetailItem icon={<FilmIcon className="h-5 w-5" />} label="Favorite Movies" value={user.favorite_movies} />
                <DetailItem icon={<MusicalNoteIcon className="h-5 w-5" />} label="Favorite Song" value={user.favorite_song} />
                <DetailItem icon={<PaintBrushIcon className="h-5 w-5" />} label="Favorite Color" value={user.favorite_color} />
                {user.hobbies && (
                  <div className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-[#faf7f5] p-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-50 to-rose-100 text-rose-800 ring-1 ring-rose-100">
                      <PhotoIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Hobbies</p>
                      <div className="mt-1.5 flex flex-wrap gap-2">
                        {String(user.hobbies).split(',').map((hobby) => (
                          <span
                            key={hobby}
                            className="rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-800"
                          >
                            {hobby.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MembershipModal = ({ onClose, onJoinPremium }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-rose-800 via-rose-800 to-rose-900 p-8 pt-14 text-center text-white shadow-2xl ring-1 ring-[#e0b46a]/60"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-800 via-[#e0b46a] to-rose-800" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#e0b46a]/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-white/10 blur-3xl" />

        <button
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
          onClick={onClose}
          aria-label="Close"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <div className="relative">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white/15 text-[#f3d79e] ring-1 ring-white/30">
            <StarIcon className="h-10 w-10" />
          </div>
          <h2 className="font-display text-3xl font-bold">
            Unlock <span className="italic text-[#f3d79e]">Premium</span> Access
          </h2>
          <div className="my-4"><Diamond /></div>
          <p className="mb-8 text-white/75">
            Become a premium member to view contact details and connect with profiles directly.
          </p>
          <button
            onClick={onJoinPremium}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-rose-800 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-50 hover:shadow-xl"
          >
            <LockClosedIcon className="h-5 w-5" />
            <span>Join Premium Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------ MAIN ------------------------------ */

function Sol() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = location.state || {};

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestedUsers, setRequestedUsers] = useState(new Set());
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedCaste, setSelectedCaste] = useState('');
  const [isCasteMenuOpen, setIsCasteMenuOpen] = useState(false);
  const casteMenuRef = useRef(null);
  const [searchName, setSearchName] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showMembershipModal, setShowMembershipModal] = useState(false);

  const loadProfiles = async () => {
    setLoading(true); setError('');
    try {
      const filters = {};
      if (searchParams.gender) filters.gender = searchParams.gender;
      if (searchParams.minAge) filters.minAge = searchParams.minAge;
      if (searchParams.maxAge) filters.maxAge = searchParams.maxAge;
      if (searchParams.religion) filters.religion = searchParams.religion;
      if (searchParams.motherTongue) filters.mother_tongue = searchParams.motherTongue;
      if (selectedCaste) filters.caste = selectedCaste;
      if (searchName) filters.search_query = searchName;
      filters.limit = 50;

      const res = await profileService.searchProfiles(filters);
      if (res.success) {
        setProfiles(res.data.data || []);
      } else {
        setError(res.message || 'Failed to load profiles');
      }
    } catch (e) {
      setError(e.message || 'Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isCasteMenuOpen) return undefined;
    const closeOnOutsideClick = (event) => {
      if (casteMenuRef.current && !casteMenuRef.current.contains(event.target)) {
        setIsCasteMenuOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsCasteMenuOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isCasteMenuOpen]);

  useEffect(() => {
    (async () => {
      try {
        const res = await connectionService.getSentRequests();
        if (res.success) {
          setRequestedUsers(new Set((res.data || []).map((c) => c.to_user_uuid)));
        }
            } catch {
        // Silent
      }
    })();
  }, []);

  const handleRequest = async (user) => {
    try {
      const res = await connectionService.sendRequest(user.user_uuid || user.uuid);
      if (res.success) {
        setRequestedUsers((prev) => new Set(prev).add(user.user_uuid || user.uuid));
      } else {
        alert(res.message || 'Failed to send request');
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const openGallery = (images) => { setGalleryImages(images); setShowGalleryModal(true); };
  const closeGallery = () => { setShowGalleryModal(false); setGalleryImages([]); };
  const openProfileModal = (user) => { setSelectedUser(user); setShowProfileModal(true); };
  const closeProfileModal = () => { setShowProfileModal(false); setSelectedUser(null); };
  const formatPhoneNumber = (phone) => {
    if (!phone || phone.length < 5) return 'N/A';
    return `${phone.substring(0, 2)}XXXXX${phone.substring(phone.length - 3)}`;
  };
  const handlePhoneViewClick = () => setShowMembershipModal(true);
  const handleJoinPremium = () => { navigate('/memb'); setShowMembershipModal(false); };

  const filteredUsers = profiles.filter((user) => {
    const nameMatch = !searchName || `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase().includes(searchName.toLowerCase());
    const casteMatch = !selectedCaste || user.caste === selectedCaste;
    return nameMatch && casteMatch;
  });

  const hasFilters = searchName || selectedCaste;
  const clearFilters = () => { setSearchName(''); setSelectedCaste(''); };

  return (
    <div>
      <div className="relative overflow-hidden bg-[#faf7f5]">
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-rose-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#e0b46a]/15 blur-3xl" />

        <div className="container relative mx-auto min-h-screen px-4 py-16">
          {/* HEADER */}
          <div className="mb-12 text-center">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-800 shadow-sm">
              <HeartIcon className="h-3 w-3" />
              Browse Profiles
            </span>
            <h1 className="font-display text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Find Your <span className="italic text-rose-800">Soulmate</span>
            </h1>
            <div className="my-5"><Diamond /></div>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">
              Browse through profiles on our elegantly designed platform. Your journey to finding love starts now.
            </p>
          </div>

          {/* FILTER BAR */}
          <div className="relative z-30 mx-auto mb-12 flex max-w-3xl flex-col items-stretch gap-3 rounded-3xl border border-rose-100 bg-white/90 p-3 shadow-xl shadow-rose-100/60 backdrop-blur-md sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/70 py-3 pl-12 pr-4 text-gray-800 placeholder-gray-400 transition-all hover:border-rose-300 hover:bg-white focus:border-rose-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-800/20"
              />
            </div>

            <div className={`relative sm:w-64 ${isCasteMenuOpen ? 'z-50' : ''}`} ref={casteMenuRef}>
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isCasteMenuOpen}
                onClick={() => setIsCasteMenuOpen((open) => !open)}
                className={`flex w-full items-center justify-between rounded-2xl border bg-gray-50/70 px-4 py-3 text-left transition-all hover:border-rose-300 hover:bg-white focus:outline-none ${
                  isCasteMenuOpen ? 'border-rose-800 bg-white ring-2 ring-rose-800/20' : 'border-gray-200'
                }`}
              >
                <span className={selectedCaste ? 'font-medium text-gray-800' : 'text-gray-500'}>
                  {selectedCaste || 'All Castes'}
                </span>
                <ChevronDownIcon
                  className={`ml-3 h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${
                    isCasteMenuOpen ? 'rotate-180 text-rose-800' : ''
                  }`}
                />
              </button>
              {isCasteMenuOpen && (
                <div
                  role="listbox"
                  aria-label="Filter by caste"
                  className="absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-y-auto rounded-xl border border-gray-100 bg-white py-1.5 shadow-2xl ring-1 ring-black/5"
                >
                  <button
                    type="button"
                    role="option"
                    aria-selected={!selectedCaste}
                    onClick={() => { setSelectedCaste(''); setIsCasteMenuOpen(false); }}
                    className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors ${
                      !selectedCaste ? 'bg-rose-800 font-semibold text-white' : 'text-gray-700 hover:bg-rose-50 hover:text-rose-800'
                    }`}
                  >
                    All Castes
                    {!selectedCaste && <CheckIcon className="h-4 w-4" />}
                  </button>
                  {casteOptions.map((caste) => (
                    <button
                      type="button"
                      role="option"
                      aria-selected={selectedCaste === caste}
                      key={caste}
                      onClick={() => { setSelectedCaste(caste); setIsCasteMenuOpen(false); }}
                      className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors ${
                        selectedCaste === caste ? 'bg-rose-800 font-semibold text-white' : 'text-gray-700 hover:bg-rose-50 hover:text-rose-800'
                      }`}
                    >
                      {caste}
                      {selectedCaste === caste && <CheckIcon className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-all hover:border-rose-800 hover:bg-rose-50 hover:text-rose-800"
              >
                <XMarkIcon className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>

          {!loading && !error && filteredUsers.length > 0 && (
            <p className="mb-6 text-center text-sm font-medium text-gray-500">
              <span className="font-bold text-rose-800">{filteredUsers.length}</span>{' '}
              {filteredUsers.length === 1 ? 'profile' : 'profiles'} found
            </p>
          )}

          {/* CONTENT */}
          {loading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="animate-pulse overflow-hidden rounded-3xl border border-gray-200 bg-white">
                  <div className="h-80 bg-rose-100" />
                  <div className="space-y-3 p-6">
                    <div className="h-4 w-2/3 rounded bg-gray-200" />
                    <div className="h-3 w-1/2 rounded bg-gray-100" />
                    <div className="h-10 rounded-xl bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="mx-auto max-w-md rounded-3xl border border-rose-200 bg-white p-10 text-center shadow-lg shadow-rose-100/60">
              <p className="font-display text-xl font-bold text-gray-900">Something went wrong</p>
              <p className="mt-1 text-sm text-rose-800">{error}</p>
              <button
                onClick={loadProfiles}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-rose-800 px-6 py-2.5 font-semibold text-white shadow-lg shadow-rose-800/30 transition-all hover:-translate-y-0.5 hover:bg-rose-900"
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredUsers.map((user) => {
                const uid = user.user_uuid || user.uuid;
                const isRequested = requestedUsers.has(uid);
                const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
                const mainImage = user.profile_photos?.[0] || 'https://placehold.co/600x800/9f1239/ffffff?text=No+Photo';
                return (
                  <div
                    key={uid}
                    className="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white transition-all duration-500 hover:-translate-y-2 hover:border-rose-200 hover:shadow-2xl hover:shadow-rose-100"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={mainImage}
                        alt={fullName}
                        className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#3b0a18]/85 via-black/10 to-transparent" />
                      <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-rose-800 via-[#e0b46a] to-rose-800 transition-transform duration-500 group-hover:scale-x-100" />

                      {user.is_premium && (
                        <div className="absolute left-4 top-4 -rotate-12">
                          <CrownIcon className="h-8 w-8" />
                        </div>
                      )}

                      <div className="absolute right-4 top-4 flex items-center gap-2">
                        {user.profile_photos?.length > 1 && (
                          <button
                            onClick={() => openGallery(user.profile_photos)}
                            className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 py-1.5 pl-2.5 pr-3 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:bg-rose-800"
                          >
                            <PhotoIcon className="h-4 w-4" />
                            <span>{user.profile_photos.length} Photos</span>
                          </button>
                        )}
                        <button
                          onClick={() => openProfileModal(user)}
                          aria-label="View full profile"
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-rose-800 shadow-md backdrop-blur-sm transition-all hover:bg-rose-800 hover:text-white"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-2 p-5">
                        <div className="min-w-0">
                          <h2 className="truncate font-display text-2xl font-bold text-white">{fullName}</h2>
                          <p className="truncate text-sm font-medium text-[#f3d79e]">{user.occupation || ''}</p>
                        </div>
                        {user.is_premium && (
                          <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#e0b46a]/40 bg-black/50 px-3 py-1.5 backdrop-blur-md">
                            <CrownIcon className="h-5 w-5" />
                            <span className="text-xs font-bold text-[#f3d79e]">Premium</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-grow space-y-5 p-6">
                      <div className="grid grid-cols-4 gap-2 rounded-2xl border border-rose-100 bg-[#faf7f5] p-3 text-center">
                        {[
                          { icon: <CakeIcon className="h-5 w-5" />, value: user.age, label: 'Years' },
                          { icon: <MapPinIcon className="h-5 w-5" />, value: user.city, label: 'City' },
                          { icon: <HeartIcon className="h-5 w-5" />, value: user.religion, label: 'Religion' },
                          { icon: <AcademicCapIcon className="h-5 w-5" />, value: user.caste, label: 'Caste' },
                        ].map((s) => (
                          <div key={s.label} className="flex min-w-0 flex-col items-center">
                            <span className="mb-1 text-rose-800">{s.icon}</span>
                            <span className="w-full truncate text-sm font-semibold text-gray-900" title={s.value}>
                              {s.value || '—'}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider text-gray-400">{s.label}</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-center gap-3">
                          <ChatBubbleLeftRightIcon className="h-5 w-5 shrink-0 text-[#c9973f]" />
                          <p><span className="font-semibold text-gray-800">Speaks: </span>{user.mother_tongue || '—'}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <SparklesIcon className="h-5 w-5 shrink-0 text-[#c9973f]" />
                          <p><span className="font-semibold text-gray-800">Zodiac: </span>{user.zodiac || '—'}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <DevicePhoneMobileIcon className="h-5 w-5 shrink-0 text-[#c9973f]" />
                          <p className="flex-grow">
                            <span className="font-semibold text-gray-800">Phone: </span>
                            {formatPhoneNumber(user.phone || user.user_phone)}
                          </p>
                          <button
                            onClick={handlePhoneViewClick}
                            aria-label="View phone number"
                            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-rose-50 hover:text-rose-800"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pb-6">
                      <button
                        disabled={isRequested}
                        onClick={() => handleRequest(user)}
                        className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 font-semibold transition-all duration-300 ${
                          isRequested
                            ? 'cursor-not-allowed border border-rose-100 bg-rose-50 text-rose-800/60'
                            : 'bg-rose-800 text-white shadow-lg shadow-rose-800/30 hover:-translate-y-0.5 hover:bg-rose-900 hover:shadow-xl hover:shadow-rose-800/40 focus:outline-none focus:ring-4 focus:ring-rose-800/20'
                        }`}
                      >
                        {isRequested ? (
                          <><CheckCircleIcon className="h-5 w-5" /> Request Sent</>
                        ) : (
                          <><PlusCircleIcon className="h-5 w-5" /> Send Request</>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && !error && filteredUsers.length === 0 && (
            <div className="mx-auto max-w-lg rounded-3xl border border-dashed border-rose-200 bg-white p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100 text-rose-800 ring-1 ring-rose-100">
                <UsersIcon className="h-8 w-8" />
              </div>
              <h3 className="font-display text-2xl font-bold text-gray-900">No Profiles Found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your filters to discover more people.</p>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-rose-800 px-6 py-2.5 font-semibold text-white shadow-lg shadow-rose-800/30 transition-all hover:-translate-y-0.5 hover:bg-rose-900"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {showGalleryModal && <GalleryModal images={galleryImages} onClose={closeGallery} />}
        {showProfileModal && <ProfileModal user={selectedUser} onClose={closeProfileModal} openGallery={openGallery} />}
        {showMembershipModal && (
          <MembershipModal onClose={() => setShowMembershipModal(false)} onJoinPremium={handleJoinPremium} />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Sol;