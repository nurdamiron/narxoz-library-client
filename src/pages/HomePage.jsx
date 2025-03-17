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

// Import mock data from your data file
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
        height: { xs: 340, sm: 380, md: 420 },
        background: 'linear-gradient(135deg, #d50032 0%, #d50032 50%,rgb(255, 142, 142) 50%, #ffffff 100%)',
        color: 'white',
        borderRadius: { xs: 3, sm: 4, md: 4 },
        overflow: 'hidden',
        mb: { xs: 5, md: 7 },
        boxShadow: theme.shadows[4],
      }}
    >
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
        <SchoolIcon 
          sx={{ 
            fontSize: { xs: 40, md: 60 }, 
            mb: 2, 
            opacity: 0.9,
            color: '#d50032',
            position: 'absolute',
            top: { xs: 20, md: 30 },
            right: { xs: 20, md: 40 },
            backgroundColor: 'white',
            padding: 1,
            borderRadius: '50%',
          }} 
        />
        
        {/* Заголовок */}
        <Typography
          variant="h3"
          component="h1"
          fontWeight="bold"
          gutterBottom
          sx={{ 
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            fontSize: { xs: '1.6rem', sm: '2.2rem', md: '2.8rem' },
            maxWidth: { xs: '100%', md: '60%' },
            wordWrap: 'break-word',
            color: '#ffe6ea',
            position: 'relative',
            zIndex: 2,
          }}
        >
          Библиотека Университета Нархоз
        </Typography>
        
        {/* Подзаголовок */}
        <Typography
          variant="body1"
          sx={{ 
            maxWidth: { xs: '100%', md: '60%' },
            mb: { xs: 3, md: 4 },
            textShadow: '0px 0px 1px rgba(0,0,0,0.1)',
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
            opacity: 0.9,
            color: '#fff',
            position: 'relative',
            zIndex: 2,
          }}
        >
          Доступ к тысячам учебников, научных работ и литературы для студентов и преподавателей
        </Typography>
        
        {/* Кнопки */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2, sm: 3 }}
          sx={{ 
            width: { xs: '100%', sm: 'auto' },
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Button
            variant="contained"
            size={isMobile ? "medium" : "large"}
            component={RouterLink}
            to="/books"
            sx={{
              px: { xs: 3, md: 4 },
              py: { xs: 1, md: 1.5 },
              backgroundColor: '#d50032',
              color: 'white',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: alpha('#d50032', 0.9),
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
              borderColor: '#fff',
              color: '#fff',
              fontWeight: 'bold',
              '&:hover': {
                borderColor: '#d50032',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
        mb: 4,
        '&:after': {
          content: '""',
          position: 'absolute',
          left: 0,
          bottom: -10,
          width: 60,
          height: 4,
          backgroundColor: '#d50032',
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
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
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
    <Box sx={{ pt: 2 }}>
      {/* Основной баннер */}
      <HeroBanner />

      {/* Популярные книги */}
      <Box sx={{ mb: { xs: 6, md: 8 } }}>
        <SectionTitle>
          Популярные книги
        </SectionTitle>
        
        <BooksGrid books={popularBooks} loading={loading} />
        
        {/* Кнопка "Смотреть все" */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            component={RouterLink}
            to="/books?popular=true"
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              color: '#d50032',
              '&:hover': {
                backgroundColor: alpha('#d50032', 0.05),
              },
            }}
            size={isMobile ? "small" : "medium"}
          >
            Смотреть все популярные книги
          </Button>
        </Box>
      </Box>

      {/* Новые поступления */}
      <Box sx={{ mb: { xs: 6, md: 8 } }}>
        <SectionTitle>
          Новые поступления
        </SectionTitle>
        
        <BooksGrid books={newBooks} loading={loading} />
        
        {/* Кнопка "Смотреть все" */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            component={RouterLink}
            to="/books"
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              color: '#d50032',
              '&:hover': {
                backgroundColor: alpha('#d50032', 0.05),
              },
            }}
            size={isMobile ? "small" : "medium"}
          >
            Смотреть все новые поступления
          </Button>
        </Box>
      </Box>

      {/* События и информация */}
      <Grid container spacing={isMobile ? 4 : 5} sx={{ mb: { xs: 6, md: 8 } }}>
        {/* События */}
        <Grid item xs={12} md={7}>
          <SectionTitle>
            Предстоящие события
          </SectionTitle>
          <Stack spacing={3}>
            {mockEvents.map((event) => (
              <Paper
                key={event.id}
                elevation={2}
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  borderRadius: 3,
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
                    p: { xs: 2, sm: 3 },
                    backgroundColor: '#d50032',
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
                <CardContent sx={{ flexGrow: 1, p: { xs: 2.5, sm: 3 } }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
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
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              component={RouterLink}
              to="/events"
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                color: '#d50032',
                '&:hover': {
                  backgroundColor: alpha('#d50032', 0.05),
                },
              }}
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
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: theme.shadows[2],
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 }, flexGrow: 1 }}>
              {/* Часы работы */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AutoStoriesIcon sx={{ color: '#d50032', mr: 1.5 }} />
                  <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                    Часы работы
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2.5 }} />
                <Grid container spacing={1.5}>
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
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LightbulbIcon sx={{ color: '#d50032', mr: 1.5 }} />
                  <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                    Полезная информация
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2.5 }} />
                <Typography variant="body2" paragraph>
                  Для получения доступа к электронным ресурсам библиотеки необходимо авторизоваться, используя свой студенческий ID.
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
                    mt: 2,
                    fontWeight: 'medium',
                    borderRadius: 2,
                    borderColor: '#d50032',
                    color: '#d50032',
                    '&:hover': {
                      borderColor: '#d50032',
                      backgroundColor: alpha('#d50032', 0.05),
                    },
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