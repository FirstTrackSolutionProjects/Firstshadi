// src/pages/Mymatch.jsx
import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { connectionService } from '../services/connectionService';

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

  const renderCards = (list, kind) => (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6">
      {loading ? (
        <p className="text-center col-span-full text-gray-600">Loading...</p>
      ) : list.length === 0 ? (
        <p className="text-center col-span-full text-gray-600">No profiles found.</p>
      ) : (
        list.map((conn) => (
          <div key={conn.id} className="bg-white shadow-lg rounded-lg p-6 text-center transition-all duration-300 hover:shadow-xl">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <img
                src={displayImage(conn)}
                alt={displayName(conn)}
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
                onError={(e) => { e.target.src = '/default-avatar.png'; }}
              />
            </div>
            <h4 className="font-semibold text-lg text-gray-800 mt-2">{displayName(conn)}</h4>
            <p className="text-sm text-gray-500 mt-1">{conn.from_user_email || conn.to_user_email || ''}</p>

            {kind === 'request' && (
              <div className="flex justify-center gap-4 mt-5">
                <button
                  onClick={() => acceptRequest(conn)}
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={() => declineRequest(conn)}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                >
                  Decline
                </button>
              </div>
            )}

            {kind === 'accepted' && (
              <div className="flex justify-center gap-3 mt-5">
                <button
                  onClick={() => setViewingProfile(conn)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                >
                  View Profile
                </button>
                <button
                  onClick={() => declineRequest(conn)}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                >
                  Remove
                </button>
              </div>
            )}

            {kind === 'declined' && (
              <div className="mt-5">
                <button
                  onClick={() => acceptRequest(conn)}
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white font-medium mx-auto transition-colors"
                >
                  Accept
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  const ProfileModal = ({ conn }) => {
    if (!conn) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4" onClick={closeModal}>
        <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-auto relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 font-bold text-2xl">×</button>
          <div className="flex flex-col items-center mb-6">
            <img
              src={displayImage(conn)}
              alt={displayName(conn)}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mb-4"
              onError={(e) => { e.target.src = '/default-avatar.png'; }}
            />
            <h2 className="text-2xl font-bold text-gray-800 text-center">{displayName(conn)}</h2>
          </div>
          <div className="space-y-3 text-gray-700 border-t pt-4 text-sm">
            <p><span className="font-semibold">Email:</span> {conn.from_user_email || conn.to_user_email || '—'}</p>
            <p><span className="font-semibold">Status:</span> {conn.status}</p>
            <p><span className="font-semibold">Connected since:</span> {new Date(conn.updated_at || conn.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow bg-gradient-to-br from-yellow-50 to-pink-100 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-4xl font-bold mb-8 text-purple-900">My Matches</h2>

          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setSelectedTab('request')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${selectedTab === 'request' ? 'bg-yellow-500 text-white shadow-lg' : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'}`}
            >
              Requests {requested.length > 0 && <span className="ml-2 bg-white text-yellow-600 rounded-full px-2 py-0.5 text-xs">{requested.length}</span>}
            </button>
            <button
              onClick={() => setSelectedTab('accepted')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${selectedTab === 'accepted' ? 'bg-green-600 text-white shadow-lg' : 'bg-green-100 hover:bg-green-200 text-green-800'}`}
            >
              Accepted {accepted.length > 0 && <span className="ml-2 bg-white text-green-600 rounded-full px-2 py-0.5 text-xs">{accepted.length}</span>}
            </button>
            <button
              onClick={() => setSelectedTab('declined')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${selectedTab === 'declined' ? 'bg-red-600 text-white shadow-lg' : 'bg-red-100 hover:bg-red-200 text-red-800'}`}
            >
              Declined {declined.length > 0 && <span className="ml-2 bg-white text-red-600 rounded-full px-2 py-0.5 text-xs">{declined.length}</span>}
            </button>
          </div>

          {selectedTab === 'request' && (
            <>
              <h3 className="text-xl font-semibold text-yellow-800 mb-4">Pending Requests</h3>
              {renderCards(requested, 'request')}
            </>
          )}
          {selectedTab === 'accepted' && (
            <>
              <h3 className="text-xl font-semibold text-green-700 mb-4">Accepted Profiles</h3>
              {renderCards(accepted, 'accepted')}
            </>
          )}
          {selectedTab === 'declined' && (
            <>
              <h3 className="text-xl font-semibold text-red-700 mb-4">Declined Profiles</h3>
              {renderCards(declined, 'declined')}
            </>
          )}
        </div>
      </div>

      <Footer />
      {viewingProfile && <ProfileModal conn={viewingProfile} />}
    </div>
  );
};

export default Mymatch;




// import React, { useEffect, useState } from 'react';
// import Footer from '../components/Footer';

// const Mymatch = () => {
//   const [requested, setRequested] = useState([]);
//   const [accepted, setAccepted] = useState([]);
//   const [declined, setDeclined] = useState([]);
//   const [selectedTab, setSelectedTab] = useState('request');
//   const [viewingProfile, setViewingProfile] = useState(null);

//   // Load users from localStorage buckets
//   const readBuckets = () => {
//     setRequested(JSON.parse(localStorage.getItem('requestedUsers')) || []);
//     setAccepted(JSON.parse(localStorage.getItem('acceptedUsers')) || []);
//     setDeclined(JSON.parse(localStorage.getItem('declinedUsers')) || []);
//   };

//   useEffect(() => {
//     readBuckets();

//     window.addEventListener('connections-updated', readBuckets);
//     window.addEventListener('focus', readBuckets);
//     return () => {
//       window.removeEventListener('connections-updated', readBuckets);
//       window.removeEventListener('focus', readBuckets);
//     };
//   }, []);

//   // Save data to localStorage
//   const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));

//   // Remove duplicates by id
//   const uniq = (arr, key = 'id') => {
//     const map = new Map();
//     arr.forEach(item => map.set(item[key], item));
//     return [...map.values()];
//   };

//   // Move user to Accepted bucket
//   const moveToAccepted = (user) => {
//     const req = requested.filter(u => u.id !== user.id);
//     const dec = declined.filter(u => u.id !== user.id);
//     const acc = uniq([...accepted.filter(u => u.id !== user.id), user]);

//     setRequested(req);
//     save('requestedUsers', req);
//     setDeclined(dec);
//     save('declinedUsers', dec);
//     setAccepted(acc);
//     save('acceptedUsers', acc);

//     window.dispatchEvent(new Event('connections-updated'));
//   };

//   // Move user to Declined bucket
//   const moveToDeclined = (user) => {
//     const req = requested.filter(u => u.id !== user.id);
//     const acc = accepted.filter(u => u.id !== user.id);
//     const dec = uniq([...declined.filter(u => u.id !== user.id), user]);

//     setRequested(req);
//     save('requestedUsers', req);
//     setAccepted(acc);
//     save('acceptedUsers', acc);
//     setDeclined(dec);
//     save('declinedUsers', dec);

//     window.dispatchEvent(new Event('connections-updated'));
//   };

//   // Close profile modal
//   const closeModal = () => setViewingProfile(null);

//   // Get user image with proper fallbacks
//   const getUserImage = (user) => {
//     // Check for uploaded images first
//     if (user.uploadedImages && user.uploadedImages.length > 0) {
//       return user.uploadedImages[0];
//     }
    
//     // Check for image property
//     if (user.image) {
//       return user.image;
//     }
    
//     // Check for file property if it's an image
//     if (user.file && /\.(jpg|jpeg|png|gif|webp)$/i.test(user.file)) {
//       return user.file;
//     }
    
//     // Default avatar
//     return '/default-avatar.png';
//   };

//   // Render user cards with appropriate actions
//   const renderUsers = (users, actions) => (
//     <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6">
//       {users.length === 0 ? (
//         <p className="text-center col-span-full text-gray-600">No profiles found.</p>
//       ) : (
//         users.map((user, idx) => (
//           <div key={idx} className="bg-white shadow-lg rounded-lg p-6 text-center transition-all duration-300 hover:shadow-xl">
//             <div className="relative w-24 h-24 mx-auto mb-4">
//               <img
//                 src={getUserImage(user)}
//                 alt={user.name || user.fullName || 'User profile'}
//                 className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
//                 onError={(e) => {
//                   e.target.src = '/default-avatar.png';
//                 }}
//               />
//               {/* Verified Profile badge */}
//               {user.verified && (
//                 <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//               )}
//             </div>
//             <h4 className="font-semibold text-lg text-gray-800 mt-2">{user.name || user.fullName || ''}</h4>
//             <p className="text-sm text-gray-500 mt-1">{user.mobile || ''}</p>

//             {actions === 'request' && (
//               <div className="flex justify-center gap-4 mt-5">
//                 <button
//                   onClick={() => moveToAccepted(user)}
//                   className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white font-medium flex items-center transition-colors"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                   </svg>
//                   Accept
//                 </button>
//                 <button
//                   onClick={() => moveToDeclined(user)}
//                   className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white font-medium flex items-center transition-colors"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                   </svg>
//                   Decline
//                 </button>
//               </div>
//             )}

//             {actions === 'accepted' && (
//               <div className="flex justify-center gap-3 mt-5">
//                 <button
//                   onClick={() => setViewingProfile(user)}
//                   className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium flex items-center transition-colors"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                     <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
//                     <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
//                   </svg>
//                   View Profile
//                 </button>
//                 <button
//                   onClick={() => moveToDeclined(user)}
//                   className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white font-medium flex items-center transition-colors"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                   </svg>
//                   Decline
//                 </button>
//               </div>
//             )}

//             {actions === 'declined' && (
//               <div className="mt-5">
//                 <button
//                   onClick={() => moveToAccepted(user)}
//                   className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center mx-auto transition-colors"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                   </svg>
//                   Accept
//                 </button>
//               </div>
//             )}
//           </div>
//         ))
//       )}
//     </div>
//   );

//   // Profile modal to show detailed info
//   const ProfileModal = ({ user }) => {
//     if (!user) return null;

//     const isImageFile = /\.(jpg|jpeg|png|gif|webp)$/i.test(user.file);

//     return (
//       <div
//         className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
//         onClick={closeModal}
//       >
//         <div
//           className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-auto relative shadow-2xl"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <button
//             onClick={closeModal}
//             className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 font-bold text-2xl transition-colors"
//             aria-label="Close"
//           >
//             ×
//           </button>
          
//           <div className="flex flex-col items-center mb-6">
//             <img
//               src={getUserImage(user)}
//               alt={user.name || user.fullName || 'User profile'}
//               className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mb-4"
//               onError={(e) => {
//                 e.target.src = '/default-avatar.png';
//               }}
//             />
//             <h2 className="text-2xl font-bold text-gray-800 text-center">
//               {user.name || user.fullName || "Profile Details"}
//             </h2>
//             {user.verified && (
//               <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mt-2">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                 </svg>
//                 Verified Profile
//               </span>
//             )}
//           </div>

//           <div className="space-y-4 text-gray-700 border-t pt-4">
//             <div className="flex items-start">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mt-1 mr-3" viewBox="0 0 20 20" fill="currentColor">
//                 <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
//                 <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
//               </svg>
//               <div>
//                 <p className="font-medium text-gray-500">Contact</p>
//                 <p>{user.mobile || "Not provided"}</p>
//               </div>
//             </div>
            
//             <div className="flex items-start">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mt-1 mr-3" viewBox="0 0 20 20" fill="currentColor">
//                 <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
//               </svg>
//               <div>
//                 <p className="font-medium text-gray-500">Mobile</p>
//                 <p>{user.mobile || "Not provided"}</p>
//               </div>
//             </div>
            
//             {user.bio && (
//               <div className="flex items-start">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mt-1 mr-3" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                 </svg>
//                 <div>
//                   <p className="font-medium text-gray-500">Bio</p>
//                   <p className="whitespace-pre-line">{user.bio}</p>
//                 </div>
//               </div>
//             )}

//             {user.file && (
//               <div className="pt-4 border-t">
//                 <p className="font-medium text-gray-500 mb-2">Attached File</p>
//                 {isImageFile ? (
//                   <div className="mt-2">
//                     <img 
//                       src={user.file} 
//                       alt="User file" 
//                       className="max-h-80 object-contain mx-auto rounded-lg shadow-md"
//                       onError={(e) => {
//                         e.target.style.display = 'none';
//                         e.target.nextElementSibling.style.display = 'block';
//                       }}
//                     />
//                     <p className="text-center text-sm text-gray-500 mt-2" style={{display: 'none'}}>
//                       Image failed to load. <a href={user.file} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Open directly</a>
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg bg-gray-50">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                     </svg>
//                     <a
//                       href={user.file}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 underline hover:text-blue-800"
//                     >
//                       View File
//                     </a>
//                   </div>
//                 )}
//               </div>
//             )}
            
//             {!user.file && (
//               <div className="text-center text-gray-500 italic py-4">
//                 No file attached to this profile
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       <div className="flex-grow bg-gradient-to-br from-yellow-50 to-pink-100 py-10 px-4">
//         <div className="max-w-6xl mx-auto">
//           <h2 className="text-center text-4xl font-bold mb-8 text-purple-900">
//             My Matches
//           </h2>

//           {/* Tabs */}
//           <div className="flex justify-center space-x-4 mb-8">
//             <button
//               onClick={() => setSelectedTab('request')}
//               className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center ${
//                 selectedTab === 'request'
//                   ? 'bg-yellow-500 text-white shadow-lg'
//                   : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'
//               }`}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//               </svg>
//               Requests {requested.length > 0 && <span className="ml-2 bg-white text-yellow-600 rounded-full px-2 py-0.5 text-xs">{requested.length}</span>}
//             </button>
//             <button
//               onClick={() => setSelectedTab('accepted')}
//               className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center ${
//                 selectedTab === 'accepted'
//                   ? 'bg-green-600 text-white shadow-lg'
//                   : 'bg-green-100 hover:bg-green-200 text-green-800'
//               }`}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//               </svg>
//               Accepted {accepted.length > 0 && <span className="ml-2 bg-white text-green-600 rounded-full px-2 py-0.5 text-xs">{accepted.length}</span>}
//             </button>
//             <button
//               onClick={() => setSelectedTab('declined')}
//               className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center ${
//                 selectedTab === 'declined'
//                   ? 'bg-red-600 text-white shadow-lg'
//                   : 'bg-red-100 hover:bg-red-200 text-red-800'
//               }`}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//               Declined {declined.length > 0 && <span className="ml-2 bg-white text-red-600 rounded-full px-2 py-0.5 text-xs">{declined.length}</span>}
//             </button>
//           </div>

//           {/* Tab content */}
//           {selectedTab === 'request' && (
//             <>
//               <h3 className="text-xl font-semibold text-yellow-800 mb-4 flex items-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                 </svg>
//                 Pending Requests
//               </h3>
//               {renderUsers(requested, 'request')}
//             </>
//           )}
//           {selectedTab === 'accepted' && (
//             <>
//               <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                 </svg>
//                 Accepted Profiles
//               </h3>
//               {renderUsers(accepted, 'accepted')}
//             </>
//           )}
//           {selectedTab === 'declined' && (
//             <>
//               <h3 className="text-xl font-semibold text-red-700 mb-4 flex items-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                 </svg>
//                 Declined Profiles
//               </h3>
//               {renderUsers(declined, 'declined')}
//             </>
//           )}
//         </div>
//       </div>

//       <Footer />

//       {/* Profile Modal */}
//       {viewingProfile && <ProfileModal user={viewingProfile} />}
//     </div>
//   );
// };

// export default Mymatch;

