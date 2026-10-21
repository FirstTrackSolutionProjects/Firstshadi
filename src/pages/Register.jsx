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
} from '@heroicons/react/24/outline';
import { useAuth } from "../context/AuthContext";

/* ---------- Floating-label input (defined outside so it never remounts while typing) ---------- */
const Field = ({ icon: Icon, label, name, type = "text", value, onChange, right, prefix, ...rest }) => (
  <div className="relative">
    <Icon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-yellow-600" />
    {prefix && (
      <span className="pointer-events-none absolute left-11 bottom-2.5 text-sm font-semibold text-red-800">
        {prefix}
      </span>
    )}
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder=" "
      required
      className={
        "peer w-full border border-yellow-600 rounded-xl bg-white text-black placeholder-transparent " +
        "pl-11 pt-6 pb-2 shadow-sm transition duration-200 hover:shadow-md " +
        "focus:outline-none focus:ring-4 focus:ring-yellow-600/20 " +
        (prefix ? "pl-[5.5rem] " : "") +
        (right ? "pr-12" : "pr-4")
      }
      {...rest}
    />
    <label
      htmlFor={name}
      className={
        "pointer-events-none absolute top-3 text-xs text-yellow-600 transition-all duration-200 " +
        (prefix ? "left-11 " : "left-11 ") +
        "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base " +
        "peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-xs"
      }
    >
      {label}
    </label>
    {right}
  </div>
);

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

  /* ---------- UI helpers (display only) ---------- */
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

  return (
    <div>
      <style>{`
        @keyframes regRise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        .reg-rise { animation: regRise .6s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .reg-rise { animation: none; } }
      `}</style>

      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
        <div className="reg-rise w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* ---------- Left: image panel ---------- */}
          <div className="relative min-h-[280px] md:min-h-full">
            <img
              src="./image/s33.jpg"
              alt="Registration Visual"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-red-900/90 via-red-900/30 to-transparent" />

            <div className="relative h-full flex flex-col justify-end p-7 md:p-10 text-white">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                Your story begins with a single step.
              </h1>
              <p className="mt-3 text-sm md:text-base text-white/85 max-w-sm">
                Create your free account and meet people who share your values and your family traditions.
              </p>

              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                    <CheckBadgeIcon className="h-5 w-5" />
                  </span>
                  Verified profiles
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                    <ShieldCheckIcon className="h-5 w-5" />
                  </span>
                  Your details stay private and secure
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                    <HeartIcon className="h-5 w-5" />
                  </span>
                  Matches made for lasting relationships
                </li>
              </ul>
            </div>
          </div>

          {/* ---------- Right: form ---------- */}
          <div className="p-7 sm:p-10">
            <h2 className="text-3xl font-bold tracking-tight text-red-800">Create Account</h2>
            <p className="mt-1 text-sm text-gray-500">It takes less than a minute.</p>
            <div className="mt-3 mb-7 h-1 w-14 rounded-full bg-yellow-600" />

            {error && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-2 p-3 rounded-xl bg-red-100 text-red-700 text-sm border border-red-200"
              >
                <ExclamationCircleIcon className="h-5 w-5 shrink-0 mt-px" />
                <span>{error}</span>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleRegister}>
              <Field
                icon={UserIcon}
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
              />

              <Field
                icon={PhoneIcon}
                label="Phone Number (10 digits)"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                maxLength={10}
                inputMode="numeric"
                autoComplete="tel"
                prefix="+91"
              />

              <Field
                icon={EnvelopeIcon}
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />

              <div>
                <Field
                  icon={LockClosedIcon}
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  right={eyeBtn(showPassword, () => setShowPassword(!showPassword))}
                />
                {pw && (
                  <div className="mt-2 px-1">
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4].map(i => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= strength ? 'bg-yellow-600' : 'bg-gray-200'}`}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Password strength: {strengthLabel}</p>
                  </div>
                )}
              </div>

              <div>
                <Field
                  icon={LockClosedIcon}
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  right={eyeBtn(showConfirmPassword, () => setShowConfirmPassword(!showConfirmPassword))}
                />
                {formData.confirmPassword && (
                  <p className={`mt-1 px-1 text-xs ${passwordsMatch ? 'text-gray-500' : 'text-red-600'}`}>
                    {passwordsMatch ? 'Passwords match' : 'Passwords do not match yet'}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 bg-red-900 text-white font-semibold tracking-wide py-3.5 rounded-xl shadow-lg
                           hover:bg-red-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]
                           transition duration-200
                           focus:outline-none focus:ring-4 focus:ring-red-800/30
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {submitting ? 'REGISTERING...' : 'REGISTER'}
              </button>
            </form>

            <p className="text-center text-sm mt-6">
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