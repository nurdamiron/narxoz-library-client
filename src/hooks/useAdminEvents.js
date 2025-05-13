/**
 * Admin Events custom hook
 * 
 * Custom hook for managing events in the admin interface
 */
import { useState, useEffect, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../context/ToastContext';
import adminEventService from '../services/adminEventService';

const useAdminEvents = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  
  const [myCreatedEvents, setMyCreatedEvents] = useState([]);
  const [eventRegistrations, setEventRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch events created by the current user
   */
  const fetchMyCreatedEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminEventService.getMyCreatedEvents();
      
      if (response.success) {
        setMyCreatedEvents(response.data);
      } else {
        setError(response.error || t('events.admin.fetchError'));
        showToast(response.error || t('events.admin.fetchError'), { severity: 'error' });
      }
    } catch (err) {
      setError(err.message || t('events.admin.fetchError'));
      showToast(err.message || t('events.admin.fetchError'), { severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [showToast, t]);

  /**
   * Create a new event
   */
  const createEvent = useCallback(async (eventData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminEventService.createEvent(eventData);
      
      if (response.success) {
        showToast(t('events.admin.createSuccess'), { severity: 'success' });
        return { success: true, data: response.data };
      } else {
        showToast(response.error || t('events.admin.createError'), { severity: 'error' });
        return { success: false, error: response.error };
      }
    } catch (err) {
      showToast(err.message || t('events.admin.createError'), { severity: 'error' });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [showToast, t]);

  /**
   * Update an existing event
   */
  const updateEvent = useCallback(async (id, eventData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminEventService.updateEvent(id, eventData);
      
      if (response.success) {
        showToast(t('events.admin.updateSuccess'), { severity: 'success' });
        return { success: true, data: response.data };
      } else {
        showToast(response.error || t('events.admin.updateError'), { severity: 'error' });
        return { success: false, error: response.error };
      }
    } catch (err) {
      showToast(err.message || t('events.admin.updateError'), { severity: 'error' });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [showToast, t]);

  /**
   * Delete an event
   */
  const deleteEvent = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminEventService.deleteEvent(id);
      
      if (response.success) {
        showToast(t('events.admin.deleteSuccess'), { severity: 'success' });
        return { success: true };
      } else {
        showToast(response.error || t('events.admin.deleteError'), { severity: 'error' });
        return { success: false, error: response.error };
      }
    } catch (err) {
      showToast(err.message || t('events.admin.deleteError'), { severity: 'error' });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [showToast, t]);

  /**
   * Fetch registrations for an event
   */
  const fetchEventRegistrations = useCallback(async (eventId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminEventService.getEventRegistrations(eventId);
      
      if (response.success) {
        setEventRegistrations(response.data);
        return response.data;
      } else {
        setError(response.error || t('events.admin.registrations.registrationsError'));
        showToast(response.error || t('events.admin.registrations.registrationsError'), { severity: 'error' });
        return [];
      }
    } catch (err) {
      setError(err.message || t('events.admin.registrations.registrationsError'));
      showToast(err.message || t('events.admin.registrations.registrationsError'), { severity: 'error' });
      return [];
    } finally {
      setLoading(false);
    }
  }, [showToast, t]);

  /**
   * Update registration status
   */
  const updateRegistrationStatus = useCallback(async (registrationId, status) => {
    try {
      setLoading(true);
      
      const response = await adminEventService.updateRegistrationStatus(registrationId, status);
      
      if (response.success) {
        showToast(t('events.admin.statusUpdateSuccess'), { severity: 'success' });
        return { success: true, data: response.data };
      } else {
        showToast(response.error || t('events.admin.statusUpdateError'), { severity: 'error' });
        return { success: false, error: response.error };
      }
    } catch (err) {
      showToast(err.message || t('events.admin.statusUpdateError'), { severity: 'error' });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [showToast, t]);

  /**
   * Create a new event category
   */
  const createEventCategory = useCallback(async (categoryData) => {
    try {
      setLoading(true);
      
      const response = await adminEventService.createEventCategory(categoryData);
      
      if (response.success) {
        showToast(t('events.admin.categoryCreateSuccess'), { severity: 'success' });
        return { success: true, data: response.data };
      } else {
        showToast(response.error || t('events.admin.categoryCreateError'), { severity: 'error' });
        return { success: false, error: response.error };
      }
    } catch (err) {
      showToast(err.message || t('events.admin.categoryCreateError'), { severity: 'error' });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [showToast, t]);

  /**
   * Update an event category
   */
  const updateEventCategory = useCallback(async (id, categoryData) => {
    try {
      setLoading(true);
      
      const response = await adminEventService.updateEventCategory(id, categoryData);
      
      if (response.success) {
        showToast(t('events.admin.categoryUpdateSuccess'), { severity: 'success' });
        return { success: true, data: response.data };
      } else {
        showToast(response.error || t('events.admin.categoryUpdateError'), { severity: 'error' });
        return { success: false, error: response.error };
      }
    } catch (err) {
      showToast(err.message || t('events.admin.categoryUpdateError'), { severity: 'error' });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [showToast, t]);

  /**
   * Delete an event category
   */
  const deleteEventCategory = useCallback(async (id) => {
    try {
      setLoading(true);
      
      const response = await adminEventService.deleteEventCategory(id);
      
      if (response.success) {
        showToast(t('events.admin.categoryDeleteSuccess'), { severity: 'success' });
        return { success: true };
      } else {
        showToast(response.error || t('events.admin.categoryDeleteError'), { severity: 'error' });
        return { success: false, error: response.error };
      }
    } catch (err) {
      showToast(err.message || t('events.admin.categoryDeleteError'), { severity: 'error' });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [showToast, t]);

  // Load created events on component mount
  useEffect(() => {
    fetchMyCreatedEvents();
  }, [fetchMyCreatedEvents]);

  return {
    myCreatedEvents,
    eventRegistrations,
    loading,
    error,
    fetchMyCreatedEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    fetchEventRegistrations,
    updateRegistrationStatus,
    createEventCategory,
    updateEventCategory,
    deleteEventCategory
  };
};

export default useAdminEvents;