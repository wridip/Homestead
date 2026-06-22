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

// Track whether a token refresh is already in flight so concurrent
// 401s don't trigger multiple simultaneous refresh calls.
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt a refresh on 401s that haven't already been retried,
    // and skip refresh calls themselves to avoid infinite loops.
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh-token')
    ) {
      if (isRefreshing) {
        // Queue the request until the ongoing refresh resolves.
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // The refresh token is in an httpOnly cookie — just call the endpoint.
        await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        processQueue(null);
        // Replay the original request with the refreshed access-token cookie.
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token is also expired or missing — the user must log in again.
        processQueue(refreshError);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
