import React from 'react';
import { useNavigate } from 'react-router-dom';

const Pstst = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-white px-4 py-10">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-rose-800 via-rose-800 to-rose-900 px-8 py-10 shadow-2xl shadow-rose-200 ring-1 ring-[#e0b46a]/50 sm:px-12">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-800 via-[#e0b46a] to-rose-800" />
        <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-[#e0b46a]/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
          <div className="flex flex-col items-center gap-5 md:flex-row">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-white/15 text-[#f3d79e] ring-1 ring-white/30">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Your story is waiting to <span className="italic text-[#f3d79e]">happen!</span>
              </h2>
              <p className="mt-1 text-white/75">Join now and start your next great adventure.</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/register')}
            className="group inline-flex flex-shrink-0 items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-rose-800 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-50 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30"
          >
            Get Started
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
        </div>
      </div>
    </section>
  );
};

export default Pstst;