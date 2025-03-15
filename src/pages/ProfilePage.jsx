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

// Тестовые данные пользователя
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

// Тестовые данные для закладок
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

// Тестовые данные для текущих книг
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

// Тестовые данные для уведомлений
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

const ProfilePage = () => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState('1');
  const [editMode, setEditMode] = useState(false);
  
  // Состояния для редактирования профиля
  const [userData, setUserData] = useState(mockUser);
  const [editedUserData, setEditedUserData] = useState(mockUser);
  
  // Состояние для уведомлений и диалогов
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBookForReturn, setSelectedBookForReturn] = useState(null);
  
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  const handleEditProfile = () => {
    setEditMode(true);
    setEditedUserData(userData);
  };
  
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedUserData(userData);
  };
  
  const handleSaveProfile = () => {
    // Имитация сохранения данных
    setUserData(editedUserData);
    setEditMode(false);
    
    // Показываем уведомление
    setSnackbarMessage('Профиль успешно обновлен');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData({
      ...editedUserData,
      [name]: value,
    });
  };
  
  const handleReturnBook = (book) => {
    setSelectedBookForReturn(book);
    setDialogOpen(true);
  };
  
  const handleConfirmReturn = () => {
    // Имитация возврата книги
    // В реальном приложении здесь был бы запрос к API
    
    setDialogOpen(false);
    setSnackbarMessage('Книга успешно возвращена');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };
  
  const handleRemoveBookmark = (bookmarkId) => {
    // Имитация удаления закладки
    // В реальном приложении здесь был бы запрос к API
    
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
        {/* Левая колонка - Информация о пользователе */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                height: 100,
                backgroundColor: theme.palette.primary.main,
              }}
            />
            
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                mt: -6,
              }}
            >
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
                {userData.name?.charAt(0)}
              </Avatar>
              
              <CardContent sx={{ width: '100%', textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {userData.name}
                </Typography>
                
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                >
                  Студент • {userData.year}
                </Typography>
                
                <Chip
                  label={userData.specialization}
                  color="primary"
                  size="small"
                  sx={{ mt: 1, mb: 2 }}
                />
                
                <Divider sx={{ my: 2 }} />
                
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={userData.email}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Телефон"
                      secondary={userData.phone}
                    />
                  </ListItem>
                  
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
        
        {/* Правая колонка - Вкладки */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ borderRadius: 2 }}>
            <TabContext value={currentTab}>
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
              
              {/* Вкладка редактирования профиля */}
              <TabPanel value="1">
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Информация о пользователе
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="ФИО"
                        name="name"
                        value={editedUserData.name}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </Grid>
                    
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
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Студенческий ID"
                        name="studentId"
                        value={editedUserData.studentId}
                        onChange={handleInputChange}
                        disabled={true} // ID нельзя изменить
                      />
                    </Grid>
                    
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
                  
                  {editMode && (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mt: 3,
                        gap: 2,
                      }}
                    >
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={handleCancelEdit}
                      >
                        Отмена
                      </Button>
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
              
              {/* Вкладка закладок */}
              <TabPanel value="2">
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Книги в закладках
                  </Typography>
                  
                  {mockBookmarks.length > 0 ? (
                    <List>
                      {mockBookmarks.map((bookmark) => (
                        <Paper
                          key={bookmark.id}
                          sx={{
                            mb: 2,
                            p: 2,
                            borderRadius: 2,
                            '&:hover': {
                              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                            },
                          }}
                        >
                          <Grid container alignItems="center">
                            <Grid item xs>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {bookmark.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {bookmark.author}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Добавлено: {bookmark.addedAt}
                              </Typography>
                            </Grid>
                            <Grid item>
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
              
              {/* Вкладка текущих книг */}
              <TabPanel value="3">
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Текущие книги
                  </Typography>
                  
                  {mockCurrentBooks.length > 0 ? (
                    <List>
                      {mockCurrentBooks.map((book) => (
                        <Paper
                          key={book.id}
                          sx={{
                            mb: 2,
                            p: 2,
                            borderRadius: 2,
                            border: book.isOverdue
                              ? `1px solid ${theme.palette.error.main}`
                              : 'none',
                            '&:hover': {
                              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                            },
                          }}
                        >
                          <Grid container alignItems="center">
                            <Grid item xs>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {book.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {book.author}
                              </Typography>
                              <Box sx={{ mt: 1 }}>
                                <Chip
                                  label={`Взято: ${book.borrowedAt}`}
                                  size="small"
                                  sx={{ mr: 1, mb: 1 }}
                                />
                                <Chip
                                  label={`Вернуть до: ${book.dueAt}`}
                                  size="small"
                                  color={book.isOverdue ? 'error' : 'default'}
                                  sx={{ mb: 1 }}
                                />
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
              
              {/* Вкладка уведомлений */}
              <TabPanel value="4">
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Уведомления
                  </Typography>
                  
                  {mockNotifications.length > 0 ? (
                    <List>
                      {mockNotifications.map((notification) => (
                        <Paper
                          key={notification.id}
                          sx={{
                            mb: 2,
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: notification.read
                              ? 'transparent'
                              : 'rgba(25, 118, 210, 0.05)',
                            '&:hover': {
                              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                            },
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            fontWeight={notification.read ? 'normal' : 'bold'}
                          >
                            {notification.title}
                          </Typography>
                          <Typography variant="body2" sx={{ my: 1 }}>
                            {notification.message}
                          </Typography>
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
      
      {/* Диалог подтверждения возврата книги */}
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