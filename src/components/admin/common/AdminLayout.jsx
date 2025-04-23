import React, { useState } from 'react';
import { Box, Container, Paper, Tabs, Tab, Typography, Breadcrumbs, Link, useTheme } from '@mui/material';
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CategoryIcon from '@mui/icons-material/Category';
import RateReviewIcon from '@mui/icons-material/RateReview';

const AdminLayout = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(getTabValue(location.pathname));

  // Ағымдағы жолға негізделген белсенді қойындыны анықтайды
  function getTabValue(path) {
    if (path === '/admin') return 0;
    if (path.includes('/admin/users')) return 1;
    if (path.includes('/admin/books')) return 2;
    if (path.includes('/admin/borrows')) return 3;
    if (path.includes('/admin/categories')) return 4;
    if (path.includes('/admin/reviews')) return 5;
    return 0;
  }

  // Қойынды өзгерісін өңдеуші
  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/admin');
        break;
      case 1:
        navigate('/admin/users');
        break;
      case 2:
        navigate('/admin/books');
        break;
      case 3:
        navigate('/admin/borrows');
        break;
      case 4:
        navigate('/admin/categories');
        break;
      case 5:
        navigate('/admin/reviews');
        break;
      default:
        navigate('/admin');
    }
  };

  // Ағымдағы жолға негізделген нан қиқымдарын жасайды
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
          Басты бет
        </Link>
        
        {pathnames.map((name, index) => {
          const isLast = index === pathnames.length - 1;
          const route = `/${pathnames.slice(0, index + 1).join('/')}`;
          
          let displayName = name.charAt(0).toUpperCase() + name.slice(1);
          if (name === 'admin') displayName = 'Әкімшілік';
          if (name === 'users') displayName = 'Пайдаланушылар';
          if (name === 'books') displayName = 'Кітаптар';
          if (name === 'borrows') displayName = 'Қарыздар';
          if (name === 'categories') displayName = 'Санаттар';
          if (name === 'reviews') displayName = 'Пікірлер';
          
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

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
      {getBreadcrumbs()}
      
      <Paper elevation={3} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          indicatorColor="primary"
          textColor="primary"
          aria-label="admin navigation tabs"
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            '& .MuiTab-root': {
              minHeight: 64,
              fontSize: '0.9rem',
            },
          }}
        >
          <Tab 
            icon={<DashboardIcon />} 
            label="Басқару тақтасы" 
            iconPosition="start"
            sx={{ minWidth: 140 }}
          />
          <Tab 
            icon={<PeopleIcon />} 
            label="Пайдаланушылар" 
            iconPosition="start"
            sx={{ minWidth: 140 }}
          />
          <Tab 
            icon={<LibraryBooksIcon />} 
            label="Кітаптар" 
            iconPosition="start"
            sx={{ minWidth: 120 }}
          />
          <Tab 
            icon={<BookmarkIcon />} 
            label="Қарыздар" 
            iconPosition="start"
            sx={{ minWidth: 120 }}
          />
          <Tab 
            icon={<CategoryIcon />} 
            label="Санаттар" 
            iconPosition="start"
            sx={{ minWidth: 120 }}
          />
          <Tab 
            icon={<RateReviewIcon />} 
            label="Пікірлер" 
            iconPosition="start"
            sx={{ minWidth: 120 }}
          />
        </Tabs>
      </Paper>
      
      <Box sx={{ py: 2 }}>
        <Outlet />
      </Box>
    </Container>
  );
};

export default AdminLayout;