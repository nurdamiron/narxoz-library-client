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

/**
 * Пікірлерді әкімші панелінде басқару беті
 */
const ReviewsPage = () => {
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
              console.error(`Error fetching book ${bookId}:`, err);
            }
          })
        );
        
        setBookDetails(bookDetailsTemp);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
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
      await reviewService.approveReview(reviewId, isApproved);
      
      // Тізімді жаңарту
      fetchReviews();
    } catch (err) {
      console.error('Error approving review:', err);
    }
  };

  /**
   * Пікірді жою
   */
  const handleDeleteReview = async () => {
    try {
      await reviewService.deleteReview(selectedReview.id);
      setOpenDeleteDialog(false);
      
      // Тізімді жаңарту
      fetchReviews();
    } catch (err) {
      console.error('Error deleting review:', err);
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
      return 'Белгісіз күн';
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
    return 'Белгісіз пайдаланушы';
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
    return 'Кітап анықталмады';
  };

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Пікірлерді басқару"
        subtitle="Кітап пікірлерін модерациялау, бекіту және жою"
      />

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Пікірлер фильтрі</InputLabel>
              <Select
                value={filter}
                label="Пікірлер фильтрі"
                onChange={handleFilterChange}
              >
                <MenuItem value="all">Барлық пікірлер</MenuItem>
                <MenuItem value="pending">Күтудегі пікірлер</MenuItem>
                <MenuItem value="approved">Бекітілген пікірлер</MenuItem>
                <MenuItem value="reported">Шағым білдірілген пікірлер</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Барлығы: {totalCount} пікір
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Пайдаланушы</TableCell>
              <TableCell>Кітап</TableCell>
              <TableCell>Рейтинг</TableCell>
              <TableCell>Күні</TableCell>
              <TableCell>Мәртебесі</TableCell>
              <TableCell>Әрекеттер</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Жүктелуде...</TableCell>
              </TableRow>
            ) : reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Пікірлер табылмады</TableCell>
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
                        label="Шағым"
                        color="error"
                        size="small"
                        sx={{ mr: 1 }}
                      />
                    )}
                    {review.isApproved ? (
                      <Chip label="Бекітілген" color="success" size="small" />
                    ) : (
                      <Chip label="Күтуде" color="warning" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => openReviewViewDialog(review)}
                      title="Пікірді қарау"
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    
                    {!review.isApproved && (
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleApproveReview(review.id, true)}
                        title="Пікірді бекіту"
                      >
                        <CheckIcon fontSize="small" />
                      </IconButton>
                    )}
                    
                    {review.isApproved && (
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => handleApproveReview(review.id, false)}
                        title="Пікірді қабылдамау"
                      >
                        <VisibilityOffIcon fontSize="small" />
                      </IconButton>
                    )}
                    
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => openReviewDeleteDialog(review)}
                      title="Пікірді жою"
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
        labelRowsPerPage="Бет сайын:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
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
            Пікірді қарау
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Кітап:
                </Typography>
                <Typography variant="body1">
                  {getBookTitle(selectedReview.bookId)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Пайдаланушы:
                </Typography>
                <Typography variant="body1">
                  {getUserName(selectedReview)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Күні:
                </Typography>
                <Typography variant="body1">
                  {formatDate(selectedReview.createdAt)}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Рейтинг:
                </Typography>
                <Rating value={selectedReview.rating} readOnly />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Пікір мәтіні:
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, mt: 1, whiteSpace: 'pre-wrap' }}>
                  {selectedReview.text}
                </Paper>
              </Grid>
              
              {selectedReview.isReported && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold" color="error">
                    Шағым себебі:
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: 'error.light', color: 'error.contrastText' }}>
                    {selectedReview.reportReason}
                  </Paper>
                </Grid>
              )}
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Мәртебесі:
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {selectedReview.isReported && (
                    <Chip
                      icon={<FlagIcon />}
                      label="Шағым білдірілген"
                      color="error"
                      sx={{ mr: 1 }}
                    />
                  )}
                  {selectedReview.isApproved ? (
                    <Chip label="Бекітілген" color="success" />
                  ) : (
                    <Chip label="Күтуде" color="warning" />
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
                Бекіту
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
                Қабылдамау
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
              Жою
            </Button>
            
            <Button onClick={() => setOpenViewDialog(false)}>
              Жабу
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
          Пікірді жою
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Бұл пікірді жоюға сенімдісіз бе? Бұл әрекетті болдырмау мүмкін емес.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            Бас тарту
          </Button>
          <Button onClick={handleDeleteReview} color="error">
            Жою
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReviewsPage;