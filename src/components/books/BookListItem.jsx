import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
  Rating,
  Typography,
  useTheme,
  Divider,
  IconButton,
  Tooltip,
  Paper,
  styled,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Skeleton,
  Badge,
  alpha,
} from '@mui/material';
import {
  Bookmark,
  BookmarkBorder,
  InfoOutlined,
  CheckCircleOutline,
  WarningAmber,
  LocalLibrary,
  VisibilityOff,
  BrokenImage,
} from '@mui/icons-material';
import { getBookCoverUrl, getDefaultBookCover } from '../../utils';

// Hover эффектісі бар сурет контейнері
const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

/**
 * BookListItem компоненті - кітаптарды тізім түрінде көрсету
 * 
 * Бұл компонент кітапты тізім элементі ретінде көрсетеді,
 * көлденең орналастырылған және басты ақпаратты ықшам түрде көрсетеді.
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {Object} props.book - Кітап туралы деректер
 * @param {Function} props.onToggleBookmark - Function called when bookmark is toggled
 * @param {Function} props.onBorrow - Function called when borrow button is clicked
 * @param {boolean} props.isLoading - Loading state
 * @param {Object} props.sx - Additional MUI styles
 */
const BookListItem = ({
  book,
  onToggleBookmark,
  onBorrow,
  isLoading = false,
  sx = {}
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [bookmarked, setBookmarked] = useState(book.isBookmarked || false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Таңдаулыға қосу/алу функциясы
  const handleBookmarkToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Don't manually update state - the parent component will handle this
    // based on the server response
    if (onToggleBookmark) {
      onToggleBookmark(book);
    }
  };

  // Для состояния загрузки
  if (isLoading || !book) {
    return (
      <ListItem 
        sx={{ 
          width: '100%', 
          borderBottom: `1px solid ${theme.palette.divider}`,
          ...sx
        }}
      >
        <ListItemAvatar>
          <Skeleton variant="circular" width={56} height={56} animation="wave" />
        </ListItemAvatar>
        <ListItemText
          primary={<Skeleton variant="text" width="60%" />}
          secondary={<Skeleton variant="text" width="80%" />}
        />
      </ListItem>
    );
  }

  // URL обложки
  const coverUrl = getBookCoverUrl(book.cover);
  
  // Debug logging for cover URLs
  console.log(`📘 List item book cover URL for "${book.title}": ${coverUrl}`);
  console.log(`📕 List item original cover path: ${book.cover}`);
  
  // Категория (если есть)
  const categoryName = book.category?.name || '';
  
  // Обработчики загрузки изображения
  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };
  
  const handleImageError = (e) => {
    if (e.target && e.target.src) {
      console.error(`Ошибка загрузки обложки книги: ${book.title}, URL: ${e.target.src}`);
      
      // Проверяем, не является ли текущий src уже запасным вариантом
      // чтобы предотвратить бесконечный цикл
      if (!e.target.src.includes('no-image.png')) {
        // Заменяем src на дефолтную обложку
        e.target.src = getDefaultBookCover();
        console.log('✅ Заменяем недоступное изображение на дефолтную обложку');
        // Убираем обработчик ошибки чтобы предотвратить повторные вызовы
        e.target.onerror = null;
        setImageError(false); // Не показываем состояние ошибки если есть fallback
        return;
      }
    }
    
    // Если не удалось загрузить даже fallback изображение, показываем состояние ошибки
    setImageError(true);
    setImageLoaded(true);
    console.error(`Ошибка загрузки обложки книги: ${book.title}, URL: ${coverUrl}`);
  };

  return (
    <ListItem 
      component={RouterLink}
      to={`/books/${book.id}`}
      sx={{ 
        width: '100%', 
        borderBottom: `1px solid ${theme.palette.divider}`,
        textDecoration: 'none',
        color: 'inherit',
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.light, 0.1),
        },
        display: 'flex',
        p: 2,
        ...sx
      }}
    >
      {/* Обложка книги */}
      <ListItemAvatar sx={{ minWidth: 72 }}>
        {!imageLoaded && !imageError && (
          <Skeleton
            variant="rectangular"
            width={56}
            height={72}
            animation="wave"
            sx={{ borderRadius: 1 }}
          />
        )}
        
        {imageError ? (
          <Box
            sx={{
              width: 56,
              height: 72,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.palette.grey[200],
              color: theme.palette.text.secondary
            }}
          >
            <BrokenImage />
          </Box>
        ) : (
          <img
            src={coverUrl}
            alt={book.title}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{
              width: 56,
              height: 72,
              borderRadius: 4,
              objectFit: 'cover',
              display: imageLoaded ? 'block' : 'none'
            }}
          />
        )}
      </ListItemAvatar>
      
      {/* Информация о книге */}
      <Box sx={{ flex: 1, ml: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="subtitle1" component="h3" noWrap sx={{ fontWeight: 'medium' }}>
            {book.title}
          </Typography>
          
          {/* Кнопка закладки */}
          <IconButton 
            size="small" 
            onClick={handleBookmarkToggle}
            color={bookmarked ? 'primary' : 'default'}
            sx={{ ml: 1, p: 0.5 }}
          >
            {bookmarked ? <Bookmark /> : <BookmarkBorder />}
          </IconButton>
        </Box>
        
        <Typography variant="body2" color="text.secondary" noWrap>
          {book.author}
        </Typography>
        
        <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Категория */}
          {categoryName && (
            <Chip 
              label={categoryName} 
              size="small" 
              sx={{ mr: 1, mt: 0.5, height: 20, fontSize: '0.7rem' }}
            />
          )}
          
          {/* Год издания */}
          <Chip
            label={book.publicationYear}
            size="small"
            variant="outlined"
            sx={{ mr: 1, mt: 0.5, height: 20, fontSize: '0.7rem' }}
          />
          
          {/* Язык */}
          <Chip
            label={t(`languages.${book.language}`) || t(book.language) || book.language}
            size="small"
            variant="outlined"
            sx={{ mr: 1, mt: 0.5, height: 20, fontSize: '0.7rem' }}
          />
          
          {/* Доступность */}
          <Tooltip title={book.availableCopies > 0 ? `Доступно: ${book.availableCopies}` : 'Нет в наличии'}>
            <Chip
              icon={book.availableCopies > 0 ? <LocalLibrary /> : <VisibilityOff />}
              label={book.availableCopies > 0 ? `${book.availableCopies}/${book.totalCopies}` : 'Нет в наличии'}
              size="small"
              color={book.availableCopies > 0 ? 'success' : 'error'}
              variant="outlined"
              sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
            />
          </Tooltip>
        </Box>
      </Box>
    </ListItem>
  );
};

BookListItem.propTypes = {
  book: PropTypes.object,
  onToggleBookmark: PropTypes.func,
  onBorrow: PropTypes.func,
  isLoading: PropTypes.bool,
  sx: PropTypes.object
};

export default BookListItem;