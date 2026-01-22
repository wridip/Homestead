import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import api from './services/api';

// Fetch CSRF token and then render the app
api.get('/csrf-token')
  .then((response) => {
    const csrfToken = response.data.csrfToken;
    api.defaults.headers.common['X-CSRF-Token'] = csrfToken;
  })
  .catch((error) => {
    console.error('Failed to fetch CSRF token:', error);
  })
  .finally(() => {
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  });
