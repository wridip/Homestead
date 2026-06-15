import api from './api';

export const getAdminStats = async (dateRange = '7') => {
  const response = await api.get(`/admin/stats?dateRange=${dateRange}`);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const getAllProperties = async () => {
  const response = await api.get('/admin/properties');
  return response.data;
};

export const getUserAudit = async (id) => {
  const response = await api.get(`/admin/users/${id}/audit`);
  return response.data;
};

export const togglePropertyStatus = async (id) => {
  const response = await api.put(`/admin/properties/${id}/toggle`);
  return response.data;
};

export const getMonthlyRevenueDetail = async (year, month) => {
  const response = await api.get(`/admin/revenue/${year}/${month}`);
  return response.data;
};
