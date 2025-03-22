// src/services/bookmarkService.js
import apiClient from './api';

const bookmarkService = {
  /**
   * Get all bookmarks for current user
   * @returns {Promise} Promise object with bookmarks data
   */
  getBookmarks: async () => {
    const response = await apiClient.get('/bookmarks');
    return response.data;
  },

  /**
   * Add a bookmark
   * @param {Object} data - Bookmark data
   * @param {string} data.bookId - Book ID to bookmark
   * @returns {Promise} Promise object with created bookmark
   */
  addBookmark: async (data) => {
    const response = await apiClient.post('/bookmarks', data);
    return response.data;
  },

  /**
   * Delete bookmark
   * @param {string} id - Bookmark ID
   * @returns {Promise} Promise object
   */
  deleteBookmark: async (id) => {
    const response = await apiClient.delete(`/bookmarks/${id}`);
    return response.data;
  },

  /**
   * Delete bookmark by book ID
   * @param {string} bookId - Book ID
   * @returns {Promise} Promise object
   */
  deleteBookmarkByBookId: async (bookId) => {
    const response = await apiClient.delete(`/bookmarks/book/${bookId}`);
    return response.data;
  },

  /**
   * Toggle bookmark (add if not exists, remove if exists)
   * @param {string} bookId - Book ID
   * @returns {Promise} Promise object with bookmark status
   */
  toggleBookmark: async (bookId) => {
    const response = await apiClient.post(`/bookmarks/toggle/${bookId}`);
    return response.data;
  },

  /**
   * Check if a book is bookmarked by the current user
   * @param {string} bookId - Book ID
   * @returns {Promise} Promise object with bookmark status
   */
  checkBookmark: async (bookId) => {
    const response = await apiClient.get(`/bookmarks/check/${bookId}`);
    return response.data;
  }
};

export default bookmarkService;