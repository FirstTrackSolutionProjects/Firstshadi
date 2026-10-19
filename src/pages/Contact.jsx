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

/* ------------------------------ DATA ------------------------------ */

const INFO = [
  { icon: <PinIcon />, label: 'Address', value: 'BMC Bhawani Mall, Saheed Nagar Bhubaneswar, Odisha-751007' },
  { icon: <PhoneIcon />, label: 'Phone', value: '+91-9040170727', href: 'tel:+919040170727' },
  { icon: <MailIcon />, label: 'Email', value: 'support@firstmarriage.online', href: 'mailto:support@firstmarriage.online' },
  { icon: <ClockIcon />, label: 'Working Hours', value: 'Mon-Fri: 9 AM - 6 PM' },
];

const inputClass =
  'w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 bg-white ' +
  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition';

/* ------------------------------ COMPONENT ------------------------------ */

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* HEADING */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-red-700 mb-3">Contact Us</h1>
          <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-red-900" />
          <p className="text-gray-800 text-lg">
            We're here to help! Feel free to reach out to us with any questions or concerns.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* LEFT: IMAGE + INFO */}
          <div className="lg:col-span-2 space-y-6">
            <img
              src="/image/s16.png"
              alt="Customer Support"
              className="w-full h-72 sm:h-80 object-cover rounded-2xl shadow-lg"
            />

            <div className="bg-red-900 text-white p-6 sm:p-8 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold mb-5 text-red-600">Contact Information</h2>
              <ul className="space-y-5">
                {INFO.map(({ icon, label, value, href }) => (
                  <li key={label} className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                      {icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white/70">{label}</p>
                      {href ? (
                        <a href={href} className="font-medium text-white break-words hover:underline">
                          {value}
                        </a>
                      ) : (
                        <p className="font-medium text-white break-words">{value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT: FORM */}
          <div className="lg:col-span-3">
            <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-10 border-t-4 border-red-900">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Send us a message</h2>
              <p className="text-gray-600 mb-6">We'll get back to you as soon as possible.</p>

              {status === 'success' && (
                <div role="status" className="flex items-start gap-3 w-full p-4 mb-6 rounded-lg bg-green-100 text-green-700">
                  <CheckIcon />
                  <span>Message sent successfully. We'll be in touch.</span>
                </div>
              )}
              {status === 'error' && (
                <div role="alert" className="flex items-start gap-3 w-full p-4 mb-6 rounded-lg bg-red-100 text-red-700">
                  <AlertIcon />
                  <span>Failed to send message. Please try again.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block mb-1.5 text-sm font-medium text-gray-700">Your Name</label>
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
                    <label htmlFor="email" className="block mb-1.5 text-sm font-medium text-gray-700">Your Email</label>
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
                  <label htmlFor="message" className="block mb-1.5 text-sm font-medium text-gray-700">Your Message</label>
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
                  className="w-full flex items-center justify-center gap-2 bg-red-900 text-white font-semibold py-3.5 rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
      <Footer />
    </div>
  );
};

export default Contact;