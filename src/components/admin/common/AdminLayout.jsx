import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Tabs, Tab, Typography, Breadcrumbs, Link, useTheme, Button } from '@mui/material';
import { Link as RouterLink, Outlet, useLocation, useNavigate, NavLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CategoryIcon from '@mui/icons-material/Category';
import RateReviewIcon from '@mui/icons-material/RateReview';
import EventIcon from '@mui/icons-material/Event';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { isModerator, logUserRoleInfo } from '../../../debug-role';

const AdminLayout = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  // Use the enhanced isModerator utility for more reliable role checking
  const userIsModerator = isModerator(user);
  
  // Log user role information for debugging
  logUserRoleInfo(user);
  
  console.log('AdminLayout rendered:', { 
    currentPath: location.pathname,
    userRole: user?.role, 
    isModerator: userIsModerator, 
    userRoleLowercase: user?.role?.toLowerCase()
  });
  
  // Role-based navigation routes according to specifications
  const adminRoutes = userIsModerator ? [
    // Moderator has limited access:
    // ❌ Dashboard - not visible to moderators
    // ❌ Users - not accessible to moderators  
    // ✅ Books (read-only) - visible to moderators
    // ❌ Loans - not accessible to moderators
    // ✅ Categories (read-only) - visible to moderators
    // ✅ Events (limited rights) - accessible to moderators
    // ✅ Reviews (primary work) - accessible to moderators
    { path: '/admin/books', index: 0, label: 'admin.books', icon: <LibraryBooksIcon /> },
    { path: '/admin/categories', index: 1, label: 'admin.categories', icon: <CategoryIcon /> },
    { path: '/admin/events', index: 2, label: 'events.admin.title', icon: <EventIcon /> },
    { path: '/admin/reviews', index: 3, label: 'admin.reviews', icon: <RateReviewIcon /> }
  ] : [
    // Admin/Librarian has full access:
    // ✅ Dashboard - full access
    // ✅ Users - full access  
    // ✅ Books - full access
    // ✅ Loans - full access
    // ✅ Categories - full access
    // ✅ Events - full access
    // ✅ Reviews - full access
    { path: '/admin', index: 0, label: 'admin.dashboard', icon: <DashboardIcon /> },
    { path: '/admin/users', index: 1, label: 'admin.users', icon: <PeopleIcon /> },
    { path: '/admin/books', index: 2, label: 'admin.books', icon: <LibraryBooksIcon /> },
    { path: '/admin/borrows', index: 3, label: 'admin.borrows', icon: <BookmarkIcon /> },
    { path: '/admin/categories', index: 4, label: 'admin.categories', icon: <CategoryIcon /> },
    { path: '/admin/events', index: 5, label: 'events.admin.title', icon: <EventIcon /> },
    { path: '/admin/reviews', index: 6, label: 'admin.reviews', icon: <RateReviewIcon /> }
  ];
  
  console.log('Available routes:', adminRoutes);
  
  // Определяем текущий индекс вкладки на основе пути
  const getCurrentTabIndex = (path) => {
    // Точное соответствие имеет приоритет
    for (const route of adminRoutes) {
      if (route.path === path) {
        console.log(`Exact match: Path ${path} matches route ${route.path}, index: ${route.index}`);
        return route.index;
      }
    }
    
    // Затем проверяем вложенные пути
    for (const route of adminRoutes) {
      // Особое условие для /admin, чтобы избежать совпадения со всеми маршрутами /admin/*
      if (route.path !== '/admin' && path.startsWith(route.path)) {
        console.log(`Nested match: Path ${path} starts with route ${route.path}, index: ${route.index}`);
        return route.index;
      }
    }
    
    const defaultIndex = userIsModerator ? 0 : 0;
    console.log(`No matching route for ${path}, using default index: ${defaultIndex}`);
    return defaultIndex; // По умолчанию первый таб
  };
  
  const [tabIndex, setTabIndex] = useState(getCurrentTabIndex(location.pathname));
  
  // Redirect moderators from restricted pages
  useEffect(() => {
    if (userIsModerator) {
      // If moderator tries to access admin dashboard or other restricted pages, redirect to books
      if (location.pathname === '/admin' || location.pathname === '/admin/users' || location.pathname === '/admin/borrows') {
        console.log('Redirecting moderator from restricted page:', location.pathname);
        navigate('/admin/books', { replace: true });
        return;
      }
    }
    
    const currentIndex = getCurrentTabIndex(location.pathname);
    console.log(`Route changed to ${location.pathname}, updating tab index to ${currentIndex}`);
    setTabIndex(currentIndex);
  }, [location.pathname, userIsModerator, navigate]);
  
  // Функция для навигационных хлебных крошек
  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    return (
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link
          component={RouterLink}
          to="/"
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          {t('common.home')}
        </Link>
        
        {pathnames.map((name, index) => {
          const isLast = index === pathnames.length - 1;
          const route = `/${pathnames.slice(0, index + 1).join('/')}`;
          
          let displayName;
          if (name === 'admin' && location.pathname === '/admin') displayName = t('admin.dashboard');
          else if (name === 'admin') displayName = t('admin.management');
          else if (name === 'users') displayName = t('admin.users');
          else if (name === 'books') displayName = t('admin.books');
          else if (name === 'borrows') displayName = t('admin.borrows');
          else if (name === 'categories') displayName = t('admin.categories');
          else if (name === 'events') displayName = t('events.admin.title');
          else if (name === 'reviews') displayName = t('admin.reviews');
          else displayName = name.charAt(0).toUpperCase() + name.slice(1);
          
          return isLast ? (
            <Typography key={route} color="text.primary">
              {displayName}
            </Typography>
          ) : (
            <Link
              component={RouterLink}
              underline="hover"
              to={route}
              key={route}
              color="inherit"
            >
              {displayName}
            </Link>
          );
        })}
      </Breadcrumbs>
    );
  };

  console.log('Current tab index:', tabIndex);

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
      {getBreadcrumbs()}
      
      {/* Замена Tabs на более надежный вариант с прямыми ссылками */}
      <Paper elevation={3} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            px: 1
          }}
        >
          {adminRoutes.map((route) => {
            // Для корректной работы с вложенными маршрутами
            const isExact = route.path === location.pathname;
            const isNested = route.path !== '/admin' && location.pathname.startsWith(route.path);
            const isActive = route.path === '/admin' ? isExact : (isExact || isNested);
            
            return (
              <NavLink
                key={route.path}
                to={route.path}
                style={{ 
                  color: 'inherit', 
                  textDecoration: 'none',
                  marginRight: 8
                }}
                end={route.path === '/admin'}
              >
                <Button
                  startIcon={route.icon}
                  variant={isActive ? "contained" : "text"}
                  color={isActive ? "primary" : "inherit"}
                  sx={{ 
                    minHeight: 64,
                    px: 2,
                    borderRadius: 0,
                    fontSize: '0.9rem',
                    textTransform: 'none',
                    borderBottom: isActive ? `3px solid ${theme.palette.primary.main}` : 'none'
                  }}
                >
                  {t(route.label)}
                </Button>
              </NavLink>
            );
          })}
        </Box>
      </Paper>
      
      <Box sx={{ py: 2 }}>
        <Outlet />
      </Box>
    </Container>
  );
};

export default AdminLayout;