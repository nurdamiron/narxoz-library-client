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
  useMediaQuery,
  alpha,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  AutoStories as AutoStoriesIcon,
  EventNote as EventNoteIcon,
  Lightbulb as LightbulbIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import BookCard from '../components/books/BookCard';
import { 
  mockPopularBooks, 
  mockNewBooks, 
  mockEvents,
  delay 
} from '../data/mockData';

/**
 * HeroBanner компоненті - басты беттің жоғарғы баннері
 */
const HeroBanner = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper
      sx={{
        position: 'relative',
        height: { xs: 300, sm: 350, md: 400 },
        backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        color: 'white',
        borderRadius: { xs: 2, sm: 3, md: 4 },
        overflow: 'hidden',
        mb: { xs: 4, md: 6 },
        boxShadow: theme.shadows[4],
      }}
    >
      {/* Фон с наложением */}
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
          opacity: 0.2,
        }}
      />
      
      {/* Контент баннера */}
      <Container
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Иконка университета */}
        <SchoolIcon sx={{ fontSize: { xs: 40, md: 60 }, mb: 2, opacity: 0.9 }} />
        
        {/* Заголовок */}
        <Typography
          variant="h3"
          component="h1"
          fontWeight="bold"
          gutterBottom
          sx={{ 
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem' },
            maxWidth: '100%',
            wordWrap: 'break-word'
          }}
        >
          Библиотека Университета Нархоз
        </Typography>
        
        {/* Подзаголовок */}
        <Typography
          variant="body1"
          sx={{ 
            maxWidth: 600,
            mb: { xs: 3, md: 4 },
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
            opacity: 0.9,
          }}
        >
          Доступ к тысячам учебников, научных работ и литературы для студентов и преподавателей
        </Typography>
        
        {/* Кнопки */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 2 }}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          <Button
            variant="contained"
            size={isMobile ? "medium" : "large"}
            component={RouterLink}
            to="/books"
            sx={{
              px: { xs: 3, md: 4 },
              py: { xs: 1, md: 1.5 },
              backgroundColor: 'white',
              color: theme.palette.primary.main,
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: alpha('#ffffff', 0.9),
                transform: 'translateY(-2px)',
              },
              transition: 'transform 0.2s',
              boxShadow: theme.shadows[2],
            }}
          >
            Каталог книг
          </Button>
          <Button
            variant="outlined"
            size={isMobile ? "medium" : "large"}
            component={RouterLink}
            to="/about"
            sx={{
              px: { xs: 3, md: 4 },
              py: { xs: 1, md: 1.5 },
              borderColor: 'white',
              color: 'white',
              fontWeight: 'bold',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-2px)',
              },
              transition: 'transform 0.2s',
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
 * SectionTitle - компонент заголовка секции
 */
const SectionTitle = ({ children, ...props }) => {
  const theme = useTheme();
  
  return (
    <Typography
      variant="h5"
      component="h2"
      fontWeight="bold"
      sx={{
        position: 'relative',
        display: 'inline-block',
        mb: 3,
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
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Typography>
  );
};

/**
 * BooksGrid - сетка для отображения книг
 */
const BooksGrid = ({ books, loading }) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  
  if (loading) {
    return (
      <Grid container spacing={isMobile ? 2 : 3}>
        {Array.from(new Array(4)).map((_, index) => (
          <Grid item xs={6} sm={6} md={3} key={index}>
            <Skeleton variant="rectangular" height={300} />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={isMobile ? 2 : 3}>
      {books.map((book) => (
        <Grid item xs={6} sm={6} md={3} key={book.id}>
          <BookCard book={book} />
        </Grid>
      ))}
    </Grid>
  );
};

/**
 * HomePage компоненті - сайттың басты беті
 */
const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(true);
  const [popularBooks, setPopularBooks] = useState([]);
  const [newBooks, setNewBooks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await delay(800);
      
      setPopularBooks(mockPopularBooks);
      setNewBooks(mockNewBooks);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <Box>
      {/* Основной баннер */}
      <HeroBanner />

      {/* Популярные книги */}
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        <SectionTitle>
          Популярные книги
        </SectionTitle>
        
        <BooksGrid books={popularBooks} loading={loading} />
        
        {/* Кнопка "Смотреть все" */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            component={RouterLink}
            to="/books?popular=true"
            endIcon={<ArrowForwardIcon />}
            color="primary"
            size={isMobile ? "small" : "medium"}
          >
            Смотреть все популярные книги
          </Button>
        </Box>
      </Box>

      {/* Новые поступления */}
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        <SectionTitle>
          Новые поступления
        </SectionTitle>
        
        <BooksGrid books={newBooks} loading={loading} />
        
        {/* Кнопка "Смотреть все" */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            component={RouterLink}
            to="/books"
            endIcon={<ArrowForwardIcon />}
            color="primary"
            size={isMobile ? "small" : "medium"}
          >
            Смотреть все новые поступления
          </Button>
        </Box>
      </Box>

      {/* События и информация */}
      <Grid container spacing={isMobile ? 3 : 4} sx={{ mb: { xs: 4, md: 6 } }}>
        {/* События */}
        <Grid item xs={12} md={7}>
          <SectionTitle>
            Предстоящие события
          </SectionTitle>
          <Stack spacing={2}>
            {mockEvents.map((event) => (
              <Paper
                key={event.id}
                elevation={2}
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                {/* Дата события */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: { xs: 1.5, sm: 2 },
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    width: { xs: '100%', sm: 120 },
                  }}
                >
                  <EventNoteIcon sx={{ fontSize: { xs: 30, md: 40 }, mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    {event.date.split(' ')[0]}
                  </Typography>
                  <Typography variant="body2">
                    {event.date.split(' ').slice(1).join(' ')}
                  </Typography>
                </Box>
                
                {/* Информация о событии */}
                <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 2.5 } }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                    {event.title}
                  </Typography>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 0.5, sm: 2 }}
                    sx={{ mb: 1 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      <strong>Время:</strong> {event.time}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Место:</strong> {event.location}
                    </Typography>
                  </Stack>
                </CardContent>
              </Paper>
            ))}
          </Stack>
          
          {/* Кнопка "Все события" */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              component={RouterLink}
              to="/events"
              endIcon={<ArrowForwardIcon />}
              color="primary"
              size={isMobile ? "small" : "medium"}
            >
              Все события
            </Button>
          </Box>
        </Grid>

        {/* Информация */}
        <Grid item xs={12} md={5}>
          <SectionTitle>
            Информация
          </SectionTitle>
          <Paper
            elevation={2}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              {/* Часы работы */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AutoStoriesIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
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

              {/* Полезная информация */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LightbulbIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
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
                  sx={{ 
                    mt: 1,
                    fontWeight: 'medium',
                    borderRadius: 2
                  }}
                >
                  Справка
                </Button>
              </Box>
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;