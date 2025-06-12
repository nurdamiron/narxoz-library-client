import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Container,
  TextField,
  MenuItem,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Alert,
  AlertTitle,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  Stack
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Warning as WarningIcon } from '@mui/icons-material';
import adminUserService from '../../services/adminUserService';
import PageHeader from '../../components/common/PageHeader';
import { AdminTable, FilterBar, ConfirmDialog } from '../../components/admin/common';
import { useToast } from '../../context/ToastContext';
import { translateError } from '../../utils/errorMessages';
import { useTranslation } from 'react-i18next';

const UsersPage = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [formError, setFormError] = useState('');
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [editUserLoading, setEditUserLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');
  const { success, error: showError } = useToast();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: 'student',
    faculty: '',
    specialization: '',
    studentId: ''
  });
  const theme = useTheme();

  // Загрузка пользователей при монтировании компонента
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Фильтрация пользователей при изменении фильтра роли или списка пользователей
  useEffect(() => {
    if (roleFilter === 'all') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user => user.role === roleFilter));
    }
    setPage(0); // Сброс страницы при изменении фильтра
  }, [roleFilter, users]);

  // Функция для загрузки списка пользователей
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminUserService.getUsers();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error(t('admin.errorFetchingUsers', 'Error fetching users:'), error);
      showError(t('admin.usersLoadingError', 'Ошибка загрузки пользователей'));
    } finally {
      setLoading(false);
    }
  };

  // Обработчики изменения страницы и количества строк на странице
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Обработчик изменения полей формы
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Обработчик добавления пользователя
  const handleAddUser = async () => {
    try {
      setAddUserLoading(true);
      setFormError('');
      
      // Проверка обязательных полей перед отправкой запроса
      if (!formData.username || !formData.password || !formData.firstName || 
          !formData.lastName || !formData.email || !formData.role) {
        setFormError(t('validation.requiredFields', 'Барлық міндетті өрістерді толтырыңыз'));
        return;
      }
      
      console.log('👉 Sending registration data:', formData);
      const response = await adminUserService.createUser(formData);
      
      if (response.success) {
        // Успешное создание пользователя
        success(t('admin.userCreated', { firstName: formData.firstName, lastName: formData.lastName }, 'Пайдаланушы {{firstName}} {{lastName}} сәтті құрылды'));
        fetchUsers();
        setOpenAddDialog(false);
        resetForm();
      }
    } catch (error) {
      console.error('❌ Error creating user:', error);
      
      // Улучшенная обработка ошибок
      if (typeof error === 'object') {
        // Проверка на структурированный объект ошибки
        if (error.message) {
          setFormError(error.message);
          
          // Подсветка конкретного поля с ошибкой, если известно
          if (error.field) {
            const errorField = document.querySelector(`input[name="${error.field}"]`);
            if (errorField) {
              errorField.focus();
              errorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        } else if (error.response && error.response.data) {
          // Обработка ответа API
          const { data } = error.response;
          
          if (typeof data === 'string') {
            setFormError(translateError(data));
          } else if (data.error || data.message) {
            setFormError(translateError(data.error || data.message));
          } else {
            setFormError(t('admin.userCreateError', 'Пайдаланушыны құру кезінде қате орын алды. Деректерді тексеріп, қайталап көріңіз.'));
          }
        } else {
          // Если структура ошибки не распознана
          setFormError(t('admin.userCreateError', 'Пайдаланушыны құру кезінде қате орын алды. Деректерді тексеріп, қайталап көріңіз.'));
        }
      } else if (typeof error === 'string') {
        // Если ошибка представлена строкой
        setFormError(translateError(error));
      } else {
        // Для неопределенных ошибок
        setFormError(t('admin.unknownError', 'Белгісіз қате орын алды. Әрекетті қайталап көріңіз.'));
      }
      
      // Отображение дополнительной информации в консоли для отладки
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      }
      
      // Показать ошибку также через Toast
      showError(t('admin.userCreateFailed', 'Пайдаланушы құру сәтсіз аяқталды'));
    } finally {
      setAddUserLoading(false);
    }
  };

  // Обработчик редактирования пользователя
  const handleEditUser = async () => {
    try {
      if (!selectedUser) return;
      
      setEditUserLoading(true);
      setFormError('');
      
      console.log('📝 Отправка данных для обновления пользователя:', formData);
      const response = await adminUserService.updateUser(selectedUser.id, formData);
      
      if (response.success) {
        success(t('admin.userUpdated', { firstName: formData.firstName, lastName: formData.lastName }, 'Пайдаланушы {{firstName}} {{lastName}} сәтті жаңартылды'));
        fetchUsers();
        setOpenEditDialog(false);
        resetForm();
      }
    } catch (error) {
      console.error('❌ Error updating user:', error);
      
      // Улучшенная обработка ошибок
      if (typeof error === 'object') {
        if (error.message) {
          setFormError(error.message);
        } else if (error.response && error.response.data) {
          const { data } = error.response;
          
          if (typeof data === 'string') {
            setFormError(translateError(data));
          } else if (data.error || data.message) {
            setFormError(translateError(data.error || data.message));
          } else {
            setFormError(t('admin.userUpdateError', 'Пайдаланушыны жаңарту кезінде қате орын алды. Деректерді тексеріп, қайталап көріңіз.'));
          }
        } else {
          setFormError(t('admin.userUpdateError', 'Пайдаланушыны жаңарту кезінде қате орын алды. Деректерді тексеріп, қайталап көріңіз.'));
        }
      } else if (typeof error === 'string') {
        setFormError(translateError(error));
      } else {
        setFormError(t('admin.unknownError', 'Белгісіз қате орын алды. Әрекетті қайталап көріңіз.'));
      }
      
      // Отображение ошибки в консоли для отладки
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      }
      
      showError(t('admin.userUpdateFailed', 'Пайдаланушыны жаңарту сәтсіз аяқталды'));
    } finally {
      setEditUserLoading(false);
    }
  };

  // Обработчик удаления пользователя
  const handleDeleteUser = async () => {
    try {
      if (!selectedUser) return;
      
      const response = await adminUserService.deleteUser(selectedUser.id);
      
      if (response.success) {
        success(t('admin.userDeleted', { firstName: selectedUser.firstName, lastName: selectedUser.lastName }, 'Пайдаланушы {{firstName}} {{lastName}} сәтті жойылды'));
        fetchUsers();
        setOpenDeleteDialog(false);
      } else {
        showError(response.message || t('admin.deleteError', 'Жою кезінде қате орын алды'));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      
      let errorMessage = 'Жою кезінде қате орын алды';
      
      if (error.response && error.response.data) {
        const { data } = error.response;
        errorMessage = typeof data === 'string' ? data : (data.message || data.error || errorMessage);
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showError(translateError(errorMessage));
    }
  };

  // Открытие диалога редактирования пользователя
  const openEditUserDialog = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username || '',
      password: '', // Не заполняем пароль при редактировании
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      role: user.role || 'student',
      faculty: user.faculty || '',
      specialization: user.specialization || '',
      studentId: user.studentId || ''
    });
    setOpenEditDialog(true);
  };

  // Открытие диалога удаления пользователя
  const openDeleteUserDialog = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };
  
  // Сброс формы
  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      role: 'student',
      faculty: '',
      specialization: '',
      studentId: ''
    });
    setFormError('');
  };

  // Получение цвета для роли пользователя
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'moderator':
        return 'warning';
      case 'student':
        return 'primary';
      case 'teacher':
        return 'info';
      default:
        return 'default';
    }
  };

  // Преобразование роли для отображения
  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return t('roles.admin', 'Администратор');
      case 'moderator':
        return t('roles.moderator', 'Модератор');
      case 'student':
        return t('roles.student', 'Студент');
      case 'teacher':
        return t('roles.teacher', 'Преподаватель');
      default:
        return role;
    }
  };

  // Заголовки столбцов таблицы
  const columns = [
    { 
      id: 'id', 
      label: 'ID', 
      width: 70 
    },
    { 
      id: 'fullName', 
      label: t('user.fullName', 'ФИО'), 
      render: (value, row) => {
        if (!row) return '-';
        return row.lastName ? `${row.lastName} ${row.firstName || ''}` : '-';
      }
    },
    { 
      id: 'username', 
      label: t('user.username', 'Имя пользователя') 
    },
    { 
      id: 'email', 
      label: t('user.email', 'Email') 
    },
    { 
      id: 'role', 
      label: t('user.role', 'Роль'),
      render: (value, row) => {
        if (!row || !row.role) return '-';
        return (
          <Chip 
            label={getRoleLabel(row.role)} 
            color={getRoleColor(row.role)} 
            size="small" 
          />
        );
      }
    },
    { 
      id: 'actions', 
      label: t('admin.actions', 'Действия'),
      width: 150,
      render: (value, row) => {
        if (!row) return null;
        return (
          <Box>
            <IconButton 
              color="primary" 
              onClick={() => openEditUserDialog(row)}
              title={t('common.edit', 'Редактировать')}
            >
              <EditIcon />
            </IconButton>
            <IconButton 
              color="error" 
              onClick={() => openDeleteUserDialog(row)}
              title={t('common.delete', 'Удалить')}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      }
    },
  ];

  return (
    <Container maxWidth="xl">
      <PageHeader 
        title={t('admin.users', 'Пользователи')} 
        subtitle={t('admin.usersManagement', 'Управление пользователями системы')}
      />
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">{t('admin.usersList', 'Список пользователей')}</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              resetForm();
              setOpenAddDialog(true);
            }}
          >
            {t('admin.addUser', 'Добавить пользователя')}
          </Button>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="role-filter-label">{t('user.role', 'Роль')}</InputLabel>
              <Select
                labelId="role-filter-label"
                value={roleFilter}
                label={t('user.role', 'Роль')}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="all">{t('admin.filterAll', 'Все')}</MenuItem>
                <MenuItem value="admin">{t('roles.admin', 'Администратор')}</MenuItem>
                <MenuItem value="moderator">{t('roles.moderator', 'Модератор')}</MenuItem>
                <MenuItem value="teacher">{t('roles.teacher', 'Преподаватель')}</MenuItem>
                <MenuItem value="student">{t('roles.student', 'Студент')}</MenuItem>
              </Select>
            </FormControl>
            
            {roleFilter !== 'all' && (
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => setRoleFilter('all')}
              >
                {t('admin.resetFilters', 'Сбросить')}
              </Button>
            )}
            
            <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
              {t('admin.totalUsers', 'Всего пользователей')}: {filteredUsers.length}
            </Typography>
          </Stack>
        </Box>
        
        <AdminTable
          columns={columns}
          data={filteredUsers}
          loading={loading}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          emptyMessage={t('admin.noUsers', 'Нет пользователей')}
        />
      </Paper>

      {/* Диалог добавления пользователя */}
      <Dialog 
        open={openAddDialog} 
        onClose={() => !addUserLoading && setOpenAddDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{t('admin.addUser', 'Добавить пользователя')}</DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('user.firstName', 'Имя')}
                name="firstName"
                value={formData.firstName}
                onChange={handleFormChange}
                required
                margin="dense"
              />
              <TextField
                fullWidth
                label={t('user.lastName', 'Фамилия')}
                name="lastName"
                value={formData.lastName}
                onChange={handleFormChange}
                required
                margin="dense"
              />
              <TextField
                fullWidth
                label={t('user.username', 'Имя пользователя')}
                name="username"
                value={formData.username}
                onChange={handleFormChange}
                required
                margin="dense"
              />
              <TextField
                fullWidth
                label={t('user.password', 'Пароль')}
                name="password"
                type="password"
                value={formData.password}
                onChange={handleFormChange}
                required
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('user.email', 'Email')}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                required
                margin="dense"
              />
              <TextField
                fullWidth
                label={t('user.phone', 'Телефон')}
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleFormChange}
                margin="dense"
              />
              <TextField
                select
                fullWidth
                label={t('user.role', 'Роль')}
                name="role"
                value={formData.role}
                onChange={handleFormChange}
                required
                margin="dense"
              >
                <MenuItem value="student">{t('roles.student', 'Студент')}</MenuItem>
                <MenuItem value="teacher">{t('roles.teacher', 'Преподаватель')}</MenuItem>
                <MenuItem value="moderator">{t('roles.moderator', 'Модератор')}</MenuItem>
                <MenuItem value="admin">{t('roles.admin', 'Администратор')}</MenuItem>
              </TextField>
            </Grid>
            
            {/* Дополнительные поля для студентов */}
            {formData.role === 'student' && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('user.faculty', 'Факультет')}
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleFormChange}
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('user.specialization', 'Специальность')}
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleFormChange}
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('user.studentId', 'ID студента')}
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleFormChange}
                    margin="dense"
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenAddDialog(false)} 
            disabled={addUserLoading}
          >
            {t('common.cancel', 'Отмена')}
          </Button>
          <Button 
            onClick={handleAddUser} 
            variant="contained"
            color="primary"
            disabled={addUserLoading}
          >
            {addUserLoading ? t('common.loading', 'Загрузка...') : t('common.add', 'Добавить')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог редактирования пользователя */}
      <Dialog 
        open={openEditDialog} 
        onClose={() => !editUserLoading && setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{t('admin.editUser', 'Редактировать пользователя')}</DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('user.firstName', 'Имя')}
                name="firstName"
                value={formData.firstName}
                onChange={handleFormChange}
                required
                margin="dense"
              />
              <TextField
                fullWidth
                label={t('user.lastName', 'Фамилия')}
                name="lastName"
                value={formData.lastName}
                onChange={handleFormChange}
                required
                margin="dense"
              />
              <TextField
                fullWidth
                label={t('user.username', 'Имя пользователя')}
                name="username"
                value={formData.username}
                onChange={handleFormChange}
                required
                margin="dense"
                disabled
              />
              <TextField
                fullWidth
                label={t('user.password', 'Новый пароль')}
                name="password"
                type="password"
                value={formData.password}
                onChange={handleFormChange}
                helperText={t('admin.passwordHint', 'Оставьте пустым, если не хотите менять пароль')}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('user.email', 'Email')}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                required
                margin="dense"
              />
              <TextField
                fullWidth
                label={t('user.phone', 'Телефон')}
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleFormChange}
                margin="dense"
              />
              <TextField
                select
                fullWidth
                label={t('user.role', 'Роль')}
                name="role"
                value={formData.role}
                onChange={handleFormChange}
                required
                margin="dense"
              >
                <MenuItem value="student">{t('roles.student', 'Студент')}</MenuItem>
                <MenuItem value="teacher">{t('roles.teacher', 'Преподаватель')}</MenuItem>
                <MenuItem value="moderator">{t('roles.moderator', 'Модератор')}</MenuItem>
                <MenuItem value="admin">{t('roles.admin', 'Администратор')}</MenuItem>
              </TextField>
            </Grid>
            
            {/* Дополнительные поля для студентов */}
            {formData.role === 'student' && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('user.faculty', 'Факультет')}
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleFormChange}
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('user.specialization', 'Специальность')}
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleFormChange}
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('user.studentId', 'ID студента')}
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleFormChange}
                    margin="dense"
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenEditDialog(false)} 
            disabled={editUserLoading}
          >
            {t('common.cancel', 'Отмена')}
          </Button>
          <Button 
            onClick={handleEditUser} 
            variant="contained"
            color="primary"
            disabled={editUserLoading}
          >
            {editUserLoading ? t('common.loading', 'Загрузка...') : t('common.save', 'Сохранить')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <ConfirmDialog
        open={openDeleteDialog}
        title={t('admin.deleteUser', 'Удалить пользователя')}
        message={
          selectedUser 
            ? t(
                'admin.deleteUserConfirm', 
                { name: `${selectedUser.firstName} ${selectedUser.lastName}` },
                'Вы уверены, что хотите удалить пользователя {{name}}? Это действие нельзя будет отменить.'
              )
            : t('admin.deleteUserConfirmGeneric', 'Вы уверены, что хотите удалить этого пользователя? Это действие нельзя будет отменить.')
        }
        onConfirm={handleDeleteUser}
        onCancel={() => setOpenDeleteDialog(false)}
      />
    </Container>
  );
};

export default UsersPage;