import axios from 'axios';

// --- Smart API URL Detection ---
// If we are in production (Vercel), we use relative '/api'
// If we are in development, we use 'http://localhost:5000/api'
const isProduction = import.meta.env.PROD;

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Remove trailing slash from API URL if it exists
const cleanApiUrl = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

export const API_BASE_URL = isProduction ? '/api' : cleanApiUrl;

// Extract the domain for images: remove the '/api' suffix to get the base domain
export const BASE_URL = isProduction 
  ? window.location.origin 
  : cleanApiUrl.replace(/\/api$/, '') || 'http://localhost:5000';

// For images: If it's an S3 URL (starts with http), use it as is.
export const getImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/300';
  if (url.startsWith('http')) return url; // S3 URL
  
  // Remove leading slash if present to avoid double slashes
  const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
  // Ensure we don't end up with multiple slashes between BASE_URL and cleanUrl
  const domain = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  return `${domain}/${cleanUrl.replace(/\\/g, '/')}`;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default api;
