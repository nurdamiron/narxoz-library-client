// src/hooks/useProfile.js
import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook for managing user profile
 */
const useProfile = () => {
  const { user: authUser, setUser: setAuthUser } = useAuth();
  const [profile, setProfile] = useState(authUser);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getMe();
      
      if (response.success) {
        setProfile(response.data);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Профиль мәліметтерін жүктеу кезінде қате орын алды');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user stats
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.getMyStats();
      
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching user stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.updateMe(userData);
      
      if (response.success) {
        setProfile(response.data);
        
        // Also update in auth context
        if (setAuthUser) {
          setAuthUser(response.data);
        }
      }
      
      return response;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Профильді жаңарту кезінде қате орын алды');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Upload avatar
  const uploadAvatar = async (file) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.uploadAvatar(file);
      
      if (response.success) {
        setProfile(response.data);
        
        // Also update in auth context
        if (setAuthUser) {
          setAuthUser(response.data);
        }
      }
      
      return response;
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError('Аватарды жүктеу кезінде қате орын алды');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.changePassword(passwordData);
      return response;
    } catch (err) {
      console.error('Error changing password:', err);
      setError('Құпия сөзді өзгерту кезінде қате орын алды');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch of profile and stats
  useEffect(() => {
    if (authUser) {
      fetchProfile();
      fetchStats();
    }
  }, [authUser, fetchProfile, fetchStats]);

  return {
    profile,
    stats,
    loading,
    error,
    fetchProfile,
    fetchStats,
    updateProfile,
    uploadAvatar,
    changePassword
  };
};

export default useProfile;