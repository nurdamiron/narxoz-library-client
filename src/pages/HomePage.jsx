// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
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
  CircularProgress,
  Paper
} from '@mui/material';
import {
  Book as BookIcon,
  BookmarkBorder as BookmarkIcon
} from '@mui/icons-material';

// Импорт хуков и сервисов
import { bookService } from '../services';
import { getBookCoverUrl } from '../utils';

const HomePage = () => {
  const [popularBooks, setPopularBooks] = useState([]);
  const [newBooks, setNewBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        
        // Параллельно получаем популярные и новые книги
        const [popularResponse, newResponse] = await Promise.all([
          bookService.getPopularBooks(4),
          bookService.getNewBooks(4)
        ]);
        
        if (popularResponse.success) {
          setPopularBooks(popularResponse.data);
        }
        
        if (newResponse.success) {
          setNewBooks(newResponse.data);
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHomeData();
  }, []);
  
  // Анимации
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  // Отображение книги
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
        {book.category && (
          <Chip 
            label={book.category.name} 
            size="small" 
            variant="outlined"
            sx={{ mt: 1 }}
          />
        )}
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
        <Button 
          size="small" 
          startIcon={<BookmarkIcon />}
          component={RouterLink}
          to={`/books/${book.id}`}
          sx={{ ml: 'auto' }}
        >
          {book.isBookmarked ? 'Бетбелгіде' : 'Бетбелгіге қосу'}
        </Button>
      </CardActions>
    </Card>
  );
  
  if (loading) {
    return (
      <Container sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container sx={{ py: 8 }}>
        {/* Hero section */}
        <Box 
          sx={{ 
            p: { xs: 4, md: 8 }, 
            mb: 6, 
            borderRadius: 2,
            background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom>
            Нархоз кітапханасына қош келдіңіз
          </Typography>
          <Typography variant="h6" paragraph>
            Біздің кітаптар топтамасын шолыңыз және оқуға арналған кітаптарды алыңыз
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            sx={{ 
              bgcolor: 'white', 
              color: '#1976d2',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.85)',
              }
            }}
            component={RouterLink}
            to="/books"
          >
            Кітаптар каталогы
          </Button>
        </Box>

        {/* Популярные книги */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Танымал кітаптар
          </Typography>
          <Divider sx={{ mb: 4 }} />
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={4}>
              {popularBooks.length > 0 ? (
                popularBooks.map((book) => (
                  <Grid item key={book.id} xs={12} sm={6} md={3}>
                    <motion.div variants={itemVariants}>
                      {renderBook(book)}
                    </motion.div>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body1">
                      Танымал кітаптар табылмады
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </motion.div>
        </Box>

        {/* Новые книги */}
        <Box>
          <Typography variant="h4" component="h2" gutterBottom>
            Жаңа түскен кітаптар
          </Typography>
          <Divider sx={{ mb: 4 }} />
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={4}>
              {newBooks.length > 0 ? (
                newBooks.map((book) => (
                  <Grid item key={book.id} xs={12} sm={6} md={3}>
                    <motion.div variants={itemVariants}>
                      {renderBook(book)}
                    </motion.div>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body1">
                      Жаңа кітаптар табылмады
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </motion.div>
        </Box>
      </Container>
    </motion.div>
  );
};

export default HomePage;