/**
 * src/components/common/Header.jsx
 * 
 * Header компоненті - сайттың жоғарғы навигациялық панелі
 * 
 * Бұл компонент қосымшаның жоғарғы навигациялық тақтасын көрсетеді,
 * хабарландырулар санауышын интеграциялайды және пайдаланушы менюсін басқарады.
 */
import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
  Avatar,
  InputBase,
  Badge,
  Tooltip,
  useMediaQuery,
  useTheme,
  styled,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Logout,
  Person,
  Book,
  History,
  BookmarkBorder,
  Event as EventIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import getNotifications from '../../services/notificationService';

/**
 * Іздеу компонентінің стильдері
 */
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 16,
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'all 0.3s ease',
  height: 32,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  '&:focus-within': {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  marginRight: theme.spacing(0.5),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

/**
 * Іздеу иконкасының контейнері
 */
const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 0.75),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

/**
 * Іздеу енгізу өрісінің стильдері
 */
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  height: '100%',
  '& .MuiInputBase-input': {
    padding: '6px 6px 6px 0',
    paddingLeft: 'calc(1em + 20px)',
    transition: theme.transitions.create('width'),
    width: '100%',
    fontSize: '0.75rem',
  },
}));

/**
 * Header компоненті
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {Function} props.toggleSidebar - Бүйір панелін ашу/жабу функциясы
 * @returns {JSX.Element} - Header компоненті
 */
const Header = ({ toggleSidebar }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isVerySmall = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  // AuthContext-тен пайдаланушы мәліметтерін алу
  const { user, isAuthenticated, logout } = useAuth();
  
  // State
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [loading, setLoading] = useState(false);

  /**
   * Пайдаланушы профилі менюсін ашу
   */
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Пайдаланушы профилі менюсін жабу
   */
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  /**
   * Пайдаланушы жүйеден шығу функциясы
   */
  const handleLogout = async () => {
    try {
      await logout();
      handleMenuClose();
      navigate('/login');
    } catch (error) {
      console.error('Жүйеден шығу кезінде қате орын алды:', error);
    }
  };

  /**
   * Іздеу функциясы
   */
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  /**
   * Оқылмаған хабарландыруларды жүктеу функциясы
   */
  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        const notificationsData = await getNotifications();
        const unreadCount = notificationsData.filter(notification => !notification.read).length;
        setUnreadNotifications(unreadCount);
      } catch (error) {
        console.error(t('notifications.loadError'), error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUnreadNotifications();
    
    // Хабарландыруларды белгілі бір уақыт аралығында жаңарту
    const interval = setInterval(fetchUnreadNotifications, 60000); // әр минут сайын
    
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Ағымдағы беттің атауын алу (мобильді көрініс үшін)
  const getCurrentPageName = () => {
    const path = location.pathname;
    if (path === '/') return t('common.home');
    if (path === '/books') return t('books.catalog');
    if (path.startsWith('/books/')) return t('books.bookDetails');
    if (path === '/profile') return t('profile.title');
    if (path === '/bookmarks') return t('bookmarks.title');
    if (path === '/borrows') return t('borrowHistory.title');
    if (path === '/notifications') return t('notifications.title');
    if (path === '/events') return t('events.title');
    if (path.startsWith('/events/')) return t('events.eventDetails');
    if (path === '/my-events') return t('events.myEvents.title');
    return t('common.libraryName');
  };

  return (
    <AppBar position="fixed" sx={{ 
      backgroundColor: '#d50032',
      backgroundImage: 'linear-gradient(90deg, #d50032 0%, #c00028 25%, #d50032 50%, #c00028 75%, #d50032 100%)',
      backgroundSize: '200% 100%',
      animation: 'gradient 15s ease infinite',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      '@keyframes gradient': {
        '0%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
        '100%': { backgroundPosition: '0% 50%' },
      },
    }}>
      <Toolbar sx={{ 
        minHeight: { xs: 48, sm: 52 },
        px: { xs: 0.5, sm: 1, md: 1.5 },
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
        }
      }}>
        {/* Бүйір панелін ашу түймесі */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleSidebar}
          sx={{ 
            mr: { xs: 0.25, sm: 0.5 },
            p: { xs: 0.5, sm: 0.75 }
          }}
        >
          <MenuIcon sx={{ fontSize: { xs: 20, sm: 22 } }} />
        </IconButton>
        
        {/* Сайт логотипі */}
        <Box
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            mr: { xs: 0.25, sm: 0.5 },
            flexShrink: 0,
          }}
        >
          <Box
            component="img"
            src="/images/narxoz-logo-white.png"
            alt="Narxoz University"
            sx={{
              height: { xs: 24, sm: 28, md: 30 },
              filter: 'brightness(1)',
              display: 'block',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          />
        </Box>

        {/* Іздеу компоненті */}
        <Search sx={{ 
          display: { xs: 'none', sm: 'block' },
          flexGrow: 0, 
          width: { sm: 160, md: 200, lg: 240 },
          mx: { sm: 0.5 }
        }}>
          <SearchIconWrapper>
            <SearchIcon sx={{ fontSize: 16 }} />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder={t('common.search')}
            inputProps={{ 'aria-label': 'search' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </Search>

        {/* Бос орын */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Оң жақ элементтер тобы */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Мобильді іздеу түймесі */}
          <Tooltip title={t('common.search')}>
            <IconButton
              color="inherit"
              sx={{ 
                display: { xs: 'flex', sm: 'none' },
                p: 0.5,
                mr: 0.25
              }}
              onClick={() => navigate('/books')}
            >
              <SearchIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          
          {/* Role-based Navigation buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.25, sm: 0.5 } }}>
            {/* Books - visible to all users */}
            <Tooltip title={t('books.catalog')}>
              <IconButton
                color="inherit"
                component={RouterLink}
                to="/books"
                sx={{ 
                  display: { xs: 'flex', lg: 'none' },
                  p: { xs: 0.5, sm: 0.75 }
                }}
              >
                <Book sx={{ fontSize: { xs: 18, sm: 20 } }} />
              </IconButton>
            </Tooltip>
            
            <Button
              color="inherit"
              component={RouterLink}
              to="/books"
              startIcon={<Book sx={{ fontSize: 16 }} />}
              sx={{ 
                display: { xs: 'none', lg: 'flex' },
                px: 1.5,
                py: 0.5,
                fontSize: '0.813rem',
                minWidth: 'auto',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                '& .MuiButton-startIcon': {
                  marginRight: 0.5,
                }
              }}
            >
              {t('books.catalog')}
            </Button>
            
            {/* Events - visible to all users */}
            <Tooltip title={t('events.title')}>
              <IconButton
                color="inherit"
                component={RouterLink}
                to="/events"
                sx={{ 
                  display: { xs: 'flex', lg: 'none' },
                  p: { xs: 0.5, sm: 0.75 }
                }}
              >
                <EventIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              </IconButton>
            </Tooltip>
            
            <Button
              color="inherit"
              component={RouterLink}
              to="/events"
              startIcon={<EventIcon sx={{ fontSize: 16 }} />}
              sx={{ 
                display: { xs: 'none', lg: 'flex' },
                px: 1.5,
                py: 0.5,
                fontSize: '0.813rem',
                minWidth: 'auto',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                '& .MuiButton-startIcon': {
                  marginRight: 0.5,
                }
              }}
            >
              {t('events.title')}
            </Button>

            {/* Bookmarks - only for authenticated users (students, moderators, admins) */}
            {isAuthenticated && (
              <>
                <Tooltip title={t('bookmarks.title')}>
                  <IconButton
                    color="inherit"
                    component={RouterLink}
                    to="/bookmarks"
                    sx={{ 
                      display: { xs: 'flex', lg: 'none' },
                      p: { xs: 0.5, sm: 0.75 }
                    }}
                  >
                    <BookmarkBorder sx={{ fontSize: { xs: 18, sm: 20 } }} />
                  </IconButton>
                </Tooltip>
                
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/bookmarks"
                  startIcon={<BookmarkBorder sx={{ fontSize: 16 }} />}
                  sx={{ 
                    display: { xs: 'none', lg: 'flex' },
                    px: 1.5,
                    py: 0.5,
                    fontSize: '0.813rem',
                    minWidth: 'auto',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '& .MuiButton-startIcon': {
                      marginRight: 0.5,
                    }
                  }}
                >
                  {t('bookmarks.title')}
                </Button>

                {/* Borrowing History - only for authenticated users */}
                <Tooltip title={t('borrowHistory.title')}>
                  <IconButton
                    color="inherit"
                    component={RouterLink}
                    to="/borrows"
                    sx={{ 
                      display: { xs: 'flex', lg: 'none' },
                      p: { xs: 0.5, sm: 0.75 }
                    }}
                  >
                    <History sx={{ fontSize: { xs: 18, sm: 20 } }} />
                  </IconButton>
                </Tooltip>
                
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/borrows"
                  startIcon={<History sx={{ fontSize: 16 }} />}
                  sx={{ 
                    display: { xs: 'none', lg: 'flex' },
                    px: 1.5,
                    py: 0.5,
                    fontSize: '0.813rem',
                    minWidth: 'auto',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '& .MuiButton-startIcon': {
                      marginRight: 0.5,
                    }
                  }}
                >
                  {t('borrowHistory.title')}
                </Button>

                {/* Dashboard - only for moderators and admins */}
                {(user?.role === 'moderator' || user?.role === 'admin' || user?.role === 'librarian') && (
                  <>
                    <Tooltip title={t('userDashboard.title')}>
                      <IconButton
                        color="inherit"
                        component={RouterLink}
                        to="/user-dashboard"
                        sx={{ 
                          display: { xs: 'flex', lg: 'none' },
                          p: { xs: 0.5, sm: 0.75 }
                        }}
                      >
                        <DashboardIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                      </IconButton>
                    </Tooltip>
                    
                    <Button
                      color="inherit"
                      component={RouterLink}
                      to="/user-dashboard"
                      startIcon={<DashboardIcon sx={{ fontSize: 16 }} />}
                      sx={{ 
                        display: { xs: 'none', lg: 'flex' },
                        px: 1.5,
                        py: 0.5,
                        fontSize: '0.813rem',
                        minWidth: 'auto',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                        '& .MuiButton-startIcon': {
                          marginRight: 0.5,
                        }
                      }}
                    >
                      {t('userDashboard.title')}
                    </Button>
                  </>
                )}
              </>
            )}
          </Box>

          {/* Аутентификацияланған пайдаланушы элементтері */}
          {isAuthenticated ? (
            <>
              {/* Хабарландырулар түймесі */}
              <IconButton
                size="small"
                aria-label="show notifications"
                color="inherit"
                component={RouterLink}
                to="/notifications"
                sx={{ 
                  mr: { xs: 0.25, sm: 0.5 },
                  p: { xs: 0.5, sm: 0.75 }
                }}
              >
                <Badge badgeContent={unreadNotifications} color="error" 
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.65rem',
                      height: 14,
                      minWidth: 14,
                      padding: '0 3px',
                    }
                  }}
                >
                  <NotificationsIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                </Badge>
              </IconButton>

              {/* Пайдаланушы профилі түймесі */}
              <Tooltip title={user?.firstName || t('user.fullName')}>
                <IconButton
                  size="small"
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                  sx={{ p: { xs: 0.5, sm: 0.75 } }}
                >
                  {user?.avatar ? (
                    <Avatar
                      alt={user.name}
                      src={user.avatar}
                      sx={{ width: 24, height: 24 }}
                    />
                  ) : (
                    <AccountCircle sx={{ fontSize: { xs: 22, sm: 24 } }} />
                  )}
                </IconButton>
              </Tooltip>

              {/* Пайдаланушы профилі менюсі */}
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  elevation: 2,
                  sx: {
                    borderRadius: 2,
                    width: 220,
                  }
                }}
              >
                {/* Профиль - для всех аутентифицированных пользователей */}
                <MenuItem
                  component={RouterLink}
                  to="/profile"
                  onClick={handleMenuClose}
                >
                  <ListItemIcon>
                    <Person sx={{ color: '#d50032' }} />
                  </ListItemIcon>
                  <ListItemText primary={t('profile.title')} />
                </MenuItem>

                {/* Уведомления - для всех аутентифицированных пользователей */}
                <MenuItem
                  component={RouterLink}
                  to="/notifications"
                  onClick={handleMenuClose}
                >
                  <ListItemIcon>
                    <Badge badgeContent={unreadNotifications} color="error">
                      <NotificationsIcon sx={{ color: '#d50032' }} />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText primary={t('notifications.title')} />
                </MenuItem>

                {/* Панель управления - только для модераторов и администраторов */}
                {(user?.role === 'moderator' || user?.role === 'admin' || user?.role === 'librarian') && (
                  <MenuItem
                    component={RouterLink}
                    to="/admin"
                    onClick={handleMenuClose}
                  >
                    <ListItemIcon>
                      <DashboardIcon sx={{ color: '#d50032' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        user?.role === 'moderator' 
                          ? t('admin.goToModeratorPanel', 'Go to moderator panel')
                          : t('admin.goToAdminPanel', 'Go to admin panel')
                      } 
                    />
                  </MenuItem>
                )}
                
                <Divider sx={{ my: 1 }} />
                
                {/* Жүйеден шығу түймесі */}
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout sx={{ color: '#d50032' }} />
                  </ListItemIcon>
                  <ListItemText primary={t('common.logout')} />
                </MenuItem>
              </Menu>
            </>
          ) : (
            // Аутентификацияланбаған пайдаланушы үшін кіру түймесі
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/login"
              size="small"
              sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.813rem' },
                px: { xs: 1, sm: 1.5 },
                py: { xs: 0.375, sm: 0.5 },
                borderRadius: 1.5,
                border: '1px solid rgba(255,255,255,0.3)',
                minWidth: 'auto',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.5)',
                }
              }}
            >
              {t('common.login')}
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;