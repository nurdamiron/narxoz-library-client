/**
 * Admin Event Service
 * 
 * Provides functions for administrators to manage events
 */
import BaseService from './baseService';

class AdminEventService {
  /**
   * Create a new event
   * 
   * @param {Object} eventData - Event data
   * @returns {Promise} - Promise with created event data
   */
  async createEvent(eventData) {
    return BaseService.post('/events', eventData);
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
}

export default new AdminEventService();