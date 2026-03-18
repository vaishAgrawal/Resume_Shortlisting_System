import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Automatically add JWT token to headers if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(`Axios: Attached token to request: ${config.url}`);
  } else {
    console.warn(`Axios: No token found for request: ${config.url}`);
  }
  return config;
});

export default api;