/**
 * src/components/books/BookRating.jsx
 * 
 * Кітап рейтингісі компоненті
 * 
 * Бұл компонент кітаптың рейтингін және пікірлер санын көрсетеді.
 * Ол әр түрлі өлшемдерде және стильдерде қолданылады.
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Rating,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import { Star, StarBorder, StarHalf, Comment } from '@mui/icons-material';

/**
 * BookRating компоненті
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {number} props.rating - Рейтинг мәні (0-5 аралығында)
 * @param {number} props.reviewCount - Пікірлер саны
 * @param {string} props.size - Өлшемі (small, medium, large)
 * @param {boolean} props.showCount - Пікірлер санын көрсету керек пе?
 * @param {boolean} props.showText - "отзывов" мәтінін көрсету керек пе?
 * @param {boolean} props.interactive - Интерактивті ме? (бағалауға болады)
 * @param {Function} props.onChange - Рейтинг өзгерген кезде шақырылатын функция
 * @param {Object} props.sx - Қосымша Material UI стильдері
 * @returns {JSX.Element} - Рейтинг компоненті
 */
const BookRating = ({
  rating = 0,
  reviewCount = 0,
  size = 'medium',
  showCount = true,
  showText = true,
  interactive = false,
  onChange,
  sx = {}
}) => {
  const theme = useTheme();
  
  // Жұлдыздар өлшемін анықтау
  const getStarSize = () => {
    switch (size) {
      case 'small':
        return { fontSize: '1rem' };
      case 'large':
        return { fontSize: '1.5rem' };
      case 'medium':
      default:
        return { fontSize: '1.25rem' };
    }
  };
  
  // Мәтін өлшемін анықтау
  const getTextSize = () => {
    switch (size) {
      case 'small':
        return { fontSize: '0.75rem' };
      case 'large':
        return { fontSize: '1rem' };
      case 'medium':
      default:
        return { fontSize: '0.875rem' };
    }
  };

  // Жұлдыздар түсін анықтау
  const starColor = theme.palette.warning.main || '#FFC107';
  
  // Рейтинг жоқ болса
  if (rating === 0 && reviewCount === 0 && !interactive) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          ...sx 
        }}
      >
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={getTextSize()}
        >
          Рейтинг жоқ
        </Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center',
        ...sx 
      }}
    >
      <Rating
        value={rating}
        precision={0.5}
        readOnly={!interactive}
        onChange={interactive ? onChange : undefined}
        icon={<Star sx={{ ...getStarSize(), color: starColor }} />}
        emptyIcon={<StarBorder sx={{ ...getStarSize(), color: alpha(starColor, 0.3) }} />}
        sx={{
          '& .MuiRating-iconFilled': {
            filter: 'drop-shadow(0px 0px 1px rgba(0,0,0,0.2))'
          }
        }}
      />
      
      {showCount && (
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={getTextSize()}
          >
            {rating > 0 ? rating.toFixed(1) : ''}
            {reviewCount > 0 && (
              <>
                {rating > 0 && ' '}
                {showText ? `(${reviewCount} ${reviewCount === 1 ? 'пікір' : 'пікір'})` : `(${reviewCount})`}
              </>
            )}
          </Typography>
          
          {reviewCount > 0 && !showText && (
            <Tooltip title={`${reviewCount} пікір`}>
              <Comment sx={{ ...getTextSize(), ml: 0.5, color: 'text.secondary' }} />
            </Tooltip>
          )}
        </Box>
      )}
    </Box>
  );
};

BookRating.propTypes = {
  rating: PropTypes.number,
  reviewCount: PropTypes.number,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  showCount: PropTypes.bool,
  showText: PropTypes.bool,
  interactive: PropTypes.bool,
  onChange: PropTypes.func,
  sx: PropTypes.object
};

export default BookRating;