// import React, { useState } from "react";
// import Footer from '../components/Footer';
// import { Link, useNavigate } from "react-router-dom";
// import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

// const Register = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     emailOtp: '',
//     phoneOtp: '',
//   });

//   const [emailOtpSent, setEmailOtpSent] = useState('');
//   const [phoneOtpSent, setPhoneOtpSent] = useState('');
//   const [emailOtpVerified, setEmailOtpVerified] = useState(false);
//   const [phoneOtpVerified, setPhoneOtpVerified] = useState(false);

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

//   const sendEmailOtp = () => {
//     const otp = generateOtp();
//     setEmailOtpSent(otp);
//     alert(`Email OTP sent to ${formData.email}: ${otp}`);
//   };

//   const sendPhoneOtp = () => {
//     const otp = generateOtp();
//     setPhoneOtpSent(otp);
//     alert(`Phone OTP sent to ${formData.phone}: ${otp}`);
//   };

//   const verifyEmailOtp = () => {
//     if (formData.emailOtp === emailOtpSent) {
//       setEmailOtpVerified(true);
//       alert("Email OTP verified successfully");
//     } else {
//       alert("Invalid Email OTP");
//     }
//   };

//   const verifyPhoneOtp = () => {
//     if (formData.phoneOtp === phoneOtpSent) {
//       setPhoneOtpVerified(true);
//       alert("Phone OTP verified successfully");
//     } else {
//       alert("Invalid Phone OTP");
//     }
//   };

//   const handleRegister = (e) => {
//     e.preventDefault();
//     if (!emailOtpVerified || !phoneOtpVerified) {
//       alert("Please verify both Email and Phone OTPs before proceeding.");
//       return;
//     }
//     navigate('/regone');
//   };

//   return (
//     <div>
//       <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 px-4 py-8">
//         <div className="w-full max-w-md flex justify-center mb-6">
//           <img src="./image/s33.jpg" alt="Registration Visual" className="w-full rounded-lg shadow-md" />
//         </div>

//         <div className="w-full max-w-md bg-white p-6 rounded-md shadow-md">
//           <h2 className="text-center text-2xl font-semibold mb-6 text-red-800">Create Account</h2>

//           <form className="space-y-4" onSubmit={handleRegister}>
//             <input
//               type="text"
//               name="name"
//               placeholder="Full Name"
//               required
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full border border-yellow-600 px-4 py-2 rounded placeholder-yellow-600 text-black"
//             />

//             {/* Phone & OTP Section */}
//             <div className="space-y-2">
//               <input
//                 type="text"
//                 name="phone"
//                 placeholder="Phone Number"
//                 required
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className="w-full border border-yellow-600 px-4 py-2 rounded placeholder-yellow-600 text-black"
//               />

//               {formData.phone && (
//                 <>
//                   <div className="flex space-x-2 mt-1">
//                     <button
//                       type="button"
//                       onClick={sendPhoneOtp}
//                       className="bg-yellow-600 text-white px-3 py-1 text-sm rounded hover:bg-yellow-700 transition"
//                     >
//                       Send OTP
//                     </button>
//                     <button
//                       type="button"
//                       onClick={verifyPhoneOtp}
//                       className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700 transition"
//                     >
//                       Verify OTP
//                     </button>
//                   </div>
//                   <input
//                     type="number"
//                     name="phoneOtp"
//                     placeholder="Enter Phone OTP"
//                     value={formData.phoneOtp}
//                     onChange={handleChange}
//                     className="w-full border border-yellow-600 px-4 py-2 rounded placeholder-yellow-600 text-black mt-2"
//                   />
//                 </>
//               )}
//             </div>

//             {/* Email & OTP Section */}
//             <div className="space-y-2">
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email"
//                 required
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full border border-yellow-600 px-4 py-2 rounded placeholder-yellow-600 text-black"
//               />

//               {formData.email && (
//                 <>
//                   <div className="flex space-x-2 mt-1">
//                     <button
//                       type="button"
//                       onClick={sendEmailOtp}
//                       className="bg-yellow-600 text-white px-3 py-1 text-sm rounded hover:bg-yellow-700 transition"
//                     >
//                       Send OTP
//                     </button>
//                     <button
//                       type="button"
//                       onClick={verifyEmailOtp}
//                       className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700 transition"
//                     >
//                       Verify OTP
//                     </button>
//                   </div>
//                   <input
//                     type="number"
//                     name="emailOtp"
//                     placeholder="Enter Email OTP"
//                     value={formData.emailOtp}
//                     onChange={handleChange}
//                     className="w-full border border-yellow-600 px-4 py-2 rounded placeholder-yellow-600 text-black mt-2"
//                   />
//                 </>
//               )}
//             </div>

//             {/* Password */}
//             <div className="relative">
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 name="password"
//                 placeholder="Password"
//                 required
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full border border-yellow-600 px-4 py-2 pr-10 rounded placeholder-yellow-600 text-black"
//               />
//               <div
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
//               >
//                 {showPassword ? (
//                   <EyeSlashIcon className="h-5 w-5 text-yellow-600" />
//                 ) : (
//                   <EyeIcon className="h-5 w-5 text-yellow-600" />
//                 )}
//               </div>
//             </div>

//             {/* Confirm Password */}
//             <div className="relative">
//               <input
//                 type={showConfirmPassword ? 'text' : 'password'}
//                 name="confirmPassword"
//                 placeholder="Confirm Password"
//                 required
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 className="w-full border border-yellow-600 px-4 py-2 pr-10 rounded placeholder-yellow-600 text-black"
//               />
//               <div
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
//               >
//                 {showConfirmPassword ? (
//                   <EyeSlashIcon className="h-5 w-5 text-yellow-600" />
//                 ) : (
//                   <EyeIcon className="h-5 w-5 text-yellow-600" />
//                 )}
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-red-900 text-white py-2 rounded hover:bg-blue-700 transition"
//             >
//               REGISTER
//             </button>
//           </form>

//           <p className="text-center text-sm mt-4">
//             Already have an account?{" "}
//             <Link to="/signin" className="text-red-600 font-semibold hover:underline">
//               Sign In
//             </Link>
//           </p>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Register;


import React, { useState } from "react";
import Footer from '../components/Footer';
import { Link, useNavigate } from "react-router-dom";
import {
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ExclamationCircleIcon,
  ShieldCheckIcon,
  HeartIcon,
  CheckBadgeIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from "../context/AuthContext";

const baseInput =
  "w-full border border-yellow-600 rounded-xl bg-white text-black placeholder-yellow-600 " +
  "py-3.5 shadow-sm transition duration-200 hover:shadow-md " +
  "focus:outline-none focus:ring-4 focus:ring-yellow-600/20";
const inputCls = baseInput + " pl-11 pr-4";
const inputPwCls = baseInput + " pl-11 pr-12";
const inputPhoneCls = baseInput + " pl-[5.75rem] pr-4";

const labelCls = "block mb-2 text-sm font-semibold text-gray-800";
const iconCls = "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-yellow-600";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // phone: allow digits only
  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, phone: digits }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.phone.length !== 10) {
      setError("Phone number must be 10 digits");
      return;
    }

    setSubmitting(true);
    try {
      const res = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        gender: 'Male',           // can be updated later during profile flow
        profile_for: 'Myself',
      });
      if (res?.success) {
        navigate('/regone');
      } else {
        setError(res?.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const pw = formData.password;
  const strength =
    (pw.length >= 8 ? 1 : 0) +
    (/[A-Z]/.test(pw) && /[a-z]/.test(pw) ? 1 : 0) +
    (/\d/.test(pw) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(pw) ? 1 : 0);
  const strengthLabel = ['Too short', 'Weak', 'Okay', 'Good', 'Strong'][pw ? strength : 0];
  const passwordsMatch = formData.confirmPassword && formData.password === formData.confirmPassword;

  const eyeBtn = (shown, toggle) => (
    <button
      type="button"
      onClick={toggle}
      aria-label={shown ? 'Hide password' : 'Show password'}
      className="absolute inset-y-0 right-3 my-auto h-9 w-9 flex items-center justify-center rounded-full hover:bg-yellow-600/10 transition focus:outline-none focus:ring-2 focus:ring-yellow-600/40"
    >
      {shown ? <EyeSlashIcon className="h-5 w-5 text-yellow-600" /> : <EyeIcon className="h-5 w-5 text-yellow-600" />}
    </button>
  );

  const perks = [
    { icon: CheckBadgeIcon, title: "Verified profiles", text: "Every profile is checked before it appears in matches." },
    { icon: ShieldCheckIcon, title: "Private and secure", text: "Your personal details stay protected." },
    { icon: HeartIcon, title: "Made for lasting relationships", text: "Find people who share your values and family traditions." },
  ];

  return (
    <div>
      <style>{`
        @keyframes regRise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        .reg-rise { animation: regRise .6s ease-out both; }
        .reg-rise-2 { animation: regRise .6s .12s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .reg-rise, .reg-rise-2 { animation: none; } }
      `}</style>
      <div className="relative overflow-hidden min-h-screen bg-gray-100 px-4 py-12">
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-yellow-600/10 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-red-900/10 blur-3xl" />

        {/* Heading */}
        <div className="relative reg-rise text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-red-800">Create Account</h1>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-red-900" />
          <p className="mt-5 text-lg text-gray-700">
            Join First Marriage today and start meeting people who are looking for the same thing you are.
          </p>
        </div>

        <div className="relative reg-rise-2 max-w-6xl mx-auto grid lg:grid-cols-5 gap-8 items-start">

          {/* ---------- Left: image + info card ---------- */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <img
                src="./image/s33.jpg"
                alt="Registration Visual"
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-900/85 via-transparent to-transparent" />
              <p className="absolute bottom-5 left-6 right-6 text-white text-xl font-bold leading-snug">
                Your story begins with a single step.
              </p>
            </div>

            <div className="relative overflow-hidden bg-red-900 text-white rounded-2xl shadow-xl p-8">
              <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/5" />
              <div className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-yellow-600/10" />
              <h3 className="relative text-xl font-bold mb-6">Why join First Marriage</h3>
              <ul className="relative space-y-5">
                {perks.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
                      <Icon className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="text-sm text-white/70">{title}</p>
                      <p className="font-semibold leading-snug">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ---------- Right: form card ---------- */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-xl border-t-4 border-red-900 p-8 md:p-10">
            <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
            <p className="mt-1 mb-8 text-gray-600">Fill in your details to get started.</p>

            {error && (
              <div
                role="alert"
                className="mb-6 flex items-start gap-2 p-3 rounded-xl bg-red-100 text-red-700 text-sm border border-red-200"
              >
                <ExclamationCircleIcon className="h-5 w-5 shrink-0 mt-px" />
                <span>{error}</span>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleRegister}>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className={labelCls}>Full Name</label>
                  <div className="relative">
                    <UserIcon className={iconCls} />
                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      required
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className={labelCls}>Phone Number</label>
                  <div className="relative">
                    <PhoneIcon className={iconCls} />
                    <div className="pointer-events-none absolute left-11 top-1/2 -translate-y-1/2 flex h-6 items-center border-r border-yellow-600/40 pr-3">
                      <span className="text-sm font-semibold text-red-800">+91</span>
                    </div>
                    <input
                      id="phone"
                      type="text"
                      name="phone"
                      placeholder="10 digits"
                      required
                      maxLength={10}
                      inputMode="numeric"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className={inputPhoneCls}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className={labelCls}>Email</label>
                <div className="relative">
                  <EnvelopeIcon className={iconCls} />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className={labelCls}>Password</label>
                  <div className="relative">
                    <LockClosedIcon className={iconCls} />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Password"
                      required
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      className={inputPwCls}
                    />
                    {eyeBtn(showPassword, () => setShowPassword(!showPassword))}
                  </div>
                  {pw && (
                    <div className="mt-2">
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4].map(i => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= strength ? 'bg-yellow-600' : 'bg-gray-200'}`}
                          />
                        ))}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Strength: {strengthLabel}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className={labelCls}>Confirm Password</label>
                  <div className="relative">
                    <LockClosedIcon className={iconCls} />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      required
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={inputPwCls}
                    />
                    {eyeBtn(showConfirmPassword, () => setShowConfirmPassword(!showConfirmPassword))}
                  </div>
                  {formData.confirmPassword && (
                    <p className={`mt-1.5 text-xs ${passwordsMatch ? 'text-gray-500' : 'text-red-600'}`}>
                      {passwordsMatch ? 'Passwords match' : 'Passwords do not match yet'}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-red-900 text-white font-semibold tracking-wide py-4 rounded-xl shadow-lg
                           hover:bg-red-700 hover:shadow-xl active:scale-[0.99] transition duration-200
                           focus:outline-none focus:ring-4 focus:ring-red-800/30
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserPlusIcon className="h-5 w-5" />
                {submitting ? 'REGISTERING...' : 'REGISTER'}
              </button>
            </form>

            <p className="text-center text-xs text-gray-500 mt-4">
              By registering, you agree to our Terms and Privacy Policy.
            </p>

            <p className="text-center text-sm mt-5">
              Already have an account?{" "}
              <Link to="/signin" className="text-red-600 font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;