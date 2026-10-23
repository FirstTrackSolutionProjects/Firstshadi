import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  X,
  Bell,
  MessageCircle,
  Home,
  LayoutDashboard,
  Info,
  Heart,
  User,
  Phone,
  ShieldCheck,
  LogOut,
  LogIn,
  Send,
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/notificationService';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hello! How can I help you today?' }]);
  const [input, setInput] = useState('');
  const menuRef = useRef(null);
  const chatEndRef = useRef(null);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleChat = () => setIsChatOpen(!isChatOpen);

  // shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // notification count
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

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', label: isAuthenticated ? 'Dashboard' : 'Home', icon: isAuthenticated ? LayoutDashboard : Home, show: true },
    { to: '/about', label: 'About Us', icon: Info, show: true },
    { to: '/mymatch', label: 'My Matches', icon: Heart, show: isAuthenticated },
    { to: '/myprofile', label: 'My Profile', icon: User, show: isAuthenticated },
    { to: '/contact', label: 'Contact Us', icon: Phone, show: true },
  ].filter((l) => l.show);

  const Badge = () =>
    notificationCount > 0 ? (
      <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-800 px-1 text-[11px] font-bold text-white ring-2 ring-white">
        {notificationCount > 9 ? '9+' : notificationCount}
      </span>
    ) : null;

  return (
    <>
      <nav
        className={`fixed left-0 top-0 z-50 h-[72px] w-full border-b border-[#e0b46a]/30 bg-[#fffaf6]/95 backdrop-blur-md transition-shadow duration-300 ${
          scrolled ? 'shadow-lg shadow-rose-900/10' : 'shadow-sm'
        }`}
      >
        {/* gold accent line */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#e0b46a] to-transparent" />

        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* brand */}
          <Link to="/" className="group flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-rose-800/30 via-[#e0b46a]/40 to-rose-800/30 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
              <img
                src="/image/l2.png"
                alt="Logo"
                className="relative h-12 w-12 rounded-full bg-white object-contain p-0.5 ring-2 ring-[#e0b46a]/60 transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <span className="font-display text-xl font-bold text-rose-800 sm:text-2xl">
              First <span className="italic text-[#c9973f]">Marriage</span>
            </span>
          </Link>

          {/* desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`group relative px-3.5 py-2 text-sm font-semibold transition-colors duration-300 ${
                  isActive(to) ? 'text-rose-800' : 'text-slate-700 hover:text-rose-800'
                }`}
              >
                {label}
                <span
                  className={`absolute inset-x-3.5 -bottom-0.5 h-0.5 origin-left rounded-full bg-gradient-to-r from-rose-800 to-[#e0b46a] transition-transform duration-300 ${
                    isActive(to) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            ))}

            <div className="mx-2 h-6 w-px bg-gray-200" />

            {isAuthenticated && (
              <Link
                to="/notifications"
                aria-label="Notifications"
                className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:bg-rose-50 hover:text-rose-800 ${
                  isActive('/notifications') ? 'bg-rose-50 text-rose-800' : 'text-slate-700'
                }`}
              >
                <Bell className="h-5 w-5" />
                <Badge />
              </Link>
            )}

            {isAuthenticated && user?.is_admin && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 rounded-full border border-[#e0b46a]/60 bg-[#e0b46a]/10 px-3.5 py-1.5 text-sm font-semibold text-[#a5772a] transition-all duration-300 hover:bg-[#e0b46a] hover:text-rose-900"
              >
                <ShieldCheck className="h-4 w-4" />
                Admin
              </Link>
            )}

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="ml-1 rounded-full border border-gray-300 px-4 py-1.5 text-sm font-semibold text-slate-700 transition-all duration-300 hover:border-rose-800 hover:bg-rose-50 hover:text-rose-800"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/signin"
                className="ml-1 rounded-full border border-rose-800 px-4 py-1.5 text-sm font-semibold text-rose-800 transition-all duration-300 hover:bg-rose-800 hover:text-white"
              >
                Sign In
              </Link>
            )}

            <button
              onClick={toggleChat}
              title="Get Personal Assistant"
              className="ml-1 flex items-center gap-1.5 rounded-full bg-rose-800 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-rose-800/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-900 hover:shadow-lg"
            >
              <MessageCircle className="h-4 w-4" />
              Chat
            </button>
          </div>

          {/* mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            {isAuthenticated && (
              <Link
                to="/notifications"
                aria-label="Notifications"
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-700 hover:bg-rose-50"
              >
                <Bell className="h-5 w-5" />
                <Badge />
              </Link>
            )}
            <button
              onClick={toggleMenu}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-full text-rose-800 hover:bg-rose-50"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* spacer so page content starts below the fixed navbar */}
      <div className="h-[72px]" />

      {/* ==================== MOBILE DRAWER ==================== */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        ref={menuRef}
        className={`fixed right-0 top-0 z-[70] flex h-full w-72 max-w-[85%] transform flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-1 bg-gradient-to-r from-rose-800 via-[#e0b46a] to-rose-800" />
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <span className="font-display text-lg font-bold text-rose-800">
            First <span className="italic text-[#c9973f]">Marriage</span>
          </span>
          <button
            onClick={toggleMenu}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-rose-50 hover:text-rose-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto p-4">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={toggleMenu}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                isActive(to) ? 'bg-rose-800 text-white' : 'text-slate-700 hover:bg-rose-50 hover:text-rose-800'
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}

          {isAuthenticated && (
            <Link
              to="/notifications"
              onClick={toggleMenu}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                isActive('/notifications') ? 'bg-rose-800 text-white' : 'text-slate-700 hover:bg-rose-50 hover:text-rose-800'
              }`}
            >
              <Bell className="h-5 w-5" />
              Notifications
              {notificationCount > 0 && (
                <span className="ml-auto rounded-full bg-rose-800 px-2 py-0.5 text-xs font-bold text-white">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </Link>
          )}

          {user?.is_admin && (
            <Link
              to="/admin"
              onClick={toggleMenu}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#a5772a] hover:bg-[#e0b46a]/15"
            >
              <ShieldCheck className="h-5 w-5" />
              Admin
            </Link>
          )}
        </div>

        <div className="space-y-3 border-t border-gray-100 p-4">
          <button
            onClick={() => { toggleMenu(); toggleChat(); }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-800 py-3 text-sm font-semibold text-white shadow-md shadow-rose-800/30"
          >
            <MessageCircle className="h-5 w-5" />
            Chat Support
          </button>
          {isAuthenticated ? (
            <button
              onClick={() => { toggleMenu(); handleLogout(); }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 py-3 text-sm font-semibold text-slate-700 hover:border-rose-800 hover:text-rose-800"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          ) : (
            <Link
              to="/signin"
              onClick={toggleMenu}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-800 py-3 text-sm font-semibold text-rose-800 hover:bg-rose-800 hover:text-white"
            >
              <LogIn className="h-5 w-5" />
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* ==================== CHAT PANEL ==================== */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[80] flex justify-end bg-black/30" onClick={toggleChat}>
          <div
            className="flex h-full w-80 max-w-full flex-col bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex items-center justify-between bg-gradient-to-r from-rose-800 to-rose-900 p-4">
              <div className="absolute inset-x-0 bottom-0 h-px bg-[#e0b46a]/60" />
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-[#f3d79e] ring-1 ring-white/30">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-bold leading-tight text-white">Chat Support</h2>
                  <p className="text-xs text-white/70">We're here to help</p>
                </div>
              </div>
              <button
                onClick={toggleChat}
                aria-label="Close chat"
                className="flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-white/15"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#faf7f5] p-3 text-sm text-gray-700">
              {messages.map((msg, index) => (
                <div key={index} className={`mb-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2 ${
                      msg.sender === 'user'
                        ? 'rounded-br-sm bg-rose-800 text-white'
                        : 'rounded-bl-sm border border-gray-200 bg-white text-gray-800'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="flex gap-2 border-t border-gray-100 bg-white p-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-800/20"
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                onClick={sendMessage}
                aria-label="Send message"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-800 text-white transition-colors hover:bg-rose-900"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;