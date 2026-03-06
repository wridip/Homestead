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
  if (!url) return 'https://via.placeholder.com/300';
  if (url.startsWith('http')) return url; // S3 URL
  
  // Local/Legacy path: Remove leading slash if present to avoid double slashes
  const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
  return `${BASE_URL}/${cleanUrl.replace(/\\/g, '/')}`;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default api;
