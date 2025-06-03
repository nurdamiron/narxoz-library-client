import React from 'react';
import {
  Box,
  Typography,
  List,
  useTheme,
} from '@mui/material';
import { NotificationsActive as NotificationsIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

// Импорт подкомпонентов
import NotificationItem from './NotificationItem';
import EmptyState from '../common/EmptyState';

/**
 * NotificationsList компоненті - пайдаланушы хабарламаларын көрсету 
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {Array} props.notifications - Хабарламалар тізімі
 * @param {Function} props.onReadNotification - Хабарламаны оқылды деп белгілеу функциясы
 * @param {Function} props.onNotificationClick - Хабарламаға клик өңдеу функциясы
 */
const NotificationsList = ({ notifications, onReadNotification, onNotificationClick }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {t('notifications.title', 'Хабарламалар')}
      </Typography>
      
      {notifications.length > 0 ? (
        <List>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onReadNotification={onReadNotification}
              onNotificationClick={onNotificationClick}
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
  const { t } = useTranslation();
  return (
    <EmptyState
      icon={<NotificationsIcon />}
      title={t('notifications.noNotifications', 'Сізде хабарламалар жоқ')}
    />
  );
};

export default NotificationsList;