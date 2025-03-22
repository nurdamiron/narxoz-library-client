// src/pages/BooksPage.jsx
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
  Box,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Bookmark as BookmarkIcon,
  Sort as SortIcon
} from '@mui/icons-material';

// Импорт хуков и сервисов
import useBooks  from '../hooks/useBooks';
import useBookmarks from '../hooks/useBookmarks';
import useAuth from '../context/AuthContext';
import useToast from '../context/ToastContext';
import { getBookCoverUrl } from '../utils';

const BooksPage = () => {
  const { isAuthenticated } = useAuth();
  const { 
    books, 
    categories, 
    totalItems, 
    totalPages, 
    filters, 
    loading, 
    error,
    updateFilters
  } = useBooks({
    page: 1,
    limit: 12,
    sort: '-publicationYear'
  });
  
  const { toggleBookmark } = useBookmarks();
  const { success, error: showError } = useToast();
  
  // Состояние UI
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [loadingBookmark, setLoadingBookmark] = useState(false);
  
  // Состояние фильтров
  const [filterValues, setFilterValues] = useState({
    categoryId: '',
    year: '',
    language: '',
    sort: '-publicationYear'
  });
  
  // Изменение фильтров
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterValues({
      ...filterValues,
      [name]: value
    });
  };
  
  // Применение фильтров
  const applyFilters = () => {
    updateFilters({
      ...filterValues,
      page: 1,
      search: searchTerm
    });
  };
  
  // Сброс фильтров
  const resetFilters = () => {
    setFilterValues({
      categoryId: '',
      year: '',
      language: '',
      sort: '-publicationYear'
    });
    setSearchTerm('');
    updateFilters({
      page: 1,
      limit: 12,
      sort: '-publicationYear'
    });
  };
  
  // Изменение страницы
  const handlePageChange = (event, value) => {
    updateFilters({ page: value });
  };
  
  // Поиск при нажатии Enter
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  };
  
  // Добавление/удаление закладки
  const handleToggleBookmark = async (book, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      showError('Бетбелгі қосу үшін жүйеге кіру қажет');
      return;
    }
    
    try {
      setLoadingBookmark(true);
      const isBookmarked = await toggleBookmark(book.id);
      
      // Обновляем состояние книги
      book.isBookmarked = isBookmarked;
      
      success(isBookmarked 
        ? 'Кітап бетбелгілерге қосылды' 
        : 'Кітап бетбелгілерден алынды'
      );
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      showError('Бетбелгіні өзгерту кезінде қате орын алды');
    } finally {
      setLoadingBookmark(false);
    }
  };
  
  // Анимации
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };
  
  // Рендеринг книги
  const renderBook = (book) => (
    <Card 
      elevation={2} 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6
        }
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={getBookCoverUrl(book.cover)}
        alt={book.title}
        sx={{ objectFit: 'contain' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="div" gutterBottom noWrap>
          {book.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {book.author}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
          {book.category && (
            <Chip 
              label={book.category.name} 
              size="small" 
              variant="outlined"
            />
          )}
          <Chip 
            label={`${book.publicationYear} ж.`} 
            size="small" 
            variant="outlined"
            color="secondary"
          />
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button 
          size="small" 
          component={RouterLink} 
          to={`/books/${book.id}`}
        >
          Толығырақ
        </Button>
        
        <IconButton
          color={book.isBookmarked ? "secondary" : "default"}
          size="small"
          onClick={(e) => handleToggleBookmark(book, e)}
          disabled={loadingBookmark}
          sx={{ ml: 'auto' }}
          aria-label={book.isBookmarked ? "Бетбелгіден алу" : "Бетбелгіге қосу"}
        >
          {book.isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
        </IconButton>
      </CardActions>
    </Card>
  );
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Кітаптар каталогы
        </Typography>
        
        {/* Поиск и фильтры */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Іздеу"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          setSearchTerm('');
                          if (filters.search) {
                            updateFilters({ search: '', page: 1 });
                          }
                        }}
                        edge="end"
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={() => setFilterOpen(!filterOpen)}
                  sx={{ flexGrow: 1 }}
                >
                  {filterOpen ? 'Фильтрлерді жасыру' : 'Фильтрлер'}
                </Button>
                
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<ClearIcon />}
                  onClick={resetFilters}
                >
                  Тазалау
                </Button>
              </Box>
            </Grid>
          </Grid>
          
          {filterOpen && (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Категория</InputLabel>
                  <Select
                    name="categoryId"
                    value={filterValues.categoryId}
                    onChange={handleFilterChange}
                    label="Категория"
                  >
                    <MenuItem value="">Барлығы</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Жыл"
                  name="year"
                  value={filterValues.year}
                  onChange={handleFilterChange}
                  placeholder="мысалы: 2020"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Тіл</InputLabel>
                  <Select
                    name="language"
                    value={filterValues.language}
                    onChange={handleFilterChange}
                    label="Тіл"
                  >
                    <MenuItem value="">Барлығы</MenuItem>
                    <MenuItem value="Қазақша">Қазақша</MenuItem>
                    <MenuItem value="Русский">Русский</MenuItem>
                    <MenuItem value="English">English</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Сұрыптау</InputLabel>
                  <Select
                    name="sort"
                    value={filterValues.sort}
                    onChange={handleFilterChange}
                    label="Сұрыптау"
                    startAdornment={
                      <InputAdornment position="start">
                        <SortIcon />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="-publicationYear">Жаңадан ескіге</MenuItem>
                    <MenuItem value="publicationYear">Ескіден жаңаға</MenuItem>
                    <MenuItem value="title">Атауы (А-Я)</MenuItem>
                    <MenuItem value="-title">Атауы (Я-А)</MenuItem>
                    <MenuItem value="author">Автор (А-Я)</MenuItem>
                    <MenuItem value="-author">Автор (Я-А)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={applyFilters}
                  fullWidth
                >
                  Іздеу
                </Button>
              </Grid>
            </Grid>
          )}
        </Paper>
        
        {/* Результаты поиска */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress />
          </Box>
        ) : books.length === 0 ? (
          <Paper elevation={2} sx={{ p: 4, textAlign: 'center', my: 4 }}>
            <Typography variant="h6" gutterBottom>
              Кітаптар табылмады
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Іздеу параметрлерін өзгертіп көріңіз
            </Typography>
            <Button
              variant="outlined"
              onClick={resetFilters}
              sx={{ mt: 2 }}
              startIcon={<ClearIcon />}
            >
              Фильтрлерді тазалау
            </Button>
          </Paper>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3}>
              {books.map((book) => (
                <Grid item key={book.id} xs={12} sm={6} md={4} lg={3}>
                  <motion.div variants={itemVariants}>
                    {renderBook(book)}
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}
        
        {/* Пагинация */}
        {!loading && books.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={filters.page || 1}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
        
        {/* Информация о количестве */}
        {!loading && books.length > 0 && (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            Көрсетілген: {books.length} из {totalItems} кітап
          </Typography>
        )}
      </Container>
    </motion.div>
  );
};

export default BooksPage;