/**
 * Admin Event Service
 * 
 * Provides functions for administrators to manage events
 */
import BaseService from './baseService';
import apiClient from './api';
import { validateEventMediaFile } from '../utils/eventMediaUtils';

class AdminEventService {
  /**
   * Create a new event
   * 
   * @param {Object} eventData - Event data
   * @returns {Promise} - Promise with created event data
   */
  async createEvent(eventData) {
    console.log('🔴 adminEventService.createEvent called with eventData:', eventData);
    console.log('🔴 EventData keys:', Object.keys(eventData));
    console.log('🔴 EventData title:', eventData.title);
    console.log('🔴 EventData description:', eventData.description);
    console.log('🔴 EventData location:', eventData.location);
    
    const result = await BaseService.post('/events', eventData);
    console.log('🔴 BaseService.post result:', result);
    
    return result;
  }

  /**
   * Update an existing event
   * 
   * @param {number} id - Event ID
   * @param {Object} eventData - Updated event data
   * @returns {Promise} - Promise with updated event data
   */
  async updateEvent(id, eventData) {
    return BaseService.put(`/events/${id}`, eventData);
  }

  /**
   * Delete an event
   * 
   * @param {number} id - Event ID
   * @returns {Promise} - Promise with deletion result
   */
  async deleteEvent(id) {
    return BaseService.delete(`/events/${id}`);
  }

  /**
   * Get all registrations for an event
   * 
   * @param {number} eventId - Event ID
   * @returns {Promise} - Promise with registration data
   */
  async getEventRegistrations(eventId) {
    return BaseService.get(`/events/${eventId}/registrations`);
  }

  /**
   * Update registration status
   * 
   * @param {number} registrationId - Registration ID
   * @param {string} status - New status (registered, attended, cancelled)
   * @returns {Promise} - Promise with updated registration data
   */
  async updateRegistrationStatus(registrationId, status) {
    return BaseService.put(`/events/registrations/${registrationId}`, { status });
  }

  /**
   * Get events created by current user
   * 
   * @returns {Promise} - Promise with events data
   */
  async getMyCreatedEvents() {
    return BaseService.get('/events/my-created-events');
  }

  /**
   * Create a new event category
   * 
   * @param {Object} categoryData - Category data
   * @returns {Promise} - Promise with created category data
   */
  async createEventCategory(categoryData) {
    return BaseService.post('/events/categories', categoryData);
  }

  /**
   * Update an event category
   * 
   * @param {number} id - Category ID
   * @param {Object} categoryData - Updated category data
   * @returns {Promise} - Promise with updated category data
   */
  async updateEventCategory(id, categoryData) {
    return BaseService.put(`/events/categories/${id}`, categoryData);
  }

  /**
   * Delete an event category
   * 
   * @param {number} id - Category ID
   * @returns {Promise} - Promise with deletion result
   */
  async deleteEventCategory(id) {
    return BaseService.delete(`/events/categories/${id}`);
  }

  /**
   * Upload event media image
   * 
   * @param {string} id - Event ID
   * @param {File} file - Media file
   * @returns {Promise} - Promise with upload result
   */
  async uploadEventMedia(id, file) {
    try {
      console.log(`🗓️ ID: ${id} іс-шара суретін жүктеу. Файл: ${file.name}, өлшемі: ${file.size} байт, типі: ${file.type}`);
      
      // Validate file
      const validation = validateEventMediaFile(file);
      if (!validation.valid) {
        console.error('❌ Файл валидациясы қатесі:', validation.message);
        return { 
          success: false, 
          message: validation.message
        };
      }
      
      // Create FormData for sending file
      const formData = new FormData();
      formData.append('file', file);
      
      // Detailed request logging
      console.log('📤 Сурет жүктеу сұранысы жіберілуде...');
      console.log('📤 API endpoint:', `/events/${id}/image`);
      
      // Backend URL for future use in building full URL
      const backendBaseUrl = 'http://localhost:5001';
      
      const response = await apiClient.put(`/events/${id}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        // For tracking upload progress
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`📤 Жүктеу үрдісі: ${percentCompleted}%`);
        }
      });
      
      console.log('✅ Сурет сәтті жүктелді:', response.data);
      
      // Check if response contains correct URL
      const responseData = response.data.data || response.data;
      
      if (responseData && responseData.image) {
        console.log('✅ Алынған сурет URL:', responseData.image);
        
        // Make sure URL is absolute
        if (!responseData.image.startsWith('http')) {
          // Use hard-coded backend URL
          const fullUrl = `${backendBaseUrl}${responseData.relativePath || responseData.image}`;
          console.log('✅ Түрлендірілген толық URL:', fullUrl);
          responseData.image = fullUrl;
        }
      } else {
        console.warn('⚠️ Жауапта сурет URL-і жоқ');
      }
      
      return { success: true, data: responseData };
    } catch (error) {
      console.error(`❌ Сурет жүктеу қатесі (ID: ${id}):`, error);
      
      // If error is already structured in our format
      if (error.success === false) {
        return error;
      }
      
      if (error.response) {
        const { status, data } = error.response;
        console.error(`❌ Сурет жүктеу қатесі: HTTP ${status}`, data);
        
        // 404 handling - event not found
        if (status === 404) {
          return { 
            success: false, 
            message: 'Іс-шара табылмады. Беттегі мәліметтер ескірген болуы мүмкін.' 
          };
        }
        
        // 400 - invalid file type or size
        if (status === 400) {
          return { 
            success: false, 
            message: data.error || data.message || 'Файл типі немесе өлшемі жарамсыз. JPG, PNG немесе GIF форматындағы 5MB-дан аспайтын сурет жүктеңіз.' 
          };
        }
        
        // 401 - authorization error
        if (status === 401) {
          return {
            success: false,
            message: 'Авторизация қатесі. Қайта кіріңіз.'
          };
        }
        
        // 403 - no permission
        if (status === 403) {
          return {
            success: false,
            message: 'Осы іс-шараға сурет жүктеуге рұқсатыңыз жоқ.'
          };
        }
        
        // 500 - server error
        if (status === 500) {
          return { 
            success: false, 
            message: 'Сурет жүктеу кезінде сервер қатесі орын алды. Кейінірек қайталап көріңіз.' 
          };
        }
        
        // For other server errors
        return {
          success: false, 
          message: data?.message || data?.error || 'Сурет жүктеу кезінде серверде қате орын алды',
          status: status
        };
      }
      
      // For network errors (e.g., connection interruption)
      if (error.message && error.message.includes('Network Error')) {
        return {
          success: false,
          message: 'Желі қатесі. Интернет байланысын тексеріңіз және қайталап көріңіз.'
        };
      }
      
      return {
        success: false,
        message: error.message || 'Сурет жүктеу кезінде белгісіз қате орын алды'
      };
    }
  }
}

export default new AdminEventService();