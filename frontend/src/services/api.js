import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getMonthlyResults = async () => {
  const response = await api.get('/api/monthly-results');
  return response.data;
};

export const getMonthlyResultByMonth = async (month) => {
  const response = await api.get(`/api/monthly-results/${month}`);
  return response.data;
};

export const getFactorSummary = async () => {
  const response = await api.get('/api/factor-summary');
  return response.data;
};

export const getModelInfo = async () => {
  const response = await api.get('/api/model-info');
  return response.data;
};

export const getRegionalData = async () => {
  const response = await api.get('/api/regional-data');
  return response.data;
};

export const getScatterPlotData = async (factor) => {
  const response = await api.get(`/api/scatter-plot/${factor}`);
  return response.data;
};

export const getStatistics = async () => {
  const response = await api.get('/api/statistics');
  return response.data;
};

export const getLineChartData = async () => {
  const response = await api.get('/api/line-chart-data');
  return response.data;
};

export const getBarChartData = async () => {
  const response = await api.get('/api/bar-chart-data');
  return response.data;
};

export default api;
