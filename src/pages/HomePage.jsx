/**
 * src/pages/HomePage.jsx
 * 
 * Басты бет компоненті
 * 
 * Бұл компонент кітапхананың басты бетін көрсетеді.
 * Танымал кітаптар мен жаңа түскен кітаптарды көрсетеді және кітапхана туралы ақпарат береді.
 */
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Box,
  Button,
  Paper,
  Chip,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import {
  Book as BookIcon,
  Search as SearchIcon,
  Bookmark as BookmarkIcon,
  LocalLibrary as LocalLibraryIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

// Импорт компонентов
import BookCard from '../components/books/BookCard';
import EmptyState from '../components/common/EmptyState';
import AlertDialog from '../components/common/AlertDialog';

// Импорт хуков и сервисов
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import bookService from '../services/bookService';
import bookmarkService from '../services/bookmarkService';

/**
 * HomePage компоненті
 * 
 * @returns {JSX.Element} - Басты бет
 */
const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const { isAuthenticated } = useAuth();
  const { success, error: showError } = useToast();
  
  // Күйлер
  const [popularBooks, setPopularBooks] = useState([]);
  const [newBooks, setNewBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loginDialog, setLoginDialog] = useState({
    open: false,
    bookId: null,
    action: null
  });
  
  /**
   * Деректерді жүктеу
   */
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Параллельно жүктеу
        const [popularResponse, newResponse] = await Promise.all([
          bookService.getPopularBooks(4),
          bookService.getNewBooks(4)
        ]);
        
        // Деректерді өңдеу
        if (popularResponse.success) {
          setPopularBooks(popularResponse.data);
        }
        
        if (newResponse.success) {
          setNewBooks(newResponse.data);
        }
      } catch (err) {
        console.error('Басты бет деректерін жүктеу қатесі:', err);
        setError('Деректерді жүктеу кезінде қате орын алды');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHomeData();
  }, []);
  
  /**
   * Бетбелгіні ауыстыру
   * 
   * @param {Object} book - Кітап объектісі
   */
  const handleToggleBookmark = async (book) => {
    if (!isAuthenticated) {
      setLoginDialog({
        open: true,
        bookId: book.id,
        action: 'bookmark'
      });
      return;
    }
    
    try {
      const isBookmarked = await bookmarkService.toggleBookmark(book.id);
      
      // Жергілікті күйді жаңарту
      const updateBooks = (books) => 
        books.map(b => 
          b.id === book.id 
            ? { ...b, isBookmarked } 
            : b
        );
      
      setPopularBooks(updateBooks(popularBooks));
      setNewBooks(updateBooks(newBooks));
      
      // Сәтті хабарламаны көрсету
      success(isBookmarked
        ? 'Кітап бетбелгілерге қосылды'
        : 'Кітап бетбелгілерден алып тасталды'
      );
    } catch (err) {
      console.error('Бетбелгі ауыстыру қатесі:', err);
      showError('Бетбелгіні өзгерту кезінде қате орын алды');
    }
  };
  
  /**
   * Кітапты алу
   * 
   * @param {Object} book - Кітап объектісі
   */
  const handleBorrow = (book) => {
    if (!isAuthenticated) {
      setLoginDialog({
        open: true,
        bookId: book.id,
        action: 'borrow'
      });
      return;
    }
    
    // Кітап бетіне бағыттау
    window.location.href = `/books/${book.id}`;
  };
  
  /**
   * Кіру диалогын жабу
   */
  const handleCloseLoginDialog = () => {
    setLoginDialog({
      open: false,
      bookId: null,
      action: null
    });
  };
  
  /**
   * Кіру бетіне бағыттау
   */
  const handleLogin = () => {
    handleCloseLoginDialog();
    window.location.href = '/login';
  };
  
  // Анимация варианттары
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
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
  
  const bannerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };
  
  const statsItems = [
    { icon: <BookIcon fontSize="large" />, count: '100,000+', label: 'Кітаптар' },
    { icon: <PersonIcon fontSize="large" />, count: '10,000+', label: 'Оқырмандар' },
    { icon: <SchoolIcon fontSize="large" />, count: '50+', label: 'Мамандықтар' }
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Басты баннер */}
        <motion.div variants={bannerVariants}>
          <Box
            sx={{
              position: 'relative',
              borderRadius: 4,
              overflow: 'hidden',
              mb: 6,
              boxShadow: theme.shadows[4],
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            }}
          >
            <Box
              sx={{
                position: 'relative',
                zIndex: 2,
                px: { xs: 3, md: 8 },
                py: { xs: 6, md: 10 },
                color: '#fff',
                width: { xs: '100%', md: '60%' }
              }}
            >
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  textShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
                }}
              >
                Нархоз университеті кітапханасы
              </Typography>
              
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  fontWeight: 'normal',
                  opacity: 0.9,
                  textShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)'
                }}
              >
                Білім мен ғылым әлеміне жол ашатын ресурстар орталығы
              </Typography>
              
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2
                }}
              >
                <Button
                  component={RouterLink}
                  to="/books"
                  variant="contained"
                  color="secondary"
                  size="large"
                  startIcon={<SearchIcon />}
                  sx={{
                    py: 1.5,
                    px: 3,
                    fontWeight: 'bold',
                    borderRadius: 2,
                    backgroundColor: '#fff',
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: alpha('#fff', 0.9),
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'
                    },
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  Кітаптар каталогы
                </Button>
                
                {!isAuthenticated && (
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="outlined"
                    size="large"
                    sx={{
                      py: 1.5,
                      px: 3,
                      fontWeight: 'bold',
                      borderRadius: 2,
                      borderColor: '#fff',
                      color: '#fff',
                      '&:hover': {
                        borderColor: '#fff',
                        backgroundColor: alpha('#fff', 0.1),
                        transform: 'translateY(-2px)'
                      },
                      transition: 'transform 0.3s'
                    }}
                  >
                    Кіру
                  </Button>
                )}
              </Box>
            </Box>
            
            {/* Декоративті элементтер */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: { xs: '100%', md: '50%' },
                height: '100%',
                overflow: 'hidden',
                display: { xs: 'none', md: 'block' }
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: '-10%',
                  right: '-10%',
                  width: '120%',
                  height: '120%',
                  borderRadius: '50%',
                  background: alpha('#fff', 0.05),
                  zIndex: 1
                }}
              />
              
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '-10%',
                  left: '-20%',
                  width: '80%',
                  height: '80%',
                  borderRadius: '50%',
                  background: alpha('#fff', 0.05),
                  zIndex: 1
                }}
              />
              
              {/* Оформление из книжных иконок */}
              {[...Array(8)].map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    position: 'absolute',
                    color: alpha('#fff', 0.1 + (index % 3) * 0.08),
                    fontSize: 30 + (index % 5) * 10,
                    top: `${10 + (index * 10) % 80}%`,
                    right: `${5 + (index * 12) % 70}%`,
                    transform: `rotate(${(index * 45) % 90 - 45}deg)`,
                    zIndex: 1
                  }}
                >
                  <BookIcon fontSize="inherit" />
                </Box>
              ))}
            </Box>
          </Box>
        </motion.div>
        
        {/* Статистика секциясы */}
        <motion.div variants={itemVariants}>
          <Grid 
            container 
            spacing={3} 
            sx={{ 
              mb: 6,
              mt: 2
            }}
          >
            {statsItems.map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  whileHover={{ y: -5, boxShadow: theme.shadows[8] }}
                  transition={{ duration: 0.3 }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      borderRadius: 3,
                      height: '100%',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        boxShadow: theme.shadows[6]
                      }
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          p: 2,
                          borderRadius: '50%',
                          mb: 2,
                          color: theme.palette.primary.main
                        }}
                      >
                        {item.icon}
                      </Box>
                      
                      <Typography
                        variant="h3"
                        component="div"
                        sx={{
                          mb: 1,
                          fontWeight: 'bold',
                          color: theme.palette.primary.main
                        }}
                      >
                        {item.count}
                      </Typography>
                      
                      <Typography
                        variant="h6"
                        color="text.secondary"
                      >
                        {item.label}
                      </Typography>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
        
        {/* Танымал кітаптар секциясы */}
        <motion.div variants={itemVariants}>
          <Box sx={{ mb: 8 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 3
            }}>
              <Typography 
                variant="h4" 
                component="h2" 
                sx={{ fontWeight: 'bold' }}
              >
                Танымал кітаптар
              </Typography>
              
              <Button
                component={RouterLink}
                to="/books?sort=-rating"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  fontWeight: 'medium'
                }}
              >
                Барлығын көру
              </Button>
            </Box>
            
            <Divider sx={{ mb: 4 }} />
            
            <AnimatePresence>
              <Grid container spacing={3}>
                {popularBooks.length > 0 ? (
                  popularBooks.map((book) => (
                    <Grid item key={book.id} xs={12} sm={6} md={isTablet ? 6 : 3}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <BookCard
                          book={book}
                          onToggleBookmark={handleToggleBookmark}
                          onBorrow={handleBorrow}
                        />
                      </motion.div>
                    </Grid>
                  ))
                ) : loading ? (
                  // Жүктелу кезінде заглушка
                  [...Array(4)].map((_, index) => (
                    <Grid item key={index} xs={12} sm={6} md={isTablet ? 6 : 3}>
                      <BookCard isLoading={true} />
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <EmptyState
                      icon={<BookIcon sx={{ fontSize: 40 }} />}
                      title="Танымал кітаптар табылмады"
                      description="Кітаптарды каталогтан қараңыз"
                    />
                  </Grid>
                )}
              </Grid>
            </AnimatePresence>
          </Box>
        </motion.div>
        
        {/* Жаңа түскен кітаптар секциясы */}
        <motion.div variants={itemVariants}>
          <Box sx={{ mb: 8 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 3
            }}>
              <Typography 
                variant="h4" 
                component="h2" 
                sx={{ fontWeight: 'bold' }}
              >
                Жаңа түскен кітаптар
              </Typography>
              
              <Button
                component={RouterLink}
                to="/books?sort=-createdAt"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  fontWeight: 'medium'
                }}
              >
                Барлығын көру
              </Button>
            </Box>
            
            <Divider sx={{ mb: 4 }} />
            
            <AnimatePresence>
              <Grid container spacing={3}>
                {newBooks.length > 0 ? (
                  newBooks.map((book) => (
                    <Grid item key={book.id} xs={12} sm={6} md={isTablet ? 6 : 3}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <BookCard
                          book={book}
                          onToggleBookmark={handleToggleBookmark}
                          onBorrow={handleBorrow}
                        />
                      </motion.div>
                    </Grid>
                  ))
                ) : loading ? (
                  // Жүктелу кезінде заглушка
                  [...Array(4)].map((_, index) => (
                    <Grid item key={index} xs={12} sm={6} md={isTablet ? 6 : 3}>
                      <BookCard isLoading={true} />
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <EmptyState
                      icon={<BookIcon sx={{ fontSize: 40 }} />}
                      title="Жаңа кітаптар табылмады"
                      description="Кітаптарды каталогтан қараңыз"
                    />
                  </Grid>
                )}
              </Grid>
            </AnimatePresence>
          </Box>
        </motion.div>
        
        {/* Төменгі баннер - кітапхана қызметтері */}
        <motion.div variants={itemVariants}>
          <Box
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.light, 0.9)} 0%, ${theme.palette.secondary.main} 100%)`,
              boxShadow: theme.shadows[3],
              position: 'relative',
              mb: 4
            }}
          >
            <Grid container>
              <Grid item xs={12} md={7}>
                <Box
                  sx={{
                    p: { xs: 4, md: 6 },
                    color: '#fff'
                  }}
                >
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                      mb: 2,
                      fontWeight: 'bold'
                    }}
                  >
                    Кітапхана қызметтері
                  </Typography>
                  
                  <Typography
                    variant="body1"
                    sx={{ mb: 3, fontSize: '1.1rem' }}
                  >
                    Біздің кітапхана студенттерге, оқытушыларға және ғылыми қызметкерлерге арналған кең ауқымды қызметтерді ұсынады.
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {[
                      { label: 'Кітап қарызға алу', icon: <LocalLibraryIcon /> },
                      { label: 'Оқу залдары', icon: <SchoolIcon /> },
                      { label: 'Электронды ресурстар', icon: <BookIcon /> }
                    ].map((service, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            bgcolor: alpha('#fff', 0.1),
                            borderRadius: 2,
                            p: 2
                          }}
                        >
                          <Box
                            sx={{
                              mr: 2,
                              color: '#fff'
                            }}
                          >
                            {service.icon}
                          </Box>
                          <Typography variant="body1" fontWeight="medium">
                            {service.label}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                  
                  <Button
                    component={RouterLink}
                    to="/about"
                    variant="contained"
                    sx={{
                      bgcolor: '#fff',
                      color: theme.palette.secondary.main,
                      fontWeight: 'bold',
                      '&:hover': {
                        bgcolor: alpha('#fff', 0.9)
                      },
                      py: 1.2,
                      px: 3,
                      borderRadius: 2
                    }}
                  >
                    Толығырақ білу
                  </Button>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Box
                  sx={{
                    height: '100%',
                    position: 'relative'
                  }}
                >
                  {/* Фон с эффектом */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      p: 4
                    }}
                  >
                    {/* Декоративные элементы */}
                    {[...Array(5)].map((_, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: 'absolute',
                          color: alpha('#fff', 0.2 + (index % 3) * 0.1),
                          fontSize: 40 + (index % 3) * 20,
                          top: `${10 + (index * 20) % 70}%`,
                          left: `${(index * 15) % 60}%`,
                          transform: `rotate(${(index * 30) % 90 - 45}deg)`,
                          filter: 'blur(1px)'
                        }}
                      >
                        <BookIcon fontSize="inherit" />
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </motion.div>
      </Container>
      
      {/* Авторизация диалогы */}
      <AlertDialog
        open={loginDialog.open}
        onClose={handleCloseLoginDialog}
        title="Жүйеге кіру қажет"
        content={
          <Typography variant="body1">
            {loginDialog.action === 'bookmark'
              ? 'Кітапты бетбелгіге қосу үшін жүйеге кіру қажет'
              : 'Кітапты қарап шығу үшін жүйеге кіру қажет'}
          </Typography>
        }
        confirmText="Кіру"
        cancelText="Болдырмау"
        onConfirm={handleLogin}
      />
    </motion.div>
  );
};

export default HomePage;