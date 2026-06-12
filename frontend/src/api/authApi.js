import client from './client';

export const registerUser = async (payload) => {
  const response = await client.post('/auth/register', payload);
  return response.data;
};

export const loginUser = async (payload) => {
  const response = await client.post('/auth/login', payload);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await client.get('/auth/me');
  return response.data;
};

export const logoutUser = async () => {
  const response = await client.post('/auth/logout');
  return response.data;
};
