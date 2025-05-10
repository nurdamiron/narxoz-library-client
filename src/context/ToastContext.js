// src/context/ToastContext.js
import React, { createContext, useContext, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { AlertTitle, Box, Typography, Link } from '@mui/material';
import { ErrorOutline, Warning, Info, CheckCircle, Email } from '@mui/icons-material';
import { translateError } from '../utils/errorMessages';

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
    title: '',
    details: null,
  });

  // Show toast notification
  const showToast = (message, options = {}) => {
    // Тщательная проверка типа сообщения
    let translatedMessage = '';
    let errorDetails = null;
    
    if (message) {
      console.log('TOAST original message:', message);
      
      // Обработка случая, когда в сообщении строка "[object Object]"
      if (message === '[object Object]') {
        translatedMessage = 'Белгісіз қате орын алды. Әрекетті қайталап көріңіз.';
      }
      // Объект ошибки
      else if (message instanceof Error || (typeof message === 'object' && message.message)) {
        translatedMessage = translateError(message);
        errorDetails = message;
      } 
      // Object с response от API
      else if (typeof message === 'object' && message.response) {
        translatedMessage = translateError(message);
        errorDetails = message.response.data;
      }
      // Простой объект 
      else if (typeof message === 'object') {
        try {
          // Пытаемся превратить его в строку с полезной информацией
          if (message.error || message.message || message.errorMessage) {
            translatedMessage = translateError(message.error || message.message || message.errorMessage);
            errorDetails = message;
          } else {
            const strMessage = JSON.stringify(message);
            translatedMessage = strMessage === '{}' 
              ? 'Белгісіз қате орын алды' 
              : `Қате: ${strMessage}`;
          }
        } catch (e) {
          translatedMessage = 'Белгісіз қате орын алды. Әрекетті қайталап көріңіз.';
        }
      }
      // Строка
      else if (typeof message === 'string') {
        translatedMessage = options.translate !== false ? translateError(message) : message;
      }
    }
    
    // Если сообщение так и не удалось определить
    if (!translatedMessage) {
      translatedMessage = 'Белгісіз қате орын алды. Әрекетті қайталап көріңіз.';
    }
    
    // Определяем заголовок на основе типа уведомления
    let title = options.title || '';
    if (!title) {
      switch (options.severity || 'info') {
        case 'error':
          title = 'Қате';
          break;
        case 'warning':
          title = 'Ескерту';
          break;
        case 'success':
          title = 'Сәтті';
          break;
        case 'info':
          title = 'Ақпарат';
          break;
        default:
          title = '';
      }
    }
    
    // Логирование для отладки
    console.log(`TOAST (${options.severity || 'info'}): ${title} - ${translatedMessage}`);
    
    setToast({
      open: true,
      message: translatedMessage,
      severity: options.severity || 'info',
      duration: options.duration || 6000,
      vertical: options.vertical || 'bottom',
      horizontal: options.horizontal || 'center',
      title: title,
      details: errorDetails
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

  // Функция для получения иконки по типу уведомления
  const getIconByType = (severity) => {
    switch (severity) {
      case 'error':
        return <ErrorOutline />;
      case 'warning':
        return <Warning />;
      case 'success':
        return <CheckCircle />;
      case 'info':
      default:
        return <Info />;
    }
  };
  
  // Определение специального содержимого для типичных ошибок
  const getErrorSpecialContent = (message) => {
    if (!message) return null;
    
    if (message.includes('email') || message.includes('электрондық пошта')) {
      return (
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', bgcolor: 'rgba(255, 255, 255, 0.15)', p: 1, borderRadius: 1 }}>
          <Email fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2">
            <strong>Шешім:</strong> Басқа email пайдаланыңыз немесе 
            <Link href="/login" color="inherit" sx={{ ml: 0.5, textDecoration: 'underline' }}>
              кіру бетіне өтіңіз
            </Link>.
          </Typography>
        </Box>
      );
    }
    
    if (message.includes('логин') || message.includes('username')) {
      return (
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', bgcolor: 'rgba(255, 255, 255, 0.15)', p: 1, borderRadius: 1 }}>
          <Warning fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2">
            <strong>Шешім:</strong> Басқа логин таңдаңыз.
          </Typography>
        </Box>
      );
    }
    
    return null;
  };

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
        sx={{
          '& .MuiPaper-root': {
            minWidth: '300px',
            maxWidth: '80vw'
          }
        }}
      >
        <Alert 
          onClose={hideToast} 
          severity={toast.severity} 
          variant="filled" 
          icon={getIconByType(toast.severity)}
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            '@media (max-width: 600px)': {
              width: 'auto',
              mx: 2
            }
          }}
        >
          {toast.title && (
            <AlertTitle sx={{ fontWeight: 600 }}>
              {toast.title}
            </AlertTitle>
          )}
          <Typography variant="body2">
            {toast.message}
          </Typography>
          
          {/* Специальное содержимое для определенных типов ошибок */}
          {toast.severity === 'error' && getErrorSpecialContent(toast.message)}
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

// Экспортируем и ToastContext как default, и хук useToast как именованный экспорт
export default ToastContext;