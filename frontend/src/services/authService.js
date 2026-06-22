import api from './api';

export const signup = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  return response.data;
};

export const googleLogin = async (tokenId) => {
  const response = await api.post('/auth/google', { tokenId });
  return response.data;
};

export const logout = async () => {
  await api.post('/auth/logout');
};

export const refreshToken = async () => {
  const response = await api.post('/auth/refresh-token');
  return response.data;
};