/**
 * Пікірлер сервисі
 * 
 * @description Кітаптарға қалдырылған пікірлерді басқару үшін API сұраныстарын өңдейді.
 * Пікірлерді қарау, жасау, өңдеу, жою және шағым білдіру мүмкіндіктерін қамтиды.
 */
import apiClient from './api';

const reviewService = {
  /**
   * Кітаптың барлық пікірлерін алу
   * 
   * @param {string} bookId - Кітап идентификаторы
   * @param {object} params - Сұраныс параметрлері (пагинация, сұрыптау және т.б.)
   * @returns {Promise} - Пікірлер тізімі
   */
  getBookReviews: async (bookId, params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/books/${bookId}/reviews?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Барлық пікірлерді алу (тек әкімшілер үшін)
   * 
   * @param {object} params - Сұраныс параметрлері (пагинация, фильтрация)
   * @returns {Promise} - Барлық пікірлер тізімі
   */
  getAllReviews: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/reviews?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Нақты пікірді алу
   * 
   * @param {string} reviewId - Пікір идентификаторы
   * @returns {Promise} - Пікір мәліметтері
   */
  getReview: async (reviewId) => {
    try {
      const response = await apiClient.get(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Жаңа пікір қосу
   * 
   * @param {object} reviewData - Пікір мәліметтері
   * @param {string} reviewData.bookId - Кітап идентификаторы
   * @param {number} reviewData.rating - Рейтинг (1-5)
   * @param {string} reviewData.text - Пікір мәтіні
   * @returns {Promise} - Жасалған пікір мәліметтері
   */
  createReview: async (reviewData) => {
    try {
      const response = await apiClient.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Пікірді өңдеу
   * 
   * @param {string} reviewId - Пікір идентификаторы
   * @param {object} reviewData - Жаңартылатын пікір мәліметтері
   * @returns {Promise} - Жаңартылған пікір мәліметтері
   */
  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await apiClient.put(`/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Пікірді жою
   * 
   * @param {string} reviewId - Пікір идентификаторы
   * @returns {Promise} - Жою нәтижесі
   */
  deleteReview: async (reviewId) => {
    try {
      const response = await apiClient.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Пікірді бекіту/қабылдамау (тек әкімшілер үшін)
   * 
   * @param {string} reviewId - Пікір идентификаторы
   * @param {boolean} isApproved - Бекіту мәртебесі
   * @returns {Promise} - Жаңартылған пікір мәліметтері
   */
  approveReview: async (reviewId, isApproved) => {
    try {
      const response = await apiClient.put(`/reviews/${reviewId}/approve`, { isApproved });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Пікірге шағым білдіру
   * 
   * @param {string} reviewId - Пікір идентификаторы
   * @param {string} reason - Шағым себебі
   * @returns {Promise} - Операция нәтижесі
   */
  reportReview: async (reviewId, reason) => {
    try {
      const response = await apiClient.post(`/reviews/${reviewId}/report`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Пайдаланушының барлық пікірлерін алу
   * 
   * @returns {Promise} - Пайдаланушы пікірлерінің тізімі
   */
  getMyReviews: async () => {
    try {
      const response = await apiClient.get('/reviews/my');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default reviewService;