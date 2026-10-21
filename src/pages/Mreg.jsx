import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiHeart } from 'react-icons/fi';
import Footer from '../components/Footer';

const inputClass =
  'w-full pl-12 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 shadow-sm transition ' +
  'hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-amber-100 focus:border-amber-500';

const IconWrap = ({ icon }) => (
  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-lg text-amber-600">
    {icon}
  </span>
);

const Mreg = () => {
  const [showPw, setShowPw] = useState(false);

  const handleGoogleSignIn = () => {
    // Replace this with your real Google sign-in logic
    alert('Google Sign-In triggered');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative flex-grow flex items-center overflow-hidden bg-gradient-to-br from-rose-50 via-white to-amber-50 px-4 py-10 sm:py-14">
        <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-rose-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-amber-200/50 blur-3xl" />

        <div className="relative mx-auto w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          {/* LEFT: heading + full photo (koi crop nahi) */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-100 text-red-800 text-xs font-bold">
              <FiHeart /> WELCOME BACK
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold leading-tight text-red-700">
              Sign in and continue your journey.
            </h1>
            <p className="mt-3 text-gray-600">Your perfect match could be just a click away.</p>

            <div className="relative mt-8 mx-auto max-w-lg lg:max-w-none">
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-red-700 via-rose-500 to-amber-400 opacity-70 blur-sm" />
              <div className="relative overflow-hidden rounded-[1.6rem] ring-4 ring-white shadow-2xl">
                <img src="/image/s19.jpg" alt="Top" className="block w-full h-auto" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-red-950/40 to-transparent" />
              </div>
            </div>
          </div>

          {/* RIGHT: SIGN IN CARD */}
          <div className="w-full max-w-md mx-auto lg:max-w-none bg-white rounded-3xl shadow-2xl shadow-red-100 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-red-900 via-rose-500 to-amber-400" />

            <div className="p-6 sm:p-10">
              <h2 className="text-3xl font-bold text-center text-red-700">Sign In</h2>
              <p className="text-center text-sm text-gray-500 mt-1.5">Enter your email and password to continue.</p>

              <form className="mt-8 space-y-5" autoComplete="on">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-red-800 mb-1.5">Email</label>
                  <div className="relative">
                    <IconWrap icon={<FiMail />} />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="Email"
                      className={`${inputClass} pr-3`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-red-800 mb-1.5">Password</label>
                  <div className="relative">
                    <IconWrap icon={<FiLock />} />
                    <input
                      id="password"
                      type={showPw ? 'text' : 'password'}
                      name="password"
                      autoComplete="current-password"
                      placeholder="Password"
                      className={`${inputClass} pr-12`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      aria-label={showPw ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-red-700 transition"
                    >
                      {showPw ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-900 via-red-800 to-red-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-red-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all"
                >
                  SIGN IN <FiArrowRight />
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-semibold text-slate-400">OR</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Google Sign-In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 transition-all"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                <span className="text-sm font-semibold text-gray-700">Sign in with Google</span>
              </button>

              <p className="text-center mt-6 text-sm text-gray-600">
                Don’t have an account?{' '}
                <Link to="/grm" className="text-red-600 hover:underline font-semibold">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Mreg;