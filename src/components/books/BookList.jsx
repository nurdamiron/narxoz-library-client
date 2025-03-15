import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Pagination,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Skeleton,
  Paper,
  useTheme,
} from '@mui/material';
import BookCard from './BookCard';

// Имитация задержки загрузки
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Тестовые данные книг
const mockBooks = [
  {
    id: 1,
    title: 'Основы финансового менеджмента',
    author: 'Джеймс С. Ван Хорн, Джон М. Вахович',
    category: 'Финансы',
    cover: 'https://via.placeholder.com/150x220?text=Finance+Management',
    rating: 4.5,
    reviewCount: 123,
    available: true,
    isBookmarked: false,
    publicationYear: 2021,
    description: 'Учебник по финансовому менеджменту для студентов экономических специальностей.',
  },
  {
    id: 2,
    title: 'Маркетинг 5.0: Технологии следующего поколения',
    author: 'Филип Котлер, Хермаван Картаджайя',
    category: 'Маркетинг',
    cover: 'https://via.placeholder.com/150x220?text=Marketing+5.0',
    rating: 4.2,
    reviewCount: 87,
    available: true,
    isBookmarked: true,
    publicationYear: 2022,
    description: 'Книга о новейших технологиях в маркетинге и их применении в бизнесе.',
  },
  {
    id: 3,
    title: 'Искусство стратегии: Теория игр для бизнеса и жизни',
    author: 'Авинаш К. Диксит, Барри Дж. Нейлбафф',
    category: 'Бизнес',
    cover: 'https://via.placeholder.com/150x220?text=Strategy',
    rating: 4.7,
    reviewCount: 156,
    available: false,
    isBookmarked: false,
    publicationYear: 2019,
    description: 'Применение теории игр в стратегическом планировании бизнеса и принятии решений.',
  },
  {
    id: 4,
    title: 'Python для анализа данных',
    author: 'Уэс Маккинни',
    category: 'IT и программирование',
    cover: 'https://via.placeholder.com/150x220?text=Python',
    rating: 4.8,
    reviewCount: 203,
    available: true,
    isBookmarked: false,
    publicationYear: 2020,
    description: 'Практическое руководство по анализу данных с использованием языка Python.',
  },
  {
    id: 5,
    title: 'Корпоративное право: Учебник',
    author: 'Ивана Сергеева',
    category: 'Право',
    cover: 'https://via.placeholder.com/150x220?text=Law',
    rating: 4.0,
    reviewCount: 65,
    available: true,
    isBookmarked: false,
    publicationYear: 2021,
    description: 'Учебник по корпоративному праву для студентов юридических специальностей.',
  },
  {
    id: 6,
    title: 'Введение в экономическую теорию',
    author: 'Пол Самуэльсон, Уильям Нордхаус',
    category: 'Экономика',
    cover: 'https://via.placeholder.com/150x220?text=Economics',
    rating: 4.6,
    reviewCount: 178,
    available: true,
    isBookmarked: true,
    publicationYear: 2018,
    description: 'Классический учебник по основам экономической теории.',
  },
  {
    id: 7,
    title: 'Управление проектами: от начала до конца',
    author: 'Лоуренс Лич',
    category: 'Менеджмент',
    cover: 'https://via.placeholder.com/150x220?text=Project+Management',
    rating: 4.3,
    reviewCount: 112,
    available: false,
    isBookmarked: false,
    publicationYear: 2019,
    description: 'Практическое руководство по управлению проектами для менеджеров и руководителей.',
  },
  {
    id: 8,
    title: 'Большие данные: революция, которая изменит то, как мы живем',
    author: 'Виктор Майер-Шенбергер, Кеннет Кукьер',
    category: 'IT и программирование',
    cover: 'https://via.placeholder.com/150x220?text=Big+Data',
    rating: 4.4,
    reviewCount: 95,
    available: true,
    isBookmarked: false,
    publicationYear: 2020,
    description: 'Книга о влиянии больших данных на бизнес, науку и общество.',
  },
];

const BookList = () => {
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [totalPages, setTotalPages] = useState(1);

  const booksPerPage = 8;

  // Имитация загрузки данных из API
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      
      // Получаем параметры из URL
      const category = searchParams.get('category');
      const search = searchParams.get('search');
      const popular = searchParams.get('popular');
      
      // Имитация задержки сервера
      await delay(800);
      
      // Фильтрация книг на основе параметров URL
      let filteredBooks = [...mockBooks];
      
      if (category) {
        const categoryId = parseInt(category, 10);
        const categoryName = getCategoryById(categoryId);
        filteredBooks = filteredBooks.filter(book => book.category === categoryName);
      }
      
      if (search) {
        const searchLower = search.toLowerCase();
        filteredBooks = filteredBooks.filter(
          book => 
            book.title.toLowerCase().includes(searchLower) || 
            book.author.toLowerCase().includes(searchLower)
        );
      }
      
      if (popular === 'true') {
        filteredBooks = filteredBooks.sort((a, b) => b.rating - a.rating);
      } else {
        // Сортировка книг
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
      }
      
      // Расчет общего количества страниц
      setTotalPages(Math.ceil(filteredBooks.length / booksPerPage));
      
      // Получение книг для текущей страницы
      const startIndex = (page - 1) * booksPerPage;
      const paginatedBooks = filteredBooks.slice(startIndex, startIndex + booksPerPage);
      
      setBooks(paginatedBooks);
      setLoading(false);
    };
    
    fetchBooks();
  }, [searchParams, page, sortBy]);

  // Функция для получения названия категории по ID
  const getCategoryById = (id) => {
    switch (id) {
      case 1: return 'Бизнес';
      case 2: return 'Экономика';
      case 3: return 'Финансы';
      case 4: return 'Маркетинг';
      case 5: return 'Менеджмент';
      case 6: return 'IT и программирование';
      case 7: return 'Право';
      default: return '';
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPage(1);
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h5" component="h1" fontWeight="bold">
          {searchParams.get('category')
            ? `Категория: ${getCategoryById(parseInt(searchParams.get('category'), 10))}`
            : searchParams.get('popular')
            ? 'Популярные книги'
            : searchParams.get('search')
            ? `Результаты поиска: "${searchParams.get('search')}"`
            : 'Все книги'}
        </Typography>

        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel id="sort-select-label">Сортировать по</InputLabel>
          <Select
            labelId="sort-select-label"
            id="sort-select"
            value={sortBy}
            label="Сортировать по"
            onChange={handleSortChange}
          >
            <MenuItem value="newest">Сначала новые</MenuItem>
            <MenuItem value="title">По названию</MenuItem>
            <MenuItem value="author">По автору</MenuItem>
            <MenuItem value="rating">По рейтингу</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Grid container spacing={3}>
          {Array.from(new Array(4)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Paper
                sx={{
                  p: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Skeleton variant="rectangular" height={220} sx={{ mb: 1 }} />
                <Skeleton width="60%" sx={{ mb: 1 }} />
                <Skeleton width="90%" sx={{ mb: 1 }} />
                <Skeleton width="80%" sx={{ mb: 1 }} />
                <Skeleton width="40%" sx={{ mb: 1 }} />
                <Skeleton
                  variant="rectangular"
                  height={36}
                  sx={{ mt: 'auto' }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : books.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {books.map((book) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
                <BookCard book={book} />
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 4,
                mb: 2,
              }}
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                size="large"
              />
            </Box>
          )}
        </>
      ) : (
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Книги не найдены
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Попробуйте изменить параметры поиска или выбрать другую категорию.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default BookList;