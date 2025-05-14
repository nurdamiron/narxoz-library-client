/**
 * src/components/books/ReviewList.jsx
 * 
 * Пікірлер тізімі компоненті
 * 
 * Бұл компонент кітап туралы пікірлер тізімін көрсетеді.
 */
import React, { useState, useEffect } from 'react';
import { 
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Rating,
  Divider,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Pagination,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import { 
  Person,
  Flag as FlagIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { reviewService } from '../../services';

/**
 * Пікірлер тізімі
 * 
 * @param {Object} props - Компонент пропстары
 * @param {string} props.bookId - Кітап идентификаторы
 * @param {boolean} props.refreshTrigger - Тізімді жаңартуды іске қосу флагы
 * @returns {JSX.Element}
 */
const ReviewList = ({ bookId, refreshTrigger }) => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Диалогтар күйі
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Пікірлерді жүктеу
  useEffect(() => {
    fetchReviews();
  }, [bookId, page, refreshTrigger]);
  
  /**
   * Кітап пікірлерін жүктеу
   */
  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await reviewService.getBookReviews(bookId, {
        page,
        limit: 5
      });
      
      if (response.success) {
        setReviews(response.data);
        setTotalPages(Math.ceil(response.count / 5) || 1);
      }
    } catch (err) {
      console.error(t('books.reviews.loadError', 'Error fetching reviews:'), err);
      setError(t('books.reviews.loadError', 'Пікірлерді жүктеу кезінде қате орын алды'));
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Бет өзгерісін өңдеу
   * 
   * @param {Event} event - Оқиға
   * @param {number} value - Жаңа бет
   */
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
  /**
   * Пікірге шағым білдіру диалогын ашу
   * 
   * @param {Object} review - Пікір объектісі
   */
  const handleOpenReportDialog = (review) => {
    setSelectedReview(review);
    setReportReason('');
    setReportDialogOpen(true);
  };
  
  /**
   * Шағым диалогын жабу
   */
  const handleCloseReportDialog = () => {
    setReportDialogOpen(false);
  };
  
  /**
   * Шағым себебі өзгерісін өңдеу
   * 
   * @param {Event} event - Оқиға
   */
  const handleReportReasonChange = (event) => {
    setReportReason(event.target.value);
  };
  
  /**
   * Шағым жіберу
   */
  const handleSubmitReport = async () => {
    try {
      if (!reportReason.trim()) {
        return;
      }
      
      await reviewService.reportReview(selectedReview.id, reportReason.trim());
      handleCloseReportDialog();
      
      // Күйді жаңарту
      const updatedReviews = reviews.map(review => 
        review.id === selectedReview.id 
          ? { ...review, isReported: true } 
          : review
      );
      
      setReviews(updatedReviews);
    } catch (err) {
      console.error(t('books.reviews.errorSubmitting', 'Error reporting review:'), err);
      setError(t('books.reviews.errorSubmitting', 'Шағым жіберу кезінде қате орын алды'));
    }
  };
  
  /**
   * Пікірді жою диалогын ашу
   * 
   * @param {Object} review - Пікір объектісі
   */
  const handleOpenDeleteDialog = (review) => {
    setSelectedReview(review);
    setDeleteDialogOpen(true);
  };
  
  /**
   * Жою диалогын жабу
   */
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };
  
  /**
   * Пікірді жою
   */
  const handleDeleteReview = async () => {
    try {
      await reviewService.deleteReview(selectedReview.id);
      handleCloseDeleteDialog();
      
      // Тізімді жаңарту
      fetchReviews();
    } catch (err) {
      console.error(t('admin.errorDeletingReview', 'Error deleting review:'), err);
      setError(t('books.reviews.errorSubmitting', 'Пікірді жою кезінде қате орын алды'));
    }
  };
  
  /**
   * Пікір күнін пішімдеу
   * 
   * @param {string} dateString - ISO форматындағы күн
   * @returns {string} - Пішімделген күн
   */
  const formatReviewDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy');
    } catch {
      return t('books.reviews.unknownDate', 'Белгісіз күн');
    }
  };
  
  /**
   * Пікір авторының атын көрсету
   * 
   * @param {Object} review - Пікір объектісі
   * @returns {string} - Пайдаланушы аты
   */
  const getReviewAuthorName = (review) => {
    if (review.user) {
      return `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim() || review.user.username;
    }
    return t('books.reviews.unknown', 'Белгісіз пайдаланушы');
  };
  
  /**
   * Пікірді өңдеуге немесе жоюға рұқсат бар ма тексеру
   * 
   * @param {Object} review - Пікір объектісі
   * @returns {boolean} - Рұқсат бар ма
   */
  const canEditOrDeleteReview = (review) => {
    if (!isAuthenticated || !user) return false;
    
    // Әкімші барлық пікірлерді жоя алады
    if (user.role === 'admin') return true;
    
    // Пайдаланушы тек өз пікірлерін жоя алады
    return review.userId === user.id;
  };
  
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('books.reviews.title', 'Пікірлер')}
        </Typography>
        
        {/* Қате хабарламасы */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {/* Жүктелу күйі */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ ml: 2 }}>
              {t('books.reviews.loading', 'Жүктелуде...')}
            </Typography>
          </Box>
        ) : reviews.length === 0 ? (
          <Typography variant="body1" align="center" color="text.secondary" sx={{ py: 4 }}>
            {t('books.reviews.noReviews', 'Бұл кітап туралы пікірлер әлі жоқ')}
          </Typography>
        ) : (
          // Пікірлер тізімі
          <Box>
            {reviews.map((review, index) => (
              <Box key={review.id}>
                {index > 0 && <Divider sx={{ my: 2 }} />}
                
                <Box sx={{ display: 'flex', mb: 1 }}>
                  {/* Аватар */}
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <Person />
                  </Avatar>
                  
                  {/* Пайдаланушы аты және күні */}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {getReviewAuthorName(review)}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={review.rating} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        {formatReviewDate(review.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Пікір күйі (әкімші үшін) */}
                  {user && user.role === 'admin' && (
                    <Box>
                      {review.isApproved ? (
                        <Chip size="small" color="success" label={t('admin.statusApproved', 'Бекітілген')} />
                      ) : (
                        <Chip size="small" color="warning" label={t('admin.statusPending', 'Күтілуде')} />
                      )}
                    </Box>
                  )}
                </Box>
                
                {/* Пікір мәтіні */}
                <Typography variant="body1" sx={{ my: 1, whiteSpace: 'pre-wrap' }}>
                  {review.text}
                </Typography>
                
                {/* Әрекеттер */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  {/* Шағым білдіру түймесі */}
                  {isAuthenticated && user.id !== review.userId && !review.isReported && (
                    <Button 
                      size="small" 
                      startIcon={<FlagIcon />} 
                      onClick={() => handleOpenReportDialog(review)}
                    >
                      {t('books.reviews.reportReview', 'Шағым')}
                    </Button>
                  )}
                  
                  {/* Шағым білдірілген белгі */}
                  {review.isReported && (
                    <Chip 
                      size="small" 
                      color="error" 
                      icon={<FlagIcon />} 
                      label={t('books.reviews.reported', 'Шағым білдірілген')} 
                    />
                  )}
                  
                  {/* Өңдеу және жою түймелері */}
                  {canEditOrDeleteReview(review) && (
                    <Box sx={{ ml: 1 }}>
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleOpenDeleteDialog(review)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
            
            {/* Пагинация */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange} 
                  color="primary" 
                />
              </Box>
            )}
          </Box>
        )}
      </CardContent>
      
      {/* Шағым білдіру диалогы */}
      <Dialog open={reportDialogOpen} onClose={handleCloseReportDialog}>
        <DialogTitle>{t('books.reviews.reportReview', 'Пікірге шағым білдіру')}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {t('books.reviews.reportReason', 'Бұл пікірге шағым білдіру себебін көрсетіңіз. Сіздің шағымыңыз әкімшіге жіберіледі.')}
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            label={t('books.reviews.reportReasonLabel', 'Шағым себебі')}
            type="text"
            multiline
            rows={3}
            value={reportReason}
            onChange={handleReportReasonChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReportDialog}>{t('books.reviews.cancel', 'Бас тарту')}</Button>
          <Button 
            onClick={handleSubmitReport} 
            color="primary"
            disabled={!reportReason.trim()}
          >
            {t('books.reviews.submitReport', 'Шағым жіберу')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Пікірді жою диалогы */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>{t('books.reviews.deleteReview', 'Пікірді жою')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('books.reviews.deleteConfirmation', 'Бұл пікірді жоюға сенімдісіз бе? Бұл әрекетті болдырмау мүмкін емес.')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>{t('books.reviews.cancel', 'Бас тарту')}</Button>
          <Button onClick={handleDeleteReview} color="error">
            {t('books.reviews.delete', 'Жою')}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ReviewList;