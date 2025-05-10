// src/services/authService.js
import apiClient from './api';
import { translateError } from '../utils/errorMessages';

const authService = {
  /**
   * Логин пользователя с email и паролем
   * @param {Object} credentials - Учетные данные пользователя
   * @param {string} credentials.email - Email пользователя
   * @param {string} credentials.password - Пароль пользователя
   * @returns {Promise} Promise объект с данными пользователя
   */
  login: async (credentials) => {
    try {
      // Устанавливаем базовую аутентификацию для запроса
      const authHeader = 'Basic ' + btoa(`${credentials.email}:${credentials.password}`);
      
      const response = await apiClient.post('/auth/login', credentials, {
        headers: {
          'Authorization': authHeader
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      
      // Используем переведенные сообщения об ошибках
      throw new Error(translateError(error));
    }
  },

  /**
   * Получение текущего пользователя
   * @param {Object} credentials - Учетные данные пользователя
   * @returns {Promise} Promise объект с данными пользователя
   */
  getCurrentUser: async (credentials) => {
    try {
      // Устанавливаем базовую аутентификацию для запроса
      const authHeader = 'Basic ' + btoa(`${credentials.email}:${credentials.password}`);
      
      const response = await apiClient.get('/auth/me', {
        headers: {
          'Authorization': authHeader
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  /**
   * Обновление данных пользователя
   * @param {Object} userData - Данные пользователя для обновления
   * @param {Object} credentials - Учетные данные пользователя для аутентификации
   * @returns {Promise} Promise объект с обновленными данными пользователя
   */
  updateUserDetails: async (userData, credentials) => {
    try {
      // Устанавливаем базовую аутентификацию для запроса
      const authHeader = 'Basic ' + btoa(`${credentials.email}:${credentials.password}`);
      
      const response = await apiClient.put('/auth/updatedetails', userData, {
        headers: {
          'Authorization': authHeader
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Update user details error:', error);
      throw error;
    }
  },

  /**
   * Изменение пароля пользователя
   * @param {Object} passwordData - Данные для изменения пароля
   * @param {string} passwordData.currentPassword - Текущий пароль
   * @param {string} passwordData.newPassword - Новый пароль
   * @param {Object} credentials - Учетные данные пользователя для аутентификации
   * @returns {Promise} Promise объект
   */
  changePassword: async (passwordData, credentials) => {
    try {
      // Устанавливаем базовую аутентификацию для запроса
      const authHeader = 'Basic ' + btoa(`${credentials.email}:${credentials.password}`);
      
      const response = await apiClient.put('/auth/updatepassword', passwordData, {
        headers: {
          'Authorization': authHeader
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  /**
   * Проверка существования email
   * @param {Object} data - Данные для проверки
   * @param {string} data.email - Email для проверки
   * @returns {Promise} Promise объект
   */
  checkEmail: async (data) => {
    try {
      const response = await apiClient.post('/auth/check-email', data);
      return response.data;
    } catch (error) {
      console.error('Check email error:', error);
      throw error;
    }
  }
};

export default authService;