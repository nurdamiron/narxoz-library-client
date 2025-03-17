import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  useTheme,
  alpha,
} from '@mui/material';
import { NotificationsActive as NotificationsIcon } from '@mui/icons-material';
import EmptyState from '../common/EmptyState';

/**
 * NotificationsList component displays the user's notifications
 * 
 * @param {Object} props - Component props
 * @param {Array} props.notifications - List of notifications
 * @param {Function} props.onReadNotification - Function to mark a notification as read
 */
const NotificationsList = ({ notifications, onReadNotification }) => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Уведомления
      </Typography>
      
      {notifications.length > 0 ? (
        <List>
          {/* Хабарландырулар тізімі */}
          {notifications.map((notification) => (
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
              onClick={() => onReadNotification(notification.id)}
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
          ))}
        </List>
      ) : (
        <EmptyState
          icon={<NotificationsIcon />}
          title="У вас нет уведомлений"
        />
      )}
    </Box>
  );
};

export default NotificationsList;