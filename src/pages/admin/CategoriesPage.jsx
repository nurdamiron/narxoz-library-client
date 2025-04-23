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

/**
 * Кітап санаттарын басқару беті
 */
const CategoriesPage = () => {
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
        showSnackbar('Санаттар тізімін жүктеу қатесі', 'error');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      showSnackbar('Санаттар тізімін жүктеу қатесі', 'error');
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
      console.error('Error fetching category stats:', error);
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
        showSnackbar('Санат сәтті қосылды', 'success');
        fetchCategories();
        setOpenAddDialog(false);
        resetForm();
      } else {
        showSnackbar('Санат қосу қатесі', 'error');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      showSnackbar('Санат қосу қатесі', 'error');
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
        showSnackbar('Санат сәтті жаңартылды', 'success');
        fetchCategories();
        setOpenEditDialog(false);
        resetForm();
      } else {
        showSnackbar('Санатты жаңарту қатесі', 'error');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      showSnackbar('Санатты жаңарту қатесі', 'error');
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
        showSnackbar('Санат сәтті жойылды', 'success');
        fetchCategories();
        fetchCategoryStats();
        setOpenDeleteDialog(false);
      } else {
        showSnackbar('Санатты жою қатесі: ' + (response.message || 'Белгісіз қате'), 'error');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      showSnackbar('Санатты жою қатесі: ' + (error.message || 'Белгісіз қате'), 'error');
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
      name: category.name,
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
   * Форманы қалпына келтіру
   */
  const resetForm = () => {
    setFormData({
      name: '',
      description: ''
    });
    setSelectedCategory(null);
  };

  /**
   * Бет айналымын өңдеу
   */
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  /**
   * Беттегі жолдар санын өзгерту
   */
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /**
   * Snackbar хабарландыруын көрсету
   */
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  /**
   * Snackbar хабарландыруын жабу
   */
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <Container maxWidth="lg">
      <PageHeader 
        title="Санаттарды басқару" 
        subtitle="Кітап санаттарын қарау, қосу, өңдеу және жою"
      />

      <Paper elevation={3} sx={{ mb: 4, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Санаттар тізімі</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => setOpenAddDialog(true)}
          >
            Санат қосу
          </Button>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="categories table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Атауы</TableCell>
                <TableCell>Сипаттама</TableCell>
                <TableCell>Кітаптар саны</TableCell>
                <TableCell>Әрекеттер</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">Жүктелуде...</TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">Санаттар табылмады</TableCell>
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
                          color="primary" 
                          size="small" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          aria-label="edit" 
                          color="primary"
                          onClick={() => openEditCategoryDialog(category)}
                          title="Өңдеу"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          aria-label="delete" 
                          color="error"
                          onClick={() => openDeleteCategoryDialog(category)}
                          title="Жою"
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
          labelRowsPerPage="Бет сайын:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
        />
      </Paper>

      {/* Санат қосу диалогы */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Санат қосу</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Атауы"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Сипаттама"
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
          <Button onClick={() => setOpenAddDialog(false)}>Бас тарту</Button>
          <Button 
            onClick={handleAddCategory} 
            variant="contained" 
            color="primary"
            disabled={!formData.name.trim()}
          >
            Қосу
          </Button>
        </DialogActions>
      </Dialog>

      {/* Санатты өңдеу диалогы */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Санатты өңдеу</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Атауы"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Сипаттама"
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
          <Button onClick={() => setOpenEditDialog(false)}>Бас тарту</Button>
          <Button 
            onClick={handleEditCategory} 
            variant="contained" 
            color="primary" 
            disabled={!formData.name.trim()}
          >
            Сақтау
          </Button>
        </DialogActions>
      </Dialog>

      {/* Санатты жою диалогы */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Жоюды растау</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            "{selectedCategory?.name}" санатын жоюға сенімдісіз бе? 
            Бұл әрекетті болдырмау мүмкін емес.
            
            {bookCounts[selectedCategory?.id] > 0 && (
              <Box component="div" sx={{ mt: 2, color: 'error.main' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  Бұл санатқа {bookCounts[selectedCategory?.id]} кітап жатады.
                  Алдымен бұл кітаптарды басқа санатқа жатқызу керек.
                </Typography>
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Бас тарту</Button>
          <Button 
            onClick={handleDeleteCategory} 
            color="error" 
            autoFocus
            disabled={bookCounts[selectedCategory?.id] > 0}
          >
            Жою
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar хабарландыруы */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CategoriesPage;