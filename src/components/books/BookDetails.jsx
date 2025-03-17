import React, { useState } from 'react';
import {
  Box,
  Button,
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
  Paper,
  Rating,
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
  BookmarkBorder,
  Bookmark,
  Share,
  CalendarToday,
  Category,
  Language,
  School,
  LocalLibrary,
} from '@mui/icons-material';

/**
 * BookDetails компоненті - кітап туралы толық ақпаратты көрсету үшін
 * 
 * Бұл компонент кітаптың егжей-тегжейлі мәліметтерін көрсетеді:
 * - Кітаптың мұқабасы
 * - Кітаптың атауы және авторы
 * - Рейтинг және пікірлер саны
 * - Кітап сипаттамасы
 * - Жылы, категориясы, тілі
 * - Кітапты алу мүмкіндігі
 * 
 * @param {Object} book - Кітап туралы барлық ақпарат
 */
const BookDetails = ({ book }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Кітаптың таңдаулы екенін бақылайтын күй
  const [bookmarked, setBookmarked] = useState(book.isBookmarked || false);
  // Диалог терезесінің ашық/жабық күйі
  const [dialogOpen, setDialogOpen] = useState(false);
  // Хабарламаларды көрсету үшін Snackbar күйлері
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Таңдаулыға қосу/алу функциясы
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

  // Кітап сілтемесімен бөлісу функциясы
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setSnackbarMessage('Ссылка скопирована в буфер обмена');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  // Кітапты алу түймесін басқан кезде
  const handleBorrowClick = () => {
    setDialogOpen(true);
  };

  // Диалог терезесін жабу
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  // Кітапты алуды растау
  const handleConfirmBorrow = () => {
    setDialogOpen(false);
    setSnackbarMessage('Книга успешно заказана! Заберите её в библиотеке в течение 3 дней.');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  // Хабарламаны жабу
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ pb: isMobile ? 10 : 20, px: isMobile ? 2 : 3 }}>
      {/* Breadcrumbs or title can be added here */}
      <Box sx={{ mb: 4, mt: isMobile ? 2 : 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          {book.title}
        </Typography>
      </Box>
      
      <Grid container spacing={isMobile ? 3 : 5}>
        {/* Сол жақ бағана - кітап мұқабасы және түймелер */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s',
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: theme.shadows[3],
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: theme.shadows[6],
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

          {/* Кітап әрекеттері түймелері */}
          <Stack spacing={3} sx={{ mt: 4 }}>
            {/* Кітапты алу түймесі */}
            {book.available ? (
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleBorrowClick}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 'bold',
                  backgroundColor: '#d50032',
                  color: 'white',
                  boxShadow: theme.shadows[2],
                  '&:hover': {
                    backgroundColor: alpha('#d50032', 0.9),
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                Взять книгу
              </Button>
            ) : (
              <Button
                variant="outlined"
                size="large"
                fullWidth
                disabled
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 'bold',
                }}
              >
                Нет в наличии
              </Button>
            )}

            {/* Таңдаулыға қосу және бөлісу түймелері - улучшенный мобильный вид */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleBookmarkToggle}
                  startIcon={bookmarked ? <Bookmark /> : <BookmarkBorder />}
                  sx={{ 
                    borderRadius: 2,
                    py: 1,
                    borderColor: bookmarked ? '#d50032' : undefined,
                    color: bookmarked ? '#d50032' : undefined,
                    '&:hover': {
                      borderColor: '#d50032',
                      backgroundColor: alpha('#d50032', 0.05),
                    },
                  }}
                >
                  {bookmarked ? (isMobile ? '' : 'В закладках') : (isMobile ? '' : 'В закладки')}
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleShare}
                  startIcon={<Share />}
                  sx={{ 
                    borderRadius: 2,
                    py: 1,
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                >
                  {isMobile ? '' : 'Поделиться'}
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </Grid>

        {/* Оң жақ бағана - кітап мәліметтері */}
        <Grid item xs={12} md={8}>
          {/* Кітап атауы мен авторы */}
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

            {/* Рейтинг және пікірлер саны */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating
                value={book.rating || 0}
                precision={0.5}
                readOnly
                sx={{ mr: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                {book.rating} ({book.reviewCount} отзывов)
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Кітап сипаттамасы */}
          <Typography variant="h6" gutterBottom fontWeight="bold">
            О книге
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            {book.description || 'Учебник по финансовому менеджменту для студентов экономических специальностей. Книга содержит полный обзор современной теории и практики финансового менеджмента. В ней рассматриваются базовые концепции финансового менеджмента, управления оборотным капиталом, структурой капитала, дивидендной политикой, инвестиционная деятельность предприятия и оценка стоимости бизнеса.'}
          </Typography>

          {/* Кітаптың техникалық мәліметтері */}
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
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[2],
                  },
                }}
              >
                <Stack spacing={3}>
                  {/* Шығарылған жылы */}
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

                  {/* Категориясы */}
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

                  {/* Тілі */}
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
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[2],
                  },
                }}
              >
                <Stack spacing={3}>
                  {/* Мамандық */}
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

                  {/* Қолжетімділігі */}
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

          {/* Ұсынылатын курстар */}
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
            Рекомендуется для курсов
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
            {/* Категорияға байланысты ұсынылатын курстар */}
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
            {book.category === 'Маркетинг' && (
              <>
                <Chip 
                  label="Маркетинговые исследования" 
                  sx={{ 
                    bgcolor: alpha('#d50032', 0.1),
                    color: '#d50032',
                    mb: 1,
                  }}
                />
                <Chip 
                  label="Цифровой маркетинг" 
                  sx={{ 
                    bgcolor: alpha('#d50032', 0.1),
                    color: '#d50032',
                    mb: 1,
                  }}
                />
                <Chip 
                  label="Стратегический маркетинг" 
                  sx={{ 
                    bgcolor: alpha('#d50032', 0.1),
                    color: '#d50032',
                    mb: 1,
                  }}
                />
              </>
            )}
            {/* Басқа категориялар үшін ұқсас блоктар */}
            {book.category === 'Бизнес' && (
              <>
                <Chip 
                  label="Стратегический менеджмент" 
                  sx={{ 
                    bgcolor: alpha('#d50032', 0.1),
                    color: '#d50032',
                    mb: 1,
                  }}
                />
                <Chip 
                  label="Теория игр" 
                  sx={{ 
                    bgcolor: alpha('#d50032', 0.1),
                    color: '#d50032',
                    mb: 1,
                  }}
                />
                <Chip 
                  label="Принятие решений" 
                  sx={{ 
                    bgcolor: alpha('#d50032', 0.1),
                    color: '#d50032',
                    mb: 1,
                  }}
                />
              </>
            )}
            {book.category === 'IT и программирование' && (
              <>
                <Chip 
                  label="Анализ данных" 
                  sx={{ 
                    bgcolor: alpha('#d50032', 0.1),
                    color: '#d50032',
                    mb: 1,
                  }}
                />
                <Chip 
                  label="Машинное обучение" 
                  sx={{ 
                    bgcolor: alpha('#d50032', 0.1),
                    color: '#d50032',
                    mb: 1,
                  }}
                />
                <Chip 
                  label="Программирование на Python" 
                  sx={{ 
                    bgcolor: alpha('#d50032', 0.1),
                    color: '#d50032',
                    mb: 1,
                  }}
                />
              </>
            )}
            {book.category === 'Право' && (
              <>
                <Chip 
                  label="Корпоративное право" 
                  sx={{ 
                    bgcolor: alpha('#d50032', 0.1),
                    color: '#d50032',
                    mb: 1,
                  }}
                />
                <Chip 
                  label="Юридические дисциплины" 
                  sx={{ 
                    bgcolor: alpha('#d50032', 0.1),
                    color: '#d50032',
                    mb: 1,
                  }}
                />
                <Chip 
                  label="Правоведение" 
                  sx={{ 
                    bgcolor: alpha('#d50032', 0.1),
                    color: '#d50032',
                    mb: 1,
                  }}
                />
              </>
            )}
            {book.category === 'Экономика' && (
              <>
                <Chip 
                  label="Микроэкономика" 
                  sx={{ 
                    bgcolor: alpha('#d50032', 0.1),
                    color: '#d50032',
                    mb: 1,
                  }}
                />
                <Chip 
                  label="Макроэкономика" 
                  sx={{ 
                    bgcolor: alpha('#d50032', 0.1),
                    color: '#d50032',
                    mb: 1,
                  }}
                />
                <Chip 
                  label="Экономическая теория" 
                  sx={{ 
                    bgcolor: alpha('#d50032', 0.1),
                    color: '#d50032',
                    mb: 1,
                  }}
                />
              </>
            )}
            {book.category === 'Менеджмент' && (
              <>
                <Chip 
                  label="Управление проектами" 
                  sx={{ 
                    bgcolor: alpha('#d50032', 0.1),
                    color: '#d50032',
                    mb: 1,
                  }}
                />
                <Chip 
                  label="Основы менеджмента" 
                  sx={{ 
                    bgcolor: alpha('#d50032', 0.1),
                    color: '#d50032',
                    mb: 1,
                  }}
                />
                <Chip 
                  label="Организационное поведение" 
                  sx={{ 
                    bgcolor: alpha('#d50032', 0.1),
                    color: '#d50032',
                    mb: 1,
                  }}
                />
              </>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Кітапты алуды растау диалог терезесі */}
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

      {/* Хабарламалар үшін Snackbar */}
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