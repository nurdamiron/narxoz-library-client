/**
 * src/pages/BookDetailsPage.jsx
 * 
 * Кітап толық мәліметтері беті
 * 
 * Бұл компонент кітаптың толық ақпаратын көрсетеді және кітапты алу/қайтару функционалын қамтамасыз етеді.
 * Ол bookController.js және borrowController.js бэкенд контроллерлерімен интеграцияланады.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useParams } from '../utils/hookUtils';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Grid,
  Typography,
  Divider,
  Button,
  Paper,
  Chip,
  Rating,
  IconButton,
  Breadcrumbs,
  Link,
  Skeleton,
  Alert,
  Snackbar,
  useMediaQuery,
  useTheme,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  ArrowBack,
  BookmarkBorder,
  Bookmark,
  LocalLibrary,
  CalendarToday,
  Language,
  Category,
  Check,
  ExpandMore,
  ExpandLess,
  Home,
  Info as InfoIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import bookService from '../services/bookService';
import bookmarkService from '../services/bookmarkService';
import borrowService from '../services/borrowService';
import apiClient from '../services/api';
import ReviewForm from '../components/books/ReviewForm';
import ReviewList from '../components/books/ReviewList';
import { getBookCoverUrl, truncateString } from '../utils';

/**
 * BookDetailsPage компоненті
 * 
 * @returns {JSX.Element} - Кітап толық мәліметтері беті
 */
const BookDetailsPage = () => {
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();
  
  // AuthContext мәліметтері
  const { isAuthenticated, user } = useAuth();
  
  // Кітап мәліметтері күйі
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Бетбелгі күйі
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  
  // Қарызға алу күйі
  const [borrowLoading, setBorrowLoading] = useState(false);
  const [borrowSuccess, setBorrowSuccess] = useState(false);
  const [borrowError, setBorrowError] = useState(null);
  const [hasAlreadyBorrowed, setHasAlreadyBorrowed] = useState(false);

  // Сипаттама күйі
  const [expanded, setExpanded] = useState(false);
  
  // Диалог күйі
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  
  // Пікірлер күйі
  const [reviewsRefreshTrigger, setReviewsRefreshTrigger] = useState(0);
  
  /**
   * Кітапты жүктеу функциясы
   */
  const fetchBook = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`DEBUG: Fetching book with ID: ${id}`);
      
      // Add direct API call instead of using the service for testing
      const response = await apiClient.get(`/books/${id}`);
      console.log('DEBUG: Raw API response:', response);
      
      // Check what kind of data structure you're getting
      const bookData = response.data;
      console.log('DEBUG: bookData structure:', bookData);
      
      // Handle both potential data structures
      let bookDetails;
      if (bookData && typeof bookData === 'object') {
        // Check if data is nested under a data property
        bookDetails = bookData.data || bookData;
        console.log('DEBUG: Extracted book details:', bookDetails);
        
        // Check if it has the expected properties
        if (bookDetails.id && bookDetails.title) {
          // Build the category object if needed
          const enhancedBook = {
            ...bookDetails,
            category: bookDetails.category || {
              id: bookDetails.categoryId,
              name: t('books.details.notSpecified')
            }
          };
          
          console.log('DEBUG: Enhanced book with category:', enhancedBook);
          setBook(enhancedBook);
          setIsBookmarked(!!enhancedBook.isBookmarked);
        } else {
          console.error('DEBUG: Book data missing required properties');
          throw new Error('Invalid book data - missing required properties');
        }
      } else {
        console.error('DEBUG: Invalid response format:', bookData);
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('DEBUG: Error fetching book:', err);
      console.error('DEBUG: Error details:', err.response || err.message);
      setError(t('books.errorLoading') + `: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [id]);
  
  /**
   * Бетбелгіні ауыстыру функциясы
   */
  const handleToggleBookmark = async () => {
    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }
    
    try {
      setBookmarkLoading(true);
      
      // API арқылы бетбелгіні ауыстыру
      const response = await bookmarkService.toggleBookmark(id);
      
      // Извлекаем состояние закладки из ответа API
      // baseService.js уже извлекает response.data, поэтому нам нужно обращаться к data.bookmarked
      const bookmarked = response.data?.bookmarked;
      
      console.log('🔖 BookDetailsPage - Bookmark toggle response:', response);
      console.log('🔖 BookDetailsPage - New bookmark status:', bookmarked);
      
      setIsBookmarked(bookmarked);
    } catch (error) {
      console.error(`${t('books.bookmarkError')}:`, error);
    } finally {
      setBookmarkLoading(false);
    }
  };
  
  /**
   * Кітапты қарызға алу функциясы
   */
  const handleBorrowBook = async () => {
    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }
    
    try {
      setBorrowLoading(true);
      setBorrowError(null);
      
      // API арқылы кітапты қарызға алу
      await borrowService.borrowBook({ bookId: id });
      
      // Сәтті болған жағдайда кітапты қайта жүктеу
      await fetchBook();
      
      // Сәтті хабарламаны көрсету
      setBorrowSuccess(true);
    } catch (error) {
      console.error(`${t('books.borrowError')}:`, error);
      
      // Сервер қайтарған қате хабарламасын тексеру
      if (error.response && error.response.data && error.response.data.error) {
        const errorMessage = error.response.data.error;
        setBorrowError(errorMessage);
        
        // Тексеру - егер пайдаланушы кітапты әлдеқашан алса
        if (errorMessage.includes('әлдеқашан қарызға алдыңыз')) {
          setHasAlreadyBorrowed(true);
        }
      } else {
        setBorrowError(t('books.borrowError'));
      }
    } finally {
      setBorrowLoading(false);
    }
  };
  

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  useEffect(() => {
    // Если книга загружена и есть информация о заимствованиях
    if (book && book.borrows && user && 
        book.borrows.some(borrow => borrow.userId === user.id && borrow.status === 'active')) {
      setHasAlreadyBorrowed(true);
    }
  }, [book, user]);

  /**
   * Сипаттаманы кеңейту/жию
   */
  const handleExpandDescription = () => {
    setExpanded(!expanded);
  };
  
  /**
   * Сәтті хабарламаны жабу
   */
  const handleCloseSuccess = () => {
    setBorrowSuccess(false);
  };
  
  /**
   * Кіру диалогын жабу
   */
  const handleCloseLoginDialog = () => {
    setLoginDialogOpen(false);
  };
  
  /**
   * Кіру бетіне бағыттау
   */
  const handleNavigateToLogin = () => {
    setLoginDialogOpen(false);
    navigate('/login', { state: { from: { pathname: `/books/${id}` } } });
  };
  
  // Мұқаба URL-ін дайындау
  const coverUrl = book && book.cover ? getBookCoverUrl(book.cover) : '/images/default-book-cover.jpg';
  
  // Мұқаба суретінің жүктелу оқиғасын өңдеу
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Нан қиқымдары (Breadcrumbs) */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" color="inherit" sx={{ display: 'flex', alignItems: 'center' }}>
          <Home sx={{ mr: 0.5, fontSize: 20 }} />
          {t('common.home')}
        </Link>
        <Link component={RouterLink} to="/books" color="inherit">
          {t('books.catalog')}
        </Link>
        <Typography color="text.primary" noWrap>
          {loading ? <Skeleton width={100} /> : book?.title}
        </Typography>
      </Breadcrumbs>
      
      {/* Артқа қайту түймесі */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        {t('books.details.backButton')}
      </Button>
      
      {/* Қате хабарламасы */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        // Жүктелу күйі
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Skeleton variant="rectangular" height={400} width="100%" sx={{ borderRadius: 2 }} />
            </Grid>
            <Grid item xs={12} md={8}>
              <Skeleton variant="text" height={60} width="80%" />
              <Skeleton variant="text" height={30} width="60%" sx={{ mb: 2 }} />
              <Skeleton variant="text" height={24} width="40%" sx={{ mb: 1 }} />
              <Skeleton variant="text" height={24} width="30%" sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={200} width="100%" sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={50} width={150} />
            </Grid>
          </Grid>
        </Paper>
      ) : book ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper sx={{ 
            p: { xs: 2, md: 3 }, 
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: theme.shadows[2]
          }}>
            <Grid container spacing={3}>
              {/* Кітап мұқабасы */}
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: theme.shadows[3],
                  aspectRatio: '2/3',
                  height: { xs: '350px', md: '450px' },
                  width: '100%'
                }}>
                  {!imageLoaded && (
                    <Skeleton 
                      variant="rectangular" 
                      animation="wave"
                      sx={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%'
                      }}
                    />
                  )}
                  <Box
                    component="img"
                    src={coverUrl}
                    alt={book.title}
                    onLoad={handleImageLoad}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: imageLoaded ? 1 : 0,
                      transition: 'opacity 0.3s ease-in-out'
                    }}
                  />
                </Box>
                
                {/* Кітапты қарызға алу түймесі - мобильді көрініс */}
                {isMobile && (
  <Box sx={{ mt: 3 }}>
    {hasAlreadyBorrowed ? (
      <Button
        variant="outlined"
        fullWidth
        size="large"
        startIcon={<InfoIcon />}
        disabled={true}
        sx={{ 
          mb: 1,
          color: 'warning.main',
          borderColor: 'warning.main',
        }}
      >
        {t('books.details.alreadyBorrowed')}
      </Button>
    ) : (
      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        startIcon={<LocalLibrary />}
        onClick={handleBorrowBook}
        disabled={
          borrowLoading || 
          book.availableCopies <= 0
        }
        sx={{ mb: 1 }}
      >
        {borrowLoading ? t('books.details.loading') : t('books.details.borrowButton')}
      </Button>
    )}
    
    {book.availableCopies <= 0 && !hasAlreadyBorrowed && (
      <Typography 
        variant="body2" 
        color="error"
        align="center"
        sx={{ mt: 1 }}
      >
        {t('books.details.currentlyUnavailable')}
      </Typography>
    )}
    
    {borrowError && !hasAlreadyBorrowed && (
      <Alert 
        severity="error" 
        sx={{ 
          mt: 2,
          borderRadius: 1,
          boxShadow: 1
        }}
      >
        {borrowError}
      </Alert>
    )}
  </Box>
)}
              </Grid>
              
              {/* Кітап туралы ақпарат */}
              <Grid item xs={12} md={8}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  mb: 1
                }}>
                  <Typography 
                    variant="h4" 
                    component="h1"
                    sx={{ 
                      fontWeight: 'bold',
                      mb: 1
                    }}
                  >
                    {book.title}
                  </Typography>
                  
                  {/* Бетбелгі түймесі */}
                                      <Tooltip title={isBookmarked ? t('books.removeFromBookmarks') : t('books.addToBookmarks')}>
                    <IconButton
                      onClick={handleToggleBookmark}
                      disabled={bookmarkLoading}
                      color="primary"
                      size="large"
                    >
                      {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                    </IconButton>
                  </Tooltip>
                </Box>
                
                {/* Автор */}
                <Typography 
                  variant="h6" 
                  component="div"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {book.author}
                </Typography>
                
                {/* Рейтинг */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mb: 3
                }}>
                  <Rating 
                    value={book.rating || 0} 
                    precision={0.5}
                    readOnly 
                  />
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    ({t('books.details.rating', { count: book.reviewCount || 0 })})
                  </Typography>
                </Box>
                
                {/* Негізгі ақпарат */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {/* Категория */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Category sx={{ color: 'primary.main', mr: 1 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {t('books.details.categoryLabel')}
                        </Typography>
                        <Typography variant="body1">
                        {book.category && book.category.name ? book.category.name : t('books.details.notSpecified')}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  {/* Жыл */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarToday sx={{ color: 'primary.main', mr: 1 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {t('books.details.publishedYear')}
                        </Typography>
                        <Typography variant="body1">
                        {book.publicationYear || t('books.details.notSpecified')}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  {/* Тіл */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Language sx={{ color: 'primary.main', mr: 1 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {t('books.details.languageLabel')}
                        </Typography>
                        <Typography variant="body1">
                          {book.language ? (t(`languages.${book.language}`) || t(book.language) || book.language) : t('books.details.notSpecified')}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  {/* ISBN */}
                  {book.isbn && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {t('books.details.isbn')}
                          </Typography>
                          <Typography variant="body1">
                            {book.isbn}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                  
                  {/* Қолжетімділік */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocalLibrary sx={{ 
                        color: book.availableCopies > 0 ? 'success.main' : 'error.main',
                        mr: 1
                      }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {t('books.details.availableCopiesLabel')}
                        </Typography>
                        <Typography 
                          variant="body1"
                          color={book.availableCopies > 0 ? 'success.main' : 'error.main'}
                        >
                          {book.availableCopies} / {book.totalCopies}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                
                {/* Сипаттама */}
                <Box sx={{ mb: 3 }}>
                  <Typography 
                    variant="h6" 
                    component="h2"
                    sx={{ 
                      fontWeight: 'bold',
                      mb: 1
                    }}
                  >
                    {t('books.details.descriptionTitle')}
                  </Typography>
                  
                  <Typography 
                    variant="body1"
                    sx={{
                      maxHeight: expanded ? 'none' : '100px',
                      overflow: 'hidden',
                      position: 'relative',
                      mb: 1
                    }}
                  >
                    {book.description}
                  </Typography>
                  
                  {book.description && book.description.length > 300 && (
                    <Button
                      endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
                      onClick={handleExpandDescription}
                      sx={{ mt: 1 }}
                    >
                      {expanded ? t('common.showLess') : t('common.showMore')}
                    </Button>
                  )}
                </Box>
                
                {/* Кітапты қарызға алу түймесі - десктоп көрініс */}
{!isMobile && (
  <Box>
    {hasAlreadyBorrowed ? (
      <Button
        variant="outlined"
        size="large"
        startIcon={<InfoIcon />}
        disabled={true}
        sx={{ 
          minWidth: '200px',
          py: 1.5,
          color: 'warning.main',
          borderColor: 'warning.main',
        }}
      >
        {t('books.details.alreadyBorrowed')}
      </Button>
    ) : (
      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<LocalLibrary />}
        onClick={handleBorrowBook}
        disabled={
          borrowLoading || 
          book.availableCopies <= 0
        }
        sx={{ 
          minWidth: '200px',
          py: 1.5
        }}
      >
        {borrowLoading ? t('books.details.loading') : t('books.details.borrowButton')}
      </Button>
    )}
    
    {book.availableCopies <= 0 && !hasAlreadyBorrowed && (
      <Typography 
        variant="body2" 
        color="error"
        sx={{ mt: 1 }}
      >
        {t('books.details.currentlyUnavailable')}
      </Typography>
    )}
    
    {borrowError && !hasAlreadyBorrowed && (
      <Alert 
        severity="error" 
        sx={{ mt: 2 }}
      >
        {borrowError}
      </Alert>
    )}
  </Box>
)}
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      ) : (
        <Alert severity="info">
          {t('books.details.bookNotFound')}
        </Alert>
      )}
      
      {/* Сәтті қарызға алу туралы хабарлама */}
      <Snackbar
        open={borrowSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {t('books.details.borrowSuccessMsg')}
        </Alert>
      </Snackbar>
      
      {/* Кіру диалогы */}
      <Dialog
        open={loginDialogOpen}
        onClose={handleCloseLoginDialog}
      >
        <DialogTitle>{t('books.details.loginRequired')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('books.details.loginDialogMsg')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLoginDialog}>{t('books.details.loginDialogNo')}</Button>
          <Button onClick={handleNavigateToLogin} color="primary" variant="contained">
            {t('books.details.loginDialogYes')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Пікірлер блогы */}
      {!loading && book && (
        <Box sx={{ mt: 4 }}>
          <Typography 
            variant="h5" 
            component="h2"
            sx={{ 
              fontWeight: 'bold',
              mb: 3
            }}
          >
            {t('books.details.reviewsTitle')}
          </Typography>
          
          {/* Пікір қалдыру формасы */}
          <ReviewForm 
            bookId={id} 
            onReviewSubmitted={() => setReviewsRefreshTrigger(prev => prev + 1)}
          />
          
          {/* Пікірлер тізімі */}
          <Box sx={{ mt: 3 }}>
            <ReviewList 
              bookId={id}
              refreshTrigger={reviewsRefreshTrigger}
            />
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default BookDetailsPage;