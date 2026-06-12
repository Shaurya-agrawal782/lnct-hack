import client from './client';

export const getResponders = async () => {
  const response = await client.get('/users/responders');
  return response.data;
};
