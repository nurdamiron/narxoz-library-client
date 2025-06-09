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
  InfoOutlined as InfoIcon,
  BrokenImage as BrokenImageIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// Локальные компоненты
import BookRating from './BookRating';
import { getBookCoverUrl } from '../../utils';

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
  const { t } = useTranslation();
  
  // Күйлер
  const [expanded, setExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
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
  
  // Кітап мұқаба URL
  // For debugging purposes - log the cover URL
  // Force a direct URL for NarXoz book
  const coverUrl = book.title === 'NarXoz' ? 
    'http://localhost:5002/api/narxoz-cover' : 
    getBookCoverUrl(book.cover);
  
  // Debug our cover URL
  console.log(`📗 Book cover URL for "${book.title}" (ID: ${book.id}): ${coverUrl}`);
  console.log(`📙 Original cover path: ${book.cover}`);
  
  // Расширенное логирование для отладки
  console.group(`📚 Данные книги ${book.id}: ${book.title}`);
  
  if (book.relativeCoverPath) {
    console.log(`🔗 Относительный путь обложки: ${book.relativeCoverPath}`);
  }
  
  if (book.coverFileExists !== undefined) {
    console.log(`✅ Файл обложки существует: ${book.coverFileExists ? 'Да' : 'Нет'}`);
  }
  
  if (book.coverFileSize !== undefined) {
    console.log(`📦 Размер файла обложки: ${book.coverFileSize} байт`);
  }
  
  // Try direct access to the book-cover-debug endpoint for NarXoz
  if (book.title === 'NarXoz' && book.cover && book.cover.includes('/uploads/covers/')) {
    const filename = book.cover.split('/uploads/covers/')[1];
    const debugUrl = `http://localhost:5002/api/book-cover-debug/${filename}`;
    console.log(`🔍 Trying direct debug URL for NarXoz: ${debugUrl}`);
  }
  
  // Проверка доступности файла
  if (coverUrl.startsWith('http')) {
    fetch(coverUrl, { method: 'HEAD' })
      .then(response => {
        console.log(`🌐 Проверка доступности URL: ${coverUrl} - ${response.status} ${response.ok ? 'OK' : 'FAILED'}`);
      })
      .catch(error => {
        console.error(`❌ Ошибка при проверке доступности URL: ${coverUrl}`, error);
      });
  }
  
  console.groupEnd();
  
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
    console.log(`✅ Image loaded successfully for book: ${book.title}`); 
    setImageLoaded(true);
    setImageError(false);
  };

  // Обработка ошибки загрузки изображения
  const handleImageError = (e) => {
    // Здесь мы можем напрямую изменить src элемента изображения
    // вместо установки состояния ошибки
    if (e.target && e.target.src) {
      console.error(`Ошибка загрузки обложки книги: ${book.title}, URL: ${e.target.src}`);
      
      // Special handling for NarXoz book
      if (book.title === 'NarXoz') {
        e.target.src = 'https://via.placeholder.com/200x300?text=NarXoz';
        console.log('✅ Заменяем обложку NarXoz на placeholder');
        setImageLoaded(true);
        return;
      }
      
      // Проверяем, не является ли текущий src уже запасным вариантом
      if (!e.target.src.includes('placeholder.com') && !e.target.src.includes('default-book-cover.jpg')) {
        // Заменяем src на дефолтную обложку
        e.target.src = 'http://localhost:5002/uploads/covers/default-book-cover.jpg';
        console.log('✅ Заменяем недоступное изображение на дефолтную обложку');
        return;
      }
    }
    
    // Если не удалось напрямую исправить, используем state
    setImageError(true);
    setImageLoaded(true); // Убираем скелетон при ошибке загрузки
    console.error(`Ошибка загрузки обложки книги: ${book.title}, Original: ${book.cover}`);
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
          minHeight: 320,
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s ease-in-out',
          border: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.08),
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            borderColor: alpha(theme.palette.primary.main, 0.15),
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
            height: '100%',
            '& .MuiCardActionArea-focusHighlight': {
              background: 'transparent'
            }
          }}
        >
          {/* Кітап мұқабасы */}
          <Box sx={{ position: 'relative', width: '100%', paddingTop: '130%' }}>
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
            
            {imageError ? (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                  color: theme.palette.text.secondary,
                }}
              >
                <BrokenImageIcon sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="caption" align="center" sx={{ px: 2 }}>
                  {t('books.coverLoadFailed', 'Мұқаба жүктелмеді')}
                </Typography>
                {/* Детали ошибки для отладки */}
                <Typography variant="caption" align="center" sx={{ 
                  px: 2, 
                  fontSize: '0.6rem', 
                  color: 'text.disabled',
                  display: 'block',
                  mt: 1
                }}>
                  {book.title} (ID: {book.id})
                </Typography>
                <Typography variant="caption" align="center" sx={{ 
                  px: 2, 
                  fontSize: '0.6rem', 
                  color: 'error.light',
                  display: 'block',
                  wordBreak: 'break-all'
                }}>
                  {book.cover || 'Нет данных об обложке'}
                </Typography>
              </Box>
            ) : (
              <CardMedia
                component="img"
                image={coverUrl}
                alt={book.title}
                onLoad={handleImageLoad}
                onError={handleImageError}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: imageLoaded ? 1 : 0,
                  transition: 'opacity 0.3s ease-in-out',
                  // Добавляем правило для обхода CORS
                  crossOrigin: 'anonymous',
                  backgroundColor: 'background.paper' // Add background color to help with visibility
                }}
              />
            )}
            
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
                  {t('books.temporarilyUnavailable', 'Уақытша қолжетімсіз')}
                </Typography>
              </Box>
            )}
          </Box>
          
          {/* Кітап мәліметтері */}
          <CardContent sx={{ flexGrow: 1, width: '100%', p: 2 }}>
            <Typography 
              gutterBottom 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.3,
                height: '1.3em',
                fontSize: '0.95rem',
                mb: 0.5
              }}
            >
              {book.title}
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                mb: 0.5, 
                fontSize: '0.85rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {book.author}
            </Typography>
            
            {/* Рейтинг */}
            <Box sx={{ mb: 0.5 }}>
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
                  {t(`languages.${book.language}`) || t(book.language) || book.language}
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
                    {t('books.description', 'Сипаттама')}
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
        <CardActions sx={{ 
          p: 1.5, 
          pt: 1, 
          pb: 1, 
          justifyContent: 'space-between',
          mt: 'auto',
          borderTop: 1,
          borderColor: 'divider'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip 
              title={book.availableCopies > 0 ? t('books.available', 'Қолжетімді') : t('books.unavailable', 'Қолжетімсіз')}
              arrow
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalLibraryIcon 
                  fontSize="small" 
                  color={book.availableCopies > 0 ? "success" : "disabled"} 
                  sx={{ mr: 0.5 }} 
                />
                <Typography 
                  variant="caption" 
                  color={book.availableCopies > 0 ? "success.main" : "text.disabled"}
                  sx={{ fontWeight: 'medium' }}
                >
                  {book.availableCopies || 0}
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
                {t('books.borrow', 'Алу')}
              </Button>
            )}
            
            <Tooltip 
              title={book.isBookmarked ? t('books.removeFromBookmarks', 'Бетбелгіден алып тастау') : t('books.addToBookmarks', 'Бетбелгіге қосу')}
              arrow
            >
              <IconButton
                onClick={handleToggleBookmark}
                size="small"
                color="primary"
                aria-label={book.isBookmarked ? t('books.removeFromBookmarks', 'Бетбелгіден алып тастау') : t('books.addToBookmarks', 'Бетбелгіге қосу')}
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