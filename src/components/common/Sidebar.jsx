/**
 * src/components/layout/Sidebar.jsx
 * 
 * Нархоз кітапханасының бүйірлік мәзірі
 * 
 * Бұл компонент сайттың бүйір навигациялық панелін құрайды және
 * негізгі беттер, категориялар және қосымша байланыстарға навигацияны қамтамасыз етеді.
 * Анимациялар мен дизайн жақсартулары қосылған.
 */
import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  Typography,
  IconButton,
  Collapse,
  Badge,
  Avatar,
  alpha,
  Tooltip
} from '@mui/material';
import {
  Home as HomeIcon,
  MenuBook as LibraryBooksIcon,
  Category as CategoryIcon,
  Bookmark as BookmarkIcon,
  History as HistoryIcon,
  Info as InfoIcon,
  ChevronLeft as ChevronLeftIcon,
  ExpandLess,
  ExpandMore,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { userHasRole, logUserRoleInfo } from '../../debug-role';

// Бүйір панелі енінің константасы
const drawerWidth = 260;

/**
 * Sidebar компоненті - сайттың бүйір навигациялық панелі
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {boolean} props.open - Бүйір панелінің ашық/жабық күйі
 * @param {Function} props.onClose - Бүйір панелін жабу функциясы
 * @param {Object} props.stats - Пайдаланушы статистикасы
 * @param {Array} props.categories - Категориялар тізімі
 */
const Sidebar = ({ open, onClose, stats = {}, categories = [] }) => {
  const theme = useTheme();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useTranslation();
  
  // Категориялар құлау күйі
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  
  // Егер категориялар массиві бос болса, тест деректерін қолдану
  const displayCategories = categories.length > 0 ? categories : [
    { id: 1, name: 'Бизнес' },
    { id: 2, name: 'Экономика' },
    { id: 3, name: 'Қаржы' },
    { id: 4, name: 'Маркетинг' },
    { id: 5, name: 'Менеджмент' },
    { id: 6, name: 'IT және бағдарламалау' },
    { id: 7, name: 'Құқық' },
  ];
  
  // Категориялардын ашық/жабық күйін ауыстыру
  const handleToggleCategories = () => {
    setCategoriesOpen(!categoriesOpen);
  };
  
  // Role-based menu items according to specifications
  const mainMenuItems = [
    // Visible to all users
    { text: t('sidebar.mainMenu.home'), icon: <HomeIcon />, path: '/' },
    { text: t('sidebar.mainMenu.books'), icon: <LibraryBooksIcon />, path: '/books' },
    { text: t('sidebar.mainMenu.events'), icon: <EventIcon />, path: '/events' },
    
    // Only for authenticated users (students, moderators, admins)
    { 
      text: t('sidebar.mainMenu.myEvents'), 
      icon: <EventIcon />, 
      path: '/my-events',
      requireAuth: true
    },
    { 
      text: t('sidebar.mainMenu.bookmarks'), 
      icon: <BookmarkIcon />, 
      path: '/bookmarks',
      requireAuth: true,
      badge: stats.bookmarks || 0
    },
    { 
      text: t('sidebar.mainMenu.borrowHistory'), 
      icon: <HistoryIcon />, 
      path: '/borrows',
      requireAuth: true,
      badge: stats.activeborrows || 0,
      alert: stats.overdueborrows > 0
    },
    
    // Dashboard - only for moderators and admins
    { 
      text: t('userDashboard.title'), 
      icon: <DashboardIcon />, 
      path: '/user-dashboard',
      requireAuth: true,
      requireRole: ['moderator', 'admin', 'librarian']
    },
    
    
    // Admin/Moderator Panel - only for moderators and admins
    { 
      text: user?.role === 'moderator' 
        ? t('sidebar.mainMenu.moderatorPanel', 'Moderator Panel')
        : t('sidebar.mainMenu.adminPanel', 'Admin Panel'), 
      icon: <SettingsIcon />, 
      path: '/admin',
      requireAuth: true,
      requireRole: ['admin', 'moderator', 'librarian']
    },
  ];
  
  // Қосымша меню элементтері
  const secondaryMenuItems = [
    { text: t('sidebar.secondaryMenu.about'), icon: <InfoIcon />, path: '/about' },
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
  
  // URL өзгергенде категорияларды тексеру
  useEffect(() => {
    // Егер URL-де категория параметрі болса, категория тізімін ашу
    if (location.search.includes('categoryId=')) {
      setCategoriesOpen(true);
    }
  }, [location]);
  
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: '4px 0 10px rgba(0, 0, 0, 0.05)',
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      {/* Бүйір панелінің тақырыбы */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: theme.spacing(2),
          ...theme.mixins.toolbar,
          justifyContent: 'space-between',
          bgcolor: alpha(theme.palette.primary.main, 0.03),
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            component="img"
            src="/Narxoz_logo.png"
            alt="Narxoz University"
            sx={{ 
              width: 36, 
              height: 36, 
              mr: 1.5,
              objectFit: 'contain'
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('sidebar.libraryName')}
          </Typography>
        </Box>
        
        <IconButton 
          onClick={onClose}
          sx={{
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            }
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      </Box>

      <Divider />
      
      {/* Пайдаланушы секциясы */}
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
              alt={user.name}
              src={user.avatar}
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
                {t(`roles.${user.role ? user.role.toLowerCase() : 'reader'}`)}
              </Typography>
            </Box>
            
            <Box sx={{ ml: 'auto' }}>
              <Tooltip title={t('profile.title')}>
                <IconButton
                  component={RouterLink}
                  to="/profile"
                  size="small"
                  sx={{
                    color: theme.palette.primary.main,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    }
                  }}
                >
                  <PersonIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Divider />
        </>
      )}

      {/* Негізгі меню элементтерінің тізімі */}
      <List component={motion.ul} initial="hidden" animate="visible">
        {mainMenuItems.map((item, index) => {
          // Enhanced debug logging for menu items
          if (item.path === '/admin' && isAuthenticated && user) {
            // Log detailed information about the admin panel item
            logUserRoleInfo(user);
            console.log('Admin panel item check:', {
              path: item.path,
              userRole: user.role,
              requireRole: item.requireRole,
              hasRequiredRole: userHasRole(user, item.requireRole)
            });
          }
          
          // Авторизация қажет элементтерді тексеру
          if (item.requireAuth && !isAuthenticated) {
            return null;
          }
          
          // Debug log for all menu items that require role
          if (item.requireRole) {
            console.log(`Menu item ${item.text}:`, {
              itemText: item.text,
              itemRequiresRole: item.requireRole,
              userRole: user?.role,
              userRoleLowercase: user?.role?.toLowerCase(),
              hasRequiredRole: userHasRole(user, item.requireRole)
            });
          }
          
          // Белгілі бір рөл қажет болса, тексеру (регистрге нечувствительное сравнение)
          // Using the userHasRole utility for more reliable role checking
          if (item.requireRole && !userHasRole(user, item.requireRole)) {
            // Extra logging for admin panel access
            if (item.path === '/admin') {
              console.warn('Admin panel access check failed:', {
                userRole: user?.role,
                userRoleLowercase: user?.role?.toLowerCase(),
                requiredRoles: item.requireRole,
                hasRequiredRole: userHasRole(user, item.requireRole)
              });
            }
            return null;
          }
          
          return (
            <motion.div
              key={item.text}
              variants={itemVariants}
              custom={index}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
            >
              <ListItem disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{
                    py: 1.5,
                    transition: 'all 0.2s',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '4px',
                      bgcolor: 'transparent',
                      transition: 'all 0.2s',
                    },
                    '&.Mui-selected': {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      '&::before': {
                        bgcolor: theme.palette.primary.main,
                      },
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                      },
                    },
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: location.pathname === item.path
                        ? theme.palette.primary.main
                        : 'inherit',
                      minWidth: 40,
                    }}
                  >
                    {item.badge > 0 ? (
                      <Badge
                        color={item.alert ? "error" : "primary"}
                        badgeContent={item.badge}
                        max={99}
                      >
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: location.pathname === item.path ? '600' : '400',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </motion.div>
          );
        })}
      </List>

      <Divider />

      {/* Категориялар бөлімі */}
      <Box sx={{ px: 2, py: 1.5 }}>
        {/* <ListItemButton 
          onClick={handleToggleCategories}
          sx={{
            borderRadius: 1.5,
            mb: 1,
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.04),
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Категориялар"
            primaryTypographyProps={{
              fontWeight: 'medium',
            }}
          />
          {categoriesOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton> */}
      </Box>

      {/* Категориялар тізімі */}
      <Collapse in={categoriesOpen} timeout="auto" unmountOnExit>
        <List 
          component="div" 
          disablePadding
          sx={{ maxHeight: '30vh', overflow: 'auto', pb: 1 }}
        >
          {displayCategories.map((category, index) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              custom={index}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <ListItemButton
                component={RouterLink}
                to={`/books?categoryId=${category.id}`}
                selected={location.search.includes(`categoryId=${category.id}`)}
                sx={{
                  pl: 4,
                  py: 1,
                  ml: 2,
                  mr: 2,
                  borderRadius: 1.5,
                  mb: 0.5,
                  transition: 'all 0.2s',
                  '&.Mui-selected': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.12),
                    },
                  },
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                <ListItemText 
                  primary={category.name}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: location.search.includes(`categoryId=${category.id}`) ? '600' : '400',
                  }}
                />
              </ListItemButton>
            </motion.div>
          ))}
        </List>
      </Collapse>

      {/* Бос орын - қосымша элементтерді төменге жылжыту үшін */}
      <Box sx={{ flexGrow: 1 }} />

      <Divider />

      {/* Қосымша меню элементтерінің тізімі */}
      <List>
        {secondaryMenuItems.map((item, index) => (
          <motion.div
            key={item.text}
            variants={itemVariants}
            custom={index}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  py: 1.5,
                  transition: 'all 0.2s',
                  '&.Mui-selected': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.12),
                    },
                  },
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                <ListItemIcon 
                  sx={{
                    color: location.pathname === item.path
                      ? theme.palette.primary.main
                      : 'inherit',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.path ? '600' : '400',
                  }}
                />
              </ListItemButton>
            </ListItem>
          </motion.div>
        ))}
        
        {/* Шығу түймесі - тек авторизацияланған пайдаланушылар үшін */}
        {isAuthenticated && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.7 }}
          >
            <ListItem disablePadding>
              <ListItemButton
                onClick={logout}
                sx={{
                  py: 1.5,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.error.main, 0.04),
                  },
                }}
              >
                <ListItemIcon sx={{ color: theme.palette.error.main, minWidth: 40 }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText 
                  primary={t('sidebar.logout')}
                  primaryTypographyProps={{
                    color: theme.palette.error.main,
                  }}
                />
              </ListItemButton>
            </ListItem>
          </motion.div>
        )}
      </List>

      {/* Нұсқа мен авторлық құқық ақпараты */}
      <Box
        sx={{
          p: 2,
          textAlign: 'center',
          bgcolor: alpha(theme.palette.primary.main, 0.03),
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {t('sidebar.copyright', { year: new Date().getFullYear() })}
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;