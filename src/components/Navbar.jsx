import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Bell, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/notificationService';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hello! How can I help you today?' }]);
  const [input, setInput] = useState('');
  const menuRef = useRef(null);
  const chatEndRef = useRef(null);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleChat = () => setIsChatOpen(!isChatOpen);

  useEffect(() => {
    if (!isAuthenticated) { setNotificationCount(0); return; }
    const fetchCount = async () => {
      try {
        const res = await notificationService.getAll({ is_read: 'false', limit: 1 });
        if (res.success) setNotificationCount(res.data.unread_count || 0);
      } catch (e) { /* silent */ }
    };
    fetchCount();
    const id = setInterval(fetchCount, 30000);
    return () => clearInterval(id);
  }, [isAuthenticated]);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'bot', text: `You said: "${userMessage.text}". How else can I help?` }]);
    }, 800);
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <>
      <nav className="fixed h-18 top-0 left-0 w-full bg-[#fff5ee] px-6 py-2 shadow-md z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 -translate-y-4 -translate-x-4">
            <Link to="/"><img src="/image/l2.png" alt="Logo" className="h-21 w-21" /></Link>
            <span className="-translate-x-4 text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              First Marriage
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-slate-700 font-medium -translate-y-3">
            <Link to="/" className="hover:text-orange-500">Home</Link>
            <Link to="/about" className="hover:text-orange-500">About Us</Link>
            {isAuthenticated && <Link to="/mymatch" className="hover:text-orange-500">My Matches</Link>}
            {isAuthenticated && <Link to="/myprofile" className="hover:text-orange-500">My Profile</Link>}
            <Link to="/contact" className="hover:text-orange-500">Contact Us</Link>

            {isAuthenticated && (
              <Link to="/notifications" className="relative">
                <Bell className="h-6 w-6" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <>
                {user?.is_admin && (
                  <Link to="/admin" className="font-semibold text-indigo-600 hover:text-indigo-800">Admin</Link>
                )}
                <button onClick={handleLogout} className="font-semibold hover:text-orange-500">Logout</button>
              </>
            ) : (
              <Link to="/signin" className="font-semibold hover:text-orange-500">Sign In</Link>
            )}

            <div className="relative group">
              <button onClick={toggleChat} className="font-semibold flex items-center gap-1 text-orange-500 hover:text-orange-600">
                <MessageCircle className="h-5 w-5" /> Chat
              </button>
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-4 -translate-y-4 text-slate-700">
            {isAuthenticated && (
              <Link to="/notifications" className="relative">
                <Bell className="h-6 w-6" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </Link>
            )}
            <button onClick={toggleMenu}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>

        <div
          ref={menuRef}
          className={`fixed top-0 right-0 h-auto pb-4 w-2/4 sm:w-1/2 bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:hidden z-50`}
        >
          <div className="flex flex-col items-start p-6 space-y-4 text-gray-800 font-medium">
            <button onClick={toggleMenu} className="self-end text-gray-600"><X className="h-6 w-6" /></button>
            <Link to="/" onClick={toggleMenu}>🏠 Home</Link>
            <Link to="/about" onClick={toggleMenu}>🧑‍💼 About Us</Link>
            {isAuthenticated && <Link to="/mymatch" onClick={toggleMenu}>❤️ My Matches</Link>}
            {isAuthenticated && <Link to="/myprofile" onClick={toggleMenu}>🧑‍💼 My Profile</Link>}
            {isAuthenticated && <Link to="/notifications" onClick={toggleMenu}>🔔 Notifications</Link>}
            <Link to="/contact" onClick={toggleMenu}>📞 Contact Us</Link>
            {user?.is_admin && <Link to="/admin" onClick={toggleMenu}>🛡️ Admin</Link>}
            {isAuthenticated ? (
              <button onClick={() => { toggleMenu(); handleLogout(); }} className="font-semibold">🚪 Logout</button>
            ) : (
              <Link to="/signin" onClick={toggleMenu} className="font-semibold">🔐 Sign In</Link>
            )}
          </div>
        </div>
      </nav>

      <div className="pt-18" />

      {isChatOpen && (
        <div className="fixed inset-0 flex justify-end z-50">
          <div className="bg-white w-80 h-full flex flex-col shadow-lg">
            <div className="p-4 bg-[#fb9c7c] flex justify-between items-center">
              <h2 className="font-bold text-white">Chat Support</h2>
              <button onClick={toggleChat}><X className="text-white" /></button>
            </div>
            <div className="flex-1 p-3 overflow-y-auto text-sm text-gray-700">
              {messages.map((msg, index) => (
                <div key={index} className={`mb-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-3 py-2 rounded-lg max-w-[75%] ${msg.sender === 'user' ? 'bg-[#fb9c7c] text-white' : 'bg-gray-200 text-gray-800'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="p-3 border-t flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border rounded px-2 py-1 text-sm"
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={sendMessage} className="bg-[#fb9c7c] text-white px-3 py-1 rounded hover:opacity-90">Send</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;











// import React, { useState, useRef, useEffect } from 'react';
// import { Menu, X, Bell, MessageCircle } from 'lucide-react';
// import { Link } from 'react-router-dom';

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [notificationCount, setNotificationCount] = useState(0);
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hello! How can I help you today?' }]);
//   const [input, setInput] = useState('');
//   const menuRef = useRef(null);
//   const chatEndRef = useRef(null);

//   const toggleMenu = () => setIsOpen(!isOpen);
//   const toggleChat = () => setIsChatOpen(!isChatOpen);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setNotificationCount((prevCount) => prevCount + 1);
//     }, 4000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     if (chatEndRef.current) {
//       chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [messages]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };
//     if (isOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//     }
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [isOpen]);

//   const sendMessage = () => {
//     if (!input.trim()) return;

//     const userMessage = { sender: 'user', text: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput('');

//     setTimeout(() => {
//       const botMessage = {
//         sender: 'bot',
//         text: `You said: "${userMessage.text}". How else can I help?`
//       };
//       setMessages((prev) => [...prev, botMessage]);
//     }, 800);
//   };

//   return (
//     <>
//       <nav className="fixed h-18 top-0 left-0 w-full bg-[#fff5ee] px-6 py-2 shadow-md z-50">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <div className="flex items-center space-x-2 -translate-y-4 -translate-x-4">
//             <Link to="/">
//               <img src="/image/l2.png" alt="Logo" className="h-21 w-21" />
//             </Link>
//             {/* --- CHANGE: "First Marriage" text now has a gradient matching the image --- */}
//             <span className="-translate-x-4 text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
//               First Marriage
//             </span>
//           </div>

//           <div className="hidden md:flex items-center space-x-6 text-slate-700 font-medium -translate-y-3">
//             <Link to="/" className="hover:text-orange-500">Home</Link>
//             <Link to="/about" className="hover:text-orange-500">About Us</Link>
//             <Link to="/mymatch" className="hover:text-orange-500">My Matches</Link>
//             <Link to="/myprofile" className="hover:text-orange-500">My Profile</Link>
//             <Link to="/contact" className="hover:text-orange-500">Contact Us</Link>

//             <Link to="/notifications" className="relative">
//               <Bell className="h-6 w-6" />
//               {notificationCount > 0 && (
//                 <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
//               )}
//             </Link>

//             <Link to="/signin" className="font-semibold hover:text-orange-500">
//               Sign In
//             </Link>

//             <div className="relative group">
//               <button
//                 onClick={toggleChat}
//                 className="font-semibold flex items-center gap-1 text-orange-500 hover:text-orange-600"
//               >
//                 <MessageCircle className="h-5 w-5" /> Chat
//               </button>
//               <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
//                 Get Personal Assistant
//               </span>
//             </div>
//           </div>

//           <div className="md:hidden flex items-center space-x-4 -translate-y-4 text-slate-700">
//             <Link to="/notifications" className="relative">
//               <Bell className="h-6 w-6" />
//               {notificationCount > 0 && (
//                 <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
//               )}
//             </Link>
//             <button onClick={toggleMenu}>
//               {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-7 w-7" />}
//             </button>
//           </div>
//         </div>

//         <div
//           ref={menuRef}
//           className={`fixed top-0 right-0 h-auto pb-4 w-2/4 sm:w-1/2 bg-white shadow-lg transform ${
//             isOpen ? 'translate-x-0' : 'translate-x-full'
//           } transition-transform duration-300 ease-in-out md:hidden z-50`}
//         >
//           <div className="flex flex-col items-start p-6 space-y-4 text-gray-800 font-medium">
//             <button onClick={toggleMenu} className="self-end text-gray-600">
//               <X className="h-6 w-6" />
//             </button>
//             <Link to="/" onClick={toggleMenu}>🏠 Home</Link>
//             <Link to="/about" onClick={toggleMenu}>🧑‍💼 About Us</Link>
//             <Link to="/mymatch" onClick={toggleMenu}>❤️ My Matches</Link>
//             <Link to="/myprofile" onClick={toggleMenu}>🧑‍💼 My Profile</Link>
//             <Link to="/notifications" onClick={toggleMenu}>🔔 Notifications</Link>
//             <Link to="/contact" onClick={toggleMenu}>📞 Contact Us</Link>
//             <Link to="/signin" onClick={toggleMenu} className="font-semibold">🔐 Sign In</Link>
            
//             <div className="relative group pt-2">
//               <button
//                 onClick={() => {
//                   toggleChat();
//                   toggleMenu();
//                 }}
//                 className="flex items-center gap-1 text-orange-500 font-bold"
//               >
//                 💬 Chat
//               </button>
//               <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
//                 Get Personal Assistant
//               </span>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <div className="pt-18" />

//       {isChatOpen && (
//         <div className="fixed inset-0 flex justify-end z-50">
//           <div className="bg-white w-80 h-full flex flex-col shadow-lg">
//             <div className="p-4 bg-[#fb9c7c] flex justify-between items-center">
//               <h2 className="font-bold text-white">Chat Support</h2>
//               <button onClick={toggleChat}>
//                 <X className="text-white" />
//               </button>
//             </div>

//             <div className="flex-1 p-3 overflow-y-auto text-sm text-gray-700">
//               {messages.map((msg, index) => (
//                 <div
//                   key={index}
//                   className={`mb-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//                 >
//                   <div
//                     className={`px-3 py-2 rounded-lg max-w-[75%] ${
//                       msg.sender === 'user'
//                         ? 'bg-[#fb9c7c] text-white'
//                         : 'bg-gray-200 text-gray-800'
//                     }`}
//                   >
//                     {msg.text}
//                   </div>
//                 </div>
//               ))}
//               <div ref={chatEndRef} />
//             </div>

//             <div className="p-3 border-t flex gap-2">
//               <input
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 placeholder="Type your message..."
//                 className="flex-1 border rounded px-2 py-1 text-sm focus:ring-[#fb9c7c] focus:border-[#fb9c7c]"
//                 onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//               />
//               <button
//                 onClick={sendMessage}
//                 className="bg-[#fb9c7c] text-white px-3 py-1 rounded hover:opacity-90"
//               >
//                 Send
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Navbar;