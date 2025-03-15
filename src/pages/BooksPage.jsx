import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import BookList from '../components/books/BookList';

// Тестовые данные для фильтров
const categories = [
  { id: 1, name: 'Бизнес' },
  { id: 2, name: 'Экономика' },
  { id: 3, name: 'Финансы' },
  { id: 4, name: 'Маркетинг' },
  { id: 5, name: 'Менеджмент' },
  { id: 6, name: 'IT и программирование' },
  { id: 7, name: 'Право' },
];

const years = [
  { id: 1, name: '2022-2023' },
  { id: 2, name: '2020-2021' },
  { id: 3, name: '2018-2019' },
  { id: 4, name: 'До 2018' },
];

const languages = [
  { id: 1, name: 'Русский' },
  { id: 2, name: 'Английский' },
  { id: 3, name: 'Казахский' },
];

const BooksPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Состояния для фильтров
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [availableOnly, setAvailableOnly] = useState(false);
  
  // Состояние для мобильного отображения фильтров
  const [filtersOpen, setFiltersOpen] = useState(false);
  
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
  
  const clearAllFilters = () => {
    setSearchValue('');
    setSelectedCategories([]);
    setSelectedYears([]);
    setSelectedLanguages([]);
    setAvailableOnly(false);
    
    setSearchParams({});
  };
  
  // Генерация заголовка страницы на основе фильтров
  const getPageTitle = () => {
    if (searchParams.get('search')) {
      return `Результаты поиска: "${searchParams.get('search')}"`;
    } else if (searchParams.get('category')) {
      const categoryId = parseInt(searchParams.get('category'), 10);
      const category = categories.find((c) => c.id === categoryId);
      return `Категория: ${category ? category.name : ''}`;
    } else if (searchParams.get('popular') === 'true') {
      return 'Популярные книги';
    } else {
      return 'Каталог книг';
    }
  };
  
  // Компонент фильтров
  const FiltersComponent = () => (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 3 }}>
        <form onSubmit={handleSearch}>
          <TextField
            fullWidth
            placeholder="Поиск книг..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchValue && (
                <InputAdornment position="end">
                  <Button 
                    size="small"
                    onClick={() => {
                      setSearchValue('');
                      const params = new URLSearchParams(searchParams);
                      params.delete('search');
                      setSearchParams(params);
                    }}
                  >
                    <ClearIcon fontSize="small" />
                  </Button>
                </InputAdornment>
              ),
            }}
            variant="outlined"
            size="small"
            sx={{ mb: 1 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="small"
            disableElevation
          >
            Искать
          </Button>
        </form>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Категории
        </Typography>
        <FormGroup>
          {categories.map((category) => (
            <FormControlLabel
              key={category.id}
              control={
                <Checkbox
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  size="small"
                />
              }
              label={
                <Typography variant="body2">
                  {category.name}
                </Typography>
              }
            />
          ))}
        </FormGroup>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Год издания
        </Typography>
        <FormGroup>
          {years.map((year) => (
            <FormControlLabel
              key={year.id}
              control={
                <Checkbox
                  checked={selectedYears.includes(year.id)}
                  onChange={() => handleYearChange(year.id)}
                  size="small"
                />
              }
              label={
                <Typography variant="body2">
                  {year.name}
                </Typography>
              }
            />
          ))}
        </FormGroup>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Язык
        </Typography>
        <FormGroup>
          {languages.map((language) => (
            <FormControlLabel
              key={language.id}
              control={
                <Checkbox
                  checked={selectedLanguages.includes(language.id)}
                  onChange={() => handleLanguageChange(language.id)}
                  size="small"
                />
              }
              label={
                <Typography variant="body2">
                  {language.name}
                </Typography>
              }
            />
          ))}
        </FormGroup>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={availableOnly}
              onChange={handleAvailableOnlyChange}
            />
          }
          label="Только доступные"
        />
      </Box>

      <Button
        variant="outlined"
        color="primary"
        fullWidth
        onClick={clearAllFilters}
        startIcon={<ClearIcon />}
      >
        Сбросить фильтры
      </Button>
    </Box>
  );

  return (
    <Box>
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

      <Grid container spacing={3}>
        {/* Фильтры для десктопа */}
        {!isMobile && (
          <Grid item xs={12} md={3}>
            <Paper sx={{ mb: 3 }}>
              <FiltersComponent />
            </Paper>
          </Grid>
        )}

        {/* Фильтры для мобильных */}
        {isMobile && (
          <Grid item xs={12}>
            <Accordion
              expanded={filtersOpen}
              onChange={() => setFiltersOpen(!filtersOpen)}
              elevation={0}
              sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <FilterListIcon sx={{ mr: 1 }} />
                <Typography fontWeight="medium">Фильтры</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FiltersComponent />
              </AccordionDetails>
            </Accordion>
          </Grid>
        )}

        {/* Список книг */}
        <Grid item xs={12} md={isMobile ? 12 : 9}>
          <BookList />
        </Grid>
      </Grid>
    </Box>
  );
};

export default BooksPage;