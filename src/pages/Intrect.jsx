// src/pages/Intrect.jsx
import React, { useState, useEffect, useRef } from 'react';
import Footer from '../components/Footer';
import { messageService } from '../services/messageService';
import { connectionService } from '../services/connectionService';

const Intrect = () => {
  const [conversations, setConversations] = useState([]);
  const [chatUser, setChatUser] = useState(null); // conversation row
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(true);
  const chatEndRef = useRef(null);

  const loadConversations = async () => {
    setLoadingConvs(true);
    try {
      const res = await messageService.getConversations();
      if (res.success) setConversations(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingConvs(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const openChat = async (conv) => {
    setChatUser(conv);
    setChatMessages([]);
    try {
      const res = await messageService.getMessages(conv.connection_id);
      if (res.success) setChatMessages(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatUser) return;
    try {
      const res = await messageService.sendMessage(chatUser.connection_id, newMessage.trim());
      if (res.success) {
        setChatMessages((prev) => [...prev, res.data]);
        setNewMessage('');
      }
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div>
      <div className="bg-lime-100 min-h-screen p-6 font-sans">
        <h2 className="text-center text-xl font-semibold mb-6">
          Your Conversations 💬
        </h2>

        {loadingConvs ? (
          <p className="text-center text-gray-600">Loading conversations...</p>
        ) : conversations.length === 0 ? (
          <p className="text-center text-gray-600">No conversations yet. Connect with matches to start chatting.</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {conversations.map((conv) => (
              <div key={conv.connection_id} className="border rounded-xl shadow-lg p-4 w-80 bg-orange-100">
                <p><strong>Name:</strong> {conv.other_user_name || 'User'}</p>
                <p className="text-sm text-gray-600">📧 {conv.other_user_email || '—'}</p>
                <p className="text-sm mt-2 truncate">
                  <strong>Last:</strong> {conv.last_message || 'No messages yet'}
                </p>
                {conv.unread_count > 0 && (
                  <p className="text-xs text-red-600 mt-1">{conv.unread_count} unread</p>
                )}
                <button
                  onClick={() => openChat(conv)}
                  className="mt-3 w-full bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
                >
                  Open Chat
                </button>
              </div>
            ))}
          </div>
        )}

        {chatUser && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-md p-4 relative">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg">Chat with {chatUser.other_user_name}</h3>
                <button onClick={() => setChatUser(null)} className="text-red-500 hover:text-red-700 text-lg">×</button>
              </div>
              <div className="h-64 overflow-y-auto border rounded p-2 bg-gray-50">
                {chatMessages.map((msg, i) => {
                  const isMine = msg.sender_id !== chatUser.other_user_id;
                  return (
                    <div key={i} className={`my-2 ${isMine ? 'text-right' : 'text-left'}`}>
                      <span className={`inline-block px-3 py-2 rounded-lg max-w-[75%] ${isMine ? 'bg-blue-200' : 'bg-gray-300'}`}>
                        {msg.message}
                      </span>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>
              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  className="border rounded px-3 py-2 w-full focus:outline-none"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage} className="bg-green-500 text-white px-4 rounded hover:bg-green-600">
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Intrect;











// import React, { useState, useEffect } from 'react';
// import Footer from '../components/Footer';

// const profiles = [
//   {
//     name: 'Anjali',
//     phone: '7896541230',
//     email: 'anjali@gmail.com',
//     age: 24,
//     family: '5 (mother, father, 2 sisters)',
//     religion: 'Hindu',
//     caste: 'Kayastha',
//     motherTongue: 'Maithili',
//     job: 'Teacher',
//     hobbies: 'Reading',
//     images: ['/image/s35.jpg', '/image/s36.jpg'],
//   },
//   {
//     name: 'Pooja',
//     phone: '9080706050',
//     email: 'pooja@gmail.com',
//     age: 25,
//     family: '4 (mother, father, 1 brother)',
//     religion: 'Hindu',
//     caste: 'Yadav',
//     motherTongue: 'Hindi',
//     job: 'Doctor',
//     hobbies: 'Painting',
//     images: ['/image/s37.jpg', '/image/s38.jpg'],
//   },
//   {
//     name: 'Aditi',
//     phone: '9012345678',
//     email: 'aditi@gmail.com',
//     age: 26,
//     family: '3 (mother, father)',
//     religion: 'Hindu',
//     caste: 'Teli',
//     motherTongue: 'Hindi',
//     job: 'Designer',
//     hobbies: 'Dancing',
//     images: ['/image/s25.jpg', '/image/s26.jpg'],
//   },
// ];

// const ALL_CASTES = [
//   "Brahmin", "Rajput", "Kayastha", "Yadav", "Kurmi", "Teli", "Agarwal", "Jat",
//   "Kshatriya", "Vaishya", "Baniya", "Gupta", "Kumar", "Thakur", "Chamar", "Nai",
//   "Lohar", "Kumbhar", "Bhumihar", "Sahu", "Mali", "Kahar", "Vishwakarma",
//   "Soni", "Kushwaha", "Sonar", "Bairagi", "SC", "ST", "OBC", "General", "Muslim",
//   "Ansari", "Sheikh", "Pathan", "Syed", "Qureshi", "Khan", "Christian","Valmiki", "Sikh", "Other"
// ];

// const getBotResponse = (message) => {
//   const msg = message.toLowerCase();
//   if (msg.includes('hello') || msg.includes('hi')) return 'Hi there! How can I help you? 😊';
//   if (msg.includes('hobby')) return 'I enjoy reading, painting, and dancing!';
//   if (msg.includes('job')) return 'Currently, I work as a Teacher, Doctor, or Designer depending on the profile.';
//   if (msg.includes('family')) return 'My family is very supportive and close-knit.';
//   if (msg.includes('religion')) return 'I follow the Hindu religion.';
//   if (msg.includes('age')) return 'I’m between 24–26 years old.';
//   return "I'm not sure about that, but I'm happy to chat! 💬";
// };

// const GreenChatIcon = ({ className = 'w-5 h-5' }) => (
//   <svg
//     className={className}
//     fill="green"
//     viewBox="0 0 24 24"
//     aria-hidden="true"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path d="M2 2v16l4-4h14V2H2z" />
//   </svg>
// );

// const Intrect = () => {
//   const [chatUser, setChatUser] = useState(null);
//   const [chatMessages, setChatMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [filterCaste, setFilterCaste] = useState('');
//   const [filterName, setFilterName] = useState('');
//   const [connectionRequests, setConnectionRequests] = useState([]);
//   const [modalImages, setModalImages] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);

//   useEffect(() => {
//     const saved = JSON.parse(localStorage.getItem('requestedUsers')) || [];
//     setConnectionRequests(saved.map((u) => u.email));
//   }, []);

//   const openChat = (user) => {
//     setChatUser(user);
//     setChatMessages([{ from: 'bot', text: `Hi! This is ${user.name}. Ask me anything 😊` }]);
//     setNewMessage('');
//   };

//   const sendMessage = () => {
//     if (!newMessage.trim()) return;
//     const userMsg = newMessage;
//     const botReply = getBotResponse(userMsg);
//     setChatMessages((prev) => [...prev, { from: 'me', text: userMsg }, { from: 'bot', text: botReply }]);
//     setNewMessage('');
//   };

//   const sendConnectionRequest = (user) => {
//     if (connectionRequests.includes(user.email)) return;
//     const newRequestUser = { ...user, verified: true }; // mark as verified
//     const updatedStoredUsers = [
//       ...JSON.parse(localStorage.getItem('requestedUsers') || '[]'),
//       newRequestUser
//     ];
//     localStorage.setItem('requestedUsers', JSON.stringify(updatedStoredUsers));
//     setConnectionRequests(updatedStoredUsers.map((u) => u.email));
//     window.dispatchEvent(new Event('connections-updated'));
//   };

//   const filteredProfiles = profiles.filter(
//     (profile) =>
//       (filterCaste === '' || profile.caste === filterCaste) &&
//       profile.name.toLowerCase().includes(filterName.toLowerCase())
//   );

//   return (
//     <div>
//       <div className="bg-lime-100 min-h-screen p-6 font-sans">
//         <h2 className="text-center text-xl font-semibold mb-4">
//           Welcome to our matchmaking platform. Explore profiles and start chatting! 💕
//         </h2>

//         {/* Filters */}
//         <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
//           <div>
//             <label className="mr-2 font-medium">Filter by Caste:</label>
//             <select
//               className="p-2 rounded border"
//               value={filterCaste}
//               onChange={(e) => setFilterCaste(e.target.value)}
//             >
//               <option value="">All Castes</option>
//               {ALL_CASTES.map((caste, idx) => (
//                 <option key={idx} value={caste}>{caste}</option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="mr-2 font-medium">Search by Name:</label>
//             <input
//               type="text"
//               className="p-2 border rounded"
//               placeholder="Enter name..."
//               value={filterName}
//               onChange={(e) => setFilterName(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* Profile Cards */}
//         <div className="flex flex-wrap justify-center gap-6">
//           {filteredProfiles.length === 0 ? (
//             <p className="text-gray-600">No profiles found matching your criteria.</p>
//           ) : (
//             filteredProfiles.map((profile, index) => (
//               <div
//                 key={index}
//                 className={`border rounded-xl shadow-lg p-4 w-80 ${
//                   connectionRequests.includes(profile.email) ? 'bg-gray-300' : 'bg-orange-100'
//                 }`}
//               >
//                 <div
//                   className="mb-3 cursor-pointer"
//                   onClick={() => {
//                     setModalImages(profile.images);
//                     setModalOpen(true);
//                   }}
//                 >
//                   <img
//                     src={profile.images[0]}
//                     alt={`${profile.name} 0`}
//                     className="w-20 h-20 object-cover rounded-md"
//                   />
//                 </div>

//                 <div>
//                   <p><strong>Name:</strong> {profile.name}</p>
//                   <p className="flex items-center gap-2">
//                     <span>📞 {profile.phone}</span>
//                     <button
//                       onClick={() => openChat(profile)}
//                       aria-label={`Chat with ${profile.name}`}
//                       className="flex items-center gap-1 text-green-600 hover:text-green-800 focus:outline-none"
//                       style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, fontWeight: '600' }}
//                     >
//                       <GreenChatIcon className="w-5 h-5" />
//                       <span>Chat</span>
//                     </button>
//                   </p>
//                   <p>📧 {profile.email}</p>

//                   {/* Verified Profile label in blue if request sent */}
//                   {connectionRequests.includes(profile.email) && (
//                     <p className="text-blue-600 font-semibold mt-1">Verified Profile</p>
//                   )}
//                 </div>

//                 <div className="bg-gray-100 p-3 rounded my-2">
//                   <p><strong>Age:</strong> {profile.age} years</p>
//                   <p><strong>Family:</strong> {profile.family}</p>
//                   <p><strong>Religion:</strong> {profile.religion}</p>
//                   <p><strong>Caste:</strong> {profile.caste}</p>
//                   <p><strong>Mother Tongue:</strong> {profile.motherTongue}</p>
//                   <p><strong>Job:</strong> {profile.job}</p>
//                   <p><strong>Hobbies:</strong> {profile.hobbies}</p>
//                 </div>

//                 <button
//                   onClick={() => sendConnectionRequest(profile)}
//                   disabled={connectionRequests.includes(profile.email)}
//                   className={`w-full text-white rounded px-4 py-2 mt-2 ${
//                     connectionRequests.includes(profile.email)
//                       ? 'bg-gray-500 cursor-not-allowed'
//                       : 'bg-blue-500 hover:bg-blue-600'
//                   }`}
//                 >
//                   {connectionRequests.includes(profile.email) ? 'Request Sent' : 'Connect'}
//                 </button>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Image Modal */}
//         {modalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
//             <div className="bg-white rounded-xl p-4 max-w-2xl w-full relative">
//               <button
//                 onClick={() => {
//                   setModalOpen(false);
//                   setModalImages([]);
//                 }}
//                 className="absolute top-2 right-4 text-xl text-red-600 font-bold"
//               >
//                 ×
//               </button>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {modalImages.map((img, i) => (
//                   <img key={i} src={img} alt="Preview" className="w-full h-auto rounded" />
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Chat Modal */}
//         {chatUser && (
//           <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex justify-center items-center z-50">
//             <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-md p-4 relative">
//               <div className="flex justify-between items-center mb-3">
//                 <h3 className="font-bold text-lg">Chat with {chatUser.name}</h3>
//                 <button
//                   onClick={() => setChatUser(null)}
//                   className="text-red-500 hover:text-red-700 text-lg"
//                 >
//                   ×
//                 </button>
//               </div>
//               <div className="h-64 overflow-y-auto border rounded p-2 bg-gray-50">
//                 {chatMessages.map((msg, i) => (
//                   <div key={i} className={`my-2 ${msg.from === 'me' ? 'text-right' : 'text-left'}`}>
//                     <span
//                       className={`inline-block px-3 py-2 rounded-lg max-w-[75%] ${
//                         msg.from === 'me' ? 'bg-blue-200' : 'bg-gray-300'
//                       }`}
//                     >
//                       {msg.text}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//               <div className="flex gap-2 mt-3">
//                 <input
//                   type="text"
//                   className="border rounded px-3 py-2 w-full focus:outline-none"
//                   placeholder="Ask something..."
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//                 />
//                 <button
//                   onClick={sendMessage}
//                   className="bg-green-500 text-white px-4 rounded hover:bg-green-600"
//                 >
//                   Send
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Intrect;
