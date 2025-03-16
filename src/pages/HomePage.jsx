import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Typography,
  Divider,
  Stack,
  Skeleton,
  useTheme,
  styled,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  AutoStories as AutoStoriesIcon,
  EventNote as EventNoteIcon,
  Lightbulb as LightbulbIcon,
} from '@mui/icons-material';
import BookCard from '../components/books/BookCard';

/**
 * Жүктеу кідірісін имитациялау функциясы
 * 
 * Бұл функция серверден мәліметтер жүктеуді имитациялау үшін қолданылады
 * 
 * @param {number} ms - Миллисекундпен көрсетілген кідіріс уақыты
 * @returns {Promise<void>} - Кідіріс аяқталғаннан кейін орындалатын Promise
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Танымал кітаптардың тестілік деректері
 * 
 * Бұл массив танымал кітаптар туралы ақпаратты сақтайды
 */
const mockPopularBooks = [
  {
    id: 1,
    title: 'Python для анализа данных',
    author: 'Уэс Маккинни',
    category: 'IT и программирование',
    cover: 'https://via.placeholder.com/150x220?text=Python',
    rating: 4.8,
    reviewCount: 203,
    available: true,
    isBookmarked: false,
    publicationYear: 2020,
  },
  {
    id: 2,
    title: 'Искусство стратегии: Теория игр для бизнеса и жизни',
    author: 'Авинаш К. Диксит, Барри Дж. Нейлбафф',
    category: 'Бизнес',
    cover: 'https://via.placeholder.com/150x220?text=Strategy',
    rating: 4.7,
    reviewCount: 156,
    available: false,
    isBookmarked: false,
    publicationYear: 2019,
  },
  {
    id: 3,
    title: 'Введение в экономическую теорию',
    author: 'Пол Самуэльсон, Уильям Нордхаус',
    category: 'Экономика',
    cover: 'https://via.placeholder.com/150x220?text=Economics',
    rating: 4.6,
    reviewCount: 178,
    available: true,
    isBookmarked: true,
    publicationYear: 2018,
  },
  {
    id: 4,
    title: 'Основы финансового менеджмента',
    author: 'Джеймс С. Ван Хорн, Джон М. Вахович',
    category: 'Финансы',
    cover: 'https://via.placeholder.com/150x220?text=Finance+Management',
    rating: 4.5,
    reviewCount: 123,
    available: true,
    isBookmarked: false,
    publicationYear: 2021,
  },
];

/**
 * Жаңа түскен кітаптардың тестілік деректері
 * 
 * Бұл массив кітапханаға жаңадан түскен кітаптар туралы ақпаратты сақтайды
 */
const mockNewBooks = [
  {
    id: 5,
    title: 'Маркетинг 5.0: Технологии следующего поколения',
    author: 'Филип Котлер, Хермаван Картаджайя',
    category: 'Маркетинг',
    cover: 'https://via.placeholder.com/150x220?text=Marketing+5.0',
    rating: 4.2,
    reviewCount: 87,
    available: true,
    isBookmarked: true,
    publicationYear: 2022,
  },
  {
    id: 6,
    title: 'Корпоративное право: Учебник',
    author: 'Ивана Сергеева',
    category: 'Право',
    cover: 'https://via.placeholder.com/150x220?text=Law',
    rating: 4.0,
    reviewCount: 65,
    available: true,
    isBookmarked: false,
    publicationYear: 2021,
  },
  {
    id: 7,
    title: 'Большие данные: революция, которая изменит то, как мы живем',
    author: 'Виктор Майер-Шенбергер, Кеннет Кукьер',
    category: 'IT и программирование',
    cover: 'https://via.placeholder.com/150x220?text=Big+Data',
    rating: 4.4,
    reviewCount: 95,
    available: true,
    isBookmarked: false,
    publicationYear: 2020,
  },
  {
    id: 8,
    title: 'Управление проектами: от начала до конца',
    author: 'Лоуренс Лич',
    category: 'Менеджмент',
    cover: 'https://via.placeholder.com/150x220?text=Project+Management',
    rating: 4.3,
    reviewCount: 112,
    available: false,
    isBookmarked: false,
    publicationYear: 2019,
  },
];

/**
 * Болатын іс-шаралардың тестілік деректері
 * 
 * Бұл массив университет кітапханасындағы болатын іс-шаралар туралы ақпаратты сақтайды
 */
const mockEvents = [
  {
    id: 1,
    title: 'Презентация новых поступлений',
    date: '25 марта 2025',
    time: '14:00',
    location: 'Зал библиотеки, 2 этаж',
  },
  {
    id: 2,
    title: 'Встреча с автором: Мария Иванова',
    date: '30 марта 2025',
    time: '16:30',
    location: 'Конференц-зал, 3 этаж',
  },
  {
    id: 3,
    title: 'Мастер-класс по академическому письму',
    date: '5 апреля 2025',
    time: '11:00',
    location: 'Аудитория 305',
  },
];

/**
 * Секция тақырыптарын ерекшелейтін стилдендірілген компонент
 * 
 * Секция тақырыптарының астына түрлі-түсті сызық қосады
 */
const SectionTitle = styled(Typography)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  marginBottom: theme.spacing(3),
  '&:after': {
    content: '""',
    position: 'absolute',
    left: 0,
    bottom: -8,
    width: 60,
    height: 4,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 2,
  },
}));

/**
 * HeroBanner компоненті - басты беттің жоғарғы баннері
 * 
 * Бұл компонент басты бетте көрінетін үлкен баннерді көрсетеді және 
 * негізгі навигациялық түймелерді ұсынады.
 * 
 * @returns {JSX.Element} - Баннер компоненті
 */
const HeroBanner = () => {
  const theme = useTheme(); // Material UI тақырыбын алу

  return (
    <Paper
      sx={{
        position: 'relative',
        height: { xs: 300, sm: 400 }, // Экран өлшеміне байланысты биіктік
        backgroundImage: 'linear-gradient(to right, rgba(21, 101, 192, 0.8), rgba(255, 152, 0, 0.8))', // Градиент фоны
        color: 'white',
        borderRadius: 4,
        overflow: 'hidden',
        mb: 6,
      }}
    >
      {/* Фондық сурет */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(https://via.placeholder.com/1500x500?text=Library+Background)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3, // Мөлдірлігі
        }}
      />
      
      {/* Баннер контенті */}
      <Container
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1, // Фон суретінің үстінде көрсету
        }}
      >
        {/* Баннер тақырыбы */}
        <Typography
          variant="h3"
          component="h1"
          fontWeight="bold"
          gutterBottom
          sx={{ 
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)', // Көлеңке
            fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' } // Адаптивті шрифт өлшемі
          }}
        >
          Библиотека Университета Нархоз
        </Typography>
        
        {/* Тақырыпша */}
        <Typography
          variant="h6"
          sx={{ 
            maxWidth: 600,
            mb: 4,
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)', // Көлеңке
            fontSize: { xs: '1rem', sm: '1.25rem' } // Адаптивті шрифт өлшемі
          }}
        >
          Доступ к тысячам учебников, научных работ и литературы для студентов и преподавателей
        </Typography>
        
        {/* Навигациялық түймелер */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/books"
            sx={{
              px: 4,
              py: 1.5,
              backgroundColor: 'white',
              color: theme.palette.primary.main,
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            Каталог книг
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={RouterLink}
            to="/about"
            sx={{
              px: 4,
              py: 1.5,
              borderColor: 'white',
              color: 'white',
              fontWeight: 'bold',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            О библиотеке
          </Button>
        </Stack>
      </Container>
    </Paper>
  );
};

/**
 * HomePage компоненті - сайттың басты беті
 * 
 * Бұл компонент сайттың басты бетінің мазмұнын көрсетеді:
 * - Баннер
 * - Танымал кітаптар
 * - Жаңа түскен кітаптар
 * - Болатын іс-шаралар
 * - Кітапхана туралы пайдалы ақпарат
 * 
 * @returns {JSX.Element} - Басты бет компоненті
 */
const HomePage = () => {
  const theme = useTheme(); // Material UI тақырыбын алу
  const [loading, setLoading] = useState(true); // Жүктелу күйі
  const [popularBooks, setPopularBooks] = useState([]); // Танымал кітаптар
  const [newBooks, setNewBooks] = useState([]); // Жаңа түскен кітаптар

  /**
   * Деректерді жүктеу эффекті
   * 
   * Компонент жүктелгенде деректерді жүктейді (бұл жағдайда тестілік деректерді)
   */
  useEffect(() => {
    const fetchData = async () => {
      // Деректерді жүктеу имитациясы
      setLoading(true);
      await delay(1000);
      
      // Тестілік деректерді күйге сақтау
      setPopularBooks(mockPopularBooks);
      setNewBooks(mockNewBooks);
      setLoading(false);
    };

    fetchData(); // Функцияны шақыру
  }, []); // Компонент алғаш жүктелгенде бір рет шақырылады

  return (
    <Box>
      {/* Басты баннер */}
      <HeroBanner />

      {/* Танымал кітаптар секциясы */}
      <Box sx={{ mb: 6 }}>
        <SectionTitle variant="h4" component="h2" fontWeight="bold">
          Популярные книги
        </SectionTitle>
        {loading ? ( // Жүктелу кезінде скелетондарды көрсету
          <Grid container spacing={3}>
            {Array.from(new Array(4)).map((_, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Skeleton variant="rectangular" height={300} />
              </Grid>
            ))}
          </Grid>
        ) : ( // Жүктелу аяқталғаннан кейін деректерді көрсету
          <>
            <Grid container spacing={3}>
              {popularBooks.map((book) => (
                <Grid item xs={12} sm={6} md={3} key={book.id}>
                  <BookCard book={book} />
                </Grid>
              ))}
            </Grid>
            {/* "Барлығын көру" түймесі */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 3,
              }}
            >
              <Button
                component={RouterLink}
                to="/books?popular=true"
                endIcon={<ArrowForwardIcon />}
                color="primary"
              >
                Смотреть все популярные книги
              </Button>
            </Box>
          </>
        )}
      </Box>

      {/* Жаңа түскен кітаптар секциясы */}
      <Box sx={{ mb: 6 }}>
        <SectionTitle variant="h4" component="h2" fontWeight="bold">
          Новые поступления
        </SectionTitle>
        {loading ? ( // Жүктелу кезінде скелетондарды көрсету
          <Grid container spacing={3}>
            {Array.from(new Array(4)).map((_, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Skeleton variant="rectangular" height={300} />
              </Grid>
            ))}
          </Grid>
        ) : ( // Жүктелу аяқталғаннан кейін деректерді көрсету
          <>
            <Grid container spacing={3}>
              {newBooks.map((book) => (
                <Grid item xs={12} sm={6} md={3} key={book.id}>
                  <BookCard book={book} />
                </Grid>
              ))}
            </Grid>
            {/* "Барлығын көру" түймесі */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 3,
              }}
            >
              <Button
                component={RouterLink}
                to="/books"
                endIcon={<ArrowForwardIcon />}
                color="primary"
              >
                Смотреть все новые поступления
              </Button>
            </Box>
          </>
        )}
      </Box>

      {/* Іс-шаралар мен ақпарат блоктары */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {/* Іс-шаралар бөлімі */}
        <Grid item xs={12} md={7}>
          <SectionTitle variant="h4" component="h2" fontWeight="bold">
            Предстоящие события
          </SectionTitle>
          <Grid container spacing={2}>
            {mockEvents.map((event) => (
              <Grid item xs={12} key={event.id}>
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)', // Үстінен өткенде жоғары көтерілу
                      boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.1)', // Көлеңке күшейту
                    },
                  }}
                >
                  {/* Іс-шара күні блогы */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 2,
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      width: { xs: '100%', sm: 120 },
                    }}
                  >
                    <EventNoteIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      {event.date.split(' ')[0]} {/* Күні */}
                    </Typography>
                    <Typography variant="body2">
                      {event.date.split(' ').slice(1).join(' ')} {/* Ай */}
                    </Typography>
                  </Box>
                  {/* Іс-шара туралы ақпарат */}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {event.title}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 0.5, sm: 2 },
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        <strong>Время:</strong> {event.time}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Место:</strong> {event.location}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          {/* "Барлық іс-шараларды көру" түймесі */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 3,
            }}
          >
            <Button
              component={RouterLink}
              to="/events"
              endIcon={<ArrowForwardIcon />}
              color="primary"
            >
              Все события
            </Button>
          </Box>
        </Grid>

        {/* Пайдалы ақпарат бөлімі */}
        <Grid item xs={12} md={5}>
          <SectionTitle variant="h4" component="h2" fontWeight="bold">
            Информация
          </SectionTitle>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CardContent>
              {/* Жұмыс кестесі */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AutoStoriesIcon
                    sx={{ color: theme.palette.primary.main, mr: 1 }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    Часы работы
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2">Понедельник - Пятница:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" fontWeight="bold">
                      9:00 - 20:00
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">Суббота:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" fontWeight="bold">
                      10:00 - 17:00
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">Воскресенье:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" fontWeight="bold">
                      Закрыто
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Пайдалы ақпарат */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LightbulbIcon
                    sx={{ color: theme.palette.primary.main, mr: 1 }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    Полезная информация
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" paragraph>
                  Для получения доступа к электронным ресурсам библиотеки необходимо авторизоваться используя свой студенческий ID.
                </Typography>
                <Typography variant="body2" paragraph>
                  Книги выдаются на срок до 14 дней с возможностью продления, если на них нет очереди.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/help"
                  color="primary"
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  Справка
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;