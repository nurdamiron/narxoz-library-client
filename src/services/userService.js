// src/services/userService.js
import apiClient from './api';

const userService = {
  /**
   * Get current logged in user
   * @returns {Promise} Promise object with user data
   */
  getMe: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  /**
   * Update user details
   * @param {Object} userData - User data to update
   * @returns {Promise} Promise object with updated user data
   */
  updateMe: async (userData) => {
    const response = await apiClient.put('/users/me', userData);
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  /**
   * Upload user avatar
   * @param {File} file - Avatar image file
   * @returns {Promise} Promise object with updated user data
   */
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.put('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    
    return response.data;
  },

  /**
   * Get user statistics
   * @returns {Promise} Promise object with user statistics
   */
  getMyStats: async () => {
    const response = await apiClient.get('/users/me/stats');
    return response.data;
  },

  /**
   * Change password
   * @param {Object} passwordData - Password data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @returns {Promise} Promise object
   */
  changePassword: async (passwordData) => {
    const response = await apiClient.put('/users/me/password', passwordData);
    return response.data;
  },

  /**
   * Get all users (admin only)
   * @returns {Promise} Promise object with users data
   */
  getUsers: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },

  /**
   * Get single user (admin only)
   * @param {string} id - User ID
   * @returns {Promise} Promise object with user data
   */
  getUser: async (id) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  }
};

export default userService;