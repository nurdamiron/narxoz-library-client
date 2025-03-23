/**
 * src/components/books/BookDetails.jsx
 * 
 * Кітап толық мәліметтері компоненті
 * 
 * Бұл компонент кітаптың барлық мәліметтерін көрсетеді және пайдаланушыға
 * кітапты алу, бетбелгіге қосу және сілтемемен бөлісу мүмкіндіктерін ұсынады.
 * Компонент мобильді және десктоп құрылғылар үшін бейімделген.
 * 
 * @param {Object} book - кітап туралы мәліметтер
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Card,
  CardMedia,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Button,
  Paper,
  Snackbar,
  Stack,
  Typography,
  Alert,
  useTheme,
  alpha,
  Container,
  useMediaQuery,
  Rating,
  Tooltip,
  Skeleton,
  IconButton
} from '@mui/material';
import {
  CalendarToday,
  Category,
  Language,
  School,
  LocalLibrary,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
  ArrowBack as ArrowBackIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

const BookDetails = ({ book }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Күйлер
  const [bookmarked, setBookmarked] = useState(book?.isBookmarked || false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [coverZoomed, setCoverZoomed] = useState(false);

  // Бетбелгіге қосу/алып тастау функциясы
  const handleBookmarkToggle = () => {
    setBookmarked(!bookmarked);
    setSnackbarMessage(
      bookmarked
        ? 'Кітап бетбелгілерден алынып тасталды'
        : 'Кітап бетбелгілерге қосылды'
    );
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  // Сілтемені көшіру функциясы
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setSnackbarMessage('Сілтеме буферге көшірілді');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  // "Кітапты алу" түймесін басу функциясы
  const handleBorrowClick = () => {
    setDialogOpen(true);
  };

  // Диалогты жабу
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  // Кітапты алуды растау
  const handleConfirmBorrow = () => {
    setDialogOpen(false);
    setSnackbarMessage('Кітап сәтті тапсырылды! Оны кітапханадан 3 күн ішінде алыңыз.');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  // Хабарламаны жабу
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  
  // Мұқаба суреті жүктелгенде
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  // Мұқаба суретін үлкейту/кішірейту
  const handleToggleZoom = () => {
    setCoverZoomed(!coverZoomed);
  };
  
  // Кітап бар-жоғын тексеру
  if (!book) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          Кітап туралы ақпарат табылмады.
        </Alert>
      </Container>
    );
  }
  
  // Бет анимациясы
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    },
    exit: { opacity: 0 }
  };
  
  // Элемент анимациясы
  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <Container maxWidth="lg" sx={{ 
        pb: { xs: 0, md: 8 },
        px: { xs: 0, md: 3 },
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
        {/* Артқа қайту түймесі */}
        <motion.div variants={itemVariants}>
          <Box sx={{ 
            mb: 2, 
            mt: 4, 
            px: { xs: 2, md: 0 },
            display: 'flex',
            alignItems: 'center'
          }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => window.history.back()}
              sx={{ 
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                }
              }}
            >
              Артқа қайту
            </Button>
          </Box>
        </motion.div>
        
        {/* Атауы (тек десктоп нұсқада) */}
        {!isMobile && (
          <motion.div variants={itemVariants}>
            <Box sx={{ mb: 4, px: { xs: 2, md: 0 } }}>
              <Typography 
                variant="h4" 
                component="h1" 
                fontWeight="bold" 
                gutterBottom
                sx={{
                  color: theme.palette.primary.main,
                  position: 'relative',
                  display: 'inline-block',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    bottom: -5,
                    width: '60%',
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: theme.palette.primary.main
                  }
                }}
              >
                {book.title}
              </Typography>
            </Box>
          </motion.div>
        )}
        
        <Grid container spacing={isMobile ? 0 : 5} sx={{ flex: 1 }}>
          {/* Сол жақ колонка - кітап мұқабасы */}
          <Grid item xs={12} md={4}>
            <motion.div variants={itemVariants}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  borderRadius: isMobile ? 0 : 3,
                  overflow: 'hidden',
                  boxShadow: isMobile ? 'none' : theme.shadows[3],
                  position: 'relative',
                  '&:hover': {
                    transform: isMobile ? 'none' : 'scale(1.02)',
                    boxShadow: isMobile ? 'none' : theme.shadows[6],
                  },
                  cursor: 'pointer'
                }}
                onClick={handleToggleZoom}
              >
                {!imageLoaded && (
                  <Skeleton
                    variant="rectangular" 
                    animation="wave"
                    height={500}
                    sx={{ 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 1
                    }}
                  />
                )}
                <CardMedia
                  component="img"
                  image={book.cover || 'https://via.placeholder.com/400x600?text=Мұқаба+жоқ'}
                  alt={book.title}
                  onLoad={handleImageLoad}
                  sx={{
                    height: 'auto',
                    maxHeight: 500,
                    objectFit: 'contain',
                    p: 2,
                    backgroundColor: alpha(theme.palette.background.paper, 0.9),
                    opacity: imageLoaded ? 1 : 0,
                    transition: 'opacity 0.5s ease-in-out',
                  }}
                />
                <Tooltip title="Үлкейту/кішірейту" arrow>
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      backgroundColor: alpha(theme.palette.common.white, 0.8),
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.common.white, 0.9),
                      },
                      zIndex: 2
                    }}
                    size="small"
                  >
                    <SearchIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Card>
            </motion.div>
            
            {/* Кітапты алу түймесі - мобильді нұсқада */}
            {isMobile && (
              <motion.div variants={itemVariants}>
                <Box sx={{ mt: 3, px: 2 }}>
                  {book.available ? (
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleBorrowClick}
                      startIcon={<LocalLibrary />}
                      sx={{
                        py: 1.8,
                        borderRadius: 3,
                        fontWeight: 'bold',
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        fontSize: '1.1rem',
                        textTransform: 'none',
                        boxShadow: theme.shadows[3],
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.9),
                          boxShadow: theme.shadows[5],
                          transform: 'translateY(-2px)'
                        },
                        transition: 'transform 0.2s, box-shadow 0.2s',
                      }}
                    >
                      Кітапты алу
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      fullWidth
                      disabled
                      sx={{
                        py: 1.8,
                        borderRadius: 3,
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        textTransform: 'none',
                      }}
                    >
                      Қолжетімді емес
                    </Button>
                  )}
                  
                  {!book.available && (
                    <Typography 
                      variant="body2" 
                      color="error.main"
                      align="center"
                      sx={{ mt: 1 }}
                    >
                      Қазіргі уақытта кітап қолжетімді емес
                    </Typography>
                  )}
                </Box>
              </motion.div>
            )}
          </Grid>

          {/* Оң жақ колонка - кітап туралы ақпарат */}
          <Grid item xs={12} md={8}>
            <Box sx={{ p: { xs: 3, md: 0 }, pt: { xs: 4, md: 0 } }}>
              {/* Кітаптың мобильді нұсқадағы атауы */}
              {isMobile && (
                <motion.div variants={itemVariants}>
                  <Box sx={{ mb: 3 }}>
                    <Typography 
                      variant="h5" 
                      component="h1" 
                      fontWeight="bold" 
                      gutterBottom
                      sx={{
                        color: theme.palette.primary.main
                      }}
                    >
                      {book.title}
                    </Typography>
                  </Box>
                </motion.div>
              )}
              
              {/* Кітап туралы ақпарат */}
              <motion.div variants={itemVariants}>
                <Box sx={{ mb: 4 }}>
                  <Chip
                    label={book.category}
                    color="primary"
                    size="small"
                    sx={{ 
                      mb: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                      fontWeight: 'medium'
                    }}
                    variant="outlined"
                  />
                  <Typography 
                    variant="h6" 
                    color="text.secondary" 
                    gutterBottom
                    sx={{ fontWeight: 'medium' }}
                  >
                    {book.author}
                  </Typography>
                  
                  {/* Рейтинг */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Rating 
                      value={book.rating || 0}
                      readOnly
                      precision={0.5}
                      icon={<StarIcon fontSize="inherit" />}
                      emptyIcon={<StarBorderIcon fontSize="inherit" />}
                      sx={{
                        color: '#FFC107',
                        '& .MuiRating-iconEmpty': {
                          color: alpha('#FFC107', 0.3)
                        }
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      {book.rating} ({book.reviewCount} пікір)
                    </Typography>
                  </Box>
                </Box>
              </motion.div>

              <Divider sx={{ mb: 4 }} />

              {/* Кітап сипаттамасы */}
              <motion.div variants={itemVariants}>
                <Box sx={{ mb: 4 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    fontWeight="bold"
                    sx={{
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <InfoIcon 
                      fontSize="small" 
                      sx={{ 
                        mr: 1,
                        color: theme.palette.primary.main
                      }} 
                    />
                    Кітап туралы
                  </Typography>
                  <Typography 
                    variant="body1" 
                    paragraph 
                    sx={{ 
                      mb: 4,
                      lineHeight: 1.7,
                      color: alpha(theme.palette.text.primary, 0.87),
                      textAlign: 'justify'
                    }}
                  >
                    {book.description || 'Экономика мамандықтарының студенттеріне арналған қаржылық менеджмент бойынша оқулық. Кітапта қаржылық менеджменттің заманауи теориясы мен тәжірибесіне толық шолу жасалған. Онда қаржылық менеджменттің негізгі тұжырымдамалары, айналым капиталын, капитал құрылымын, дивидендтік саясатты басқару, кәсіпорынның инвестициялық қызметі және бизнестің құнын бағалау қарастырылған.'}
                  </Typography>
                </Box>
              </motion.div>

              {/* Кітаптың техникалық сипаттамалары */}
              <motion.div variants={itemVariants}>
                <Grid container spacing={3} sx={{ mb: 5 }}>
                  <Grid item xs={12} sm={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        height: '100%',
                        backgroundColor: alpha(theme.palette.background.paper, 0.9),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        borderRadius: 3,
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: isMobile ? 'none' : 'translateY(-4px)',
                          boxShadow: isMobile ? 'none' : `0 8px 16px ${alpha(theme.palette.primary.main, 0.1)}`,
                        },
                      }}
                    >
                      <Stack spacing={3}>
                        {/* Шығарылған жылы */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              mr: 1.5
                            }}
                          >
                            <CalendarToday
                              fontSize="small"
                              sx={{ color: theme.palette.primary.main }}
                            />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" component="span" fontWeight="bold" sx={{ mr: 1, display: 'block' }}>
                              Шығарылған жылы:
                            </Typography>
                            <Typography variant="body1" component="span">
                              {book.publicationYear}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Категория */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              mr: 1.5
                            }}
                          >
                            <Category
                              fontSize="small"
                              sx={{ color: theme.palette.primary.main }}
                            />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" component="span" fontWeight="bold" sx={{ mr: 1, display: 'block' }}>
                              Категория:
                            </Typography>
                            <Typography variant="body1" component="span">
                              {book.category}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Тілі */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              mr: 1.5
                            }}
                          >
                            <Language
                              fontSize="small"
                              sx={{ color: theme.palette.primary.main }}
                            />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" component="span" fontWeight="bold" sx={{ mr: 1, display: 'block' }}>
                              Тілі:
                            </Typography>
                            <Typography variant="body1" component="span">
                              Орыс
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        height: '100%',
                        backgroundColor: alpha(theme.palette.background.paper, 0.9),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        borderRadius: 3,
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: isMobile ? 'none' : 'translateY(-4px)',
                          boxShadow: isMobile ? 'none' : `0 8px 16px ${alpha(theme.palette.primary.main, 0.1)}`,
                        },
                      }}
                    >
                      <Stack spacing={3}>
                        {/* Мамандық */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              mr: 1.5
                            }}
                          >
                            <School
                              fontSize="small"
                              sx={{ color: theme.palette.primary.main }}
                            />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" component="span" fontWeight="bold" sx={{ mr: 1, display: 'block' }}>
                              Мамандық:
                            </Typography>
                            <Typography variant="body1" component="span">
                              {book.category === 'IT и программирование'
                                ? 'Ақпараттық технологиялар'
                                : book.category === 'Право'
                                ? 'Құқықтану'
                                : 'Экономика және бизнес'}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Қолжетімділік */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: book.available 
                                ? alpha(theme.palette.success.main, 0.1)
                                : alpha(theme.palette.error.main, 0.1),
                              mr: 1.5
                            }}
                          >
                            <LocalLibrary
                              fontSize="small"
                              sx={{ 
                                color: book.available 
                                  ? theme.palette.success.main
                                  : theme.palette.error.main
                              }}
                            />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" component="span" fontWeight="bold" sx={{ mr: 1, display: 'block' }}>
                              Қолжетімділік:
                            </Typography>
                            <Typography
                              variant="body1"
                              component="span"
                              sx={{
                                color: book.available
                                  ? theme.palette.success.main
                                  : theme.palette.error.main,
                                fontWeight: 'medium',
                              }}
                            >
                              {book.available ? 'Қолжетімді' : 'Қолжетімді емес'}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>
              </motion.div>

              <Divider sx={{ mb: 4 }} />

              {/* Ұсынылатын курстар */}
              <motion.div variants={itemVariants}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  fontWeight="bold" 
                  sx={{ 
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <School 
                    fontSize="small" 
                    sx={{ 
                      mr: 1,
                      color: theme.palette.primary.main
                    }} 
                  />
                  Ұсынылатын курстар
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 5 }}>
                  {/* Категорияға қарай ұсынылатын курстар */}
                  {book.category === 'Финансы' && (
                    <>
                      <Chip 
                        label="Қаржылық менеджмент" 
                        sx={{ 
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          mb: 1,
                          fontWeight: 'medium',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                          }
                        }}
                      />
                      <Chip 
                        label="Корпоративтік қаржы" 
                        sx={{ 
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          mb: 1,
                          fontWeight: 'medium',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                          }
                        }}
                      />
                      <Chip 
                        label="Инвестициялық талдау" 
                        sx={{ 
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          mb: 1,
                          fontWeight: 'medium',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                          }
                        }}
                      />
                    </>
                  )}
                  {/* Басқа категориялар үшін */}
                  {!book.category || book.category !== 'Финансы' && (
                    <Typography variant="body1" color="text.secondary">
                      Бұл кітап үшін ұсынылған курстар жоқ.
                    </Typography>
                  )}
                </Box>
              </motion.div>
              
              {/* Кітапты алу түймесі - десктоп нұсқада */}
              {!isMobile && (
                <motion.div variants={itemVariants}>
                  <Box sx={{ mb: 4 }}>
                    {book.available ? (
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<LocalLibrary />}
                        onClick={handleBorrowClick}
                        sx={{
                          py: 1.5,
                          px: 4,
                          borderRadius: 3,
                          fontWeight: 'bold',
                          backgroundColor: theme.palette.primary.main,
                          color: 'white',
                          fontSize: '1.1rem',
                          textTransform: 'none',
                          boxShadow: theme.shadows[3],
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.9),
                            boxShadow: theme.shadows[5],
                            transform: 'translateY(-2px)'
                          },
                          transition: 'transform 0.2s, box-shadow 0.2s',
                        }}
                      >
                        Кітапты алу
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        size="large"
                        disabled
                        sx={{
                          py: 1.5,
                          px: 4,
                          borderRadius: 3,
                          fontWeight: 'bold',
                          fontSize: '1.1rem',
                          textTransform: 'none',
                        }}
                      >
                        Қолжетімді емес
                      </Button>
                    )}
                    
                    {!book.available && (
                      <Typography 
                        variant="body2" 
                        color="error.main"
                        sx={{ mt: 1 }}
                      >
                        Қазіргі уақытта кітап қолжетімді емес
                      </Typography>
                    )}
                  </Box>
                </motion.div>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Негізгі әрекет түймелері - барлық құрылғыларға ортақ */}
        <motion.div 
          variants={itemVariants}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: { 
              delay: 0.5,
              duration: 0.5 
            }
          }}
        >
          <Box sx={{ width: '100%', mt: { xs: 0, md: 'auto',} }}>
            <Card 
              elevation={3}
              sx={{ 
                borderRadius: { xs: 0, md: 3 },
                overflow: 'hidden',
                width: '100%',
              }}
            >
              {/* Төменгі панель түймелері */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  width: '100%',
                  bgcolor: theme.palette.background.paper
                }}
              >
                {/* Бетбелгі түймесі */}
                <Button
                  onClick={handleBookmarkToggle}
                  startIcon={
                    <motion.div
                      animate={{ 
                        scale: bookmarked ? [1, 1.3, 1] : 1,
                        rotate: bookmarked ? [0, -10, 10, 0] : 0
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                    </motion.div>
                  }
                  sx={{ 
                    flex: 1,
                    borderRadius: 0,
                    py: 2,
                    color: bookmarked ? theme.palette.primary.main : alpha(theme.palette.text.primary, 0.7),
                    fontWeight: bookmarked ? 'bold' : 'normal',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    },
                    justifyContent: 'center',
                    transition: 'color 0.3s ease, background-color 0.3s ease'
                  }}
                >
                  {isMobile ? "" : "Бетбелгілер"}
                </Button>

                <Divider orientation="vertical" flexItem />

                {/* Бөлісу түймесі */}
                <Button
                  onClick={handleShare}
                  startIcon={
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <ShareIcon />
                    </motion.div>
                  }
                  sx={{ 
                    flex: 1,
                    borderRadius: 0,
                    py: 2,
                    color: alpha(theme.palette.text.primary, 0.7),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.text.primary, 0.05),
                    },
                    justifyContent: 'center'
                  }}
                >
                  {isMobile ? "" : "Бөлісу"}
                </Button>
              </Box>
            </Card>
          </Box>
        </motion.div>

        {/* Кітапты алу диалогы */}
        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          aria-labelledby="borrow-dialog-title"
          aria-describedby="borrow-dialog-description"
          PaperProps={{
            sx: {
              borderRadius: 3,
              padding: 1,
              maxWidth: 500,
              boxShadow: theme.shadows[10]
            }
          }}
          TransitionComponent={motion.div}
        >
          <DialogTitle 
            id="borrow-dialog-title" 
            sx={{ 
              pb: 1,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 24,
                width: 40,
                height: 3,
                backgroundColor: theme.palette.primary.main,
                borderRadius: 1
              }
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Кітапты алуды растау
            </Typography>
            <IconButton
              aria-label="close"
              onClick={handleDialogClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ display: 'flex', mb: 2 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 2,
                  overflow: 'hidden',
                  mr: 2,
                  flexShrink: 0,
                  boxShadow: theme.shadows[2],
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                }}
              >
                <img 
                  src={book.cover || 'https://via.placeholder.com/100x150?text=Мұқаба+жоқ'} 
                  alt={book.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {book.author}
                </Typography>
              </Box>
            </Box>
            <DialogContentText id="borrow-dialog-description">
              "{book.title}" кітабын алғыңыз келе ме? Кітап сіздің атыңызға сақталады және оны 3 жұмыс күні ішінде кітапханадан алуыңыз керек.
            </DialogContentText>
            <Box 
              sx={{ 
                p: 2, 
                mt: 2, 
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
              }}
            >
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <InfoIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                Кітапты алу үшін студенттік билетіңізді көрсету керек.
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button 
              onClick={handleDialogClose} 
              variant="outlined"
              sx={{ 
                color: alpha(theme.palette.text.primary, 0.7),
                borderColor: alpha(theme.palette.text.primary, 0.2),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.text.primary, 0.05),
                  borderColor: alpha(theme.palette.text.primary, 0.3),
                },
                borderRadius: 2
              }}
            >
              Бас тарту
            </Button>
            <Button 
              onClick={handleConfirmBorrow} 
              variant="contained" 
              sx={{ 
                bgcolor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.9),
                },
                borderRadius: 2,
                px: 3
              }}
            >
              Растау
            </Button>
          </DialogActions>
        </Dialog>

        {/* Мұқаба үлкейтілген диалогы */}
        <Dialog
          open={coverZoomed}
          onClose={handleToggleZoom}
          maxWidth="md"
          PaperProps={{
            sx: {
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: 'background.paper'
            }
          }}
        >
          <DialogContent sx={{ p: 0, position: 'relative' }}>
            <IconButton
              aria-label="close"
              onClick={handleToggleZoom}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'white',
                bgcolor: alpha('black', 0.4),
                '&:hover': {
                  bgcolor: alpha('black', 0.6),
                },
                zIndex: 1
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box 
              component="img"
              src={book.cover || 'https://via.placeholder.com/800x1200?text=Мұқаба+жоқ'}
              alt={book.title}
              sx={{
                width: '100%',
                maxHeight: '80vh',
                objectFit: 'contain'
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Хабарламалар */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          TransitionComponent={motion.div}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            variant="filled"
            sx={{ 
              width: '100%', 
              borderRadius: 2,
              boxShadow: theme.shadows[3]
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </motion.div>
  );
};

export default BookDetails;