// src/services/adminBookService.js
import apiClient from './api';

/**
 * Әкімші үшін кітаптарды басқару қызметі
 */
const adminBookService = {
  /**
   * Барлық кітаптарды алу
   * @param {Object} params - Сұраныс параметрлері (беттеу, сүзу)
   * @returns {Promise} API жауабы
   */
  getBooks: async (params = {}) => {
    try {
      const response = await apiClient.get('/books', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  },

  /**
   * Барлық санаттарды алу
   * @returns {Promise} API жауабы
   */
  getCategories: async () => {
    try {
      const response = await apiClient.get('/books/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  /**
   * Жаңа кітап жасау
   * @param {Object} bookData - Кітап мәліметтері
   * @returns {Promise} API жауабы
   */
  createBook: async (bookData) => {
    try {
      const response = await apiClient.post('/books', bookData);
      return response.data;
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  },

  /**
   * Кітапты жаңарту
   * @param {string} id - Кітап идентификаторы
   * @param {Object} bookData - Жаңартылған кітап мәліметтері
   * @returns {Promise} API жауабы
   */
  updateBook: async (id, bookData) => {
    try {
      const response = await apiClient.put(`/books/${id}`, bookData);
      return response.data;
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  },

  /**
   * Кітапты жою
   * @param {string} id - Кітап идентификаторы
   * @returns {Promise} API жауабы
   */
  deleteBook: async (id) => {
    try {
      const response = await apiClient.delete(`/books/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  },

  /**
   * Кітап мұқабасын жүктеу
   * @param {string} id - Кітап идентификаторы
   * @param {File} file - Мұқаба файлы
   * @returns {Promise} API жауабы
   */
  uploadBookCover: async (id, file) => {
    try {
      const formData = new FormData();
      // Use 'file' as the field name to match what the backend expects
      formData.append('file', file);
      
      const response = await apiClient.put(`/books/${id}/cover`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading cover:', error);
      throw error;
    }
  },

  /**
   * Кітап қорын жаңарту
   * @param {string} id - Кітап идентификаторы
   * @param {Object} data - Қор мәліметтері
   * @returns {Promise} API жауабы
   */
  updateInventory: async (id, data) => {
    try {
      const response = await apiClient.put(`/books/${id}/inventory`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating inventory:', error);
      throw error;
    }
  },

  /**
   * Жаңа санат жасау
   * @param {Object} categoryData - Санат мәліметтері
   * @returns {Promise} API жауабы
   */
  createCategory: async (categoryData) => {
    try {
      const response = await apiClient.post('/books/categories', categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  /**
   * Санатты жаңарту
   * @param {string} id - Санат идентификаторы
   * @param {Object} categoryData - Жаңартылған санат мәліметтері
   * @returns {Promise} API жауабы
   */
  updateCategory: async (id, categoryData) => {
    try {
      const response = await apiClient.put(`/books/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  /**
   * Санатты жою
   * @param {string} id - Санат идентификаторы
   * @returns {Promise} API жауабы
   */
  deleteCategory: async (id) => {
    try {
      const response = await apiClient.delete(`/books/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },
  
  /**
   * Санаттар статистикасын алу
   * @returns {Promise} API жауабы - әр санаттағы кітаптар саны
   */
  getCategoryStats: async () => {
    try {
      const response = await apiClient.get('/books/categories/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching category stats:', error);
      throw error;
    }
  },
  
  /**
   * Ең көп қарызға алынған кітаптарды алу (трендтер)
   * @param {number} limit - Қайтарылатын кітаптар саны
   * @returns {Promise} API жауабы
   */
  getTrendingBooks: async (limit = 5) => {
    try {
      const response = await apiClient.get('/books/trending', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending books:', error);
      throw error;
    }
  }
};

export default adminBookService;