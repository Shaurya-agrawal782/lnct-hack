import client from './client';

export const getSummary = async () => {
  const response = await client.get('/analytics/summary');
  return response.data;
};

export const getIncidentStats = async () => {
  const response = await client.get('/analytics/incidents');
  return response.data;
};

export const getResourceStats = async () => {
  const response = await client.get('/analytics/resources');
  return response.data;
};

export const getAlertStats = async () => {
  const response = await client.get('/analytics/alerts');
  return response.data;
};

export const getDashboardOverview = async () => {
  const response = await client.get('/analytics/dashboard');
  return response.data;
};
