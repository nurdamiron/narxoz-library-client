// src/services/baseService.js
import apiClient from './api';

/**
 * Базовый сервис с общими методами для работы с API
 * Используется для наследования в других сервисах
 */
class BaseService {
  /**
   * Получить заголовки аутентификации на основе текущих учетных данных
   * @returns {Object} Заголовки аутентификации
   */
  static getAuthHeaders() {
    const email = sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail');
    const password = sessionStorage.getItem('userPassword') || localStorage.getItem('userPassword');
    
    if (email && password) {
      return {
        'Authorization': 'Basic ' + btoa(`${email}:${password}`)
      };
    }
    
    return {};
  }
  
  /**
   * Выполнить GET запрос
   * @param {string} url - URL запроса
   * @param {Object} params - Параметры запроса
   * @returns {Promise} - Promise с результатом запроса
   */
  static async get(url, params = {}) {
    try {
      const response = await apiClient.get(url, {
        params,
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error(`GET error for ${url}:`, error);
      throw error;
    }
  }
  
  /**
   * Выполнить POST запрос
   * @param {string} url - URL запроса
   * @param {Object} data - Данные для отправки
   * @returns {Promise} - Promise с результатом запроса
   */
  static async post(url, data = {}) {
    try {
      console.log('🔴 BaseService.post called:', { url, data });
      console.log('🔴 Data keys:', Object.keys(data));
      console.log('🔴 Auth headers:', this.getAuthHeaders());
      
      const response = await apiClient.post(url, data, {
        headers: this.getAuthHeaders()
      });
      
      console.log('🔴 BaseService.post response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`POST error for ${url}:`, error);
      console.error('🔴 Error response:', error.response?.data);
      console.error('🔴 Error status:', error.response?.status);
      throw error;
    }
  }
  
  /**
   * Выполнить PUT запрос
   * @param {string} url - URL запроса
   * @param {Object} data - Данные для отправки
   * @returns {Promise} - Promise с результатом запроса
   */
  static async put(url, data = {}) {
    try {
      const response = await apiClient.put(url, data, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error(`PUT error for ${url}:`, error);
      throw error;
    }
  }
  
  /**
   * Выполнить DELETE запрос
   * @param {string} url - URL запроса
   * @returns {Promise} - Promise с результатом запроса
   */
  static async delete(url) {
    try {
      const response = await apiClient.delete(url, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error(`DELETE error for ${url}:`, error);
      throw error;
    }
  }
}

export default BaseService;