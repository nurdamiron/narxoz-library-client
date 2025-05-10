/**
 * src/components/books/BookCard.jsx
 * 
 * Жақсартылған кітап карточкасы компоненті
 * 
 * Бұл компонент кітаптың толық мәліметтерін карточка түрінде көрсетеді.
 * Анимациялар, микровзаимодействия және кеңейтілген функционал қосылған.
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Chip,
  Button,
  Tooltip,
  Divider,
  useTheme,
  alpha,
  Skeleton,
  Collapse
} from '@mui/material';
import {
  BookmarkBorder as BookmarkBorderIcon,
  Bookmark as BookmarkIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  LocalLibrary as LocalLibraryIcon,
  VisibilityOff as VisibilityOffIcon,
  CalendarToday as CalendarIcon,
  Language as LanguageIcon,
  InfoOutlined as InfoIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Локальные компоненты
import BookRating from './BookRating';

/**
 * BookCard компоненті
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {Object} props.book - Кітап объектісі
 * @param {Function} props.onToggleBookmark - Бетбелгі ауысқанда шақырылатын функция
 * @param {Function} props.onBorrow - Кітапты алу түймесі басылғанда шақырылатын функция
 * @param {boolean} props.isDetails - Толық мәліметтер көрсетілсін бе?
 * @param {boolean} props.isLoading - Жүктелу күйі
 * @param {Object} props.sx - Қосымша Material UI стильдері
 * @returns {JSX.Element} - Кітап карточкасы
 */
const BookCard = ({
  book,
  onToggleBookmark,
  onBorrow,
  isDetails = false,
  isLoading = false,
  sx = {}
}) => {
  const theme = useTheme();
  
  // Күйлер
  const [expanded, setExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Кітап объектісі бос болса немесе жүктелу күйінде болса
  if (isLoading || !book) {
    return (
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          ...sx
        }}
      >
        <Skeleton variant="rectangular" height={200} animation="wave" />
        <CardContent>
          <Skeleton variant="text" height={32} animation="wave" />
          <Skeleton variant="text" width="60%" height={24} animation="wave" />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Skeleton variant="text" width="40%" height={24} animation="wave" />
            <Skeleton variant="circular" width={24} height={24} animation="wave" />
          </Box>
        </CardContent>
      </Card>
    );
  }
  
  /**
   * Бетбелгі қосу/алу функциясы
   * 
   * @param {Event} e - Оқиға объектісі
   */
  const handleToggleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleBookmark) {
      onToggleBookmark(book);
    }
  };
  
  /**
   * Кітапты алу функциясы
   * 
   * @param {Event} e - Оқиға объектісі
   */
  const handleBorrow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onBorrow) {
      onBorrow(book);
    }
  };
  
  /**
   * Карточканы кеңейту/жию функциясы
   * 
   * @param {Event} e - Оқиға объектісі
   */
  const handleExpandClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded(!expanded);
  };
  
  // Мұқаба URL
  const coverUrl = book.cover
    ? book.cover.startsWith('/uploads')
      ? `${window.location.protocol}//${window.location.host.replace(/:\d+/, ':5001')}${book.cover}`
      : book.cover
    : 'https://via.placeholder.com/300x450?text=Мұқаба+жоқ';
  
  // Кітаптың қысқаша сипаттамасы
  const shortDescription = book.description
    ? book.description.length > 120
      ? `${book.description.substring(0, 120)}...`
      : book.description
    : '';
  
  // Кітап категориясының аты
  const categoryName = book.category?.name || '';
  
  // Мұқаба суретінің жүктелу оқиғасы
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <motion.div
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
    >
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: theme.shadows[2],
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: theme.shadows[6],
          },
          ...sx
        }}
      >
        <CardActionArea 
          component={RouterLink} 
          to={`/books/${book.id}`}
          sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-start',
            height: '100%'
          }}
        >
          {/* Кітап мұқабасы */}
          <Box sx={{ position: 'relative', width: '100%', paddingTop: '140%' }}>
            {!imageLoaded && (
              <Skeleton 
                variant="rectangular" 
                animation="wave"
                sx={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 1
                }}
              />
            )}
            <CardMedia
              component="img"
              image={coverUrl}
              alt={book.title}
              onLoad={handleImageLoad}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: imageLoaded ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out'
              }}
            />
            
            {/* Категория чипі */}
            {categoryName && (
              <Chip
                label={categoryName}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  backgroundColor: alpha(theme.palette.primary.main, 0.85),
                  color: theme.palette.primary.contrastText,
                  fontWeight: 'medium',
                  fontSize: '0.7rem'
                }}
              />
            )}
            
            {/* Қолжетімділік индикаторы */}
            {book.availableCopies <= 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: alpha(theme.palette.background.paper, 0.7),
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <VisibilityOffIcon 
                  sx={{ 
                    fontSize: 60, 
                    color: alpha(theme.palette.error.main, 0.8)
                  }} 
                />
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: alpha(theme.palette.error.main, 0.8),
                    mt: 1
                  }}
                >
                  Уақытша қолжетімсіз
                </Typography>
              </Box>
            )}
          </Box>
          
          {/* Кітап мәліметтері */}
          <CardContent sx={{ flexGrow: 1, width: '100%' }}>
            <Typography 
              gutterBottom 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.3,
                minHeight: '2.6em'
              }}
            >
              {book.title}
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              {book.author}
            </Typography>
            
            {/* Рейтинг */}
            <Box sx={{ mb: 1 }}>
              <BookRating 
                rating={book.rating || 0} 
                reviewCount={book.reviewCount || 0}
                size="small"
              />
            </Box>

            {/* Жыл және тіл */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 1
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarIcon sx={{ fontSize: '0.875rem', color: 'text.secondary', mr: 0.5 }} />
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                >
                  {book.publicationYear}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LanguageIcon sx={{ fontSize: '0.875rem', color: 'text.secondary', mr: 0.5 }} />
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                >
                  {book.language}
                </Typography>
              </Box>
            </Box>
            
            {/* Сипаттама (егер isDetails=true болса) */}
            {isDetails && (
              <>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 1
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ fontWeight: 'medium' }}
                  >
                    Сипаттама
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="сипаттаманы көрсету"
                  >
                    {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                  </IconButton>
                </Box>
                
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <Typography variant="body2" paragraph>
                    {book.description}
                  </Typography>
                </Collapse>
                
                {!expanded && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {shortDescription}
                  </Typography>
                )}
              </>
            )}
          </CardContent>
        </CardActionArea>
        
        {/* Төменгі панель және әрекеттер */}
        <Divider />
        <CardActions sx={{ p: 2, pt: 1.5, pb: 1.5, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip 
              title={book.availableCopies > 0 ? "Қолжетімді" : "Қолжетімсіз"}
              arrow
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalLibraryIcon 
                  fontSize="small" 
                  color={book.availableCopies > 0 ? "success" : "disabled"} 
                  sx={{ mr: 0.5 }} 
                />
                <Typography 
                  variant="body2" 
                  color={book.availableCopies > 0 ? "success.main" : "text.disabled"}
                >
                  {book.availableCopies || 0} дана
                </Typography>
              </Box>
            </Tooltip>
          </Box>
          
          {/* Бетбелгі түймесі */}
          <Box>
            {book.availableCopies > 0 && onBorrow && (
              <Button
                size="small"
                variant="contained"
                startIcon={<LocalLibraryIcon />}
                onClick={handleBorrow}
                sx={{ 
                  mr: 1,
                  borderRadius: 2,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: theme.shadows[2]
                  }
                }}
              >
                Алу
              </Button>
            )}
            
            <Tooltip 
              title={book.isBookmarked ? "Бетбелгіден алып тастау" : "Бетбелгіге қосу"}
              arrow
            >
              <IconButton
                onClick={handleToggleBookmark}
                size="small"
                color="primary"
                aria-label={book.isBookmarked ? "Бетбелгіден алып тастау" : "Бетбелгіге қосу"}
              >
                {book.isBookmarked ? (
                  <BookmarkIcon color="primary" />
                ) : (
                  <BookmarkBorderIcon />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </CardActions>
      </Card>
    </motion.div>
  );
};

BookCard.propTypes = {
  book: PropTypes.object,
  onToggleBookmark: PropTypes.func,
  onBorrow: PropTypes.func,
  isDetails: PropTypes.bool,
  isLoading: PropTypes.bool,
  sx: PropTypes.object
};

export default BookCard;