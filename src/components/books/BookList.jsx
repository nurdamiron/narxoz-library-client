/**
 * src/components/books/BookList.jsx
 * 
 * Кітаптар тізімі компоненті
 * 
 * Бұл компонент кітаптар тізімін көрсетеді, сүзгілеу, іздеу және беттеу функционалын қамтамасыз етеді.
 * Ол bookController.js бэкенд контроллерімен интеграцияланады.
 */
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Pagination,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Chip,
  Button,
  useMediaQuery,
  useTheme,
  Paper,
  Divider,
  IconButton,
  Collapse,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  ExpandMore,
  ExpandLess,
  SortByAlpha,
  Clear,
  Today
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import BookCard from './BookCard';
import { getBooks, getCategories } from '../../services/bookService';

/**
 * BookList компоненті
 * 
 * @returns {JSX.Element} - Кітаптар тізімі
 */
const BookList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  
  // URL-ден параметрлерді алу
  const queryParams = new URLSearchParams(location.search);
  
  // Беттеу және іздеу күйлері
  const [currentPage, setCurrentPage] = useState(parseInt(queryParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(queryParams.get('search') || '');
  const [tempSearchQuery, setTempSearchQuery] = useState(queryParams.get('search') || '');
  
  // Сүзгі параметрлері
  const [selectedCategory, setSelectedCategory] = useState(queryParams.get('categoryId') || '');
  const [selectedYear, setSelectedYear] = useState(queryParams.get('year') || '');
  const [selectedLanguage, setSelectedLanguage] = useState(queryParams.get('language') || '');
  const [onlyAvailable, setOnlyAvailable] = useState(queryParams.get('available') === 'true');
  const [sortOption, setSortOption] = useState(queryParams.get('sort') || '-createdAt');
  
  // Деректер күйлері
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Интерфейс күйлері
  const [filtersOpen, setFiltersOpen] = useState(!isMobile);
  
  // Категориялар тізімін алу
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Категорияларды жүктеу қатесі:', err);
      }
    };
    
    fetchCategories();
  }, []);
  
  // URL өзгергенде кітаптарды жүктеу
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = {
          page: currentPage,
          limit: 12, // бір бетте көрсетілетін кітаптар саны
          sort: sortOption
        };
        
        // Іздеу параметрлерін қосу
        if (searchQuery) params.search = searchQuery;
        if (selectedCategory) params.categoryId = selectedCategory;
        if (selectedYear) params.year = selectedYear;
        if (selectedLanguage) params.language = selectedLanguage;
        if (onlyAvailable) params.available = true;
        
        // Кітаптар деректерін алу
        const result = await getBooks(params);
        setBooks(result.data);
        setTotalPages(result.totalPages);
        
        // URL-ді жаңарту
        updateURL(params);
      } catch (err) {
        console.error('Кітаптарды жүктеу қатесі:', err);
        setError('Кітаптарды жүктеу кезінде қате орын алды. Қайталап көріңіз.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, [currentPage, searchQuery, selectedCategory, selectedYear, selectedLanguage, onlyAvailable, sortOption]);
  
  /**
   * URL-ді жаңарту функциясы
   * 
   * @param {Object} params - URL параметрлері
   */
  const updateURL = (params) => {
    const queryString = new URLSearchParams();
    
    // Барлық параметрлерді қосу
    if (params.page > 1) queryString.set('page', params.page);
    if (params.search) queryString.set('search', params.search);
    if (params.categoryId) queryString.set('categoryId', params.categoryId);
    if (params.year) queryString.set('year', params.year);
    if (params.language) queryString.set('language', params.language);
    if (params.available) queryString.set('available', 'true');
    if (params.sort && params.sort !== '-createdAt') queryString.set('sort', params.sort);
    
    // URL-ді жаңарту
    const newURL = queryString.toString() ? `?${queryString.toString()}` : '';
    navigate(`/books${newURL}`, { replace: true });
  };
  
  /**
   * Беттеу өзгерісін өңдеу
   * 
   * @param {Event} event - Оқиға
   * @param {number} value - Жаңа бет нөмірі
   */
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo(0, 0);
  };
  
  /**
   * Іздеу формасын жіберу
   * 
   * @param {Event} e - Форма жіберу оқиғасы
   */
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(tempSearchQuery);
    setCurrentPage(1);
  };
  
  /**
   * Іздеу сұрауын тазалау
   */
  const clearSearch = () => {
    setTempSearchQuery('');
    setSearchQuery('');
    setCurrentPage(1);
  };
  
  /**
   * Жылды текшеру функциясы (1000-нан бастап ағымдағы жылға дейін)
   * 
   * @param {string} value - Тексерілетін мән
   * @returns {boolean} - Жарамды жыл ма
   */
  const isValidYear = (value) => {
    const year = parseInt(value);
    const currentYear = new Date().getFullYear();
    return !isNaN(year) && year >= 1000 && year <= currentYear;
  };
  
  /**
   * Сүзгілерді тазалау
   */
  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedYear('');
    setSelectedLanguage('');
    setOnlyAvailable(false);
    setSortOption('-createdAt');
    setCurrentPage(1);
  };
  
  // Жылдар тізімін жасау
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    for (let i = 0; i < 10; i++) {
      years.push(currentYear - i);
    }
    
    // Тарихи кітаптар үшін бірнеше опцияларды қосу
    years.push(2010, 2000, 1990, 1980, 1950);
    
    return years.sort((a, b) => b - a);
  };
  
  // Карточкалар анимациясы
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <Box sx={{ py: 3, px: isMobile ? 1 : 3 }}>
      {/* Тақырып және сүзгі түймесі */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Кітаптар каталогы
        </Typography>
        
        {isMobile && (
          <IconButton 
            onClick={() => setFiltersOpen(!filtersOpen)}
            color="primary"
            sx={{ ml: 1 }}
          >
            <FilterListIcon />
          </IconButton>
        )}
      </Box>
      
      {/* Іздеу және сүзгілер */}
      <Grid container spacing={3}>
        {/* Сүзгілер панелі */}
        <Grid item xs={12} md={3}>
          <Collapse in={filtersOpen} timeout="auto">
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2, 
                mb: isMobile ? 2 : 0,
                borderRadius: 2
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 2  
              }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Сүзгілер
                </Typography>
                
                <Button 
                  size="small" 
                  onClick={clearFilters}
                  disabled={!selectedCategory && !selectedYear && !selectedLanguage && !onlyAvailable && sortOption === '-createdAt'}
                  startIcon={<Clear />}
                >
                  Тазалау
                </Button>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              {/* Категория сүзгісі */}
              <FormControl fullWidth margin="normal" size="small">
                <InputLabel id="category-label">Категория</InputLabel>
                <Select
                  labelId="category-label"
                  id="category-select"
                  value={selectedCategory}
                  label="Категория"
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <MenuItem value="">Барлығы</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {/* Жыл сүзгісі */}
              <FormControl fullWidth margin="normal" size="small">
                <InputLabel id="year-label">Жыл</InputLabel>
                <Select
                  labelId="year-label"
                  id="year-select"
                  value={selectedYear}
                  label="Жыл"
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <MenuItem value="">Барлық жылдар</MenuItem>
                  {getYearOptions().map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {/* Тіл сүзгісі */}
              <FormControl fullWidth margin="normal" size="small">
                <InputLabel id="language-label">Тіл</InputLabel>
                <Select
                  labelId="language-label"
                  id="language-select"
                  value={selectedLanguage}
                  label="Тіл"
                  onChange={(e) => {
                    setSelectedLanguage(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <MenuItem value="">Барлық тілдер</MenuItem>
                  <MenuItem value="Қазақша">Қазақша</MenuItem>
                  <MenuItem value="Русский">Орысша</MenuItem>
                  <MenuItem value="English">Ағылшынша</MenuItem>
                </Select>
              </FormControl>
              
              {/* Қол жетімділік сүзгісі */}
              <FormGroup sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={onlyAvailable}
                      onChange={(e) => {
                        setOnlyAvailable(e.target.checked);
                        setCurrentPage(1);
                      }}
                    />
                  }
                  label="Тек қолжетімді кітаптар"
                />
              </FormGroup>
              
              <Divider sx={{ my: 2 }} />
              
              {/* Сұрыптау */}
              <Typography variant="subtitle2" gutterBottom>
                Сұрыптау
              </Typography>
              
              <FormControl fullWidth margin="normal" size="small">
                <InputLabel id="sort-label">Сұрыптау</InputLabel>
                <Select
                  labelId="sort-label"
                  id="sort-select"
                  value={sortOption}
                  label="Сұрыптау"
                  onChange={(e) => {
                    setSortOption(e.target.value);
                    setCurrentPage(1);
                  }}
                  startAdornment={
                    <InputAdornment position="start">
                      <SortByAlpha fontSize="small" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="-createdAt">Жаңадан ескіге</MenuItem>
                  <MenuItem value="createdAt">Ескіден жаңаға</MenuItem>
                  <MenuItem value="-rating">Рейтинг (жоғарыдан төменге)</MenuItem>
                  <MenuItem value="title">Атауы (А-дан Я-ға)</MenuItem>
                  <MenuItem value="-title">Атауы (Я-дан А-ға)</MenuItem>
                  <MenuItem value="-publicationYear">Жыл (жаңадан ескіге)</MenuItem>
                  <MenuItem value="publicationYear">Жыл (ескіден жаңаға)</MenuItem>
                </Select>
              </FormControl>
            </Paper>
          </Collapse>
        </Grid>
        
        {/* Негізгі контент */}
        <Grid item xs={12} md={9}>
          {/* Іздеу компоненті */}
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
            onSubmit={handleSearch}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Кітаптарды атауы, авторы немесе сипаттамасы бойынша іздеу"
              value={tempSearchQuery}
              onChange={(e) => setTempSearchQuery(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: tempSearchQuery && (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={clearSearch} size="small">
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ ml: 1, height: 40 }}
              disabled={!tempSearchQuery.trim()}
            >
              Іздеу
            </Button>
          </Paper>

          {/* Белсенді сүзгілер чиптері */}
          {(selectedCategory || selectedYear || selectedLanguage || onlyAvailable || searchQuery) && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {searchQuery && (
                <Chip
                  label={`Іздеу: ${searchQuery}`}
                  onDelete={clearSearch}
                  color="primary"
                  variant="outlined"
                />
              )}
              
              {selectedCategory && (
                <Chip
                  label={`Категория: ${categories.find(c => c.id.toString() === selectedCategory.toString())?.name || selectedCategory}`}
                  onDelete={() => {
                    setSelectedCategory('');
                    setCurrentPage(1);
                  }}
                  color="primary"
                  variant="outlined"
                />
              )}
              
              {selectedYear && (
                <Chip
                  label={`Жыл: ${selectedYear}`}
                  onDelete={() => {
                    setSelectedYear('');
                    setCurrentPage(1);
                  }}
                  color="primary"
                  variant="outlined"
                />
              )}
              
              {selectedLanguage && (
                <Chip
                  label={`Тіл: ${selectedLanguage}`}
                  onDelete={() => {
                    setSelectedLanguage('');
                    setCurrentPage(1);
                  }}
                  color="primary"
                  variant="outlined"
                />
              )}
              
              {onlyAvailable && (
                <Chip
                  label="Тек қолжетімді кітаптар"
                  onDelete={() => {
                    setOnlyAvailable(false);
                    setCurrentPage(1);
                  }}
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          )}

          {/* Кітаптар тізімі */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : books.length === 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              Кітаптар табылмады. Іздеу сұрауын немесе сүзгілерді өзгертіп көріңіз.
            </Alert>
          ) : (
            <>
              {/* Нәтижелер санауышы */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {books.length} кітап табылды
                </Typography>
              </Box>
              
              {/* Кітаптар тізімі */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Grid container spacing={isMobile ? 2 : 3}>
                  {books.map((book) => (
                    <Grid item xs={12} sm={6} md={isTablet ? 6 : 4} lg={4} key={book.id}>
                      <motion.div variants={itemVariants}>
                        <BookCard book={book} />
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            </>
          )}

          {/* Пагинация */}
          {totalPages > 1 && !loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? "small" : "medium"}
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookList;