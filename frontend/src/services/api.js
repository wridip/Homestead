import axios from 'axios';

// --- Smart API URL Detection ---
// If we are in production (Vercel), we use relative '/api'
// If we are in development, we use 'http://localhost:5000/api'
const isProduction = import.meta.env.PROD;
export const API_BASE_URL = isProduction 
  ? '/api' 
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

// Extract the domain for images
export const BASE_URL = isProduction 
  ? window.location.origin 
  : 'http://localhost:5000';

// For images: If it's an S3 URL (starts with http), use it as is.
export const getImageUrl = (url) => {
  if (!url || url === 'undefined' || url.includes('undefined')) {
    return 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'; // high quality house placeholder
  }
  if (url.startsWith('http')) return url; // S3 URL
  
  // Normalize slashes (especially for Windows backslashes)
  const normalizedUrl = url.replace(/\\/g, '/');
  
  // Remove leading slash if present
  const cleanUrl = normalizedUrl.startsWith('/') ? normalizedUrl.substring(1) : normalizedUrl;
  
  // If the URL doesn't already start with 'uploads/', prepend it
  const finalPath = cleanUrl.startsWith('uploads/') ? cleanUrl : `uploads/${cleanUrl}`;
  
  return `${BASE_URL}/${finalPath}`;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Handle global 401 responses (expired / invalid token → redirect to login)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Cookie has expired or been cleared server-side — send user to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
