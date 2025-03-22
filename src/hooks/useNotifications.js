// src/hooks/useNotifications.js
import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services';

/**
 * Custom hook for managing notifications
 * @param {boolean} autoRefresh - Whether to automatically refresh notifications periodically
 * @param {number} refreshInterval - Interval in milliseconds to refresh notifications (default: 60000ms = 1min)
 */
const useNotifications = (autoRefresh = true, refreshInterval = 60000) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationService.getNotifications();
      
      if (response.success) {
        setNotifications(response.data);
        
        // Count unread notifications
        const unreadNotifications = response.data.filter(notification => !notification.read);
        setUnreadCount(unreadNotifications.length);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Хабарламаларды жүктеу кезінде қате орын алды');
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      setLoading(true);
      const response = await notificationService.markAsRead(id);
      
      if (response.success) {
        // Update notifications state
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === id ? { ...notification, read: true } : notification
          )
        );
        
        // Update unread count
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      return response;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      setLoading(true);
      const response = await notificationService.markAllAsRead();
      
      if (response.success) {
        // Update all notifications to read
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, read: true }))
        );
        
        // Reset unread count
        setUnreadCount(0);
      }
      
      return response;
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      setLoading(true);
      const response = await notificationService.deleteNotification(id);
      
      if (response.success) {
        // Remove from notifications state
        const updatedNotifications = notifications.filter(
          notification => notification.id !== id
        );
        setNotifications(updatedNotifications);
        
        // Update unread count if needed
        const deletedNotification = notifications.find(notification => notification.id === id);
        if (deletedNotification && !deletedNotification.read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
      
      return response;
    } catch (err) {
      console.error('Error deleting notification:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch of notifications
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Set up auto-refresh interval if enabled
  useEffect(() => {
    let intervalId;
    
    if (autoRefresh) {
      intervalId = setInterval(() => {
        fetchNotifications();
      }, refreshInterval);
    }
    
    // Cleanup interval on unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [autoRefresh, refreshInterval, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
};

export default useNotifications;