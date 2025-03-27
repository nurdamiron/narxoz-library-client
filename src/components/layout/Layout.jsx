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
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
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
  LightMode as LightModeIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Импорт компонентов и хуков
// import Sidebar from '../common/Sidebar';
import NotificationMenu from '../notifications/NotificationMenu';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getAvatarUrl } from '../../utils';

/**
 * Layout компоненті - қолданбаның негізгі макеті
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {React.ReactNode} props.children - Орналастырылатын мазмұн
 * @returns {JSX.Element} - Орналасу компоненті
 */
const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, stats } = useAuth();
  const { success } = useToast();
  
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
    success('Сіз сәтті шықтыңыз');
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
    { text: 'Басты бет', icon: <HomeIcon />, path: '/' },
    { text: 'Кітаптар', icon: <LibraryIcon />, path: '/books' },
    { text: 'Бетбелгілер', icon: <BookmarkIcon />, path: '/bookmarks', auth: true },
    { text: 'Қарыз тарихы', icon: <HistoryIcon />, path: '/borrows', auth: true },
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
            Нархоз кітапханасы
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
                {user.role === 'admin' ? 'Әкімші' : (user.role === 'librarian' ? 'Кітапханашы' : 'Оқырман')}
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
      
      {/* Авторизация/шығу */}
      <List sx={{ px: 1, py: 1 }}>
        {isAuthenticated ? (
          <>
            {/* <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={RouterLink}
                to="/profile"
                selected={isActive('/profile')}
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
                    color: isActive('/profile') ? theme.palette.primary.main : 'inherit',
                    minWidth: 40
                  }}
                >
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Профиль"
                  primaryTypographyProps={{
                    fontWeight: isActive('/profile') ? 'bold' : 'normal',
                  }}
                />
              </ListItemButton>
            </ListItem> */}
            
            {/* <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={RouterLink}
                to="/notifications"
                selected={isActive('/notifications')}
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
                    color: isActive('/notifications') ? theme.palette.primary.main : 'inherit',
                    minWidth: 40
                  }}
                >
                  <Badge badgeContent={stats?.notifications || 0} color="error">
                    <NotificationsIcon />
                  </Badge>
                </ListItemIcon>
                <ListItemText 
                  primary="Хабарламалар"
                  primaryTypographyProps={{
                    fontWeight: isActive('/notifications') ? 'bold' : 'normal',
                  }}
                />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  borderRadius: 1.5,
                  py: 1.25,
                  color: theme.palette.error.main,
                }}
              >
                <ListItemIcon sx={{ color: theme.palette.error.main, minWidth: 40 }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Шығу"
                  primaryTypographyProps={{
                    color: theme.palette.error.main,
                  }}
                />
              </ListItemButton>
            </ListItem> */}
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
                  primary="Кіру"
                  primaryTypographyProps={{
                    fontWeight: isActive('/login') ? 'bold' : 'normal',
                  }}
                />
              </ListItemButton>
            </ListItem>
{/*             
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/register"
                selected={isActive('/register')}
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
                    color: isActive('/register') ? theme.palette.primary.main : 'inherit',
                    minWidth: 40
                  }}
                >
                  <RegisterIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Тіркелу"
                  primaryTypographyProps={{
                    fontWeight: isActive('/register') ? 'bold' : 'normal',
                  }}
                />
              </ListItemButton>
            </ListItem> */}
          </>
        )}
      </List>
      
      {/* Нұсқа ақпараты */}
      {/* <Box 
        sx={{ 
          p: 2, 
          textAlign: 'center',
          bgcolor: alpha(theme.palette.primary.main, 0.03),
        }}
      >
        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} Нархоз кітапханасы
        </Typography>
      </Box> */}
    </Box>
  );
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Жоғарғы тақырып */}
      <AppBar 
        position="sticky" 
        elevation={scrolled ? 4 : 0}
        sx={{
          transition: 'box-shadow 0.3s',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
          {/* Мобильді мәзір түймесі */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleMobileDrawerToggle}
            sx={{ 
              mr: 2,
              display: { xs: 'flex', md: 'none' }
            }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Бүйірлік мәзір түймесі (десктоп)
          <IconButton
            color="inherit"
            aria-label="toggle sidebar"
            edge="start"
            onClick={toggleSidebar}
            sx={{ 
              mr: 1,
              display: { xs: 'none', md: 'flex' }
            }}
          >
            <MenuIcon />
          </IconButton> */}
          
          {/* Логотип */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              mr: { xs: 1, md: 2 },
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <Avatar
              alt="Нархоз"
              variant="rounded"
              sx={{ 
                width: 32, 
                height: 32, 
                mr: 1,
                bgcolor: 'transparent',
                display: { xs: 'none', sm: 'flex' }
              }}
            >
              Н
            </Avatar>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              Нархоз кітапханасы
            </Typography>
          </Box>
          
          {/* Навигация тек десктоп үшін */}
          <Box 
            sx={{ 
              display: { xs: 'none', lg: 'flex' },
              flexGrow: 1,
              ml: 2
            }}
          >
            {menuItems.map((item) => (
              // Авторизация қажет элементтерді тексеру
              (!item.auth || (item.auth && isAuthenticated)) && (
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
            {/* Хабарламалар (тек авторизацияланған пайдаланушылар үшін) */}
            {isAuthenticated && (
              <NotificationMenu />
            )}
            
            {/* Авторизация/профиль */}
            {isAuthenticated ? (
              <Box sx={{ position: 'relative' }}>
                <Tooltip title="Профиль мәзірі">
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
                    aria-label="Профиль"
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
                  </Box>
                  
                  <MenuItem component={RouterLink} to="/profile" onClick={handleCloseUserMenu}>
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Профиль</ListItemText>
                  </MenuItem>
                  
                  <MenuItem component={RouterLink} to="/notifications" onClick={handleCloseUserMenu}>
                    <ListItemIcon>
                      <Badge badgeContent={stats?.notifications || 0} color="error">
                        <NotificationsIcon fontSize="small" />
                      </Badge>
                    </ListItemIcon>
                    <ListItemText>Хабарламалар</ListItemText>
                  </MenuItem>
                  
                  {/* <MenuItem component={RouterLink} to="/bookmarks" onClick={handleCloseUserMenu}>
                    <ListItemIcon>
                      <Badge badgeContent={stats?.bookmarks || 0} color="primary">
                        <BookmarkIcon fontSize="small" />
                      </Badge>
                    </ListItemIcon>
                    <ListItemText>Бетбелгілер</ListItemText>
                  </MenuItem> */}
                  
                  {/* <MenuItem component={RouterLink} to="/borrows" onClick={handleCloseUserMenu}>
                    <ListItemIcon>
                      <Badge
                        badgeContent={stats?.activeborrows || 0}
                        color={stats?.overdueborrows > 0 ? "error" : "primary"}
                      >
                        <HistoryIcon fontSize="small" />
                      </Badge>
                    </ListItemIcon>
                    <ListItemText>Қарыз тарихы</ListItemText>
                  </MenuItem> */}
                  
                  <Divider />
                  
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon sx={{ color: theme.palette.error.main }}>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Шығу"
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
                  Кіру
                </Button>
                
                {/* <Button
                  variant="outlined"
                  color="inherit"
                  component={RouterLink}
                  to="/register"
                  sx={{ 
                    ml: { xs: 1, sm: 2 },
                    fontWeight: 'medium',
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                    }
                  }}
                >
                  Тіркелу
                </Button> */}
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
      
      {/* Десктоп үшін тұрақты бүйірлік мәзір
      <Sidebar
        open={sidebarOpen}
        onClose={toggleSidebar}
        stats={stats}
      /> */}
      
      {/* Негізгі мазмұны */}
      <Box 
        component="main" 
        sx={{
          flexGrow: 1,
          pl: { xs: 0 },
          transition: 'padding-left 0.3s ease',
        }}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </Box>
      </Box>
      
      {/* Футер */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) => alpha(theme.palette.grey[200], 0.5),
          pl: { xs: 0 },
          transition: 'padding-left 0.3s ease',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Нархоз Университеті Кітапханасы - Барлық құқықтар қорғалған
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;