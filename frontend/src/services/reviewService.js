import api from './api';

export const getReviewsForProperty = async (propertyId) => {
  const response = await api.get(`/properties/${propertyId}/reviews`);
  return response.data;
};

export const createReview = async (propertyId, reviewData) => {
  const response = await api.post(`/properties/${propertyId}/reviews`, reviewData);
  return response.data;
};
