/**
 * src/components/books/BookFilters.jsx
 * 
 * Кітап фильтрлері компоненті
 * 
 * Бұл компонент кітаптарды сүзу үшін фильтрлер панелін көрсетеді.
 * Категория, жыл, тіл және қолжетімділік бойынша сүзгілеуге мүмкіндік береді.
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  IconButton,
  Collapse,
  InputAdornment,
  Chip,
  useTheme,
  useMediaQuery,
  alpha,
  Tooltip
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Sort as SortIcon,
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
  Language as LanguageIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/**
 * BookFilters компоненті
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {Array} props.categories - Категориялар тізімі
 * @param {Object} props.filters - Ағымдағы фильтрлер
 * @param {Function} props.onApplyFilters - Фильтрлерді қолдану функциясы
 * @param {Function} props.onClearFilters - Фильтрлерді тазалау функциясы
 * @param {Array} props.years - Жылдар тізімі (опциональді)
 * @param {Array} props.languages - Тілдер тізімі (опциональді)
 * @param {boolean} props.showActiveFilters - Белсенді фильтрлерді көрсету
 * @param {Object} props.sx - Қосымша Material UI стильдері
 * @returns {JSX.Element} - Фильтрлер панелі
 */
const BookFilters = ({
  categories = [],
  filters = {},
  onApplyFilters,
  onClearFilters,
  years = [],
  languages = ['Қазақша', 'Русский', 'English'],
  showActiveFilters = true,
  sx = {}
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();
  
  // Жергілікті фильтр күйлері
  const [localFilters, setLocalFilters] = useState({
    categoryId: '',
    year: '',
    language: '',
    available: false,
    sort: '-createdAt',
    search: '',
    ...filters
  });
  
  // Фильтрлер панелінің ашық/жабық күйі
  const [expanded, setExpanded] = useState(!isMobile);
  
  // Тазалау түймесі белсенді ме?
  const hasActiveFilters = 
    localFilters.categoryId ||
    localFilters.year ||
    localFilters.language ||
    localFilters.available ||
    (localFilters.sort !== '-createdAt') ||
    localFilters.search;
  
  // Белсенді фильтрлер тізімі
  const activeFilters = [];
  
  if (localFilters.search) {
    activeFilters.push({
      id: 'search',
      label: `${t('common.search')}: ${localFilters.search}`,
      value: localFilters.search,
      onDelete: () => handleFilterChange('search', '')
    });
  }
  
  if (localFilters.categoryId) {
    const category = categories.find(c => c.id === localFilters.categoryId);
    activeFilters.push({
      id: 'category',
      label: `${t('books.category')}: ${category ? category.name : localFilters.categoryId}`,
      value: localFilters.categoryId,
      onDelete: () => handleFilterChange('categoryId', '')
    });
  }
  
  if (localFilters.year) {
    activeFilters.push({
      id: 'year',
      label: `${t('admin.year')}: ${localFilters.year}`,
      value: localFilters.year,
      onDelete: () => handleFilterChange('year', '')
    });
  }
  
  if (localFilters.language) {
    activeFilters.push({
      id: 'language',
      label: `${t('books.language')}: ${localFilters.language}`,
      value: localFilters.language,
      onDelete: () => handleFilterChange('language', '')
    });
  }
  
  if (localFilters.available) {
    activeFilters.push({
      id: 'available',
      label: t('books.available'),
      value: true,
      onDelete: () => handleFilterChange('available', false)
    });
  }
  
  if (localFilters.sort && localFilters.sort !== '-createdAt') {
    let sortLabel = `${t('admin.sort', 'Сұрыптау')}: `;
    
    switch (localFilters.sort) {
      case '-publicationYear':
        sortLabel += t('filters.sortNewestFirst', 'Жаңадан ескіге');
        break;
      case 'publicationYear':
        sortLabel += t('filters.sortOldestFirst', 'Ескіден жаңаға');
        break;
      case 'title':
        sortLabel += t('filters.sortTitleAZ', 'Атауы (А-Я)');
        break;
      case '-title':
        sortLabel += t('filters.sortTitleZA', 'Атауы (Я-А)');
        break;
      case 'author':
        sortLabel += t('filters.sortAuthorAZ', 'Автор (А-Я)');
        break;
      case '-author':
        sortLabel += t('filters.sortAuthorZA', 'Автор (Я-А)');
        break;
      case '-rating':
        sortLabel += t('filters.sortRatingDesc', 'Рейтинг (жоғарыдан төменге)');
        break;
      case 'rating':
        sortLabel += t('filters.sortRatingAsc', 'Рейтинг (төменнен жоғарыға)');
        break;
      default:
        sortLabel += localFilters.sort;
    }
    
    activeFilters.push({
      id: 'sort',
      label: sortLabel,
      value: localFilters.sort,
      onDelete: () => handleFilterChange('sort', '-createdAt')
    });
  }
  
  // Фильтрлер өзгергенде жергілікті күйді жаңарту
  useEffect(() => {
    setLocalFilters({
      categoryId: '',
      year: '',
      language: '',
      available: false,
      sort: '-createdAt',
      search: '',
      ...filters
    });
  }, [filters]);
  
  /**
   * Фильтр мәнін өзгерту
   * 
   * @param {string} name - Фильтр атауы
   * @param {any} value - Жаңа мән
   */
  const handleFilterChange = (name, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  /**
   * Фильтрлерді қолдану
   */
  const handleApplyFilters = () => {
    if (onApplyFilters) {
      onApplyFilters(localFilters);
    }
  };
  
  /**
   * Фильтрлерді тазалау
   */
  const handleClearFilters = () => {
    const defaultFilters = {
      categoryId: '',
      year: '',
      language: '',
      available: false,
      sort: '-createdAt',
      search: ''
    };
    
    setLocalFilters(defaultFilters);
    
    if (onClearFilters) {
      onClearFilters();
    }
  };
  
  /**
   * Жылдар тізімін дайындау
   * 
   * @returns {Array} - Жылдар тізімі
   */
  const getYearOptions = () => {
    if (years && years.length > 0) {
      return years.sort((a, b) => b - a);
    }
    
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    
    for (let i = 0; i < 10; i++) {
      yearOptions.push(currentYear - i);
    }
    
    // Тарихи кітаптар үшін опциялар
    yearOptions.push(2010, 2000, 1990, 1980, 1950);
    
    return yearOptions.sort((a, b) => b - a);
  };
  
  // Анимация конфигурациясы
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        duration: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 2, 
        borderRadius: 2,
        overflow: 'hidden',
        ...sx
      }}
    >
      {/* Фильтрлер панелінің тақырыбы */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {t('books.filter.title', 'Фильтрлер')}
          </Typography>
        </Box>
        
        <Box>
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            sx={{ mr: 1 }}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          
          <Button
            startIcon={<ClearIcon />}
            onClick={handleClearFilters}
            disabled={!hasActiveFilters}
            size="small"
            sx={{
              opacity: hasActiveFilters ? 1 : 0.5
            }}
          >
            {t('books.filter.clear', 'Тазалау')}
          </Button>
        </Box>
      </Box>
      
      {/* Белсенді фильтрлер */}
      {showActiveFilters && activeFilters.length > 0 && (
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 1,
          mb: expanded ? 2 : 0 
        }}>
          <AnimatePresence>
            {activeFilters.map((filter) => (
              <motion.div
                key={filter.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Chip
                  label={filter.label}
                  onDelete={filter.onDelete}
                  color="primary"
                  variant="outlined"
                  size="small"
                  deleteIcon={<ClearIcon />}
                  sx={{
                    fontWeight: 'medium',
                    border: `1px solid ${theme.palette.primary.main}`,
                    '& .MuiChip-deleteIcon': {
                      color: theme.palette.primary.main,
                      '&:hover': {
                        color: theme.palette.primary.dark
                      }
                    }
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>
      )}
      
      {/* Іздеу */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder={t('books.searchPlaceholder', 'Кітаптарды іздеу...')}
          value={localFilters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          size="small"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: localFilters.search ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => handleFilterChange('search', '')}
                  edge="end"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />
      </Box>
      
      {/* Фильтрлер панелі */}
      <Collapse in={expanded}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Divider sx={{ mb: 2 }} />
          
          {/* Категория фильтрі */}
          <motion.div variants={itemVariants}>
            <FormControl 
              fullWidth 
              margin="normal" 
              size="small"
              sx={{ mb: 2 }}
            >
              <InputLabel id="category-label">
                {t('books.category', 'Категория')}
              </InputLabel>
              <Select
                labelId="category-label"
                id="category-select"
                value={localFilters.categoryId}
                label={t('books.category', 'Категория')}
                onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <CategoryIcon fontSize="small" sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                }
              >
                <MenuItem value="">
                  <em>{t('books.filter.allOptions', 'Барлығы')}</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </motion.div>
          
          {/* Жыл фильтрі */}
          <motion.div variants={itemVariants}>
            <FormControl 
              fullWidth 
              margin="normal" 
              size="small"
              sx={{ mb: 2 }}
            >
              <InputLabel id="year-label">
                {t('admin.year', 'Жыл')}
              </InputLabel>
              <Select
                labelId="year-label"
                id="year-select"
                value={localFilters.year}
                label={t('admin.year', 'Жыл')}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <CalendarIcon fontSize="small" sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                }
              >
                <MenuItem value="">
                  <em>{t('books.filter.allOptions', 'Барлығы')}</em>
                </MenuItem>
                {getYearOptions().map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </motion.div>
          
          {/* Тіл фильтрі */}
          <motion.div variants={itemVariants}>
            <FormControl 
              fullWidth 
              margin="normal" 
              size="small"
              sx={{ mb: 2 }}
            >
              <InputLabel id="language-label">
                {t('books.language', 'Тіл')}
              </InputLabel>
              <Select
                labelId="language-label"
                id="language-select"
                value={localFilters.language}
                label={t('books.language', 'Тіл')}
                onChange={(e) => handleFilterChange('language', e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <LanguageIcon fontSize="small" sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                }
              >
                <MenuItem value="">
                  <em>{t('books.filter.allOptions', 'Барлығы')}</em>
                </MenuItem>
                {languages.map((language) => (
                  <MenuItem key={language} value={language}>
                    {language}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </motion.div>
          
          {/* Қолжетімділік фильтрі */}
          <motion.div variants={itemVariants}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={localFilters.available}
                  onChange={(e) => handleFilterChange('available', e.target.checked)}
                  sx={{
                    color: 'primary.main',
                    '&.Mui-checked': {
                      color: 'primary.main',
                    }
                  }}
                />
              }
              label={t('books.available', 'Қолжетімді')}
              sx={{ mb: 2 }}
            />
          </motion.div>
          
          <Divider sx={{ mb: 2 }} />
          
          {/* Сұрыптау */}
          <motion.div variants={itemVariants}>
            <FormControl 
              fullWidth 
              margin="normal" 
              size="small"
              sx={{ mb: 2 }}
            >
              <InputLabel id="sort-label">
                {t('admin.sort', 'Сұрыптау')}
              </InputLabel>
              <Select
                labelId="sort-label"
                id="sort-select"
                value={localFilters.sort}
                label={t('admin.sort', 'Сұрыптау')}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <SortIcon fontSize="small" sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                }
              >
                <MenuItem value="-createdAt">
                  {t('filters.sortNewest', 'Ең жаңа')}
                </MenuItem>
                <MenuItem value="-publicationYear">
                  {t('filters.sortNewestFirst', 'Жаңадан ескіге')}
                </MenuItem>
                <MenuItem value="publicationYear">
                  {t('filters.sortOldestFirst', 'Ескіден жаңаға')}
                </MenuItem>
                <MenuItem value="title">
                  {t('filters.sortTitleAZ', 'Атауы (А-Я)')}
                </MenuItem>
                <MenuItem value="-title">
                  {t('filters.sortTitleZA', 'Атауы (Я-А)')}
                </MenuItem>
                <MenuItem value="author">
                  {t('filters.sortAuthorAZ', 'Автор (А-Я)')}
                </MenuItem>
                <MenuItem value="-author">
                  {t('filters.sortAuthorZA', 'Автор (Я-А)')}
                </MenuItem>
                <MenuItem value="-rating">
                  {t('filters.sortRatingDesc', 'Рейтинг (жоғарыдан төменге)')}
                </MenuItem>
                <MenuItem value="rating">
                  {t('filters.sortRatingAsc', 'Рейтинг (төменнен жоғарыға)')}
                </MenuItem>
              </Select>
            </FormControl>
          </motion.div>
          
          {/* Фильтрлерді қолдану түймесі */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleApplyFilters}
              startIcon={<CheckIcon />}
              sx={{
                py: 1,
                borderRadius: 2,
                boxShadow: theme.shadows[2],
                fontWeight: 'bold'
              }}
            >
              {t('books.filter.apply', 'Қолдану')}
            </Button>
          </motion.div>
        </motion.div>
      </Collapse>
    </Paper>
  );
};

BookFilters.propTypes = {
  categories: PropTypes.array,
  filters: PropTypes.object,
  onApplyFilters: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  years: PropTypes.array,
  languages: PropTypes.array,
  showActiveFilters: PropTypes.bool,
  sx: PropTypes.object
};

export default BookFilters;