/**
 * src/components/books/ReviewForm.jsx
 * 
 * Пікір қалдыру формасы
 * 
 * Бұл компонент кітап туралы пікір қалдыру формасын көрсетеді.
 * Пайдаланушы рейтинг және мәтін енгізе алады.
 */
import React, { useState } from 'react';
import { 
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Rating,
  Typography,
  Alert,
  Fade,
  CircularProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { reviewService } from '../../services';
import { useAuth } from '../../context/AuthContext';

/**
 * Кітап туралы пікір қалдыру формасы
 * 
 * @param {Object} props - Компонент пропстары
 * @param {string} props.bookId - Кітап идентификаторы
 * @param {Function} props.onReviewSubmitted - Пікір жіберілгеннен кейін шақырылатын функция
 * @returns {JSX.Element}
 */
const ReviewForm = ({ bookId, onReviewSubmitted }) => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ratingHover, setRatingHover] = useState(-1);

  // Рейтинг түсіндірмелері
  const ratingLabels = {
    1: t('books.reviews.ratingLabels.1', 'Өте нашар'),
    2: t('books.reviews.ratingLabels.2', 'Нашар'),
    3: t('books.reviews.ratingLabels.3', 'Орташа'),
    4: t('books.reviews.ratingLabels.4', 'Жақсы'),
    5: t('books.reviews.ratingLabels.5', 'Өте жақсы')
  };

  // Пікір мәтінінің максималды ұзындығы
  const MAX_REVIEW_LENGTH = 500;

  /**
   * Рейтинг өзгерісін өңдеу
   * 
   * @param {Event} event - Оқиға
   * @param {number} newValue - Жаңа рейтинг мәні
   */
  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  /**
   * Пікір мәтіні өзгерісін өңдеу
   * 
   * @param {Event} event - Оқиға
   */
  const handleReviewTextChange = (event) => {
    const text = event.target.value;
    // Максималды ұзындықтан аспауын тексеру
    if (text.length <= MAX_REVIEW_LENGTH) {
      setReviewText(text);
    }
  };

  /**
   * Форманы жіберу
   * 
   * @param {Event} event - Оқиға
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Қажетті өрістерді тексеру
    if (rating === 0) {
      setError(t('books.reviews.selectRating', 'Рейтингті таңдаңыз'));
      return;
    }
    
    if (!reviewText.trim()) {
      setError(t('books.reviews.enterReviewText', 'Пікір мәтінін енгізіңіз'));
      return;
    }
    
    if (reviewText.trim().length < 10) {
      setError(t('books.reviews.reviewTooShort', 'Пікір мәтіні кем дегенде 10 таңбадан тұруы керек'));
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      // Пікірді жіберу
      await reviewService.createReview({
        bookId,
        rating,
        text: reviewText.trim()
      });
      
      // Форманы тазалау
      setRating(0);
      setReviewText('');
      setSuccess(true);
      
      // Компонент жаңартылуын хабарлау
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      console.error(t('books.reviews.errorSubmitting', 'Error submitting review:'), err);
      setError(err.message || t('books.reviews.errorSubmitting', 'Пікір жіберу кезінде қате орын алды'));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Сәтті жіберілгені туралы хабарландыруды жабу
   */
  const handleCloseSuccess = () => {
    setSuccess(false);
  };

  // Егер пайдаланушы кірмеген болса, форманы көрсетпейміз
  if (!isAuthenticated) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="body1" align="center">
            {t('books.reviews.loginToReview', 'Пікір қалдыру үшін жүйеге кіріңіз')}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('books.reviews.leaveReview', 'Пікір қалдыру')}
        </Typography>
        
        {/* Қате хабарламасы */}
        <Fade in={!!error}>
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        </Fade>
        
        {/* Сәтті жіберілгені туралы хабарландыру */}
        <Fade in={success}>
          <Alert severity="success" sx={{ mb: 2 }} onClose={handleCloseSuccess}>
            {t('books.reviews.reviewSuccess', 'Пікіріңіз сәтті жіберілді! Әкімші тексергеннен кейін жарияланады.')}
          </Alert>
        </Fade>
        
        <form onSubmit={handleSubmit}>
          {/* Рейтинг таңдау */}
          <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t('books.reviews.rateBook', 'Кітапты бағалаңыз')}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating
                name="book-rating"
                value={rating}
                onChange={handleRatingChange}
                onChangeActive={(event, newHover) => {
                  setRatingHover(newHover);
                }}
                size="large"
                disabled={loading}
              />
              
              {rating !== 0 && (
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {ratingLabels[ratingHover !== -1 ? ratingHover : rating]}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
          
          {/* Пікір мәтіні */}
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label={t('books.reviews.writeReview', 'Пікіріңізді жазыңыз')}
            placeholder={t('books.reviews.reviewPlaceholder', 'Осы кітап туралы пікіріңізді жазыңыз...')}
            value={reviewText}
            onChange={handleReviewTextChange}
            disabled={loading}
            sx={{ mb: 2 }}
            inputProps={{ maxLength: MAX_REVIEW_LENGTH }}
            helperText={`${reviewText.length}/${MAX_REVIEW_LENGTH} ${t('books.reviews.characters', 'таңба')}`}
          />
          
          {/* Жіберу түймесі */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? t('books.reviews.submitting', 'Жіберілуде...') : t('books.reviews.submitReview', 'Пікір қалдыру')}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;