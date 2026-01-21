import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // This is important for sending cookies
});

// Fetch CSRF token and set it as a default header
api.get('/csrf-token').then((response) => {
  const csrfToken = response.data.csrfToken;
  api.defaults.headers.common['X-CSRF-Token'] = csrfToken;
});

export default api;
