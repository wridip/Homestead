import api from './authService';

// Get host dashboard stats
export const getDashboardStats = async () => {
  const response = await api.get('/hosts/stats');
  return response.data;
};

// Add a new property
export const addProperty = async (propertyData) => {
  const response = await api.post('/properties', propertyData);
  return response.data;
};

// Get all properties for the host
export const getHostProperties = async () => {
  const response = await api.get('/hosts/properties');
  return response.data;
};

// Delete a property
export const deleteProperty = async (id) => {
  const response = await api.delete(`/properties/${id}`);
  return response.data;
};