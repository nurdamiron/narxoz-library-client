/**
 * Санаттар сервисі
 * 
 * @description Кітап санаттарын басқару үшін API сұраныстарын өңдейді.
 * Санаттарды қарау, жасау, өңдеу және жою мүмкіндіктерін қамтиды.
 */
import apiClient from './api';

const categoryService = {
  /**
   * Барлық санаттарды алу
   * 
   * @returns {Promise} - Санаттар тізімі
   */
  getAllCategories: async () => {
    try {
      const response = await apiClient.get('/books/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Нақты санатты алу
   * 
   * @param {string} categoryId - Санат идентификаторы
   * @param {boolean} includeBooks - Кітаптар қосу керек пе
   * @returns {Promise} - Санат мәліметтері
   */
  getCategory: async (categoryId, includeBooks = false) => {
    try {
      const queryParam = includeBooks ? '?includeBooks=true' : '';
      const response = await apiClient.get(`/books/categories/${categoryId}${queryParam}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Жаңа санат жасау (тек әкімшілер үшін)
   * 
   * @param {object} categoryData - Санат мәліметтері
   * @param {string} categoryData.name - Санат атауы
   * @param {string} categoryData.description - Санат сипаттамасы (міндетті емес)
   * @returns {Promise} - Жасалған санат мәліметтері
   */
  createCategory: async (categoryData) => {
    try {
      const response = await apiClient.post('/books/categories', categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Санатты жаңарту (тек әкімшілер үшін)
   * 
   * @param {string} categoryId - Санат идентификаторы
   * @param {object} categoryData - Жаңартылатын мәліметтер
   * @returns {Promise} - Жаңартылған санат мәліметтері
   */
  updateCategory: async (categoryId, categoryData) => {
    try {
      const response = await apiClient.put(`/books/categories/${categoryId}`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Санатты жою (тек әкімшілер үшін)
   * 
   * @param {string} categoryId - Санат идентификаторы
   * @returns {Promise} - Жою нәтижесі
   */
  deleteCategory: async (categoryId) => {
    try {
      const response = await apiClient.delete(`/books/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Санаттар статистикасын алу (тек әкімшілер үшін)
   * 
   * @returns {Promise} - Санаттар статистикасы
   */
  getCategoryStats: async () => {
    try {
      const response = await apiClient.get('/books/categories/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default categoryService;