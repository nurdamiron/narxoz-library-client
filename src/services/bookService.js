// src/services/bookService.js
import BaseService from './baseService';

const bookService = {
  /**
   * Получить книги с пагинацией и фильтрацией
   * @param {Object} params - Параметры запроса
   * @returns {Promise} Promise с данными книг
   */
  getBooks: async (params = {}) => {
    return BaseService.get('/books', params);
  },

  /**
   * Получить отдельную книгу по ID
   * @param {string} id - ID книги
   * @returns {Promise} Promise с данными книги
   */
  getBook: async (id) => {
    return BaseService.get(`/books/${id}`);
  },

  /**
   * Получить популярные книги
   * @param {number} limit - Количество книг для возврата
   * @returns {Promise} Promise с популярными книгами
   */
  getPopularBooks: async (limit = 4) => {
    return BaseService.get('/books/popular', { limit });
  },

  /**
   * Получить новые книги
   * @param {number} limit - Количество книг для возврата
   * @returns {Promise} Promise с новыми книгами
   */
  getNewBooks: async (limit = 4) => {
    return BaseService.get('/books/new', { limit });
  },

  /**
   * Получить все категории
   * @returns {Promise} Promise с данными категорий
   */
  getCategories: async () => {
    return BaseService.get('/books/categories');
  },

  /**
   * Создать новую книгу (только для администраторов)
   * @param {Object} bookData - Данные книги
   * @returns {Promise} Promise с созданной книгой
   */
  createBook: async (bookData) => {
    return BaseService.post('/books', bookData);
  },

  /**
   * Обновить книгу (только для администраторов)
   * @param {string} id - ID книги
   * @param {Object} bookData - Данные для обновления
   * @returns {Promise} Promise с обновленной книгой
   */
  updateBook: async (id, bookData) => {
    return BaseService.put(`/books/${id}`, bookData);
  },

  /**
   * Удалить книгу (только для администраторов)
   * @param {string} id - ID книги
   * @returns {Promise} Promise
   */
  deleteBook: async (id) => {
    return BaseService.delete(`/books/${id}`);
  },

  /**
   * Загрузить обложку книги (только для администраторов)
   * @param {string} id - ID книги
   * @param {File} file - Файл изображения обложки
   * @returns {Promise} Promise с обновленным URL обложки
   */
  uploadBookCover: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const email = sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail');
      const password = sessionStorage.getItem('userPassword') || localStorage.getItem('userPassword');
      
      const headers = {};
      if (email && password) {
        headers['Authorization'] = 'Basic ' + btoa(`${email}:${password}`);
      }
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/books/${id}/cover`, {
        method: 'PUT',
        body: formData,
        headers
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading book cover:', error);
      throw error;
    }
  },

  /**
   * Обновить инвентарь книги (только для администраторов)
   * @param {string} id - ID книги
   * @param {Object} data - Данные инвентаря
   * @returns {Promise} Promise с обновленной книгой
   */
  updateInventory: async (id, data) => {
    return BaseService.put(`/books/${id}/inventory`, data);
  }
};

export default bookService;