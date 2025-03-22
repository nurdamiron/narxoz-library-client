/**
 * src/api/axios.js
 * 
 * API-ке барлық сұраныстарды жіберуге арналған Axios данасы
 * Авторизация токенін, базалық URL-ды және қате өңдеуді орнатады
 */
import axios from 'axios';

// Базалық URL бар Axios данасын жасау
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

// Барлық сұраныстарға аутентификация токенін қосу үшін сұраныс интерцепторын қосу
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Жалпы қателерді өңдеу үшін жауап интерцепторын қосу
api.interceptors.response.use(
  response => response,
  error => {
    // 401 Unauthorized қатесін өңдеу - токеннің мерзімі өткен немесе жарамсыз
    if (error.response && error.response.status === 401) {
      // Токенді тазалау және логинге бағыттау
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;