import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Typography,
  Link,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
  IconButton,
  Chip,
  Drawer,
  Fade,
  Slide,
  Tooltip,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Rating,
} from '@mui/material';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  SortByAlpha as SortByAlphaIcon,
  TuneOutlined as TuneOutlinedIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  BookmarkBorder as BookmarkBorderIcon,
  StarBorder as StarBorderIcon,
  CalendarToday as CalendarTodayIcon,
  LanguageOutlined as LanguageOutlinedIcon,
  SchoolOutlined as SchoolOutlinedIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import BookCard from '../components/books/BookCard';
import { 
  mockBooks, 
  categories, 
  years, 
  languages, 
  sortOptions, 
  delay 
} from '../data/mockData';

// Кітаптар тізімінің контейнері, адаптивті торды қолдайды
const BooksContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  gap: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: theme.spacing(2),
  },
}));

// Іздеу өрісінің контейнері
const SearchContainer = styled(Paper)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'box-shadow 0.3s',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
  },
}));

// Фильтр тақырыбының стилі
const FilterHeader = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'center',
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
    fontSize: '1.2rem',
    color: theme.palette.primary.main,
  },
}));

/**
 * BooksPage компоненті - кітаптар каталогын көрсету және фильтрлеу беті
 * 
 * Бұл компонент кітаптардың каталогын көрсетеді және оларды фильтрлеу мүмкіндігін ұсынады:
 * - Іздеу өрісі арқылы кітап атауын немесе автор атын іздеу
 * - Кітаптарды категория бойынша фильтрлеу
 * - Кітаптарды жарияланған жылы бойынша фильтрлеу
 * - Кітаптарды тілі бойынша фильтрлеу
 * - Тек қолжетімді кітаптарды көрсету опциясы
 * 
 * @returns {JSX.Element} - Кітаптар беті компоненті
 */
const BooksPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Компонент күйлері
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' немесе 'list'
  const [sortBy, setSortBy] = useState('newest');
  const [sortMenuAnchor, setSortMenuAnchor] = useState(null);
  
  /**
   * Кіру фильтрлерін URL параметрлерінен инициализациялау
   */
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategories(categoryParam.split(',').map(Number));
    }
    
    const yearParam = searchParams.get('year');
    if (yearParam) {
      setSelectedYears(yearParam.split(',').map(Number));
    }
    
    const languageParam = searchParams.get('language');
    if (languageParam) {
      setSelectedLanguages(languageParam.split(',').map(Number));
    }
    
    const availableParam = searchParams.get('available');
    if (availableParam === 'true') {
      setAvailableOnly(true);
    }
    
    const sortParam = searchParams.get('sort');
    if (sortParam) {
      setSortBy(sortParam);
    }
    
    const viewParam = searchParams.get('view');
    if (viewParam) {
      setViewMode(viewParam);
    }
  }, [searchParams]);
  
  /**
   * Кітаптарды жүктеу
   */
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      
      // Имитация задержки API
      await delay(800);
      
      // Фильтрация книг согласно параметрам
      let filteredBooks = [...mockBooks];
      
      // Фильтрация по поисковому запросу
      if (searchValue) {
        const search = searchValue.toLowerCase();
        filteredBooks = filteredBooks.filter(book => 
          book.title.toLowerCase().includes(search) || 
          book.author.toLowerCase().includes(search)
        );
      }
      
      // Фильтрация по категориям
      if (selectedCategories.length > 0) {
        filteredBooks = filteredBooks.filter(book => {
          // Находим id категории по имени
          const categoryObj = categories.find(c => c.name === book.category);
          return categoryObj && selectedCategories.includes(categoryObj.id);
        });
      }
      
      // Фильтрация по годам
      if (selectedYears.length > 0) {
        filteredBooks = filteredBooks.filter(book => {
          const year = book.publicationYear;
          // Проверяем, попадает ли год в выбранные диапазоны
          return selectedYears.some(selectedYear => {
            const yearObj = years.find(y => y.id === selectedYear);
            if (yearObj) {
              if (yearObj.name === '2022-2023') return year >= 2022 && year <= 2023;
              if (yearObj.name === '2020-2021') return year >= 2020 && year <= 2021;
              if (yearObj.name === '2018-2019') return year >= 2018 && year <= 2019;
              if (yearObj.name === 'До 2018') return year < 2018;
            }
            return false;
          });
        });
      }
      
      // Фильтрация по доступности
      if (availableOnly) {
        filteredBooks = filteredBooks.filter(book => book.available);
      }
      
      // Сортировка
      switch (sortBy) {
        case 'title':
          filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'author':
          filteredBooks.sort((a, b) => a.author.localeCompare(b.author));
          break;
        case 'rating':
          filteredBooks.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
        default:
          filteredBooks.sort((a, b) => b.publicationYear - a.publicationYear);
          break;
      }
      
      setBooks(filteredBooks);
      setLoading(false);
    };
    
    fetchBooks();
  }, [searchValue, selectedCategories, selectedYears, selectedLanguages, availableOnly, sortBy, searchParams]);
  
  /**
   * Іздеу формасын жіберу
   * 
   * @param {Event} e - Форма жіберу оқиғасы
   */
  const handleSearch = (e) => {
    e.preventDefault();
    
    const params = new URLSearchParams(searchParams);
    
    if (searchValue) {
      params.set('search', searchValue);
    } else {
      params.delete('search');
    }
    
    setSearchParams(params);
  };
  
  /**
   * Сұрыптау менюсін ашу
   * 
   * @param {Event} event - Оқиға объектісі
   */
  const handleSortMenuOpen = (event) => {
    setSortMenuAnchor(event.currentTarget);
  };
  
  /**
   * Сұрыптау менюсін жабу
   */
  const handleSortMenuClose = () => {
    setSortMenuAnchor(null);
  };
  
  /**
   * Сұрыптау әдісін өзгерту
   * 
   * @param {string} method - Сұрыптау әдісі
   */
  const handleSortChange = (method) => {
    setSortBy(method);
    setSortMenuAnchor(null);
    
    const params = new URLSearchParams(searchParams);
    params.set('sort', method);
    setSearchParams(params);
  };
  
  /**
   * Көріну режимін өзгерту (тор немесе тізім)
   * 
   * @param {string} mode - Көріну режимі ('grid' немесе 'list')
   */
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    
    const params = new URLSearchParams(searchParams);
    params.set('view', mode);
    setSearchParams(params);
  };
  
  /**
   * Категория фильтрін өзгерту
   * 
   * @param {number} id - Категория идентификаторы
   */
  const handleCategoryChange = (id) => {
    const newSelectedCategories = selectedCategories.includes(id)
      ? selectedCategories.filter((cat) => cat !== id)
      : [...selectedCategories, id];
    
    setSelectedCategories(newSelectedCategories);
    
    const params = new URLSearchParams(searchParams);
    
    if (newSelectedCategories.length > 0) {
      params.set('category', newSelectedCategories.join(','));
    } else {
      params.delete('category');
    }
    
    setSearchParams(params);
  };
  
  /**
   * Жыл фильтрін өзгерту
   * 
   * @param {number} id - Жыл идентификаторы
   */
  const handleYearChange = (id) => {
    const newSelectedYears = selectedYears.includes(id)
      ? selectedYears.filter((year) => year !== id)
      : [...selectedYears, id];
    
    setSelectedYears(newSelectedYears);
    
    const params = new URLSearchParams(searchParams);
    
    if (newSelectedYears.length > 0) {
      params.set('year', newSelectedYears.join(','));
    } else {
      params.delete('year');
    }
    
    setSearchParams(params);
  };
  
  /**
   * Тіл фильтрін өзгерту
   * 
   * @param {number} id - Тіл идентификаторы
   */
  const handleLanguageChange = (id) => {
    const newSelectedLanguages = selectedLanguages.includes(id)
      ? selectedLanguages.filter((lang) => lang !== id)
      : [...selectedLanguages, id];
    
    setSelectedLanguages(newSelectedLanguages);
    
    const params = new URLSearchParams(searchParams);
    
    if (newSelectedLanguages.length > 0) {
      params.set('language', newSelectedLanguages.join(','));
    } else {
      params.delete('language');
    }
    
    setSearchParams(params);
  };
  
  /**
   * "Тек қолжетімді" фильтрін өзгерту
   * 
   * @param {Event} e - Checkbox өзгерісінің оқиғасы
   */
  const handleAvailableOnlyChange = (e) => {
    const checked = e.target.checked;
    setAvailableOnly(checked);
    
    const params = new URLSearchParams(searchParams);
    
    if (checked) {
      params.set('available', 'true');
    } else {
      params.delete('available');
    }
    
    setSearchParams(params);
  };
  
  /**
   * Фильтрлерді тазалау
   */
  const clearAllFilters = () => {
    setSearchValue('');
    setSelectedCategories([]);
    setSelectedYears([]);
    setSelectedLanguages([]);
    setAvailableOnly(false);
    setSortBy('newest');
    
    setSearchParams({});
  };
  
  /**
   * Бет тақырыбын URL параметрлері негізінде қалыптастыру
   * 
   * @returns {string} - Беттің тақырыбы
   */
  const getPageTitle = () => {
    if (searchParams.get('search')) {
      return `Результаты поиска: "${searchParams.get('search')}"`;
    } else if (searchParams.get('category')) {
      const categoryIds = searchParams.get('category').split(',').map(Number);
      if (categoryIds.length === 1) {
        const category = categories.find((c) => c.id === categoryIds[0]);
        return `Категория: ${category ? category.name : ''}`;
      } else {
        return 'Выбранные категории';
      }
    } else if (searchParams.get('popular') === 'true') {
      return 'Популярные книги';
    } else {
      return 'Каталог книг';
    }
  };
  
  /**
   * Таңдалған фильтрлер санын есептеу
   * 
   * @returns {number} - Таңдалған фильтрлер саны
   */
  const getActiveFiltersCount = () => {
    return (
      selectedCategories.length +
      selectedYears.length +
      selectedLanguages.length +
      (availableOnly ? 1 : 0)
    );
  };
  
  /**
   * Фильтрлерді көрсететін чиптер
   * 
   * @returns {JSX.Element[]} - Фильтр чиптерінің массиві
   */
  const renderFilterChips = () => {
    const chips = [];
    
    // Категория чиптері
    selectedCategories.forEach(catId => {
      const category = categories.find(c => c.id === catId);
      if (category) {
        chips.push(
          <Chip
            key={`cat-${catId}`}
            label={category.name}
            onDelete={() => handleCategoryChange(catId)}
            color="primary"
            variant="outlined"
            size="small"
            sx={{ m: 0.5 }}
          />
        );
      }
    });
    
    // Жылдар чиптері
    selectedYears.forEach(yearId => {
      const year = years.find(y => y.id === yearId);
      if (year) {
        chips.push(
          <Chip
            key={`year-${yearId}`}
            label={`Год: ${year.name}`}
            onDelete={() => handleYearChange(yearId)}
            color="primary"
            variant="outlined"
            size="small"
            sx={{ m: 0.5 }}
          />
        );
      }
    });
    
    // Тілдер чиптері
    selectedLanguages.forEach(langId => {
      const language = languages.find(l => l.id === langId);
      if (language) {
        chips.push(
          <Chip
            key={`lang-${langId}`}
            label={`Язык: ${language.name}`}
            onDelete={() => handleLanguageChange(langId)}
            color="primary"
            variant="outlined"
            size="small"
            sx={{ m: 0.5 }}
          />
        );
      }
    });
    
    // "Тек қолжетімді" чипі
    if (availableOnly) {
      chips.push(
        <Chip
          key="available"
          label="Только доступные"
          onDelete={() => handleAvailableOnlyChange({ target: { checked: false } })}
          color="primary"
          variant="outlined"
          size="small"
          sx={{ m: 0.5 }}
        />
      );
    }
    
    return chips;
  };
  
  /**
   * Фильтрлер компоненті
   * 
   * @returns {JSX.Element} - Фильтрлер компоненті
   */
  const FiltersComponent = () => (
    <Box sx={{ p: 2 }}>
      {/* Іздеу формасы */}
      <form onSubmit={handleSearch}>
        <TextField
          fullWidth
          placeholder="Поиск книг..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
            endAdornment: searchValue && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => {
                    setSearchValue('');
                    const params = new URLSearchParams(searchParams);
                    params.delete('search');
                    setSearchParams(params);
                  }}
                  edge="end"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          variant="outlined"
          size="small"
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
      </form>

      <Divider sx={{ mb: 2.5 }} />

      {/* Категориялар фильтрі */}
      <Box sx={{ mb: 3 }}>
        <FilterHeader>
          <BookmarkBorderIcon />
          Категории
        </FilterHeader>
        <FormGroup>
          {categories.map((category) => (
            <FormControlLabel
              key={category.id}
              control={
                <Checkbox
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  size="small"
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  {category.name}
                </Typography>
              }
              sx={{ mb: 0.5 }}
            />
          ))}
        </FormGroup>
      </Box>

      <Divider sx={{ mb: 2.5 }} />

      {/* Жылдар фильтрі */}
      <Box sx={{ mb: 3 }}>
        <FilterHeader>
          <CalendarTodayIcon />
          Год издания
        </FilterHeader>
        <FormGroup>
          {years.map((year) => (
            <FormControlLabel
              key={year.id}
              control={
                <Checkbox
                  checked={selectedYears.includes(year.id)}
                  onChange={() => handleYearChange(year.id)}
                  size="small"
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  {year.name}
                </Typography>
              }
              sx={{ mb: 0.5 }}
            />
          ))}
        </FormGroup>
      </Box>

      <Divider sx={{ mb: 2.5 }} />

      {/* Тілдер фильтрі */}
      <Box sx={{ mb: 3 }}>
        <FilterHeader>
          <LanguageOutlinedIcon />
          Язык
        </FilterHeader>
        <FormGroup>
          {languages.map((language) => (
            <FormControlLabel
              key={language.id}
              control={
                <Checkbox
                  checked={selectedLanguages.includes(language.id)}
                  onChange={() => handleLanguageChange(language.id)}
                  size="small"
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  {language.name}
                </Typography>
              }
              sx={{ mb: 0.5 }}
            />
          ))}
        </FormGroup>
      </Box>

      <Divider sx={{ mb: 2.5 }} />

      {/* Қолжетімділік фильтрі */}
      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={availableOnly}
              onChange={handleAvailableOnlyChange}
              color="primary"
            />
          }
          label={<Typography variant="body2">Только доступные</Typography>}
        />
      </Box>

      {/* Фильтрлерді тазалау түймесі */}
      <Button
        variant="outlined"
        color="primary"
        fullWidth
        onClick={clearAllFilters}
        startIcon={<ClearIcon />}
        disabled={getActiveFiltersCount() === 0}
        sx={{ 
          borderRadius: 2,
          py: 1,
        }}
      >
        Сбросить фильтры
      </Button>
    </Box>
  );

  return (
    <Box>
      {/* Breadcrumbs - навигация сілтемелері */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          component={RouterLink}
          underline="hover"
          color="inherit"
          to="/"
        >
          Главная
        </Link>
        <Typography color="text.primary">{getPageTitle()}</Typography>
      </Breadcrumbs>

      {/* Іздеу және сұрыптау панелі */}
      <SearchContainer>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h5" component="h1" fontWeight="bold" sx={{ mr: 1 }}>
                {getPageTitle()}
              </Typography>
              {/* Белсенді фильтрлер саны (тек мобильді құрылғыларда) */}
              {isMobile && getActiveFiltersCount() > 0 && (
                <Chip
                  label={getActiveFiltersCount()}
                  size="small"
                  color="primary"
                />
              )}
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, gap: 1 }}>
              {/* Фильтрлер түймесі (тек мобильді құрылғыларда) */}
              {isMobile && (
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  onClick={() => setFiltersOpen(true)}
                  size="small"
                  sx={{ 
                    borderRadius: 2,
                    borderColor: getActiveFiltersCount() > 0 ? theme.palette.primary.main : undefined
                  }}
                  color={getActiveFiltersCount() > 0 ? "primary" : "inherit"}
                >
                  Фильтры
                  {getActiveFiltersCount() > 0 && (
                    <Chip
                      label={getActiveFiltersCount()}
                      size="small"
                      color="primary"
                      sx={{ ml: 1, height: 20, minWidth: 20 }}
                    />
                  )}
                </Button>
              )}
              
              {/* Сұрыптау түймесі */}
              <Button
                variant="outlined"
                startIcon={<SortByAlphaIcon />}
                onClick={handleSortMenuOpen}
                size="small"
                sx={{ borderRadius: 2 }}
              >
                {sortOptions.find(opt => opt.id === sortBy)?.name || 'Сортировка'}
              </Button>
              
              {/* Көріну режимін ауыстыру түймелері */}
              <Tooltip title="Вид сетки">
                <IconButton
                  size="small"
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                  onClick={() => handleViewModeChange('grid')}
                  sx={{ 
                    border: viewMode === 'grid' ? `1px solid ${theme.palette.primary.main}` : '1px solid transparent',
                    borderRadius: 1
                  }}
                >
                  <ViewModuleIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Вид списка">
                <IconButton
                  size="small"
                  color={viewMode === 'list' ? 'primary' : 'default'}
                  onClick={() => handleViewModeChange('list')}
                  sx={{ 
                    border: viewMode === 'list' ? `1px solid ${theme.palette.primary.main}` : '1px solid transparent',
                    borderRadius: 1
                  }}
                >
                  <ViewListIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
        
        {/* Таңдалған фильтрлер чиптері */}
        {getActiveFiltersCount() > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2, mx: -0.5 }}>
            {renderFilterChips()}
            
            <Button
              variant="text"
              size="small"
              onClick={clearAllFilters}
              startIcon={<ClearIcon />}
              sx={{ m: 0.5, ml: 1 }}
            >
              Очистить все
            </Button>
          </Box>
        )}
      </SearchContainer>
      
      {/* Сұрыптау менюсі */}
      <Menu
        anchorEl={sortMenuAnchor}
        open={Boolean(sortMenuAnchor)}
        onClose={handleSortMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {sortOptions.map((option) => (
          <MenuItem 
            key={option.id} 
            onClick={() => handleSortChange(option.id)}
            selected={sortBy === option.id}
          >
            <ListItemIcon>
              {option.id === 'newest' && <CalendarTodayIcon fontSize="small" />}
              {option.id === 'title' && <SortByAlphaIcon fontSize="small" />}
              {option.id === 'author' && <SortByAlphaIcon fontSize="small" />}
              {option.id === 'rating' && <StarBorderIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText primary={option.name} />
            {sortBy === option.id && (
              <ArrowDownwardIcon fontSize="small" sx={{ ml: 1 }} />
            )}
          </MenuItem>
        ))}
      </Menu>

      <Grid container spacing={3}>
        {/* Десктоп үшін тұрақты фильтрлер панелі */}
        {!isMobile && (
          <Grid item xs={12} md={3} lg={2.5}>
            <Paper 
              sx={{ 
                borderRadius: 3,
                overflow: 'hidden',
                position: 'sticky',
                top: 90,
                boxShadow: theme.shadows[1],
                transition: 'box-shadow 0.3s',
                '&:hover': {
                  boxShadow: theme.shadows[3],
                },
              }}
            >
              <FiltersComponent />
            </Paper>
          </Grid>
        )}

        {/* Кітаптар тізімі */}
        <Grid item xs={12} md={isMobile ? 12 : 9} lg={isMobile ? 12 : 9.5}>
          {loading ? (
            // Жүктелу индикаторы
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
              <CircularProgress />
            </Box>
          ) : books.length > 0 ? (
            viewMode === 'grid' ? (
              // Тор көрінісі
              <BooksContainer>
                {books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </BooksContainer>
            ) : (
              // Тізім көрінісі
              <Stack spacing={2}>
                {books.map((book) => (
                  <Paper
                    key={book.id}
                    sx={{
                      display: 'flex',
                      borderRadius: 2,
                      overflow: 'hidden',
                      transition: 'box-shadow 0.3s, transform 0.3s',
                      '&:hover': {
                        boxShadow: theme.shadows[6],
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 80, sm: 100, md: 120 },
                        height: { xs: 120, sm: 150, md: 180 },
                        position: 'relative',
                      }}
                    >
                      <Box
                        component="img"
                        src={book.cover}
                        alt={book.title}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      {/* Қолжетімділік белгісі */}
                      <Chip
                        label={book.available ? "В наличии" : "Нет в наличии"}
                        color={book.available ? "success" : "error"}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          fontSize: '0.7rem',
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <Box sx={{ mb: 1 }}>
                        <Chip
                          label={book.category}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                          }}
                        />
                      </Box>
                      
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                          fontWeight: 600,
                          mb: 0.5,
                          fontSize: { xs: '1rem', md: '1.1rem' },
                        }}
                      >
                        {book.title}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {book.author}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 'auto' }}>
                        <Rating
                          value={parseFloat(book.rating)}
                          precision={0.5}
                          size="small"
                          readOnly
                        />
                        <Typography variant="body2" color="text.secondary">
                          {book.rating} ({book.reviewCount})
                        </Typography>
                      </Box>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 2, 
                        flexWrap: 'wrap',
                        gap: 1
                      }}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5, fontSize: '1rem', opacity: 0.7 }} />
                          {book.publicationYear}
                        </Typography>
                        
                        <Button
                          component={RouterLink}
                          to={`/books/${book.id}`}
                          variant="contained"
                          size="small"
                          sx={{ 
                            borderRadius: 1.5,
                            minWidth: { xs: 'auto', sm: 120 }
                          }}
                          disabled={!book.available}
                        >
                          {book.available ? "Взять книгу" : "Недоступна"}
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            )
          ) : (
            // Кітаптар табылмаған жағдайда
            <Paper
              sx={{
                p: 4,
                textAlign: 'center',
                borderRadius: 3,
                boxShadow: 'none',
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Книги не найдены
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Попробуйте изменить параметры поиска или выбрать другую категорию.
              </Typography>
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={clearAllFilters}
                sx={{ mt: 2 }}
              >
                Сбросить фильтры
              </Button>
            </Paper>
          )}
        </Grid>
      </Grid>
      
      {/* Мобильді құрылғылар үшін фильтрлер панелі (Drawer) */}
      <Drawer
        anchor="left"
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '85%', sm: 350 },
            borderRadius: '0 16px 16px 0',
            px: 1,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Фильтры
          </Typography>
          <IconButton onClick={() => setFiltersOpen(false)}>
            <ClearIcon />
          </IconButton>
        </Box>
        
        <Divider sx={{ mb: 1 }} />
        
        <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
          <FiltersComponent />
        </Box>
        
        <Divider sx={{ mt: 1 }} />
        
        <Box sx={{ p: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => setFiltersOpen(false)}
            sx={{ borderRadius: 2, py: 1.2 }}
          >
            Применить фильтры
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default BooksPage;