import client from './client';

export const createResource = async (payload) => {
  const response = await client.post('/resources', payload);
  return response.data;
};

export const getResources = async (params) => {
  const response = await client.get('/resources', { params });
  return response.data;
};

export const getResourceById = async (id) => {
  const response = await client.get(`/resources/${id}`);
  return response.data;
};

export const updateResource = async (id, payload) => {
  const response = await client.patch(`/resources/${id}`, payload);
  return response.data;
};

export const updateResourceStatus = async (id, payload) => {
  const response = await client.patch(`/resources/${id}/status`, payload);
  return response.data;
};

export const deleteResource = async (id) => {
  const response = await client.delete(`/resources/${id}`);
  return response.data;
};
