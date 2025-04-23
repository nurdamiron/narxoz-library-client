/**
 * Админ пайдаланушы сервисі
 * 
 * @description Пайдаланушыларды басқару қызметін қамтамасыз ететін сервис.
 * Админдер пайдаланушыларды қарау, жасау, өңдеу және жою мүмкіндіктерін қолдайды.
 */

import apiClient from './api';

const adminUserService = {
  /**
   * Барлық пайдаланушыларды алу
   * 
   * @param {Object} params - Сұраныс параметрлері (іздеу, беттеу, сүзу)
   * @returns {Promise} Пайдаланушылар тізімі бар уәде
   */
  getUsers: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/users?${queryString}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Жеке пайдаланушыны алу
   * 
   * @param {string} id - Пайдаланушы ID
   * @returns {Promise} Пайдаланушы мәліметтері
   */
  getUser: async (id) => {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Жаңа пайдаланушы жасау
   * 
   * @param {Object} userData - Пайдаланушы мәліметтері
   * @returns {Promise} Жасалған пайдаланушы мәліметтері
   */
  createUser: async (userData) => {
    try {
      // Используем новый endpoint для регистрации пользователей
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Пайдаланушыны жаңарту
   * 
   * @param {string} id - Пайдаланушы ID
   * @param {Object} userData - Жаңартылатын мәліметтер
   * @returns {Promise} Жаңартылған пайдаланушы мәліметтері
   */
  updateUser: async (id, userData) => {
    try {
      const response = await apiClient.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Пайдаланушыны жою
   * 
   * @param {string} id - Пайдаланушы ID
   * @returns {Promise} Жою нәтижесі
   */
  deleteUser: async (id) => {
    try {
      const response = await apiClient.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Әкімші немесе студент тіркеу (тек әкімші үшін)
   * 
   * @param {Object} userData - Жаңа пайдаланушы мәліметтері
   * @returns {Promise} Жасалған пайдаланушы мәліметтері
   */
  registerUser: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Пайдаланушы статистикасын алу
   * 
   * @returns {Promise} Пайдаланушылар бойынша статистика
   */
  getUserStats: async () => {
    try {
      const response = await apiClient.get('/users/stats');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Құпия сөзді әкімші арқылы өзгерту
   * 
   * @param {string} id - Пайдаланушы ID
   * @param {string} newPassword - Жаңа құпия сөз
   * @returns {Promise} Өзгерту нәтижесі
   */
  resetPassword: async (id, newPassword) => {
    try {
      const response = await apiClient.put(`/users/${id}/reset-password`, { newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default adminUserService;