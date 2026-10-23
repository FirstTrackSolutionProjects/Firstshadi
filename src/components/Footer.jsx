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

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Contact Us', path: '/contact' },
  { name: 'Membership', path: '/memb' },
  { name: 'Success Stories', path: '/#stories' },
];

const services = [
  { name: 'Advanced Search', path: '/sol' },
  { name: 'Premium Plans', path: '/memb' },
  { name: 'My Matches', path: '/mymatch' },
  { name: 'My Profile', path: '/myprofile' },
  { name: 'Notifications', path: '/notifications' },
];

const legalLinks = [
  { name: 'Terms of Use', path: '/terms' },
  { name: 'Privacy Policy', path: '/priv' },
  { name: 'Cancellation & Refund', path: '/ref' },
  { name: 'Cyber Security', path: '/cyb' },
  { name: 'Fraud Alert', path: '/fraud' },
];

const socialLinks = [
  { icon: <FaFacebookF className="h-4 w-4" />, url: 'https://www.facebook.com', name: 'Facebook' },
  { icon: <FaTwitter className="h-4 w-4" />, url: 'https://www.twitter.com', name: 'Twitter' },
  { icon: <FaInstagram className="h-4 w-4" />, url: 'https://www.instagram.com', name: 'Instagram' },
  { icon: <FaYoutube className="h-4 w-4" />, url: 'https://www.youtube.com', name: 'YouTube' },
  { icon: <FaLinkedinIn className="h-4 w-4" />, url: 'https://www.linkedin.com', name: 'LinkedIn' },
  { icon: <FaPinterestP className="h-4 w-4" />, url: 'https://www.pinterest.com', name: 'Pinterest' },
  { icon: <FaWhatsapp className="h-4 w-4" />, url: 'https://wa.me/919040170727', name: 'WhatsApp' },
  { icon: <FaTelegramPlane className="h-4 w-4" />, url: 'https://t.me/firstmarriage', name: 'Telegram' },
];

const trustBadges = [
  { icon: <FaShieldAlt className="h-4 w-4" />, label: 'SSL Secured' },
  { icon: <FaAward className="h-4 w-4" />, label: 'Award Winning' },
  { icon: <FaUsers className="h-4 w-4" />, label: '35M+ Users' },
  { icon: <FaHeart className="h-4 w-4" />, label: '5M+ Matches' },
];

const LinkColumn = ({ title, links }) => (
  <div>
    <h3 className="mb-6 flex items-center gap-2.5 text-base font-bold text-white">
      <span className="h-2 w-2 rotate-45 bg-[#e0b46a]" />
      {title}
    </h3>
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.name}>
          <Link
            to={link.path}
            className="group inline-flex items-center text-sm text-white/65 transition-all duration-300 hover:text-[#f3d79e]"
          >
            <FaArrowRight className="h-0 w-0 -translate-x-2 text-[#e0b46a] opacity-0 transition-all duration-300 group-hover:mr-2 group-hover:h-3 group-hover:w-3 group-hover:translate-x-0 group-hover:opacity-100" />
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

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

  return (
    <footer className="relative overflow-hidden bg-[#2b0a12] text-white">
      <style>{`
        @keyframes fmHeartBeat { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
        .fm-heartbeat { animation: fmHeartBeat 1.5s ease-in-out infinite; }
      `}</style>

      {/* background glows */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(159,18,57,0.35)_0%,transparent_65%)]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-rose-800/20 blur-3xl" />
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#e0b46a]/10 blur-3xl" />

      {/* top gold line */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-800 via-[#e0b46a] to-rose-800" />

      {/* ==================== NEWSLETTER ==================== */}
      <div className="relative mx-auto max-w-7xl px-4 pt-14 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md md:p-10">
          <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#e0b46a]/20 blur-3xl" />
          <div className="relative flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#f3d79e] ring-1 ring-white/20">
                <FaEnvelope className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold">
                  Stay <span className="italic text-[#f3d79e]">Updated</span>
                </h3>
                <p className="mt-1 text-sm text-white/65">
                  Subscribe to get matchmaking tips and success stories directly in your inbox
                </p>
              </div>
            </div>

            <div className="w-full md:w-auto">
              {subscribed ? (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 font-semibold text-[#f3d79e]">
                  <FaHeart className="fm-heartbeat h-4 w-4" />
                  <span>Thanks for subscribing!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-white placeholder-white/40 transition-all duration-300 focus:border-[#e0b46a] focus:outline-none focus:ring-2 focus:ring-[#e0b46a]/30 sm:w-72"
                  />
                  <button
                    type="submit"
                    className="group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#e0b46a] px-6 py-3.5 font-semibold text-rose-900 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f3d79e] hover:shadow-xl"
                  >
                    Subscribe
                    <FaArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* brand */}
          <div className="space-y-6 lg:col-span-4">
            <Link to="/" className="group inline-flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-rose-800/50 via-[#e0b46a]/40 to-rose-800/50 blur-lg" />
                <img
                  src="/image/l2.png"
                  alt="First Marriage Logo"
                  className="relative h-16 w-16 rounded-full bg-white object-contain p-1 ring-2 ring-[#e0b46a]/60 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-white">
                  First <span className="italic text-[#f3d79e]">Marriage</span>
                </h2>
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/50">Trusted Matrimony</p>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-white/65">
              India's most trusted matrimony service connecting millions of verified profiles. We blend
              tradition with modern technology to help you find your perfect life partner.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {trustBadges.map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#e0b46a]/40 hover:bg-white/10"
                >
                  <span className="text-[#e0b46a]">{badge.icon}</span>
                  <span className="text-xs font-medium text-white/80">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <LinkColumn title="Quick Links" links={quickLinks} />
          </div>
          <div className="lg:col-span-2">
            <LinkColumn title="Services" links={services} />
          </div>
          <div className="lg:col-span-2">
            <LinkColumn title="Legal" links={legalLinks} />
          </div>

          {/* contact */}
          <div className="lg:col-span-2">
            <h3 className="mb-6 flex items-center gap-2.5 text-base font-bold text-white">
              <span className="h-2 w-2 rotate-45 bg-[#e0b46a]" />
              Contact
            </h3>
            <ul className="space-y-5">
              {[
                {
                  icon: <FaMapMarkerAlt className="h-3.5 w-3.5" />,
                  label: 'Location',
                  content: (
                    <p className="text-sm leading-snug text-white/75">
                      BMC Bhawani Mall, Saheed Nagar, Bhubaneswar, Odisha
                    </p>
                  ),
                },
                {
                  icon: <FaPhoneAlt className="h-3.5 w-3.5" />,
                  label: 'Phone',
                  content: (
                    <a href="tel:+919040170727" className="text-sm text-white/75 transition-colors hover:text-[#f3d79e]">
                      +91-9040170727
                    </a>
                  ),
                },
                {
                  icon: <FaEnvelope className="h-3.5 w-3.5" />,
                  label: 'Email',
                  content: (
                    <a
                      href="mailto:support@firstmarriage.online"
                      className="break-all text-sm text-white/75 transition-colors hover:text-[#f3d79e]"
                    >
                      support@firstmarriage.online
                    </a>
                  ),
                },
                {
                  icon: <FaClock className="h-3.5 w-3.5" />,
                  label: 'Working Hours',
                  content: <p className="text-sm text-white/75">Mon-Sat: 9 AM - 8 PM</p>,
                },
              ].map((item) => (
                <li key={item.label} className="group flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-[#e0b46a]/30 bg-[#e0b46a]/10 text-[#e0b46a] transition-all duration-300 group-hover:bg-[#e0b46a] group-hover:text-rose-900">
                    {item.icon}
                  </div>
                  <div>
                    <p className="mb-0.5 text-[11px] uppercase tracking-wider text-white/40">{item.label}</p>
                    {item.content}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* social + app */}
        <div className="mt-14 grid gap-8 border-t border-white/10 pt-10 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <h4 className="mb-1 text-lg font-bold">Follow Us</h4>
            <p className="mb-5 text-sm text-white/55">Connect with us on social media for updates and tips</p>
            <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  title={social.name}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition-all duration-300 hover:-translate-y-1 hover:border-[#e0b46a] hover:bg-[#e0b46a] hover:text-rose-900 hover:shadow-lg hover:shadow-[#e0b46a]/20"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="text-center lg:text-right">
            <h4 className="mb-1 text-lg font-bold">Download Our App</h4>
            <p className="mb-5 text-sm text-white/55">Get the best experience on mobile</p>
            <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-end">
              <a
                href="#"
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#e0b46a]/50 hover:bg-white/10"
              >
                <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <p className="text-[10px] leading-tight text-white/50">Download on the</p>
                  <p className="text-sm font-semibold leading-tight text-white">App Store</p>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#e0b46a]/50 hover:bg-white/10"
              >
                <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <div className="text-left">
                  <p className="text-[10px] leading-tight text-white/50">Get it on</p>
                  <p className="text-sm font-semibold leading-tight text-white">Google Play</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== BOTTOM BAR ==================== */}
      <div className="relative border-t border-white/10 bg-black/30 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 text-center sm:px-6 md:flex-row md:text-left">
          <p className="text-sm text-white/55">
            © {currentYear} <span className="font-bold text-white">First</span>{' '}
            <span className="font-bold text-[#f3d79e]">Marriage</span>. All rights reserved.
          </p>

          <p className="flex items-center gap-1.5 text-sm text-white/45">
            Made with <FaHeart className="fm-heartbeat h-3.5 w-3.5 text-rose-500" /> in India
          </p>

          <div className="flex items-center gap-4 text-sm">
            <Link to="/terms" className="text-white/55 transition-colors hover:text-[#f3d79e]">Terms</Link>
            <span className="text-white/20">•</span>
            <Link to="/priv" className="text-white/55 transition-colors hover:text-[#f3d79e]">Privacy</Link>
            <span className="text-white/20">•</span>
            <Link to="/contact" className="text-white/55 transition-colors hover:text-[#f3d79e]">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;