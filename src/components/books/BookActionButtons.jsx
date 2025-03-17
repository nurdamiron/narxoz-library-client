import React from 'react';
import { 
  Box, 
  Button, 
  Card, 
  Divider,
  IconButton,
  Typography,
  useTheme,
  alpha,
  useMediaQuery
} from '@mui/material';
import {
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon
} from '@mui/icons-material';

/**
 * BookActionButtons - компонент для отображения кнопок действий с книгой
 * Адаптивный для мобильных устройств
 * 
 * @param {Object} props - свойства компонента
 * @param {boolean} props.bookmarked - добавлена ли книга в закладки
 * @param {Function} props.onBookmarkToggle - функция для добавления/удаления закладки
 * @param {Function} props.onShare - функция для поделиться книгой
 * @param {boolean} props.available - доступна ли книга для взятия
 * @param {Function} props.onBorrow - функция для взятия книги
 */
const BookActionButtons = ({ 
  bookmarked, 
  onBookmarkToggle, 
  onShare, 
  available, 
  onBorrow,
  rating,
  reviewCount
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card 
      elevation={2}
      sx={{ 
        borderRadius: isMobile ? 0 : 2,
        overflow: 'hidden',
        mt: 2,
        width: '100%',
        position: 'relative'
      }}
    >
      {/* Кнопка взять книгу */}
      {available ? (
        <Button
          variant="contained"
          fullWidth
          onClick={onBorrow}
          sx={{
            py: 1.8,
            borderRadius: 0,
            fontWeight: 'bold',
            backgroundColor: '#d50032',
            color: 'white',
            fontSize: '1.1rem',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: alpha('#d50032', 0.9),
            },
          }}
        >
          Взять книгу
        </Button>
      ) : (
        <Button
          variant="contained"
          fullWidth
          disabled
          sx={{
            py: 1.8,
            borderRadius: 0,
            fontWeight: 'bold',
            fontSize: '1.1rem',
            textTransform: 'none',
          }}
        >
          Нет в наличии
        </Button>
      )}

      {/* Рейтинг */}
      <Box 
        sx={{ 
          py: 2, 
          display: 'flex', 
          justifyContent: 'center',
          borderBottom: '1px solid',
          borderColor: alpha('#000', 0.1)
        }}
      >
        <Typography 
          variant="body1" 
          fontWeight="medium" 
          color="text.secondary"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          {/* Звезды рейтинга */}
          <Box sx={{ display: 'flex', mr: 1.5 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Box 
                key={star}
                component="span" 
                sx={{ 
                  color: star <= Math.floor(rating) ? '#FFC107' : alpha('#FFC107', 0.3),
                  fontSize: { xs: '1.3rem', sm: '1.5rem' },
                  lineHeight: 1,
                  mr: 0.3
                }}
              >
                ★
              </Box>
            ))}
          </Box>
          {rating} ({reviewCount} отзывов)
        </Typography>
      </Box>

      {/* Нижняя панель с кнопками - адаптивная для мобильных */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        {/* Кнопка закладки */}
        <Button
          onClick={onBookmarkToggle}
          startIcon={bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          sx={{ 
            flex: 1,
            borderRadius: 0,
            py: 1.5,
            color: bookmarked ? '#d50032' : 'text.secondary',
            '&:hover': {
              backgroundColor: alpha('#d50032', 0.05),
            },
            justifyContent: 'center'
          }}
        >
          {isMobile ? "" : "В закладки"}
        </Button>

        <Divider orientation="vertical" flexItem />

        {/* Кнопка поделиться */}
        <Button
          onClick={onShare}
          startIcon={<ShareIcon />}
          sx={{ 
            flex: 1,
            borderRadius: 0,
            py: 1.5,
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: alpha('#000', 0.05),
            },
            justifyContent: 'center'
          }}
        >
          {isMobile ? "" : "Поделиться"}
        </Button>
      </Box>
    </Card>
  );
};

export default BookActionButtons;