import React from 'react';
import {
  Box,
  Typography,
  List,
  useTheme,
} from '@mui/material';
import { NotificationsActive as NotificationsIcon } from '@mui/icons-material';

// Импорт подкомпонентов
import NotificationItem from './NotificationItem';
import EmptyState from '../common/EmptyState';

/**
 * NotificationsList компоненті - пайдаланушы хабарламаларын көрсету 
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {Array} props.notifications - Хабарламалар тізімі
 * @param {Function} props.onReadNotification - Хабарламаны оқылды деп белгілеу функциясы
 */
const NotificationsList = ({ notifications, onReadNotification }) => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Хабарламалар
      </Typography>
      
      {notifications.length > 0 ? (
        <List>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onReadNotification={onReadNotification}
            />
          ))}
        </List>
      ) : (
        <EmptyNotificationsState />
      )}
    </Box>
  );
};

/**
 * Хабарламалар жоқ күйі компоненті
 */
const EmptyNotificationsState = () => {
  return (
    <EmptyState
      icon={<NotificationsIcon />}
      title="Сізде хабарламалар жоқ"
    />
  );
};

export default NotificationsList;