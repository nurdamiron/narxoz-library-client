/**
 * src/pages/BooksPage.jsx
 * 
 * Кітаптар каталогы беті (Жаңартылған нұсқа)
 * 
 * Бұл компонент кітаптар каталогын көрсетеді, іздеу, сүзгілеу және беттеу функционалын қамтамасыз етеді.
 * Жаңартылған дизайн мен анимациялар қосылған.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Fade,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Локальные компоненты
import BookGrid from '../components/books/BookGrid';
import BookFilters from '../components/books/BookFilters';
import AlertDialog from '../components/common/AlertDialog';

// Контексты и хуки
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Сервисы
import bookService from '../services/bookService';
import bookmarkService from '../services/bookmarkService';
import borrowService from '../services/borrowService';

/**
 * BooksPage компоненті
 * 
 * @returns {JSX.Element} - Кітаптар каталогы беті
 */
const BooksPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { success, error: showError } = useToast();
  
  // URL параметрлерін алу
  const queryParams = new URLSearchParams(location.search);
  
  // Күйлер
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [borrowDialog, setBorrowDialog] = useState({
    open: false,
    book: null
  });
  const [borrowing, setBorrowing] = useState(false);
  
  // Фильтрлер
  const [filters, setFilters] = useState({
    page: parseInt(queryParams.get('page')) || 1,
    limit: parseInt(queryParams.get('limit')) || 12,
    search: queryParams.get('search') || '',
    categoryId: queryParams.get('categoryId') || '',
    year: queryParams.get('year') || '',
    language: queryParams.get('language') || '',
    available: queryParams.get('available') === 'true',
    sort: queryParams.get('sort') || '-createdAt'
  });
  
  // Жылдар тізімі
  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear, currentYear-1, currentYear-2, currentYear-3, currentYear-4, 2020, 2019, 2018, 2017, 2016, 2015, 2010, 2005, 2000];
  
  /**
   * Категориялар тізімін жүктеу
   */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await bookService();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Категорияларды жүктеу қатесі:', err);
        showError('Категорияларды жүктеу кезінде қате орын алды');
      }
    };
    
    fetchCategories();
  }, [showError]);
  
  /**
   * URL параметрлерін жаңарту
   * 
   * @param {Object} params - URL параметрлері
   */
  const updateURLParams = useCallback((params) => {
    const queryString = new URLSearchParams();
    
    // Тек бос емес параметрлерді қосу
    if (params.page > 1) queryString.set('page', params.page);
    if (params.limit !== 12) queryString.set('limit', params.limit);
    if (params.search) queryString.set('search', params.search);
    if (params.categoryId) queryString.set('categoryId', params.categoryId);
    if (params.year) queryString.set('year', params.year);
    if (params.language) queryString.set('language', params.language);
    if (params.available) queryString.set('available', 'true');
    if (params.sort && params.sort !== '-createdAt') queryString.set('sort', params.sort);
    
    // URL-ді жаңарту
    const newURL = queryString.toString() ? `?${queryString.toString()}` : '';
    navigate(`/books${newURL}`, { replace: true });
  }, [navigate]);
  
  /**
   * Фильтрлер өзгергенде кітаптарды жүктеу
   */
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await bookService.getBooks(filters);
        setBooks(result.data);
        setTotalPages(result.totalPages);
        setTotalItems(result.totalItems);
      } catch (err) {
        console.error('Кітаптарды жүктеу қатесі:', err);
        setError('Кітаптарды жүктеу кезінде қате орын алды');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
    updateURLParams(filters);
  }, [filters, updateURLParams]);
  
  /**
   * Фильтрлерді қолдану
   * 
   * @param {Object} newFilters - Жаңа фильтрлер
   */
  const handleApplyFilters = (newFilters) => {
    setFilters({
      ...filters,
      ...newFilters,
      page: 1 // Фильтрлер өзгергенде бірінші бетке оралу
    });
  };
  
  /**
   * Фильтрлерді тазалау
   */
  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      search: '',
      categoryId: '',
      year: '',
      language: '',
      available: false,
      sort: '-createdAt'
    });
  };
  
  /**
   * Бет өзгерісін өңдеу
   * 
   * @param {Event} event - Оқиға объектісі
   * @param {number} value - Жаңа бет нөмірі
   */
  const handlePageChange = (event, value) => {
    setFilters({
      ...filters,
      page: value
    });
    
    // Беттің жоғарғы жағына айналдыру
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  /**
   * Бетбелгіні ауыстыру
   * 
   * @param {Object} book - Кітап объектісі
   */
  const handleToggleBookmark = async (book) => {
    try {
      const isBookmarked = await bookmarkService.toggleBookmark(book.id);
      
      // Кітаптар тізімінде бетбелгі күйін жаңарту
      setBooks(prevBooks => 
        prevBooks.map(b => 
          b.id === book.id 
            ? { ...b, isBookmarked } 
            : b
        )
      );
      
      // Сәтті хабарламаны көрсету
      success(isBookmarked
        ? 'Кітап бетбелгілерге қосылды'
        : 'Кітап бетбелгілерден алып тасталды'
      );
    } catch (err) {
      console.error('Бетбелгі ауыстыру қатесі:', err);
      showError('Бетбелгіні өзгерту кезінде қате орын алды');
    }
  };
  
  /**
   * Кітапты алу түймесін басқанда
   * 
   * @param {Object} book - Кітап объектісі
   */
  const handleBorrowClick = (book) => {
    setBorrowDialog({
      open: true,
      book
    });
  };
  
  /**
   * Кітапты алу диалогын жабу
   */
  const handleCloseBorrowDialog = () => {
    setBorrowDialog({
      open: false,
      book: null
    });
  };
  
  /**
   * Кітапты алуды растау
   */
  const handleConfirmBorrow = async () => {
    if (!borrowDialog.book) return;
    
    try {
      setBorrowing(true);
      
      // Кітапты алу API сұрауы
      await borrowService.borrowBook({ bookId: borrowDialog.book.id });
      
      // Кітаптар тізімінде қолжетімділік санын жаңарту
      setBooks(prevBooks => 
        prevBooks.map(b => 
          b.id === borrowDialog.book.id 
            ? { 
                ...b, 
                availableCopies: Math.max(0, b.availableCopies - 1)
              } 
            : b
        )
      );
      
      // Сәтті хабарламаны көрсету
      success('Кітап сәтті алынды! Кітапханадан алуыңызға болады.');
      
      // Диалогты жабу
      handleCloseBorrowDialog();
    } catch (err) {
      console.error('Кітапты алу қатесі:', err);
      showError('Кітапты алу кезінде қате орын алды');
    } finally {
      setBorrowing(false);
    }
  };
  
  /**
   * Кіру бетіне бағыттау
   */
  const handleNavigateToLogin = () => {
    navigate('/login', { 
      state: { from: location.pathname + location.search } 
    });
  };
  
  // Анимация конфигурациясы
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.5
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Тақырып */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Кітаптар каталогы
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Нархоз университеті кітапханасының кітаптар жинағын қараңыз
          </Typography>
        </Box>
        
        {/* Іздеу және сүзгілер */}
        <Grid container spacing={3}>
          {/* Сүзгілер панелі */}
          <Grid item xs={12} md={3}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <BookFilters
                categories={categories}
                filters={filters}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                years={yearOptions}
              />
            </motion.div>
          </Grid>
          
          {/* Кітаптар тізімі */}
          <Grid item xs={12} md={9}>
            {/* Іздеу құралы */}
            <Paper
              component="form"
              elevation={2}
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
              }}
              onSubmit={(e) => {
                e.preventDefault();
                handleApplyFilters(filters);
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Кітаптарды атауы, авторы немесе сипаттамасы бойынша іздеу"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: filters.search && (
                    <InputAdornment position="end">
                      <IconButton 
                        edge="end" 
                        onClick={() => handleApplyFilters({ search: '' })}
                        size="small"
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Paper>
            
            {/* Кітаптар торы */}
            <Fade in={true} timeout={500}>
              <Box>
                <BookGrid
                  books={books}
                  onToggleBookmark={handleToggleBookmark}
                  onBorrow={handleBorrowClick}
                  loading={loading}
                  error={error}
                  currentPage={filters.page}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  onPageChange={handlePageChange}
                  isAuthenticated={isAuthenticated}
                  onLoginClick={handleNavigateToLogin}
                />
              </Box>
            </Fade>
          </Grid>
        </Grid>
        
        {/* Кітапты алу диалогы */}
        <AlertDialog
          open={borrowDialog.open}
          onClose={handleCloseBorrowDialog}
          title="Кітапты алуды растау"
          content={
            borrowDialog.book && (
              <Box>
                <Typography variant="body1" paragraph>
                  Сіз "{borrowDialog.book.title}" кітабын алғыңыз келе ме?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Кітап сіздің атыңызға 3 күнге (72 сағат) сақталады. Осы мерзім ішінде кітапханаға келіп, кітапты алуыңыз керек.
                </Typography>
              </Box>
            )
          }
          type="info"
          confirmText="Растау"
          cancelText="Болдырмау"
          onConfirm={handleConfirmBorrow}
          loading={borrowing}
        />
      </Container>
    </motion.div>
  );
};

export default BooksPage;