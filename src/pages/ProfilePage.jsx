import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
} from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Bookmark as BookmarkIcon,
  History as HistoryIcon,
  NotificationsActive as NotificationsIcon,
} from '@mui/icons-material';

/**
 * Пайдаланушының тестілік деректері
 * 
 * Бұл объект пайдаланушы профилінің деректерін сақтайды.
 * Шынайы қосымшада бұл деректер API арқылы алынар еді.
 */
const mockUser = {
  id: 1,
  name: 'Айдар Тестов',
  email: 'aidar@test.com',
  phone: '+7 (777) 123-45-67',
  faculty: 'Экономический факультет',
  specialization: 'Финансы и кредит',
  studentId: '2023-1234',
  year: '3 курс',
  avatar: null,
};

/**
 * Таңдаулылар (закладки) үшін тестілік деректер
 * 
 * Бұл массив пайдаланушының таңдаулыларға қосқан кітаптары туралы ақпаратты сақтайды
 */
const mockBookmarks = [
  {
    id: 1,
    title: 'Маркетинг 5.0: Технологии следующего поколения',
    author: 'Филип Котлер, Хермаван Картаджайя',
    addedAt: '15.02.2025',
  },
  {
    id: 2,
    title: 'Введение в экономическую теорию',
    author: 'Пол Самуэльсон, Уильям Нордхаус',
    addedAt: '10.02.2025',
  },
];

/**
 * Ағымдағы кітаптар үшін тестілік деректер
 * 
 * Бұл массив пайдаланушы қазіргі уақытта алған кітаптары туралы ақпаратты сақтайды
 */
const mockCurrentBooks = [
  {
    id: 1,
    title: 'Основы финансового менеджмента',
    author: 'Джеймс С. Ван Хорн, Джон М. Вахович',
    borrowedAt: '01.03.2025',
    dueAt: '15.03.2025',
    isOverdue: false,
  },
];

/**
 * Хабарландырулар үшін тестілік деректер
 * 
 * Бұл массив пайдаланушыға келген хабарландырулар туралы ақпаратты сақтайды
 */
const mockNotifications = [
  {
    id: 1,
    title: 'Срок возврата книги приближается',
    message: 'Книгу "Основы финансового менеджмента" необходимо вернуть в течение 3 дней',
    date: '12.03.2025',
    read: false,
  },
  {
    id: 2,
    title: 'Новые поступления',
    message: 'В библиотеку поступили новые книги по вашей специальности',
    date: '10.03.2025',
    read: true,
  },
];

/**
 * ProfilePage компоненті - пайдаланушы профилінің беті
 * 
 * Бұл компонент пайдаланушының профилін көрсетеді және оны басқару мүмкіндігін ұсынады:
 * - Профиль деректерін көру және өзгерту
 * - Таңдаулылар тізімін басқару
 * - Ағымдағы алынған кітаптарды басқару
 * - Хабарландыруларды көру
 */
const ProfilePage = () => {
  const theme = useTheme(); // Material UI тақырыбын алу
  const [currentTab, setCurrentTab] = useState('1'); // Ағымдағы қойынды
  const [editMode, setEditMode] = useState(false); // Өңдеу режимі
  
  // Пайдаланушы деректерінің күйлері
  const [userData, setUserData] = useState(mockUser); // Сақталған пайдаланушы деректері
  const [editedUserData, setEditedUserData] = useState(mockUser); // Өңделу кезіндегі пайдаланушы деректері
  
  // Хабарландырулар мен диалогтар күйлері
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar ашық/жабық күйі
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar хабарламасы
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Snackbar түрі
  const [dialogOpen, setDialogOpen] = useState(false); // Диалог ашық/жабық күйі
  const [selectedBookForReturn, setSelectedBookForReturn] = useState(null); // Қайтарылатын кітап
  
  /**
   * Қойынды өзгеру функциясы
   * 
   * @param {Event} event - Оқиға объектісі
   * @param {string} newValue - Жаңа қойынды мәні
   */
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  /**
   * Профильді өңдеу режимін қосу функциясы
   */
  const handleEditProfile = () => {
    setEditMode(true);
    setEditedUserData(userData); // Бастапқы деректерді өңдеу күйіне көшіру
  };
  
  /**
   * Профильді өңдеуден бас тарту функциясы
   */
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedUserData(userData); // Өңделген деректерді тастап, бастапқы деректерге қайту
  };
  
  /**
   * Профиль өзгерістерін сақтау функциясы
   */
  const handleSaveProfile = () => {
    // Деректерді сақтауды имитациялау
    setUserData(editedUserData);
    setEditMode(false);
    
    // Хабарландыру көрсету
    setSnackbarMessage('Профиль успешно обновлен');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };
  
  /**
   * Өңдеу кезінде өріс мәндерінің өзгеруін өңдеу функциясы
   * 
   * @param {Event} e - Оқиға объектісі
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData({
      ...editedUserData,
      [name]: value,
    });
  };
  
  /**
   * Кітапты қайтару сұрауы функциясы
   * 
   * @param {Object} book - Қайтарылатын кітап объектісі
   */
  const handleReturnBook = (book) => {
    setSelectedBookForReturn(book);
    setDialogOpen(true);
  };
  
  /**
   * Кітапты қайтаруды растау функциясы
   */
  const handleConfirmReturn = () => {
    // Кітапты қайтаруды имитациялау
    // Шынайы қосымшада мұнда API сұрауы болар еді
    
    setDialogOpen(false);
    setSnackbarMessage('Книга успешно возвращена');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };
  
  /**
   * Таңдаулыдан кітапты алып тастау функциясы
   * 
   * @param {number} bookmarkId - Таңдаулының идентификаторы
   */
  const handleRemoveBookmark = (bookmarkId) => {
    // Таңдаулыдан кітапты алып тастауды имитациялау
    // Шынайы қосымшада мұнда API сұрауы болар еді
    
    setSnackbarMessage('Закладка удалена');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };
  
  return (
    <Container>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Профиль
      </Typography>
      
      <Grid container spacing={4}>
        {/* Сол жақ колонка - Пайдаланушы ақпараты */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Профиль бетінің жоғарғы түсті аймағы */}
            <Box
              sx={{
                height: 100,
                backgroundColor: theme.palette.primary.main,
              }}
            />
            
            {/* Профиль ақпараты */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                mt: -6, // Аватарды жоғарғы аймаққа қабаттастыру үшін
              }}
            >
              {/* Пайдаланушы аватары */}
              <Avatar
                src={userData.avatar}
                alt={userData.name}
                sx={{
                  width: 100,
                  height: 100,
                  border: '4px solid white',
                  backgroundColor: theme.palette.secondary.main,
                  fontSize: 40,
                }}
              >
                {userData.name?.charAt(0)} {/* Аватар болмаса, атының бірінші әрпі көрсетіледі */}
              </Avatar>
              
              <CardContent sx={{ width: '100%', textAlign: 'center' }}>
                {/* Пайдаланушы аты */}
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {userData.name}
                </Typography>
                
                {/* Пайдаланушы мәртебесі */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                >
                  Студент • {userData.year}
                </Typography>
                
                {/* Пайдаланушы мамандығы */}
                <Chip
                  label={userData.specialization}
                  color="primary"
                  size="small"
                  sx={{ mt: 1, mb: 2 }}
                />
                
                <Divider sx={{ my: 2 }} />
                
                {/* Пайдаланушының байланыс ақпараты */}
                <List dense>
                  {/* Email */}
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={userData.email}
                    />
                  </ListItem>
                  
                  {/* Телефон */}
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Телефон"
                      secondary={userData.phone}
                    />
                  </ListItem>
                  
                  {/* Факультет */}
                  <ListItem>
                    <ListItemIcon>
                      <SchoolIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Факультет"
                      secondary={userData.faculty}
                    />
                  </ListItem>
                </List>
                
                {/* Профильді өңдеу түймесі */}
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEditProfile}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Редактировать профиль
                </Button>
              </CardContent>
            </Box>
          </Card>
        </Grid>
        
        {/* Оң жақ колонка - Қойындылар */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ borderRadius: 2 }}>
            <TabContext value={currentTab}>
              {/* Қойындылар тақырыптары */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  aria-label="profile tabs"
                  variant="fullWidth"
                >
                  <Tab
                    icon={<EditIcon />}
                    iconPosition="start"
                    label="Редактирование"
                    value="1"
                  />
                  <Tab
                    icon={<BookmarkIcon />}
                    iconPosition="start"
                    label="Закладки"
                    value="2"
                  />
                  <Tab
                    icon={<HistoryIcon />}
                    iconPosition="start"
                    label="Мои книги"
                    value="3"
                  />
                  <Tab
                    icon={<NotificationsIcon />}
                    iconPosition="start"
                    label="Уведомления"
                    value="4"
                  />
                </Tabs>
              </Box>
              
              {/* Профиль өңдеу қойындысы */}
              <TabPanel value="1">
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Информация о пользователе
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {/* Аты-жөні өрісі */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="ФИО"
                        name="name"
                        value={editedUserData.name}
                        onChange={handleInputChange}
                        disabled={!editMode} // Өңдеу режимінде ғана өзгертуге болады
                      />
                    </Grid>
                    
                    {/* Email өрісі */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        name="email"
                        value={editedUserData.email}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </Grid>
                    
                    {/* Телефон өрісі */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Телефон"
                        name="phone"
                        value={editedUserData.phone}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </Grid>
                    
                    {/* Факультет өрісі */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Факультет"
                        name="faculty"
                        value={editedUserData.faculty}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </Grid>
                    
                    {/* Мамандық өрісі */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Специализация"
                        name="specialization"
                        value={editedUserData.specialization}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </Grid>
                    
                    {/* Студенттік ID өрісі */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Студенческий ID"
                        name="studentId"
                        value={editedUserData.studentId}
                        onChange={handleInputChange}
                        disabled={true} // ID өзгертуге болмайды
                      />
                    </Grid>
                    
                    {/* Курс өрісі */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Курс"
                        name="year"
                        value={editedUserData.year}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </Grid>
                  </Grid>
                  
                  {/* Өңдеу режимінде көрсетілетін түймелер */}
                  {editMode && (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mt: 3,
                        gap: 2,
                      }}
                    >
                      {/* Бас тарту түймесі */}
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={handleCancelEdit}
                      >
                        Отмена
                      </Button>
                      {/* Сақтау түймесі */}
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSaveProfile}
                      >
                        Сохранить
                      </Button>
                    </Box>
                  )}
                </Box>
              </TabPanel>
              
              {/* Таңдаулылар қойындысы */}
              <TabPanel value="2">
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Книги в закладках
                  </Typography>
                  
                  {mockBookmarks.length > 0 ? (
                    <List>
                      {/* Таңдаулылар тізімі */}
                      {mockBookmarks.map((bookmark) => (
                        <Paper
                          key={bookmark.id}
                          sx={{
                            mb: 2,
                            p: 2,
                            borderRadius: 2,
                            '&:hover': {
                              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Үстінен өткенде көлеңке
                            },
                          }}
                        >
                          <Grid container alignItems="center">
                            <Grid item xs>
                              {/* Кітап атауы */}
                              <Typography variant="subtitle1" fontWeight="bold">
                                {bookmark.title}
                              </Typography>
                              {/* Кітап авторы */}
                              <Typography variant="body2" color="text.secondary">
                                {bookmark.author}
                              </Typography>
                              {/* Қосылған күні */}
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Добавлено: {bookmark.addedAt}
                              </Typography>
                            </Grid>
                            <Grid item>
                              {/* Таңдаулыдан алып тастау түймесі */}
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleRemoveBookmark(bookmark.id)}
                              >
                                Удалить
                              </Button>
                            </Grid>
                          </Grid>
                        </Paper>
                      ))}
                    </List>
                  ) : (
                    /* Таңдаулылар жоқ болған жағдайда көрсетілетін хабарлама */
                    <Box
                      sx={{
                        p: 4,
                        textAlign: 'center',
                        border: '1px dashed',
                        borderColor: 'divider',
                        borderRadius: 2,
                      }}
                    >
                      <BookmarkIcon
                        sx={{
                          fontSize: 60,
                          color: 'text.disabled',
                          mb: 2,
                        }}
                      />
                      <Typography variant="h6" color="text.secondary">
                        У вас нет книг в закладках
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Добавляйте интересующие вас книги в закладки, чтобы
                        быстро находить их позже
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        component={RouterLink}
                        to="/books"
                      >
                        Перейти в каталог
                      </Button>
                    </Box>
                  )}
                </Box>
              </TabPanel>
              
              {/* Менің кітаптарым қойындысы */}
              <TabPanel value="3">
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Текущие книги
                  </Typography>
                  
                  {mockCurrentBooks.length > 0 ? (
                    <List>
                      {/* Ағымдағы кітаптар тізімі */}
                      {mockCurrentBooks.map((book) => (
                        <Paper
                          key={book.id}
                          sx={{
                            mb: 2,
                            p: 2,
                            borderRadius: 2,
                            border: book.isOverdue
                              ? `1px solid ${theme.palette.error.main}` // Мерзімі өткен кітаптар үшін қызыл жиек
                              : 'none',
                            '&:hover': {
                              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Үстінен өткенде көлеңке
                            },
                          }}
                        >
                          <Grid container alignItems="center">
                            <Grid item xs>
                              {/* Кітап атауы */}
                              <Typography variant="subtitle1" fontWeight="bold">
                                {book.title}
                              </Typography>
                              {/* Кітап авторы */}
                              <Typography variant="body2" color="text.secondary">
                                {book.author}
                              </Typography>
                              <Box sx={{ mt: 1 }}>
                                {/* Алған күні */}
                                <Chip
                                  label={`Взято: ${book.borrowedAt}`}
                                  size="small"
                                  sx={{ mr: 1, mb: 1 }}
                                />
                                {/* Қайтару мерзімі */}
                                <Chip
                                  label={`Вернуть до: ${book.dueAt}`}
                                  size="small"
                                  color={book.isOverdue ? 'error' : 'default'} // Мерзімі өткенде қызыл түс
                                  sx={{ mb: 1 }}
                                />
                                {/* Мерзімі өткен жағдайда көрсетілетін хабарлама */}
                                {book.isOverdue && (
                                  <Typography
                                    variant="caption"
                                    color="error"
                                    sx={{ display: 'block' }}
                                  >
                                    Просрочено!
                                  </Typography>
                                )}
                              </Box>
                            </Grid>
                            <Grid item>
                              {/* Кітапты қайтару түймесі */}
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleReturnBook(book)}
                              >
                                Вернуть
                              </Button>
                            </Grid>
                          </Grid>
                        </Paper>
                      ))}
                    </List>
                  ) : (
                    /* Кітаптар жоқ болған жағдайда көрсетілетін хабарлама */
                    <Box
                      sx={{
                        p: 4,
                        textAlign: 'center',
                        border: '1px dashed',
                        borderColor: 'divider',
                        borderRadius: 2,
                      }}
                    >
                      <HistoryIcon
                        sx={{
                          fontSize: 60,
                          color: 'text.disabled',
                          mb: 2,
                        }}
                      />
                      <Typography variant="h6" color="text.secondary">
                        У вас нет взятых книг
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Вы можете взять книги в библиотеке университета
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        component={RouterLink}
                        to="/books"
                      >
                        Перейти в каталог
                      </Button>
                    </Box>
                  )}
                </Box>
              </TabPanel>
              
              {/* Хабарландырулар қойындысы */}
              <TabPanel value="4">
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Уведомления
                  </Typography>
                  
                  {mockNotifications.length > 0 ? (
                    <List>
                      {/* Хабарландырулар тізімі */}
                      {mockNotifications.map((notification) => (
                        <Paper
                          key={notification.id}
                          sx={{
                            mb: 2,
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: notification.read
                              ? 'transparent' // Оқылған хабарландырулар үшін әдеттегі фон
                              : 'rgba(25, 118, 210, 0.05)', // Оқылмаған хабарландырулар үшін ерекшеленген фон
                            '&:hover': {
                              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Үстінен өткенде көлеңке
                            },
                          }}
                        >
                          {/* Хабарландыру тақырыбы */}
                          <Typography
                            variant="subtitle1"
                            fontWeight={notification.read ? 'normal' : 'bold'} // Оқылмаған хабарландырулар қалың шрифтпен
                          >
                            {notification.title}
                          </Typography>
                          {/* Хабарландыру мәтіні */}
                          <Typography variant="body2" sx={{ my: 1 }}>
                            {notification.message}
                          </Typography>
                          {/* Хабарландыру күні */}
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block', textAlign: 'right' }}
                          >
                            {notification.date}
                          </Typography>
                        </Paper>
                      ))}
                    </List>
                  ) : (
                    /* Хабарландырулар жоқ болған жағдайда көрсетілетін хабарлама */
                    <Box
                      sx={{
                        p: 4,
                        textAlign: 'center',
                        border: '1px dashed',
                        borderColor: 'divider',
                        borderRadius: 2,
                      }}
                    >
                      <NotificationsIcon
                        sx={{
                          fontSize: 60,
                          color: 'text.disabled',
                          mb: 2,
                        }}
                      />
                      <Typography variant="h6" color="text.secondary">
                        У вас нет уведомлений
                      </Typography>
                    </Box>
                  )}
                </Box>
              </TabPanel>
            </TabContext>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Кітапты қайтаруды растау диалогы */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="return-dialog-title"
      >
        <DialogTitle id="return-dialog-title">
          Подтверждение возврата книги
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите вернуть книгу "
            {selectedBookForReturn?.title}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Отмена</Button>
          <Button
            onClick={handleConfirmReturn}
            variant="contained"
            autoFocus
          >
            Подтвердить
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar для уведомлений */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePage;