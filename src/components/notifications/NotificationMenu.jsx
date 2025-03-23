// src/components/notifications/NotificationMenu.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListSubheader
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  Settings as SettingsIcon,
  NotificationsNone as EmptyNotificationIcon,
  Done as DoneIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';

// Импорт хуков
import useNotifications from '../../hooks/useNotifications';
import { useToast } from '../../context/ToastContext'; // Исправлено с default на именованный импорт
import { formatDateTime, truncateString } from '../../utils';

const NotificationMenu = () => {
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    loading, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();
  const { success, error } = useToast();
  
  // Состояние для меню
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [markingAsRead, setMarkingAsRead] = useState(false);
  
  // Получаем только 5 последних уведомлений для меню
  const recentNotifications = notifications.slice(0, 5);
  
  // Открытие меню
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Закрытие меню
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  // Отметить все как прочитанные
  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAsRead(true);
      await markAllAsRead();
      success('Барлық хабарламалар оқылды деп белгіленді');
    } catch (err) {
      console.error('Ошибка при маркировке уведомлений:', err);
      error('Хабарламаларды оқылды деп белгілеу кезінде қате орын алды');
    } finally {
      setMarkingAsRead(false);
    }
  };
  
  // Отметить одно уведомление как прочитанное
  const handleMarkAsRead = async (id, event) => {
    event.stopPropagation(); // Предотвращаем открытие страницы уведомлений
    
    try {
      await markAsRead(id);
    } catch (err) {
      console.error('Ошибка при маркировке уведомления:', err);
      error('Хабарламаны оқылды деп белгілеу кезінде қате орын алды');
    }
  };
  
  // Переход на страницу уведомлений
  const handleGoToNotifications = () => {
    handleCloseMenu();
    navigate('/notifications');
  };
  
  // Получение иконки для типа уведомления
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'info':
        return <InfoIcon color="info" fontSize="small" />;
      case 'warning':
        return <WarningIcon color="warning" fontSize="small" />;
      case 'overdue':
        return <ErrorIcon color="error" fontSize="small" />;
      case 'return':
        return <ScheduleIcon color="warning" fontSize="small" />;
      case 'system':
        return <SettingsIcon color="primary" fontSize="small" />;
      default:
        return <NotificationsIcon fontSize="small" />;
    }
  };
  
  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleOpenMenu}
        aria-label="Показать уведомления"
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      
      <Menu
        id="notification-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': 'notification-button',
        }}
        PaperProps={{
          elevation: 3,
          sx: { width: 320, maxHeight: 500 }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <ListSubheader 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            bgcolor: 'background.paper'
          }}
        >
          <Typography variant="subtitle1">
            Хабарламалар {unreadCount > 0 && `(${unreadCount})`}
          </Typography>
          
          {unreadCount > 0 && (
            <Button 
              size="small" 
              onClick={handleMarkAllAsRead}
              disabled={markingAsRead}
              startIcon={markingAsRead ? <CircularProgress size={16} /> : <DoneIcon />}
            >
              Барлығын оқу
            </Button>
          )}
        </ListSubheader>
        
        <Divider />
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : recentNotifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <EmptyNotificationIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Сізде хабарламалар жоқ
            </Typography>
          </Box>
        ) : (
          <List dense sx={{ width: '100%', p: 0 }}>
            {recentNotifications.map((notification) => (
              <ListItem 
                key={notification.id}
                disablePadding
                secondaryAction={
                  !notification.read && (
                    <IconButton
                      edge="end"
                      aria-label="оқылды деп белгілеу"
                      onClick={(e) => handleMarkAsRead(notification.id, e)}
                    >
                      <DoneIcon fontSize="small" />
                    </IconButton>
                  )
                }
                sx={{
                  bgcolor: notification.read ? 'inherit' : 'action.hover'
                }}
              >
                <ListItemButton onClick={handleGoToNotifications}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={truncateString(notification.title, 30)}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                          sx={{ 
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '100%'
                          }}
                        >
                          {truncateString(notification.message, 50)}
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
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
        
        <Divider />
        
        <MenuItem onClick={handleGoToNotifications}>
          <Typography variant="body1" sx={{ width: '100%', textAlign: 'center' }}>
            Барлық хабарламаларды көру
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default NotificationMenu;