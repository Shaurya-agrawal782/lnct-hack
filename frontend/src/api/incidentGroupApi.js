import client from './client';

export const getIncidentGroups = async (params = {}) => {
  const response = await client.get('/incident-groups', { params });
  return response.data;
};

export const getIncidentGroupById = async (id) => {
  const response = await client.get(`/incident-groups/${id}`);
  return response.data;
};

export const updateIncidentGroupStatus = async (id, status, resolutionNote) => {
  const response = await client.patch(`/incident-groups/${id}/status`, { status, resolutionNote });
  return response.data;
};
