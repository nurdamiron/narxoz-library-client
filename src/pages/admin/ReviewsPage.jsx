/**
 * src/pages/admin/ReviewsPage.jsx
 * 
 * Пікірлерді басқару беті
 * 
 * Бұл компонент әкімшілерге кітаптар туралы пікірлерді басқаруға 
 * мүмкіндік береді. Пікірлерді бекіту, қабылдамау және жою функцияларын қамтиды.
 */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Chip,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Rating,
  Select,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  IconButton
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Flag as FlagIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import PageHeader from '../../components/common/PageHeader';
import { reviewService, bookService } from '../../services';
import { useTranslation } from 'react-i18next';

/**
 * Пікірлерді әкімші панелінде басқару беті
 */
const ReviewsPage = () => {
  const { t } = useTranslation();
  // Күй айнымалылары
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [filter, setFilter] = useState('all'); // all, pending, approved, reported
  const [selectedReview, setSelectedReview] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [bookDetails, setBookDetails] = useState({});

  // Пікірлерді жүктеу
  useEffect(() => {
    fetchReviews();
  }, [page, rowsPerPage, filter]);

  /**
   * Пікірлер тізімін жүктеу
   */
  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      // Фильтр параметрлерін құру
      const params = {
        page: page + 1,
        limit: rowsPerPage
      };
      
      // Фильтрге сәйкес параметрлерді қосу
      if (filter === 'pending') {
        params.isApproved = false;
        params.isReported = false;
      } else if (filter === 'approved') {
        params.isApproved = true;
      } else if (filter === 'reported') {
        params.isReported = true;
      }
      
      // Пікірлерді алу
      const response = await reviewService.getAllReviews(params);
      
      if (response.success) {
        setReviews(response.data);
        setTotalCount(response.count);
        
        // Кітаптар туралы ақпаратты алу
        const bookIds = [...new Set(response.data.map(review => review.bookId))];
        
        // Әр кітап туралы ақпаратты алу
        const bookDetailsTemp = {};
        
        await Promise.all(
          bookIds.map(async (bookId) => {
            try {
              const bookResponse = await bookService.getBook(bookId);
              if (bookResponse.success) {
                bookDetailsTemp[bookId] = bookResponse.data;
              }
            } catch (err) {
              console.error(t('admin.errorFetchingBook', 'Error fetching book {{bookId}}:', {bookId}), err);
            }
          })
        );
        
        setBookDetails(bookDetailsTemp);
      }
    } catch (err) {
      console.error(t('admin.errorFetchingReviews', 'Error fetching reviews:'), err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Пікірді бекіту немесе қабылдамау
   * 
   * @param {string} reviewId - Пікір идентификаторы
   * @param {boolean} isApproved - Бекіту мәртебесі
   */
  const handleApproveReview = async (reviewId, isApproved) => {
    try {
      const response = await reviewService.approveReview(reviewId, isApproved);
      
      if (response && response.success) {
        if (isApproved) {
          console.log(t('admin.reviewApproveSuccess', 'Review approved successfully'));
        } else {
          console.log(t('admin.reviewRejectSuccess', 'Review rejected successfully'));
        }
      }
      
      // Тізімді жаңарту
      fetchReviews();
    } catch (err) {
      console.error(isApproved 
        ? t('admin.errorApprovingReview', 'Error approving review:') 
        : t('admin.errorRejectingReview', 'Error rejecting review:'), err);
    }
  };

  /**
   * Пікірді жою
   */
  const handleDeleteReview = async () => {
    try {
      const response = await reviewService.deleteReview(selectedReview.id);
      
      if (response && response.success) {
        console.log(t('admin.reviewDeleteSuccess', 'Review deleted successfully'));
      }
      
      setOpenDeleteDialog(false);
      
      // Тізімді жаңарту
      fetchReviews();
    } catch (err) {
      console.error(t('admin.errorDeletingReview', 'Error deleting review:'), err);
    }
  };

  /**
   * Пікірді қарау диалогын ашу
   * 
   * @param {Object} review - Пікір объектісі
   */
  const openReviewViewDialog = (review) => {
    setSelectedReview(review);
    setOpenViewDialog(true);
  };

  /**
   * Пікірді жою диалогын ашу
   * 
   * @param {Object} review - Пікір объектісі
   */
  const openReviewDeleteDialog = (review) => {
    setSelectedReview(review);
    setOpenDeleteDialog(true);
  };

  /**
   * Фильтр өзгерісін өңдеу
   * 
   * @param {Event} event - Оқиға
   */
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(0); // Фильтр өзгерген кезде беттеуді қайта бастау
  };

  /**
   * Бет өзгерісін өңдеу
   * 
   * @param {Event} event - Оқиға
   * @param {number} newPage - Жаңа бет
   */
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  /**
   * Беттегі жолдар санының өзгерісін өңдеу
   * 
   * @param {Event} event - Оқиға
   */
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /**
   * Пікір күнін пішімдеу
   * 
   * @param {string} dateString - ISO форматындағы күн
   * @returns {string} - Пішімделген күн
   */
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
    } catch {
      return t('admin.unknownDate', 'Unknown date');
    }
  };

  /**
   * Пікір авторының атын көрсету
   * 
   * @param {Object} review - Пікір объектісі
   * @returns {string} - Пайдаланушы аты
   */
  const getUserName = (review) => {
    if (review.user) {
      return `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim() || review.user.username;
    }
    return t('admin.unknownUser', 'Unknown user');
  };

  /**
   * Кітап атауын алу
   * 
   * @param {string} bookId - Кітап идентификаторы
   * @returns {string} - Кітап атауы
   */
  const getBookTitle = (bookId) => {
    if (bookDetails[bookId]) {
      return bookDetails[bookId].title;
    }
    return t('admin.bookNotFound', 'Book not found');
  };

  return (
    <Container maxWidth="lg">
      <PageHeader
        title={t('admin.reviewsManagement', 'Manage reviews')}
        subtitle={t('admin.reviewsDescription', 'Moderation, approval and deletion of book reviews')}
      />

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>{t('admin.reviewsFilter', 'Reviews filter')}</InputLabel>
              <Select
                value={filter}
                label={t('admin.reviewsFilter', 'Reviews filter')}
                onChange={handleFilterChange}
              >
                <MenuItem value="all">{t('admin.allReviews', 'All reviews')}</MenuItem>
                <MenuItem value="pending">{t('admin.pendingReviews', 'Pending reviews')}</MenuItem>
                <MenuItem value="approved">{t('admin.approvedReviews', 'Approved reviews')}</MenuItem>
                <MenuItem value="reported">{t('admin.reportedReviews', 'Reported reviews')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              {t('admin.totalReviews', 'Барлығы: {{count}} пікір', { count: totalCount })}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>{t('admin.id', 'ID')}</TableCell>
              <TableCell>{t('admin.reviewUser', 'Пайдаланушы')}</TableCell>
              <TableCell>{t('admin.reviewBook', 'Кітап')}</TableCell>
              <TableCell>{t('admin.reviewRating', 'Рейтинг')}</TableCell>
              <TableCell>{t('admin.reviewDate', 'Күні')}</TableCell>
              <TableCell>{t('admin.reviewStatus', 'Мәртебесі')}</TableCell>
              <TableCell>{t('admin.actions', 'Әрекеттер')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">{t('common.loading', 'Жүктелуде...')}</TableCell>
              </TableRow>
            ) : reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">{t('admin.noReviews', 'Пікірлер табылмады')}</TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>{review.id}</TableCell>
                  <TableCell>{getUserName(review)}</TableCell>
                  <TableCell>{getBookTitle(review.bookId)}</TableCell>
                  <TableCell>
                    <Rating value={review.rating} readOnly size="small" />
                  </TableCell>
                  <TableCell>{formatDate(review.createdAt)}</TableCell>
                  <TableCell>
                    {review.isReported && (
                      <Chip
                        icon={<FlagIcon />}
                        label={t('admin.reported', 'Reported')}
                        color="error"
                        size="small"
                        sx={{ mr: 1 }}
                      />
                    )}
                    {review.isApproved ? (
                      <Chip label={t('admin.statusApproved', 'Approved')} color="success" size="small" />
                    ) : (
                      <Chip label={t('admin.statusPending', 'Pending')} color="warning" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => openReviewViewDialog(review)}
                      title={t('admin.viewReview', 'View review')}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    
                    {!review.isApproved && (
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleApproveReview(review.id, true)}
                        title={t('admin.approveReview', 'Approve review')}
                      >
                        <CheckIcon fontSize="small" />
                      </IconButton>
                    )}
                    
                    {review.isApproved && (
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => handleApproveReview(review.id, false)}
                        title={t('admin.rejectReview', 'Reject review')}
                      >
                        <VisibilityOffIcon fontSize="small" />
                      </IconButton>
                    )}
                    
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => openReviewDeleteDialog(review)}
                      title={t('admin.deleteReview', 'Delete review')}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t('pagination.rowsPerPage', 'Бет сайын:')}
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('pagination.of', '/')} ${count}`}
      />

      {/* Пікірді қарау диалогы */}
      {selectedReview && (
        <Dialog
          open={openViewDialog}
          onClose={() => setOpenViewDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {t('admin.reviewDetails', 'Review details')}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {t('admin.reviewBook', 'Кітап')}:
                </Typography>
                <Typography variant="body1">
                  {getBookTitle(selectedReview.bookId)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {t('admin.reviewUser', 'Пайдаланушы')}:
                </Typography>
                <Typography variant="body1">
                  {getUserName(selectedReview)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {t('admin.reviewDate', 'Күні')}:
                </Typography>
                <Typography variant="body1">
                  {formatDate(selectedReview.createdAt)}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {t('admin.reviewRating', 'Рейтинг')}:
                </Typography>
                <Rating value={selectedReview.rating} readOnly />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {t('admin.reviewContent', 'Пікір мәтіні')}:
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, mt: 1, whiteSpace: 'pre-wrap' }}>
                  {selectedReview.text}
                </Paper>
              </Grid>
              
              {selectedReview.isReported && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold" color="error">
                    {t('admin.reportReason', 'Шағым себебі')}:
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: 'error.light', color: 'error.contrastText' }}>
                    {selectedReview.reportReason}
                  </Paper>
                </Grid>
              )}
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {t('admin.status', 'Мәртебесі')}:
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {selectedReview.isReported && (
                    <Chip
                      icon={<FlagIcon />}
                      label={t('admin.reported', 'Reported')}
                      color="error"
                      sx={{ mr: 1 }}
                    />
                  )}
                  {selectedReview.isApproved ? (
                    <Chip label={t('admin.statusApproved', 'Approved')} color="success" />
                  ) : (
                    <Chip label={t('admin.statusPending', 'Pending')} color="warning" />
                  )}
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            {!selectedReview.isApproved && (
              <Button
                startIcon={<CheckIcon />}
                color="success"
                onClick={() => {
                  handleApproveReview(selectedReview.id, true);
                  setOpenViewDialog(false);
                }}
              >
                {t('admin.approve', 'Approve')}
              </Button>
            )}
            
            {selectedReview.isApproved && (
              <Button
                startIcon={<VisibilityOffIcon />}
                color="warning"
                onClick={() => {
                  handleApproveReview(selectedReview.id, false);
                  setOpenViewDialog(false);
                }}
              >
                {t('admin.reject', 'Reject')}
              </Button>
            )}
            
            <Button
              startIcon={<DeleteIcon />}
              color="error"
              onClick={() => {
                setOpenViewDialog(false);
                openReviewDeleteDialog(selectedReview);
              }}
            >
              {t('admin.delete', 'Delete')}
            </Button>
            
            <Button onClick={() => setOpenViewDialog(false)}>
              {t('common.close', 'Close')}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Пікірді жою диалогы */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>
          {t('admin.deleteReview', 'Delete review')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('admin.deleteReviewConfirm', 'Are you sure you want to delete this review? This action cannot be undone.')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button onClick={handleDeleteReview} color="error">
            {t('common.delete', 'Delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReviewsPage;