import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Chip,
  Box,
  Rating,
  IconButton,
  Tooltip,
  Skeleton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Bookmark,
  BookmarkBorderOutlined,
  VisibilityOutlined,
  Star,
  AccessTime,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

/**
 * Кітап картасының негізгі стилі
 * Анимациялар мен көлеңкелерді қамтитын улучшенная карта
 */
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
    '& .book-actions': {
      opacity: 1,
      transform: 'translateY(0)',
    },
    '& .book-cover': {
      transform: 'scale(1.05)',
    }
  },
}));

/**
 * Кітап мұқабасының контейнері
 */
const CoverContainer = styled(Box)({
  position: 'relative',
  overflow: 'hidden',
  paddingTop: '140%', // Аспектное соотношение для обложки книги
});

/**
 * Кітап мұқабасының суреті
 */
const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
}));

/**
 * Кітап әрекеттерінің контейнері
 * Бұл құрамдас бөлікке әрекеттер түймелерін орналастырамыз
 */
const ActionsOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  zIndex: 5,
}));

/**
 * Кітаптың мәртебесін көрсететін Chip компоненті
 */
const StatusChip = styled(Chip)(({ theme, available }) => ({
  position: 'absolute',
  top: theme.spacing(1.5),
  left: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  fontSize: '0.75rem',
  fontWeight: 600,
  zIndex: 5,
  backgroundColor: available 
    ? alpha(theme.palette.success.main, 0.9) 
    : alpha(theme.palette.error.main, 0.9),
  color: '#fff',
  boxShadow: theme.shadows[2],
}));

/**
 * Әрекет түймесінің стилі
 */
const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  boxShadow: theme.shadows[2],
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: theme.palette.background.paper,
    transform: 'scale(1.1)',
  },
}));

/**
 * Кітаптың жылын көрсететін компонент
 */
const YearBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(1.5),
  left: theme.spacing(1.5),
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.5, 1),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  backdropFilter: 'blur(4px)',
  zIndex: 5,
}));

/**
 * BookCard компоненті - кітапхана жүйесінде кітаптарды көрсету үшін қолданылады
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {Object} props.book - Кітап туралы ақпарат (атауы, авторы, т.б.)
 * @param {boolean} props.loading - Жүктелу күйі
 * @returns {JSX.Element} - Кітап картасы компоненті
 */
const BookCard = ({ book, loading = false }) => {
  const theme = useTheme();
  
  // Кітаптың таңдаулы екенін қадағалайтын күй
  const [bookmarked, setBookmarked] = useState(book?.isBookmarked || false);

  // Таңдаулыға қосу/алу функциясы
  const handleBookmarkToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarked(!bookmarked);
  };

  // Жүктелу кезінде скелетон көрсету
  if (loading) {
    return (
      <StyledCard>
        <CoverContainer>
          <Skeleton 
            variant="rectangular" 
            sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }} 
            animation="wave" 
          />
        </CoverContainer>
        <CardContent>
          <Skeleton variant="text" width="70%" height={24} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="50%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="30%" height={16} />
        </CardContent>
        <CardActions>
          <Skeleton variant="rectangular" width="100%" height={36} sx={{ borderRadius: 1 }} />
        </CardActions>
      </StyledCard>
    );
  }

  return (
    <StyledCard elevation={3}>
      <CardActionArea component={RouterLink} to={`/books/${book.id}`}>
        {/* Кітап мұқабасының контейнері */}
        <CoverContainer>
          {/* Кітаптың қолжетімділік белгісі */}
          <StatusChip 
            label={book.available ? "В наличии" : "Нет в наличии"} 
            available={book.available}
            size="small"
          />
          
          {/* Кітап мұқабасы */}
          <StyledCardMedia
            image={book.cover || 'https://via.placeholder.com/300x450?text=No+Cover'}
            title={book.title}
            className="book-cover"
          />
          
          {/* Кітаптың жылы */}
          <YearBadge>
            <AccessTime fontSize="small" sx={{ fontSize: '0.75rem', color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary" fontWeight="medium">
              {book.publicationYear}
            </Typography>
          </YearBadge>
        </CoverContainer>

        {/* Кітап әрекеттері - таңдаулы мен толық көру */}
        <ActionsOverlay className="book-actions">
          <Tooltip title={bookmarked ? "Удалить из закладок" : "Добавить в закладки"}>
            <ActionButton 
              size="small" 
              color={bookmarked ? "primary" : "default"}
              onClick={handleBookmarkToggle}
              aria-label={bookmarked ? "remove from bookmarks" : "add to bookmarks"}
            >
              {bookmarked ? <Bookmark /> : <BookmarkBorderOutlined />}
            </ActionButton>
          </Tooltip>
          
          <Tooltip title="Посмотреть детали">
            <ActionButton 
              size="small" 
              component={RouterLink}
              to={`/books/${book.id}`}
              onClick={(e) => e.stopPropagation()}
              aria-label="view details"
            >
              <VisibilityOutlined />
            </ActionButton>
          </Tooltip>
        </ActionsOverlay>

        <CardContent sx={{ flexGrow: 1, pt: 2 }}>
          {/* Кітап категориясы */}
          <Chip
            label={book.category}
            size="small"
            sx={{
              mb: 1,
              height: 24,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              fontWeight: 500,
              fontSize: '0.7rem',
            }}
          />
          
          {/* Кітап атауы */}
          <Typography
            gutterBottom
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 600,
              fontSize: '1rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              height: '3rem',
              lineHeight: 1.5,
              mb: 1,
            }}
          >
            {book.title}
          </Typography>

          {/* Кітап авторы */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              height: '1.5em',
            }}
          >
            {book.author}
          </Typography>

          {/* Кітаптың рейтингі */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating
              name={`rating-${book.id}`}
              value={book.rating || 0}
              precision={0.5}
              size="small"
              readOnly
              emptyIcon={<Star style={{ opacity: 0.3 }} fontSize="inherit" />}
              sx={{ 
                color: theme.palette.warning.main,
                '.MuiRating-iconEmpty': {
                  color: alpha(theme.palette.warning.main, 0.3),
                },
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontWeight: 'medium' }}>
              {book.rating}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
              ({book.reviewCount})
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>

      {/* Кітапты алу түймесі */}
      <CardActions sx={{ p: 2, pt: 0, mt: 'auto' }}>
        {book.available ? (
          <Button
            variant="contained"
            disableElevation
            size="medium"
            fullWidth
            sx={{ 
              borderRadius: theme.shape.borderRadius * 1.5, 
              textTransform: 'none',
              fontWeight: 600,
              py: 1,
              boxShadow: theme.shadows[2],
              '&:hover': {
                boxShadow: theme.shadows[5],
              },
            }}
          >
            Взять книгу
          </Button>
        ) : (
          <Button
            variant="outlined"
            size="medium"
            fullWidth
            sx={{ 
              borderRadius: theme.shape.borderRadius * 1.5,
              textTransform: 'none',
              fontWeight: 600,
              py: 1,
            }}
            disabled
          >
            Нет в наличии
          </Button>
        )}
      </CardActions>
    </StyledCard>
  );
};

export default BookCard;