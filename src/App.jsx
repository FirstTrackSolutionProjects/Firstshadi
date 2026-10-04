// import React from 'react'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import './App.css'

// // Pages
// import Home from './pages/Home'
// import About from './pages/About'
// import Contact from './pages/Contact'
// import Register from './pages/Register'
// import Signin from './Signin'
// import Frod from'./pages/Frod'
// import Box from './pages/Box'
// import Boxsc from'./pages/Boxsc'
// import Rels from './pages/Rels'
// import Terms from './pages/Terms'
// import Priv from './pages/Priv'
// import Refcan from './pages/Refcan'
// import Cyb from './pages/Cyb'
// import Memb from './pages/Memb'
// import Mreg from './pages/Mreg'
// import Gromdtl from './pages/Grmdtl'
// import Regone from './pages/Regone'
// import Sol from './pages/Sol'
// import Car from './pages/Car'
// import Fmprof from './pages/Fmprof'
// import Mymatch from './pages/Mymatch'
// // import Filt from './pages/Filt'
// import Preview from'./pages/Preview'
// import Paym from'./pages/Paym'
// import Myprofile from './pages/Myprofile'
// import Ncon from './pages/Ncon'
// import Intrect from './pages/Intrect'
// import Notif from './pages/Notif'


// // Components
// import Navbar from './components/Navbar'
// import Footer from './components/Footer'
// import Landing from './components/Landing'
// import Spcl from './components/Spcl'
// import Prsn from './components/Prsn'
// import Pstst from './components/Pstst'
// import Trst from './components/Trst'

// // Home Page Composition
// const HomePage = () => (
//   <>
//     <Landing />
//     <Spcl />
//     <Prsn />
//     <Pstst />
//     <Trst />
//     <Footer />
//   </>
// )

// function App() {
//   return (
//     <Router>
//       <Navbar />

//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contact />} />
//          <Route path="/register" element={<Register />} />
//           <Route path="/signin" element={<Signin />} />
//           <Route path="/fraud" element={<Frod />} />
//           <Route path="/box" element={<Box />} />
//           <Route path="/boxsc" element={<Boxsc />} />
//             <Route path="/rels" element={<Rels />} />
//             <Route path="/terms" element={<Terms />} />
//               <Route path="/priv" element={<Priv />} />
//                <Route path="/ref" element={<Refcan />} />
//                <Route path="/cyb" element={<Cyb />} />
//                <Route path="/memb" element={<Memb />} />
//                <Route path="/mreg" element={<Mreg />} />
//                 <Route path="/grm" element={<Gromdtl />} />
//                 <Route path="/regone" element={<Regone />} />
//                  <Route path="/sol" element={<Sol />} />
//                  <Route path="/car" element={<Car />} />
//                   <Route path="/fmprof" element={<Fmprof />} />
//                    <Route path="/mymatch" element={<Mymatch />} />
//                    {/* <Route path="/filt" element={<Filt />} /> */}
//                    <Route path="/preview" element={<Preview />} />
//                    <Route path="/paym" element={<Paym />} />
//                       <Route path="/myprofile" element={<Myprofile />} />
//                        <Route path="/ncon" element={<Ncon />} />
//                        <Route path="/int" element={<Intrect />} />
//                        <Route path="/notifications" element={<Notif />} />
                   
                   
               
//       </Routes>
//     </Router>
//   )
// }

// export default App


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Register from './pages/Register';
import Signin from './Signin';
import Frod from './pages/Frod';
import Box from './pages/Box';
import Boxsc from './pages/Boxsc';
import Rels from './pages/Rels';
import Terms from './pages/Terms';
import Priv from './pages/Priv';
import Refcan from './pages/Refcan';
import Cyb from './pages/Cyb';
import Memb from './pages/Memb';
import Mreg from './pages/Mreg';
import Gromdtl from './pages/Grmdtl';
import Regone from './pages/Regone';
import Sol from './pages/Sol';
import Car from './pages/Car';
import Fmprof from './pages/Fmprof';
import Mymatch from './pages/Mymatch';
// import Filt from './pages/Filt';
import Preview from './pages/Preview';
import Paym from './pages/Paym';
import Myprofile from './pages/Myprofile';
import Ncon from './pages/Ncon';
import Intrect from './pages/Intrect';
import Notif from './pages/Notif';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './components/Landing';
import Spcl from './components/Spcl';
import Prsn from './components/Prsn';
import Pstst from './components/Pstst';
import Trst from './components/Trst';

// Import Auth Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  return children;
};

// Home Page Composition
const HomePage = () => (
  <>
    <Landing />
    <Spcl />
    <Prsn />
    <Pstst />
    <Trst />
    <Footer />
  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes - No authentication required */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/fraud" element={<Frod />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/priv" element={<Priv />} />
          <Route path="/ref" element={<Refcan />} />
          <Route path="/cyb" element={<Cyb />} />
          <Route path="/memb" element={<Memb />} />
          
          {/* Semi-Protected Routes - Can be accessed without login but redirect to login if needed */}
          <Route path="/mreg" element={<Mreg />} />
          <Route path="/grm" element={<Gromdtl />} />
          <Route path="/regone" element={<Regone />} />
          
          {/* Protected Routes - Require authentication */}
          <Route path="/box" element={
            <ProtectedRoute>
              <Box />
            </ProtectedRoute>
          } />
          <Route path="/boxsc" element={
            <ProtectedRoute>
              <Boxsc />
            </ProtectedRoute>
          } />
          <Route path="/rels" element={
            <ProtectedRoute>
              <Rels />
            </ProtectedRoute>
          } />
          <Route path="/sol" element={
            <ProtectedRoute>
              <Sol />
            </ProtectedRoute>
          } />
          <Route path="/car" element={
            <ProtectedRoute>
              <Car />
            </ProtectedRoute>
          } />
          <Route path="/fmprof" element={
            <ProtectedRoute>
              <Fmprof />
            </ProtectedRoute>
          } />
          <Route path="/mymatch" element={
            <ProtectedRoute>
              <Mymatch />
            </ProtectedRoute>
          } />
          <Route path="/preview" element={
            <ProtectedRoute>
              <Preview />
            </ProtectedRoute>
          } />
          <Route path="/paym" element={
            <ProtectedRoute>
              <Paym />
            </ProtectedRoute>
          } />
          <Route path="/myprofile" element={
            <ProtectedRoute>
              <Myprofile />
            </ProtectedRoute>
          } />
          <Route path="/ncon" element={
            <ProtectedRoute>
              <Ncon />
            </ProtectedRoute>
          } />
          <Route path="/int" element={
            <ProtectedRoute>
              <Intrect />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notif />
            </ProtectedRoute>
          } />
          
          {/* 404 Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// 404 Not Found Component
const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
    <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
    <h2 className="text-2xl font-semibold text-gray-600 mb-2">Page Not Found</h2>
    <p className="text-gray-500 mb-6">The page you're looking for doesn't exist or has been moved.</p>
    <a href="/" className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
      Go Home
    </a>
  </div>
);

export default App;