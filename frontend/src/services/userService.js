import api from './api';

export const getMe = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

export const updateMe = async (userData) => {
  // Use FormData for file uploads
  const response = await api.put('/users/me', userData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getUserProfile = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};
