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
  
  // Local/Legacy path: Ensure it points to uploads directory if not absolute
  const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
  
  // If the URL doesn't already contain 'uploads/', assume it needs it (matching backend public/uploads)
  const finalPath = cleanUrl.includes('uploads/') ? cleanUrl : `uploads/${cleanUrl}`;
  
  return `${BASE_URL}/${finalPath.replace(/\\/g, '/')}`;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default api;
