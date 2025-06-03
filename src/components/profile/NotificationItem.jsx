import React from 'react';
import {
  Paper,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';

/**
 * NotificationItem компоненті - жекелеген хабарлама элементі
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {Object} props.notification - Хабарлама объектісі
 * @param {Function} props.onReadNotification - Хабарламаны оқылды деп белгілеу функциясы
 * @param {Function} props.onNotificationClick - Хабарламаға клик өңдеу функциясы
 */
const NotificationItem = ({ notification, onReadNotification, onNotificationClick }) => {
  const theme = useTheme();

  const handleClick = () => {
    // Алдымен хабарламаны оқылды деп белгілеу
    if (!notification.read && onReadNotification) {
      onReadNotification(notification.id);
    }
    
    // Содан кейін клик өңдеу
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  return (
    <Paper
      key={notification.id}
      sx={{
        mb: 2,
        p: 3,
        borderRadius: 2,
        backgroundColor: notification.read
          ? 'transparent' // Оқылған хабарландырулар үшін әдеттегі фон
          : alpha('#d50032', 0.05), // Оқылмаған хабарландырулар үшін ерекшеленген фон
        borderLeft: notification.read
          ? 'none'
          : `4px solid #d50032`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          boxShadow: theme.shadows[2],
          transform: 'translateY(-2px)',
          cursor: 'pointer',
        },
      }}
      onClick={handleClick}
    >
      {/* Хабарландыру тақырыбы */}
      <Typography
        variant="subtitle1"
        fontWeight={notification.read ? 'normal' : 'bold'} // Оқылмаған хабарландырулар қалың шрифтпен
        color={notification.read ? 'text.primary' : '#d50032'}
      >
        {notification.title}
      </Typography>
      
      {/* Хабарландыру мәтіні */}
      <Typography variant="body2" sx={{ my: 1 }}>
        {notification.message}
      </Typography>
      
      {/* Хабарландыру күні */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', textAlign: 'right' }}
      >
        {notification.date}
      </Typography>
    </Paper>
  );
};

export default NotificationItem;