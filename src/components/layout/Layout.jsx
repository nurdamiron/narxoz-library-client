/**
 * src/components/layout/Layout.jsx
 * 
 * Қолданбаның негізгі макет компоненті
 * 
 * Бұл компонент жалпы қолданба макетін қамтамасыз етеді: жоғарғы тақырып,
 * бүйірлік мәзір, футер және негізгі мазмұнды орналастыруды басқарады.
 * Әр түрлі құрылғыларға бейімделу функциясы қосылған.
 */
import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Container,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Tooltip,
  useMediaQuery,
  useTheme,
  alpha,
  Fade,
  Grow,
  Paper,
  ListItemButton
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  LibraryBooks as LibraryIcon,
  Bookmark as BookmarkIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  HowToReg as RegisterIcon,
  Notifications as NotificationsIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Settings as SettingsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// Импорт компонентов и хуков
// import Sidebar from '../common/Sidebar';
import NotificationMenu from '../notifications/NotificationMenu';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getAvatarUrl } from '../../utils';

/**
 * Layout компоненті - қолданбаның негізгі макеті
 * 
 * @param {Object} props - Компонент параметрлері
 * @returns {JSX.Element} - Орналасу компоненті
 */
const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, stats } = useAuth();
  const { success } = useToast();
  const { t } = useTranslation();
  
  // Күйлер
  // const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Бүйірлік мәзірді ашу/жабу
  // const toggleSidebar = () => {
  //   setSidebarOpen(!sidebarOpen);
  // };
  
  // Мобильді мәзірді ашу/жабу
  const handleMobileDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };
  
  // Пайдаланушы мәзірін ашу
  const handleOpenUserMenu = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };
  
  // Пайдаланушы мәзірін жабу
  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null);
  };
  
  // Жүйеден шығу
  const handleLogout = async () => {
    handleCloseUserMenu();
    await logout();
    success(t('auth.logoutSuccess'));
    navigate('/');
  };
  
  // Белсенді маршрутты тексеру
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  // Беттің айналдыру күйін бақылау
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Мәзір элементтері
  const menuItems = [
    { text: t('common.home'), icon: <HomeIcon />, path: '/' },
    { text: t('books.catalog'), icon: <LibraryIcon />, path: '/books' },
    { text: t('events.title'), icon: <EventIcon />, path: '/events' },
    { text: t('bookmarks.title'), icon: <BookmarkIcon />, path: '/bookmarks', auth: true },
    { text: t('borrowHistory.title'), icon: <HistoryIcon />, path: '/borrows', auth: true },
    { text: t('events.myEvents.title'), icon: <EventIcon />, path: '/my-events', auth: true },
    { text: t('admin.dashboard'), icon: <SettingsIcon />, path: '/admin', auth: true, adminOnly: true },
  ];
  
  // Анимация конфигурациясы
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };
  
  // Мобильді құрылғылардың бүйірлік мәзірі
  const mobileDrawer = (
    <Box
      sx={{ 
        width: 280,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      role="presentation"
    >
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: alpha(theme.palette.primary.main, 0.03),
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            alt="Нархоз"
            src="/images/narxoz-logo.png"
            variant="rounded"
            sx={{ 
              width: 32, 
              height: 32, 
              mr: 1.5,
              bgcolor: theme.palette.primary.main
            }}
          >
            
          </Avatar>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('common.libraryName')}
          </Typography>
        </Box>
        
        <IconButton onClick={handleMobileDrawerToggle}>
          <MenuIcon />
        </IconButton>
      </Box>
      
      <Divider />
      
      {/* Пайдаланушы ақпараты */}
      {isAuthenticated && user && (
        <>
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              bgcolor: alpha(theme.palette.primary.main, 0.03),
            }}
          >
            <Avatar
              alt={user?.name}
              src={getAvatarUrl(user?.avatar)}
              sx={{ 
                width: 40, 
                height: 40,
                mr: 2,
                border: `2px solid ${theme.palette.primary.main}`,
              }}
            />
            <Box>
              <Typography variant="subtitle1" fontWeight="medium">
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.role === 'admin' ? (
                  <Box component="span" sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: theme.palette.error.main, 
                    fontWeight: 'medium' 
                  }}>
                    {t('common.adminRole')} <Box 
                      component={RouterLink} 
                      to="/admin"
                      sx={{ 
                        ml: 1, 
                        fontSize: '0.75rem', 
                        bgcolor: theme.palette.error.main, 
                        color: 'white', 
                        px: 1, 
                        py: 0.25, 
                        borderRadius: 1,
                        textDecoration: 'none'
                      }}
                    >
                      {t('common.manage')}
                    </Box>
                  </Box>
                ) : user.role === 'moderator' ? (
                  <Box component="span" sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: theme.palette.warning.main, 
                    fontWeight: 'medium' 
                  }}>
                    {t('common.moderatorRole')} <Box 
                      component={RouterLink} 
                      to="/admin/books"
                      sx={{ 
                        ml: 1, 
                        fontSize: '0.75rem', 
                        bgcolor: theme.palette.warning.main, 
                        color: 'white', 
                        px: 1, 
                        py: 0.25, 
                        borderRadius: 1,
                        textDecoration: 'none'
                      }}
                    >
                      {t('common.manage')}
                    </Box>
                    <Typography variant="caption" display="block" sx={{ mt: 0.5, fontSize: '0.7rem' }}>
                      {t('common.moderatorInfo')}
                    </Typography>
                  </Box>
                ) : (user.role === 'librarian' ? t('common.librarianRole') : t('common.readerRole'))}
              </Typography>
            </Box>
          </Box>
          <Divider />
        </>
      )}
      
      {/* Негізгі мәзір */}
      <List sx={{ flexGrow: 1, px: 1 }}>
        {menuItems.map((item) => (
          // Авторизация қажет болса және пайдаланушы авторизацияланбаса, жасыру
          (!item.auth || (item.auth && isAuthenticated)) && (
            <ListItem 
              key={item.text}
              disablePadding
              sx={{ mb: 0.5 }}
            >
              <ListItemButton
                component={RouterLink}
                to={item.path}
                selected={isActive(item.path)}
                onClick={handleMobileDrawerToggle}
                sx={{
                  borderRadius: 1.5,
                  py: 1.25,
                  '&.Mui-selected': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.12),
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(item.path) ? theme.palette.primary.main : 'inherit',
                    minWidth: 40
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive(item.path) ? 'bold' : 'normal',
                  }}
                />
                
                {/* Бейдж көрсету */}
                {item.path === '/bookmarks' && stats?.bookmarks > 0 && (
                  <Badge badgeContent={stats.bookmarks} color="primary" />
                )}
                {item.path === '/borrows' && stats?.activeborrows > 0 && (
                  <Badge badgeContent={stats.activeborrows} color={stats?.overdueborrows > 0 ? "error" : "primary"} />
                )}
              </ListItemButton>
            </ListItem>
          )
        ))}
      </List>
      
      <Divider />
      
      {/* Язык */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <LanguageSwitcher />
      </Box>
      
      {/* Авторизация/шығу */}
      <List sx={{ px: 1, py: 1 }}>
        {isAuthenticated ? (
          <>
            {/* Профиль и уведомления отключены в сайдбаре для экономии места */}
          </>
        ) : (
          <>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={RouterLink}
                to="/login"
                selected={isActive('/login')}
                onClick={handleMobileDrawerToggle}
                sx={{
                  borderRadius: 1.5,
                  py: 1.25,
                  '&.Mui-selected': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.12),
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive('/login') ? theme.palette.primary.main : 'inherit',
                    minWidth: 40
                  }}
                >
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText 
                  primary={t('common.login')}
                  primaryTypographyProps={{
                    fontWeight: isActive('/login') ? 'bold' : 'normal',
                  }}
                />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar 
        position="sticky" 
        elevation={scrolled ? 4 : 0}
        sx={{ 
          background: scrolled 
            ? theme.palette.primary.main 
            : theme.palette.primary.main,
          transition: 'all 0.3s',
        }}
      >
        <Toolbar sx={{ display: 'flex' }}>
          {/* Логотип и мобильное меню */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Мобильная кнопка меню */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleMobileDrawerToggle}
              sx={{ mr: 1, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Логотип и название */}
            <RouterLink
              to="/"
              style={{ 
                textDecoration: 'none', 
                color: 'inherit', 
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Avatar
                alt="Нархоз"
                src="/images/narxoz-logo.png"
                variant="rounded"
                sx={{ 
                  width: { xs: 32, md: 40 }, 
                  height: { xs: 32, md: 40 }, 
                  mr: 1.5,
                  transition: 'all 0.3s',
                  bgcolor: theme.palette.primary.main,
                  display: { xs: 'none', sm: 'flex' }
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  transition: 'all 0.3s',
                  display: 'inline-block',
                }}
              >
                {t('common.libraryName')}
              </Typography>
            </RouterLink>
          </Box>
          
          {/* Основное меню */}
          <Box sx={{ ml: { sm: 4, md: 6 }, display: { xs: 'none', md: 'flex' }, flexGrow: 1 }}>
            {menuItems.map((item) => (
              // Авторизация требуется и пользователь не авторизован - скрыть пункт меню
              // Админ-онли и пользователь не админ - скрыть пункт меню
              (!item.auth || (item.auth && isAuthenticated)) && 
              (!item.adminOnly || (item.adminOnly && user?.role === 'admin')) && (
                <Button 
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  color="inherit"
                  sx={{ 
                    mx: 0.75,
                    py: 1,
                    px: 1.5,
                    fontWeight: isActive(item.path) ? 'bold' : 'normal',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: isActive(item.path) ? 'translateX(-50%)' : 'translateX(-50%) scaleX(0)',
                      width: isActive(item.path) ? '80%' : '0%',
                      height: '3px',
                      bgcolor: 'white',
                      transition: 'all 0.3s ease',
                      borderRadius: '2px 2px 0 0',
                    },
                    '&:hover::after': {
                      transform: 'translateX(-50%) scaleX(1)',
                      width: '80%',
                    }
                  }}
                  startIcon={item.icon}
                >
                  {item.text}
                  
                  {/* Бейдж көрсету */}
                  {item.path === '/bookmarks' && stats?.bookmarks > 0 && (
                    <Badge
                      badgeContent={stats.bookmarks}
                      color="error"
                      sx={{ ml: 1 }}
                    />
                  )}
                  {item.path === '/borrows' && stats?.activeborrows > 0 && (
                    <Badge
                      badgeContent={stats.activeborrows}
                      color={stats?.overdueborrows > 0 ? "error" : "secondary"}
                      sx={{ ml: 1 }}
                    />
                  )}
                </Button>
              )
            ))}
          </Box>
          
          {/* Хабарламалар мен профиль */}
          <Box sx={{ flexGrow: { xs: 1, lg: 0 }, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            {/* Переключатель языка */}
            <LanguageSwitcher />
            
            {/* Хабарламалар (тек авторизацияланған пайдаланушылар үшін) */}
            {isAuthenticated && (
              <NotificationMenu />
            )}
            
            {/* Авторизация/профиль */}
            {isAuthenticated ? (
              <Box sx={{ position: 'relative' }}>
                <Tooltip title={t('profile.title')}>
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{ 
                      p: 0.5, 
                      ml: { xs: 1, sm: 2 },
                      border: `2px solid ${alpha(theme.palette.common.white, 0.3)}`,
                      transition: 'all 0.2s',
                      '&:hover': {
                        border: `2px solid ${alpha(theme.palette.common.white, 0.5)}`,
                      }
                    }}
                    aria-label={t('profile.title')}
                  >
                    <Avatar 
                      alt={user?.name} 
                      src={getAvatarUrl(user?.avatar)}
                      sx={{ 
                        width: { xs: 32, md: 38 }, 
                        height: { xs: 32, md: 38 } 
                      }}
                    />
                  </IconButton>
                </Tooltip>
                
                <Menu
                  id="menu-appbar"
                  anchorEl={userMenuAnchor}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleCloseUserMenu}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                      mt: 1.5,
                      borderRadius: 2,
                      minWidth: 220,
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  TransitionComponent={Fade}
                >
                  {/* Пайдаланушы ақпараты */}
                  <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {user?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email}
                    </Typography>
                    {user?.role === 'admin' && (
                      <Button
                        component={RouterLink}
                        to="/admin"
                        size="small"
                        variant="contained"
                        color="error"
                        sx={{ mt: 1, fontSize: '0.75rem' }}
                      >
                        {t('admin.goToAdmin')}
                      </Button>
                    )}
                  </Box>
                  
                  <MenuItem component={RouterLink} to="/profile" onClick={handleCloseUserMenu}>
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t('profile.title')}</ListItemText>
                  </MenuItem>
                  
                  <MenuItem component={RouterLink} to="/notifications" onClick={handleCloseUserMenu}>
                    <ListItemIcon>
                      <Badge badgeContent={stats?.notifications || 0} color="error">
                        <NotificationsIcon fontSize="small" />
                      </Badge>
                    </ListItemIcon>
                    <ListItemText>{t('notifications.title')}</ListItemText>
                  </MenuItem>
                  
                  <Divider />
                  
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon sx={{ color: theme.palette.error.main }}>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={t('common.logout')}
                      primaryTypographyProps={{
                        color: theme.palette.error.main,
                      }}
                    />
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box sx={{ display: 'flex' }}>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  sx={{ 
                    display: { xs: 'none', sm: 'inline-flex' },
                    fontWeight: 'medium',
                    ml: 2
                  }}
                  startIcon={<LoginIcon />}
                >
                  {t('common.login')}
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Мобильді мәзір */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={handleMobileDrawerToggle}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
          },
        }}
      >
        {mobileDrawer}
      </Drawer>
      
      {/* Основной контент */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          // minHeight: смещение относительно высоты хедера и контейнера
          pt: scrolled ? '64px' : '64px',
          // Добавляем отступ внизу для футера
          pb: 8,
        }}
      >
        {/* Используем Outlet для вывода дочерних компонентов маршрутов */}
        <Outlet />
      </Box>
      
      {/* Футер */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: theme.palette.grey[100],
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} {t('common.libraryName')}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;