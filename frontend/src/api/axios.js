import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Automatically add JWT token to headers if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;