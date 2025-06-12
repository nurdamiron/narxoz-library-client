import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Rating,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  RateReview as ReviewIcon,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import reviewService from '../services/reviewService';
import { useToast } from '../context/ToastContext';
import { getBookCoverUrl, getDefaultBookCover } from '../utils';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`review-tabpanel-${index}`}
      aria-labelledby={`review-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const MyReviewsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState(0);
  const [editDialog, setEditDialog] = useState({ open: false, review: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, review: null });

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getMyReviews();
      setReviews(response);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      showToast(t('myReviews.loadError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getFilteredReviews = () => {
    switch (activeTab) {
      case 0: // All
        return reviews;
      case 1: // Approved
        return reviews.filter(r => r.status === 'approved');
      case 2: // Pending
        return reviews.filter(r => r.status === 'pending');
      case 3: // Rejected
        return reviews.filter(r => r.status === 'rejected');
      default:
        return reviews;
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (review) => {
    setEditDialog({ open: true, review });
  };

  const handleDeleteClick = (review) => {
    setDeleteDialog({ open: true, review });
  };

  const handleEditSubmit = async () => {
    try {
      await reviewService.updateReview(editDialog.review.id, {
        rating: editDialog.review.rating,
        comment: editDialog.review.comment,
      });
      showToast(t('myReviews.updateSuccess'), 'success');
      setEditDialog({ open: false, review: null });
      fetchMyReviews();
    } catch (error) {
      showToast(t('myReviews.updateError'), 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await reviewService.deleteReview(deleteDialog.review.id);
      showToast(t('myReviews.deleteSuccess'), 'success');
      setDeleteDialog({ open: false, review: null });
      fetchMyReviews();
    } catch (error) {
      showToast(t('myReviews.deleteError'), 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredReviews = getFilteredReviews();
  const displayedReviews = filteredReviews.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <LoadingSkeleton rows={6} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <PageHeader
        title={t('myReviews.title')}
        subtitle={t('myReviews.subtitle')}
        icon={<ReviewIcon />}
        action={
          <Button
            variant="contained"
            onClick={() => navigate('/user-dashboard')}
          >
            {t('myReviews.backToDashboard')}
          </Button>
        }
      />

      <Paper sx={{ mt: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="review tabs">
            <Tab label={`${t('myReviews.all')} (${reviews.length})`} />
            <Tab label={`${t('myReviews.approved')} (${reviews.filter(r => r.status === 'approved').length})`} />
            <Tab label={`${t('myReviews.pending')} (${reviews.filter(r => r.status === 'pending').length})`} />
            <Tab label={`${t('myReviews.rejected')} (${reviews.filter(r => r.status === 'rejected').length})`} />
          </Tabs>
        </Box>

        {filteredReviews.length === 0 ? (
          <Box sx={{ p: 4 }}>
            <EmptyState
              message={t('myReviews.noReviews')}
              action={
                <Button
                  variant="contained"
                  onClick={() => navigate('/books')}
                >
                  {t('myReviews.browseBooks')}
                </Button>
              }
            />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('myReviews.book')}</TableCell>
                    <TableCell align="center">{t('myReviews.rating')}</TableCell>
                    <TableCell>{t('myReviews.comment')}</TableCell>
                    <TableCell>{t('myReviews.date')}</TableCell>
                    <TableCell align="center">{t('myReviews.status')}</TableCell>
                    <TableCell align="center">{t('myReviews.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {review.Book?.cover && (
                            <img
                              src={getBookCoverUrl(review.Book.cover)}
                              alt={review.Book.title}
                              style={{ width: 40, height: 60, objectFit: 'cover' }}
                              onError={(e) => {
                                if (e.target && e.target.src && !e.target.src.includes('no-image.png')) {
                                  e.target.src = getDefaultBookCover();
                                  e.target.onerror = null;
                                }
                              }}
                            />
                          )}
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {review.Book?.title || t('books.bookNotFound')}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {review.Book?.author}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Rating value={review.rating} readOnly size="small" />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 300,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {review.comment}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={t(`myReviews.status.${review.status}`)}
                          color={getStatusColor(review.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title={t('myReviews.view')}>
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/books/${review.bookId}`)}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {review.status === 'pending' && (
                          <>
                            <Tooltip title={t('myReviews.edit')}>
                              <IconButton
                                size="small"
                                onClick={() => handleEditClick(review)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('myReviews.delete')}>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteClick(review)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredReviews.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, review: null })} maxWidth="sm" fullWidth>
        <DialogTitle>{t('myReviews.editReview')}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>{t('myReviews.rating')}</Typography>
            <Rating
              value={editDialog.review?.rating || 0}
              onChange={(event, newValue) => {
                setEditDialog({
                  ...editDialog,
                  review: { ...editDialog.review, rating: newValue },
                });
              }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label={t('myReviews.comment')}
              value={editDialog.review?.comment || ''}
              onChange={(e) => {
                setEditDialog({
                  ...editDialog,
                  review: { ...editDialog.review, comment: e.target.value },
                });
              }}
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, review: null })}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleEditSubmit} variant="contained">
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, review: null })}>
        <DialogTitle>{t('myReviews.deleteReview')}</DialogTitle>
        <DialogContent>
          <Typography>{t('myReviews.deleteConfirm')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, review: null })}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyReviewsPage;