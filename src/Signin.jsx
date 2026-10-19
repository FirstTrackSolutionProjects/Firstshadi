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
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from './context/AuthContext';

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

  return (
    <div>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md">
          <img src="./image/s22.jpg" alt="Sign Up Banner" className="rounded-md w-full object-cover" />
        </div>

        <div className="bg-white w-full max-w-md mt-6 p-6 rounded-md shadow-md">
          <h2 className="text-center text-xl font-semibold mb-6 text-red-700">Sign In</h2>

          {error && (
            <div className="mb-4 p-2 rounded bg-red-100 text-red-700 text-sm">{error}</div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-yellow-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-yellow-600"
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-yellow-600 p-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-yellow-600"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-yellow-600" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-yellow-600" />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-red-900 text-white py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50"
            >
              {submitting ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          <div className="mt-4 flex flex-col items-center gap-2">
            {googleLoading ? <p className="text-sm text-gray-600">Signing in with Google…</p> : null}
            {googleError ? <p className="w-full rounded bg-red-100 p-2 text-sm text-red-700">{googleError}</p> : null}
            {!import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
              <p className="w-full rounded bg-yellow-50 p-2 text-sm text-yellow-800">Google sign-in setup is incomplete.</p>
            ) : null}
            <div ref={googleButtonRef} className="min-h-10" />
          </div>

          <p className="text-center text-sm mt-4">
            Don’t have an account?{' '}
            <Link to="/register" className="text-red-600 hover:underline">Register here</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signin;
