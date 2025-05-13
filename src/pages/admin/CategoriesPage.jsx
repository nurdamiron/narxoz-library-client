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
  TablePagination,
  Snackbar,
  Alert,
  Chip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Book as BookIcon 
} from '@mui/icons-material';
import adminBookService from '../../services/adminBookService';
import PageHeader from '../../components/common/PageHeader';
import { useTranslation } from 'react-i18next';

/**
 * Кітап санаттарын басқару беті
 */
const CategoriesPage = () => {
  const { t } = useTranslation();
  // Күй айнымалылары
  const [categories, setCategories] = useState([]);
  const [bookCounts, setBookCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Компонент монтаждалған кезде санаттарды жүктеу
  useEffect(() => {
    fetchCategories();
    fetchCategoryStats();
  }, []);

  /**
   * Санаттар тізімін жүктеу
   */
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await adminBookService.getCategories();
      
      if (response.success) {
        setCategories(response.data);
      } else {
        showSnackbar(t('admin.categoriesLoadError', 'Санаттар тізімін жүктеу қатесі'), 'error');
      }
    } catch (error) {
      console.error(t('admin.errorFetchingCategories', 'Error fetching categories:'), error);
      showSnackbar(t('admin.categoriesLoadError', 'Санаттар тізімін жүктеу қатесі'), 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Санаттар статистикасын жүктеу (кітаптар саны)
   */
  const fetchCategoryStats = async () => {
    try {
      const response = await adminBookService.getCategoryStats();
      
      if (response.success) {
        // Санаттар бойынша кітаптар санының нәтижесін өңдеу
        const counts = {};
        response.data.forEach(cat => {
          counts[cat.id] = cat.bookCount;
        });
        setBookCounts(counts);
      }
    } catch (error) {
      console.error(t('admin.errorFetchingCategoryStats', 'Error fetching category stats:'), error);
    }
  };

  /**
   * Форма өрістерінің өзгерісін өңдеу
   */
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Санат қосу функциясы
   */
  const handleAddCategory = async () => {
    try {
      if (!formData.name.trim()) return;
      
      setLoading(true);
      const response = await adminBookService.createCategory(formData);
      
      if (response.success) {
        showSnackbar(t('admin.categoryAddSuccess', 'Санат сәтті қосылды'), 'success');
        fetchCategories();
        setOpenAddDialog(false);
        resetForm();
      } else {
        showSnackbar(t('admin.categoryAddError', 'Санат қосу қатесі'), 'error');
      }
    } catch (error) {
      console.error(t('admin.errorCreatingCategory', 'Error creating category:'), error);
      showSnackbar(t('admin.categoryAddError', 'Санат қосу қатесі'), 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Санатты өңдеу функциясы
   */
  const handleEditCategory = async () => {
    try {
      if (!selectedCategory || !formData.name.trim()) return;
      
      setLoading(true);
      const response = await adminBookService.updateCategory(
        selectedCategory.id, 
        formData
      );
      
      if (response.success) {
        showSnackbar(t('admin.categoryUpdateSuccess', 'Санат сәтті жаңартылды'), 'success');
        fetchCategories();
        setOpenEditDialog(false);
        resetForm();
      } else {
        showSnackbar(t('admin.categoryUpdateError', 'Санатты жаңарту қатесі'), 'error');
      }
    } catch (error) {
      console.error(t('admin.errorUpdatingCategory', 'Error updating category:'), error);
      showSnackbar(t('admin.categoryUpdateError', 'Санатты жаңарту қатесі'), 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Санатты жою функциясы
   */
  const handleDeleteCategory = async () => {
    try {
      if (!selectedCategory) return;
      
      setLoading(true);
      const response = await adminBookService.deleteCategory(selectedCategory.id);
      
      if (response.success) {
        showSnackbar(t('admin.categoryDeleteSuccess', 'Санат сәтті жойылды'), 'success');
        fetchCategories();
        fetchCategoryStats();
        setOpenDeleteDialog(false);
      } else {
        showSnackbar(
          t('admin.categoryDeleteError', { message: response.message || t('admin.unknownError', 'Белгісіз қате') }, 'Санатты жою қатесі: {{message}}'), 
          'error'
        );
      }
    } catch (error) {
      console.error(t('admin.errorDeletingCategory', 'Error deleting category:'), error);
      showSnackbar(
        t('admin.categoryDeleteError', { message: error.message || t('admin.unknownError', 'Белгісіз қате') }, 'Санатты жою қатесі: {{message}}'), 
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Санатты өңдеу диалогын ашу
   */
  const openEditCategoryDialog = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name || '',
      description: category.description || ''
    });
    setOpenEditDialog(true);
  };
  
  /**
   * Санатты жою диалогын ашу
   */
  const openDeleteCategoryDialog = (category) => {
    setSelectedCategory(category);
    setOpenDeleteDialog(true);
  };
  
  /**
   * Форма сбросын өңдеушісі
   */
  const resetForm = () => {
    setFormData({
      name: '',
      description: ''
    });
  };
  
  /**
   * Бет ауысуын өңдеу
   */
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  /**
   * Бет өлшемін өзгертуді өңдеу
   */
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  /**
   * Snackbar көрсетеді
   */
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };
  
  /**
   * Snackbar жабады
   */
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <Container maxWidth="xl">
      <PageHeader 
        title={t('admin.categories', 'Категории')} 
        subtitle={t('admin.categoriesManagement', 'Управление категориями книг библиотеки')} 
      />
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">{t('admin.categoriesList', 'Список категорий')}</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              resetForm();
              setOpenAddDialog(true);
            }}
          >
            {t('admin.addCategory', 'Добавить категорию')}
          </Button>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('admin.id', 'ID')}</TableCell>
                <TableCell>{t('admin.name', 'Название')}</TableCell>
                <TableCell>{t('admin.description', 'Описание')}</TableCell>
                <TableCell>{t('admin.booksCount', 'Кол-во книг')}</TableCell>
                <TableCell>{t('admin.actions', 'Действия')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {t('common.loading', 'Загрузка...')}
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {t('admin.noCategories', 'Нет категорий')}
                  </TableCell>
                </TableRow>
              ) : (
                categories
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.id}</TableCell>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell>
                        <Chip
                          icon={<BookIcon />}
                          label={bookCounts[category.id] || 0}
                          color={bookCounts[category.id] > 0 ? 'primary' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => openEditCategoryDialog(category)}
                          title={t('common.edit', 'Редактировать')}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => openDeleteCategoryDialog(category)}
                          title={t('common.delete', 'Удалить')}
                          disabled={bookCounts[category.id] > 0}
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
          count={categories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t('pagination.rowsPerPage', 'Строк на странице:')}
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} ${t('pagination.of', 'из')} ${count}`
          }
        />
      </Paper>
      
      {/* Диалог добавления категории */}
      <Dialog 
        open={openAddDialog} 
        onClose={() => setOpenAddDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t('admin.addCategory', 'Добавить категорию')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('admin.name', 'Название')}
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
                autoFocus
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('admin.description', 'Описание')}
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                multiline
                rows={3}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>
            {t('common.cancel', 'Отмена')}
          </Button>
          <Button 
            onClick={handleAddCategory} 
            variant="contained" 
            color="primary"
            disabled={!formData.name.trim()}
          >
            {t('common.add', 'Добавить')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Диалог редактирования категории */}
      <Dialog 
        open={openEditDialog} 
        onClose={() => setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t('admin.editCategory', 'Редактировать категорию')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('admin.name', 'Название')}
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
                autoFocus
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('admin.description', 'Описание')}
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                multiline
                rows={3}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>
            {t('common.cancel', 'Отмена')}
          </Button>
          <Button 
            onClick={handleEditCategory} 
            variant="contained" 
            color="primary"
            disabled={!formData.name.trim()}
          >
            {t('common.save', 'Сохранить')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Диалог удаления категории */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>{t('admin.deleteCategory', 'Удалить категорию')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('admin.deleteCategoryConfirm', { name: selectedCategory?.name }, 'Вы уверены, что хотите удалить категорию "{{name}}"? Это действие нельзя будет отменить.')}
          </DialogContentText>
          {bookCounts[selectedCategory?.id] > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              {t('admin.categoryHasBooks', { count: bookCounts[selectedCategory?.id] }, 'Эта категория содержит {{count}} книг. Сначала переместите книги в другую категорию.')}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            {t('common.cancel', 'Отмена')}
          </Button>
          <Button 
            onClick={handleDeleteCategory} 
            color="error"
            disabled={bookCounts[selectedCategory?.id] > 0}
          >
            {t('common.delete', 'Удалить')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar для уведомлений */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CategoriesPage;