import React, { useState } from 'react';
import {
  Box,
  Card,
  CardMedia,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Button,
  Paper,
  Snackbar,
  Stack,
  Typography,
  Alert,
  useTheme,
  alpha,
  Container,
  useMediaQuery,
} from '@mui/material';
import {
  CalendarToday,
  Category,
  Language,
  School,
  LocalLibrary,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon
} from '@mui/icons-material';

/**
 * BookDetails компонент - единое решение для десктопа и мобильных устройств
 * 
 * @param {Object} book - информация о книге
 */
const BookDetails = ({ book }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Состояния
  const [bookmarked, setBookmarked] = useState(book.isBookmarked || false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Функция добавления/удаления закладки
  const handleBookmarkToggle = () => {
    setBookmarked(!bookmarked);
    setSnackbarMessage(
      bookmarked
        ? 'Книга удалена из закладок'
        : 'Книга добавлена в закладки'
    );
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  // Функция для копирования ссылки
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setSnackbarMessage('Ссылка скопирована в буфер обмена');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  // Функция для обработки нажатия на кнопку "Взять книгу"
  const handleBorrowClick = () => {
    setDialogOpen(true);
  };

  // Закрытие диалога
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  // Подтверждение взятия книги
  const handleConfirmBorrow = () => {
    setDialogOpen(false);
    setSnackbarMessage('Книга успешно заказана! Заберите её в библиотеке в течение 3 дней.');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  // Закрытие сообщения
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ 
      pb: { xs: 0, md: 8 },
      px: { xs: 0, md: 3 },
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      {!isMobile && (
        <Box sx={{ mb: 4, mt: 4, px: { xs: 2, md: 0 } }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            {book.title}
          </Typography>
        </Box>
      )}
      
      <Grid container spacing={isMobile ? 0 : 5} sx={{ flex: 1 }}>
        {/* Левая колонка - обложка книги */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s',
              borderRadius: isMobile ? 0 : 3,
              overflow: 'hidden',
              boxShadow: isMobile ? 'none' : theme.shadows[3],
              '&:hover': {
                transform: isMobile ? 'none' : 'scale(1.02)',
                boxShadow: isMobile ? 'none' : theme.shadows[6],
              },
            }}
          >
            <CardMedia
              component="img"
              image={book.cover || 'https://via.placeholder.com/400x600?text=No+Cover'}
              alt={book.title}
              sx={{
                height: 'auto',
                maxHeight: 500,
                objectFit: 'contain',
                p: 2,
                backgroundColor: alpha('#f5f5f5', 0.5),
              }}
            />
          </Card>
        </Grid>

        {/* Правая колонка - информация о книге */}
        <Grid item xs={12} md={8}>
          <Box sx={{ p: { xs: 3, md: 0 }, pt: { xs: 4, md: 0 } }}>
            {/* Информация о книге */}
            <Box sx={{ mb: 4 }}>
              <Chip
                label={book.category}
                color="secondary"
                size="small"
                sx={{ mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {book.author}
              </Typography>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Описание книги */}
            <Typography variant="h6" gutterBottom fontWeight="bold">
              О книге
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 4 }}>
              {book.description || 'Учебник по финансовому менеджменту для студентов экономических специальностей. Книга содержит полный обзор современной теории и практики финансового менеджмента. В ней рассматриваются базовые концепции финансового менеджмента, управления оборотным капиталом, структурой капитала, дивидендной политикой, инвестиционная деятельность предприятия и оценка стоимости бизнеса.'}
            </Typography>

            {/* Технические характеристики книги */}
            <Grid container spacing={3} sx={{ mb: 5 }}>
              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    backgroundColor: alpha('#f5f5f5', 0.5),
                    borderRadius: 3,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: isMobile ? 'none' : 'translateY(-4px)',
                      boxShadow: isMobile ? 'none' : theme.shadows[2],
                    },
                  }}
                >
                  <Stack spacing={3}>
                    {/* Год издания */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarToday
                        fontSize="small"
                        sx={{ color: '#d50032', mr: 1.5 }}
                      />
                      <Typography variant="body2" component="span" fontWeight="bold" sx={{ mr: 1 }}>
                        Год издания:
                      </Typography>
                      <Typography variant="body2" component="span">
                        {book.publicationYear}
                      </Typography>
                    </Box>

                    {/* Категория */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Category
                        fontSize="small"
                        sx={{ color: '#d50032', mr: 1.5 }}
                      />
                      <Typography variant="body2" component="span" fontWeight="bold" sx={{ mr: 1 }}>
                        Категория:
                      </Typography>
                      <Typography variant="body2" component="span">
                        {book.category}
                      </Typography>
                    </Box>

                    {/* Язык */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Language
                        fontSize="small"
                        sx={{ color: '#d50032', mr: 1.5 }}
                      />
                      <Typography variant="body2" component="span" fontWeight="bold" sx={{ mr: 1 }}>
                        Язык:
                      </Typography>
                      <Typography variant="body2" component="span">
                        Русский
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    backgroundColor: alpha('#f5f5f5', 0.5),
                    borderRadius: 3,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: isMobile ? 'none' : 'translateY(-4px)',
                      boxShadow: isMobile ? 'none' : theme.shadows[2],
                    },
                  }}
                >
                  <Stack spacing={3}>
                    {/* Специальность */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <School
                        fontSize="small"
                        sx={{ color: '#d50032', mr: 1.5 }}
                      />
                      <Typography variant="body2" component="span" fontWeight="bold" sx={{ mr: 1 }}>
                        Специальность:
                      </Typography>
                      <Typography variant="body2" component="span">
                        {book.category === 'IT и программирование'
                          ? 'Информационные технологии'
                          : book.category === 'Право'
                          ? 'Юриспруденция'
                          : 'Экономика и бизнес'}
                      </Typography>
                    </Box>

                    {/* Доступность */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocalLibrary
                        fontSize="small"
                        sx={{ color: '#d50032', mr: 1.5 }}
                      />
                      <Typography variant="body2" component="span" fontWeight="bold" sx={{ mr: 1 }}>
                        Доступность:
                      </Typography>
                      <Typography
                        variant="body2"
                        component="span"
                        sx={{
                          color: book.available
                            ? theme.palette.success.main
                            : theme.palette.error.main,
                          fontWeight: 'medium',
                        }}
                      >
                        {book.available ? 'В наличии' : 'Нет в наличии'}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>

            <Divider sx={{ mb: 4 }} />

            {/* Рекомендуемые курсы */}
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
              Рекомендуется для курсов
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 5 }}>
              {/* Рекомендуемые курсы по категориям */}
              {book.category === 'Финансы' && (
                <>
                  <Chip 
                    label="Финансовый менеджмент" 
                    sx={{ 
                      bgcolor: alpha('#d50032', 0.1),
                      color: '#d50032',
                      mb: 1,
                    }}
                  />
                  <Chip 
                    label="Корпоративные финансы" 
                    sx={{ 
                      bgcolor: alpha('#d50032', 0.1),
                      color: '#d50032',
                      mb: 1,
                    }}
                  />
                  <Chip 
                    label="Инвестиционный анализ" 
                    sx={{ 
                      bgcolor: alpha('#d50032', 0.1),
                      color: '#d50032',
                      mb: 1,
                    }}
                  />
                </>
              )}
              {/* Другие категории курсов */}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Кнопки действий - единые для всех устройств */}
      <Box sx={{ width: '100%', mt: { xs: 0, md: 'auto',} }}>
        <Card 
          elevation={2}
          sx={{ 
            borderRadius: { xs: 0, md: 2 },
            overflow: 'hidden',
            width: '100%',
          }}
        >
          {/* Кнопка взять книгу */}
          {book.available ? (
            <Button
              variant="contained"
              fullWidth
              onClick={handleBorrowClick}
              sx={{
                py: 1.8,
                borderRadius: 0,
                fontWeight: 'bold',
                backgroundColor: '#d50032',
                color: 'white',
                fontSize: '1.1rem',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: alpha('#d50032', 0.9),
                },
              }}
            >
              Взять книгу
            </Button>
          ) : (
            <Button
              variant="contained"
              fullWidth
              disabled
              sx={{
                py: 1.8,
                borderRadius: 0,
                fontWeight: 'bold',
                fontSize: '1.1rem',
                textTransform: 'none',
              }}
            >
              Нет в наличии
            </Button>
          )}

          {/* Рейтинг */}
          <Box 
            sx={{ 
              py: 2, 
              display: 'flex', 
              justifyContent: 'center',
              borderBottom: '1px solid',
              borderColor: alpha('#000', 0.1)
            }}
          >
            <Typography 
              variant="body1" 
              fontWeight="medium" 
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              {/* Звезды рейтинга */}
              <Box sx={{ display: 'flex', mr: 1.5 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Box 
                    key={star}
                    component="span" 
                    sx={{ 
                      color: star <= Math.floor(book.rating) ? '#FFC107' : alpha('#FFC107', 0.3),
                      fontSize: { xs: '1.3rem', sm: '1.5rem' },
                      lineHeight: 1,
                      mr: 0.3
                    }}
                  >
                    ★
                  </Box>
                ))}
              </Box>
              {book.rating} ({book.reviewCount} отзывов)
            </Typography>
          </Box>

          {/* Нижняя панель с кнопками */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              width: '100%'
            }}
          >
            {/* Кнопка закладки */}
            <Button
              onClick={handleBookmarkToggle}
              startIcon={bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              sx={{ 
                flex: 1,
                borderRadius: 0,
                py: 1.5,
                color: bookmarked ? '#d50032' : 'text.secondary',
                '&:hover': {
                  backgroundColor: alpha('#d50032', 0.05),
                },
                justifyContent: 'center'
              }}
            >
              {isMobile ? "" : "В закладки"}
            </Button>

            <Divider orientation="vertical" flexItem />

            {/* Кнопка поделиться */}
            <Button
              onClick={handleShare}
              startIcon={<ShareIcon />}
              sx={{ 
                flex: 1,
                borderRadius: 0,
                py: 1.5,
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: alpha('#000', 0.05),
                },
                justifyContent: 'center'
              }}
            >
              {isMobile ? "" : "Поделиться"}
            </Button>
          </Box>
        </Card>
      </Box>

      {/* Диалог подтверждения заказа книги */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="borrow-dialog-title"
        aria-describedby="borrow-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            padding: 1,
          }
        }}
      >
        <DialogTitle id="borrow-dialog-title" sx={{ pb: 1 }}>
          Подтверждение заказа книги
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="borrow-dialog-description">
            Вы хотите взять книгу "{book.title}"? Книга будет зарезервирована на ваше имя, и вы сможете забрать её в библиотеке в течение 3 рабочих дней.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={handleDialogClose} 
            sx={{ 
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: alpha('#000', 0.05),
              },
            }}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleConfirmBorrow} 
            variant="contained" 
            sx={{ 
              bgcolor: '#d50032',
              '&:hover': {
                backgroundColor: alpha('#d50032', 0.9),
              },
            }}
          >
            Подтвердить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Уведомления */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BookDetails;