// src/services/api.js
import axios from 'axios';
import apiDebugger from '../utils/apiDebugger';

// Получаем базовый URL из переменных окружения или используем локальный адрес
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

// Для отладки выводим используемый API URL
console.log(`🌐 API URL: ${API_URL}`);

// Создание экземпляра axios с настройками по умолчанию
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Важно для работы с загрузкой файлов и CORS
  withCredentials: false,
  timeout: 30000 // Увеличиваем таймаут для операций с файлами
});

// Добавление интерцептора запросов для включения учетных данных из сессии или локального хранилища
apiClient.interceptors.request.use(
  (config) => {
    // Если в заголовках уже установлена аутентификация, используем её
    if (config.headers['Authorization']) {
      return config;
    }
    
    // Иначе пытаемся получить учетные данные из хранилища
    const email = sessionStorage.getItem('email') || localStorage.getItem('email');
    const password = sessionStorage.getItem('userPassword') || localStorage.getItem('userPassword');
    
    if (email && password) {
      // Создаем заголовок Basic Authentication
      config.headers['Authorization'] = 'Basic ' + btoa(`${email}:${password}`);
      // Для отладки добавляем информацию об авторизации
      console.log(`🔑 Использую авторизацию для ${email}`);
    }
    
    // Не изменяем заголовок Content-Type, если он уже установлен для multipart/form-data
    if (config.headers['Content-Type'] === 'multipart/form-data') {
      delete config.headers['Content-Type']; // Позволить axios автоматически установить boundary
    }
    
    // Для запросов загрузки файлов добавляем специальные заголовки
    if (config.url && config.url.includes('/cover') && config.method === 'put') {
      console.log('📤 Запрос на загрузку файла:', config.url);
    }
    
    // Логирование запроса для отладки
    apiDebugger.logRequest(config.url, config.method, config.data);
    
    return config;
  },
  (error) => {
    console.error('❌ Ошибка запроса:', error);
    return Promise.reject(error);
  }
);

// Добавление интерцептора ответов для обработки ошибок и логирования
apiClient.interceptors.response.use(
  (response) => {
    // Логирование успешного ответа
    apiDebugger.logResponse(response.config.url, response);
    
    // Специальная обработка для загрузки обложек
    if (response.config.url && response.config.url.includes('/cover') && response.status === 200) {
      console.log('✅ Успешная загрузка обложки:', response.data);
      
      // Проверка корректности URL обложки
      if (response.data && response.data.data && response.data.data.cover) {
        console.log('🔗 URL обложки:', response.data.data.cover);
      }
    }
    
    return response;
  },
  (error) => {
    // Логирование ошибки
    apiDebugger.logError(error.config?.url || 'unknown endpoint', error);
    
    // Более подробная обработка ошибок авторизации
    if (error.response) {
      if (error.response.status === 401) {
        console.warn('🔒 Ошибка авторизации 401:', error.response.data);
        
        // Проверяем текущий путь
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && !currentPath.includes('/register')) {
          console.log('🔄 Перенаправляю на страницу входа из-за ошибки авторизации');
          
          // Очищаем данные авторизации
          sessionStorage.removeItem('email');
          sessionStorage.removeItem('userPassword');
          localStorage.removeItem('email');
          localStorage.removeItem('userPassword');
          
          // Более мягкое перенаправление, которое сработает после текущей операции
          setTimeout(() => {
            window.location.href = '/login';
          }, 100);
        }
      } else if (error.response.status === 403) {
        console.warn('🚫 Ошибка доступа 403:', error.response.data);
      }
    }
    
    // Специальная обработка для ошибок при загрузке обложек
    if (error.config?.url && error.config.url.includes('/cover')) {
      console.error('❌ Ошибка при загрузке обложки:', error.message);
      
      if (error.response?.data) {
        console.error('❌ Детали ошибки:', error.response.data);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;