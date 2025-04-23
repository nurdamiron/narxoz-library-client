// src/services/api.js
import axios from 'axios';
import apiDebugger from '../utils/apiDebugger';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Создание экземпляра axios с настройками по умолчанию
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Добавление интерцептора запросов для включения учетных данных из сессии или локального хранилища
apiClient.interceptors.request.use(
  (config) => {
    // Если в заголовках уже установлена аутентификация, используем её
    if (config.headers['Authorization']) {
      return config;
    }
    
    // Иначе пытаемся получить учетные данные из хранилища
    const email = sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail');
    const password = sessionStorage.getItem('userPassword') || localStorage.getItem('userPassword');
    
    if (email && password) {
      // Создаем заголовок Basic Authentication
      config.headers['Authorization'] = 'Basic ' + btoa(`${email}:${password}`);
    }
    
    // Не изменяем заголовок Content-Type, если он уже установлен для multipart/form-data
    if (config.headers['Content-Type'] === 'multipart/form-data') {
      delete config.headers['Content-Type']; // Позволить axios автоматически установить boundary
    }
    
    // Логирование запроса для отладки
    apiDebugger.logRequest(config.url, config.method, config.data);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Добавление интерцептора ответов для обработки ошибок и логирования
apiClient.interceptors.response.use(
  (response) => {
    // Логирование успешного ответа
    apiDebugger.logResponse(response.config.url, response);
    return response;
  },
  (error) => {
    // Логирование ошибки
    apiDebugger.logError(error.config?.url || 'unknown endpoint', error);
    
    // Обработка ошибки авторизации
    if (error.response && error.response.status === 401) {
      // Перенаправление на страницу входа при ошибке авторизации
      sessionStorage.removeItem('userEmail');
      sessionStorage.removeItem('userPassword');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userPassword');
      
      // Перенаправление только если мы не на странице входа
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;