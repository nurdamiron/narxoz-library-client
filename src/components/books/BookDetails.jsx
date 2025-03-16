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
    <Box>
      <Grid container spacing={4}>
        {/* Сол жақ бағана - кітап мұқабасы және түймелер */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)', // Үстінен өткенде мұқаба аздап үлкейеді
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
              }}
            />
          </Card>

          {/* Кітап әрекеттері түймелері */}
          <Stack spacing={2} sx={{ mt: 3 }}>
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
                }}
              >
                Нет в наличии
              </Button>
            )}

            {/* Таңдаулыға қосу және бөлісу түймелері */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleBookmarkToggle}
                  startIcon={bookmarked ? <Bookmark /> : <BookmarkBorder />}
                  sx={{ borderRadius: 2 }}
                >
                  {bookmarked ? 'В закладках' : 'В закладки'}
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleShare}
                  startIcon={<Share />}
                  sx={{ borderRadius: 2 }}
                >
                  Поделиться
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </Grid>

        {/* Оң жақ бағана - кітап мәліметтері */}
        <Grid item xs={12} md={8}>
          {/* Кітап атауы мен авторы */}
          <Box sx={{ mb: 3 }}>
            <Chip
              label={book.category}
              color="secondary"
              size="small"
              sx={{ mb: 1 }}
            />
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              {book.title}
            </Typography>
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

          <Divider sx={{ mb: 3 }} />

          {/* Кітап сипаттамасы */}
          <Typography variant="h6" gutterBottom fontWeight="bold">
            О книге
          </Typography>
          <Typography variant="body1" paragraph>
            {book.description || 'Описание отсутствует.'}
          </Typography>

          {/* Кітаптың техникалық мәліметтері */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  borderRadius: 2,
                }}
              >
                <Stack spacing={2}>
                  {/* Шығарылған жылы */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarToday
                      fontSize="small"
                      sx={{ color: theme.palette.primary.main, mr: 1 }}
                    />
                    <Typography variant="body2" component="span" fontWeight="bold">
                      Год издания:
                    </Typography>
                    <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                      {book.publicationYear}
                    </Typography>
                  </Box>

                  {/* Категориясы */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Category
                      fontSize="small"
                      sx={{ color: theme.palette.primary.main, mr: 1 }}
                    />
                    <Typography variant="body2" component="span" fontWeight="bold">
                      Категория:
                    </Typography>
                    <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                      {book.category}
                    </Typography>
                  </Box>

                  {/* Тілі */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Language
                      fontSize="small"
                      sx={{ color: theme.palette.primary.main, mr: 1 }}
                    />
                    <Typography variant="body2" component="span" fontWeight="bold">
                      Язык:
                    </Typography>
                    <Typography variant="body2" component="span" sx={{ ml: 1 }}>
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
                  p: 2,
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  borderRadius: 2,
                }}
              >
                <Stack spacing={2}>
                  {/* Мамандық */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <School
                      fontSize="small"
                      sx={{ color: theme.palette.primary.main, mr: 1 }}
                    />
                    <Typography variant="body2" component="span" fontWeight="bold">
                      Специальность:
                    </Typography>
                    <Typography variant="body2" component="span" sx={{ ml: 1 }}>
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
                      sx={{ color: theme.palette.primary.main, mr: 1 }}
                    />
                    <Typography variant="body2" component="span" fontWeight="bold">
                      Доступность:
                    </Typography>
                    <Typography
                      variant="body2"
                      component="span"
                      sx={{
                        ml: 1,
                        color: book.available
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                      }}
                    >
                      {book.available ? 'В наличии' : 'Нет в наличии'}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* Ұсынылатын курстар */}
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Рекомендуется для курсов
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {/* Категорияға байланысты ұсынылатын курстар */}
            {book.category === 'Финансы' && (
              <>
                <Chip label="Финансовый менеджмент" />
                <Chip label="Корпоративные финансы" />
                <Chip label="Инвестиционный анализ" />
              </>
            )}
            {book.category === 'Маркетинг' && (
              <>
                <Chip label="Маркетинговые исследования" />
                <Chip label="Цифровой маркетинг" />
                <Chip label="Стратегический маркетинг" />
              </>
            )}
            {/* Басқа категориялар үшін ұқсас блоктар */}
            {book.category === 'Бизнес' && (
              <>
                <Chip label="Стратегический менеджмент" />
                <Chip label="Теория игр" />
                <Chip label="Принятие решений" />
              </>
            )}
            {book.category === 'IT и программирование' && (
              <>
                <Chip label="Анализ данных" />
                <Chip label="Машинное обучение" />
                <Chip label="Программирование на Python" />
              </>
            )}
            {book.category === 'Право' && (
              <>
                <Chip label="Корпоративное право" />
                <Chip label="Юридические дисциплины" />
                <Chip label="Правоведение" />
              </>
            )}
            {book.category === 'Экономика' && (
              <>
                <Chip label="Микроэкономика" />
                <Chip label="Макроэкономика" />
                <Chip label="Экономическая теория" />
              </>
            )}
            {book.category === 'Менеджмент' && (
              <>
                <Chip label="Управление проектами" />
                <Chip label="Основы менеджмента" />
                <Chip label="Организационное поведение" />
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
      >
        <DialogTitle id="borrow-dialog-title">
          Подтверждение заказа книги
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="borrow-dialog-description">
            Вы хотите взять книгу "{book.title}"? Книга будет зарезервирована на ваше имя, и вы сможете забрать её в библиотеке в течение 3 рабочих дней.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Отмена
          </Button>
          <Button onClick={handleConfirmBorrow} color="primary" variant="contained">
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
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BookDetails;