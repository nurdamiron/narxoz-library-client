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

/**
 * Категориялар тізімінің тестілік деректері
 * 
 * Бұл массив кітаптардың категориялары туралы ақпаратты сақтайды:
 * - id: Категория идентификаторы
 * - name: Категория атауы
 */
const categories = [
  { id: 1, name: 'Бизнес' },
  { id: 2, name: 'Экономика' },
  { id: 3, name: 'Финансы' },
  { id: 4, name: 'Маркетинг' },
  { id: 5, name: 'Менеджмент' },
  { id: 6, name: 'IT и программирование' },
  { id: 7, name: 'Право' },
];

/**
 * Жылдар тізімінің тестілік деректері
 * 
 * Бұл массив кітаптарды жылдары бойынша топтау үшін қолданылады:
 * - id: Жыл диапазонының идентификаторы
 * - name: Жыл диапазонының атауы
 */
const years = [
  { id: 1, name: '2022-2023' },
  { id: 2, name: '2020-2021' },
  { id: 3, name: '2018-2019' },
  { id: 4, name: 'До 2018' },
];

/**
 * Тілдер тізімінің тестілік деректері
 * 
 * Бұл массив кітаптар тілдері туралы ақпаратты сақтайды:
 * - id: Тіл идентификаторы
 * - name: Тіл атауы
 */
const languages = [
  { id: 1, name: 'Русский' },
  { id: 2, name: 'Английский' },
  { id: 3, name: 'Казахский' },
];

/**
 * BooksPage компоненті - кітаптар каталогын көрсету және фильтрлеу беті
 * 
 * Бұл компонент кітаптардың каталогын көрсетеді және оларды фильтрлеу мүмкіндігін ұсынады:
 * - Іздеу өрісі арқылы кітап атауын немесе автор атын іздеу
 * - Кітаптарды категория бойынша фильтрлеу
 * - Кітаптарды жарияланған жылы бойынша фильтрлеу
 * - Кітаптарды тілі бойынша фильтрлеу
 * - Тек қолжетімді кітаптарды көрсету опциясы
 */
const BooksPage = () => {
  const theme = useTheme(); // Material UI тақырыбын алу
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Экран өлшемін тексеру
  const [searchParams, setSearchParams] = useSearchParams(); // URL параметрлерін басқару
  
  // Фильтр күйлері (state)
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || ''); // Іздеу өрісі мәні
  const [selectedCategories, setSelectedCategories] = useState([]); // Таңдалған категориялар
  const [selectedYears, setSelectedYears] = useState([]); // Таңдалған жылдар
  const [selectedLanguages, setSelectedLanguages] = useState([]); // Таңдалған тілдер
  const [availableOnly, setAvailableOnly] = useState(false); // Тек қолжетімді кітаптар фильтрі
  
  // Мобильді құрылғыларда фильтрлер панелінің ашық/жабық күйі
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  /**
   * Іздеу формасын жіберу функциясы
   * 
   * URL параметрлеріне іздеу сұранысын қосады және беттің күйін жаңартады.
   * 
   * @param {Event} e - Форма жіберу оқиғасы
   */
  const handleSearch = (e) => {
    e.preventDefault(); // Беттің қайта жүктелуін болдырмау
    
    const params = new URLSearchParams(searchParams);
    
    // Іздеу сұранысы бар болса, оны URL-ге қосу, әйтпесе жою
    if (searchValue) {
      params.set('search', searchValue);
    } else {
      params.delete('search');
    }
    
    setSearchParams(params); // URL параметрлерін жаңарту
  };
  
  /**
   * Категория фильтрін өзгерту функциясы
   * 
   * Таңдалған категориялар тізімін жаңартады және URL параметрлерін жаңартады.
   * 
   * @param {number} id - Категория идентификаторы
   */
  const handleCategoryChange = (id) => {
    // Егер категория таңдалған болса - оны алып тастау, таңдалмаған болса - қосу
    const newSelectedCategories = selectedCategories.includes(id)
      ? selectedCategories.filter((cat) => cat !== id)
      : [...selectedCategories, id];
    
    setSelectedCategories(newSelectedCategories); // Күйді жаңарту
    
    const params = new URLSearchParams(searchParams);
    
    // Таңдалған категориялар болса, URL-ге қосу, болмаса жою
    if (newSelectedCategories.length > 0) {
      params.set('category', newSelectedCategories.join(','));
    } else {
      params.delete('category');
    }
    
    setSearchParams(params); // URL параметрлерін жаңарту
  };
  
  /**
   * Жыл фильтрін өзгерту функциясы
   * 
   * Таңдалған жылдар тізімін жаңартады және URL параметрлерін жаңартады.
   * 
   * @param {number} id - Жыл диапазонының идентификаторы
   */
  const handleYearChange = (id) => {
    // Егер жыл таңдалған болса - оны алып тастау, таңдалмаған болса - қосу
    const newSelectedYears = selectedYears.includes(id)
      ? selectedYears.filter((year) => year !== id)
      : [...selectedYears, id];
    
    setSelectedYears(newSelectedYears); // Күйді жаңарту
    
    const params = new URLSearchParams(searchParams);
    
    // Таңдалған жылдар болса, URL-ге қосу, болмаса жою
    if (newSelectedYears.length > 0) {
      params.set('year', newSelectedYears.join(','));
    } else {
      params.delete('year');
    }
    
    setSearchParams(params); // URL параметрлерін жаңарту
  };
  
  /**
   * Тіл фильтрін өзгерту функциясы
   * 
   * Таңдалған тілдер тізімін жаңартады және URL параметрлерін жаңартады.
   * 
   * @param {number} id - Тіл идентификаторы
   */
  const handleLanguageChange = (id) => {
    // Егер тіл таңдалған болса - оны алып тастау, таңдалмаған болса - қосу
    const newSelectedLanguages = selectedLanguages.includes(id)
      ? selectedLanguages.filter((lang) => lang !== id)
      : [...selectedLanguages, id];
    
    setSelectedLanguages(newSelectedLanguages); // Күйді жаңарту
    
    const params = new URLSearchParams(searchParams);
    
    // Таңдалған тілдер болса, URL-ге қосу, болмаса жою
    if (newSelectedLanguages.length > 0) {
      params.set('language', newSelectedLanguages.join(','));
    } else {
      params.delete('language');
    }
    
    setSearchParams(params); // URL параметрлерін жаңарту
  };
  
  /**
   * "Тек қолжетімді" фильтрін өзгерту функциясы
   * 
   * Қолжетімді кітаптар фильтрінің күйін жаңартады және URL параметрлерін жаңартады.
   * 
   * @param {Event} e - Флажок өзгеру оқиғасы
   */
  const handleAvailableOnlyChange = (e) => {
    const checked = e.target.checked;
    setAvailableOnly(checked); // Күйді жаңарту
    
    const params = new URLSearchParams(searchParams);
    
    // Флажок таңдалған болса, URL-ге қосу, болмаса жою
    if (checked) {
      params.set('available', 'true');
    } else {
      params.delete('available');
    }
    
    setSearchParams(params); // URL параметрлерін жаңарту
  };
  
  /**
   * Барлық фильтрлерді тазалау функциясы
   * 
   * Барлық фильтрлердің күйін бастапқы қалпына келтіреді және URL параметрлерін тазалайды.
   */
  const clearAllFilters = () => {
    // Барлық фильтр күйлерін тазалау
    setSearchValue('');
    setSelectedCategories([]);
    setSelectedYears([]);
    setSelectedLanguages([]);
    setAvailableOnly(false);
    
    // URL параметрлерін тазалау
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
      const categoryId = parseInt(searchParams.get('category'), 10);
      const category = categories.find((c) => c.id === categoryId);
      return `Категория: ${category ? category.name : ''}`;
    } else if (searchParams.get('popular') === 'true') {
      return 'Популярные книги';
    } else {
      return 'Каталог книг';
    }
  };
  
  /**
   * Фильтрлер компоненті - барлық фильтр элементтерін біріктіреді
   * 
   * Бұл компонент барлық фильтр элементтерін қамтиды және оларды бір блокта көрсетеді.
   * Мобильді және десктоп нұсқаларында бірдей қолданылады.
   */
  const FiltersComponent = () => (
    <Box sx={{ p: 2 }}>
      {/* Іздеу формасы */}
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
                      setSearchValue(''); // Іздеу өрісін тазалау
                      const params = new URLSearchParams(searchParams);
                      params.delete('search'); // URL параметрінен іздеу сұранысын жою
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

      <Divider sx={{ mb: 2 }} /> {/* Бөлгіш сызық */}

      {/* Категориялар фильтрі */}
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

      <Divider sx={{ mb: 2 }} /> {/* Бөлгіш сызық */}

      {/* Жылдар фильтрі */}
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

      <Divider sx={{ mb: 2 }} /> {/* Бөлгіш сызық */}

      {/* Тілдер фильтрі */}
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

      <Divider sx={{ mb: 2 }} /> {/* Бөлгіш сызық */}

      {/* Қолжетімділік фильтрі */}
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

      {/* Фильтрлерді тазалау түймесі */}
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

      <Grid container spacing={3}>
        {/* Десктоп үшін тұрақты фильтрлер панелі */}
        {!isMobile && (
          <Grid item xs={12} md={3}>
            <Paper sx={{ mb: 3 }}>
              <FiltersComponent />
            </Paper>
          </Grid>
        )}

        {/* Мобильді құрылғылар үшін ашылмалы фильтрлер панелі */}
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

        {/* Кітаптар тізімі - BookList компонентін қолдану */}
        <Grid item xs={12} md={isMobile ? 12 : 9}>
          <BookList />
        </Grid>
      </Grid>
    </Box>
  );
};

export default BooksPage;