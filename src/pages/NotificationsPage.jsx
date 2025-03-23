/**
 * src/pages/NotificationsPage.jsx
 * 
 * Хабарламалар беті
 * 
 * Бұл компонент пайдаланушы хабарламаларын көрсетеді және басқарады.
 * Әр түрлі типтегі хабарламаларды өңдеу, оқылды/оқылмады деп белгілеу 
 * және жою функционалын қамтамасыз етеді.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Backdrop,
  Tooltip,
  Badge,
  useTheme,
  useMediaQuery,
  alpha,
  Card,
  Tabs,
  Tab,
  Skeleton,
  Fade
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
  Done as ReadIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
  Inbox as InboxIcon
} from '@mui/icons-material';

// Хуктар мен сервистерді импорттау
import useNotifications from '../hooks/useNotifications';
import { useToast } from '../context/ToastContext';
import { formatDateTime } from '../utils';

/**
 * NotificationsPage компоненті - хабарламалар бетін көрсетеді
 * 
 * @returns {JSX.Element} - Хабарламалар беті
 */
const NotificationsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
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
  
  // Күйлер
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  
  /**
   * Хабарламаны оқылды деп белгілеу
   * 
   * @param {string|number} id - Хабарлама идентификаторы
   */
  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      success('Хабарлама оқылды деп белгіленді');
    } catch (err) {
      console.error('Хабарламаны белгілеу қатесі:', err);
      showError('Хабарламаны оқылды деп белгілеу кезінде қате орын алды');
    }
  };

  /**
   * Барлық хабарламаларды оқылды деп белгілеу
   */
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      success('Барлық хабарламалар оқылды деп белгіленді');
    } catch (err) {
      console.error('Барлық хабарламаларды белгілеу қатесі:', err);
      showError('Барлық хабарламаларды оқылды деп белгілеу кезінде қате орын алды');
    }
  };

  /**
   * Хабарламаны жою
   * 
   * @param {string|number} id - Хабарлама идентификаторы
   */
  const handleDeleteNotification = async (id) => {
    try {
      setDeleting(true);
      await deleteNotification(id);
      success('Хабарлама жойылды');
    } catch (err) {
      console.error('Хабарламаны жою қатесі:', err);
      showError('Хабарламаны жою кезінде қате орын алды');
    } finally {
      setDeleting(false);
    }
  };
  
  /**
   * Хабарламаларды жаңарту
   */
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchNotifications();
      success('Хабарламалар жаңартылды');
    } catch (err) {
      console.error('Хабарламаларды жаңарту қатесі:', err);
      showError('Хабарламаларды жаңарту кезінде қате орын алды');
    } finally {
      setRefreshing(false);
    }
  };
  
  /**
   * Таб өзгерісін өңдеу
   */
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  /**
   * Хабарлама түрі бойынша иконка мен түсті алу
   * 
   * @param {string} type - Хабарлама түрі
   * @returns {Object} - Иконка мен түс
   */
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'info':
        return { 
          icon: <InfoIcon color="info" />, 
          color: 'info',
          background: alpha(theme.palette.info.main, 0.12)
        };
      case 'warning':
        return { 
          icon: <WarningIcon color="warning" />, 
          color: 'warning',
          background: alpha(theme.palette.warning.main, 0.12)
        };
      case 'overdue':
        return { 
          icon: <ErrorIcon color="error" />, 
          color: 'error',
          background: alpha(theme.palette.error.main, 0.12)
        };
      case 'return':
        return { 
          icon: <ScheduleIcon color="warning" />, 
          color: 'warning',
          background: alpha(theme.palette.warning.main, 0.12)
        };
      case 'system':
        return { 
          icon: <SettingsIcon color="primary" />, 
          color: 'primary',
          background: alpha(theme.palette.primary.main, 0.12)
        };
      default:
        return { 
          icon: <NotificationsIcon color="action" />, 
          color: 'default',
          background: alpha(theme.palette.grey[500], 0.12)
        };
    }
  };
  
  // Хабарламаларды сүзгілеу
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 0) return true; // Барлық хабарламалар
    if (activeTab === 1) return !notification.read; // Оқылмаған хабарламалар
    if (activeTab === 2) return notification.read; // Оқылған хабарламалар
    return true;
  });
  
  // Жүктелу күйі
  if (loading && notifications.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width={300} height={60} />
          <Skeleton variant="text" width={200} height={40} sx={{ mt: 1 }} />
        </Box>
        
        <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1, mb: 2 }}/>
        
        {[1, 2, 3].map((item) => (
          <Skeleton 
            key={item} 
            variant="rectangular" 
            height={120} 
            sx={{ borderRadius: 2, mb: 2 }}
          />
        ))}
      </Container>
    );
  }
  
  // Анимация конфигурациясы
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Тақырып және функционалдық батырмалар */}
        <Box 
          sx={{ 
            mb: 3, 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: { xs: 2, sm: 0 }
          }}
        >
          <Box>
            <Typography 
              variant="h4" 
              component="h1"
              sx={{ fontWeight: 'bold' }}
            >
              Хабарламалар
            </Typography>
            
            {unreadCount > 0 && (
              <Typography 
                variant="subtitle1" 
                color="primary"
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: 'medium'
                }}
              >
                <Badge 
                  badgeContent={unreadCount} 
                  color="primary"
                  sx={{ mr: 1 }}
                >
                  <UnreadIcon fontSize="small" />
                </Badge>
                {unreadCount} оқылмаған хабарлама
              </Typography>
            )}
          </Box>
          
          {/* Функционалдық батырмалар */}
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 1,
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            <Tooltip title="Жаңарту">
              <IconButton 
                onClick={handleRefresh}
                disabled={refreshing}
                color="primary"
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  }
                }}
              >
                {refreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
              </IconButton>
            </Tooltip>
            
            {notifications.length > 0 && (
              <Button 
                variant="outlined" 
                color="primary"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
                startIcon={<CheckCircleIcon />}
                fullWidth={isMobile}
              >
                Барлығын оқылды деп белгілеу
              </Button>
            )}
          </Box>
        </Box>

        {/* Қате хабарламасы */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2 
            }}
          >
            {error}
          </Alert>
        )}
        
        {/* Таб панелі */}
        {notifications.length > 0 && (
          <Paper 
            elevation={2} 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant={isMobile ? "fullWidth" : "standard"}
              centered={!isMobile}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab 
                label={`Барлығы (${notifications.length})`}
                icon={<NotificationsIcon />}
                iconPosition="start"
              />
              <Tab 
                label={`Оқылмаған (${unreadCount})`}
                icon={<UnreadIcon />}
                iconPosition="start"
                disabled={unreadCount === 0}
              />
              <Tab 
                label={`Оқылған (${notifications.length - unreadCount})`}
                icon={<ReadIcon />}
                iconPosition="start"
                disabled={notifications.length - unreadCount === 0}
              />
            </Tabs>
          </Paper>
        )}

        {/* Хабарламалар тізімі */}
        {notifications.length === 0 ? (
          <Card 
            elevation={2} 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              borderRadius: 3,
              bgcolor: alpha(theme.palette.background.paper, 0.7),
              backdropFilter: 'blur(5px)'
            }}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.grey[200], 0.5),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                mx: 'auto'
              }}
            >
              <NotificationsIcon 
                sx={{ 
                  fontSize: 60, 
                  color: alpha(theme.palette.text.secondary, 0.5),
                }}
              />
            </Box>
            
            <Typography 
              variant="h5"
              sx={{ fontWeight: 'bold', mb: 1 }}
            >
              Хабарламалар жоқ
            </Typography>
            
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ maxWidth: 400, mx: 'auto' }}
            >
              Сізде әзірге хабарламалар жоқ. Кітаптарды алғанда, мерзімі өткенде немесе жүйеде өзгерістер болғанда хабарламалар пайда болады.
            </Typography>
            
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ArrowBackIcon />}
              sx={{ mt: 3 }}
              onClick={() => window.history.back()}
            >
              Артқа қайту
            </Button>
          </Card>
        ) : (
          <AnimatePresence>
            {filteredNotifications.length === 0 ? (
              <Fade in={true} timeout={500}>
                <Alert 
                  severity="info" 
                  sx={{ 
                    borderRadius: 2,
                    p: 2
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                    Бұл санатта хабарламалар жоқ
                  </Typography>
                  <Typography variant="body2">
                    Басқа санатты таңдаңыз немесе хабарламаларды жаңартыңыз
                  </Typography>
                </Alert>
              </Fade>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredNotifications.map((notification, index) => {
                  const { icon, color, background } = getNotificationIcon(notification.type);
                  
                  return (
                    <motion.div
                      key={notification.id}
                      variants={itemVariants}
                      exit="exit"
                      layout
                    >
                      <Card 
                        elevation={1} 
                        sx={{ 
                          mb: 2, 
                          borderRadius: 2,
                          overflow: 'hidden',
                          transition: 'all 0.2s',
                          borderLeft: `4px solid ${theme.palette[color].main}`,
                          bgcolor: notification.read ? 'transparent' : alpha(theme.palette[color].light, 0.05),
                          '&:hover': {
                            boxShadow: theme.shadows[3],
                          }
                        }}
                      >
                        <Box sx={{ position: 'relative' }}>
                          {/* Индикатор жаңа хабарламасы */}
                          {!notification.read && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 16,
                                right: 16,
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: theme.palette.primary.main,
                                zIndex: 1
                              }}
                            />
                          )}
                          
                          <ListItem
                            alignItems="flex-start"
                            sx={{
                              p: { xs: 2, sm: 3 },
                              transition: 'background-color 0.3s'
                            }}
                          >
                            {/* Иконка */}
                            <ListItemIcon sx={{ mt: 0.5 }}>
                              <Avatar
                                sx={{
                                  bgcolor: background,
                                  color: theme.palette[color].main,
                                  borderRadius: 2,
                                  p: 1,
                                  width: 40,
                                  height: 40
                                }}
                              >
                                {icon}
                              </Avatar>
                            </ListItemIcon>
                            
                            {/* Хабарлама мәтіні */}
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <Typography 
                                    variant="subtitle1" 
                                    component="span"
                                    sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}
                                  >
                                    {notification.title}
                                  </Typography>
                                  
                                  {!notification.read && (
                                    <Chip 
                                      label="Жаңа" 
                                      color="primary" 
                                      size="small"
                                      sx={{
                                        height: 20,
                                        fontSize: '0.7rem',
                                        fontWeight: 'bold'
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
                                    sx={{ display: 'block', mb: 1 }}
                                  >
                                    {notification.message}
                                  </Typography>
                                  
                                  <Typography
                                    component="span"
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ fontWeight: 'medium' }}
                                  >
                                    {formatDateTime(notification.createdAt)}
                                  </Typography>
                                </>
                              }
                              sx={{ pr: { xs: 6, sm: 8 } }}
                            />
                            
                            {/* Әрекет түймелері */}
                            <ListItemSecondaryAction sx={{ top: 'auto', bottom: 16, right: 16 }}>
                              {!notification.read && (
                                <Tooltip title="Оқылды деп белгілеу">
                                  <IconButton 
                                    edge="end" 
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    color="primary"
                                    size="small"
                                    sx={{
                                      mr: 1,
                                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                                      '&:hover': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                      }
                                    }}
                                  >
                                    <ReadIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                              
                              <Tooltip title="Жою">
                                <IconButton 
                                  edge="end" 
                                  onClick={() => handleDeleteNotification(notification.id)}
                                  color="error"
                                  size="small"
                                  sx={{
                                    bgcolor: alpha(theme.palette.error.main, 0.05),
                                    '&:hover': {
                                      bgcolor: alpha(theme.palette.error.main, 0.1),
                                    }
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </ListItemSecondaryAction>
                          </ListItem>
                        </Box>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </Container>

      {/* Жою кезіндегі жүктелу индикаторы */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={deleting}
      >
        <Paper
          elevation={4}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 3,
            borderRadius: 2
          }}
        >
          <CircularProgress color="primary" sx={{ mb: 2 }} />
          <Typography variant="body2">Хабарлама жойылуда...</Typography>
        </Paper>
      </Backdrop>
    </motion.div>
  );
};

// Хабарлама аватарын көрсету компоненті
const Avatar = ({ children, sx, ...props }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...sx
    }}
    {...props}
  >
    {children}
  </Box>
);

export default NotificationsPage;