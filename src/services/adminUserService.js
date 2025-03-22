// src/services/adminUserService.js
import apiClient from './api';

const adminUserService = {
  /**
   * Get all users
   * @returns {Promise} Promise object with users data
   */
  getUsers: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },

  /**
   * Get single user
   * @param {string} id - User ID
   * @returns {Promise} Promise object with user data
   */
  getUser: async (id) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  /**
   * Create user
   * @param {Object} userData - User data
   * @returns {Promise} Promise object with created user
   */
  createUser: async (userData) => {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },

  /**
   * Update user
   * @param {string} id - User ID
   * @param {Object} userData - User data to update
   * @returns {Promise} Promise object with updated user
   */
  updateUser: async (id, userData) => {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },

  /**
   * Delete user
   * @param {string} id - User ID
   * @returns {Promise} Promise object
   */
  deleteUser: async (id) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },

  /**
   * Register an admin or librarian (admin only)
   * @param {Object} userData - User data with role
   * @returns {Promise} Promise object with created admin/librarian
   */
  registerAdmin: async (userData) => {
    const response = await apiClient.post('/auth/register-admin', userData);
    return response.data;
  }
};

export default adminUserService;