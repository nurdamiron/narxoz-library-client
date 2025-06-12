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
import EventIcon from '@mui/icons-material/Event';
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
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    users: 0,
    books: 0,
    borrows: 0,
    categories: 0
  });
  const [overdueCount, setOverdueCount] = useState(0);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

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
        
        // Get overdue borrows count
        const overdue = await dashboardService.getOverdueBorrows();
        setOverdueCount(overdue);
        
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError(t('admin.dashboardDataError', 'Произошла ошибка при загрузке данных. Повторите попытку.'));
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [t]);

  const { user } = useAuth();
  const isModerator = user && user.role === 'moderator';
  
  // Админ панелі бөлімдеріне арналған карточкалар
  // Filter sections based on user role
  const allSections = [
    {
      title: t('admin.users', 'Пользователи'),
      icon: <PeopleIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      path: '/admin/users',
      description: t('admin.usersDescription', 'Управление пользователями системы, добавление новых пользователей и изменение ролей'),
      roles: ['admin'] // Only for admins
    },
    {
      title: t('admin.books', 'Книги'),
      icon: <LibraryBooksIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      path: '/admin/books',
      description: t('admin.booksDescription', 'Управление книгами, добавление новых книг, редактирование информации'),
      roles: ['admin', 'moderator'] // For admins and moderators
    },
    {
      title: t('admin.borrows', 'Заимствования'),
      icon: <BookmarkIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      path: '/admin/borrows',
      description: t('admin.borrowsDescription', 'Просмотр и управление заимствованиями книг пользователями'),
      roles: ['admin', 'moderator'] // For admins and moderators
    },
    {
      title: t('admin.categories', 'Категории'),
      icon: <CategoryIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      path: '/admin/categories',
      description: t('admin.categoriesDescription', 'Управление категориями книг, добавление новых категорий'),
      roles: ['admin'] // Only for admins
    },
    {
      title: t('events.admin.title', 'Мероприятия'),
      icon: <EventIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      path: '/admin/events',
      description: t('events.admin.description', 'Создание и управление мероприятиями, семинарами и активностями'),
      roles: ['admin', 'moderator'] // For admins and moderators
    }
  ];
  
  // Filter sections based on user role
  const adminSections = allSections.filter(section => 
    section.roles.includes(user?.role || 'admin')
  );

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
        title={t('admin.dashboard', 'Панель управления')} 
        subtitle={t('admin.welcomeUser', 'Добро пожаловать, {{name}}', { name: user?.name || t('common.adminRole', 'Администратор') })}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Статистика - show different stats for admin vs moderator */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {!isModerator && (
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              titleKey="admin.users"
              title={t('admin.users', 'Пользователи')}
              value={stats.users}
              icon={<PeopleIcon />}
              color="primary"
              subtitleKey="admin.totalUsers"
              subtitle={t('admin.totalUsers', 'Всего пользователей')}
              onClick={() => navigate('/admin/users')}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={6} md={isModerator ? 4 : 3}>
          <StatCard
            titleKey="admin.books"
            title={t('admin.books', 'Книги')}
            value={stats.books}
            icon={<LibraryBooksIcon />}
            color="info"
            subtitleKey="admin.totalBooks"
            subtitle={t('admin.totalBooks', 'Всего книг в библиотеке')}
            onClick={() => navigate('/admin/books')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={isModerator ? 4 : 3}>
          <StatCard
            titleKey="admin.borrows"
            title={t('admin.borrows', 'Заимствования')}
            value={stats.borrows}
            icon={<BookmarkIcon />}
            color="warning"
            subtitleKey="admin.activeLoans"
            subtitle={t('admin.activeLoans', 'Активные заимствования')}
            onClick={() => navigate('/admin/borrows')}
          />
        </Grid>
        {!isModerator && (
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              titleKey="admin.categories"
              title={t('admin.categories', 'Категории')}
              value={stats.categories}
              icon={<CategoryIcon />}
              color="success"
              subtitle={t('admin.bookCategories', 'Категории книг')}
              onClick={() => navigate('/admin/categories')}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={6} md={isModerator ? 4 : 3}>
          <StatCard
            titleKey="events.admin.title"
            title={t('events.admin.title', 'Мероприятия')}
            value={stats.events || 0}
            icon={<EventIcon />}
            color="secondary"
            subtitle={t('events.upcoming', 'Предстоящие мероприятия')}
            onClick={() => navigate('/admin/events')}
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
              {t('common.view', 'Просмотр')}
            </Box>
          }
        >
          {t('admin.overdueBooks', '{{count}} книг просрочено', { count: overdueCount })}
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
              {t('admin.topBorrowedBooks', 'Наиболее востребованные книги')}
            </Typography>
            <List>
              {trendingBooks.length > 0 ? trendingBooks.slice(0, 5).map((book, index) => (
                <ListItem key={book.id || book.bookId} divider={index < trendingBooks.length - 1}>
                  <ListItemAvatar>
                    <Avatar 
                      variant="rounded"
                      src={(book.book?.coverUrl || book.coverUrl) || '/images/no-image.png'} 
                      alt={(book.book?.title || book.title)}
                    />
                  </ListItemAvatar>
                  <ListItemText 
                    primary={book.book?.title || book.title} 
                    secondary={t('admin.authorAndBorrows', '{{author}} • {{count}} заимствований', { 
                      author: (book.book?.author || book.author || '').split(',')[0],
                      count: book.borrowCount || book.bookmarkCount || 0
                    })} 
                  />
                </ListItem>
              )) : (
                <ListItem>
                  <ListItemText primary={t('books.noBooks', 'Книги не найдены')} />
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
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;