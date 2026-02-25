import api from './api';

export const sendMessage = async (messageData) => {
  const response = await api.post('/messages', messageData);
  return response.data;
};

export const getInbox = async () => {
  const response = await api.get('/messages/inbox');
  return response.data;
};

export const getOutbox = async () => {
  const response = await api.get('/messages/outbox');
  return response.data;
};

export const getMessageById = async (id) => {
  const response = await api.get(`/messages/${id}`);
  return response.data;
};

export const deleteMessage = async (id) => {
  const response = await api.delete(`/messages/${id}`);
  return response.data;
};
