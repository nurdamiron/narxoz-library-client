// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from local storage on initial render
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for token in localStorage
        if (authService.isAuthenticated()) {
          // Get user from localStorage initially to prevent loading flash
          const storedUser = authService.getUser();
          if (storedUser) {
            setUser(storedUser);
          }
          
          // Then fetch fresh user data from API
          try {
            const response = await authService.getCurrentUser();
            if (response.success) {
              setUser(response.data);
              // Update localStorage with fresh data
              localStorage.setItem('user', JSON.stringify(response.data));
            }
          } catch (err) {
            console.error('Failed to refresh user data:', err);
            // If API call fails but we have stored user, keep using that
            // If API call fails and no stored user, handle as if not authenticated
            if (!storedUser) {
              localStorage.removeItem('token');
              setUser(null);
            }
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Аутентификация қатесі орын алды.');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login user
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      setUser(response.data);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Кіру кезінде қате орын алды';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(userData);
      setUser(response.data);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Тіркелу кезінде қате орын алды';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.updateUserDetails(userData);
      setUser(response.data);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Профильді жаңарту кезінде қате орын алды';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear any auth errors
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        clearError,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isLibrarian: user?.role === 'librarian'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;