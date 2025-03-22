// src/context/ToastContext.js
import React, { createContext, useContext, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// Create toast context
const ToastContext = createContext();

/**
 * Toast provider component
 * Handles global toast notifications
 */
export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'info',
    duration: 6000,
  });

  // Show toast notification
  const showToast = (message, options = {}) => {
    setToast({
      open: true,
      message,
      severity: options.severity || 'info',
      duration: options.duration || 6000,
      vertical: options.vertical || 'bottom',
      horizontal: options.horizontal || 'center',
    });
  };

  // Hide toast notification
  const hideToast = () => {
    setToast({ ...toast, open: false });
  };

  // Convenience methods for different toast types
  const success = (message, options = {}) => showToast(message, { ...options, severity: 'success' });
  const error = (message, options = {}) => showToast(message, { ...options, severity: 'error' });
  const warning = (message, options = {}) => showToast(message, { ...options, severity: 'warning' });
  const info = (message, options = {}) => showToast(message, { ...options, severity: 'info' });

  return (
    <ToastContext.Provider value={{ showToast, hideToast, success, error, warning, info }}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={toast.duration}
        onClose={hideToast}
        anchorOrigin={{ 
          vertical: toast.vertical || 'bottom', 
          horizontal: toast.horizontal || 'center' 
        }}
      >
        <Alert 
          onClose={hideToast} 
          severity={toast.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

// Custom hook to use toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;