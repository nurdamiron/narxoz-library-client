/**
 * src/pages/BookDetailsPage.jsx
 * 
 * Кітап толық мәліметтері беті
 * 
 * Бұл компонент кітаптың толық ақпаратын көрсетеді және кітапты алу/қайтару функционалын қамтамасыз етеді.
 * Ол bookController.js және borrowController.js бэкенд контроллерлерімен интеграцияланады.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
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
  Home
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import bookService from '../services/bookService';
import bookmarkService from '../services/bookmarkService';
import borrowService from '../services/borrowService';
import apiClient from '../services/api'; // Import your API client

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
  
  // AuthContext мәліметтері
  const { isAuthenticated } = useAuth();
  
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
  
  // Сипаттама күйі
  const [expanded, setExpanded] = useState(false);
  
  // Диалог күйі
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  
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
              name: 'Көрсетілмеген'
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
      setError(`Кітап туралы ақпаратты жүктеу кезінде қате орын алды: ${err.message}`);
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
      setIsBookmarked(response.bookmarked);
    } catch (error) {
      console.error('Бетбелгі ауыстыру қатесі:', error);
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
      console.error('Кітапты қарызға алу қатесі:', error);
      setBorrowError(error.message || 'Кітапты қарызға алу кезінде қате орын алды');
    } finally {
      setBorrowLoading(false);
    }
  };
  

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);
  
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
  const coverUrl = book && book.cover
  ? (book.cover.startsWith('http') ? book.cover : `/uploads/books/${book.cover}`)
  : '/images/default-book-cover.jpg';
  
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
          Басты бет
        </Link>
        <Link component={RouterLink} to="/books" color="inherit">
          Кітаптар
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
        Артқа қайту
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
                      {borrowLoading ? 'Жүктелуде...' : 'Кітапты алу'}
                    </Button>
                    
                    {book.availableCopies <= 0 && (
                      <Typography 
                        variant="body2" 
                        color="error"
                        align="center"
                        sx={{ mt: 1 }}
                      >
                        Қазіргі уақытта қолжетімсіз
                      </Typography>
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
                                      <Tooltip title={isBookmarked ? "Бетбелгіден алып тастау" : "Бетбелгіге қосу"}>
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
                    ({book.reviewCount || 0} пікір)
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
                          Категория
                        </Typography>
                        <Typography variant="body1">
                        {book.category && book.category.name ? book.category.name : 'Көрсетілмеген'}
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
                          Жарияланған жыл
                        </Typography>
                        <Typography variant="body1">
                        {book.publicationYear || 'Көрсетілмеген'}
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
                          Тіл
                        </Typography>
                        <Typography variant="body1">
                          {book.language || 'Көрсетілмеген'}
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
                            ISBN
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
                          Қолжетімді даналар
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
                    Сипаттама
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
                      {expanded ? 'Жию' : 'Толығырақ'}
                    </Button>
                  )}
                </Box>
                
                {/* Кітапты қарызға алу түймесі - десктоп көрініс */}
                {!isMobile && (
                  <Box>
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
                      {borrowLoading ? 'Жүктелуде...' : 'Кітапты алу'}
                    </Button>
                    
                    {book.availableCopies <= 0 && (
                      <Typography 
                        variant="body2" 
                        color="error"
                        sx={{ mt: 1 }}
                      >
                        Қазіргі уақытта қолжетімсіз
                      </Typography>
                    )}
                    
                    {borrowError && (
                      <Alert severity="error" sx={{ mt: 2 }}>
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
          Кітап табылмады.
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
          Кітап сәтті қарызға алынды!
        </Alert>
      </Snackbar>
      
      {/* Кіру диалогы */}
      <Dialog
        open={loginDialogOpen}
        onClose={handleCloseLoginDialog}
      >
        <DialogTitle>Жүйеге кіру қажет</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Бұл әрекетті орындау үшін жүйеге кіру керек. Жүйеге кіру бетіне өткіңіз келе ме?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLoginDialog}>Жоқ</Button>
          <Button onClick={handleNavigateToLogin} color="primary" variant="contained">
            Жүйеге кіру
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookDetailsPage;