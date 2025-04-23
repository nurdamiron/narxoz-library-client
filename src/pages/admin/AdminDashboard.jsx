import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PeopleIcon from '@mui/icons-material/People';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CategoryIcon from '@mui/icons-material/Category';
import WarningIcon from '@mui/icons-material/Warning';
import PageHeader from '../../components/common/PageHeader';
import { StatCard, AdminCard, DashboardChart, CategoryStats } from '../../components/admin/common';
import dashboardService from '../../services/dashboardService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    books: 0,
    borrows: 0,
    categories: 0
  });
  const [overdueCount, setOverdueCount] = useState(0);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [activeBorrowers, setActiveBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load dashboard statistics
        const statsData = await dashboardService.getStatistics();
        setStats({
          users: statsData.users,
          books: statsData.books,
          borrows: statsData.borrows,
          categories: statsData.categories
        });
        
        // Get trending books
        const trending = await dashboardService.getTrendingBooks();
        setTrendingBooks(trending);
        
        // Set active borrowers from statistics
        setActiveBorrowers(statsData.mostActiveBorrowers || []);
        
        // Get overdue borrows count
        const overdue = await dashboardService.getOverdueBorrows();
        setOverdueCount(overdue);
        
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Деректерді жүктеу кезінде қате пайда болды. Тағы қайталап көріңіз.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Админ панелі бөлімдеріне арналған карточкалар
  const adminSections = [
    {
      title: 'Пайдаланушылар',
      icon: <PeopleIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      path: '/admin/users',
      description: 'Жүйе пайдаланушыларын басқару, жаңа пайдаланушылар қосу және рөлдерді өзгерту'
    },
    {
      title: 'Кітаптар',
      icon: <LibraryBooksIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      path: '/admin/books',
      description: 'Кітаптарды басқару, жаңа кітаптарды қосу, ақпаратты өңдеу'
    },
    {
      title: 'Қарыздар',
      icon: <BookmarkIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      path: '/admin/borrows',
      description: 'Пайдаланушылардың кітаптарды қарызға алуын көру және басқару'
    },
    {
      title: 'Санаттар',
      icon: <CategoryIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      path: '/admin/categories',
      description: 'Кітап санаттарын басқару, жаңа санаттар қосу'
    }
  ];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <PageHeader 
        title="Әкімші басқару тақтасы" 
        subtitle={`Қош келдіңіз, ${user?.name || 'Әкімші'}`}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Статистика */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Пайдаланушылар"
            value={stats.users}
            icon={<PeopleIcon />}
            color="primary"
            subtitle="Жалпы пайдаланушылар саны"
            onClick={() => navigate('/admin/users')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Кітаптар"
            value={stats.books}
            icon={<LibraryBooksIcon />}
            color="info"
            subtitle="Кітапханадағы барлық кітаптар"
            onClick={() => navigate('/admin/books')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Қарыздар"
            value={stats.borrows}
            icon={<BookmarkIcon />}
            color="warning"
            subtitle="Белсенді қарыздар"
            onClick={() => navigate('/admin/borrows')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Санаттар"
            value={stats.categories}
            icon={<CategoryIcon />}
            color="success"
            subtitle="Кітап санаттары"
            onClick={() => navigate('/admin/categories')}
          />
        </Grid>
      </Grid>

      {/* Overdue Books Alert */}
      {overdueCount > 0 && (
        <Alert 
          severity="warning" 
          icon={<WarningIcon />}
          sx={{ mb: 4 }}
          action={
            <Box 
              component="span"
              onClick={() => navigate('/admin/borrows?status=overdue')}
              sx={{ 
                cursor: 'pointer', 
                textDecoration: 'underline', 
                '&:hover': { textDecoration: 'none' } 
              }}
            >
              Көру
            </Box>
          }
        >
          {overdueCount} кітаптың қайтару мерзімі өтіп кетті
        </Alert>
      )}

      <Divider sx={{ mb: 4 }} />

      {/* Main content grid */}
      <Grid container spacing={4}>
        {/* Left column */}
        <Grid item xs={12} md={8}>
          {/* Admin section cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {adminSections.map((section) => (
              <Grid item xs={12} sm={6} key={section.title}>
                <AdminCard
                  title={section.title}
                  icon={section.icon}
                  onClick={() => navigate(section.path)}
                  sx={{ 
                    transition: 'transform 0.2s',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: 6
                    }
                  }}
                >
                  <Box sx={{ p: 1, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {section.description}
                    </Typography>
                  </Box>
                </AdminCard>
              </Grid>
            ))}
          </Grid>
          
          {/* Top Borrowed Books */}
          <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Ең көп қарызға алынған кітаптар
            </Typography>
            <List>
              {trendingBooks.length > 0 ? trendingBooks.slice(0, 5).map((book, index) => (
                <ListItem key={book.id || book.bookId} divider={index < trendingBooks.length - 1}>
                  <ListItemAvatar>
                    <Avatar 
                      variant="rounded"
                      src={(book.book?.coverUrl || book.coverUrl) || '/images/default-book-cover.jpg'} 
                      alt={(book.book?.title || book.title)}
                    />
                  </ListItemAvatar>
                  <ListItemText 
                    primary={book.book?.title || book.title} 
                    secondary={`${book.book?.author || book.author} • ${book.borrowCount || book.bookmarkCount || 0} қарызға алу`} 
                  />
                </ListItem>
              )) : (
                <ListItem>
                  <ListItemText primary="Кітаптар табылмады" />
                </ListItem>
              )}
            </List>
          </Paper>
          
          {/* Yearly Statistics Chart */}
          <Box sx={{ mb: 4 }}>
            <DashboardChart />
          </Box>
        </Grid>
        
        {/* Right column */}
        <Grid item xs={12} md={4}>
          {/* Top Active Borrowers */}
          <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Белсенді оқырмандар
            </Typography>
            <List>
              {activeBorrowers.length > 0 ? activeBorrowers.slice(0, 5).map((borrower, index) => (
                <ListItem key={borrower.userId} divider={index < activeBorrowers.length - 1}>
                  <ListItemAvatar>
                    <Avatar>
                      {borrower.user?.name?.charAt(0) || 'U'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={borrower.user?.name || 'Пайдаланушы'} 
                    secondary={`${borrower.borrowCount} кітап қарызға алынған`} 
                  />
                </ListItem>
              )) : (
                <ListItem>
                  <ListItemText primary="Белсенді оқырмандар табылмады" />
                </ListItem>
              )}
            </List>
          </Paper>
          
          {/* Category Statistics */}
          <CategoryStats />
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;