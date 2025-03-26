import axios from 'axios';

const api = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:2047',  // Substitua localhost por seu IP local
  timeout: 5000,
});

export default api;
