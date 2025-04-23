// src/utils/index.js


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
    
    const { status, dueDate } = borrow;
    const daysRemaining = getDaysRemaining(dueDate);
    
    if (status === 'returned') {
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
    if (!path) return '';
    
    // If path is already a full URL
    if (path.startsWith('http')) {
      return path;
    }
    
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
    
    // Handle different path formats
    if (path.startsWith('/')) {
      return `${baseUrl}${path}`;
    }
    
    return `${baseUrl}/${path}`;
  };
  
  /**
   * Get cover image URL with default fallback
   * @param {string} cover - Cover path from API
   * @returns {string} Cover image URL
   */
  export const getBookCoverUrl = (cover) => {
    if (!cover) {
      return '/images/default-book-cover.jpg';
    }
    
    return getImageUrl(cover);
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