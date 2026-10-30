import axios from 'axios';
import keycloak from '../keycloak';

// Create Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8081/api/admin', // Real Spring Boot Admin URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach real Keycloak token
api.interceptors.request.use(
  async (config) => {
    if (keycloak.token) {
      try {
        await keycloak.updateToken(30);
      } catch (error) {
        console.error('Failed to refresh token', error);
        keycloak.login();
      }
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;
