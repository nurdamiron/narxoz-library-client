/**
 * src/components/notifications/NotificationMenu.jsx
 * 
 * Хабарлама менюі компоненті
 * 
 * Бұл компонент кіріс хабарламалар менюін көрсетеді, соңғы хабарламаларды
 * көрсетеді және оларды оқылды деп белгілеу функционалын қамтамасыз етеді.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
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
  ListSubheader,
  Avatar,
  Tooltip,
  Paper,
  alpha,
  useTheme
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
  DoneAll as DoneAllIcon,
  ArrowForward as ArrowForwardIcon,
  Circle as CircleIcon
} from '@mui/icons-material';

// Импорт хуков
import useNotifications from '../../hooks/useNotifications';
import { useToast } from '../../context/ToastContext';
import { formatDateTime, truncateString } from '../../utils';

/**
 * NotificationMenu компоненті
 * 
 * @returns {JSX.Element} - Хабарлама менюі
 */
const NotificationMenu = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useTranslation();
  
  const { 
    notifications, 
    unreadCount, 
    loading, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();
  const { success, error: showError } = useToast();
  
  // Менюдің күйі
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [markingAsRead, setMarkingAsRead] = useState(false);
  const [recentlyRead, setRecentlyRead] = useState([]);
  
  // Соңғы 5 хабарламаны алу
  const recentNotifications = notifications.slice(0, 5);
  
  /**
   * Хабарламалар жүктелген кезде кешіктіру эффектін баптау
   */
  useEffect(() => {
    if (open && !loading) {
      const timer = setTimeout(() => {
        setRecentlyRead([]);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [open, loading]);
  
  /**
   * Менюді ашу
   * 
   * @param {Object} event - Оқиға объектісі
   */
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
    // Менюді ашқан кезде жаңа хабарламаларды жүктеу
    fetchNotifications();
  };
  
  /**
   * Менюді жабу
   */
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  /**
   * Барлық хабарламаларды оқылды деп белгілеу
   */
  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAsRead(true);
      await markAllAsRead();
      success(t('notifications.markAllReadSuccess', 'Барлық хабарламалар оқылды деп белгіленді'));
    } catch (err) {
      console.error(t('notifications.markAllReadErrorLog', 'Хабарламаларды белгілеу қатесі:'), err);
      showError(t('notifications.markAllReadError', 'Хабарламаларды оқылды деп белгілеу кезінде қате орын алды'));
    } finally {
      setMarkingAsRead(false);
    }
  };
  
  /**
   * Бір хабарламаны оқылды деп белгілеу
   * 
   * @param {string} id - Хабарлама идентификаторы
   * @param {Object} event - Оқиға объектісі
   */
  const handleMarkAsRead = async (id, event) => {
    event.stopPropagation(); // Хабарлама бетіне өтпеу
    
    try {
      await markAsRead(id);
      // Жаңа оқылған хабарламаларға қосу (анимация үшін)
      setRecentlyRead(prev => [...prev, id]);
      
      // 2 секундтан кейін тізімнен алып тастау
      setTimeout(() => {
        setRecentlyRead(prev => prev.filter(itemId => itemId !== id));
      }, 2000);
      
      success(t('notifications.markReadSuccess', 'Хабарлама оқылды деп белгіленді'));
    } catch (err) {
      console.error(t('notifications.markReadErrorLog', 'Хабарламаны белгілеу қатесі:'), err);
      showError(t('notifications.markReadError', 'Хабарламаны оқылды деп белгілеу кезінде қате орын алды'));
    }
  };
  
  /**
   * Хабарламалар бетіне өту
   */
  const handleGoToNotifications = () => {
    handleCloseMenu();
    navigate('/notifications');
  };
  
  /**
   * Хабарлама типіне сәйкес иконка алу
   * 
   * @param {string} type - Хабарлама типі
   * @returns {JSX.Element} - Иконка
   */
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'info':
        return { 
          icon: <InfoIcon fontSize="small" />, 
          color: theme.palette.info.main,
          bgColor: alpha(theme.palette.info.main, 0.1)
        };
      case 'warning':
        return { 
          icon: <WarningIcon fontSize="small" />, 
          color: theme.palette.warning.main,
          bgColor: alpha(theme.palette.warning.main, 0.1)
        };
      case 'overdue':
        return { 
          icon: <ErrorIcon fontSize="small" />, 
          color: theme.palette.error.main,
          bgColor: alpha(theme.palette.error.main, 0.1)
        };
      case 'return':
        return { 
          icon: <ScheduleIcon fontSize="small" />, 
          color: theme.palette.warning.main,
          bgColor: alpha(theme.palette.warning.main, 0.1)
        };
      case 'system':
        return { 
          icon: <SettingsIcon fontSize="small" />, 
          color: theme.palette.primary.main,
          bgColor: alpha(theme.palette.primary.main, 0.1)
        };
      default:
        return { 
          icon: <NotificationsIcon fontSize="small" />, 
          color: theme.palette.primary.main,
          bgColor: alpha(theme.palette.primary.main, 0.1)
        };
    }
  };
  
  // Анимация варианттары
  const menuItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0, 
      y: 10,
      transition: {
        duration: 0.2
      }
    }
  };
  
  const loadingVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <>
      <Tooltip title={t('notifications.title', 'Хабарламалар')}>
        <IconButton
          color="inherit"
          onClick={handleOpenMenu}
          aria-label={t('notifications.show', 'Хабарламаларды көрсету')}
          sx={{
            position: 'relative',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        >
          <Badge 
            badgeContent={unreadCount} 
            color="error"
            overlap="circular"
            sx={{
              '& .MuiBadge-badge': {
                fontWeight: 'bold',
                animation: unreadCount > 0 ? 'pulse 1.5s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': {
                    transform: 'scale(1)',
                    boxShadow: '0 0 0 0 rgba(211, 47, 47, 0.7)'
                  },
                  '70%': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 0 0 6px rgba(211, 47, 47, 0)'
                  },
                  '100%': {
                    transform: 'scale(1)',
                    boxShadow: '0 0 0 0 rgba(211, 47, 47, 0)'
                  }
                }
              }
            }}
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      
      <Menu
        id="notification-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': 'notification-button',
        }}
        PaperProps={{
          elevation: 4,
          sx: { 
            width: 360, 
            maxHeight: 500,
            borderRadius: 2,
            overflow: 'hidden',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transitionDuration={250}
      >
        <ListSubheader 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            bgcolor: 'background.paper',
            py: 1.5,
            px: 2
          }}
        >
          <Typography variant="subtitle1" fontWeight="medium">
            {t('notifications.title', 'Хабарламалар')} {unreadCount > 0 && (
              <Box 
                component="span" 
                sx={{ 
                  color: 'error.main',
                  fontWeight: 'bold'
                }}
              >
                ({unreadCount})
              </Box>
            )}
          </Typography>
          
          {unreadCount > 0 && (
            <Button 
              size="small" 
              onClick={handleMarkAllAsRead}
              disabled={markingAsRead}
              startIcon={markingAsRead ? <CircularProgress size={16} /> : <DoneAllIcon />}
              variant="outlined"
              color="primary"
              sx={{
                borderRadius: 4,
                px: 1.5,
                py: 0.5,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                '&:hover': {
                  border: `1px solid ${theme.palette.primary.main}`,
                  backgroundColor: alpha(theme.palette.primary.main, 0.04)
                }
              }}
            >
              {t('notifications.markAllAsRead', 'Барлығын оқылды деп белгілеу')}
            </Button>
          )}
        </ListSubheader>
        
        <Divider />
        
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              variants={loadingVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress size={32} />
              </Box>
            </motion.div>
          ) : recentNotifications.length === 0 ? (
            <motion.div
              key="empty"
              variants={loadingVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <EmptyNotificationIcon 
                  sx={{ 
                    fontSize: 60, 
                    color: alpha(theme.palette.text.secondary, 0.7), 
                    mb: 2 
                  }} 
                />
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {t('notifications.noNotifications', 'Сізде хабарламалар жоқ')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('notifications.newNotifications', 'Жаңа хабарламалар осы жерде көрсетіледі')}
                </Typography>
              </Box>
            </motion.div>
          ) : (
            <motion.div
              key="notifications"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <List 
                dense 
                sx={{ 
                  width: '100%', 
                  p: 0,
                  maxHeight: 350,
                  overflowY: 'auto'
                }}
              >
                <AnimatePresence initial={false}>
                  {recentNotifications.map((notification, index) => {
                    const { icon, color, bgColor } = getNotificationIcon(notification.type);
                    const isRecentlyRead = recentlyRead.includes(notification.id);
                    
                    return (
                      <motion.div
                        key={notification.id}
                        variants={menuItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ delay: index * 0.05 }}
                      >
                        <ListItem 
                          disablePadding
                          secondaryAction={
                            !notification.read && !isRecentlyRead && (
                              <IconButton
                                edge="end"
                                aria-label={t('notifications.markAsRead', 'Оқылды деп белгілеу')}
                                onClick={(e) => handleMarkAsRead(notification.id, e)}
                                sx={{
                                  mr: 1,
                                  color: theme.palette.primary.main,
                                  '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1)
                                  }
                                }}
                              >
                                <Tooltip title={t('notifications.markAsRead', 'Оқылды деп белгілеу')}>
                                  <DoneIcon fontSize="small" />
                                </Tooltip>
                              </IconButton>
                            )
                          }
                          sx={{
                            bgcolor: notification.read ? 'inherit' : alpha(theme.palette.primary.main, 0.04),
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'background-color 0.3s',
                            '&:hover': {
                              bgcolor: notification.read ? alpha(theme.palette.action.hover, 0.5) : alpha(theme.palette.primary.main, 0.08)
                            },
                            // Анимация для недавно прочитанных уведомлений
                            ...(isRecentlyRead && {
                              bgcolor: alpha(theme.palette.success.light, 0.2),
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: `linear-gradient(90deg, ${alpha(theme.palette.success.light, 0)}, ${alpha(theme.palette.success.light, 0.4)}, ${alpha(theme.palette.success.light, 0)})`,
                                animation: 'sweep 1.5s ease-in-out',
                                '@keyframes sweep': {
                                  '0%': {
                                    transform: 'translateX(-100%)'
                                  },
                                  '100%': {
                                    transform: 'translateX(100%)'
                                  }
                                }
                              }
                            })
                          }}
                        >
                          <ListItemButton 
                            onClick={handleGoToNotifications}
                            sx={{ 
                              py: 1.5,
                              pl: 2
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                backgroundColor: bgColor,
                                color: color,
                                mr: 2
                              }}
                            >
                              {icon}
                            </Avatar>
                            
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}
                                  >
                                    {truncateString(notification.title, 30)}
                                  </Typography>
                                  
                                  {!notification.read && !isRecentlyRead && (
                                    <CircleIcon 
                                      sx={{ 
                                        ml: 1, 
                                        fontSize: 8, 
                                        color: theme.palette.primary.main 
                                      }} 
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
                                    sx={{ 
                                      display: 'block',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      maxWidth: '100%',
                                      mb: 0.5,
                                      opacity: notification.read ? 0.8 : 1
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
                        <Divider component="li" />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </List>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Box
          sx={{
            p: 1,
            bgcolor: alpha(theme.palette.background.paper, 0.8)
          }}
        >
          <Button
            fullWidth
            endIcon={<ArrowForwardIcon />}
            onClick={handleGoToNotifications}
            sx={{
              py: 1,
              borderRadius: 2,
              fontWeight: 'medium'
            }}
          >
            {t('notifications.viewAllNotifications', 'Барлық хабарламаларды көру')}
          </Button>
        </Box>
      </Menu>
    </>
  );
};

export default NotificationMenu;