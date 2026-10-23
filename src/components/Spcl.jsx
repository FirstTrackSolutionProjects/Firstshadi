import React from 'react';
import { useNavigate } from 'react-router-dom';

const IconDocument = () => (
  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);



const SoulmateSteps = () => {
  const navigate = useNavigate();

  const steps = [
    {
      id: 1,
      icon: <IconDocument />,
      title: 'Sign Up',
      description: 'Register Your Profile',
      route: '/box',
    },
    {
      id: 2,
      icon: <span className="text-5xl leading-none">💑</span>,
      title: 'Connect',
      description: 'Select & Connect with Matches you like',
      route: '/ncon',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#faf7f5] px-4 py-24">
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-rose-100/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#e0b46a]/15 blur-3xl" />

      <div className="relative mx-auto max-w-5xl text-center">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-800 shadow-sm">
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          Get Started
        </span>
        <h2 className="font-display mb-4 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
          Find Your <span className="italic text-rose-800">Soulmate</span>
        </h2>
        <div className="mb-5 flex items-center justify-center gap-3">
          <span className="h-px w-14 bg-gradient-to-r from-transparent to-[#e0b46a]" />
          <span className="h-1.5 w-1.5 rotate-45 bg-[#e0b46a]" />
          <span className="h-px w-14 bg-gradient-to-l from-transparent to-[#e0b46a]" />
        </div>
        <p className="mx-auto mb-16 max-w-2xl text-gray-600">
          Your journey to finding true love starts here. Follow these simple steps to begin.
        </p>

        <div className="relative grid grid-cols-1 gap-10 md:grid-cols-2">
          {/* connector between the two cards */}
          <div className="absolute left-1/4 right-1/4 top-14 hidden border-t-2 border-dashed border-rose-300 md:block" />

          {steps.map(({ id, icon, title, description, route }) => (
            <div
              key={id}
              onClick={() => navigate(route)}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 text-center transition-all duration-500 hover:-translate-y-2 hover:border-rose-200 hover:shadow-2xl hover:shadow-rose-100"
            >
              <div className="absolute inset-x-0 top-0 h-1 origin-center scale-x-0 bg-gradient-to-r from-rose-800 via-[#e0b46a] to-rose-800 transition-transform duration-500 group-hover:scale-x-100" />
              <span className="absolute right-5 top-3 select-none font-display text-6xl font-bold text-gray-100 transition-colors duration-500 group-hover:text-rose-100">
                0{id}
              </span>
              <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-rose-100/0 blur-2xl transition-all duration-500 group-hover:bg-rose-100/80" />

              <div className="relative">
                <div className="relative mx-auto mb-6 inline-flex">
                  <div className="absolute inset-0 rounded-full bg-rose-800/30 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
                                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-rose-50 to-rose-100 text-rose-800 shadow-lg shadow-rose-200 ring-4 ring-white transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                    {icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
                <p className="mt-2 text-gray-600">{description}</p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-rose-800 opacity-0 -translate-x-2 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                  Continue
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SoulmateSteps;