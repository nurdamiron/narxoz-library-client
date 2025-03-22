// src/services/notificationService.js
import apiClient from './api';

const notificationService = {
  /**
   * Get all notifications for the current user
   * @returns {Promise} Promise object with notifications data
   */
  getNotifications: async () => {
    const response = await apiClient.get('/notifications');
    return response.data;
  },

  /**
   * Get a single notification
   * @param {string} id - Notification ID
   * @returns {Promise} Promise object with notification data
   */
  getNotification: async (id) => {
    const response = await apiClient.get(`/notifications/${id}`);
    return response.data;
  },

  /**
   * Mark notification as read
   * @param {string} id - Notification ID
   * @returns {Promise} Promise object with updated notification
   */
  markAsRead: async (id) => {
    const response = await apiClient.put(`/notifications/${id}/read`);
    return response.data;
  },

  /**
   * Delete notification
   * @param {string} id - Notification ID
   * @returns {Promise} Promise object
   */
  deleteNotification: async (id) => {
    const response = await apiClient.delete(`/notifications/${id}`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   * @returns {Promise} Promise object
   */
  markAllAsRead: async () => {
    const response = await apiClient.put('/notifications/read-all');
    return response.data;
  }
};

export default notificationService;