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
} from '@heroicons/react/24/outline';
import { useAuth } from "../context/AuthContext";

// Shared input styling (same colors as before, just better spacing, radius & focus state)
const inputCls =
  "w-full border border-yellow-600 pl-11 pr-4 py-3 rounded-lg placeholder-yellow-600 text-black bg-white " +
  "transition duration-200 shadow-sm hover:shadow-md " +
  "focus:outline-none focus:ring-2 focus:ring-yellow-600/40 focus:border-yellow-600";

const leftIconCls =
  "pointer-events-none absolute inset-y-0 left-3.5 my-auto h-5 w-5 text-yellow-600";

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

  return (
    <div>
      <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 px-4 py-10">

        {/* Hero image */}
        <div className="w-full max-w-md">
          <img
            src="./image/s33.jpg"
            alt="Registration Visual"
            className="w-full h-56 sm:h-64 object-cover rounded-2xl shadow-xl"
          />
        </div>

        {/* Card (slightly overlaps the image for depth) */}
        <div className="relative -mt-10 w-full max-w-md bg-white px-6 sm:px-8 pt-8 pb-7 rounded-2xl shadow-2xl border-t-4 border-yellow-600">
          <div className="text-center mb-7">
            <h2 className="text-3xl font-bold tracking-tight text-red-800">Create Account</h2>
            <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-yellow-600" />
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2 p-3 rounded-lg bg-red-100 text-red-700 text-sm border border-red-200"
            >
              <ExclamationCircleIcon className="h-5 w-5 shrink-0 mt-px" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleRegister}>
            {/* Full name */}
            <div className="relative">
              <UserIcon className={leftIconCls} />
              <input
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

            {/* Phone */}
            <div className="relative">
              <PhoneIcon className={leftIconCls} />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number (10 digits)"
                required
                maxLength={10}
                inputMode="numeric"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                className={inputCls}
              />
            </div>

            {/* Email */}
            <div className="relative">
              <EnvelopeIcon className={leftIconCls} />
              <input
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

            {/* Password */}
            <div className="relative">
              <LockClosedIcon className={leftIconCls} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                required
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className={inputCls + " pr-12"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-3 flex items-center rounded-md px-1 focus:outline-none focus:ring-2 focus:ring-yellow-600/40"
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5 text-yellow-600" /> : <EyeIcon className="h-5 w-5 text-yellow-600" />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <LockClosedIcon className={leftIconCls} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                required
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={inputCls + " pr-12"}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-3 flex items-center rounded-md px-1 focus:outline-none focus:ring-2 focus:ring-yellow-600/40"
              >
                {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5 text-yellow-600" /> : <EyeIcon className="h-5 w-5 text-yellow-600" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-red-900 text-white font-semibold tracking-wide py-3 rounded-lg shadow-lg
                         hover:bg-red-700 hover:shadow-xl active:scale-[0.98] transition duration-200
                         focus:outline-none focus:ring-2 focus:ring-red-800/50 focus:ring-offset-2
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'REGISTERING...' : 'REGISTER'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/signin" className="text-red-600 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;