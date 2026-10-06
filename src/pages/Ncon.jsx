// src/pages/Ncon.jsx
import React, { useState, useEffect } from 'react';
import {
  CakeIcon, UsersIcon, HeartIcon, ChatBubbleLeftRightIcon, BriefcaseIcon,
  AcademicCapIcon, XMarkIcon, CheckCircleIcon, PlusCircleIcon, PhotoIcon,
  MagnifyingGlassIcon, MapPinIcon, CurrencyRupeeIcon, UserCircleIcon,
  EyeIcon, DevicePhoneMobileIcon, ChevronLeftIcon, ChevronRightIcon,
  StarIcon, LockClosedIcon, FilmIcon, MusicalNoteIcon, PaintBrushIcon,
  SparklesIcon, ShieldCheckIcon, ArrowsUpDownIcon, ScaleIcon
} from '@heroicons/react/24/solid';
import Memb from './Memb';
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
      <linearGradient id="crown-gradient-ncon" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#FFD700' }} />
        <stop offset="100%" style={{ stopColor: '#FDB813' }} />
      </linearGradient>
    </defs>
    <g>
      <path d="M10 30 L15 70 L85 70 L90 30 L65 50 L50 30 L35 50 Z" fill="url(#crown-gradient-ncon)" />
      <circle cx="25" cy="45" r="5" fill="#FFF700" />
      <circle cx="50" cy="40" r="5" fill="#FFF700" />
      <circle cx="75" cy="45" r="5" fill="#FFF700" />
      <rect x="15" y="75" width="70" height="5" fill="url(#crown-gradient-ncon)" />
    </g>
  </svg>
);

const GalleryModal = ({ images, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const goToPrevious = (e) => { e.stopPropagation(); setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1)); };
  const goToNext = (e) => { e.stopPropagation(); setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1)); };
  if (!images || images.length === 0) return null;
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4" onClick={onClose}>
      <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-white bg-black/30 rounded-full h-10 w-10 flex items-center justify-center hover:bg-black/50 z-20" onClick={onClose}>
          <XMarkIcon className="w-7 h-7" />
        </button>
        {images.length > 1 && (
          <button onClick={goToPrevious} className="absolute top-1/2 -translate-y-1/2 left-4 z-20 text-white bg-black/30 p-2 rounded-full hover:bg-black/50">
            <ChevronLeftIcon className="w-8 h-8" />
          </button>
        )}
        {images.length > 1 && (
          <button onClick={goToNext} className="absolute top-1/2 -translate-y-1/2 right-4 z-20 text-white bg-black/30 p-2 rounded-full hover:bg-black/50">
            <ChevronRightIcon className="w-8 h-8" />
          </button>
        )}
        <div className="relative w-auto h-full max-h-[90vh] flex items-center">
          <img key={currentIndex} src={images[currentIndex]} alt={`Profile ${currentIndex + 1}`} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
        </div>
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileModal = ({ user, onClose, openGallery }) => {
  if (!user) return null;
  const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-6 h-6 text-orange-500 mt-1">{icon}</div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-md font-semibold text-slate-800">{value || '—'}</p>
      </div>
    </div>
  );
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="relative max-w-2xl w-full">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
          <img
            src={user.profile_photos?.[0] || 'https://placehold.co/200x200/f3f4f6/6b7280?text=Photo'}
            alt={user.first_name}
            onClick={() => openGallery(user.profile_photos || [])}
            className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300"
          />
          {user.is_premium && (
            <div className="absolute -top-2 -right-2 transform rotate-12">
              <CrownIcon className="w-8 h-8" />
            </div>
          )}
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 pt-20 rounded-2xl w-full mt-16 max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-200">
          <button className="absolute top-4 right-4 text-slate-500 hover:text-red-600 z-20" onClick={onClose}>
            <XMarkIcon className="w-8 h-8" />
          </button>
          <div className="text-center mb-6 pb-4 border-b-2 border-dashed border-orange-200">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
              {user.first_name} {user.last_name}
            </h2>
            <p className="text-slate-500 mt-1">A complete profile overview.</p>
          </div>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-slate-700 mb-4 border-l-4 border-orange-500 pl-3">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <DetailItem icon={<CakeIcon />} label="Age" value={user.age ? `${user.age} Years` : null} />
                <DetailItem icon={<ArrowsUpDownIcon />} label="Height" value={user.height} />
                <DetailItem icon={<ScaleIcon />} label="Weight" value={user.weight} />
                <DetailItem icon={<HeartIcon />} label="Religion" value={user.religion} />
                <DetailItem icon={<AcademicCapIcon />} label="Caste" value={user.caste} />
                <DetailItem icon={<ChatBubbleLeftRightIcon />} label="Mother Tongue" value={user.mother_tongue} />
                <DetailItem icon={<SparklesIcon />} label="Zodiac" value={user.zodiac} />
                <DetailItem icon={<ShieldCheckIcon />} label="Manglik" value={user.manglik} />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-700 mb-4 border-l-4 border-orange-500 pl-3">Professional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <DetailItem icon={<BriefcaseIcon />} label="Occupation" value={user.occupation} />
                <DetailItem icon={<CurrencyRupeeIcon />} label="Annual Income" value={user.annual_income} />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-700 mb-4 border-l-4 border-orange-500 pl-3">Favorites & Interests</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <DetailItem icon={<FilmIcon />} label="Favorite Movies" value={user.favorite_movies} />
                <DetailItem icon={<MusicalNoteIcon />} label="Favorite Song" value={user.favorite_song} />
                <DetailItem icon={<PaintBrushIcon />} label="Favorite Color" value={user.favorite_color} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MembershipModal = ({ onClose, onJoinPremium }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
    <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl text-center p-8 m-4">
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-500 to-orange-500 p-4 rounded-full shadow-lg">
        <StarIcon className="w-12 h-12 text-white" />
      </div>
      <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600" onClick={onClose}>
        <XMarkIcon className="w-7 h-7" />
      </button>
      <h2 className="text-3xl font-extrabold text-slate-800 mt-8 mb-4">Unlock Premium Access</h2>
      <p className="text-slate-500 mb-8">
        Become a premium member to view contact details and connect with profiles directly.
      </p>
      <button onClick={onJoinPremium} className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-300 flex items-center justify-center space-x-2">
        <LockClosedIcon className="w-5 h-5" />
        <span>Join Premium Now</span>
      </button>
    </div>
  </div>
);

const Ncon = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestedUsers, setRequestedUsers] = useState(new Set());
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedCaste, setSelectedCaste] = useState('');
  const [searchName, setSearchName] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [showMembPage, setShowMembPage] = useState(false);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const filters = { limit: 50 };
      if (selectedCaste) filters.caste = selectedCaste;
      if (searchName) filters.search_query = searchName;
      const res = await profileService.searchProfiles(filters);
      if (res.success) setProfiles(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProfiles(); /* eslint-disable-next-line */ }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await connectionService.getSentRequests();
        if (res.success) {
          setRequestedUsers(new Set((res.data || []).map((c) => c.to_user_uuid)));
        }
      } catch (e) { /* silent */ }
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
    } catch (e) { alert(e.message); }
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
  const handleJoinPremium = () => { setShowMembershipModal(false); setShowMembPage(true); };
  const handleBackFromMemb = () => setShowMembPage(false);

  if (showMembPage) return <Memb onBack={handleBackFromMemb} />;

  return (
    <div>
      <div className="font-sans bg-gradient-to-br from-orange-100 to-red-100 text-slate-800">
        <div className="min-h-screen container mx-auto px-4 py-16">
          <div className="text-center mb-14">
            <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 mb-4 tracking-tight">
              Find Your Soulmate
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Browse through profiles on our elegantly designed platform. Your journey to finding love starts now.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-14">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-64 bg-white border border-gray-300 rounded-full px-5 py-3 pl-12 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-300 shadow-sm text-slate-700 placeholder-slate-500"
              />
              <MagnifyingGlassIcon className="h-6 w-6 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            <div className="relative">
              <select
                value={selectedCaste}
                onChange={(e) => setSelectedCaste(e.target.value)}
                className="w-64 appearance-none bg-white border border-gray-300 rounded-full px-5 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-300 text-slate-700"
              >
                <option value="">All Castes</option>
                {casteOptions.map((caste, i) => (
                  <option key={i} value={caste}>{caste}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-24">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              <p className="mt-4 text-slate-600">Loading profiles...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {profiles.map((user) => {
                const uid = user.user_uuid || user.uuid;
                const isRequested = requestedUsers.has(uid);
                const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
                const mainImage = user.profile_photos?.[0] || 'https://placehold.co/600x800/f3f4f6/6b7280?text=No+Photo';
                return (
                  <div key={uid} className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-500 group hover:shadow-orange-500/20 hover:border-orange-400/50 flex flex-col">
                    <div className="relative overflow-hidden">
                      <img src={mainImage} alt={fullName} className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110" />
                      {user.is_premium && (
                        <div className="absolute top-4 left-4 transform -rotate-12">
                          <CrownIcon className="w-8 h-8" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-5">
                        <h2 className="text-3xl font-bold text-white tracking-tight">{fullName}</h2>
                        <p className="text-md text-orange-300 font-medium">{user.occupation || ''}</p>
                      </div>
                      <div className="absolute top-4 right-4 flex items-center space-x-2">
                        {(user.profile_photos?.length > 1) && (
                          <button onClick={() => openGallery(user.profile_photos)} className="flex items-center space-x-2 bg-black/40 text-white text-xs font-semibold pl-2 pr-3 py-1.5 rounded-full hover:bg-black/60 transition-colors backdrop-blur-sm">
                            <PhotoIcon className="h-4 w-4" />
                            <span>{user.profile_photos.length} Photos</span>
                          </button>
                        )}
                        <button onClick={() => openProfileModal(user)} className="flex items-center justify-center bg-white/80 text-orange-600 w-8 h-8 rounded-full hover:bg-white transition-colors backdrop-blur-sm shadow-md">
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      </div>
                      {user.is_premium && (
                        <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                          <CrownIcon className="w-5 h-5" />
                          <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">Premium</span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 space-y-5 flex-grow">
                      <div className="flex justify-around text-center border-b border-gray-200 pb-4">
                        <div className="flex flex-col items-center">
                          <CakeIcon className="h-6 w-6 text-orange-500 mb-1" />
                          <span className="text-sm font-semibold text-slate-800">{user.age || '—'}</span>
                          <span className="text-xs text-slate-500">Years</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <MapPinIcon className="h-6 w-6 text-green-500 mb-1" />
                          <span className="text-sm font-semibold text-slate-800" title={user.city}>{user.city || '—'}</span>
                          <span className="text-xs text-slate-500">City</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <HeartIcon className="h-6 w-6 text-red-500 mb-1" />
                          <span className="text-sm font-semibold text-slate-800">{user.religion || '—'}</span>
                          <span className="text-xs text-slate-500">Religion</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <AcademicCapIcon className="h-6 w-6 text-amber-600 mb-1" />
                          <span className="text-sm font-semibold text-slate-800">{user.caste || '—'}</span>
                          <span className="text-xs text-slate-500">Caste</span>
                        </div>
                      </div>
                      <div className="space-y-3 text-slate-600 text-sm pt-4">
                        <div className="flex items-center space-x-3">
                          <ChatBubbleLeftRightIcon className="h-5 w-5 text-slate-400" />
                          <p><span className="font-semibold text-slate-700">Speaks: </span>{user.mother_tongue || '—'}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <DevicePhoneMobileIcon className="h-5 w-5 text-slate-400" />
                          <p className="flex-grow">
                            <span className="font-semibold text-slate-700">Phone: </span>
                            {formatPhoneNumber(user.phone || user.user_phone)}
                          </p>
                          <button onClick={handlePhoneViewClick} className="text-slate-500 hover:text-slate-700">
                            <EyeIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-2">
                      <button
                        disabled={isRequested}
                        onClick={() => handleRequest(user)}
                        className={`w-full flex items-center justify-center px-4 py-3 text-base font-bold rounded-xl transition-all duration-300
                          ${isRequested
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:shadow-lg hover:shadow-orange-500/40 focus:outline-none focus:ring-4 focus:ring-orange-300 hover:-translate-y-0.5'
                          }`}
                      >
                        {isRequested ? (
                          <><CheckCircleIcon className="h-6 w-6 mr-2" /> Request Sent</>
                        ) : (
                          <><PlusCircleIcon className="h-6 w-6 mr-2" /> Send Request</>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && profiles.length === 0 && (
            <div className="text-center col-span-full py-24">
              <h3 className="text-3xl font-semibold text-slate-600">No Profiles Found</h3>
              <p className="text-slate-500 mt-3">Try adjusting your filters to discover more people.</p>
            </div>
          )}
        </div>

        {showGalleryModal && <GalleryModal images={galleryImages} onClose={closeGallery} />}
        {showProfileModal && <ProfileModal user={selectedUser} onClose={closeProfileModal} openGallery={openGallery} />}
        {showMembershipModal && (
          <MembershipModal onClose={() => setShowMembershipModal(false)} onJoinPremium={handleJoinPremium} />
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default Ncon;










// import React, { useState, useEffect } from 'react';
// import {
//     CakeIcon,
//     UsersIcon,
//     HeartIcon,
//     ChatBubbleLeftRightIcon,
//     BriefcaseIcon,
//     AcademicCapIcon,
//     XMarkIcon,
//     CheckCircleIcon,
//     PlusCircleIcon,
//     PhotoIcon,
//     MagnifyingGlassIcon,
//     MapPinIcon,
//     CurrencyRupeeIcon,
//     HomeIcon,
//     UserCircleIcon,
//     EyeIcon,
//     DevicePhoneMobileIcon,
//     ChevronLeftIcon,
//     ChevronRightIcon,
//     StarIcon,
//     LockClosedIcon,
//     FilmIcon,
//     MusicalNoteIcon,
//     PaintBrushIcon,
//     SparklesIcon,
//     ShieldCheckIcon,
//     ArrowsUpDownIcon,
//     ScaleIcon
// } from '@heroicons/react/24/solid';

// // Import the memb.jsx component
// import Memb from './Memb';
// import Footer from '../components/Footer';

// // --- Mock Data with more details ---
// const userData = [
//     {
//         name: 'Naveen',
//         gender: 'Man',
//         phone: '9276898567',
//         email: 'bharti9@gmail.com',
//         age: '27',
//         family: '4 members',
//         fatherName: 'Rakesh Sharma',
//         motherName: 'Sunita Sharma',
//         siblings: { brothers: 1, sisters: 1 },
//         religion: 'Hindu',
//         motherTongue: 'Hindi',
//         caste: 'Brahmin',
//         job: 'Government (SSC)',
//         income: '₹ 6,00,000 PA',
//         hobbies: 'Cricket, Reading Books',
//         location: 'Patna, Bihar',
//         images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop', 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?q=80&w=1921&auto=format&fit=crop'],
//         isPremium: true,
//         height: "5' 10\"",
//         weight: "75 kg",
//         favoriteMovies: "3 Idiots, Lagaan",
//         favoriteColor: "Blue",
//         favoriteSong: "Tum Hi Ho",
//         zodiac: "Leo",
//         manglik: "No",
//     },
//     {
//         name: 'Anjali',
//         gender: 'Woman',
//         phone: '7896541230',
//         email: 'anjali@gmail.com',
//         age: '24',
//         family: '5 members',
//         fatherName: 'Sanjay Verma',
//         motherName: 'Meena Verma',
//         siblings: { brothers: 0, sisters: 2 },
//         religion: 'Hindu',
//         motherTongue: 'Maithili',
//         caste: 'Kayastha',
//         job: 'Teacher',
//         income: '₹ 4,50,000 PA',
//         hobbies: 'Reading, Cooking',
//         location: 'Muzaffarpur, Bihar',
//         images: ['/image/s37.jpg', '/image/s38.jpg'],
//         isPremium: false,
//         height: "5' 4\"",
//         weight: "58 kg",
//         favoriteMovies: "Queen, Dilwale Dulhania Le Jayenge",
//         favoriteColor: "Pink",
//         favoriteSong: "Lag Jaa Gale",
//         zodiac: "Cancer",
//         manglik: "Yes",
//     },
//     {
//         name: 'Rohit',
//         gender: 'Man',
//         phone: '9988776655',
//         email: 'rohit@gmail.com',
//         age: '29',
//         family: '3 members',
//         fatherName: 'Anil Singh',
//         motherName: 'Priya Singh',
//         siblings: { brothers: 0, sisters: 0 },
//         religion: 'Hindu',
//         motherTongue: 'Bhojpuri',
//         caste: 'Rajput',
//         job: 'Software Engineer',
//         income: '₹ 12,00,000 PA',
//         hobbies: 'Football, Movies',
//         location: 'Ranchi, Jharkhand',
//         images: ['/image/s24.jpg', '/image/s41.jpg'],
//         isPremium: true,
//         height: "6' 0\"",
//         weight: "82 kg",
//         favoriteMovies: "Gangs of Wasseypur, Sholay",
//         favoriteColor: "Black",
//         favoriteSong: "Chaiyya Chaiyya",
//         zodiac: "Scorpio",
//         manglik: "No",
//     },
//     {
//         name: 'Pooja',
//         gender: 'Woman',
//         phone: '9080706050',
//         email: 'pooja@gmail.com',
//         age: '25',
//         family: '4 members',
//         fatherName: 'Manoj Yadav',
//         motherName: 'Geeta Yadav',
//         siblings: { brothers: 1, sisters: 0 },
//         religion: 'Hindu',
//         motherTongue: 'Hindi',
//         caste: 'Yadav',
//         job: 'Doctor',
//         income: '₹ 9,00,000 PA',
//         hobbies: 'Painting, Yoga',
//         location: 'Gaya, Bihar',
//         images: ['/image/s25.jpg', '/image/s26.jpg'],
//         isPremium: false,
//         height: "5' 6\"",
//         weight: "60 kg",
//         favoriteMovies: "Barfi!, English Vinglish",
//         favoriteColor: "Yellow",
//         favoriteSong: "Raabta",
//         zodiac: "Virgo",
//         manglik: "No",
//     },
//     {
//         name: 'Vikram',
//         gender: 'Man',
//         phone: '8877665544',
//         email: 'vikram.singh@example.com',
//         age: '31',
//         family: '3 members',
//         fatherName: 'Harish Singh',
//         motherName: 'Rekha Singh',
//         siblings: { brothers: 1, sisters: 0 },
//         religion: 'Hindu',
//         motherTongue: 'Hindi',
//         caste: 'Thakur',
//         job: 'Musician',
//         income: '₹ 8,00,000 PA',
//         hobbies: 'Playing Sitar, Traveling',
//         location: 'Varanasi, UP',
//         images: ['/image/s39.jpg', '/image/s40.jpg'],
//         isPremium: true,
//         height: "5' 11\"",
//         weight: "78 kg",
//         favoriteMovies: "Rockstar, Swades",
//         favoriteColor: "Maroon",
//         favoriteSong: "Kun Faya Kun",
//         zodiac: "Aries",
//         manglik: "Yes",
//     },
//     {
//         name: 'Priya',
//         gender: 'Woman',
//         phone: '7766554433',
//         email: 'priya.patel@example.com',
//         age: '28',
//         family: '4 members',
//         fatherName: 'Mahesh Patel',
//         motherName: 'Kavita Patel',
//         siblings: { brothers: 0, sisters: 1 },
//         religion: 'Hindu',
//         motherTongue: 'Gujarati',
//         caste: 'Patel',
//         job: 'Architect',
//         income: '₹ 11,00,000 PA',
//         hobbies: 'Sketching, Photography',
//         location: 'Lucknow, UP',
//         images: ['/image/s35.jpg', '/image/s36.jpg'],
//         isPremium: false,
//         height: "5' 5\"",
//         weight: "62 kg",
//         favoriteMovies: "Zindagi Na Milegi Dobara, Wake Up Sid",
//         favoriteColor: "Teal",
//         favoriteSong: "Iktara",
//         zodiac: "Taurus",
//         manglik: "No",
//     },
// ];

// const casteOptions = [
//     "Brahmin", "Rajput", "Kayastha", "Yadav", "Kurmi", "Teli", "Agarwal", "Jat",
//     "Kshatriya", "Vaishya", "Baniya", "Gupta", "Kumar", "Thakur", "Chamar", "Nai",
//     "Lohar", "Kumbhar", "Bania", "Bhumihar", "Sahu", "Mali", "Kahar", "Vishwakarma",
//     "Soni", "Kushwaha", "Sonar", "Bairagi", "SC", "ST", "OBC", "General", "Muslim",
//     "Ansari", "Sheikh", "Pathan", "Syed", "Qureshi", "Khan", "Christian", "Sikh",
//     "Patel", "Other"
// ];

// const CrownIcon = (props) => (
//     <svg width="48" height="48" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
//         <defs>
//             <linearGradient id="crown-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
//                 <stop offset="0%" style={{ stopColor: '#FFD700' }} />
//                 <stop offset="100%" style={{ stopColor: '#FDB813' }} />
//             </linearGradient>
//         </defs>
//         <g>
//             <path d="M10 30 L15 70 L85 70 L90 30 L65 50 L50 30 L35 50 Z" fill="url(#crown-gradient)" />
//             <circle cx="25" cy="45" r="5" fill="#FFF700" />
//             <circle cx="50" cy="40" r="5" fill="#FFF700" />
//             <circle cx="75" cy="45" r="5" fill="#FFF700" />
//             <rect x="15" y="75" width="70" height="5" fill="url(#crown-gradient)" />
//         </g>
//     </svg>
// );

// // --- Gallery Modal (Carousel) ---
// const GalleryModal = ({ images, onClose }) => {
//     const [currentIndex, setCurrentIndex] = useState(0);

//     const goToPrevious = (e) => {
//         e.stopPropagation();
//         const isFirstSlide = currentIndex === 0;
//         const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
//         setCurrentIndex(newIndex);
//     };

//     const goToNext = (e) => {
//         e.stopPropagation();
//         const isLastSlide = currentIndex === images.length - 1;
//         const newIndex = isLastSlide ? 0 : currentIndex + 1;
//         setCurrentIndex(newIndex);
//     };

//     if (!images || images.length === 0) {
//         return null;
//     }

//     return (
//         <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4 animate-in fade-in-0" onClick={onClose}>
//             <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
//                 <button
//                     className="absolute top-4 right-4 text-white bg-black/30 rounded-full h-10 w-10 flex items-center justify-center hover:bg-black/50 z-20"
//                     onClick={onClose}
//                 >
//                     <XMarkIcon className="w-7 h-7" />
//                 </button>

//                 {images.length > 1 && (
//                     <button onClick={goToPrevious} className="absolute top-1/2 -translate-y-1/2 left-4 z-20 text-white bg-black/30 p-2 rounded-full hover:bg-black/50 transition-colors">
//                         <ChevronLeftIcon className="w-8 h-8" />
//                     </button>
//                 )}

//                 {images.length > 1 && (
//                     <button onClick={goToNext} className="absolute top-1/2 -translate-y-1/2 right-4 z-20 text-white bg-black/30 p-2 rounded-full hover:bg-black/50 transition-colors">
//                         <ChevronRightIcon className="w-8 h-8" />
//                     </button>
//                 )}

//                 <div className="relative w-auto h-full max-h-[90vh] flex items-center">
//                     <img
//                         key={currentIndex}
//                         src={images[currentIndex]}
//                         alt={`Profile image ${currentIndex + 1}`}
//                         className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in fade-in-0"
//                         onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src = 'https://placehold.co/600x800/f3f4f6/6b7280?text=Image+Not+Found';
//                         }}
//                     />
//                 </div>

//                 {images.length > 1 && (
//                     <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full text-sm font-medium">
//                         {currentIndex + 1} / {images.length}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// // --- Profile Detail Modal ---
// const ProfileModal = ({ user, onClose, openGallery }) => {
//     if (!user) return null;

//     const DetailItem = ({ icon, label, value }) => (
//         <div className="flex items-start space-x-4">
//             <div className="flex-shrink-0 w-6 h-6 text-orange-500 mt-1">{icon}</div>
//             <div>
//                 <p className="text-sm text-slate-500">{label}</p>
//                 <p className="text-md font-semibold text-slate-800">{value}</p>
//             </div>
//         </div>
//     );

//     return (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4 animate-in fade-in-0">
//             <div className="relative max-w-2xl w-full">
//                 <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
//                     <img
//                         src={user.images[0]}
//                         alt={user.name}
//                         onClick={() => openGallery(user.images)}
//                         onError={(e) => { 
//                             e.target.onerror = null; 
//                             e.target.src = 'https://placehold.co/200x200/f3f4f6/6b7280?text=Image'; 
//                         }}
//                         className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300"
//                     />
//                     {user.isPremium && (
//                         <div className="absolute -top-2 -right-2 transform rotate-12">
//                             <CrownIcon className="w-8 h-8" />
//                         </div>
//                     )}
//                 </div>
//                 <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 pt-20 rounded-2xl w-full mt-16 max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-200">
//                     <button
//                         className="absolute top-4 right-4 text-slate-500 hover:text-red-600 z-20"
//                         onClick={onClose}
//                     >
//                         <XMarkIcon className="w-8 h-8" />
//                     </button>
//                     <div className="text-center mb-6 pb-4 border-b-2 border-dashed border-orange-200">
//                         <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
//                             {user.name}'s Biodata
//                         </h2>
//                         <p className="text-slate-500 mt-1">A complete profile overview.</p>
//                     </div>
//                     <div className="space-y-8">
//                         <div>
//                             <h3 className="text-xl font-bold text-slate-700 mb-4 border-l-4 border-orange-500 pl-3">Personal Details</h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
//                                 <DetailItem icon={<CakeIcon />} label="Age" value={`${user.age} Years`} />
//                                 <DetailItem icon={<ArrowsUpDownIcon />} label="Height" value={user.height} />
//                                 <DetailItem icon={<ScaleIcon />} label="Weight" value={user.weight} />
//                                 <DetailItem icon={<HeartIcon />} label="Religion" value={user.religion} />
//                                 <DetailItem icon={<AcademicCapIcon />} label="Caste" value={user.caste} />
//                                 <DetailItem icon={<ChatBubbleLeftRightIcon />} label="Mother Tongue" value={user.motherTongue} />
//                                 <DetailItem icon={<SparklesIcon />} label="Zodiac Sign" value={user.zodiac} />
//                                 <DetailItem icon={<ShieldCheckIcon />} label="Manglik" value={user.manglik} />
//                             </div>
//                         </div>
//                         <div>
//                             <h3 className="text-xl font-bold text-slate-700 mb-4 border-l-4 border-orange-500 pl-3">Professional Details</h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
//                                 <DetailItem icon={<BriefcaseIcon />} label="Occupation" value={user.job} />
//                                 <DetailItem icon={<CurrencyRupeeIcon />} label="Annual Income" value={user.income} />
//                             </div>
//                         </div>
//                         <div>
//                             <h3 className="text-xl font-bold text-slate-700 mb-4 border-l-4 border-orange-500 pl-3">Family Details</h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
//                                 <DetailItem icon={<UserCircleIcon />} label="Father's Name" value={user.fatherName} />
//                                 <DetailItem icon={<UserCircleIcon />} label="Mother's Name" value={user.motherName} />
//                                 <DetailItem icon={<UsersIcon />} label="Brothers" value={String(user.siblings.brothers)} />
//                                 <DetailItem icon={<UsersIcon />} label="Sisters" value={String(user.siblings.sisters)} />
//                             </div>
//                         </div>
//                         <div>
//                             <h3 className="text-xl font-bold text-slate-700 mb-4 border-l-4 border-orange-500 pl-3">Favorites & Interests</h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
//                                 <DetailItem icon={<FilmIcon />} label="Favorite Movies" value={user.favoriteMovies} />
//                                 <DetailItem icon={<MusicalNoteIcon />} label="Favorite Song" value={user.favoriteSong} />
//                                 <DetailItem icon={<PaintBrushIcon />} label="Favorite Color" value={user.favoriteColor} />
//                                 <div className="flex items-start space-x-4 md:col-span-2">
//                                     <div className="flex-shrink-0 w-6 h-6 text-orange-500 mt-1"><PhotoIcon /></div>
//                                     <div>
//                                         <p className="text-sm text-slate-500">Hobbies</p>
//                                         <div className="flex flex-wrap gap-2 mt-1">
//                                             {user.hobbies.split(',').map(hobby => (
//                                                 <span key={hobby} className="bg-orange-100 text-orange-800 text-xs font-semibold px-3 py-1.5 rounded-full">{hobby.trim()}</span>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // --- Membership Modal ---
// const MembershipModal = ({ onClose, onJoinPremium }) => {
//     return (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4 animate-in fade-in-0">
//             <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl text-center p-8 m-4">
//                 <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-500 to-orange-500 p-4 rounded-full shadow-lg">
//                     <StarIcon className="w-12 h-12 text-white" />
//                 </div>
//                 <button
//                     className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
//                     onClick={onClose}
//                 >
//                     <XMarkIcon className="w-7 h-7" />
//                 </button>
//                 <h2 className="text-3xl font-extrabold text-slate-800 mt-8 mb-4">Unlock Premium Access</h2>
//                 <p className="text-slate-500 mb-8">
//                     Become a premium member to view contact details and connect with profiles directly.
//                 </p>
//                 <button 
//                     onClick={onJoinPremium}
//                     className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-300 flex items-center justify-center space-x-2"
//                 >
//                     <LockClosedIcon className="w-5 h-5" />
//                     <span>Join Premium Now</span>
//                 </button>
//             </div>
//         </div>
//     );
// };

// // --- Main Component ---
// const Ncon = () => {
//     const mockLocationState = {
//         minAge: 18,
//         maxAge: 35,
//         gender: null,
//         religion: 'Hindu',
//         motherTongue: null,
//     };

//     const [requestedUsers, setRequestedUsers] = useState([]);
//     const [showGalleryModal, setShowGalleryModal] = useState(false);
//     const [galleryImages, setGalleryImages] = useState([]);
//     const [selectedCaste, setSelectedCaste] = useState('');
//     const [searchName, setSearchName] = useState('');
//     const [showProfileModal, setShowProfileModal] = useState(false);
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [showMembershipModal, setShowMembershipModal] = useState(false);
//     const [showMembPage, setShowMembPage] = useState(false);

//     useEffect(() => {
//         try {
//             const savedRequests = JSON.parse(localStorage.getItem('requestedUsers')) || [];
//             setRequestedUsers(savedRequests.map((user) => user.email));
//         } catch (error) {
//             console.error("Failed to parse requested users from localStorage", error);
//             setRequestedUsers([]);
//         }
//     }, []);

//     const handleRequest = (user) => {
//         const savedRequestData = JSON.parse(localStorage.getItem('requestedUsers')) || [];
//         const alreadyRequested = savedRequestData.some((u) => u.email === user.email);
//         if (alreadyRequested) return;

//         const userToSave = {
//             ...user,
//             image: user.images && user.images.length > 0 ? user.images[0] : '/default-avatar.png',
//             uploadedImages: user.images || []
//         };

//         const updatedRequests = [...requestedUsers, user.email];
//         const newRequestData = [...savedRequestData, userToSave];

//         localStorage.setItem('requestedUsers', JSON.stringify(newRequestData));
//         setRequestedUsers(updatedRequests);
        
//         window.dispatchEvent(new Event('connections-updated'));
//     };

//     const openGallery = (images) => {
//         setGalleryImages(images);
//         setShowGalleryModal(true);
//     };

//     const closeGallery = () => {
//         setShowGalleryModal(false);
//         setGalleryImages([]);
//     }

//     const openProfileModal = (user) => {
//         setSelectedUser(user);
//         setShowProfileModal(true);
//     };

//     const closeProfileModal = () => {
//         setShowProfileModal(false);
//         setSelectedUser(null);
//     };

//     const formatPhoneNumber = (phone) => {
//         if (!phone || phone.length < 5) return 'N/A';
//         return `${phone.substring(0, 2)}XXXXX${phone.substring(phone.length - 3)}`;
//     };

//     const handlePhoneViewClick = () => {
//         setShowMembershipModal(true);
//     };

//     const handleJoinPremium = () => {
//         setShowMembershipModal(false);
//         setShowMembPage(true);
//     };

//     const handleBackFromMemb = () => {
//         setShowMembPage(false);
//     };

//     const filteredUsers = userData.filter((user) => {
//         const userAge = parseInt(user.age);
//         const { minAge, maxAge, gender, religion, motherTongue } = mockLocationState || {};

//         const nameMatch = !searchName || user.name.toLowerCase().includes(searchName.toLowerCase());
//         const genderMatch = !gender || user.gender === gender;
//         const religionMatch = !religion || user.religion === religion;
//         const tongueMatch = !motherTongue || user.motherTongue === motherTongue;
//         const casteMatch = !selectedCaste || user.caste === selectedCaste;
//         const ageMatch = !minAge || !maxAge || (userAge >= minAge && userAge <= maxAge);

//         return nameMatch && genderMatch && religionMatch && tongueMatch && casteMatch && ageMatch;
//     });

//     if (showMembPage) {
//         return <Memb onBack={handleBackFromMemb} />;
//     }

//     return (
//         <div>
//         <div className="font-sans bg-gradient-to-br from-orange-100 to-red-100 text-slate-800">
//             <div className="min-h-screen container mx-auto px-4 py-16">
//                 {/* --- Header Section --- */}
//                 <div className="text-center mb-14">
//                     <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 mb-4 tracking-tight">
//                         Find Your Soulmate
//                     </h1>
//                     <p className="text-lg text-slate-600 max-w-3xl mx-auto">
//                         Browse through profiles on our elegantly designed platform. Your journey to finding love starts now.
//                     </p>
//                 </div>

//                 {/* --- Filter Section --- */}
//                 <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-14">
//                     <div className="relative">
//                         <input
//                             type="text"
//                             placeholder="Search by name..."
//                             value={searchName}
//                             onChange={(e) => setSearchName(e.target.value)}
//                             className="w-64 bg-white border border-gray-300 rounded-full px-5 py-3 pl-12 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-300 shadow-sm text-slate-700 placeholder-slate-500"
//                         />
//                         <MagnifyingGlassIcon className="h-6 w-6 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
//                     </div>

//                     <div className="relative">
//                         <select
//                             id="caste-filter"
//                             value={selectedCaste}
//                             onChange={(e) => setSelectedCaste(e.target.value)}
//                             className="w-64 appearance-none bg-white border border-gray-300 rounded-full px-5 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-300 text-slate-700"
//                         >
//                             <option value="">All Castes</option>
//                             {casteOptions.map((caste, i) => (
//                                 <option key={i} value={caste} className="bg-white text-slate-700">{caste}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

//                 {/* --- Profile Cards Grid --- */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
//                     {filteredUsers.map((user) => {
//                         const isRequested = requestedUsers.includes(user.email);
//                         return (
//                             <div
//                                 key={user.email}
//                                 className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-500 group hover:shadow-orange-500/20 hover:border-orange-400/50 flex flex-col"
//                             >
//                                 {/* --- Card Image with Hover Effect and Gallery Indicator --- */}
//                                 <div className="relative overflow-hidden">
//                                     <img
//                                         src={user.images[0]}
//                                         alt={user.name}
//                                         onError={(e) => { 
//                                             e.target.onerror = null; 
//                                             e.target.src = 'https://placehold.co/600x800/f3f4f6/6b7280?text=Image+Not+Found'; 
//                                         }}
//                                         className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
//                                     />
//                                     {user.isPremium && (
//                                         <div className="absolute top-4 left-4 transform -rotate-12">
//                                             <CrownIcon className="w-8 h-8" />
//                                         </div>
//                                     )}
//                                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
//                                     <div className="absolute bottom-0 left-0 p-5">
//                                         <h2 className="text-3xl font-bold text-white tracking-tight">{user.name}</h2>
//                                         <p className="text-md text-orange-300 font-medium">{user.job}</p>
//                                     </div>
//                                     <div className="absolute top-4 right-4 flex items-center space-x-2">
//                                         {user.images.length > 1 && (
//                                             <button
//                                                 onClick={() => openGallery(user.images)}
//                                                 className="flex items-center space-x-2 bg-black/40 text-white text-xs font-semibold pl-2 pr-3 py-1.5 rounded-full cursor-pointer hover:bg-black/60 transition-colors backdrop-blur-sm"
//                                                 title="View Photos"
//                                             >
//                                                 <PhotoIcon className="h-4 w-4" />
//                                                 <span>{user.images.length} Photos</span>
//                                             </button>
//                                         )}
//                                         <button
//                                             onClick={() => openProfileModal(user)}
//                                             className="flex items-center justify-center bg-white/80 text-orange-600 w-8 h-8 rounded-full cursor-pointer hover:bg-white transition-colors backdrop-blur-sm shadow-md"
//                                             title="View Full Profile"
//                                         >
//                                             <EyeIcon className="h-5 w-5" />
//                                         </button>
//                                     </div>
                                    
//                                     {/* ✨ NEW: GOLDEN PREMIUM BADGE ✨ */}
//                                     {user.isPremium && (
//                                         <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
//                                             <CrownIcon className="w-5 h-5" />
//                                             <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">
//                                                 Premium
//                                             </span>
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className="p-6 space-y-5 flex-grow">
//                                     <div className="flex justify-around text-center border-b border-gray-200 pb-4">
//                                         <div className="flex flex-col items-center">
//                                             <CakeIcon className="h-6 w-6 text-orange-500 mb-1" />
//                                             <span className="text-sm font-semibold text-slate-800">{user.age}</span>
//                                             <span className="text-xs text-slate-500">Years</span>
//                                         </div>
//                                         <div className="flex flex-col items-center">
//                                             <MapPinIcon className="h-6 w-6 text-green-500 mb-1" />
//                                             <span className="text-sm font-semibold text-slate-800" title={user.location}>{user.location}</span>
//                                             <span className="text-xs text-slate-500">Location</span>
//                                         </div>
//                                         <div className="flex flex-col items-center">
//                                             <HeartIcon className="h-6 w-6 text-red-500 mb-1" />
//                                             <span className="text-sm font-semibold text-slate-800">{user.religion}</span>
//                                             <span className="text-xs text-slate-500">Religion</span>
//                                         </div>
//                                         <div className="flex flex-col items-center">
//                                             <AcademicCapIcon className="h-6 w-6 text-amber-600 mb-1" />
//                                             <span className="text-sm font-semibold text-slate-800">{user.caste}</span>
//                                             <span className="text-xs text-slate-500">Caste</span>
//                                         </div>
//                                     </div>
//                                     <div className="space-y-3 text-slate-600 text-sm pt-4">
//                                         <div className="flex items-start space-x-3">
//                                             <UsersIcon className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
//                                             <p><span className="font-semibold text-slate-700">Family: </span>{user.family}</p>
//                                         </div>
//                                         <div className="flex items-center space-x-3">
//                                             <ChatBubbleLeftRightIcon className="h-5 w-5 text-slate-400" />
//                                             <p><span className="font-semibold text-slate-700">Speaks: </span>{user.motherTongue}</p>
//                                         </div>
//                                         <div className="flex items-center space-x-3">
//                                             <DevicePhoneMobileIcon className="h-5 w-5 text-slate-400" />
//                                             <p className="flex-grow">
//                                                 <span className="font-semibold text-slate-700">Phone: </span>
//                                                 {formatPhoneNumber(user.phone)}
//                                             </p>
//                                             <button onClick={handlePhoneViewClick} className="text-slate-500 hover:text-slate-700">
//                                                 <EyeIcon className="h-5 w-5" />
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="px-6 pb-6 pt-2">
//                                     <button
//                                         disabled={isRequested}
//                                         onClick={() => handleRequest(user)}
//                                         className={`w-full flex items-center justify-center px-4 py-3 text-base font-bold rounded-xl transition-all duration-300 transform
//                                           ${isRequested
//                                             ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                                             : 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:shadow-lg hover:shadow-orange-500/40 focus:outline-none focus:ring-4 focus:ring-orange-300 hover:-translate-y-0.5'
//                                           }`}
//                                     >
//                                         {isRequested ? (
//                                             <>
//                                                 <CheckCircleIcon className="h-6 w-6 mr-2" />
//                                                 Request Sent
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <PlusCircleIcon className="h-6 w-6 mr-2" />
//                                                 Send Request
//                                             </>
//                                         )}
//                                     </button>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>

//                 {filteredUsers.length === 0 && (
//                     <div className="text-center col-span-full py-24">
//                         <h3 className="text-3xl font-semibold text-slate-600">No Profiles Found</h3>
//                         <p className="text-slate-500 mt-3">Try adjusting your filters to discover more people.</p>
//                     </div>
//                 )}
//             </div>

//             {showGalleryModal && <GalleryModal images={galleryImages} onClose={closeGallery} />}
//             {showProfileModal && <ProfileModal user={selectedUser} onClose={closeProfileModal} openGallery={openGallery} />}
//             {showMembershipModal && (
//                 <MembershipModal 
//                     onClose={() => setShowMembershipModal(false)} 
//                     onJoinPremium={handleJoinPremium} 
//                 />
//             )}
//         </div>
//           <Footer/>
//         </div>
//     );
// }

// export default Ncon;