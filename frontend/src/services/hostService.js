import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Get host dashboard stats
export const getDashboardStats = async () => {
  const token = getAuthToken();
  const response = await axios.get(`${API_URL}/hosts/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Add a new property
export const addProperty = async (propertyData) => {
  const token = getAuthToken();
  const response = await axios.post(`${API_URL}/properties`, propertyData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Get all properties for the host
export const getHostProperties = async () => {
  const token = getAuthToken();
  const response = await axios.get(`${API_URL}/hosts/properties`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Delete a property
export const deleteProperty = async (id) => {
  const token = getAuthToken();
  const response = await axios.delete(`${API_URL}/properties/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};