// src/services/adminBookService.js
import apiClient from './api';
import { translateError } from '../utils/errorMessages';

/**
 * Әкімші үшін кітаптарды басқару қызметі
 */
const adminBookService = {
  /**
   * Барлық кітаптарды алу
   * @param {Object} params - Сұраныс параметрлері (беттеу, сүзу)
   * @returns {Promise} API жауабы
   */
  getBooks: async (params = {}) => {
    try {
      console.log('📚 Кітаптарды жүктеу параметрлері:', params);
      const response = await apiClient.get('/books', { params });
      console.log('✅ Кітаптар сәтті жүктелді:', response.data.data ? `${response.data.data.length} кітап` : response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Кітаптарды жүктеу қатесі:', error);
      
      if (error.response) {
        const { status, data } = error.response;
        console.error(`Сервер қатесі: HTTP ${status}`, data);
      }
      
      throw { 
        success: false, 
        message: translateError(error) || 'Кітаптарды жүктеу қатесі' 
      };
    }
  },

  /**
   * Барлық санаттарды алу
   * @returns {Promise} API жауабы
   */
  getCategories: async () => {
    try {
      console.log('📚 Категорияларды жүктеу');
      const response = await apiClient.get('/books/categories');
      console.log('✅ Категориялар сәтті жүктелді:', response.data.data ? `${response.data.data.length} категория` : response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Категорияларды жүктеу қатесі:', error);
      
      if (error.response) {
        const { status, data } = error.response;
        console.error(`Сервер қатесі: HTTP ${status}`, data);
      }
      
      throw { 
        success: false, 
        message: translateError(error) || 'Категорияларды жүктеу қатесі' 
      };
    }
  },

  /**
   * Жаңа кітап жасау
   * @param {Object} bookData - Кітап мәліметтері
   * @returns {Promise} API жауабы
   */
  createBook: async (bookData) => {
    try {
      console.log('📚 Жаңа кітап жасау деректері:', bookData);
      
      // Более детальная проверка и логирование всех полей
      const requiredFields = [
        { field: 'title', label: 'Кітаптың атауы' },
        { field: 'author', label: 'Автор' },
        { field: 'categoryId', label: 'Категория' },
        { field: 'description', label: 'Сипаттама' },
        { field: 'publishYear', label: 'Басылым жылы' },
        { field: 'language', label: 'Тіл' }
      ];
      
      const missingFields = requiredFields.filter(({ field }) => 
        !bookData[field] || bookData[field] === ''
      );
      
      if (missingFields.length > 0) {
        console.error('❌ Жоқ міндетті өрістер:', missingFields.map(f => f.label).join(', '));
        throw { 
          success: false, 
          message: 'Барлық міндетті өрістерді толтырыңыз',
          validationErrors: missingFields.map(f => ({ field: f.field, message: `${f.label} міндетті өріс` }))
        };
      }
      
      // Проверка числовых полей
      if (bookData.publishYear && isNaN(parseInt(bookData.publishYear))) {
        console.error('❌ Жарамсыз жыл форматы:', bookData.publishYear);
        throw { 
          success: false,
          message: 'Басылым жылы сан болуы керек',
          validationErrors: [{ field: 'publishYear', message: 'Басылым жылы сан болуы керек' }]
        };
      }
      
      if (isNaN(parseInt(bookData.totalCopies)) || parseInt(bookData.totalCopies) < 0) {
        console.error('❌ Жарамсыз жалпы даналар саны:', bookData.totalCopies);
        throw {
          success: false,
          message: 'Даналар саны оң сан болуы керек',
          validationErrors: [{ field: 'totalCopies', message: 'Даналар саны оң сан болуы керек' }]
        };
      }
      
      if (bookData.availableCopies && (isNaN(parseInt(bookData.availableCopies)) || parseInt(bookData.availableCopies) < 0)) {
        console.error('❌ Жарамсыз қолжетімді даналар саны:', bookData.availableCopies);
        throw {
          success: false,
          message: 'Қолжетімді даналар саны оң сан болуы керек',
          validationErrors: [{ field: 'availableCopies', message: 'Қолжетімді даналар саны оң сан болуы керек' }]
        };
      }
      
      // Очистка и преобразование строковых чисел в числа
      const cleanedData = { ...bookData };
      
      // Проверка диапазона годов (1000 и менее текущего года)
      if (cleanedData.publishYear) {
        // Проверяем, не содержит ли строка нечисловых символов, кроме пробелов
        const yearString = String(cleanedData.publishYear).trim();
        if (/^\d+$/.test(yearString)) {
          const yearValue = parseInt(yearString, 10);
          
          // Проверка диапазона допустимых годов
          const currentYear = new Date().getFullYear();
          if (yearValue < 1000 || yearValue > currentYear) {
            console.error(`❌ Жыл рұқсат етілген диапазоннан тыс: ${yearValue}`);
            throw { 
              success: false,
              message: `Жарамды жыл енгізіңіз (1000-${currentYear} аралығында)`,
              validationErrors: [{ field: 'publishYear', message: `Жыл 1000-${currentYear} аралығында болуы керек` }]
            };
          }
          
          // Сохраняем как publicationYear для соответствия с серверной моделью
          cleanedData.publicationYear = yearValue;
          console.log(`✅ Жыл сәтті түрлендірілді: ${yearString} → ${yearValue}`);
          
          // Удаляем старое поле publishYear, чтобы избежать конфликтов
          delete cleanedData.publishYear;
        } else {
          console.error(`❌ Жарамсыз жыл форматы, сан емес таңбалар табылды: "${yearString}"`);
          throw { 
            success: false,
            message: 'Жарамды жыл енгізіңіз. Тек сандарды пайдаланыңыз.',
            validationErrors: [{ field: 'publishYear', message: 'Жылда тек сандар болуы керек' }]
          };
        }
      }
      
      if (cleanedData.totalCopies) {
        cleanedData.totalCopies = parseInt(cleanedData.totalCopies, 10);
      }
      
      if (cleanedData.availableCopies) {
        cleanedData.availableCopies = parseInt(cleanedData.availableCopies, 10);
      }
      
      // Логирование итоговых данных для отправки
      console.log('📤 Серверге жіберілетін деректер:', JSON.stringify(cleanedData, null, 2));
      
      const response = await apiClient.post('/books', cleanedData);
      console.log('✅ Кітап сәтті құрылды:', response.data);
      
      // Проверяем структуру ответа и корректно возвращаем данные
      const book = response.data.data || response.data;
      return { 
        success: true, 
        data: {
          // Убедимся, что id книги всегда доступен для последующей загрузки обложки
          id: book.id || response.data.id,
          ...book
        } 
      };
    } catch (error) {
      console.error('❌ Кітап жасау қатесі:', error);
      
      // Если ошибка уже структурирована в нашем формате
      if (error.success === false) {
        return error;
      }
      
      if (error.response) {
        const { status, data } = error.response;
        console.error(`❌ Сервер қатесі: HTTP ${status}`, data);
        
        // Детальное логирование ошибок валидации с сервера
        if (status === 400 && data && data.errors) {
          console.error('❌ Валидация қателері:', data.errors);
          
          const validationErrors = Array.isArray(data.errors) 
            ? data.errors
            : [{ message: 'Кітап мәліметтері жарамсыз' }];
          
          // Структурированный вывод ошибок валидации
          console.error('❌ Түзетулер қажет өрістер:');
          validationErrors.forEach(err => {
            console.error(`   - ${err.field || 'Жалпы қате'}: ${err.msg || err.message}`);
          });
          
          return { 
            success: false, 
            message: validationErrors.map(err => err.msg || err.message).join('. '),
            validationErrors: data.errors
          };
        }
        
        // Другие статусы ошибок
        if (status === 401) {
          return { 
            success: false, 
            message: 'Авторизация қатесі. Қайта кіріңіз.' 
          };
        }
        
        if (status === 403) {
          return { 
            success: false, 
            message: 'Кітап жасауға рұқсатыңыз жоқ' 
          };
        }
      }
      
      return { 
        success: false, 
        message: translateError(error) || 'Кітапты жасау кезінде қате орын алды. Қайталап көріңіз.' 
      };
    }
  },

  /**
   * Кітапты жаңарту
   * @param {string} id - Кітап идентификаторы
   * @param {Object} bookData - Жаңартылған кітап мәліметтері
   * @returns {Promise} API жауабы
   */
  updateBook: async (id, bookData) => {
    try {
      console.log(`📚 ID: ${id} кітапты жаңарту:`, bookData);
      
      // Более детальная проверка и логирование всех полей
      const requiredFields = [
        { field: 'title', label: 'Кітаптың атауы' },
        { field: 'author', label: 'Автор' },
        { field: 'categoryId', label: 'Категория' },
        { field: 'description', label: 'Сипаттама' },
        { field: 'publishYear', label: 'Басылым жылы' },
        { field: 'language', label: 'Тіл' }
      ];
      
      const missingFields = requiredFields.filter(({ field }) => 
        !bookData[field] || bookData[field] === ''
      );
      
      if (missingFields.length > 0) {
        console.error('❌ Жоқ міндетті өрістер:', missingFields.map(f => f.label).join(', '));
        throw { 
          success: false, 
          message: 'Барлық міндетті өрістерді толтырыңыз',
          validationErrors: missingFields.map(f => ({ field: f.field, message: `${f.label} міндетті өріс` }))
        };
      }
      
      // Проверка числовых полей
      if (bookData.publishYear && isNaN(parseInt(bookData.publishYear))) {
        console.error('❌ Жарамсыз жыл форматы:', bookData.publishYear);
        throw { 
          success: false,
          message: 'Басылым жылы сан болуы керек',
          validationErrors: [{ field: 'publishYear', message: 'Басылым жылы сан болуы керек' }]
        };
      }
      
      if (bookData.totalCopies && (isNaN(parseInt(bookData.totalCopies)) || parseInt(bookData.totalCopies) < 0)) {
        console.error('❌ Жарамсыз жалпы даналар саны:', bookData.totalCopies);
        throw {
          success: false,
          message: 'Даналар саны оң сан болуы керек',
          validationErrors: [{ field: 'totalCopies', message: 'Даналар саны оң сан болуы керек' }]
        };
      }
      
      if (bookData.availableCopies && (isNaN(parseInt(bookData.availableCopies)) || parseInt(bookData.availableCopies) < 0)) {
        console.error('❌ Жарамсыз қолжетімді даналар саны:', bookData.availableCopies);
        throw {
          success: false,
          message: 'Қолжетімді даналар саны оң сан болуы керек',
          validationErrors: [{ field: 'availableCopies', message: 'Қолжетімді даналар саны оң сан болуы керек' }]
        };
      }
      
      // Очистка и преобразование строковых чисел в числа
      const cleanedData = { ...bookData };
      
      // Проверка диапазона годов (1000 и менее текущего года)
      if (cleanedData.publishYear) {
        // Проверяем, не содержит ли строка нечисловых символов, кроме пробелов
        const yearString = String(cleanedData.publishYear).trim();
        if (/^\d+$/.test(yearString)) {
          const yearValue = parseInt(yearString, 10);
          
          // Проверка диапазона допустимых годов
          const currentYear = new Date().getFullYear();
          if (yearValue < 1000 || yearValue > currentYear) {
            console.error(`❌ Жыл рұқсат етілген диапазоннан тыс: ${yearValue}`);
            throw { 
              success: false,
              message: `Жарамды жыл енгізіңіз (1000-${currentYear} аралығында)`,
              validationErrors: [{ field: 'publishYear', message: `Жыл 1000-${currentYear} аралығында болуы керек` }]
            };
          }
          
          // Сохраняем как publicationYear для соответствия с серверной моделью
          cleanedData.publicationYear = yearValue;
          console.log(`✅ Жыл сәтті түрлендірілді: ${yearString} → ${yearValue}`);
          
          // Удаляем старое поле publishYear, чтобы избежать конфликтов
          delete cleanedData.publishYear;
        } else {
          console.error(`❌ Жарамсыз жыл форматы, сан емес таңбалар табылды: "${yearString}"`);
          throw { 
            success: false,
            message: 'Жарамды жыл енгізіңіз. Тек сандарды пайдаланыңыз.',
            validationErrors: [{ field: 'publishYear', message: 'Жылда тек сандар болуы керек' }]
          };
        }
      }
      
      if (cleanedData.totalCopies) {
        cleanedData.totalCopies = parseInt(cleanedData.totalCopies, 10);
      }
      
      if (cleanedData.availableCopies) {
        cleanedData.availableCopies = parseInt(cleanedData.availableCopies, 10);
      }
      
      // Логирование итоговых данных для отправки
      console.log('📤 Серверге жіберілетін деректер:', JSON.stringify(cleanedData, null, 2));
      
      const response = await apiClient.put(`/books/${id}`, cleanedData);
      console.log('✅ Кітап сәтті жаңартылды:', response.data);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error(`❌ Кітап жаңарту қатесі (ID: ${id}):`, error);
      
      // Если ошибка уже структурирована в нашем формате
      if (error.success === false) {
        return error;
      }
      
      if (error.response) {
        const { status, data } = error.response;
        console.error(`❌ Кітап жаңарту қатесі: HTTP ${status}`, data);
        
        // 404 өңдеу - кітап табылмады
        if (status === 404) {
          return { 
            success: false, 
            message: 'Кітап табылмады. Беттегі мәліметтер ескірген болуы мүмкін.' 
          };
        }
        
        // Валидация қателерін өңдеу
        if (status === 400 && data && data.errors) {
          console.error('❌ Валидация қателері:', data.errors);
          
          const validationErrors = Array.isArray(data.errors) 
            ? data.errors
            : [{ message: 'Кітап мәліметтері жарамсыз' }];
          
          // Структурированный вывод ошибок валидации
          console.error('❌ Түзетулер қажет өрістер:');
          validationErrors.forEach(err => {
            console.error(`   - ${err.field || 'Жалпы қате'}: ${err.msg || err.message}`);
          });
          
          return { 
            success: false, 
            message: validationErrors.map(err => err.msg || err.message).join('. '),
            validationErrors: data.errors
          };
        }
        
        // Другие статусы ошибок
        if (status === 401) {
          return { 
            success: false, 
            message: 'Авторизация қатесі. Қайта кіріңіз.' 
          };
        }
        
        if (status === 403) {
          return { 
            success: false, 
            message: 'Кітапты жаңартуға рұқсатыңыз жоқ' 
          };
        }
      }
      
      return { 
        success: false, 
        message: translateError(error) || 'Кітапты жаңарту кезінде қате орын алды. Қайталап көріңіз.' 
      };
    }
  },

  /**
   * Кітапты жою
   * @param {string} id - Кітап идентификаторы
   * @returns {Promise} API жауабы
   */
  deleteBook: async (id) => {
    try {
      console.log(`📚 ID: ${id} кітапты жою`);
      const response = await apiClient.delete(`/books/${id}`);
      console.log('✅ Кітап сәтті жойылды:', response.data);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error(`❌ Кітап жою қатесі (ID: ${id}):`, error);
      
      if (error.response) {
        const { status, data } = error.response;
        console.error(`❌ Кітап жою қатесі: HTTP ${status}`, data);
        
        // 404 өңдеу - кітап табылмады
        if (status === 404) {
          return { 
            success: false, 
            message: 'Кітап табылмады. Беттегі мәліметтер ескірген болуы мүмкін.' 
          };
        }
        
        // 403 өңдеу - рұқсатсыз
        if (status === 403) {
          return { 
            success: false, 
            message: 'Бұл кітапты жоюға рұқсатыңыз жоқ.' 
          };
        }
        
        // 409 өңдеу - қарыз алушылар бар
        if (status === 409) {
          return { 
            success: false, 
            message: 'Бұл кітап қазір қарызда. Кітапты жою алдында барлық қарыздар қайтарылуы керек.' 
          };
        }
        
        // 401 - авторизация қатесі
        if (status === 401) {
          return {
            success: false,
            message: 'Авторизация қатесі. Қайта кіріңіз.'
          };
        }
        
        // Для других ошибок сервера
        return {
          success: false, 
          message: data?.message || data?.error || 'Кітапты жою кезінде серверде қате орын алды',
          status: status
        };
      }
      
      return { 
        success: false, 
        message: translateError(error) || 'Кітапты жою кезінде қате орын алды. Қайталап көріңіз.' 
      };
    }
  },

  /**
   * Кітап мұқабасын жүктеу
   * @param {string} id - Кітап идентификаторы
   * @param {File} file - Мұқаба файлы
   * @returns {Promise} API жауабы
   */
  uploadBookCover: async (id, file) => {
    try {
      console.log(`📚 ID: ${id} кітап мұқабасын жүктеу. Файл: ${file.name}, өлшемі: ${file.size} байт, типі: ${file.type}`);
      console.log(`📂 Локальды сақтау режимі: Иә (әрқашан локальды сақталады)`);
      
      // Файл типін тексеру
      if (!file.type.startsWith('image/')) {
        console.error('❌ Файл типі жарамсыз:', file.type);
        return { 
          success: false, 
          message: 'Тек сурет файлдарын жүктеуге рұқсат етілген (JPEG, PNG, GIF)'
        };
      }
      
      // Проверка расширения файла
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        console.error('❌ Файл кеңейтімі жарамсыз:', fileExtension);
        return { 
          success: false, 
          message: `Жарамсыз файл кеңейтімі: ${fileExtension}. Тек ${allowedExtensions.join(', ')} форматтары рұқсат етілген`
        };
      }
      
      // Файл өлшемін тексеру - 5MB шектеу
      if (file.size > 5 * 1024 * 1024) {
        console.error('❌ Файл өлшемі тым үлкен:', (file.size / (1024 * 1024)).toFixed(2) + 'MB');
        return { 
          success: false, 
          message: `Сурет файлының өлшемі 5MB-дан аспауы керек. Сіздің файлыңыз: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
        };
      }
      
      // Формируем FormData для отправки файла
      const formData = new FormData();
      formData.append('file', file);
      
      // Всегда устанавливаем локальное хранение
      formData.append('storeLocally', 'true');
      
      // Детальное логирование запроса
      console.log('📤 Мұқаба жүктеу сұранысы жіберілуде...');
      
      const response = await apiClient.put(`/books/${id}/cover`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        // Для отслеживания прогресса загрузки
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`📤 Жүктеу үрдісі: ${percentCompleted}%`);
        }
      });
      
      console.log('✅ Мұқаба сәтті жүктелді:', response.data);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error(`❌ Мұқаба жүктеу қатесі (ID: ${id}):`, error);
      
      // Если ошибка уже структурирована в нашем формате
      if (error.success === false) {
        return error;
      }
      
      if (error.response) {
        const { status, data } = error.response;
        console.error(`❌ Мұқаба жүктеу қатесі: HTTP ${status}`, data);
        
        // 404 өңдеу - кітап табылмады
        if (status === 404) {
          return { 
            success: false, 
            message: 'Кітап табылмады. Беттегі мәліметтер ескірген болуы мүмкін.' 
          };
        }
        
        // 400 - файл типі немесе өлшемі жарамсыз
        if (status === 400) {
          return { 
            success: false, 
            message: data.error || data.message || 'Файл типі немесе өлшемі жарамсыз. JPG, PNG немесе GIF форматындағы 5MB-дан аспайтын сурет жүктеңіз.' 
          };
        }
        
        // 401 - авторизация қатесі
        if (status === 401) {
          return {
            success: false,
            message: 'Авторизация қатесі. Қайта кіріңіз.'
          };
        }
        
        // 403 - рұқсат жоқ
        if (status === 403) {
          return {
            success: false,
            message: 'Осы кітапқа мұқаба жүктеуге рұқсатыңыз жоқ.'
          };
        }
        
        // 500 - сервер қатесі
        if (status === 500) {
          return { 
            success: false, 
            message: 'Мұқаба жүктеу кезінде сервер қатесі орын алды. Кейінірек қайталап көріңіз.' 
          };
        }
        
        // Для других ошибок сервера
        return {
          success: false, 
          message: data?.message || data?.error || 'Мұқаба жүктеу кезінде серверде қате орын алды',
          status: status
        };
      }
      
      // Для сетевых ошибок (например, прерывание соединения)
      if (error.message && error.message.includes('Network Error')) {
        return {
          success: false,
          message: 'Желі қатесі. Интернет байланысын тексеріңіз және қайталап көріңіз.'
        };
      }
      
      return { 
        success: false, 
        message: translateError(error) || 'Мұқаба жүктеу кезінде қате орын алды. Қайталап көріңіз.' 
      };
    }
  },

  /**
   * Кітап қорын жаңарту
   * @param {string} id - Кітап идентификаторы
   * @param {Object} data - Қор мәліметтері
   * @returns {Promise} API жауабы
   */
  updateInventory: async (id, data) => {
    try {
      console.log(`📚 ID: ${id} кітап қорын жаңарту:`, data);
      const response = await apiClient.put(`/books/${id}/inventory`, data);
      console.log('✅ Қор сәтті жаңартылды:', response.data);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error(`❌ Қор жаңарту қатесі (ID: ${id}):`, error);
      
      if (error.response) {
        const { status, data } = error.response;
        console.error(`❌ Қор жаңарту қатесі: HTTP ${status}`, data);
        
        // Специфические ошибки по статусам
        if (status === 404) {
          return {
            success: false,
            message: 'Кітап табылмады'
          };
        }
        
        if (status === 400) {
          return {
            success: false,
            message: data?.message || 'Жарамсыз қор мәліметтері. Оң сандарды енгізіңіз.'
          };
        }
      }
      
      return { 
        success: false, 
        message: translateError(error) || 'Кітап қорын жаңарту кезінде қате орын алды. Қайталап көріңіз.' 
      };
    }
  },

  /**
   * Жаңа санат жасау
   * @param {Object} categoryData - Санат мәліметтері
   * @returns {Promise} API жауабы
   */
  createCategory: async (categoryData) => {
    try {
      console.log('📚 Жаңа санат жасау:', categoryData);
      
      // Проверка обязательных полей
      if (!categoryData.name) {
        return {
          success: false,
          message: 'Санат атауы міндетті өріс'
        };
      }
      
      const response = await apiClient.post('/books/categories', categoryData);
      console.log('✅ Санат сәтті құрылды:', response.data);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error('❌ Санат жасау қатесі:', error);
      
      if (error.response && error.response.status === 409) {
        return {
          success: false,
          message: 'Бұл атаумен санат бұрыннан бар. Басқа атау енгізіңіз.'
        };
      }
      
      return { 
        success: false, 
        message: translateError(error) || 'Санат жасау кезінде қате орын алды. Қайталап көріңіз.' 
      };
    }
  },

  /**
   * Санатты жаңарту
   * @param {string} id - Санат идентификаторы
   * @param {Object} categoryData - Жаңартылған санат мәліметтері
   * @returns {Promise} API жауабы
   */
  updateCategory: async (id, categoryData) => {
    try {
      console.log(`📚 ID: ${id} санатты жаңарту:`, categoryData);
      
      // Проверка обязательных полей
      if (!categoryData.name) {
        return {
          success: false,
          message: 'Санат атауы міндетті өріс'
        };
      }
      
      const response = await apiClient.put(`/books/categories/${id}`, categoryData);
      console.log('✅ Санат сәтті жаңартылды:', response.data);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error(`❌ Санат жаңарту қатесі (ID: ${id}):`, error);
      
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 404) {
          return {
            success: false,
            message: 'Санат табылмады'
          };
        }
        
        if (status === 409) {
          return {
            success: false,
            message: 'Бұл атаумен санат бұрыннан бар. Басқа атау енгізіңіз.'
          };
        }
      }
      
      return { 
        success: false, 
        message: translateError(error) || 'Санатты жаңарту кезінде қате орын алды. Қайталап көріңіз.' 
      };
    }
  },

  /**
   * Санатты жою
   * @param {string} id - Санат идентификаторы
   * @returns {Promise} API жауабы
   */
  deleteCategory: async (id) => {
    try {
      console.log(`📚 ID: ${id} санатты жою`);
      const response = await apiClient.delete(`/books/categories/${id}`);
      console.log('✅ Санат сәтті жойылды:', response.data);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error(`❌ Санат жою қатесі (ID: ${id}):`, error);
      
      if (error.response && error.response.status === 409) {
        return { 
          success: false, 
          message: 'Бұл санатқа тиесілі кітаптар бар. Санатты жою алдында барлық кітаптарды басқа санаттарға ауыстыру керек.' 
        };
      }
      
      if (error.response && error.response.status === 404) {
        return {
          success: false,
          message: 'Санат табылмады'
        };
      }
      
      return { 
        success: false, 
        message: translateError(error) || 'Санатты жою кезінде қате орын алды. Қайталап көріңіз.' 
      };
    }
  },
  
  /**
   * Санаттар статистикасын алу
   * @returns {Promise} API жауабы - әр санаттағы кітаптар саны
   */
  getCategoryStats: async () => {
    try {
      console.log('📊 Санаттар статистикасын жүктеу');
      const response = await apiClient.get('/books/categories/stats');
      console.log('✅ Санаттар статистикасы сәтті жүктелді:', response.data);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error('❌ Санаттар статистикасын жүктеу қатесі:', error);
      return { 
        success: false, 
        message: translateError(error) || 'Санаттар статистикасын жүктеу қатесі' 
      };
    }
  },
  
  /**
   * Ең көп қарызға алынған кітаптарды алу (трендтер)
   * @param {number} limit - Қайтарылатын кітаптар саны
   * @returns {Promise} API жауабы
   */
  getTrendingBooks: async (limit = 5) => {
    try {
      console.log(`📊 Тренд кітаптарын жүктеу (шектеу: ${limit})`);
      const response = await apiClient.get('/books/trending', { params: { limit } });
      console.log('✅ Тренд кітаптары сәтті жүктелді:', response.data);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error('❌ Тренд кітаптарын жүктеу қатесі:', error);
      return { 
        success: false, 
        message: translateError(error) || 'Тренд кітаптарын жүктеу қатесі' 
      };
    }
  }
};

export default adminBookService;