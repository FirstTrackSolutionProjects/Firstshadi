// // src/services/api.js
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// // Helper function for API calls
// export const apiCall = async (endpoint, options = {}) => {
//   const token = localStorage.getItem('token');
  
//   const headers = {
//     'Content-Type': 'application/json',
//     ...options.headers,
//   };

//   if (token) {
//     headers['Authorization'] = `Bearer ${token}`;
//   }

//   const config = {
//     ...options,
//     headers,
//   };

//   try {
//     const response = await fetch(`${API_URL}${endpoint}`, config);
//     const data = await response.json();

//     if (!response.ok) {
//       if (response.status === 401) {
//         // Token expired or invalid
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         window.location.href = '/login';
//       }
//       throw new Error(data.message || 'Something went wrong');
//     }

//     return data;
//   } catch (error) {
//     console.error('API Error:', error);
//     throw error;
//   }
// };

// // API Methods
// export const api = {
//   get: (endpoint) => apiCall(endpoint, { method: 'GET' }),
//   post: (endpoint, data) => apiCall(endpoint, { 
//     method: 'POST', 
//     body: JSON.stringify(data) 
//   }),
//   put: (endpoint, data) => apiCall(endpoint, { 
//     method: 'PUT', 
//     body: JSON.stringify(data) 
//   }),
//   delete: (endpoint) => apiCall(endpoint, { method: 'DELETE' }),
//   patch: (endpoint, data) => apiCall(endpoint, { 
//     method: 'PATCH', 
//     body: JSON.stringify(data) 
//   }),
//   upload: (endpoint, formData) => {
//     const token = localStorage.getItem('token');
//     const headers = {};
//     if (token) {
//       headers['Authorization'] = `Bearer ${token}`;
//     }
    
//     return apiCall(endpoint, {
//       method: 'POST',
//       body: formData,
//       headers,
//     });
//   }
// };





// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = { ...(options.headers || {}) };

  // Only set JSON content-type when body is NOT FormData
  const isFormData = options.body instanceof FormData;
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await response.json()
      : { success: response.ok, message: await response.text() };

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Don't redirect if we're already on the signin page
        if (!window.location.pathname.startsWith('/signin')) {
          window.location.href = '/signin';
        }
      }
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// API Methods
export const api = {
  get: (endpoint) => apiCall(endpoint, { method: 'GET' }),
  post: (endpoint, data) => apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  put: (endpoint, data) => apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (endpoint) => apiCall(endpoint, { method: 'DELETE' }),
  patch: (endpoint, data) => apiCall(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  upload: (endpoint, formData) => {
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return apiCall(endpoint, {
      method: 'POST',
      body: formData,
      headers,
    });
  }
};