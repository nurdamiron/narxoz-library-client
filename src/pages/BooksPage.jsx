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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  
  // URL параметрлерін алу
  const queryParams = new URLSearchParams(location.search);
  
  // Күйлер
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
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
  
  // Жылдар тізімі (әдепкі)
  const currentYear = new Date().getFullYear();
  const defaultYearOptions = [currentYear, currentYear-1, currentYear-2, currentYear-3, currentYear-4, 2020, 2019, 2018, 2017, 2016, 2015, 2010, 2005, 2000];
  
  /**
   * Категориялар және фильтр опцияларын жүктеу
   */
  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        // Категорияларды жүктеу
        const categoriesData = await bookService.getCategories();
        setCategories(categoriesData.data || []);
        
        // Фильтр опцияларын жүктеу (тілдер мен жылдар)
        try {
          const filterOptions = await bookService.getFilterOptions();
          if (filterOptions.data) {
            setLanguages(filterOptions.data.languages || []);
            setAvailableYears(filterOptions.data.years || []);
          }
        } catch (filterErr) {
          console.log('Фильтр опцияларын жүктеу қатесі:', filterErr);
          // Әдепкі мәндерді қолдану
          setLanguages(['Казахский', 'Русский', 'Английский']);
        }
      } catch (err) {
        console.error(`${t('admin.errorLoadingCategories')}:`, err);
        showError(t('admin.errorLoadingCategories'));
      }
    };
    
    fetchFiltersData();
  }, [showError, t]);
  
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
        setTotalItems(result.total || result.count || 0);
      } catch (err) {
        console.error(`${t('books.errorLoading')}:`, err);
        setError(t('books.errorLoading', 'Кітаптарды жүктеу кезінде қате орын алды'));
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
   * @param {number} value - Жаңа бет нөірі
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
      const response = await bookmarkService.toggleBookmark(book.id);
      
      // Извлекаем состояние закладки из ответа API
      // baseService.js уже извлекает response.data, поэтому нам нужно обращаться к data.bookmarked
      const bookmarked = response.data?.bookmarked;
      
      console.log('🔖 Bookmark toggle response:', response);
      console.log('🔖 New bookmark status:', bookmarked);
      
      // Кітаптар тізімінде бетбелгі күйін жаңарту
      setBooks(prevBooks => 
        prevBooks.map(b => 
          b.id === book.id 
            ? { ...b, isBookmarked: bookmarked } 
            : b
        )
      );
      
      // Сәтті хабарламаны көрсету
      success(bookmarked
        ? t('books.bookmarkAdded')
        : t('books.bookmarkRemoved')
      );
    } catch (err) {
      console.error(`${t('books.bookmarkError')}:`, err);
      showError(t('books.bookmarkError'));
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
      success(t('books.borrowSuccess'));
      
      // Диалогты жабу
      handleCloseBorrowDialog();
    } catch (err) {
      console.error(`${t('books.borrowError')}:`, err);
      // Сервер қайтарған қате хабарламасын көрсету
      if (err.response && err.response.data && err.response.data.error) {
        showError(err.response.data.error);
      } else {
        showError(t('books.borrowError', 'Кітапты алу кезінде қате орын алды'));
      }
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
            {t('books.catalog')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('books.catalogDescription', 'Нархоз университеті кітапханасының кітаптар жинағын қараңыз')}
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
                years={availableYears.length > 0 ? availableYears : defaultYearOptions}
                languages={languages}
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
                // Используем текущее значение из состояния
                handleApplyFilters({ search: filters.search });
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder={t('books.searchPlaceholder', 'Кітаптарды атауы, авторы немесе сипаттамасы бойынша іздеу')}
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApplyFilters({ search: filters.search });
                  }
                }}
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
          title={t('books.borrowConfirmTitle', 'Кітапты алуды растау')}
          content={
            borrowDialog.book && (
              <Box>
                <Typography variant="body1" paragraph>
                  {t('books.borrowConfirmQuestion', { title: borrowDialog.book.title }, 'Сіз "{{title}}" кітабын алғыңыз келе ме?')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('books.borrowConfirmDescription', 'Кітап сіздің атыңызға 3 күнге (72 сағат) сақталады. Осы мерзім ішінде кітапханаға келіп, кітапты алуыңыз керек.')}
                </Typography>
              </Box>
            )
          }
          type="info"
          confirmText={t('common.confirm', 'Растау')}
          cancelText={t('common.cancel', 'Болдырмау')}
          onConfirm={handleConfirmBorrow}
          loading={borrowing}
        />
      </Container>
    </motion.div>
  );
};

export default BooksPage;