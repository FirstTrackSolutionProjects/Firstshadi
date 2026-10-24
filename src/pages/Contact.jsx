import React, { useState } from 'react';
import Footer from '../components/Footer';
import { api } from '../services/api';

/* ------------------------------ ICONS ------------------------------ */

const iconProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const PinIcon = () => (
  <svg {...iconProps}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PhoneIcon = () => (
  <svg {...iconProps}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.62a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.46-1.19a2 2 0 0 1 2.11-.45c.84.29 1.72.5 2.62.62A2 2 0 0 1 22 16.92Z" />
  </svg>
);

const MailIcon = () => (
  <svg {...iconProps}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </svg>
);

const ClockIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CheckIcon = () => (
  <svg {...iconProps}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const AlertIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const SendIcon = () => (
  <svg {...iconProps} width={18} height={18}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const BoltIcon = () => (
  <svg {...iconProps}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const ShieldIcon = () => (
  <svg {...iconProps}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const HeartIcon = () => (
  <svg {...iconProps}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

/* ------------------------------ DATA ------------------------------ */

const INFO = [
  { icon: <PinIcon />, label: 'Address', value: 'BMC Bhawani Mall, Saheed Nagar Bhubaneswar, Odisha-751007' },
  { icon: <PhoneIcon />, label: 'Phone', value: '+91-9040170727', href: 'tel:+919040170727' },
  { icon: <MailIcon />, label: 'Email', value: 'support@firstmarriage.online', href: 'mailto:support@firstmarriage.online' },
  { icon: <ClockIcon />, label: 'Working Hours', value: 'Mon-Fri: 9 AM - 6 PM' },
];

const POINTS = [
  { icon: <BoltIcon />, title: 'Fast Response', text: 'We usually reply within one working day.' },
  { icon: <ShieldIcon />, title: 'Your Data is Safe', text: 'Your details are never shared with anyone.' },
  { icon: <HeartIcon />, title: 'Friendly Support', text: 'Real people who care about your journey.' },
];

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-gray-800 placeholder-gray-400 ' +
  'transition-all hover:border-rose-300 hover:bg-white ' +
  'focus:border-rose-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-800/20';

/* ------------------------------ COMPONENT ------------------------------ */

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus('');
    try {
      const res = await api.post('/contact', formData);
      if (res.success) {
        setStatus('success');

        // Also offer WhatsApp
        const phone = '+919040170727';
        const message = encodeURIComponent(
          `Hello! I need help with FirstMarriage.com.\n\n` +
          `Name: ${formData.name}\n` +
          `Email: ${formData.email}\n` +
          `Message: ${formData.message}`
        );
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');

        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="relative overflow-hidden bg-[#faf7f5]">
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-rose-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#e0b46a]/15 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-16">
          {/* HEADING */}
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-800 shadow-sm">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              Get In Touch
            </span>
            <h1 className="font-display text-4xl font-bold text-gray-900 sm:text-5xl">
              Contact <span className="italic text-rose-800">Us</span>
            </h1>
            <div className="my-5 flex items-center justify-center gap-3">
              <span className="h-px w-14 bg-gradient-to-r from-transparent to-[#e0b46a]" />
              <span className="h-1.5 w-1.5 rotate-45 bg-[#e0b46a]" />
              <span className="h-px w-14 bg-gradient-to-l from-transparent to-[#e0b46a]" />
            </div>
            <p className="text-lg text-gray-600">
              We're here to help! Feel free to reach out to us with any questions or concerns.
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-5">
            {/* LEFT: IMAGE + INFO */}
            <div className="space-y-6 lg:col-span-2">
              <div className="group relative overflow-hidden rounded-3xl shadow-xl shadow-rose-100/60">
                <img
                  src="/image/s16.png"
                  alt="Customer Support"
                  className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3b0a18]/80 via-transparent to-transparent" />
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-800 via-[#e0b46a] to-rose-800" />
                <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                  </span>
                  We reply fast
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-800 via-rose-800 to-rose-900 p-6 text-white shadow-2xl shadow-rose-200 ring-1 ring-[#e0b46a]/50 sm:p-8">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-800 via-[#e0b46a] to-rose-800" />
                <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#e0b46a]/25 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

                <div className="relative">
                  <h2 className="mb-6 font-display text-2xl font-bold">
                    Contact <span className="italic text-[#f3d79e]">Information</span>
                  </h2>
                  <ul className="space-y-5">
                    {INFO.map(({ icon, label, value, href }) => (
                      <li key={label} className="group flex items-start gap-4">
                        <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-[#f3d79e] ring-1 ring-white/25 transition-all duration-300 group-hover:bg-[#e0b46a] group-hover:text-rose-900">
                          {icon}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wider text-white/60">{label}</p>
                          {href ? (
                            <a href={href} className="break-words font-medium text-white transition-colors hover:text-[#f3d79e]">
                              {value}
                            </a>
                          ) : (
                            <p className="break-words font-medium text-white">{value}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* RIGHT: FORM */}
            <div className="lg:col-span-3">
              <div className="relative overflow-hidden rounded-3xl border border-rose-100 bg-white p-6 shadow-2xl shadow-rose-100/60 sm:p-10">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-800 via-[#e0b46a] to-rose-800" />

                <h2 className="mb-1 font-display text-2xl font-bold text-gray-900">
                  Send us a <span className="italic text-rose-800">message</span>
                </h2>
                <p className="mb-6 text-gray-600">We'll get back to you as soon as possible.</p>

                {status === 'success' && (
                  <div
                    role="status"
                    className="mb-6 flex w-full items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700"
                  >
                    <CheckIcon />
                    <span>Message sent successfully. We'll be in touch.</span>
                  </div>
                )}
                {status === 'error' && (
                  <div
                    role="alert"
                    className="mb-6 flex w-full items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800"
                  >
                    <AlertIcon />
                    <span>Failed to send message. Please try again.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                        Your Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Your Name"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                        Your Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Your Email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      rows="6"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className={`${inputClass} resize-none`}
                      placeholder="Your Message"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-800 py-3.5 font-semibold text-white shadow-lg shadow-rose-800/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-900 hover:shadow-xl hover:shadow-rose-800/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {submitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        SENDING...
                      </>
                    ) : (
                      <>
                        <SendIcon />
                        SUBMIT
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* QUICK POINTS */}
          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {POINTS.map((p) => (
              <div
                key={p.title}
                className="group rounded-2xl border border-gray-200 bg-white p-6 text-center transition-all duration-500 hover:-translate-y-1.5 hover:border-rose-200 hover:shadow-xl hover:shadow-rose-100"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-50 to-rose-100 text-rose-800 ring-1 ring-rose-100 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:from-rose-800 group-hover:to-rose-900 group-hover:text-white">
                  {p.icon}
                </div>
                <p className="font-semibold text-gray-900">{p.title}</p>
                <p className="mt-1 text-sm text-gray-600">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;