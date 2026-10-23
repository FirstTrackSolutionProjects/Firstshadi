import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartIcon, ShieldCheckIcon, UserGroupIcon } from '@heroicons/react/24/solid';

const Trst = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <HeartIcon className="h-7 w-7" />,
      title: 'Best Matches',
      description: 'AI-powered matchmaking to find your ideal partner.',
    },
    {
      icon: <ShieldCheckIcon className="h-7 w-7" />,
      title: 'Verified Profiles',
      description: 'Manually verified profiles for your safety and trust.',
    },
    {
      icon: <UserGroupIcon className="h-7 w-7" />,
      title: '35M+ Members',
      description: 'Join a vast community of members seeking true love.',
    },
  ];

  const countries = ['India', 'USA', 'UK', 'Canada', 'UAE'];

  return (
    <section className="relative overflow-hidden bg-[#faf7f5] px-4 py-20">
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-rose-100/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#e0b46a]/15 blur-3xl" />

      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-2xl shadow-rose-100/60 md:p-12">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-800 via-[#e0b46a] to-rose-800" />

        {/* Logo */}
        <div className="relative mx-auto mb-4 inline-flex">
          <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-rose-800/30 via-[#e0b46a]/30 to-rose-800/30 blur-xl" />
          <img
            src="/image/l2.png"
            alt="FirstMarriage Logo"
            className="relative h-20 w-20 rounded-full bg-white object-contain p-1 shadow-lg ring-2 ring-rose-100"
          />
        </div>

        <h1 className="font-display text-4xl font-bold text-rose-800 md:text-5xl">First Marriage</h1>
        <div className="my-4 flex items-center justify-center gap-3">
          <span className="h-px w-14 bg-gradient-to-r from-transparent to-[#e0b46a]" />
          <span className="h-1.5 w-1.5 rotate-45 bg-[#e0b46a]" />
          <span className="h-px w-14 bg-gradient-to-l from-transparent to-[#e0b46a]" />
        </div>
        <p className="mb-4 text-lg font-medium text-gray-700">India's Most Trusted Matrimony Service</p>

        <p className="mx-auto mb-8 max-w-3xl leading-relaxed text-gray-600">
          Created with a heartfelt mission to unite individuals in the sacred journey of lifelong
          companionship. We blend tradition with modern technology on a secure, user-friendly
          platform, helping thousands find their perfect match.
        </p>

        <button
          onClick={() => navigate('/memb')}
          className="group inline-flex items-center gap-2 rounded-xl bg-rose-800 px-8 py-3.5 font-semibold text-white shadow-lg shadow-rose-800/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-900 hover:shadow-xl hover:shadow-rose-800/40 focus:outline-none focus:ring-2 focus:ring-rose-800 focus:ring-offset-2"
        >
          Explore Membership Plans
          <svg
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>

        {/* Features */}
        <div className="mt-10 grid grid-cols-1 gap-6 border-t border-gray-100 pt-10 sm:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-transparent p-4 transition-all duration-300 hover:-translate-y-1 hover:border-rose-100 hover:bg-[#faf7f5]"
            >
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100 text-rose-800 ring-1 ring-rose-100 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:from-rose-800 group-hover:to-rose-900 group-hover:text-white">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Country links */}
        <div className="mt-10 border-t border-gray-100 pt-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Find Matches from</p>
          <div className="flex flex-wrap justify-center gap-2">
            {countries.map((c) => (
              <a
                key={c}
                href="#"
                className="rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-800"
              >
                {c}
              </a>
            ))}
            <a
              href="#"
              className="rounded-full border border-rose-800 bg-rose-800 px-4 py-1.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-rose-900"
            >
              More ▸
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Trst;