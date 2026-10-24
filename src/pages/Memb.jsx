import React from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon,
  ArrowRightIcon,
  LockClosedIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/solid';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const Memb = () => {
  const navigate = useNavigate();

  const features = [
    { title: "Explore Profiles", free: true, paid: true },
    { title: "Express Interest", free: true, paid: true },
    { title: "Chat without limits", free: true, paid: true },
    { title: "Receive triple match suggestions", free: true, paid: true },
    { title: "Advanced filter tools", free: true, paid: true },

    { title: "Priority profile highlights", free: true, paid: true },
    { title: "Verified Profile", free: true, paid: true },
    { title: "Access contact info", free: false, paid: true },
    { title: "HD video and voice calls", free: false, paid: true },
  ];

  const freeCount = features.filter((f) => f.free).length;
  const paidCount = features.filter((f) => f.paid).length;

  const handleJoinFree = () => {
    navigate('/grm');
  };

  const handleSeePremiumPlans = () => {
    navigate('/grm');
  };

  return (
    <div>
      <div className="relative min-h-screen overflow-hidden bg-[#faf7f5] px-4 py-16 sm:py-20">
        {/* background glows + dots */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-rose-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#e0b46a]/15 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: 'radial-gradient(#e5d5d9 1px, transparent 1px)',
            backgroundSize: '26px 26px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          }}
        />

        <div className="relative mx-auto max-w-5xl">
          {/* HEADING */}
          <div className="mb-16 text-center">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-800 shadow-sm">
              <SparklesIcon className="h-3 w-3" />
              Membership
            </span>
            <h2 className="font-display text-4xl font-bold text-gray-900 sm:text-5xl">
              Membership <span className="italic text-rose-800">Options</span>
            </h2>
            <div className="my-5 flex items-center justify-center gap-3">
              <span className="h-px w-14 bg-gradient-to-r from-transparent to-[#e0b46a]" />
              <span className="h-1.5 w-1.5 rotate-45 bg-[#e0b46a]" />
              <span className="h-px w-14 bg-gradient-to-l from-transparent to-[#e0b46a]" />
            </div>
            <p className="text-base text-gray-600 sm:text-lg">Pick the plan that fits your connection goals best.</p>
          </div>

          <div className="grid items-stretch gap-8 text-left md:grid-cols-2 lg:gap-10">
            {/* ==================== FREE PLAN ==================== */}
            <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white p-7 transition-all duration-500 hover:-translate-y-2 hover:border-rose-200 hover:shadow-2xl hover:shadow-rose-100 sm:p-9">
              <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-rose-800 via-[#e0b46a] to-rose-800 transition-transform duration-500 group-hover:scale-x-100" />
              <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-rose-100/0 blur-2xl transition-all duration-500 group-hover:bg-rose-100/80" />

              <div className="relative flex items-center justify-between gap-3">
                <h3 className="font-display text-2xl font-bold text-gray-900">Starter Access</h3>
                <span className="rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-800">
                  Free
                </span>
              </div>

              <div className="relative mt-4">
                <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500">
                  <span>{freeCount} of {features.length} features included</span>
                  <span className="font-semibold text-rose-800">{Math.round((freeCount / features.length) * 100)}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-rose-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-800 to-[#e0b46a]"
                    style={{ width: `${(freeCount / features.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

              <ul className="relative space-y-3.5">
                {features.map((item, index) => (
                  <li key={index} className={`flex items-center gap-3 ${item.free ? 'text-gray-800' : 'text-gray-400'}`}>
                    {item.free ? (
                      <CheckCircleIcon className="h-6 w-6 shrink-0 text-rose-800" />
                    ) : (
                      <XCircleIcon className="h-6 w-6 shrink-0 text-gray-300" />
                    )}
                    <span className={item.free ? '' : 'line-through decoration-gray-300'}>{item.title}</span>
                    {!item.free && (
                      <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-[#e0b46a]/15 px-2 py-0.5 text-[10px] font-bold text-[#8a6320]">
                        <LockClosedIcon className="h-3 w-3" />
                        PREMIUM
                      </span>
                    )}
                  </li>
                ))}
              </ul>

              <div className="relative mt-auto pt-8">
                <button
                  onClick={handleJoinFree}
                  className="group/btn flex w-full items-center justify-center gap-2 rounded-xl bg-rose-800 py-3.5 font-semibold text-white shadow-lg shadow-rose-800/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-900 hover:shadow-xl hover:shadow-rose-800/40"
                >
                  Join Free
                  <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>

            {/* ==================== PAID PLAN ==================== */}
            <div className="group relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-rose-800 via-rose-800 to-rose-900 p-7 text-white shadow-2xl shadow-rose-300 ring-1 ring-[#e0b46a]/60 transition-all duration-500 hover:-translate-y-2 sm:p-9 md:-my-3 md:py-12">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-800 via-[#e0b46a] to-rose-800" />
              <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#e0b46a]/25 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-white/10 blur-3xl" />

              <span className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-rose-900 shadow-lg">
                <SparklesIcon className="h-3.5 w-3.5" /> Recommended
              </span>

              <div className="relative flex items-center justify-between gap-3 pr-0 pt-8 sm:pt-0">
                <h3 className="font-display text-2xl font-bold">Complete Access</h3>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white ring-1 ring-white/30">
                  Premium
                </span>
              </div>

              <div className="relative mt-4">
                <div className="mb-1.5 flex items-center justify-between text-xs text-white/70">
                  <span>All {paidCount} features included</span>
                  <span className="font-semibold text-[#f3d79e]">100%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/15">
                  <div className="h-full w-full rounded-full bg-gradient-to-r from-[#e0b46a] to-[#f3d79e]" />
                </div>
              </div>

              <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />

              <ul className="relative space-y-3.5">
                {features.map((item, index) => {
                  const premiumOnly = !item.free && item.paid;
                  return (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircleIcon className={`h-6 w-6 shrink-0 ${premiumOnly ? 'text-[#f3d79e]' : 'text-white/70'}`} />
                      <span className={premiumOnly ? 'font-semibold text-white' : 'text-white/90'}>{item.title}</span>
                      {premiumOnly && (
                        <span className="ml-auto shrink-0 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-extrabold text-rose-900">
                          PREMIUM ONLY
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="relative mt-auto pt-8">
                <button
                  onClick={handleSeePremiumPlans}
                  className="group/btn flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 font-bold text-rose-800 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-50 hover:shadow-xl"
                >
                  See Premium Plans
                  <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          </div>

          {/* trust line */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-500">
            <span className="inline-flex items-center gap-2">
              <LockClosedIcon className="h-4 w-4 text-rose-800" />
              Secure payments
            </span>
            <span className="inline-flex items-center gap-2">
              <SparklesIcon className="h-4 w-4 text-rose-800" />
              Upgrade anytime
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheckIcon className="h-4 w-4 text-rose-800" />
              Verified profiles only
            </span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Memb;