// src/utils/index.js
export * from './hookUtils';


/**
 * Format date to locale string
 * @param {string|Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
    if (!date) return '';
    
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    };
    
    return new Date(date).toLocaleDateString('kk-KZ', defaultOptions);
  };
  
  /**
   * Format time to locale string
   * @param {string|Date} date - Date to format
   * @param {Object} options - Intl.DateTimeFormat options
   * @returns {string} Formatted time string
   */
  export const formatTime = (date, options = {}) => {
    if (!date) return '';
    
    const defaultOptions = {
      hour: '2-digit',
      minute: '2-digit',
      ...options
    };
    
    return new Date(date).toLocaleTimeString('kk-KZ', defaultOptions);
  };
  
  /**
   * Format date and time to locale string
   * @param {string|Date} date - Date to format
   * @param {Object} options - Intl.DateTimeFormat options
   * @returns {string} Formatted date and time string
   */
  export const formatDateTime = (date, options = {}) => {
    if (!date) return '';
    
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options
    };
    
    return new Date(date).toLocaleString('kk-KZ', defaultOptions);
  };
  
  /**
   * Limit string length with ellipsis
   * @param {string} str - String to truncate
   * @param {number} maxLength - Maximum length before truncation
   * @returns {string} Truncated string
   */
  export const truncateString = (str, maxLength = 100) => {
    if (!str) return '';
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + '...';
  };
  
  /**
   * Calculate days remaining until a date
   * @param {string|Date} dueDate - Due date
   * @returns {number} Days remaining (negative if overdue)
   */
  export const getDaysRemaining = (dueDate) => {
    if (!dueDate) return 0;
    
    const now = new Date();
    const due = new Date(dueDate);
    const timeDiff = due.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return daysDiff;
  };
  
  /**
   * Get status text based on borrow status and due date
   * @param {Object} borrow - Borrow object with status and dueDate
   * @returns {Object} Status object with text and color
   */
  export const getBorrowStatusInfo = (borrow) => {
    if (!borrow) return { text: '', color: 'default' };
    
    const { status, dueDate, returnDate } = borrow;
    const daysRemaining = getDaysRemaining(dueDate);
    
    if (status === 'returned') {
    // Check if the book was returned late
    const wasOverdue = returnDate && new Date(returnDate) > new Date(dueDate);
    if (wasOverdue) {
      return { 
        text: 'Кешіктіріліп қайтарылған', 
        color: 'warning' 
      };
    }
    return { 
      text: 'Қайтарылған', 
      color: 'success' 
    };
    }
    
    if (status === 'overdue' || daysRemaining < 0) {
      return { 
        text: 'Мерзімі өткен', 
        color: 'error' 
      };
    }
    
    if (daysRemaining <= 3) {
      return { 
        text: `${daysRemaining} күн қалды`, 
        color: 'warning' 
      };
    }
    
    return { 
      text: 'Белсенді', 
      color: 'info' 
    };
  };
  
  /**
   * Convert file size from bytes to human-readable format
   * @param {number} bytes - File size in bytes
   * @returns {string} Human-readable file size
   */
  export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  /**
   * Format notification message based on type
   * @param {Object} notification - Notification object
   * @returns {Object} Formatted notification with icon and color
   */
  export const formatNotification = (notification) => {
    if (!notification) return {};
    
    const base = { ...notification };
    
    switch (notification.type) {
      case 'info':
        base.icon = 'info';
        base.color = 'info';
        break;
      case 'warning':
        base.icon = 'warning';
        base.color = 'warning';
        break;
      case 'overdue':
        base.icon = 'error';
        base.color = 'error';
        break;
      case 'return':
        base.icon = 'schedule';
        base.color = 'warning';
        break;
      case 'system':
        base.icon = 'settings';
        base.color = 'primary';
        break;
      default:
        base.icon = 'notifications';
        base.color = 'default';
    }
    
    return base;
  };
  
  /**
   * Format form error from API response
   * @param {Object} error - Error response from API
   * @returns {Object} Formatted error object for form display
   */
  export const formatApiError = (error) => {
    if (!error) return {};
    
    // Handle validation errors array
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      const formErrors = {};
      error.response.data.errors.forEach(err => {
        formErrors[err.param] = err.msg;
      });
      return formErrors;
    }
    
    // Handle single error message
    if (error.response?.data?.error) {
      return { general: error.response.data.error };
    }
    
    // Default error message
    return { general: 'Қате орын алды. Әрекетті қайталап көріңіз.' };
  };
  
  /**
   * Get base URL for image paths
   * @param {string} path - Image path from API
   * @returns {string} Full URL for the image
   */
  export const getImageUrl = (path) => {
    // Используем нашу функцию для получения URL обложки, 
    // так как логика одинаковая для всех изображений
    return getBookCoverUrl(path);
  };
  
  /**
   * Get backend base URL
   * @returns {string} Backend base URL
   */
  export const getBackendUrl = () => {
    // Use environment variable if available, otherwise use the current origin with port 5002
    if (process.env.REACT_APP_BACKEND_URL) {
      return process.env.REACT_APP_BACKEND_URL;
    }
    
    // In production, backend might be on the same domain
    if (process.env.NODE_ENV === 'production') {
      return window.location.origin.replace(':3002', ':5002');
    }
    
    // Default to localhost for development
    return 'http://localhost:5002';
  };

  /**
   * Get default book cover image URL
   * @returns {string} Default book cover URL
   */
  export const getDefaultBookCover = () => {
    return `${getBackendUrl()}/uploads/covers/no-image.png`;
  };

  /**
   * Get cover image URL with default fallback
   * @param {string} cover - Cover path from API
   * @returns {string} Cover image URL
   */
  export const getBookCoverUrl = (cover) => {
    const backendUrl = getBackendUrl();
    
    // Если путь не указан или пустой, возвращаем изображение по умолчанию
    if (!cover) {
      return getDefaultBookCover();
    }
    
    // Если это явно указанный placeholder, используем его
    if (cover === 'NarXoz') {
      return `${backendUrl}/api/narxoz-cover`;
    }
    
    // Если путь уже полный URL, возвращаем как есть
    if (cover.startsWith('http')) {
      return cover;
    }
    
    // Для путей вида /uploads/... (начинающихся с /)
    if (cover.startsWith('/')) {
      return `${backendUrl}${cover}`;
    }
    
    // Для относительных путей без начального слэша
    return `${backendUrl}/${cover}`;
  };
  
  /**
   * Get avatar image URL with default fallback
   * @param {string} avatar - Avatar path from API
   * @returns {string} Avatar image URL
   */
  export const getAvatarUrl = (avatar) => {
    if (!avatar) {
      return '/images/default-avatar.jpg';
    }
    
    return getImageUrl(avatar);
  };