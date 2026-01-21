import api from './api';

export const uploadPhoto = async (formData) => {
  const response = await api.post('/photos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deletePhoto = async (photoId) => {
  const response = await api.delete(`/photos/${photoId}`);
  return response.data;
};

export const getPhotos = async () => {
  const response = await api.get('/photos');
  return response.data;
};
