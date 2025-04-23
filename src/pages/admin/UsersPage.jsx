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
  TablePagination
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import adminUserService from '../../services/adminUserService';
import PageHeader from '../../components/common/PageHeader';
import { AdminTable, FilterBar, ConfirmDialog } from '../../components/admin/common';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    faculty: '',
    specialization: '',
    studentId: '',
    year: ''
  });

  // Загрузка пользователей при монтировании компонента
  useEffect(() => {
    fetchUsers();
  }, []);

  // Функция для загрузки списка пользователей
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminUserService.getUsers();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
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
      const response = await adminUserService.createUser(formData);
      if (response.success) {
        fetchUsers();
        setOpenAddDialog(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  // Обработчик редактирования пользователя
  const handleEditUser = async () => {
    try {
      if (!selectedUser) return;
      
      const response = await adminUserService.updateUser(selectedUser.id, formData);
      if (response.success) {
        fetchUsers();
        setOpenEditDialog(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Обработчик удаления пользователя
  const handleDeleteUser = async () => {
    try {
      if (!selectedUser) return;
      
      const response = await adminUserService.deleteUser(selectedUser.id);
      if (response.success) {
        fetchUsers();
        setOpenDeleteDialog(false);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Открытие диалога редактирования
  const openEditUserDialog = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      faculty: user.faculty || '',
      specialization: user.specialization || '',
      studentId: user.studentId || '',
      year: user.year || ''
    });
    setOpenEditDialog(true);
  };

  // Открытие диалога удаления
  const openDeleteUserDialog = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  // Сброс формы
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user',
      faculty: '',
      specialization: '',
      studentId: '',
      year: ''
    });
    setSelectedUser(null);
  };

  // Получение цвета для роли пользователя
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'librarian':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <PageHeader 
        title="Пайдаланушыларды басқару" 
        subtitle="Жүйе пайдаланушыларын қарау, қосу, өңдеу және жою"
      />

      <Paper elevation={3} sx={{ mb: 4, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Пайдаланушылар тізімі</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => setOpenAddDialog(true)}
          >
            Пайдаланушы қосу
          </Button>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="users table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Аты</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Рөлі</TableCell>
                <TableCell>Факультет</TableCell>
                <TableCell>Мамандық</TableCell>
                <TableCell>Әрекеттер</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">Жүктелуде...</TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">Пайдаланушылар табылмады</TableCell>
                </TableRow>
              ) : (
                users
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip 
                          label={user.role} 
                          color={getRoleColor(user.role)} 
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{user.faculty}</TableCell>
                      <TableCell>{user.specialization}</TableCell>
                      <TableCell>
                        <IconButton 
                          aria-label="edit" 
                          color="primary"
                          onClick={() => openEditUserDialog(user)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          aria-label="delete" 
                          color="error"
                          onClick={() => openDeleteUserDialog(user)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Бет сайын:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
        />
      </Paper>

      {/* Диалог добавления пользователя */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Пайдаланушы қосу</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Аты"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Құпия сөз"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Рөлі"
                name="role"
                value={formData.role}
                onChange={handleFormChange}
              >
                <MenuItem value="user">Оқырман</MenuItem>
                <MenuItem value="librarian">Кітапханашы</MenuItem>
                <MenuItem value="admin">Әкімші</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Факультет"
                name="faculty"
                value={formData.faculty}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Мамандық"
                name="specialization"
                value={formData.specialization}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Студент ID"
                name="studentId"
                value={formData.studentId}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Оқу жылы"
                name="year"
                value={formData.year}
                onChange={handleFormChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Бас тарту</Button>
          <Button onClick={handleAddUser} variant="contained" color="primary">Қосу</Button>
        </DialogActions>
      </Dialog>

      {/* Диалог редактирования пользователя */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Пайдаланушыны өңдеу</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Аты"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Жаңа құпия сөз (өзгертпеу үшін бос қалдырыңыз)"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Рөлі"
                name="role"
                value={formData.role}
                onChange={handleFormChange}
              >
                <MenuItem value="user">Оқырман</MenuItem>
                <MenuItem value="librarian">Кітапханашы</MenuItem>
                <MenuItem value="admin">Әкімші</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Факультет"
                name="faculty"
                value={formData.faculty}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Мамандық"
                name="specialization"
                value={formData.specialization}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Студент ID"
                name="studentId"
                value={formData.studentId}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Оқу жылы"
                name="year"
                value={formData.year}
                onChange={handleFormChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Бас тарту</Button>
          <Button onClick={handleEditUser} variant="contained" color="primary">Сақтау</Button>
        </DialogActions>
      </Dialog>

      {/* Диалог удаления пользователя */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Жоюды растау</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {selectedUser?.name} пайдаланушысын жоюға сенімдісіз бе? Бұл әрекетті болдырмау мүмкін емес.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Бас тарту</Button>
          <Button onClick={handleDeleteUser} color="error" autoFocus>
            Жою
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UsersPage;