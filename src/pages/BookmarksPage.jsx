// src/pages/BookmarksPage.js
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  Divider,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Bookmark as BookmarkIcon,
  DeleteOutline as DeleteIcon,
  Info as InfoIcon,
  LocalLibrary as LibraryIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

// Импорт хуков и утилит
import useBookmarks from '../hooks/useBookmarks';
import { useToast } from '../context/ToastContext';
import { getBookCoverUrl, truncateString } from '../utils';

const BookmarksPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { bookmarks, loading, error, removeBookmark } = useBookmarks();
  const { success, error: showError } = useToast();
  
  // Состояние для диалога подтверждения удаления
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookmarkToDelete, setBookmarkToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  // Открытие диалога удаления
  const handleOpenDeleteDialog = (bookmark) => {
    setBookmarkToDelete(bookmark);
    setDeleteDialogOpen(true);
  };
  
  // Закрытие диалога удаления
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setBookmarkToDelete(null);
  };
  
  // Удаление закладки
  const handleDeleteBookmark = async () => {
    if (!bookmarkToDelete) return;
    
    try {
      setDeleting(true);
      await removeBookmark(bookmarkToDelete.id);
      success(t('bookmarks.deleteSuccess'));
      handleCloseDeleteDialog();
    } catch (err) {
      console.error('Ошибка при удалении закладки:', err);
      showError(t('bookmarks.deleteError'));
    } finally {
      setDeleting(false);
    }
  };
  
  // Анимация для карточек
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.3
      }
    }),
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
  };
  
  // Отображение скелетонов во время загрузки
  if (loading && bookmarks.length === 0) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('bookmarks.title')}
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {Array.from(new Array(4)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card elevation={2}>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={30} />
                  <Skeleton variant="text" height={20} width="60%" />
                  <Skeleton variant="text" height={20} width="40%" sx={{ mt: 1 }} />
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Skeleton variant="rectangular" width={80} height={30} />
                  <Skeleton variant="circular" width={30} height={30} />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            {t('bookmarks.title')}
          </Typography>
          
          <Chip
            icon={<BookmarkIcon />}
            label={t('books.booksCount', { count: bookmarks.length })}
            color="primary"
            variant="outlined"
          />
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {bookmarks.length === 0 ? (
          <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
            <BookmarkIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6">
              {t('bookmarks.noBookmarks')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('bookmarks.noBookmarksDescription', {defaultValue: 'Вы еще не добавили ни одну книгу в закладки'})}
            </Typography>
            <Button 
              variant="contained" 
              component={RouterLink} 
              to="/books"
              startIcon={<LibraryIcon />}
            >
              {t('books.browseCatalog')}
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            <AnimatePresence>
              {bookmarks.map((bookmark, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={bookmark.id}>
                  <motion.div
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    <Card 
                      elevation={2} 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 6
                        }
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={getBookCoverUrl(bookmark.book?.cover)}
                        alt={bookmark.book?.title}
                        sx={{ objectFit: 'contain', backgroundColor: 'action.hover' }}
                      />
                      
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="div" gutterBottom noWrap>
                          {bookmark.book?.title}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {bookmark.book?.author}
                        </Typography>
                        
                        {bookmark.book?.category && (
                          <Chip 
                            label={bookmark.book.category.name} 
                            size="small" 
                            variant="outlined"
                            sx={{ mt: 1 }}
                          />
                        )}
                      </CardContent>
                      
                      <Divider />
                      
                      <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
                        <Button
                          size="small"
                          component={RouterLink}
                          to={`/books/${bookmark.book?.id}`}
                          endIcon={<ArrowForwardIcon />}
                        >
                          {isMobile ? t('common.view') : t('books.details.showMore')}
                        </Button>
                        
                        <IconButton 
                          color="error"
                          size="small"
                          onClick={() => handleOpenDeleteDialog(bookmark)}
                          aria-label={t('common.delete')}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        )}
      </Container>
      
      {/* Диалог подтверждения удаления */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t('bookmarks.deleteDialog.title', {defaultValue: 'Удаление закладки'})}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <InfoIcon color="warning" />
            <Typography>
              {t('bookmarks.deleteDialog.confirmation', {
                title: bookmarkToDelete?.book?.title,
                defaultValue: 'Вы уверены, что хотите удалить книгу "{{title}}" из закладок?'
              })}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={deleting}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleDeleteBookmark}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting && <CircularProgress size={24} />}
          >
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default BookmarksPage;