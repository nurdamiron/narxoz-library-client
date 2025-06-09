// src/services/userService.js
import BaseService from './baseService';

const userService = {
  /**
   * Получить текущего пользователя
   * @returns {Promise} Promise с данными пользователя
   */
  getMe: async () => {
    return BaseService.get('/users/me');
  },

  /**
   * Обновить данные пользователя
   * @param {Object} userData - Данные пользователя для обновления
   * @returns {Promise} Promise с обновленными данными пользователя
   */
  updateMe: async (userData) => {
    const response = await BaseService.put('/users/me', userData);
    
    if (response.success) {
      // Обновляем данные пользователя в localStorage если обновление прошло успешно
      sessionStorage.setItem('userData', JSON.stringify(response.data));
    }
    
    return response;
  },

  /**
   * Загрузить аватар пользователя
   * @param {File} file - Файл изображения аватара
   * @returns {Promise} Promise с обновленными данными пользователя
   */
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const email = sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail');
      const password = sessionStorage.getItem('userPassword') || localStorage.getItem('userPassword');
      
      const headers = {};
      if (email && password) {
        headers['Authorization'] = 'Basic ' + btoa(`${email}:${password}`);
      }
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5002/api'}/users/me/avatar`, {
        method: 'PUT',
        body: formData,
        headers
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Обновляем данные пользователя в localStorage если обновление прошло успешно
        sessionStorage.setItem('userData', JSON.stringify(data.data));
      }
      
      return data;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  },

  /**
   * Получить статистику пользователя
   * @returns {Promise} Promise со статистикой пользователя
   */
  getMyStats: async () => {
    return BaseService.get('/users/me/stats');
  },

  /**
   * Изменить пароль
   * @param {Object} passwordData - Данные пароля
   * @param {string} passwordData.currentPassword - Текущий пароль
   * @param {string} passwordData.newPassword - Новый пароль
   * @returns {Promise} Promise с результатом
   */
  changePassword: async (passwordData) => {
    const response = await BaseService.put('/users/me/password', passwordData);
    
    if (response.success) {
      // Обновляем пароль в хранилище, если смена пароля прошла успешно
      sessionStorage.setItem('userPassword', passwordData.newPassword);
      if (localStorage.getItem('userEmail')) {
        localStorage.setItem('userPassword', passwordData.newPassword);
      }
    }
    
    return response;
  },

  /**
   * Получить всех пользователей (только для администраторов)
   * @returns {Promise} Promise с данными пользователей
   */
  getUsers: async () => {
    return BaseService.get('/users');
  },

  /**
   * Получить отдельного пользователя (только для администраторов)
   * @param {string} id - ID пользователя
   * @returns {Promise} Promise с данными пользователя
   */
  getUser: async (id) => {
    return BaseService.get(`/users/${id}`);
  }
};

export default userService;