import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiLock, FiCreditCard, FiActivity, FiKey, FiAlertTriangle, FiUsers, FiArrowRight } from 'react-icons/fi';
import Footer from '../components/Footer';

const sections = [
  {
    icon: <FiLock />,
    title: 'Data Protection',
    text: 'We prioritize the protection of your personal and financial data through encryption, secure servers, and advanced cybersecurity protocols.',
  },
  {
    icon: <FiCreditCard />,
    title: 'Secure Transactions',
    text: 'All payment transactions are processed through secure and trusted platforms with end-to-end encryption to prevent unauthorized access.',
  },
  {
    icon: <FiActivity />,
    title: 'Threat Monitoring',
    text: 'Our systems are continuously monitored for suspicious activities, and we employ advanced threat detection tools to proactively respond to potential risks.',
  },
  {
    icon: <FiKey />,
    title: 'Account Security',
    text: 'We encourage users to use strong, unique passwords and offer two-factor authentication (2FA) to enhance account protection.',
  },
  {
    icon: <FiAlertTriangle />,
    title: 'Incident Response',
    text: 'In the event of a cybersecurity breach, we have an incident response plan to immediately contain, investigate, and resolve any threats while keeping affected users informed.',
  },
];

const roleSection = {
  title: 'Your Role in Security',
  text: 'We recommend that users regularly update passwords, avoid sharing login details, and report any suspicious activities immediately to our support team.',
};

const Cyb = () => {
  return (
    <div className="bg-slate-50">
      {/* HERO */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-950 via-red-900 to-red-700 text-white px-4 pt-14 pb-28 sm:pt-16 sm:pb-32">
        <div className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-pink-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-rose-400/20 blur-3xl" />

        <div className="relative max-w-3xl mx-auto text-center">
          <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur text-3xl ring-1 ring-white/30">
            <FiShield />
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Cyber Security</h1>
          <p className="mt-3 text-rose-100 text-sm sm:text-base max-w-xl mx-auto">
            How we protect your data, payments and account.
          </p>
        </div>
      </div>

      {/* CARDS */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-16 pb-14 font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {sections.map((s, i) => (
            <div
              key={s.title}
              className="group relative bg-white p-6 rounded-2xl shadow-md shadow-slate-200 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-700 text-xl group-hover:bg-red-700 group-hover:text-white transition-colors">
                  {s.icon}
                </span>
                <div className="min-w-0">
                  <h2 className="text-blue-900 font-bold text-lg leading-snug">
                    <span className="text-red-700">{i + 1}.</span> {s.title}
                  </h2>
                  <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-gray-700">{s.text}</p>
                </div>
              </div>
              <span className="absolute left-6 right-6 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-red-700 to-pink-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </div>
          ))}

          {/* 6 - highlighted */}
          <div className="md:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-900 to-red-700 text-white p-6 sm:p-8 shadow-xl shadow-red-200">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl ring-1 ring-white/30">
                <FiUsers />
              </span>
              <div className="flex-1">
                <h2 className="font-bold text-xl">
                  <span className="text-rose-200">6.</span> {roleSection.title}
                </h2>
                <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-rose-50">{roleSection.text}</p>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 shrink-0 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-red-800 shadow-md hover:bg-rose-50 hover:-translate-y-0.5 transition"
              >
                Report an issue <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cyb;