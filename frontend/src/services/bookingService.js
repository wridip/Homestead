import api from './authService';

export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

export const getUserBookings = async () => {
  const response = await api.get('/bookings/user');
  return response.data;
};

export const getHostBookings = async () => {
  const response = await api.get('/bookings/host');
  return response.data;
};

export const cancelBooking = async (bookingId) => {
  const response = await api.put(`/bookings/${bookingId}/cancel`);
  return response.data;
};
