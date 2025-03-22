// src/services/borrowService.js
import apiClient from './api';

const borrowService = {
  /**
   * Get current user's borrow history
   * @param {Object} params - Query parameters
   * @param {string} params.status - Filter by status ('active', 'returned', 'overdue')
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise} Promise object with borrows data
   */
  getUserBorrows: async (params = {}) => {
    const response = await apiClient.get('/borrows', { params });
    return response.data;
  },

  /**
   * Borrow a book
   * @param {Object} data - Borrow data
   * @param {string} data.bookId - Book ID to borrow
   * @returns {Promise} Promise object with created borrow
   */
  borrowBook: async (data) => {
    const response = await apiClient.post('/borrows', data);
    return response.data;
  },

  /**
   * Get a single borrow record
   * @param {string} id - Borrow ID
   * @returns {Promise} Promise object with borrow data
   */
  getBorrow: async (id) => {
    const response = await apiClient.get(`/borrows/${id}`);
    return response.data;
  },

  /**
   * Return a borrowed book
   * @param {string} id - Borrow ID
   * @returns {Promise} Promise object with updated borrow
   */
  returnBook: async (id) => {
    const response = await apiClient.put(`/borrows/${id}/return`);
    return response.data;
  },

  /**
   * Extend borrow period
   * @param {string} id - Borrow ID
   * @returns {Promise} Promise object with updated borrow
   */
  extendBorrow: async (id) => {
    const response = await apiClient.put(`/borrows/${id}/extend`);
    return response.data;
  },

  /**
   * Get all borrows (admin/librarian only)
   * @param {Object} params - Query parameters
   * @param {string} params.status - Filter by status
   * @param {string} params.userId - Filter by user ID
   * @param {string} params.bookId - Filter by book ID
   * @param {string} params.startDate - Filter by start date
   * @param {string} params.endDate - Filter by end date
   * @param {boolean} params.overdue - Filter overdue borrows
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise} Promise object with borrows data
   */
  getAllBorrows: async (params = {}) => {
    const response = await apiClient.get('/borrows/all', { params });
    return response.data;
  },

  /**
   * Update borrow record (admin/librarian only)
   * @param {string} id - Borrow ID
   * @param {Object} data - Borrow data to update
   * @returns {Promise} Promise object with updated borrow
   */
  updateBorrow: async (id, data) => {
    const response = await apiClient.put(`/borrows/${id}`, data);
    return response.data;
  },

  /**
   * Get borrow statistics (admin/librarian only)
   * @returns {Promise} Promise object with borrow statistics
   */
  getBorrowStats: async () => {
    const response = await apiClient.get('/borrows/stats');
    return response.data;
  }
};

export default borrowService;