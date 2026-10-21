import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiPhone, FiCalendar, FiLock, FiHeart, FiEye, FiEyeOff, FiArrowRight, FiAlertCircle, FiChevronDown } from 'react-icons/fi';
import Footer from '../components/Footer';

/* ------------------------------ SHARED STYLES ------------------------------ */

const inputBase =
  'w-full py-3 rounded-xl border bg-slate-50 text-slate-800 placeholder-slate-400 transition ' +
  'focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 focus:bg-white';
const inputOk = 'border-slate-200';
const inputBad = 'border-red-400 bg-red-50/40';

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
  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-lg text-amber-600">
    {icon}
  </span>
);

const SectionTitle = ({ children }) => (
  <div className="flex items-center gap-3 pt-2">
    <span className="text-xs font-bold uppercase tracking-wider text-amber-700">{children}</span>
    <span className="h-px flex-1 bg-gradient-to-r from-amber-200 to-transparent" />
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-amber-50 px-4 py-10">
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl shadow-red-100 overflow-hidden">
          {/* 🖼️ Banner image */}
          <div className="relative h-56 sm:h-72">
            <img
              src="/image/s17.jpg"
              alt="Groom Banner"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-red-950/75 via-red-900/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-semibold">
                <FiHeart /> Create your account
              </span>
            </div>
          </div>

          {/* 📋 Form */}
          <div className="p-6 sm:p-10">
            <h2 className="text-xl sm:text-2xl text-red-700 font-bold text-center leading-snug">
              Hi! You are joining the Best Matchmaking Experience.
            </h2>
            <p className="text-center text-sm text-gray-500 mt-1.5">Fill in your details to get started.</p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <SectionTitle>Personal details</SectionTitle>

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
                      placeholder="Enter the Name"
                      className={`${inputBase} ${inputOk} pl-11 pr-3`}
                      required
                    />
                  </div>
                </div>
              </Field>

              {/* Gender Selection */}
              <Field label="Gender">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                  ].map((g) => (
                    <label key={g.value} className="cursor-pointer">
                      <input type="radio" name="gender" value={g.value} className="peer sr-only" required />
                      <span className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-slate-50 py-3 text-sm font-semibold text-red-800 transition hover:border-amber-300 peer-checked:border-red-800 peer-checked:bg-red-50 peer-checked:shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-amber-400">
                        {g.label}
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
                    className={`${inputBase} ${inputOk} pl-11 pr-3`}
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
                    className={`${inputBase} ${inputOk} pl-11 pr-10 appearance-none`}
                    required
                  >
                    <option value="">Select Marital Status</option>
                    <option value="Never Married">Never Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                    <FiChevronDown />
                  </span>
                </div>
              </Field>

              <SectionTitle>Contact</SectionTitle>

              {/* Mobile Number */}
              <Field label="Mobile Number">
                <div className="relative">
                  <IconWrap icon={<FiPhone />} />
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Enter Mobile Number"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    inputMode="numeric"
                    title="Enter a 10-digit mobile number"
                    className={`${inputBase} ${inputOk} pl-11 pr-3`}
                    required
                  />
                </div>
              </Field>

              <SectionTitle>Account security</SectionTitle>

              {/* Create Password */}
              <Field label="Create Password">
                <div className="relative">
                  <IconWrap icon={<FiLock />} />
                  <input
                    type={showPw ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setMismatch(false);
                    }}
                    className={`${inputBase} ${inputOk} pl-11 pr-11`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-red-700 transition"
                  >
                    {showPw ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                {password && (
                  <div className="mt-2">
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
                    placeholder="Re-enter Password"
                    value={confirm}
                    onChange={(e) => {
                      setConfirm(e.target.value);
                      setMismatch(false);
                    }}
                    className={`${inputBase} ${mismatch ? inputBad : inputOk} pl-11 pr-11`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-red-700 transition"
                  >
                    {showConfirm ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </Field>

              {/* Continue Button */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-900 to-red-700 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-red-200 hover:shadow-xl hover:-translate-y-0.5 transition-all"
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