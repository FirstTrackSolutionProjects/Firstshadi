import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiUser, FiPhone, FiCalendar, FiLock, FiHeart, FiEye, FiEyeOff,
  FiArrowRight, FiAlertCircle, FiChevronDown, FiCheck,
} from 'react-icons/fi';
import Footer from '../components/Footer';

/* ------------------------------ SHARED STYLES ------------------------------ */

const inputBase =
  'w-full py-3.5 rounded-xl border bg-white text-slate-800 placeholder-slate-400 shadow-sm transition ' +
  'focus:outline-none focus:ring-4 focus:ring-amber-100 focus:border-amber-500';
const inputOk = 'border-slate-200 hover:border-slate-300';
const inputBad = 'border-red-400 bg-red-50/40 focus:ring-red-100 focus:border-red-400';

/* ------------------------------ SMALL PARTS ------------------------------ */

const Field = ({ label, children, error }) => (
  <div>
    <label className="block text-sm font-semibold text-red-800 mb-1.5">
      {label} <span className="text-red-500">*</span>
    </label>
    {children}
    {error && (
      <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5">
        <FiAlertCircle className="shrink-0" /> {error}
      </p>
    )}
  </div>
);

const IconWrap = ({ icon }) => (
  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-lg text-amber-600">
    {icon}
  </span>
);

const SectionTitle = ({ number, children }) => (
  <div className="flex items-center gap-3 pt-3">
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-red-800 to-red-600 text-xs font-bold text-white shadow">
      {number}
    </span>
    <span className="text-sm font-bold text-slate-800">{children}</span>
    <span className="h-px flex-1 bg-gradient-to-r from-amber-300 to-transparent" />
  </div>
);

const strengthOf = (pw) => {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (/[A-Z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  return Math.max(score, 1);
};

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['', 'bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];

const GENDERS = [
  { value: 'male', label: 'Male', emoji: '👨' },
  { value: 'female', label: 'Female', emoji: '👩' },
];

/* ------------------------------ PAGE ------------------------------ */

const Grmdtl = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [mismatch, setMismatch] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const strength = strengthOf(password);

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can validate data here before navigating
    if (password !== confirm) {
      setMismatch(true);
      return;
    }
    navigate('/paym'); // Navigate to Paym.jsx route
  };

  return (
    <div>
      <div className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-white to-amber-50 px-4 py-10 sm:py-14">
        <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-rose-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-amber-200/50 blur-3xl" />

        <div className="relative mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
          {/* LEFT: heading + full photo (koi crop nahi) */}
          <div className="lg:sticky lg:top-8 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-100 text-red-800 text-xs font-bold">
              <FiHeart /> CREATE YOUR ACCOUNT
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold leading-tight text-red-700">
              Hi! You are joining the Best Matchmaking Experience.
            </h1>
            <p className="mt-3 text-gray-600">Fill in your details to get started.</p>

            <div className="relative mt-8 mx-auto max-w-lg lg:max-w-none">
              {/* decorative frame */}
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-red-700 via-rose-500 to-amber-400 opacity-70 blur-sm" />
              <div className="relative overflow-hidden rounded-[1.6rem] ring-4 ring-white shadow-2xl">
                <img
                  src="/image/s17.jpg"
                  alt="Groom Banner"
                  className="block w-full h-auto"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-red-950/50 to-transparent" />
              </div>
            </div>
          </div>

          {/* RIGHT: FORM CARD */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-red-100 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-red-900 via-rose-500 to-amber-400" />

            <form className="p-6 sm:p-9 space-y-5" onSubmit={handleSubmit} autoComplete="on">
              <SectionTitle number="1">Personal details</SectionTitle>

              {/* Groom's Title + Name */}
              <Field label="Name">
                <div className="grid grid-cols-[110px_1fr] gap-2">
                  <div className="relative">
                    <select
                      name="title"
                      className={`${inputBase} ${inputOk} pl-3 pr-8 appearance-none`}
                      required
                    >
                      <option value="Mr">Mr.</option>
                      <option value="Miss">Miss</option>
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                      <FiChevronDown />
                    </span>
                  </div>
                  <div className="relative">
                    <IconWrap icon={<FiUser />} />
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      placeholder="Enter the Name"
                      className={`${inputBase} ${inputOk} pl-12 pr-3`}
                      required
                    />
                  </div>
                </div>
              </Field>

              {/* Gender Selection */}
              <Field label="Gender">
                <div className="grid grid-cols-2 gap-3">
                  {GENDERS.map((g) => (
                    <label key={g.value} className="relative block cursor-pointer">
                      <input type="radio" name="gender" value={g.value} className="peer sr-only" required />
                      <span className="flex items-center justify-center gap-2.5 rounded-xl border-2 border-slate-200 bg-white py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-amber-300 peer-checked:border-red-800 peer-checked:bg-red-50 peer-checked:text-red-800 peer-focus-visible:ring-4 peer-focus-visible:ring-amber-100">
                        <span className="text-xl leading-none" aria-hidden="true">{g.emoji}</span>
                        {g.label}
                      </span>
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden h-5 w-5 items-center justify-center rounded-full bg-red-800 text-white peer-checked:flex">
                        <FiCheck className="text-xs" />
                      </span>
                    </label>
                  ))}
                </div>
              </Field>

              {/* Date of Birth */}
              <Field label="Date of Birth">
                <div className="relative">
                  <IconWrap icon={<FiCalendar />} />
                  <input
                    type="date"
                    name="dob"
                    max={today}
                    autoComplete="bday"
                    className={`${inputBase} ${inputOk} pl-12 pr-3`}
                    required
                  />
                </div>
              </Field>

              {/* Marital Status */}
              <Field label="Marital status">
                <div className="relative">
                  <IconWrap icon={<FiHeart />} />
                  <select
                    name="maritalStatus"
                    defaultValue=""
                    className={`${inputBase} ${inputOk} pl-12 pr-10 appearance-none`}
                    required
                  >
                    <option value="">Select Marital Status</option>
                    <option value="Never Married">Never Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
                    <FiChevronDown />
                  </span>
                </div>
              </Field>

              <SectionTitle number="2">Contact</SectionTitle>

              {/* Mobile Number */}
              <Field label="Mobile Number">
                <div className="relative">
                  <IconWrap icon={<FiPhone />} />
                  <input
                    type="tel"
                    name="mobile"
                    autoComplete="tel-national"
                    placeholder="Enter Mobile Number"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    inputMode="numeric"
                    title="Enter a 10-digit mobile number"
                    onInput={(e) => {
                      // sirf digits allow (email/text autofill ho jaye to hat jaye)
                      e.target.value = e.target.value.replace(/\D/g, '');
                    }}
                    className={`${inputBase} ${inputOk} pl-12 pr-3`}
                    required
                  />
                </div>
              </Field>

              <SectionTitle number="3">Account security</SectionTitle>

              {/* Create Password */}
              <Field label="Create Password">
                <div className="relative">
                  <IconWrap icon={<FiLock />} />
                  <input
                    type={showPw ? 'text' : 'password'}
                    name="password"
                    autoComplete="new-password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setMismatch(false);
                    }}
                    className={`${inputBase} ${inputOk} pl-12 pr-12`}
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

                {password && (
                  <div className="mt-2.5">
                    <div className="grid grid-cols-4 gap-1.5">
                      {[1, 2, 3, 4].map((n) => (
                        <span
                          key={n}
                          className={`h-1.5 rounded-full transition-colors ${n <= strength ? STRENGTH_COLORS[strength] : 'bg-slate-200'}`}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Password strength: <span className="font-semibold text-slate-700">{STRENGTH_LABELS[strength]}</span>
                    </p>
                  </div>
                )}
              </Field>

              {/* Confirm Password */}
              <Field label="Confirm Password" error={mismatch ? 'Passwords do not match.' : ''}>
                <div className="relative">
                  <IconWrap icon={<FiLock />} />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    autoComplete="new-password"
                    placeholder="Re-enter Password"
                    value={confirm}
                    onChange={(e) => {
                      setConfirm(e.target.value);
                      setMismatch(false);
                    }}
                    className={`${inputBase} ${mismatch ? inputBad : inputOk} pl-12 pr-12`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-red-700 transition"
                  >
                    {showConfirm ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </Field>

              {/* Continue Button */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-900 via-red-800 to-red-600 text-white py-4 rounded-xl text-base font-bold shadow-lg shadow-red-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                Continue <FiArrowRight />
              </button>

              {/* Already have account */}
              <div className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/mreg" className="text-red-600 hover:underline font-semibold">
                  Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Grmdtl;