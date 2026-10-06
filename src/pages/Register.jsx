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
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from "../context/AuthContext";

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
      <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 px-4 py-8">
        <div className="w-full max-w-md flex justify-center mb-6">
          <img src="./image/s33.jpg" alt="Registration Visual" className="w-full rounded-lg shadow-md" />
        </div>

        <div className="w-full max-w-md bg-white p-6 rounded-md shadow-md">
          <h2 className="text-center text-2xl font-semibold mb-6 text-red-800">Create Account</h2>

          {error && <div className="mb-3 p-2 rounded bg-red-100 text-red-700 text-sm">{error}</div>}

          <form className="space-y-4" onSubmit={handleRegister}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-yellow-600 px-4 py-2 rounded placeholder-yellow-600 text-black"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number (10 digits)"
              required
              maxLength={10}
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-yellow-600 px-4 py-2 rounded placeholder-yellow-600 text-black"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-yellow-600 px-4 py-2 rounded placeholder-yellow-600 text-black"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-yellow-600 px-4 py-2 pr-10 rounded placeholder-yellow-600 text-black"
              />
              <div onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                {showPassword ? <EyeSlashIcon className="h-5 w-5 text-yellow-600" /> : <EyeIcon className="h-5 w-5 text-yellow-600" />}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border border-yellow-600 px-4 py-2 pr-10 rounded placeholder-yellow-600 text-black"
              />
              <div onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5 text-yellow-600" /> : <EyeIcon className="h-5 w-5 text-yellow-600" />}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-red-900 text-white py-2 rounded hover:bg-red-700 transition disabled:opacity-50"
            >
              {submitting ? 'REGISTERING...' : 'REGISTER'}
            </button>
          </form>

          <p className="text-center text-sm mt-4">
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