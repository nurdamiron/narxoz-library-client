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
  TablePagination,
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
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Image as ImageIcon } from '@mui/icons-material';
import adminBookService from '../../services/adminBookService';
import PageHeader from '../../components/common/PageHeader';

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openCoverDialog, setOpenCoverDialog] = useState(false);
  const [coverFile, setCoverFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    isbn: '',
    publishYear: '',
    publisher: '',
    totalCopies: 1,
    availableCopies: 1,
    categoryId: '',
    language: 'Казахский'
  });

  // Кітаптар мен категорияларды жүктеу компонент монтаждалған кезде
  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  // Кітаптар тізімін жүктеу функциясы
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await adminBookService.getBooks();
      if (response && response.data) {
        setBooks(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Кітаптарды жүктеу қатесі:', error);
      setLoading(false);
    }
  };

  // Категорияларды жүктеу функциясы
  const fetchCategories = async () => {
    try {
      const response = await adminBookService.getCategories();
      if (response && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Категорияларды жүктеу қатесі:', error);
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

  // Мұқаба жүктеу өңдеушісі
  const handleCoverChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCoverFile(e.target.files[0]);
    }
  };

  // Кітап қосу өңдеушісі
  const handleAddBook = async () => {
    try {
      const response = await adminBookService.createBook(formData);
      if (response && response.data) {
        fetchBooks();
        setOpenAddDialog(false);
        resetForm();
      }
    } catch (error) {
      console.error('Кітап құру қатесі:', error);
    }
  };

  // Кітапты өңдеу өңдеушісі
  const handleEditBook = async () => {
    try {
      if (!selectedBook) return;
      
      const response = await adminBookService.updateBook(selectedBook.id, formData);
      if (response && response.data) {
        fetchBooks();
        setOpenEditDialog(false);
        resetForm();
      }
    } catch (error) {
      console.error('Кітапты жаңарту қатесі:', error);
    }
  };

  // Кітапты жою өңдеушісі
  const handleDeleteBook = async () => {
    try {
      if (!selectedBook) return;
      
      const response = await adminBookService.deleteBook(selectedBook.id);
      if (response && response.success) {
        fetchBooks();
        setOpenDeleteDialog(false);
      }
    } catch (error) {
      console.error('Кітапты жою қатесі:', error);
    }
  };

  // Мұқаба жүктеу өңдеушісі
  const handleUploadCover = async () => {
    try {
      if (!selectedBook || !coverFile) return;
      
      const response = await adminBookService.uploadBookCover(selectedBook.id, coverFile);
      if (response && response.data) {
        fetchBooks();
        setOpenCoverDialog(false);
        setCoverFile(null);
      }
    } catch (error) {
      console.error('Мұқаба жүктеу қатесі:', error);
    }
  };

  // Открытие диалога редактирования
  const openEditBookDialog = (book) => {
    setSelectedBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description || '',
      isbn: book.isbn,
      publishYear: book.publishYear,
      publisher: book.publisher,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      categoryId: book.categoryId,
      language: book.language
    });
    setOpenEditDialog(true);
  };

  // Открытие диалога загрузки обложки
  const openUploadCoverDialog = (book) => {
    setSelectedBook(book);
    setOpenCoverDialog(true);
  };

  // Открытие диалога удаления
  const openDeleteBookDialog = (book) => {
    setSelectedBook(book);
    setOpenDeleteDialog(true);
  };

  // Сброс формы
  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      description: '',
      isbn: '',
      publishYear: '',
      publisher: '',
      totalCopies: 1,
      availableCopies: 1,
      categoryId: '',
      language: 'Казахский'
    });
    setSelectedBook(null);
  };

  return (
    <Container maxWidth="lg">
      <PageHeader 
        title="Кітаптарды басқару" 
        subtitle="Кітапханадағы кітаптарды қарау, қосу, өңдеу және жою"
      />

      <Paper elevation={3} sx={{ mb: 4, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Кітаптар каталогы</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => setOpenAddDialog(true)}
          >
            Кітап қосу
          </Button>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="books table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Мұқаба</TableCell>
                <TableCell>Атауы</TableCell>
                <TableCell>Автор</TableCell>
                <TableCell>Категория</TableCell>
                <TableCell>Даналары</TableCell>
                <TableCell>Қолжетімді</TableCell>
                <TableCell>Әрекеттер</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">Жүктелуде...</TableCell>
                </TableRow>
              ) : books.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">Кітаптар табылмады</TableCell>
                </TableRow>
              ) : (
                books
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>{book.id}</TableCell>
                      <TableCell>
                        <Box 
                          component="img" 
                          src={book.coverUrl || 'https://via.placeholder.com/50x75?text=No+Cover'} 
                          alt={book.title}
                          sx={{ width: 50, height: 75, objectFit: 'cover' }}
                        />
                      </TableCell>
                      <TableCell>{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>{book.category?.name}</TableCell>
                      <TableCell>{book.totalCopies}</TableCell>
                      <TableCell>
                        <Chip 
                          label={book.availableCopies} 
                          color={book.availableCopies > 0 ? 'success' : 'error'} 
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          aria-label="upload cover" 
                          color="secondary"
                          onClick={() => openUploadCoverDialog(book)}
                        >
                          <ImageIcon />
                        </IconButton>
                        <IconButton 
                          aria-label="edit" 
                          color="primary"
                          onClick={() => openEditBookDialog(book)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          aria-label="delete" 
                          color="error"
                          onClick={() => openDeleteBookDialog(book)}
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
          count={books.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Кітап қосу диалогы */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Кітап қосу</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Атауы"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Авторы"
                name="author"
                value={formData.author}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Сипаттамасы"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ISBN"
                name="isbn"
                value={formData.isbn}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Баспа"
                name="publisher"
                value={formData.publisher}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Басылым жылы"
                name="publishYear"
                type="number"
                value={formData.publishYear}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="category-select-label">Категория</InputLabel>
                <Select
                  labelId="category-select-label"
                  label="Категория"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleFormChange}
                  required
                >
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Тілі"
                name="language"
                value={formData.language}
                onChange={handleFormChange}
                select
              >
                <MenuItem value="Казахский">Қазақша</MenuItem>
                <MenuItem value="Русский">Орысша</MenuItem>
                <MenuItem value="Английский">Ағылшынша</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Барлық даналары"
                name="totalCopies"
                type="number"
                value={formData.totalCopies}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Қолжетімді даналары"
                name="availableCopies"
                type="number"
                value={formData.availableCopies}
                onChange={handleFormChange}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Болдырмау</Button>
          <Button onClick={handleAddBook} variant="contained" color="primary">Қосу</Button>
        </DialogActions>
      </Dialog>

      {/* Кітапты өңдеу диалогы */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Кітапты өңдеу</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Атауы"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Авторы"
                name="author"
                value={formData.author}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Сипаттамасы"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ISBN"
                name="isbn"
                value={formData.isbn}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Баспа"
                name="publisher"
                value={formData.publisher}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Басылым жылы"
                name="publishYear"
                type="number"
                value={formData.publishYear}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="category-select-label">Категория</InputLabel>
                <Select
                  labelId="category-select-label"
                  label="Категория"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleFormChange}
                  required
                >
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Тілі"
                name="language"
                value={formData.language}
                onChange={handleFormChange}
                select
              >
                <MenuItem value="Казахский">Қазақша</MenuItem>
                <MenuItem value="Русский">Орысша</MenuItem>
                <MenuItem value="Английский">Ағылшынша</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Барлық даналары"
                name="totalCopies"
                type="number"
                value={formData.totalCopies}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Қолжетімді даналары"
                name="availableCopies"
                type="number"
                value={formData.availableCopies}
                onChange={handleFormChange}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Болдырмау</Button>
          <Button onClick={handleEditBook} variant="contained" color="primary">Сақтау</Button>
        </DialogActions>
      </Dialog>

      {/* Кітап мұқабасын жүктеу диалогы */}
      <Dialog open={openCoverDialog} onClose={() => setOpenCoverDialog(false)}>
        <DialogTitle>Кітап мұқабасын жүктеу</DialogTitle>
        <DialogContent>
          <DialogContentText>
            "{selectedBook?.title}" кітабының мұқабасы үшін суретті таңдаңыз
          </DialogContentText>
          <Box sx={{ mt: 2 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="cover-upload"
              type="file"
              onChange={handleCoverChange}
            />
            <label htmlFor="cover-upload">
              <Button 
                variant="outlined" 
                component="span" 
                startIcon={<ImageIcon />}
              >
                Суретті таңдау
              </Button>
            </label>
            {coverFile && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Таңдалған: {coverFile.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCoverDialog(false)}>Болдырмау</Button>
          <Button 
            onClick={handleUploadCover} 
            variant="contained" 
            color="primary"
            disabled={!coverFile}
          >
            Жүктеу
          </Button>
        </DialogActions>
      </Dialog>

      {/* Кітапты жою диалогы */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Жоюды растау</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            "{selectedBook?.title}" кітабын жоюға сенімдісіз бе? Бұл әрекетті болдырмау мүмкін емес.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Болдырмау</Button>
          <Button onClick={handleDeleteBook} color="error" autoFocus>
            Жою
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BooksPage;