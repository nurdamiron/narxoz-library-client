// src/services/borrowService.js
import BaseService from './baseService';

const borrowService = {
  /**
   * Получить историю займов текущего пользователя
   * @param {Object} params - Параметры запроса
   * @param {string} params.status - Фильтр по статусу ('active', 'returned', 'overdue')
   * @param {number} params.page - Номер страницы
   * @param {number} params.limit - Элементов на странице
   * @returns {Promise} Promise с данными займов
   */
  getUserBorrows: async (params = {}) => {
    return BaseService.get('/borrows', params);
  },

  /**
   * Взять книгу
   * @param {Object} data - Данные займа
   * @param {string} data.bookId - ID книги для займа
   * @returns {Promise} Promise с созданным займом
   */
  borrowBook: async (data) => {
    return BaseService.post('/borrows', data);
  },

  /**
   * Получить отдельную запись о займе
   * @param {string} id - ID займа
   * @returns {Promise} Promise с данными займа
   */
  getBorrow: async (id) => {
    return BaseService.get(`/borrows/${id}`);
  },

  /**
   * Вернуть взятую книгу
   * @param {string} id - ID займа
   * @returns {Promise} Promise с обновленным займом
   */
  returnBook: async (id) => {
    return BaseService.put(`/borrows/${id}/return`);
  },

  /**
   * Продлить срок займа
   * @param {string} id - ID займа
   * @returns {Promise} Promise с обновленным займом
   */
  extendBorrow: async (id) => {
    return BaseService.put(`/borrows/${id}/extend`);
  },

  /**
   * Получить все займы (только для администраторов/библиотекарей)
   * @param {Object} params - Параметры запроса
   * @returns {Promise} Promise с данными займов
   */
  getAllBorrows: async (params = {}) => {
    return BaseService.get('/borrows/all', params);
  },

  /**
   * Обновить запись о займе (только для администраторов/библиотекарей)
   * @param {string} id - ID займа
   * @param {Object} data - Данные для обновления
   * @returns {Promise} Promise с обновленным займом
   */
  updateBorrow: async (id, data) => {
    return BaseService.put(`/borrows/${id}`, data);
  },

  /**
   * Получить статистику по займам (только для администраторов/библиотекарей)
   * @returns {Promise} Promise со статистикой займов
   */
  getBorrowStats: async () => {
    return BaseService.get('/borrows/stats');
  }
};

export default borrowService;