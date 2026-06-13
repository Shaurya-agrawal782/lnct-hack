import client from './client';

export const analyzeReportDraft = async (payload) => {
  const response = await client.post('/ai/report-assist', payload);
  return response.data;
};
