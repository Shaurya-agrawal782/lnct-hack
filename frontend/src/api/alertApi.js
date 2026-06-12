import client from './client';

export const getMyAlerts = async (params) => {
  const response = await client.get('/alerts', { params });
  return response.data;
};

export const markAlertRead = async (id) => {
  const response = await client.patch(`/alerts/${id}/read`);
  return response.data;
};

export const markAllAlertsRead = async () => {
  const response = await client.patch('/alerts/read-all');
  return response.data;
};
