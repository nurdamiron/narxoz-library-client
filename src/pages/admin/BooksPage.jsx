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
  Select,
  Alert,
  AlertTitle,
  CircularProgress,
  Divider
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Image as ImageIcon, Warning as WarningIcon } from '@mui/icons-material';
import adminBookService from '../../services/adminBookService';
import PageHeader from '../../components/common/PageHeader';
import BookCoverPreview from '../../components/admin/BookCoverPreview';
import { useToast } from '../../context/ToastContext';
import { translateError } from '../../utils/errorMessages';

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
  const [formError, setFormError] = useState('');
  const [coverError, setCoverError] = useState('');
  const [addBookLoading, setAddBookLoading] = useState(false);
  const [editBookLoading, setEditBookLoading] = useState(false);
  const [deleteBookLoading, setDeleteBookLoading] = useState(false);
  const [uploadCoverLoading, setUploadCoverLoading] = useState(false);
  const { success, error: showError } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    publisher: '',
    publishYear: '',
    totalCopies: 1,
    availableCopies: 1,
    categoryId: '',
    language: 'Казахский'
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [newBookCoverFile, setNewBookCoverFile] = useState(null);
  const [newBookCoverError, setNewBookCoverError] = useState('');
  const [uploadingNewBookCover, setUploadingNewBookCover] = useState(false);

  const [editBookCoverFile, setEditBookCoverFile] = useState(null);
  const [editBookCoverError, setEditBookCoverError] = useState('');
  const [uploadingEditBookCover, setUploadingEditBookCover] = useState(false);

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
        // Добавляем coverUrl для каждой книги
        const booksWithCovers = response.data.map(book => ({
          ...book,
          coverUrl: book.cover || book.coverUrl || 'https://via.placeholder.com/50x75?text=No+Cover'
        }));
        setBooks(booksWithCovers);
      }
    } catch (error) {
      console.error('Кітаптарды жүктеу қатесі:', error);
      showError('Кітаптарды жүктеу кезінде қате орын алды');
    } finally {
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
      showError('Категорияларды жүктеу кезінде қате орын алды');
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
    
    // Для числовых полей разрешаем только числа (без букв и спецсимволов)
    if (name === 'publishYear' || name === 'totalCopies' || name === 'availableCopies') {
      // Проверка, является ли вводимое значение числом или пустой строкой
      if (value === '' || /^\d+$/.test(value)) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
      // Если не число, не обновляем состояние (игнорируем ввод)
    } else {
      // Для нечисловых полей обычное обновление
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Мұқаба жүктеу өңдеушісі
  const handleCoverChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Проверка размера файла (макс. 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setCoverError('Файл өлшемі 5MB-дан аспауы керек');
        return;
      }
      
      // Проверка типа файла
      if (!file.type.startsWith('image/')) {
        setCoverError('Тек сурет файлдарын жүктеуге рұқсат етілген (JPEG, PNG, GIF)');
        return;
      }
      
      setCoverError(''); // Сбросить ошибку, если файл корректный
      setCoverFile(file);
    }
  };

  // Обработчик файла обложки для новой книги
  const handleNewBookCoverChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Проверка размера файла (макс. 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setNewBookCoverError('Файл өлшемі 5MB-дан аспауы керек');
        return;
      }
      
      // Проверка типа файла
      if (!file.type.startsWith('image/')) {
        setNewBookCoverError('Тек сурет файлдарын жүктеуге рұқсат етілген (JPEG, PNG, GIF)');
        return;
      }
      
      setNewBookCoverError(''); // Сбросить ошибку, если файл корректный
      setNewBookCoverFile(file);
    }
  };

  // Обработчик файла обложки для редактируемой книги
  const handleEditBookCoverChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Проверка размера файла (макс. 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setEditBookCoverError('Файл өлшемі 5MB-дан аспауы керек');
        return;
      }
      
      // Проверка типа файла
      if (!file.type.startsWith('image/')) {
        setEditBookCoverError('Тек сурет файлдарын жүктеуге рұқсат етілген (JPEG, PNG, GIF)');
        return;
      }
      
      setEditBookCoverError(''); // Сбросить ошибку, если файл корректный
      setEditBookCoverFile(file);
    }
  };

  // Сброс формы
  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      description: '',
      publisher: '',
      publishYear: '',
      totalCopies: 1,
      availableCopies: 1,
      categoryId: '',
      language: 'Казахский'
    });
    setSelectedBook(null);
    setFormError('');
    setFieldErrors({});
    setNewBookCoverFile(null);
    setNewBookCoverError('');
    setEditBookCoverFile(null);
    setEditBookCoverError('');
  };

  // Открытие диалога создания книги
  const openAddBookDialog = () => {
    resetForm();
    setOpenAddDialog(true);
  };

  // Кітап қосу өңдеушісі
  const handleAddBook = async () => {
    try {
      setFormError('');
      setFieldErrors({});
      setAddBookLoading(true);
      
      console.log('🔍 Кітап құру деректерін тексеру:', formData);
      
      // Проверка обязательных полей перед отправкой на сервер
      const requiredFields = [
        { field: 'title', label: 'Кітаптың атауы' },
        { field: 'author', label: 'Автор' },
        { field: 'categoryId', label: 'Категория' },
        { field: 'description', label: 'Сипаттама' },
        { field: 'publishYear', label: 'Басылым жылы' },
        { field: 'language', label: 'Тіл' }
      ];
      
      const errors = {};
      let hasErrors = false;
      
      requiredFields.forEach(({ field, label }) => {
        if (!formData[field] || formData[field] === '') {
          errors[field] = `${label} міндетті өріс`;
          hasErrors = true;
        }
      });
      
      // Проверка числовых полей
      if (formData.publishYear && isNaN(parseInt(formData.publishYear))) {
        errors.publishYear = 'Басылым жылы сан болуы керек';
        hasErrors = true;
      }
      
      if (isNaN(parseInt(formData.totalCopies)) || parseInt(formData.totalCopies) < 0) {
        errors.totalCopies = 'Даналар саны оң сан болуы керек';
        hasErrors = true;
      }
      
      if (isNaN(parseInt(formData.availableCopies)) || parseInt(formData.availableCopies) < 0) {
        errors.availableCopies = 'Қолжетімді даналар саны оң сан болуы керек';
        hasErrors = true;
      }
      
      if (parseInt(formData.availableCopies) > parseInt(formData.totalCopies)) {
        errors.availableCopies = 'Қолжетімді даналар саны жалпы саннан аспауы керек';
        hasErrors = true;
      }
      
      if (hasErrors) {
        console.error('❌ Форма қателері табылды:', errors);
        setFieldErrors(errors);
        setFormError('Формадағы қателерді түзетіңіз');
        return;
      }
      
      console.log('✅ Форма тексеруден өтті, серверге сұраныс жіберу...');
      
      const response = await adminBookService.createBook(formData);
      
      if (response && response.success) {
        const newBookId = response.data.id;
        console.log(`✅ Кітап сәтті құрылды, ID: ${newBookId}`);
        
        // Если выбрана обложка, загружаем её (всегда локально)
        if (newBookCoverFile) {
          console.log(`📤 ID: ${newBookId} кітабына мұқаба жүктеу басталды`);
          setUploadingNewBookCover(true);
          try {
            const coverResponse = await adminBookService.uploadBookCover(newBookId, newBookCoverFile);
            if (!coverResponse.success) {
              console.error('❌ Мұқаба жүктеу қатесі:', coverResponse.message);
              showError(`Кітап сәтті құрылды, бірақ мұқабаны жүктеу кезінде қате орын алды: ${coverResponse.message}`);
            } else {
              console.log('✅ Мұқаба сәтті жүктелді');
            }
          } catch (coverError) {
            console.error('❌ Мұқаба жүктеу қатесі:', coverError);
            showError('Кітап құрылды, бірақ мұқабаны жүктеу сәтсіз аяқталды');
          } finally {
            setUploadingNewBookCover(false);
          }
        }
        
        success(`"${formData.title}" кітабы сәтті құрылды`);
        fetchBooks();
        setOpenAddDialog(false);
        resetForm();
      } else if (response && !response.success) {
        console.error('❌ Кітап құру қатесі:', response.message);
        
        // Обработка ошибок валидации с сервера
        if (response.validationErrors && Array.isArray(response.validationErrors)) {
          const serverErrors = {};
          response.validationErrors.forEach(error => {
            if (error.field) {
              serverErrors[error.field] = error.message || error.msg;
            }
          });
          console.error('❌ Сервер валидация қателері:', serverErrors);
          setFieldErrors(serverErrors);
        }
        
        setFormError(response.message || 'Кітап құру кезінде қате орын алды');
      }
    } catch (error) {
      console.error('❌ Кітап құру кезінде күтпеген қате:', error);
      
      // Обработка ошибки
      if (error.message) {
        setFormError(error.message);
      } else if (error.validationErrors) {
        const serverErrors = {};
        error.validationErrors.forEach(err => {
          if (err.field) {
            serverErrors[err.field] = err.message || err.msg;
          }
        });
        setFieldErrors(serverErrors);
        setFormError('Мәліметтерді тексеріңіз. Кейбір өрістер жарамсыз.');
      } else {
        setFormError('Кітап құру кезінде қате орын алды. Қайталап көріңіз.');
      }
      
      showError('Кітапты құру сәтсіз аяқталды');
    } finally {
      setAddBookLoading(false);
    }
  };

  // Кітапты өңдеу өңдеушісі
  const handleEditBook = async () => {
    try {
      if (!selectedBook) return;
      
      setFormError('');
      setFieldErrors({});
      setEditBookLoading(true);
      
      console.log('🔍 Кітап өңдеу деректерін тексеру:', formData);
      
      // Проверка обязательных полей
      const requiredFields = [
        { field: 'title', label: 'Кітаптың атауы' },
        { field: 'author', label: 'Автор' },
        { field: 'categoryId', label: 'Категория' },
        { field: 'description', label: 'Сипаттама' },
        { field: 'publishYear', label: 'Басылым жылы' },
        { field: 'language', label: 'Тіл' }
      ];
      
      const errors = {};
      let hasErrors = false;
      
      requiredFields.forEach(({ field, label }) => {
        if (!formData[field] || formData[field] === '') {
          errors[field] = `${label} міндетті өріс`;
          hasErrors = true;
        }
      });
      
      // Проверка числовых полей
      if (formData.publishYear && isNaN(parseInt(formData.publishYear))) {
        errors.publishYear = 'Басылым жылы сан болуы керек';
        hasErrors = true;
      }
      
      if (isNaN(parseInt(formData.totalCopies)) || parseInt(formData.totalCopies) < 0) {
        errors.totalCopies = 'Даналар саны оң сан болуы керек';
        hasErrors = true;
      }
      
      if (isNaN(parseInt(formData.availableCopies)) || parseInt(formData.availableCopies) < 0) {
        errors.availableCopies = 'Қолжетімді даналар саны оң сан болуы керек';
        hasErrors = true;
      }
      
      if (parseInt(formData.availableCopies) > parseInt(formData.totalCopies)) {
        errors.availableCopies = 'Қолжетімді даналар саны жалпы саннан аспауы керек';
        hasErrors = true;
      }
      
      if (hasErrors) {
        console.error('❌ Форма қателері табылды:', errors);
        setFieldErrors(errors);
        setFormError('Формадағы қателерді түзетіңіз');
        return;
      }
      
      console.log('✅ Форма тексеруден өтті, серверге сұраныс жіберу...');
      
      // Обновление данных книги
      const response = await adminBookService.updateBook(selectedBook.id, formData);
      
      if (response && response.success) {
        console.log(`✅ Кітап сәтті жаңартылды, ID: ${selectedBook.id}`);
        
        // Если выбрана новая обложка, загружаем её (всегда локально)
        if (editBookCoverFile) {
          console.log(`📤 ID: ${selectedBook.id} кітабына жаңа мұқаба жүктеу басталды`);
          setUploadingEditBookCover(true);
          try {
            const coverResponse = await adminBookService.uploadBookCover(selectedBook.id, editBookCoverFile);
            if (!coverResponse.success) {
              console.error('❌ Мұқаба жүктеу қатесі:', coverResponse.message);
              showError(`Кітап сәтті жаңартылды, бірақ мұқабаны жүктеу кезінде қате орын алды: ${coverResponse.message}`);
            } else {
              console.log('✅ Жаңа мұқаба сәтті жүктелді');
            }
          } catch (coverError) {
            console.error('❌ Мұқаба жүктеу қатесі:', coverError);
            showError('Кітап жаңартылды, бірақ мұқабаны жүктеу сәтсіз аяқталды');
          } finally {
            setUploadingEditBookCover(false);
          }
        }
        
        success(`"${formData.title}" кітабы сәтті жаңартылды`);
        fetchBooks();
        setOpenEditDialog(false);
        resetForm();
      } else if (response && !response.success) {
        console.error('❌ Кітап жаңарту қатесі:', response.message);
        
        // Обработка ошибок валидации с сервера
        if (response.validationErrors && Array.isArray(response.validationErrors)) {
          const serverErrors = {};
          response.validationErrors.forEach(error => {
            if (error.field) {
              serverErrors[error.field] = error.message || error.msg;
            }
          });
          console.error('❌ Сервер валидация қателері:', serverErrors);
          setFieldErrors(serverErrors);
        }
        
        setFormError(response.message || 'Кітап жаңарту кезінде қате орын алды');
      }
    } catch (error) {
      console.error('❌ Кітапты жаңарту кезінде күтпеген қате:', error);
      
      // Обработка ошибки
      if (error.message) {
        setFormError(error.message);
      } else if (error.validationErrors) {
        const serverErrors = {};
        error.validationErrors.forEach(err => {
          if (err.field) {
            serverErrors[err.field] = err.message || err.msg;
          }
        });
        setFieldErrors(serverErrors);
        setFormError('Мәліметтерді тексеріңіз. Кейбір өрістер жарамсыз.');
      } else {
        setFormError('Кітапты жаңарту кезінде қате орын алды. Қайталап көріңіз.');
      }
      
      showError('Кітапты жаңарту сәтсіз аяқталды');
    } finally {
      setEditBookLoading(false);
    }
  };

  // Кітапты жою өңдеушісі
  const handleDeleteBook = async () => {
    try {
      if (!selectedBook) return;
      
      setDeleteBookLoading(true);
      const response = await adminBookService.deleteBook(selectedBook.id);
      
      if (response && response.success) {
        success(`"${selectedBook.title}" кітабы сәтті жойылды`);
        fetchBooks();
        setOpenDeleteDialog(false);
      }
    } catch (error) {
      console.error('Кітапты жою қатесі:', error);
      
      // Показать сообщение об ошибке
      let errorMessage = 'Кітапты жою кезінде қате орын алды';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      showError(errorMessage);
    } finally {
      setDeleteBookLoading(false);
    }
  };

  // Мұқаба жүктеу өңдеушісі
  const handleUploadCover = async () => {
    try {
      if (!selectedBook || !coverFile) {
        setCoverError('Мұқаба файлын таңдаңыз');
        return;
      }
      
      setCoverError('');
      setUploadCoverLoading(true);
      
      const response = await adminBookService.uploadBookCover(selectedBook.id, coverFile);
      
      if (response && response.success) {
        success(`"${selectedBook.title}" кітабының мұқабасы сәтті жүктелді`);
        fetchBooks();
        setOpenCoverDialog(false);
        setCoverFile(null);
      } else if (!response.success) {
        // Обработка неуспешного ответа
        setCoverError(response.message || 'Мұқаба жүктеу сәтсіз аяқталды');
      }
    } catch (error) {
      console.error('❌ Мұқаба жүктеу қатесі:', error);
      
      // Подробная обработка ошибки загрузки обложки
      if (error.message) {
        setCoverError(error.message);
      } else if (error.response && error.response.status === 400) {
        setCoverError('Жарамсыз файл форматы немесе өлшемі. JPG, PNG немесе GIF форматындағы 5MB-дан аспайтын сурет жүктеңіз.');
      } else {
        setCoverError('Мұқаба жүктеу кезінде қате орын алды. Қайталап көріңіз.');
      }
      
      showError('Мұқаба жүктеу сәтсіз аяқталды');
    } finally {
      setUploadCoverLoading(false);
    }
  };

  // Открытие диалога редактирования
  const openEditBookDialog = (book) => {
    // Добавляем URL обложки к выбранной книге для использования в диалоге
    setSelectedBook({
      ...book,
      coverUrl: getCoverUrl(book)
    });
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description || '',
      publisher: book.publisher,
      publishYear: book.publicationYear || book.publishYear,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      categoryId: book.categoryId,
      language: book.language
    });
    setEditBookCoverFile(null);
    setEditBookCoverError('');
    setFormError('');
    setOpenEditDialog(true);
  };

  // Открытие диалога загрузки обложки
  const openUploadCoverDialog = (book) => {
    // Добавляем URL обложки к выбранной книге для использования в диалоге
    setSelectedBook({
      ...book,
      coverUrl: getCoverUrl(book)
    });
    setCoverError('');
    setCoverFile(null);
    setOpenCoverDialog(true);
  };

  // Открытие диалога удаления
  const openDeleteBookDialog = (book) => {
    setSelectedBook(book);
    setOpenDeleteDialog(true);
  };

  // Функция получения URL обложки
  const getCoverUrl = (book) => {
    // Если у книги есть cover и это URL (начинается с http или /uploads)
    if (book.cover) {
      if (book.cover.startsWith('/uploads')) {
        return `${window.location.protocol}//${window.location.host.replace(/:\d+/, ':5001')}${book.cover}`;
      }
      return book.cover;
    } else if (book.coverUrl) {
      if (book.coverUrl.startsWith('/uploads')) {
        return `${window.location.protocol}//${window.location.host.replace(/:\d+/, ':5001')}${book.coverUrl}`;
      }
      return book.coverUrl;
    }
    // Если нет обложки, возвращаем заглушку
    return 'https://via.placeholder.com/50x75?text=No+Cover';
  };

  // Отображение диалога загрузки обложки
  const renderCoverDialog = () => (
    <Dialog open={openCoverDialog} onClose={() => !uploadCoverLoading && setOpenCoverDialog(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Кітап мұқабасын жүктеу</DialogTitle>
      <DialogContent>
        {coverError && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            <AlertTitle>Мұқаба жүктеу қатесі</AlertTitle>
            {coverError}
          </Alert>
        )}
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5}>
            <BookCoverPreview 
              file={coverFile} 
              imageUrl={selectedBook?.coverUrl} 
              title={selectedBook?.title || 'Кітап'} 
            />
          </Grid>
          
          <Grid item xs={12} sm={7}>
            <Typography variant="body2" gutterBottom>
              Кітаптың мұқабасы үшін сурет файлын жүктеңіз. JPG, PNG немесе GIF форматында болуы керек, өлшемі 5MB-дан аспауы керек.
            </Typography>
            
            <input
              accept="image/*"
              id="contained-button-file"
              type="file"
              onChange={handleCoverChange}
              style={{ display: 'none' }}
              disabled={uploadCoverLoading}
            />
            <label htmlFor="contained-button-file">
              <Button 
                variant="contained" 
                component="span"
                disabled={uploadCoverLoading}
                fullWidth
                sx={{ mt: 2 }}
              >
                Файлды таңдау
              </Button>
            </label>
            
            {coverFile && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Таңдалған файл: {coverFile.name} ({(coverFile.size / 1024).toFixed(2)} KB)
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => setOpenCoverDialog(false)}
          disabled={uploadCoverLoading}
        >
          Бас тарту
        </Button>
        <Button 
          onClick={handleUploadCover} 
          variant="contained" 
          color="primary"
          disabled={!coverFile || uploadCoverLoading}
        >
          {uploadCoverLoading ? <CircularProgress size={24} /> : 'Жүктеу'}
        </Button>
      </DialogActions>
    </Dialog>
  );

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
            onClick={openAddBookDialog}
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
                          src={getCoverUrl(book)} 
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
      <Dialog open={openAddDialog} onClose={() => !addBookLoading && setOpenAddDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Кітап қосу</Typography>
            {addBookLoading && <CircularProgress size={24} sx={{ ml: 2 }} />}
          </Box>
        </DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              <AlertTitle>Кітап құру қатесі</AlertTitle>
              {formError}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Атауы"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                required
                error={!!fieldErrors.title}
                helperText={fieldErrors.title || ''}
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
                error={!!fieldErrors.author}
                helperText={fieldErrors.author || ''}
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
                required
                error={!!fieldErrors.description}
                helperText={fieldErrors.description || 'Кітаптың қысқаша сипаттамасын енгізіңіз'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Баспа"
                name="publisher"
                value={formData.publisher}
                onChange={handleFormChange}
                error={!!fieldErrors.publisher}
                helperText={fieldErrors.publisher || 'Кітап баспасы (міндетті емес)'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Басылым жылы"
                name="publishYear"
                type="text"
                value={formData.publishYear}
                onChange={handleFormChange}
                required
                error={!!fieldErrors.publishYear}
                helperText={fieldErrors.publishYear || 'Мысалы: 2023 (тек сандарды енгізіңіз)'}
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!fieldErrors.categoryId}>
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
                {fieldErrors.categoryId && (
                  <Typography color="error" variant="caption" sx={{ mt: 1, ml: 2 }}>
                    {fieldErrors.categoryId}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth error={!!fieldErrors.language}>
                <InputLabel id="language-select-label">Тілі</InputLabel>
                <Select
                  labelId="language-select-label"
                  label="Тілі"
                  name="language"
                  value={formData.language}
                  onChange={handleFormChange}
                  required
                >
                  <MenuItem value="Казахский">Қазақша</MenuItem>
                  <MenuItem value="Русский">Орысша</MenuItem>
                  <MenuItem value="Английский">Ағылшынша</MenuItem>
                </Select>
                {fieldErrors.language && (
                  <Typography color="error" variant="caption" sx={{ mt: 1, ml: 2 }}>
                    {fieldErrors.language}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Барлық даналары"
                name="totalCopies"
                type="text"
                value={formData.totalCopies}
                onChange={handleFormChange}
                required
                error={!!fieldErrors.totalCopies}
                helperText={fieldErrors.totalCopies || 'Кітаптың жалпы данасы (тек сандар)'}
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  min: "0"
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Қолжетімді даналары"
                name="availableCopies"
                type="text"
                value={formData.availableCopies}
                onChange={handleFormChange}
                required
                error={!!fieldErrors.availableCopies}
                helperText={fieldErrors.availableCopies || 'Қазіргі уақытта қолжетімді даналар (тек сандар)'}
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  min: "0"
                }}
              />
            </Grid>
            
            {/* Блок загрузки обложки */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Кітап мұқабасы
              </Typography>
              
              {newBookCoverError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {newBookCoverError}
                </Alert>
              )}
              
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <BookCoverPreview 
                    file={newBookCoverFile} 
                    title={formData.title || 'Жаңа кітап'} 
                  />
                </Grid>
                
                <Grid item xs={12} sm={8}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" gutterBottom>
                      Кітаптың мұқабасы үшін сурет файлын жүктеңіз. JPG, PNG немесе GIF форматында болуы керек, өлшемі 5MB-дан аспауы керек.
                    </Typography>
                    
                    <input
                      accept="image/*"
                      id="new-book-cover-upload"
                      type="file"
                      onChange={handleNewBookCoverChange}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="new-book-cover-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<ImageIcon />}
                        disabled={addBookLoading}
                        fullWidth
                        sx={{ mt: 1 }}
                      >
                        Мұқаба таңдау
                      </Button>
                    </label>
                    
                    {newBookCoverFile && (
                      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="caption">
                          {newBookCoverFile.name} ({(newBookCoverFile.size / 1024).toFixed(2)} KB)
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => setNewBookCoverFile(null)} 
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ flexDirection: 'column', alignItems: 'stretch', padding: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Button 
              onClick={() => setOpenAddDialog(false)}
              disabled={addBookLoading || uploadingNewBookCover}
              sx={{ mr: 1 }}
            >
              Бас тарту
            </Button>
            <Button 
              onClick={handleAddBook} 
              variant="contained" 
              color="primary"
              disabled={addBookLoading || uploadingNewBookCover}
              startIcon={addBookLoading || uploadingNewBookCover ? <CircularProgress size={20} /> : null}
            >
              {addBookLoading || uploadingNewBookCover ? 'Жүктелуде...' : 'Кітап қосу'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Кітапты өңдеу диалогы */}
      <Dialog open={openEditDialog} onClose={() => !editBookLoading && setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Кітапты өңдеу</DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              <AlertTitle>Кітапты өңдеу қатесі</AlertTitle>
              {formError}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Атауы"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                required
                error={!!fieldErrors.title}
                helperText={fieldErrors.title || ''}
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
                error={!!fieldErrors.author}
                helperText={fieldErrors.author || ''}
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
                required
                error={!!fieldErrors.description}
                helperText={fieldErrors.description || 'Кітаптың қысқаша сипаттамасын енгізіңіз'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Баспа"
                name="publisher"
                value={formData.publisher}
                onChange={handleFormChange}
                error={!!fieldErrors.publisher}
                helperText={fieldErrors.publisher || 'Кітап баспасы (міндетті емес)'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Басылым жылы"
                name="publishYear"
                type="text"
                value={formData.publishYear}
                onChange={handleFormChange}
                required
                error={!!fieldErrors.publishYear}
                helperText={fieldErrors.publishYear || 'Мысалы: 2023 (тек сандарды енгізіңіз)'}
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!fieldErrors.categoryId}>
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
                {fieldErrors.categoryId && (
                  <Typography color="error" variant="caption" sx={{ mt: 1, ml: 2 }}>
                    {fieldErrors.categoryId}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth error={!!fieldErrors.language}>
                <InputLabel id="language-edit-select-label">Тілі</InputLabel>
                <Select
                  labelId="language-edit-select-label"
                  label="Тілі"
                  name="language"
                  value={formData.language}
                  onChange={handleFormChange}
                  required
                >
                  <MenuItem value="Казахский">Қазақша</MenuItem>
                  <MenuItem value="Русский">Орысша</MenuItem>
                  <MenuItem value="Английский">Ағылшынша</MenuItem>
                </Select>
                {fieldErrors.language && (
                  <Typography color="error" variant="caption" sx={{ mt: 1, ml: 2 }}>
                    {fieldErrors.language}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Барлық даналары"
                name="totalCopies"
                type="text"
                value={formData.totalCopies}
                onChange={handleFormChange}
                required
                error={!!fieldErrors.totalCopies}
                helperText={fieldErrors.totalCopies || 'Кітаптың жалпы данасы (тек сандар)'}
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  min: "0"
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Қолжетімді даналары"
                name="availableCopies"
                type="text"
                value={formData.availableCopies}
                onChange={handleFormChange}
                required
                error={!!fieldErrors.availableCopies}
                helperText={fieldErrors.availableCopies || 'Қазіргі уақытта қолжетімді даналар (тек сандар)'}
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  min: "0"
                }}
              />
            </Grid>
            
            {/* Блок загрузки обложки в режиме редактирования */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Кітап мұқабасы
              </Typography>
              
              {editBookCoverError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {editBookCoverError}
                </Alert>
              )}
              
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <BookCoverPreview 
                    file={editBookCoverFile} 
                    imageUrl={selectedBook?.coverUrl} 
                    title={formData.title || selectedBook?.title || 'Кітап'}
                  />
                </Grid>
                
                <Grid item xs={12} sm={8}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" gutterBottom>
                      Кітап мұқабасын өзгерту үшін жаңа сурет жүктеңіз. Өзгертпеу үшін бос қалдырыңыз.
                    </Typography>
                    
                    <input
                      accept="image/*"
                      id="edit-book-cover-upload"
                      type="file"
                      onChange={handleEditBookCoverChange}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="edit-book-cover-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<ImageIcon />}
                        disabled={editBookLoading}
                        fullWidth
                        sx={{ mt: 1 }}
                      >
                        Жаңа мұқаба таңдау
                      </Button>
                    </label>
                    
                    {editBookCoverFile && (
                      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="caption">
                          {editBookCoverFile.name} ({(editBookCoverFile.size / 1024).toFixed(2)} KB)
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => setEditBookCoverFile(null)} 
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenEditDialog(false)}
            disabled={editBookLoading || uploadingEditBookCover}
          >
            Бас тарту
          </Button>
          <Button 
            onClick={handleEditBook} 
            variant="contained" 
            color="primary"
            disabled={editBookLoading || uploadingEditBookCover}
          >
            {(editBookLoading || uploadingEditBookCover) ? <CircularProgress size={24} /> : 'Сақтау'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Кітапты жою диалогы */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => !deleteBookLoading && setOpenDeleteDialog(false)}
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
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            disabled={deleteBookLoading}
          >
            Бас тарту
          </Button>
          <Button 
            onClick={handleDeleteBook} 
            color="error" 
            autoFocus
            disabled={deleteBookLoading}
          >
            {deleteBookLoading ? <CircularProgress size={24} /> : 'Жою'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Мұқаба жүктеу диалогы */}
      {renderCoverDialog()}
    </Container>
  );
};

export default BooksPage;