// // src/context/AuthContext.jsx
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { authService } from '../services/authService';
// import { profileService } from '../services/profileService';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       const storedUser = authService.getUser();
//       if (storedUser) {
//         setUser(storedUser);
//         // Fetch fresh user data
//         fetchCurrentUser();
//       }
//     }
//     setLoading(false);
//   }, []);

//   const fetchCurrentUser = async () => {
//     try {
//       const response = await authService.getCurrentUser();
//       if (response.success) {
//         setUser(response.data.user);
//         authService.updateUser(response.data.user);
//       }
//     } catch (error) {
//       console.error('Failed to fetch user:', error);
//       authService.logout();
//     }
//   };

//   const login = async (email, password) => {
//     try {
//       setError(null);
//       const response = await authService.login(email, password);
//       if (response.success) {
//         setUser(response.data.user);
//         return response;
//       }
//       setError(response.message);
//       return response;
//     } catch (error) {
//       setError(error.message);
//       throw error;
//     }
//   };

//   const register = async (userData) => {
//     try {
//       setError(null);
//       const response = await authService.register(userData);
//       if (response.success) {
//         setUser(response.data.user);
//         return response;
//       }
//       setError(response.message);
//       return response;
//     } catch (error) {
//       setError(error.message);
//       throw error;
//     }
//   };

//   const logout = () => {
//     authService.logout();
//     setUser(null);
//   };

//   const value = {
//     user,
//     loading,
//     error,
//     login,
//     register,
//     logout,
//     isAuthenticated: authService.isAuthenticated(),
//     fetchCurrentUser,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };



// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
// import { profileService } from '../services/profileService'; // unused here

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const storedUser = authService.getUser();
        if (storedUser) {
          setUser(storedUser);
        }
        // Fetch fresh user data before flipping loading=false
        try {
          const response = await authService.getCurrentUser();
          if (response.success) {
            setUser(response.data.user);
            authService.updateUser(response.data.user);
          }
        } catch (err) {
          console.error('Failed to fetch user:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success) {
        setUser(response.data.user);
        authService.updateUser(response.data.user);
        return response.data.user;
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      authService.logout();
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authService.login(email, password);
      if (response.success) {
        setUser(response.data.user);
        return response;
      }
      setError(response.message);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authService.register(userData);
      if (response.success) {
        setUser(response.data.user);
        return response;
      }
      setError(response.message);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    fetchCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};