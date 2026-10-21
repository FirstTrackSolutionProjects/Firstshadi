// import React, { useState } from 'react';
// import Footer from './components/Footer';
// import { Link } from 'react-router-dom';
// import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

// const Signin = () => {
//   const [showPassword, setShowPassword] = useState(false);

//   const handleGoogleSignIn = () => {
//     // Replace this with actual Google Sign-In logic
//     alert('Google Sign-In triggered');
//   };

//   return (
//     <div>
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
//         {/* Image Banner */}
//         <div className="w-full max-w-md">
//           <img
//             src="./image/s22.jpg"
//             alt="Sign Up Banner"
//             className="rounded-md w-full object-cover"
//           />
//         </div>

//         {/* Sign-in Card */}
//         <div className="bg-white w-full max-w-md mt-6 p-6 rounded-md shadow-md">
//           <h2 className="text-center text-xl font-semibold mb-6 text-red-700">Sign In</h2>

//           <form className="space-y-4">
//             <input
//               type="email"
//               placeholder="Email"
//               className="w-full border border-yellow-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-yellow-600"
//             />

//             <div className="relative">
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 placeholder="Password"
//                 className="w-full border border-yellow-600 p-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-yellow-600"
//               />
//               <div
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
//               >
//                 {showPassword ? (
//                   <EyeSlashIcon className="h-5 w-5 text-yellow-600" />
//                 ) : (
//                   <EyeIcon className="h-5 w-5 text-yellow-600" />
//                 )}
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-red-900 text-white py-2 rounded-md hover:bg-blue-700 transition"
//             >
//               SIGN IN
//             </button>
//           </form>

//           {/* Google Sign-In Button without border */}
//           <div className="mt-4">
//             <button
//               onClick={handleGoogleSignIn}
//               className="w-full flex items-center justify-center gap-2 py-2 rounded-md hover:bg-gray-100 transition"
//             >
//               <img
//                 src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
//                 alt="Google"
//                 className="w-5 h-5"
//               />
//               <span className="text-sm text-gray-700">Sign in with Google</span>
//             </button>
//           </div>

//           <p className="text-center text-sm mt-4">
//             Don’t have an account?{' '}
//             <Link to="/register" className="text-red-600 hover:underline">
//               Register here
//             </Link>
//           </p>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Signin;


import React, { useEffect, useRef, useState } from 'react';
import Footer from './components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ExclamationCircleIcon,
  ArrowRightOnRectangleIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from './context/AuthContext';

const inputBase =
  "w-full border border-yellow-600 rounded-xl bg-white text-black placeholder-yellow-600 " +
  "py-3.5 pl-11 shadow-sm transition duration-200 hover:shadow-md " +
  "focus:outline-none focus:ring-4 focus:ring-yellow-600/20";
const labelCls = "block mb-2 text-sm font-semibold text-gray-800";
const iconCls = "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-yellow-600";

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);
  const [googleError, setGoogleError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || !googleButtonRef.current) return;

    const renderGoogleButton = () => {
      if (!window.google?.accounts?.id || !googleButtonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async ({ credential }) => {
          setGoogleError('');
          setGoogleLoading(true);
          try {
            const result = await googleLogin(credential);
            const signedInUser = result.data?.user;
            navigate(signedInUser?.is_admin ? '/admin' : '/');
          } catch (err) {
            setGoogleError(err.message || 'Google sign-in failed');
          } finally {
            setGoogleLoading(false);
          }
        },
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rect',
        width: Math.min(350, googleButtonRef.current.clientWidth || 350),
      });
    };

    const existingScript = document.querySelector('script[data-google-identity]');
    if (window.google?.accounts?.id) {
      renderGoogleButton();
    } else if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.dataset.googleIdentity = 'true';
      script.onload = renderGoogleButton;
      document.head.appendChild(script);
    } else {
      existingScript.addEventListener('load', renderGoogleButton, { once: true });
    }
  }, [googleLogin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await login(email, password);
      if (res?.success) {
        const loggedInUser = res.data?.user;
        if (loggedInUser?.is_admin) {
          navigate('/admin');       // 🔥 admin → admin dashboard
        } else {
          navigate('/');            // normal user → home
        }
      } else {
        setError(res?.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const perks = [
    { icon: UsersIcon, title: "Your matches", text: "See who matched with you since your last visit." },
    { icon: ChatBubbleLeftRightIcon, title: "Conversations", text: "Pick up your chats right where you left off." },
    { icon: UserCircleIcon, title: "Your profile", text: "Keep your details fresh so the right people find you." },
  ];

  return (
    <div>
      <style>{`
        @keyframes siRise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        .si-rise { animation: siRise .6s ease-out both; }
        .si-rise-2 { animation: siRise .6s .12s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .si-rise, .si-rise-2 { animation: none; } }
      `}</style>

      <div className="relative overflow-hidden min-h-screen bg-gray-50 px-4 py-12">
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-yellow-600/10 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-red-900/10 blur-3xl" />

        {/* Heading */}
        <div className="relative si-rise text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-red-700">Sign In</h1>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-red-900" />
          <p className="mt-5 text-lg text-gray-700">
            Welcome back. Sign in to see your matches and continue your conversations.
          </p>
        </div>

        <div className="relative si-rise-2 max-w-6xl mx-auto grid lg:grid-cols-5 gap-8 items-start">

          {/* ---------- Left: image + info card ---------- */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <img
                src="./image/s22.jpg"
                alt="Sign Up Banner"
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-900/85 via-transparent to-transparent" />
              <p className="absolute bottom-5 left-6 right-6 text-white text-xl font-bold leading-snug">
                Good to see you again.
              </p>
            </div>

            <div className="relative overflow-hidden bg-red-900 text-white rounded-2xl shadow-xl p-8">
              <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/5" />
              <div className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-yellow-600/10" />
              <h3 className="relative text-xl font-bold mb-6">What is waiting for you</h3>
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
            <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
            <p className="mt-1 mb-8 text-gray-600">Enter your email and password to continue.</p>

            {error && (
              <div
                role="alert"
                className="mb-6 flex items-start gap-2 p-3 rounded-xl bg-red-100 text-red-700 text-sm border border-red-200"
              >
                <ExclamationCircleIcon className="h-5 w-5 shrink-0 mt-px" />
                <span>{error}</span>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className={labelCls}>Email</label>
                <div className="relative">
                  <EnvelopeIcon className={iconCls} />
                  <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={inputBase + " pr-4"}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className={labelCls}>Password</label>
                <div className="relative">
                  <LockClosedIcon className={iconCls} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={inputBase + " pr-12"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-3 my-auto h-9 w-9 flex items-center justify-center rounded-full hover:bg-yellow-600/10 transition focus:outline-none focus:ring-2 focus:ring-yellow-600/40"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-yellow-600" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-yellow-600" />
                    )}
                  </button>
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
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                {submitting ? 'SIGNING IN...' : 'SIGN IN'}
              </button>
            </form>

            <div className="flex items-center gap-3 my-7">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400">or continue with</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="flex flex-col items-center gap-2">
              {googleLoading ? <p className="text-sm text-gray-600">Signing in with Google…</p> : null}
              {googleError ? <p className="w-full rounded-xl bg-red-100 p-3 text-sm text-red-700">{googleError}</p> : null}
              {!import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
                <p className="w-full rounded-xl bg-yellow-50 p-3 text-sm text-yellow-800">Google sign-in setup is incomplete.</p>
              ) : null}
              <div ref={googleButtonRef} className="min-h-10" />
            </div>

            <p className="text-center text-sm mt-6">
              Don’t have an account?{' '}
              <Link to="/register" className="text-red-600 font-semibold hover:underline">Register here</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signin;