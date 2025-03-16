import React from 'react';
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
  useTheme,
} from '@mui/material';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Кітап картасының негізгі стилі
// (Бұл кітап картасының негізгі стильдерін анықтайды, кітапты көрсету үшін)
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)', // Үстінен өткенде карта жоғары көтеріледі
    boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)', // Үстінен өткенде көлеңке күшейеді
  },
}));

// Кітап мұқабасының стилі
// (Кітаптың мұқаба суретін көрсету үшін стиль)
const StyledCardMedia = styled(CardMedia)({
  height: 220,
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  padding: 16,
});

/**
 * BookCard компоненті - кітапхана жүйесінде кітаптарды көрсету үшін қолданылады
 * 
 * @param {Object} book - Кітап туралы ақпарат (атауы, авторы, рейтингі және т.б.)
 * @returns {JSX.Element} - Кітап картасы компоненті
 */
const BookCard = ({ book }) => {
  const theme = useTheme();
  // Кітаптың таңдаулы екенін қадағалайтын күй
  const [bookmarked, setBookmarked] = React.useState(book.isBookmarked || false);

  // Таңдаулыға қосу/алу функциясы
  const handleBookmarkToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarked(!bookmarked);
  };

  return (
    <StyledCard>
      {/* Кітап толық бетіне жетекші сілтеме */}
      <CardActionArea component={RouterLink} to={`/books/${book.id}`}>
        {/* Кітап мұқабасы */}
        <StyledCardMedia
          image={book.cover || 'https://via.placeholder.com/150x220?text=No+Cover'}
          title={book.title}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          {/* Кітап категориясы мен таңдаулы белгісі */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Chip
              label={book.category}
              size="small"
              sx={{
                backgroundColor: theme.palette.secondary.light,
                color: theme.palette.secondary.contrastText,
                fontWeight: 500,
              }}
            />
            <Button
              size="small"
              sx={{ minWidth: 'auto', p: 0.5 }}
              onClick={handleBookmarkToggle}
            >
              {bookmarked ? (
                <Bookmark color="primary" fontSize="small" /> // Таңдаулыға қосылған кітап
              ) : (
                <BookmarkBorder fontSize="small" /> // Таңдаулыға қосылмаған кітап
              )}
            </Button>
          </Box>

          {/* Кітап атауы */}
          <Typography
            gutterBottom
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 600,
              fontSize: '1.1rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2, // Атау екі жолдан артық болмайды
              WebkitBoxOrient: 'vertical',
              height: '2.75rem',
            }}
          >
            {book.title}
          </Typography>

          {/* Кітап авторы */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 1, // Автор аты бір жолдан артық болмайды
              WebkitBoxOrient: 'vertical',
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
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({book.reviewCount || 0})
            </Typography>
          </Box>

          {/* Кітаптың қолжетімділігі */}
          <Typography variant="body2" color="text.secondary">
            {book.available ? 'В наличии' : 'Нет в наличии'}
          </Typography>
        </CardContent>
      </CardActionArea>

      {/* Кітапты алу түймесі */}
      <CardActions>
        {book.available ? (
          <Button
            variant="contained"
            disableElevation
            size="small"
            fullWidth
            sx={{ borderRadius: 2 }}
          >
            Взять книгу
          </Button>
        ) : (
          <Button
            variant="outlined"
            size="small"
            fullWidth
            sx={{ borderRadius: 2 }}
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