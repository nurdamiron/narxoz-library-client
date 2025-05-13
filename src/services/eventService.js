/**
 * Event Service
 * 
 * Provides functions for interacting with the event API endpoints
 */
import BaseService from './baseService';

class EventService {
  /**
   * Get all events with optional filtering
   * 
   * @param {Object} filters - Query parameters for filtering events
   * @param {string} filters.type - Event type (workshop, lecture, etc.)
   * @param {number} filters.category - Category ID
   * @param {string} filters.startDate - Minimum start date 
   * @param {string} filters.endDate - Maximum end date
   * @param {boolean} filters.isActive - Active status
   * @param {string} filters.search - Search term
   * @param {number} filters.page - Page number
   * @param {number} filters.limit - Items per page
   * @returns {Promise} - Promise with event list data
   */
  async getEvents(filters = {}) {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null) {
        queryParams.append(key, filters[key]);
      }
    });

    const queryString = queryParams.toString();
    return await BaseService.get(`/events${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Get a single event by ID
   * 
   * @param {number} id - Event ID
   * @returns {Promise} - Promise with event data
   */
  async getEvent(id) {
    return BaseService.get(`/events/${id}`);
  }

  /**
   * Get all event categories
   * 
   * @returns {Promise} - Promise with categories data
   */
  async getEventCategories() {
    return BaseService.get('/events/categories');
  }

  /**
   * Get events the current user is registered for
   * 
   * @returns {Promise} - Promise with user's events
   */
  async getMyEvents() {
    return BaseService.get('/events/my-events');
  }

  /**
   * Register for an event
   * 
   * @param {number} eventId - Event ID
   * @returns {Promise} - Promise with registration result
   */
  async registerForEvent(eventId) {
    return BaseService.post(`/events/${eventId}/register`);
  }

  /**
   * Cancel registration for an event
   * 
   * @param {number} eventId - Event ID
   * @returns {Promise} - Promise with cancellation result
   */
  async cancelRegistration(eventId) {
    return BaseService.delete(`/events/${eventId}/register`);
  }
}

export default new EventService();