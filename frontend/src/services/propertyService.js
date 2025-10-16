import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get all properties
export const getProperties = async () => {
  const response = await axios.get(`${API_URL}/properties`);
  return response.data;
};

// Get a single property by ID
export const getPropertyById = async (id) => {
  const response = await axios.get(`${API_URL}/properties/${id}`);
  return response.data;
};

// Update a property
export const updateProperty = async (id, propertyData) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/properties/${id}`, propertyData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
