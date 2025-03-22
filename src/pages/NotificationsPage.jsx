// src/pages/NotificationsPage.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Paper,
  Button,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Backdrop
} from '@mui/material';
import {
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Delete as DeleteIcon,
  Markunread as UnreadIcon,
  Done as ReadIcon
} from '@mui/icons-material';

// Импорт хуков и сервисов
import useNotifications  from '../hooks/useNotifications';
import { useToast } from '../context/ToastContext';
import { formatDateTime } from '../utils';

const NotificationsPage = () => {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    error, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();
  const { success, error: showError } = useToast();
  
  const [deleting, setDeleting] = useState(false);

  // Обработчик маркировки уведомления как прочитанного
  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      success('Хабарлама оқылды деп белгіленді');
    } catch (err) {
      console.error('Ошибка при маркировке уведомления:', err);
      showError('Хабарламаны оқылды деп белгілеу кезінде қате орын алды');
    }
  };

  // Обработчик маркировки всех уведомлений как прочитанных
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      success('Барлық хабарламалар оқылды деп белгіленді');
    } catch (err) {
      console.error('Ошибка при маркировке всех уведомлений:', err);
      showError('Барлық хабарламаларды оқылды деп белгілеу кезінде қате орын алды');
    }
  };

  // Обработчик удаления уведомления
  const handleDeleteNotification = async (id) => {
    try {
      setDeleting(true);
      await deleteNotification(id);
      success('Хабарлама жойылды');
    } catch (err) {
      console.error('Ошибка при удалении уведомления:', err);
      showError('Хабарламаны жою кезінде қате орын алды');
    } finally {
      setDeleting(false);
    }
  };

  // Получение иконки и цвета для типа уведомления
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'info':
        return { icon: <InfoIcon color="info" />, color: 'info' };
      case 'warning':
        return { icon: <WarningIcon color="warning" />, color: 'warning' };
      case 'overdue':
        return { icon: <ErrorIcon color="error" />, color: 'error' };
      case 'return':
        return { icon: <ScheduleIcon color="warning" />, color: 'warning' };
      case 'system':
        return { icon: <SettingsIcon color="primary" />, color: 'primary' };
      default:
        return { icon: <NotificationsIcon />, color: 'default' };
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <Container sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Хабарламалар {unreadCount > 0 && `(${unreadCount} оқылмаған)`}
          </Typography>
          
          {notifications.length > 0 && (
            <Button 
              variant="outlined" 
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              Барлығын оқылды деп белгілеу
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {notifications.length === 0 ? (
          <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6">
              Хабарламалар жоқ
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Сізде әзірге хабарламалар жоқ
            </Typography>
          </Paper>
        ) : (
          <Paper elevation={2}>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {notifications.map((notification, index) => {
                const { icon, color } = getNotificationIcon(notification.type);
                
                return (
                  <React.Fragment key={notification.id}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        backgroundColor: notification.read ? 'inherit' : 'action.hover',
                        transition: 'background-color 0.3s'
                      }}
                    >
                      <ListItemIcon>
                        {icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" component="span">
                              {notification.title}
                            </Typography>
                            {!notification.read && (
                              <Chip 
                                label="Жаңа" 
                                color="primary" 
                                size="small" 
                                variant="outlined"
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                              sx={{ display: 'block', my: 1 }}
                            >
                              {notification.message}
                            </Typography>
                            <Typography
                              component="span"
                              variant="caption"
                              color="text.secondary"
                            >
                              {formatDateTime(notification.createdAt)}
                            </Typography>
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        {!notification.read && (
                          <IconButton 
                            edge="end" 
                            onClick={() => handleMarkAsRead(notification.id)}
                            title="Оқылды деп белгілеу"
                          >
                            <ReadIcon />
                          </IconButton>
                        )}
                        <IconButton 
                          edge="end" 
                          onClick={() => handleDeleteNotification(notification.id)}
                          title="Жою"
                          sx={{ ml: 1 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < notifications.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                );
              })}
            </List>
          </Paper>
        )}
      </Container>

      {/* Индикатор загрузки при удалении */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={deleting}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </motion.div>
  );
};

export default NotificationsPage;