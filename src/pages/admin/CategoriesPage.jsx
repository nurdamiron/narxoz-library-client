import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Container,
  TextField,
  Grid,
  TablePagination
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import adminBookService from '../../services/adminBookService';
import PageHeader from '../../components/common/PageHeader';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // Загрузка категорий при монтировании компонента
  useEffect(() => {
    fetchCategories();
  }, []);

  // Функция для загрузки списка категорий
  const fetchCategories = async () => {
    try {
      setLoading(true);
      // В реальном приложении использовали бы API, сейчас используем моки
      setTimeout(() => {
        const mockCategories = [
          { 
            id: 1, 
            name: 'Көркем әдебиет', 
            description: 'Романдар, әңгімелер, поэзия және көркем әдебиеттің басқа түрлері' 
          },
          { 
            id: 2, 
            name: 'Оқулықтар', 
            description: 'Оқу процесіне арналған оқулықтар мен оқу құралдары' 
          },
          { 
            id: 3, 
            name: 'Ғылыми әдебиет', 
            description: 'Ғылыми зерттеулер, академиялық жұмыстар және ғылыми мақалалар' 
          },
          { 
            id: 4, 
            name: 'Анықтамалықтар', 
            description: 'Сөздіктер, энциклопедиялар және басқа анықтамалық материалдар' 
          },
          { 
            id: 5, 
            name: 'Бизнес және экономика', 
            description: 'Бизнес, экономика, қаржы және менеджмент бойынша кітаптар' 
          }
        ];
        setCategories(mockCategories);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  // Обработчик изменения полей формы
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Обработчик добавления категории
  const handleAddCategory = async () => {
    try {
      // В реальном приложении использовали бы adminBookService.createCategory(formData)
      console.log('Creating new category:', formData);
      fetchCategories();
      setOpenAddDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  // Обработчик редактирования категории
  const handleEditCategory = async () => {
    try {
      if (!selectedCategory) return;
      
      // В реальном приложении использовали бы adminBookService.updateCategory(selectedCategory.id, formData)
      console.log('Updating category:', selectedCategory.id, formData);
      fetchCategories();
      setOpenEditDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  // Обработчик удаления категории
  const handleDeleteCategory = async () => {
    try {
      if (!selectedCategory) return;
      
      // В реальном приложении использовали бы adminBookService.deleteCategory(selectedCategory.id)
      console.log('Deleting category:', selectedCategory.id);
      fetchCategories();
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // Открытие диалога редактирования
  const openEditCategoryDialog = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setOpenEditDialog(true);
  };

  // Открытие диалога удаления
  const openDeleteCategoryDialog = (category) => {
    setSelectedCategory(category);
    setOpenDeleteDialog(true);
  };

  // Сброс формы
  const resetForm = () => {
    setFormData({
      name: '',
      description: ''
    });
    setSelectedCategory(null);
  };

  return (
    <Container maxWidth="lg">
      <PageHeader 
        title="Управление категориями" 
        subtitle="Просмотр, добавление, редактирование и удаление категорий книг"
      />

      <Paper elevation={3} sx={{ mb: 4, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Список категорий</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => setOpenAddDialog(true)}
          >
            Добавить категорию
          </Button>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="categories table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Название</TableCell>
                <TableCell>Описание</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">Загрузка...</TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">Категории не найдены</TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.id}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>
                      <IconButton 
                        aria-label="edit" 
                        color="primary"
                        onClick={() => openEditCategoryDialog(category)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        aria-label="delete" 
                        color="error"
                        onClick={() => openDeleteCategoryDialog(category)}
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
      </Paper>

      {/* Диалог добавления категории */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Добавить категорию</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Название"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Описание"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Отмена</Button>
          <Button 
            onClick={handleAddCategory} 
            variant="contained" 
            color="primary"
            disabled={!formData.name.trim()}
          >
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог редактирования категории */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Редактировать категорию</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Название"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Описание"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Отмена</Button>
          <Button 
            onClick={handleEditCategory} 
            variant="contained" 
            color="primary" 
            disabled={!formData.name.trim()}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог удаления категории */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Подтверждение удаления</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Вы уверены, что хотите удалить категорию "{selectedCategory?.name}"? 
            Это действие невозможно отменить. Все книги, связанные с этой категорией, 
            будут отображаться без категории.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Отмена</Button>
          <Button onClick={handleDeleteCategory} color="error" autoFocus>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CategoriesPage;