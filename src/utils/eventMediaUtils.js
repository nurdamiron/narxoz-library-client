/**
 * Utility functions for event media handling
 */

/**
 * Get event media image URL with default fallback
 * @param {string} image - Image path from API
 * @returns {string} Event image URL
 */
export const getEventMediaUrl = (image) => {
  // Constant for local server address - always use explicitly specified URL
  const LOCAL_BACKEND_URL = 'http://localhost:5001';
  
  // If path is not specified or empty, return default image
  if (!image) {
    return '/images/event-placeholder.jpg';
  }
  
  // If path is already a full URL, check if it needs to be transformed to bypass CORS
  if (image.startsWith('http')) {
    // If URL contains /uploads/events/, extract the filename to use with debug route
    if (image.includes('/uploads/events/')) {
      const filename = image.split('/uploads/events/')[1];
      // Use special route that provides correct CORS headers
      return `${LOCAL_BACKEND_URL}/api/event-media-debug/${filename}`;
    }
    return image;
  }
  
  // For paths like /uploads/events/... (handle separately to bypass CORS)
  if (image.includes('/uploads/events/')) {
    const parts = image.split('/uploads/events/');
    const filename = parts[parts.length - 1];
    return `${LOCAL_BACKEND_URL}/api/event-media-debug/${filename}`;
  }
  
  // For paths like /uploads/... (starting with /)
  if (image.startsWith('/')) {
    // Try to extract filename if it's a path to event media
    if (image.includes('/uploads/events/')) {
      const parts = image.split('/uploads/events/');
      const filename = parts[parts.length - 1];
      return `${LOCAL_BACKEND_URL}/api/event-media-debug/${filename}`;
    }
    return `${LOCAL_BACKEND_URL}${image}`;
  }
  
  // For relative paths without starting slash
  return `${LOCAL_BACKEND_URL}/${image}`;
};

/**
 * Validate event media file
 * @param {File} file - File to validate
 * @returns {Object} Validation result {valid: boolean, message: string}
 */
export const validateEventMediaFile = (file) => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { 
      valid: false, 
      message: 'Тек сурет файлдарын жүктеуге рұқсат етілген (JPEG, PNG, GIF)'
    };
  }
  
  // Check file extension
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  const fileExtension = file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    return { 
      valid: false, 
      message: `Жарамсыз файл кеңейтімі: ${fileExtension}. Тек ${allowedExtensions.join(', ')} форматтары рұқсат етілген`
    };
  }
  
  // Check file size - 5MB limit
  if (file.size > 5 * 1024 * 1024) {
    return { 
      valid: false, 
      message: `Сурет файлының өлшемі 5MB-дан аспауы керек. Сіздің файлыңыз: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
    };
  }
  
  return { valid: true };
};