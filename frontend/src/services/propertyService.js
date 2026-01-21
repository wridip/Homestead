import api from './api';

// Get all properties
export const getProperties = async () => {
  const response = await api.get('/properties');
  return response.data;
};

// Get a single property by ID
export const getPropertyById = async (id) => {
  const response = await api.get(`/properties/${id}`);
  return response.data;
};

// Update a property
export const updateProperty = async (id, propertyData) => {
  const response = await api.put(`/properties/${id}`, propertyData);
  return response.data;
};

// Update property images
export const updatePropertyImages = async (id, formData) => {
  const response = await api.put(`/properties/${id}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
