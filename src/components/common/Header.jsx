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
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import getNotifications from '../../services/notificationService';

/**
 * Іздеу компонентінің стильдері
 */
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  marginRight: theme.spacing(1),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(2),
    width: 'auto',
  },
}));

/**
 * Іздеу иконкасының контейнері
 */
const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1.5),
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
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '18ch',
      '&:focus': {
        width: '25ch',
      },
    },
    [theme.breakpoints.down('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '16ch',
      },
    },
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
      backgroundImage: 'linear-gradient(to right,rgb(113, 4, 29),rgb(119, 5, 31) 30%,rgb(114, 5, 23))',
    }}>
      <Toolbar sx={{ 
        minHeight: { xs: 56, sm: 64 },
        px: { xs: 1, sm: 2 }
      }}>
        {/* Бүйір панелін ашу түймесі */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleSidebar}
          sx={{ mr: { xs: 1, sm: 2 } }}
        >
          <MenuIcon />
        </IconButton>
        
        {/* Сайт логотипі мен атауы */}
        {!isVerySmall ? (
          <Box
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              mr: 1,
              flexShrink: 0,
            }}
          >
            <Box
              component="img"
              src="/images/narxoz-logo-white.png"
              alt="Narxoz University"
              sx={{
                height: 35,
                mr: 1,
                filter: 'brightness(1)',
                display: 'block'
              }}
            />
          </Box>
        ) : (
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              color: 'inherit',
              fontWeight: 'bold',
              mr: 1,
              flexShrink: 0,
            }}
          >
            {getCurrentPageName()}
          </Typography>
        )}

        {/* Іздеу компоненті */}
        <Search sx={{ flexGrow: 1, maxWidth: { xs: 180, sm: 'none' } }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder={t('books.searchPlaceholder')}
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
          {/* Global Navigation buttons - visible to all users */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/books"
              startIcon={<Book />}
              sx={{ mr: 1, display: { xs: 'none', md: 'flex' } }}
            >
              {t('books.catalog')}
            </Button>
            
            <Button
              color="inherit"
              component={RouterLink}
              to="/events"
              startIcon={<EventIcon />}
              sx={{ 
                mr: 1,
                minWidth: { xs: 'auto', sm: 'auto' },
                px: { xs: 1, sm: 2 },
                '& .MuiButton-startIcon': {
                  mr: { xs: 0, sm: 1 }
                },
                '& .MuiButton-endIcon': {
                  ml: { xs: 0, sm: 1 }
                }
              }}
            >
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                {t('events.title')}
              </Box>
            </Button>
          </Box>

          {/* Аутентификацияланған пайдаланушы элементтері */}
          {isAuthenticated ? (
            <>
              {/* Хабарландырулар түймесі */}
              <IconButton
                size="medium"
                aria-label="show notifications"
                color="inherit"
                component={RouterLink}
                to="/notifications"
                sx={{ mr: 1 }}
              >
                <Badge badgeContent={unreadNotifications} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* Пайдаланушы профилі түймесі */}
              <Tooltip title={t('user.fullName')}>
                <IconButton
                  size="medium"
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  {user?.avatar ? (
                    <Avatar
                      alt={user.name}
                      src={user.avatar}
                      sx={{ width: 32, height: 32 }}
                    />
                  ) : (
                    <AccountCircle />
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
                    width: 200,
                  }
                }}
              >
                {/* Профиль бетіне сілтеме */}
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
                
                {/* Бетбелгілер */}
                <MenuItem
                  component={RouterLink}
                  to="/bookmarks"
                  onClick={handleMenuClose}
                >
                  <ListItemIcon>
                    <BookmarkBorder sx={{ color: '#d50032' }} />
                  </ListItemIcon>
                  <ListItemText primary={t('bookmarks.title')} />
                </MenuItem>
                
                {/* Қарыздар тарихы */}
                <MenuItem
                  component={RouterLink}
                  to="/borrows"
                  onClick={handleMenuClose}
                >
                  <ListItemIcon>
                    <History sx={{ color: '#d50032' }} />
                  </ListItemIcon>
                  <ListItemText primary={t('borrowHistory.title')} />
                </MenuItem>
                
                {/* My Events */}
                <MenuItem
                  component={RouterLink}
                  to="/my-events"
                  onClick={handleMenuClose}
                >
                  <ListItemIcon>
                    <EventIcon sx={{ color: '#d50032' }} />
                  </ListItemIcon>
                  <ListItemText primary={t('sidebar.mainMenu.myEvents')} />
                </MenuItem>
                
                <MenuItem sx={{ borderTop: '1px solid rgba(0,0,0,0.1)', mt: 1 }} />
                
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
            <Button color="inherit" component={RouterLink} to="/login">
              {t('common.login')}
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;