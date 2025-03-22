// src/services/adminBorrowService.js
import apiClient from './api';

const adminBorrowService = {
  /**
   * Get all borrows with filters
   * @param {Object} params - Query parameters
   * @returns {Promise} Promise object with borrows data
   */
  getAllBorrows: async (params = {}) => {
    const response = await apiClient.get('/borrows/all', { params });
    return response.data;
  },

  /**
   * Update borrow record
   * @param {string} id - Borrow ID
   * @param {Object} data - Borrow data to update
   * @returns {Promise} Promise object with updated borrow
   */
  updateBorrow: async (id, data) => {
    const response = await apiClient.put(`/borrows/${id}`, data);
    return response.data;
  },

  /**
   * Check for overdue borrows and update their status
   * @returns {Promise} Promise object with updated overdue borrows
   */
  checkOverdueBorrows: async () => {
    const response = await apiClient.get('/borrows/check-overdue');
    return response.data;
  },

  /**
   * Send reminders for books due soon
   * @returns {Promise} Promise object with reminder results
   */
  sendDueReminders: async () => {
    const response = await apiClient.get('/borrows/send-reminders');
    return response.data;
  },

  /**
   * Get borrow statistics
   * @returns {Promise} Promise object with borrow statistics
   */
  getBorrowStats: async () => {
    const response = await apiClient.get('/borrows/stats');
    return response.data;
  },

  /**
   * Get most bookmarked books (trending)
   * @param {number} limit - Number of books to return
   * @returns {Promise} Promise object with trending books
   */
  getTrendingBooks: async (limit = 5) => {
    const response = await apiClient.get('/bookmarks/trending', { params: { limit } });
    return response.data;
  },

  /**
   * Get all bookmarks (admin only)
   * @param {Object} params - Query parameters
   * @returns {Promise} Promise object with bookmarks data
   */
  getAllBookmarks: async (params = {}) => {
    const response = await apiClient.get('/bookmarks/all', { params });
    return response.data;
  }
};

export default adminBorrowService;