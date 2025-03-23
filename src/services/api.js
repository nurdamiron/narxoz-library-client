// src/services/api.js
import axios from 'axios';
import apiDebugger from '../utils/apiDebugger';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token and log requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Log request for debugging
    apiDebugger.logRequest(config.url, config.method, config.data);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors and log responses
apiClient.interceptors.response.use(
  (response) => {
    // Log successful response
    apiDebugger.logResponse(response.config.url, response);
    return response;
  },
  (error) => {
    // Log error response
    apiDebugger.logError(error.config?.url || 'unknown endpoint', error);
    
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login if token is invalid/expired
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;