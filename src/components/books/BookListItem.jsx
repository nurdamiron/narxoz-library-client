import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
} from '@mui/material';
import {
  Bookmark,
  BookmarkBorder,
  InfoOutlined,
  CheckCircleOutline,
  WarningAmber,
} from '@mui/icons-material';

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
 */
const BookListItem = ({ book }) => {
  const theme = useTheme();
  const [bookmarked, setBookmarked] = useState(book.isBookmarked || false);

  // Таңдаулыға қосу/алу функциясы
  const handleBookmarkToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarked(!bookmarked);
  };

  return (
    <Paper
      elevation={1}
      sx={{
        display: 'flex',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: theme.shadows[4],
          transform: 'translateY(-3px)',
        },
        height: '100%',
      }}
    >
      {/* Кітап толық бетіне сілтеме және кітаптың мұқабасы (сол жақ бөлік) */}
      <CardActionArea 
        component={RouterLink} 
        to={`/books/${book.id}`}
        sx={{ 
          display: 'flex', 
          flexDirection: 'row',
          alignItems: 'stretch',
          width: '100%',
          p: 0,
        }}
      >
        {/* Кітап мұқабасы */}
        <ImageContainer sx={{ width: 110, flexShrink: 0 }}>
          <Box
            component="img"
            src={book.cover || 'https://via.placeholder.com/150x220?text=No+Cover'}
            alt={book.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </ImageContainer>

        {/* Кітап туралы ақпарат (оң жақ бөлік) */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          p: 2, 
          width: '100%',
          justifyContent: 'space-between',
        }}>
          {/* Жоғарғы бөлік: Категория, кітап атауы және авторы */}
          <Box>
            {/* Категория мен таңдаулы */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Chip
                label={book.category}
                size="small"
                sx={{
                  backgroundColor: theme.palette.primary.lighter || 'rgba(213, 0, 50, 0.1)',
                  color: theme.palette.primary.main,
                  fontWeight: 500,
                  height: 20,
                  '& .MuiChip-label': {
                    px: 1,
                  },
                }}
              />
              <IconButton
                size="small"
                sx={{ p: 0.5 }}
                onClick={handleBookmarkToggle}
              >
                {bookmarked ? (
                  <Bookmark color="primary" fontSize="small" />
                ) : (
                  <BookmarkBorder fontSize="small" />
                )}
              </IconButton>
            </Box>

            {/* Кітап атауы */}
            <Typography
              variant="subtitle1"
              component="h2"
              fontWeight={600}
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {book.title}
            </Typography>

            {/* Автор */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                mb: 0.5,
              }}
            >
              {book.author}
            </Typography>

            {/* Рейтинг және жыл */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Rating
                name={`rating-${book.id}`}
                value={book.rating || 0}
                precision={0.5}
                size="small"
                readOnly
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({book.reviewCount || 0})
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                {book.publicationYear}
              </Typography>
            </Box>
          </Box>

          {/* Төменгі бөлік: Қолжетімділік және батырмалар */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mt: 1,
          }}>
            {/* Қолжетімділік және сипаттама */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {book.available ? (
                <Tooltip title="В наличии">
                  <CheckCircleOutline
                    fontSize="small"
                    color="success"
                    sx={{ mr: 0.5 }}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Нет в наличии">
                  <WarningAmber
                    fontSize="small"
                    color="error"
                    sx={{ mr: 0.5 }}
                  />
                </Tooltip>
              )}
              <Typography
                variant="body2"
                color={book.available ? 'success.main' : 'error.main'}
                fontWeight={500}
              >
                {book.available ? 'В наличии' : 'Нет в наличии'}
              </Typography>
              
              <Tooltip title="Описание">
                <IconButton size="small" sx={{ ml: 1 }}>
                  <InfoOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            {/* "Взять книгу" батырмасы - тек қолжетімді болса */}
            {book.available && (
              <Button
                variant="contained"
                disableElevation
                size="small"
                sx={{ 
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  py: 0.5,
                  ml: 1,
                  minWidth: 'auto',
                  background: 'linear-gradient(45deg, #d50032 30%, #ff5252 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #c30029 30%, #f04848 90%)',
                  },
                }}
              >
                Взять
              </Button>
            )}
          </Box>
        </Box>
      </CardActionArea>
    </Paper>
  );
};

export default BookListItem;