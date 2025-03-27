// src/services/notificationService.js
import BaseService from './baseService';

const notificationService = {
  /**
   * Получить все уведомления для текущего пользователя
   * @returns {Promise} Promise с данными уведомлений
   */
  getNotifications: async () => {
    return BaseService.get('/notifications');
  },

  /**
   * Получить отдельное уведомление
   * @param {string} id - ID уведомления
   * @returns {Promise} Promise с данными уведомления
   */
  getNotification: async (id) => {
    return BaseService.get(`/notifications/${id}`);
  },

  /**
   * Отметить уведомление как прочитанное
   * @param {string} id - ID уведомления
   * @returns {Promise} Promise с обновленным уведомлением
   */
  markAsRead: async (id) => {
    return BaseService.put(`/notifications/${id}/read`);
  },

  /**
   * Удалить уведомление
   * @param {string} id - ID уведомления
   * @returns {Promise} Promise
   */
  deleteNotification: async (id) => {
    return BaseService.delete(`/notifications/${id}`);
  },

  /**
   * Отметить все уведомления как прочитанные
   * @returns {Promise} Promise
   */
  markAllAsRead: async () => {
    return BaseService.put('/notifications/read-all');
  }
};

export default notificationService;