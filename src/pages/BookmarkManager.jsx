import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Grid,
  IconButton,
  Alert,
  Snackbar,
  Skeleton,
  Divider,
  Chip,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  Book as BookIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import EmptyState from '../components/common/EmptyState';

/**
 * BookmarkManager компоненті
 * 
 * Бұл компонент пайдаланушының таңдаулы кітаптар (закладки) тізімін көрсетеді және басқарады.
 * API арқылы bookmarkController.js контроллерімен байланысады.
 * 
 * Функционалдық:
 * - Таңдаулы кітаптар тізімін жүктеу және көрсету
 * - Таңдаулы кітаптарды алып тастау
 * - Кітап бетіне навигация
 */
const BookmarkManager = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Компонент күйлері (state)
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  /**
   * Таңдаулы кітаптар тізімін жүктеу функциясы
   * 
   * API арқылы пайдаланушының таңдаулы кітаптар тізімін алады
   */
  const fetchBookmarks = useCallback(async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      
      // Жергілікті сақтаудан токенді алу
      const token = localStorage.getItem('token');
      
      // API сұрауын жіберу
      const response = await fetch('/api/bookmarks', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Сұрау сәтті болмаса қате көрсету
      if (!response.ok) {
        throw new Error(t('bookmarks.loadError'));
      }

      // Деректерді алу және күйге орнату
      const data = await response.json();
      setBookmarks(data.data);
      setError(null);
    } catch (err) {
      console.error('Ошибка при загрузке закладок:', err);
      setError(t('bookmarks.loadErrorDescription'));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, navigate]);

  /**
   * Таңдаулы кітапты алып тастау функциясы
   * 
   * @param {number} bookmarkId - Алып тастау керек таңдаулы кітап идентификаторы
   */
  const handleRemoveBookmark = async (bookmarkId) => {
    try {
      const token = localStorage.getItem('token');
      
      // API сұрауын жіберу - таңдаулы кітапты алып тастау
      const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Сұрау сәтті болмаса қате көрсету
      if (!response.ok) {
        throw new Error(t('bookmarks.deleteError'));
      }

      // Тізімді өзгерту арқылы күйді жаңарту (API сұрауын қайта жіберместен)
      setBookmarks((prevBookmarks) => 
        prevBookmarks.filter((bookmark) => bookmark.id !== bookmarkId)
      );

      // Хабарлама көрсету
      setSnackbar({
        open: true,
        message: t('bookmarks.deleteSuccess'),
        severity: 'success',
      });
    } catch (err) {
      console.error('Ошибка при удалении закладки:', err);
      setSnackbar({
        open: true,
        message: t('bookmarks.deleteError'),
        severity: 'error',
      });
    }
  };

  /**
   * Кітап бетіне өту функциясы
   * 
   * @param {number} bookId - Кітап идентификаторы
   */
  const handleViewBookDetails = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  /**
   * Snackbar хабарламасын жабу функциясы
   */
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Компонент құрылғанда таңдаулы кітаптар тізімін жүктеу
  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  /**
   * Таңдаулы кітаптың карточкасын құру
   * 
   * @param {Object} bookmark - Таңдаулы кітап объектісі
   * @returns {JSX.Element} - Карточка элементі
   */
  const renderBookmarkCard = (bookmark) => {
    const book = bookmark.book;
    return (
      <Card 
        key={bookmark.id} 
        elevation={2}
        sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          height: isMobile ? 'auto' : 200,
          transition: 'transform 0.2s, box-shadow 0.2s',
          "&:hover": {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[6],
          }
        }}
      >
        {/* Кітап мұқабасы */}
        <CardMedia
          component="img"
          sx={{ 
            width: isMobile ? '100%' : 140, 
            height: isMobile ? 200 : 'auto',
            objectFit: 'cover'
          }}
          image={book.cover ? `/uploads/books/${book.cover}` : '/images/default-book-cover.jpg'}
          alt={book.title}
        />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            {/* Категория */}
            {book.category && (
              <Chip 
                label={book.category.name} 
                size="small" 
                color="primary" 
                variant="outlined" 
                sx={{ mb: 1 }}
              />
            )}
            
            {/* Кітап атауы */}
            <Typography component="h5" variant="h6" gutterBottom noWrap>
              {book.title}
            </Typography>
            
            {/* Автор */}
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {book.author}
            </Typography>
            
            {/* Қосымша ақпарат */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {t('bookmarks.addedOn', { date: new Date(bookmark.addedAt).toLocaleDateString() })}
              </Typography>
            </Box>
          </CardContent>
          
          <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
            {/* Кітап егжей-тегжейіне көшу түймесі */}
            <Button 
              size="small" 
              startIcon={<InfoIcon />}
              onClick={() => handleViewBookDetails(book.id)}
            >
              {t('bookmarks.moreDetails')}
            </Button>
            
            {/* Таңдаулыдан жою түймесі */}
            <IconButton 
              color="error" 
              onClick={() => handleRemoveBookmark(bookmark.id)}
              size="small"
              aria-label={t('bookmarks.removeFromBookmarks')}
            >
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </Box>
      </Card>
    );
  };

  /**
   * Таңдаулы кітаптар тізімінің жүктелу күйін көрсету
   * 
   * @returns {JSX.Element} - Жүктелу күйі элементі
   */
  const renderSkeletons = () => {
    return Array(3).fill(0).map((_, index) => (
      <Card 
        key={`skeleton-${index}`} 
        sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          height: isMobile ? 'auto' : 200,
          mb: 2
        }}
      >
        <Skeleton 
          variant="rectangular" 
          sx={{ 
            width: isMobile ? '100%' : 140, 
            height: isMobile ? 200 : '100%' 
          }} 
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 2 }}>
          <Skeleton variant="text" width="40%" height={30} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="70%" height={40} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="50%" height={30} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Skeleton variant="rectangular" width={100} height={30} />
            <Skeleton variant="circular" width={30} height={30} />
          </Box>
        </Box>
      </Card>
    ));
  };

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      {/* Тақырып */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h1" fontWeight="bold">
          {t('bookmarks.myBookmarks')}
        </Typography>
        <Chip 
          icon={<BookmarkIcon />} 
          label={bookmarks.length === 1 ? t('bookmarks.booksCountSingular', { count: bookmarks.length }) : 
            (bookmarks.length >= 2 && bookmarks.length <= 4) ? t('bookmarks.booksCountFew', { count: bookmarks.length }) : t('bookmarks.booksCountMany', { count: bookmarks.length })} 
          color="primary"
          variant="outlined"
        />
      </Box>
      
      {/* Қате хабарламасы */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Жүктелу күйі */}
      {loading ? (
        <Box>
          {renderSkeletons()}
        </Box>
      ) : (
        <>
          {/* Таңдаулы кітаптар тізімі бос болған жағдайда */}
          {bookmarks.length === 0 ? (
            <EmptyState 
              icon={<BookmarkBorderIcon sx={{ fontSize: 60 }} />}
              title={t('bookmarks.noBookmarks')}
              description={t('bookmarks.noBookmarksDescription')}
              actionText={t('bookmarks.browseBooks')}
              actionIcon={<BookIcon />}
              onAction={() => navigate('/books')}
            />
          ) : (
            /* Таңдаулы кітаптар тізімі */
            <Grid container spacing={2}>
              {bookmarks.map((bookmark) => (
                <Grid item xs={12} key={bookmark.id}>
                  {renderBookmarkCard(bookmark)}
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
      
      {/* Хабарлама (Snackbar) */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BookmarkManager;