/**
 * Utility functions for event media handling
 */

/**
 * Get event media image URL with default fallback
 * @param {Object} event - Event object containing image information
 * @returns {string} Event image URL
 */
export const getEventImageUrl = (event) => {
  // Use base backend URL without /api suffix for static files
  const LOCAL_BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5002';
  
  // If no event or no image, return placeholder
  if (!event || !event.image) {
    return getEventPlaceholderImage(event?.type);
  }
  
  // If image is already a full URL (processed by backend), return as is
  if (event.image.startsWith('http')) {
    return event.image;
  }
  
  // For paths like /uploads/events/... 
  if (event.image.includes('/uploads/events/')) {
    const parts = event.image.split('/uploads/events/');
    const filename = parts[parts.length - 1];
    return `${LOCAL_BACKEND_URL}/uploads/events/${filename}`;
  }
  
  // For relative paths without starting slash (just filename)
  if (event.imageStoredLocally !== false) {
    return `${LOCAL_BACKEND_URL}/uploads/events/${event.image}`;
  }
  
  // For external URLs
  return event.image;
};

/**
 * Get placeholder image for events without images
 * @param {string} eventType - Optional event type for type-specific placeholders
 * @returns {string} Placeholder image URL
 */
export const getEventPlaceholderImage = (eventType = 'default') => {
  // Try to use event-specific placeholder first
  if (eventType && eventType !== 'default') {
    const typeSpecificPlaceholder = `/images/event-placeholder-${eventType}.jpg`;
    return typeSpecificPlaceholder;
  }

  // Use generic event placeholder
  return '/images/event-placeholder.jpg';
};

/**
 * Legacy function name for backward compatibility
 * @param {string} image - Image path from API
 * @returns {string} Event image URL
 */
export const getEventMediaUrl = (image) => {
  return getEventImageUrl({ image, imageStoredLocally: true });
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