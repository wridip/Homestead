import axios from 'axios';

// In production (Vercel monorepo), we use relative paths.
// In development, we fallback to localhost.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// For images: If it's an S3 URL (starts with http), use it as is. 
// Otherwise, it's a local fallback.
export const getImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/300';
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL.replace('/api', '')}/${url.replace(/\\/g, '/')}`;
};

// Extract BASE_URL for backward compatibility if needed
export const BASE_URL = API_BASE_URL.replace('/api', '');

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default api;
