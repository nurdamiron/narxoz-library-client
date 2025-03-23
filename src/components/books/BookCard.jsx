/**
 * src/components/books/BookCard.jsx
 * 
 * Кітап карточкасы компоненті
 * 
 * Бұл компонент әр кітаптың қысқаша ақпаратын карточка түрінде көрсетеді.
 * Ол бетбелгіні ауыстыру функционалын да қамтиды.
 */
import React, { useState } from 'react';
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
  Rating,
  Tooltip,
  useTheme,
  alpha,
  Skeleton
} from '@mui/material';
import {
  BookmarkBorder as BookmarkBorderIcon,
  Bookmark as BookmarkIcon,
  VisibilityOff,
  LocalLibrary
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import toggleBookmark from '../../services/bookmarkService';
import { motion } from 'framer-motion';

/**
 * BookCard компоненті
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {Object} props.book - Кітап объектісі
 * @returns {JSX.Element} - Кітап карточкасы
 */
const BookCard = ({ book }) => {
  const theme = useTheme();
  
  // AuthContext-тен мәліметтерді алу
  const isAuthenticated = useAuth();
  
  // Бетбелгі күйі
  const [isBookmarked, setIsBookmarked] = useState(book.isBookmarked);
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  /**
   * Бетбелгі ауыстыру функциясы
   * 
   * @param {Event} e - Оқиға объектісі
   */
  const handleToggleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Кіруді талап ету
      // Note: Бұл жерде модальді немесе туындыны көрсетуіңізге болады
      return;
    }
    
    try {
      setLoading(true);
      
      // API арқылы бетбелгіні ауыстыру
      const response = await toggleBookmark(book.id);
      setIsBookmarked(response.bookmarked);
    } catch (error) {
      console.error('Бетбелгі ауыстыру қатесі:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Мұқаба URL-ін дайындау
  const coverUrl = book.cover
    ? `/uploads/books/${book.cover}`
    : '/images/default-book-cover.jpg';
  
  // Мұқаба суретінің жүктелу оқиғасын өңдеу
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
            {book.category && (
              <Chip
                label={book.category.name}
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
                  backgroundColor: alpha(theme.palette.background.paper, 0.6),
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <VisibilityOff 
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
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              mb: 1
            }}>
              <Rating 
                value={book.rating || 0} 
                precision={0.5}
                size="small"
                readOnly 
              />
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ ml: 1 }}
              >
                ({book.reviewCount || 0})
              </Typography>
            </Box>

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <Typography 
                variant="body2" 
                color="text.secondary"
              >
                {book.publicationYear}
              </Typography>
              
              <Typography 
                variant="body2" 
                color="text.secondary"
              >
                {book.language}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
        
        <CardActions sx={{ p: 2, pt: 0 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            width: '100%'
          }}>
            {/* Қолжетімділік ақпараты */}
            <Tooltip title={book.availableCopies > 0 ? "Қолжетімді" : "Қолжетімсіз"}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center'
              }}>
                <LocalLibrary color={book.availableCopies > 0 ? "success" : "disabled"} />
                <Typography 
                  variant="body2" 
                  color={book.availableCopies > 0 ? "success.main" : "text.disabled"}
                  sx={{ ml: 0.5 }}
                >
                  {book.availableCopies} дана
                </Typography>
              </Box>
            </Tooltip>
            
            {/* Бетбелгі түймесі */}
            <Tooltip title={isBookmarked ? "Бетбелгіден алып тастау" : "Бетбелгіге қосу"}>
              <IconButton 
                onClick={handleToggleBookmark}
                disabled={loading}
                size="small"
                color="primary"
                sx={{
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </CardActions>
      </Card>
    </motion.div>
  );
};

export default BookCard;