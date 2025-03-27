// src/services/bookmarkService.js
import BaseService from './baseService';

const bookmarkService = {
  /**
   * Получить все закладки текущего пользователя
   * @returns {Promise} Promise с данными закладок
   */
  getBookmarks: async () => {
    return BaseService.get('/bookmarks');
  },

  /**
   * Добавить закладку
   * @param {Object} data - Данные закладки
   * @param {string} data.bookId - ID книги для закладки
   * @returns {Promise} Promise с созданной закладкой
   */
  addBookmark: async (data) => {
    return BaseService.post('/bookmarks', data);
  },

  /**
   * Удалить закладку
   * @param {string} id - ID закладки
   * @returns {Promise} Promise
   */
  deleteBookmark: async (id) => {
    return BaseService.delete(`/bookmarks/${id}`);
  },

  /**
   * Удалить закладку по ID книги
   * @param {string} bookId - ID книги
   * @returns {Promise} Promise
   */
  deleteBookmarkByBookId: async (bookId) => {
    return BaseService.delete(`/bookmarks/book/${bookId}`);
  },

  /**
   * Переключить закладку (добавить если не существует, удалить если существует)
   * @param {string} bookId - ID книги
   * @returns {Promise} Promise со статусом закладки
   */
  toggleBookmark: async (bookId) => {
    return BaseService.post(`/bookmarks/toggle/${bookId}`);
  },

  /**
   * Проверить, добавлена ли книга в закладки текущим пользователем
   * @param {string} bookId - ID книги
   * @returns {Promise} Promise со статусом закладки
   */
  checkBookmark: async (bookId) => {
    return BaseService.get(`/bookmarks/check/${bookId}`);
  }
};

export default bookmarkService;