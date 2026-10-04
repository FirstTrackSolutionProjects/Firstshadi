// import React from 'react';
// import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
// import { AiFillApple, AiFillAndroid } from 'react-icons/ai';
// import { Link } from 'react-router-dom'; // Make sure you have react-router-dom installed

// const Footer = () => {
//   return (
//     <footer className="bg-[#2c3e50] text-white text-sm">
//       {/* Top Grid Section */}
//       <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
//         {/* Explore */}
//         <div>
//           <h3 className="text-lg font-semibold mb-3">Explore</h3>
//           <ul className="space-y-2">
//             {/* <li><a href="#">Home</a></li> */}
//             <li><a href="#">Advanced search</a></li>
//             <li><a href="#">Success stories</a></li>
//           </ul>
//         </div>

//         {/* Services */}
//         <div>
//           <h3 className="text-lg font-semibold mb-3">Services</h3>
//           <ul className="space-y-2">
//             <li><a href="#">Membership Options</a></li>
//             <li><a href="#">Careers</a></li>
//           </ul>
//         </div>

//         {/* Help */}
//         <div>
//           <h3 className="text-lg font-semibold mb-3">Help</h3>
//           <ul className="space-y-2">
//             <li><Link to="/contact">Contact us</Link></li> {/* Updated this line */}
//             <li><a href="#">First Marriage</a></li>
//           </ul>
//         </div>
        
//         {/* Legal */}
//         <div>
//           <h3 className="text-lg font-semibold mb-3">Legal</h3>
//           <ul className="space-y-2">
            
//             <li><Link to="/about">About us</Link></li> 
           
//             <li><Link to="/fraud">Fraud Alert</Link></li> 
            
//             <li><Link to="/terms">Terms of use</Link></li>
//             <li><Link to="/ref">Cancellation & Refund Policy</Link></li>
//             <li><Link to="/priv">Privacy policy</Link></li>
//             <li><Link to="/cyb">Cyber Security</Link></li>


            
//           </ul>
//         </div>
//       </div>
      
//       <div className="flex items-center gap-3 -translate-y-6 translate-x-4">
//         <span className="font-medium">Follow us on</span>
//         <a
//           href="https://www.facebook.com"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="hover:text-blue-500 bg-blue-700"
//         >
//           <FaFacebookF className="text-xl" />
//         </a>
//         <a
//           href="https://www.twitter.com"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="hover:text-blue-400 bg-blue-700"
//         >
//           <FaTwitter className="text-xl" />
//         </a>
//         <a
//           href="https://www.instagram.com"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="hover:text-pink-500 bg-pink-500"
//         >
//           <FaInstagram className="text-xl" />
//         </a>
//         <a
//           href="https://www.youtube.com"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="hover:text-red-500 bg-red-700"
//         >
//           <FaYoutube className="text-xl" />
//         </a>
//       </div>

//       {/* Bottom Bar */}
//       <div className="bg-gray-500 py-4 px-6 text-sm">
//         <div className="max-w-7xl mx-auto flex justify-center items-center">
//           <p className="text-center">
//             Copyright@2025, <span className='text-black font-bold'>First</span> <span className='text-red-900 font-bold'>Marriage </span>All rights reserved
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;



import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaPinterestP,
  FaWhatsapp,
  FaTelegramPlane,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaArrowRight,
  FaHeart,
  FaShieldAlt,
  FaAward,
  FaUsers,
} from 'react-icons/fa';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  const currentYear = new Date().getFullYear();

  // Quick Links
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Membership', path: '/memb' },
    { name: 'Success Stories', path: '/#stories' },
  ];

  // Services
  const services = [
    { name: 'Advanced Search', path: '/sol' },
    { name: 'Premium Plans', path: '/memb' },
    { name: 'My Matches', path: '/mymatch' },
    { name: 'My Profile', path: '/myprofile' },
    { name: 'Notifications', path: '/notifications' },
  ];

  // Legal Links
  const legalLinks = [
    { name: 'Terms of Use', path: '/terms' },
    { name: 'Privacy Policy', path: '/priv' },
    { name: 'Cancellation & Refund', path: '/ref' },
    { name: 'Cyber Security', path: '/cyb' },
    { name: 'Fraud Alert', path: '/fraud' },
  ];

  // Social Links
  const socialLinks = [
    { icon: <FaFacebookF />, url: 'https://www.facebook.com', color: 'hover:bg-blue-600', name: 'Facebook' },
    { icon: <FaTwitter />, url: 'https://www.twitter.com', color: 'hover:bg-sky-500', name: 'Twitter' },
    { icon: <FaInstagram />, url: 'https://www.instagram.com', color: 'hover:bg-pink-600', name: 'Instagram' },
    { icon: <FaYoutube />, url: 'https://www.youtube.com', color: 'hover:bg-red-600', name: 'YouTube' },
    { icon: <FaLinkedinIn />, url: 'https://www.linkedin.com', color: 'hover:bg-blue-700', name: 'LinkedIn' },
    { icon: <FaPinterestP />, url: 'https://www.pinterest.com', color: 'hover:bg-red-500', name: 'Pinterest' },
    { icon: <FaWhatsapp />, url: 'https://wa.me/919040170727', color: 'hover:bg-green-600', name: 'WhatsApp' },
    { icon: <FaTelegramPlane />, url: 'https://t.me/firstmarriage', color: 'hover:bg-sky-400', name: 'Telegram' },
  ];

  // Trust Badges
  const trustBadges = [
    { icon: <FaShieldAlt className="text-green-400" />, label: 'SSL Secured' },
    { icon: <FaAward className="text-amber-400" />, label: 'Award Winning' },
    { icon: <FaUsers className="text-blue-400" />, label: '35M+ Users' },
    { icon: <FaHeart className="text-rose-400" />, label: '5M+ Matches' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Top Decorative Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-pink-500"></div>

      {/* ==================== NEWSLETTER SECTION ==================== */}
      <div className="relative border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-1">
                Stay <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">Updated</span>
              </h3>
              <p className="text-gray-400 text-sm">
                Subscribe to get matchmaking tips and success stories directly in your inbox
              </p>
            </div>
            
            <div className="w-full md:w-auto">
              {subscribed ? (
                <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-xl px-6 py-3.5 text-green-400 font-semibold">
                  <FaHeart className="animate-pulse" />
                  <span>Thanks for subscribing!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full sm:w-72 px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300"
                  />
                  <button
                    type="submit"
                    className="group whitespace-nowrap px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-rose-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Subscribe
                    <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ==================== MAIN FOOTER CONTENT ==================== */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* ============ BRAND SECTION ============ */}
          <div className="lg:col-span-4 space-y-6">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                <FaHeart className="text-white text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                  First Marriage
                </h2>
                <p className="text-xs text-gray-400 tracking-wider uppercase">Trusted Matrimony</p>
              </div>
            </Link>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed">
              India's most trusted matrimony service connecting millions of verified profiles.
              We blend tradition with modern technology to help you find your perfect life partner.
            </p>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {trustBadges.map((badge, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg"
                >
                  {badge.icon}
                  <span className="text-xs text-gray-300 font-medium">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ============ QUICK LINKS ============ */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-to-b from-rose-400 to-pink-500 rounded-full"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="group flex items-center text-gray-400 hover:text-rose-400 text-sm transition-all duration-300"
                  >
                    <span className="w-0 h-0.5 bg-rose-400 mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300 rounded-full"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ============ SERVICES ============ */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-to-b from-amber-400 to-rose-500 rounded-full"></span>
              Services
            </h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <Link
                    to={service.path}
                    className="group flex items-center text-gray-400 hover:text-amber-400 text-sm transition-all duration-300"
                  >
                    <span className="w-0 h-0.5 bg-amber-400 mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300 rounded-full"></span>
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ============ LEGAL ============ */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-full"></span>
              Legal
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="group flex items-center text-gray-400 hover:text-blue-400 text-sm transition-all duration-300"
                  >
                    <span className="w-0 h-0.5 bg-blue-400 mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300 rounded-full"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ============ CONTACT INFO ============ */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full"></span>
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 group-hover:bg-green-500/20 transition-colors">
                  <FaMapMarkerAlt className="text-xs" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Location</p>
                  <p className="text-sm text-gray-300 leading-snug">
                    BMC Bhawani Mall, Saheed Nagar, Bhubaneswar, Odisha
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                  <FaPhoneAlt className="text-xs" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                  <a href="tel:+919040170727" className="text-sm text-gray-300 hover:text-blue-400 transition-colors">
                    +91-9040170727
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:bg-rose-500/20 transition-colors">
                  <FaEnvelope className="text-xs" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Email</p>
                  <a href="mailto:support@firstmarriage.online" className="text-sm text-gray-300 hover:text-rose-400 transition-colors break-all">
                    support@firstmarriage.online
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 transition-colors">
                  <FaClock className="text-xs" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Working Hours</p>
                  <p className="text-sm text-gray-300">Mon-Sat: 9 AM - 8 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* ==================== SOCIAL LINKS SECTION ==================== */}
        <div className="mt-14 pt-10 border-t border-white/10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h4 className="text-white font-bold text-lg mb-1">Follow Us</h4>
              <p className="text-gray-400 text-sm">Connect with us on social media for updates and tips</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  title={social.name}
                  className={`w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white ${social.color} transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ==================== APP DOWNLOAD SECTION ==================== */}
      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h4 className="text-white font-bold text-lg mb-1">📱 Download Our App</h4>
              <p className="text-gray-400 text-sm">Get the best experience on mobile</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="#"
                className="flex items-center gap-3 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300 hover:-translate-y-0.5 group"
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <p className="text-[10px] text-gray-400 leading-tight">Download on the</p>
                  <p className="text-white font-semibold text-sm leading-tight">App Store</p>
                </div>
              </a>

              <a
                href="#"
                className="flex items-center gap-3 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300 hover:-translate-y-0.5 group"
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className="text-left">
                  <p className="text-[10px] text-gray-400 leading-tight">Get it on</p>
                  <p className="text-white font-semibold text-sm leading-tight">Google Play</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== BOTTOM COPYRIGHT BAR ==================== */}
      <div className="relative bg-slate-950/50 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">

            {/* Copyright */}
            <p className="text-sm text-gray-400">
              © {currentYear}{' '}
              <span className="font-bold text-white">First</span>{' '}
              <span className="font-bold text-rose-500">Marriage</span>. All rights reserved.
            </p>

            {/* Made With Love */}
            <p className="text-sm text-gray-500 flex items-center gap-1.5">
              Made with{' '}
              <FaHeart className="text-rose-500 animate-pulse" />
              {' '}in India
            </p>

            {/* Bottom Links */}
            <div className="flex items-center gap-4 text-sm">
              <Link to="/terms" className="text-gray-400 hover:text-rose-400 transition-colors">
                Terms
              </Link>
              <span className="text-gray-600">•</span>
              <Link to="/priv" className="text-gray-400 hover:text-rose-400 transition-colors">
                Privacy
              </Link>
              <span className="text-gray-600">•</span>
              <Link to="/contact" className="text-gray-400 hover:text-rose-400 transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style>{`
        @keyframes pulse-heart {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        .animate-pulse {
          animation: pulse-heart 1.5s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
