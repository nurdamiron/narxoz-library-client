// src/components/layout/Layout.jsx
import React, { useState } from 'react';
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
  useMediaQuery,
  useTheme
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
  Notifications as NotificationsIcon
} from '@mui/icons-material';

// Импорт компонентов и хуков
import NotificationMenu from '../notifications/NotificationMenu';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getAvatarUrl } from '../../utils';

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { success } = useToast();
  
  // Состояние UI
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  
  // Открытие/закрытие бокового меню
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };
  
  // Открытие меню пользователя
  const handleOpenUserMenu = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };
  
  // Закрытие меню пользователя
  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null);
  };
  
  // Выход из системы
  const handleLogout = async () => {
    handleCloseUserMenu();
    await logout();
    success('Сіз сәтті шықтыңыз');
    navigate('/');
  };
  
  // Проверка активного маршрута
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // Элементы меню
  const menuItems = [
    { text: 'Басты бет', icon: <HomeIcon />, path: '/' },
    { text: 'Кітаптар', icon: <LibraryIcon />, path: '/books' },
    { text: 'Бетбелгілер', icon: <BookmarkIcon />, path: '/bookmarks', auth: true },
    { text: 'Қарыз тарихы', icon: <HistoryIcon />, path: '/borrows', auth: true },
  ];
  
  // Содержимое бокового меню
  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" component="div">
          Нархоз кітапханасы
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          // Если элемент требует авторизации и пользователь не авторизован, скрываем его
          (!item.auth || (item.auth && isAuthenticated)) && (
            <ListItem 
              button 
              key={item.text} 
              component={RouterLink} 
              to={item.path}
              selected={isActive(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          )
        ))}
      </List>
      <Divider />
      <List>
        {isAuthenticated ? (
          <>
            <ListItem button component={RouterLink} to="/profile" selected={isActive('/profile')}>
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="Профиль" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Шығу" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={RouterLink} to="/login" selected={isActive('/login')}>
              <ListItemIcon><LoginIcon /></ListItemIcon>
              <ListItemText primary="Кіру" />
            </ListItem>
            <ListItem button component={RouterLink} to="/register" selected={isActive('/register')}>
              <ListItemIcon><RegisterIcon /></ListItemIcon>
              <ListItemText primary="Тіркелу" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Шапка */}
      <AppBar position="sticky">
        <Toolbar>
          {/* Мобильное меню */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          {/* Логотип */}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: { xs: 1, md: 0 },
              mr: { md: 4 },
              color: 'inherit',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            Нархоз кітапханасы
          </Typography>
          
          {/* Навигация для планшетов и компьютеров */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex' }}>
              {menuItems.map((item) => (
                // Если элемент требует авторизации и пользователь не авторизован, скрываем его
                (!item.auth || (item.auth && isAuthenticated)) && (
                  <Button
                    key={item.text}
                    component={RouterLink}
                    to={item.path}
                    color="inherit"
                    sx={{ 
                      mx: 1,
                      fontWeight: isActive(item.path) ? 'bold' : 'normal',
                      borderBottom: isActive(item.path) ? '2px solid white' : 'none'
                    }}
                    startIcon={item.icon}
                  >
                    {item.text}
                  </Button>
                )
              ))}
            </Box>
          )}
          
          {/* Уведомления и профиль */}
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            {/* Уведомления (только для авторизованных) */}
            {isAuthenticated && (
              <NotificationMenu />
            )}
            
            {/* Авторизация/профиль */}
            {isAuthenticated ? (
              <>
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{ p: 0, ml: 2 }}
                  aria-label="Профиль"
                >
                  <Avatar 
                    alt={user?.name} 
                    src={getAvatarUrl(user?.avatar)}
                    sx={{ width: 40, height: 40 }}
                  />
                </IconButton>
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
                >
                  <MenuItem component={RouterLink} to="/profile" onClick={handleCloseUserMenu}>
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Профиль</ListItemText>
                  </MenuItem>
                  <MenuItem component={RouterLink} to="/notifications" onClick={handleCloseUserMenu}>
                    <ListItemIcon>
                      <Badge badgeContent={0} color="error">
                        <NotificationsIcon fontSize="small" />
                      </Badge>
                    </ListItemIcon>
                    <ListItemText>Хабарламалар</ListItemText>
                  </MenuItem>
                  <MenuItem component={RouterLink} to="/bookmarks" onClick={handleCloseUserMenu}>
                    <ListItemIcon>
                      <BookmarkIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Бетбелгілер</ListItemText>
                  </MenuItem>
                  <MenuItem component={RouterLink} to="/borrows" onClick={handleCloseUserMenu}>
                    <ListItemIcon>
                      <HistoryIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Қарыз тарихы</ListItemText>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Шығу</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex' }}>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/login"
                  sx={{ ml: 1 }}
                >
                  Кіру
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  component={RouterLink}
                  to="/register"
                  sx={{ ml: 1 }}
                >
                  Тіркелу
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Боковое меню (для мобильных) */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawer}
      </Drawer>
      
      {/* Основное содержимое */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      
      {/* Футер */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) => theme.palette.grey[200],
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Нархоз кітапханасы
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;