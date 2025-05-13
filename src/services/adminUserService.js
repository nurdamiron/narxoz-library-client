/**
 * Админ пайдаланушы сервисі
 * 
 * @description Пайдаланушыларды басқару қызметін қамтамасыз ететін сервис.
 * Админдер пайдаланушыларды қарау, жасау, өңдеу және жою мүмкіндіктерін қолдайды.
 */

import apiClient from './api';
import { translateError } from '../utils/errorMessages';

const adminUserService = {
  /**
   * Барлық пайдаланушыларды алу
   * 
   * @param {Object} params - Сұраныс параметрлері (іздеу, беттеу, сүзу)
   * @returns {Promise} Пайдаланушылар тізімі бар уәде
   */
  getUsers: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/users?${queryString}`);
      console.log('Users data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Жеке пайдаланушыны алу
   * 
   * @param {string} id - Пайдаланушы ID
   * @returns {Promise} Пайдаланушы мәліметтері
   */
  getUser: async (id) => {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Жаңа пайдаланушы жасау
   * 
   * @param {Object} userData - Пайдаланушы мәліметтері
   * @returns {Promise} Жасалған пайдаланушы мәліметтері
   */
  createUser: async (userData) => {
    try {
      console.log('📝 ADMIN API: Отправка запроса на создание пользователя', userData);
      
      // Используем новый endpoint для регистрации пользователей
      const response = await apiClient.post('/auth/register', userData);
      
      console.log('✅ ADMIN API: Пользователь успешно создан', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ ADMIN API: Ошибка создания пользователя', error);
      
      // Детальное логирование ответа
      if (error.response) {
        console.error('ADMIN API Статус ошибки:', error.response.status);
        console.error('ADMIN API Заголовки:', error.response.headers);
        console.error('ADMIN API Данные ответа:', error.response.data);
        
        // Специфические ошибки по коду
        if (error.response.status === 400 || error.response.status === 409) {
          // Проверяем данные ответа
          const { data } = error.response;
          
          // Проверка на ответ в виде строки
          if (typeof data === 'string') {
            throw { 
              success: false, 
              message: translateError(data)
            };
          }
          
          // Проверка на наличие error или message в ответе
          if (data && (data.error || data.message)) {
            const errorMessage = data.error || data.message;
            
            // Обработка ошибки с email
            if (errorMessage.includes('email') || errorMessage.includes('Email')) {
              console.error('🔍 ADMIN API: Ошибка - Email уже существует');
              throw { 
                success: false, 
                message: translateError(errorMessage),
                field: 'email' 
              };
            }
            
            // Обработка ошибки с логином
            if (errorMessage.includes('логин') || errorMessage.includes('username')) {
              console.error('🔍 ADMIN API: Ошибка - Логин уже существует');
              throw { 
                success: false, 
                message: translateError(errorMessage),
                field: 'username' 
              };
            }
            
            // Общая ошибка с переводом
            throw { 
              success: false, 
              message: translateError(errorMessage)
            };
          }
          
          // Проверка на errors массив
          if (data && data.errors && Array.isArray(data.errors)) {
            const errorMessages = data.errors.map(err => 
              translateError(err.msg || err.message || err)
            ).join('. ');
            
            throw { 
              success: false, 
              message: errorMessages,
              errors: data.errors
            };
          }
        }
        
        // Для ошибок с другими статусами
        throw { 
          success: false, 
          message: translateError(error),
          status: error.response.status
        };
      }
      
      // Для сетевых ошибок и других случаев
      throw { 
        success: false, 
        message: translateError(error)
      };
    }
  },

  /**
   * Пайдаланушыны жаңарту
   * 
   * @param {string} id - Пайдаланушы ID
   * @param {Object} userData - Жаңартылатын мәліметтер
   * @returns {Promise} Жаңартылған пайдаланушы мәліметтері
   */
  updateUser: async (id, userData) => {
    try {
      console.log('📝 ADMIN API: Отправка запроса на обновление пользователя', id, userData);
      const response = await apiClient.put(`/users/${id}`, userData);
      console.log('✅ ADMIN API: Пользователь успешно обновлен', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ ADMIN API: Ошибка обновления пользователя', error);
      
      // Детальное логирование ответа
      if (error.response) {
        console.error('ADMIN API Статус ошибки:', error.response.status);
        console.error('ADMIN API Заголовки:', error.response.headers);
        console.error('ADMIN API Данные ответа:', error.response.data);
        
        const { data, status } = error.response;
        
        // Специфическая обработка для Sequelize ошибок
        if (data && data.name === 'SequelizeUniqueConstraintError' && data.errors && data.errors.length > 0) {
          const fieldError = data.errors[0];
          console.error('🔍 ADMIN API: Ошибка уникального ограничения Sequelize', fieldError);
          
          if (fieldError.path === 'email') {
            throw { 
              success: false, 
              message: 'Бұл email бұрыннан тіркелген. Басқа email пайдаланыңыз.',
              field: 'email',
              originalError: data
            };
          } else if (fieldError.path === 'username') {
            throw { 
              success: false, 
              message: 'Бұл логин бұрыннан тіркелген. Басқа логин таңдаңыз.',
              field: 'username', 
              originalError: data
            };
          } else {
            throw { 
              success: false, 
              message: `${fieldError.path} өрісі бірегей болуы керек.`,
              field: fieldError.path,
              originalError: data
            };
          }
        }
        
        // Специфические ошибки по коду
        if (status === 400 || status === 409) {
          // Проверка на ответ в виде строки
          if (typeof data === 'string') {
            throw { 
              success: false, 
              message: translateError(data)
            };
          }
          
          // Проверка на наличие error или message в ответе
          if (data && (data.error || data.message)) {
            const errorMessage = data.error || data.message;
            
            // Обработка ошибки с email
            if (errorMessage.includes('email') || errorMessage.includes('Email')) {
              console.error('🔍 ADMIN API: Ошибка - Email уже существует');
              throw { 
                success: false, 
                message: translateError(errorMessage),
                field: 'email' 
              };
            }
            
            // Обработка ошибки с логином
            if (errorMessage.includes('логин') || errorMessage.includes('username')) {
              console.error('🔍 ADMIN API: Ошибка - Логин уже существует');
              throw { 
                success: false, 
                message: translateError(errorMessage),
                field: 'username' 
              };
            }
            
            // Общая ошибка с переводом
            throw { 
              success: false, 
              message: translateError(errorMessage)
            };
          }
          
          // Проверка на errors массив
          if (data && data.errors && Array.isArray(data.errors)) {
            const errorMessages = data.errors.map(err => 
              translateError(err.msg || err.message || err)
            ).join('. ');
            
            throw { 
              success: false, 
              message: errorMessages,
              errors: data.errors
            };
          }
        }
        
        // Для ошибок с другими статусами
        throw { 
          success: false, 
          message: translateError(error) || 'Пайдаланушыны жаңарту кезінде қате орын алды',
          status: error.response.status
        };
      }
      
      // Для сетевых ошибок и других случаев
      throw { 
        success: false, 
        message: translateError(error) || 'Серверге қосылу мүмкін болмады. Интернет байланысын тексеріңіз.'
      };
    }
  },

  /**
   * Пайдаланушыны жою
   * 
   * @param {string} id - Пайдаланушы ID
   * @returns {Promise} Жою нәтижесі
   */
  deleteUser: async (id) => {
    try {
      console.log('📝 ADMIN API: Отправка запроса на удаление пользователя', id);
      const response = await apiClient.delete(`/users/${id}`);
      console.log('✅ ADMIN API: Пользователь успешно удален', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ ADMIN API: Ошибка удаления пользователя', error);
      
      // Детальное логирование ответа
      if (error.response) {
        console.error('ADMIN API Статус ошибки:', error.response.status);
        console.error('ADMIN API Заголовки:', error.response.headers);
        console.error('ADMIN API Данные ответа:', error.response.data);
        
        // Проверяем данные ответа
        const { data, status } = error.response;
        
        // Обработка специфических ошибок по статусу
        if (status === 403) {
          throw { 
            success: false, 
            message: 'Бұл пайдаланушыны жоюға рұқсатыңыз жоқ'
          };
        }
        
        if (status === 404) {
          throw { 
            success: false, 
            message: 'Пайдаланушы табылмады'
          };
        }
        
        // Если есть данные ошибки
        if (data) {
          if (typeof data === 'string') {
            throw { 
              success: false, 
              message: translateError(data)
            };
          }
          
          if (data.error || data.message) {
            throw { 
              success: false, 
              message: translateError(data.error || data.message)
            };
          }
        }
        
        // Для других ошибок
        throw { 
          success: false, 
          message: 'Пайдаланушыны жою кезінде қате орын алды', 
          status 
        };
      }
      
      // Для сетевых ошибок
      throw { 
        success: false, 
        message: 'Серверге қосылу мүмкін болмады. Интернет байланысын тексеріңіз.'
      };
    }
  },

  /**
   * Әкімші немесе студент тіркеу (тек әкімші үшін)
   * 
   * @param {Object} userData - Жаңа пайдаланушы мәліметтері
   * @returns {Promise} Жасалған пайдаланушы мәліметтері
   */
  registerUser: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Пайдаланушы статистикасын алу
   * 
   * @returns {Promise} Пайдаланушылар бойынша статистика
   */
  getUserStats: async () => {
    try {
      const response = await apiClient.get('/users/stats');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Құпия сөзді әкімші арқылы өзгерту
   * 
   * @param {string} id - Пайдаланушы ID
   * @param {string} newPassword - Жаңа құпия сөз
   * @returns {Promise} Өзгерту нәтижесі
   */
  resetPassword: async (id, newPassword) => {
    try {
      const response = await apiClient.put(`/users/${id}/reset-password`, { newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default adminUserService;