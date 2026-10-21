import React from 'react';
import { CheckCircleIcon, XCircleIcon, SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
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
    { title: "Verified Profile", free: true, paid: true }, // ✅ Added Verified Profile to both
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
      <div className="relative overflow-hidden bg-gradient-to-b from-rose-50 via-gray-100 to-gray-100 min-h-screen py-12 sm:py-16 px-4">
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-[40rem] rounded-full bg-rose-200/40 blur-3xl" />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* HEADING */}
          <span className="inline-block mb-4 px-4 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold tracking-wide">
            MEMBERSHIP
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-red-700 mb-3 tracking-tight">Membership Options</h2>
          <p className="text-blue-900 text-base sm:text-lg mb-12 sm:mb-14">Pick the plan that fits your connection goals best.</p>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-10 items-stretch text-left">
            {/* Free Plan */}
            <div className="flex flex-col bg-white rounded-3xl shadow-lg shadow-slate-200 border border-slate-200 border-t-8 border-t-blue-900 p-7 sm:p-9 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-2xl font-bold text-gray-800">Starter Access</h3>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold">Free</span>
              </div>
              <p className="mt-1 text-sm text-gray-500">{freeCount} of {features.length} features included</p>

              <ul className="mt-6 space-y-3.5">
                {features.map((item, index) => (
                  <li key={index} className={`flex items-center gap-3 ${item.free ? 'text-gray-800' : 'text-gray-400'}`}>
                    {item.free ? (
                      <CheckCircleIcon className="w-6 h-6 shrink-0 text-green-500" />
                    ) : (
                      <XCircleIcon className="w-6 h-6 shrink-0 text-red-400" />
                    )}
                    <span className={item.free ? '' : 'line-through decoration-gray-300'}>{item.title}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8">
                <button
                  onClick={handleJoinFree}
                  className="flex w-full items-center justify-center gap-2 bg-red-900 hover:bg-blue-900 text-white py-3.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  Join Free <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Paid Plan */}
            <div className="relative flex flex-col rounded-3xl bg-gradient-to-br from-red-950 via-red-900 to-red-700 text-white p-7 sm:p-9 shadow-2xl shadow-red-300/60 md:-mt-3 md:mb-[-0.75rem]">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-400 text-red-950 text-xs font-extrabold shadow-md">
                <SparklesIcon className="w-3.5 h-3.5" /> RECOMMENDED
              </span>
              <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-pink-400/20 blur-3xl" />

              <div className="relative flex items-center justify-between gap-3">
                <h3 className="text-2xl font-bold">Complete Access</h3>
                <span className="px-3 py-1 rounded-full bg-white/15 ring-1 ring-white/30 text-white text-xs font-bold">Premium</span>
              </div>
              <p className="relative mt-1 text-sm text-rose-100">All {paidCount} features included</p>

              <ul className="relative mt-6 space-y-3.5">
                {features.map((item, index) => {
                  const premiumOnly = !item.free && item.paid;
                  return (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircleIcon className={`w-6 h-6 shrink-0 ${premiumOnly ? 'text-amber-300' : 'text-green-300'}`} />
                      <span className={premiumOnly ? 'font-semibold' : ''}>{item.title}</span>
                      {premiumOnly && (
                        <span className="ml-auto shrink-0 px-2 py-0.5 rounded-full bg-amber-400 text-red-950 text-[10px] font-extrabold">
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
                  className="flex w-full items-center justify-center gap-2 bg-white hover:bg-amber-300 text-red-900 py-3.5 rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  See Premium Plans <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Memb;