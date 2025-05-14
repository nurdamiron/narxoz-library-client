/**
 * Events custom hook
 * 
 * Custom hook for managing events state and API interactions
 */
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../context/ToastContext';
import eventService from '../services/eventService';

const useEvents = (initialFilters = {}) => {
  const { t } = useTranslation();
  const { success, error } = useToast();
  
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [myEvents, setMyEvents] = useState({ upcomingEvents: [], pastEvents: [] });
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 0,
    hasMore: false
  });

  /**
   * Fetch event list with filters
   */
  const fetchEvents = useCallback(async (newFilters) => {
    try {
      setLoading(true);
      setErrorState(null);
      
      const filtersToUse = newFilters || filters;
      const response = await eventService.getEvents(filtersToUse);
      
      if (response.success) {
        setEvents(response.data);
        setPagination(response.pagination);
      } else {
        setErrorState(response.error || t('events.fetchError'));
        error(response.error || t('events.fetchError'));
      }
    } catch (err) {
      setErrorState(err.message || t('events.fetchError'));
      error(err.message || t('events.fetchError'));
    } finally {
      setLoading(false);
    }
  }, [filters, error, t]);

  /**
   * Update filters and fetch events
   */
  const updateFilters = useCallback((newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 }; // Reset to page 1 when filters change
    setFilters(updatedFilters);
    fetchEvents(updatedFilters);
  }, [filters, fetchEvents]);

  /**
   * Change page and fetch events
   */
  const changePage = useCallback((newPage) => {
    const updatedFilters = { ...filters, page: newPage };
    setFilters(updatedFilters);
    fetchEvents(updatedFilters);
  }, [filters, fetchEvents]);

  /**
   * Fetch a single event by ID
   */
  const fetchEvent = useCallback(async (id) => {
    try {
      setLoading(true);
      setErrorState(null);
      
      // Ensure the ID is sanitized before making the API call
      const sanitizedId = id.toString().replace(/['"`]/g, '');
      
      const response = await eventService.getEvent(sanitizedId);
      
      if (response.success) {
        setEvent(response.data);
      } else {
        setErrorState(response.error || t('events.fetchEventError'));
        error(response.error || t('events.fetchEventError'));
      }
    } catch (err) {
      setErrorState(err.message || t('events.fetchEventError'));
      error(err.message || t('events.fetchEventError'));
    } finally {
      setLoading(false);
    }
  }, [error, t]);

  /**
   * Fetch all event categories
   */
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await eventService.getEventCategories();
      
      if (response.success) {
        setCategories(response.data);
      } else {
        error(response.error || t('events.categoriesError'));
      }
    } catch (err) {
      error(err.message || t('events.categoriesError'));
    } finally {
      setLoading(false);
    }
  }, [error, t]);

  /**
   * Fetch events the current user is registered for
   */
  const fetchMyEvents = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await eventService.getMyEvents();
      
      if (response.success) {
        setMyEvents(response.data);
      } else {
        error(response.error || t('events.myEventsError'));
      }
    } catch (err) {
      error(err.message || t('events.myEventsError'));
    } finally {
      setLoading(false);
    }
  }, [error, t]);

  /**
   * Register for an event
   */
  const registerForEvent = useCallback(async (eventId) => {
    try {
      setLoading(true);
      
      // Sanitize the event ID before making the API call
      const sanitizedId = eventId.toString().replace(/['"` ]/g, '');
      
      const response = await eventService.registerForEvent(sanitizedId);
      
      if (response.success) {
        success(t('events.registerSuccess'));
        return true;
      } else {
        error(response.error || t('events.registerError'));
        return false;
      }
    } catch (err) {
      error(err.message || t('events.registerError'));
      return false;
    } finally {
      setLoading(false);
    }
  }, [success, error, t]);

  /**
   * Cancel registration for an event
   */
  const cancelRegistration = useCallback(async (eventId) => {
    try {
      setLoading(true);
      
      // Sanitize the event ID before making the API call
      const sanitizedId = eventId.toString().replace(/['"` ]/g, '');
      
      const response = await eventService.cancelRegistration(sanitizedId);
      
      if (response.success) {
        success(t('events.cancelSuccess'));
        return true;
      } else {
        error(response.error || t('events.cancelError'));
        return false;
      }
    } catch (err) {
      error(err.message || t('events.cancelError'));
      return false;
    } finally {
      setLoading(false);
    }
  }, [success, error, t]);

  // Fetch events on component mount or when filters change
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    event,
    categories,
    myEvents,
    loading,
    error: errorState,
    filters,
    pagination,
    fetchEvents,
    fetchEvent,
    fetchCategories,
    fetchMyEvents,
    updateFilters,
    changePage,
    registerForEvent,
    cancelRegistration
  };
};

export default useEvents;