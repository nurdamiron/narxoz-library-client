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

// Жүктеуді имитациялау функциясы (серверден мәліметтерді жүктеуді имитациялайды)
// (Бұл функция жүктелудің кідірісін имитациялау үшін қолданылады)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @mockBooks - Тестілік кітаптар тізімі
 * 
 * Бұл массив кітаптардың деректерін сақтайды. Әр кітап келесі өрістерді қамтиды:
 * - id: Кітаптың бірегей идентификаторы
 * - title: Кітаптың атауы
 * - author: Кітаптың авторы
 * - category: Кітаптың категориясы (Финансы, Маркетинг, т.б.)
 * - cover: Кітаптың мұқабасы (сурет URL)
 * - rating: Кітаптың рейтингі (1-ден 5-ке дейін)
 * - reviewCount: Пікірлер саны
 * - available: Кітаптың қолжетімділігі (true/false)
 * - isBookmarked: Кітаптың таңдаулыға қосылғаны (true/false)
 * - publicationYear: Жарияланған жылы
 * - description: Кітаптың сипаттамасы
 */
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
  // Басқа кітаптар...
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
  // Қалған кітаптар...
];

/**
 * BookList компоненті - кітаптар тізімін көрсету үшін
 * 
 * Бұл компонент кітаптардың тізімін көрсетеді, оларды сұрыптайды және фильтрлейді:
 * - URL параметрлеріне сәйкес кітаптарды фильтрлейді (категория, іздеу, т.б.)
 * - Кітаптарды сұрыптауға мүмкіндік береді (жаңасы, атауы, авторы, рейтингі бойынша)
 * - Беттеу (пагинация) қолдайды
 * - Жүктелу кезінде скелетондарды көрсетеді
 * - Кітаптар табылмаған жағдайда тиісті хабарламаны көрсетеді
 */
const BookList = () => {
  const theme = useTheme();
  // URL параметрлерін алу үшін useSearchParams қолданамыз
  const [searchParams] = useSearchParams();
  
  // Компонент күйлері (state)
  const [books, setBooks] = useState([]); // Көрсетілетін кітаптар
  const [loading, setLoading] = useState(true); // Жүктелу күйі
  const [page, setPage] = useState(1); // Ағымдағы бет
  const [sortBy, setSortBy] = useState('newest'); // Сұрыптау әдісі
  const [totalPages, setTotalPages] = useState(1); // Беттер саны

  // Бір бетте көрсетілетін кітаптар саны
  const booksPerPage = 8;

  /**
   * useEffect - компонент жүктелгенде және параметрлер өзгергенде кітаптарды жүктейді
   * 
   * Бұл эффект келесі жағдайларда іске қосылады:
   * - Компонент алғаш рет жүктелгенде
   * - URL параметрлері өзгергенде (іздеу, категория, т.б.)
   * - Ағымдағы бет өзгергенде
   * - Сұрыптау әдісі өзгергенде
   */
  useEffect(() => {
    // Кітаптарды жүктеу функциясы
    const fetchBooks = async () => {
      setLoading(true); // Жүктелу басталды
      
      // URL параметрлерін алу
      const category = searchParams.get('category'); // Категория
      const search = searchParams.get('search'); // Іздеу сөзі
      const popular = searchParams.get('popular'); // Танымал кітаптар сұраныстың белгісі
      
      // Сервер жауабын имитациялау (800мс кідіріс)
      await delay(800);
      
      // URL параметрлеріне сәйкес кітаптарды фильтрлеу
      let filteredBooks = [...mockBooks];
      
      // Категория бойынша фильтрлеу
      if (category) {
        const categoryId = parseInt(category, 10);
        const categoryName = getCategoryById(categoryId);
        filteredBooks = filteredBooks.filter(book => book.category === categoryName);
      }
      
      // Іздеу сөзі бойынша фильтрлеу (атауы немесе авторы)
      if (search) {
        const searchLower = search.toLowerCase();
        filteredBooks = filteredBooks.filter(
          book => 
            book.title.toLowerCase().includes(searchLower) || 
            book.author.toLowerCase().includes(searchLower)
        );
      }
      
      // Сұрыптау (танымал болса, рейтинг бойынша, әйтпесе таңдалған сұрыптау әдісіне сәйкес)
      if (popular === 'true') {
        filteredBooks = filteredBooks.sort((a, b) => b.rating - a.rating);
      } else {
        // Таңдалған сұрыптау әдісіне сәйкес кітаптарды сұрыптау
        switch (sortBy) {
          case 'title': // Атауы бойынша
            filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
            break;
          case 'author': // Авторы бойынша
            filteredBooks.sort((a, b) => a.author.localeCompare(b.author));
            break;
          case 'rating': // Рейтингі бойынша
            filteredBooks.sort((a, b) => b.rating - a.rating);
            break;
          case 'newest': // Жаңалығы бойынша (әдепкі)
          default:
            filteredBooks.sort((a, b) => b.publicationYear - a.publicationYear);
            break;
        }
      }
      
      // Беттер санын есептеу
      setTotalPages(Math.ceil(filteredBooks.length / booksPerPage));
      
      // Ағымдағы бетке сәйкес кітаптарды алу
      const startIndex = (page - 1) * booksPerPage;
      const paginatedBooks = filteredBooks.slice(startIndex, startIndex + booksPerPage);
      
      // Компонент күйін жаңарту
      setBooks(paginatedBooks);
      setLoading(false); // Жүктелу аяқталды
    };
    
    // Функцияны шақыру
    fetchBooks();
  }, [searchParams, page, sortBy]); // Бұл параметрлер өзгергенде эффект қайта іске қосылады

  /**
   * Категория ID бойынша атауын алу функциясы
   * 
   * @param {number} id - Категория идентификаторы
   * @returns {string} - Категория атауы
   */
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

  /**
   * Бетті ауыстыру функциясы (пагинация)
   * 
   * @param {Event} event - Оқиға объектісі
   * @param {number} value - Жаңа бет нөмірі
   */
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Беттің жоғарғы жағына орналастыру
  };

  /**
   * Сұрыптау әдісін өзгерту функциясы
   * 
   * @param {Event} event - Оқиға объектісі
   */
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPage(1); // Бірінші бетке қайтару
  };

  return (
    <Box>
      {/* Тақырып пен сұрыптау құралдары бар жоғарғы панель */}
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
        {/* Тақырып - ағымдағы көрініске сәйкес (категория, іздеу нәтижелері, т.б.) */}
        <Typography variant="h5" component="h1" fontWeight="bold">
          {searchParams.get('category')
            ? `Категория: ${getCategoryById(parseInt(searchParams.get('category'), 10))}`
            : searchParams.get('popular')
            ? 'Популярные книги'
            : searchParams.get('search')
            ? `Результаты поиска: "${searchParams.get('search')}"`
            : 'Все книги'}
        </Typography>

        {/* Сұрыптау таңдауы */}
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

      {/* Жүктелу кезінде скелетондарды көрсету */}
      {loading ? (
        <Grid container spacing={3}>
          {/* Жүктелу кезінде 4 скелетон карточка көрсету */}
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
      ) : books.length > 0 ? ( // Кітаптар табылса, оларды көрсету
        <>
          {/* Кітаптар торы (grid) */}
          <Grid container spacing={3}>
            {books.map((book) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
                <BookCard book={book} />
              </Grid>
            ))}
          </Grid>

          {/* Беттеу (пагинация) - бірнеше бет болған жағдайда көрсетіледі */}
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
      ) : ( // Кітаптар табылмаса, хабарлама көрсету
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