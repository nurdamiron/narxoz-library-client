import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import BookTableImage from '../../components/admin/BookTableImage';
import { useToast } from '../../context/ToastContext';
import { translateError } from '../../utils/errorMessages';
import { useTranslation } from 'react-i18next';

const BooksPage = () => {
  const { t } = useTranslation();
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
    language: 'Казахский',
    borrowDuration: 14
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
        console.log('Получены книги:', response.data); // Отладочный лог
        
        // Добавляем coverUrl для каждой книги с обработкой возможных вариантов хранения URL
        const booksWithCovers = response.data.map(book => {
          let coverUrl;
          
          // Проверяем все возможные места хранения URL обложки
          if (book.cover) {
            coverUrl = book.cover;
          } else if (book.coverUrl) {
            coverUrl = book.coverUrl;
          } else {
            coverUrl = '/images/default-book-cover.jpg';
          }
          
          console.log(`Обложка для книги ${book.id}: ${coverUrl}`); // Отладочный лог
          
          return {
            ...book,
            coverUrl
          };
        });
        
        setBooks(booksWithCovers);
      }
    } catch (error) {
      console.error(t('admin.booksLoadingErrorLog'), error);
      showError(t('admin.errorLoadingBooks'));
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
      console.error(t('admin.categoriesLoadingErrorLog'), error);
      showError(t('admin.errorLoadingCategories'));
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
    if (name === 'publishYear' || name === 'totalCopies' || name === 'availableCopies' || name === 'borrowDuration') {
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
        setCoverError(t('admin.fileSizeError'));
        return;
      }
      
      // Проверка типа файла
      if (!file.type.startsWith('image/')) {
        setCoverError(t('admin.fileTypeError'));
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
        setNewBookCoverError(t('admin.fileSizeError'));
        return;
      }
      
      // Проверка типа файла
      if (!file.type.startsWith('image/')) {
        setNewBookCoverError(t('admin.fileTypeError'));
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
        setEditBookCoverError(t('admin.fileSizeError'));
        return;
      }
      
      // Проверка типа файла
      if (!file.type.startsWith('image/')) {
        setEditBookCoverError(t('admin.fileTypeError'));
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
      language: t('languages.kazakh', 'Казахский'),
      borrowDuration: 14
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
      
      if (isNaN(parseInt(formData.borrowDuration)) || parseInt(formData.borrowDuration) < 1) {
        errors.borrowDuration = 'Қарызға алу ұзақтығы кем дегенде 1 күн болуы керек';
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
        
        success(t('admin.bookCreated'));
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
        
        setFormError(t('admin.createError'));
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
      
      if (isNaN(parseInt(formData.borrowDuration)) || parseInt(formData.borrowDuration) < 1) {
        errors.borrowDuration = 'Қарызға алу ұзақтығы кем дегенде 1 күн болуы керек';
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
        
        success(t('admin.bookUpdated'));
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
        
        setFormError(t('admin.updateError'));
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
        success(t('admin.bookDeleted'));
        fetchBooks();
        setOpenDeleteDialog(false);
      }
    } catch (error) {
      console.error('Кітапты жою қатесі:', error);
      
      // Показать сообщение об ошибке
      let errorMessage = t('admin.deleteError');
      
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
        setCoverError(t('admin.coverUploadError'));
        return;
      }
      
      setCoverError('');
      setUploadCoverLoading(true);
      
      const response = await adminBookService.uploadBookCover(selectedBook.id, coverFile);
      
      if (response && response.success) {
        success(t('admin.coverUploadSuccess'));
        fetchBooks();
        setOpenCoverDialog(false);
        setCoverFile(null);
      } else if (!response.success) {
        // Обработка неуспешного ответа
        setCoverError(t('admin.coverUploadError'));
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
      language: book.language,
      borrowDuration: book.borrowDuration || 14
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
  
  // Мемоизация отфильтрованных книг для предотвращения лишних рендеров
  const paginatedBooks = useMemo(() => {
    return books.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [books, page, rowsPerPage]);

  // Функция получения URL обложки
  const getCoverUrl = useCallback((book) => {
    // Используем базовый URL без /api для статических файлов
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5002';
    
    // Если у книги есть cover и это URL (начинается с http или /uploads)
    if (book.cover) {
      if (book.cover.startsWith('/uploads')) {
        // Формируем полный URL для серверных изображений
        return `${BACKEND_URL}${book.cover}`;
      }
      return book.cover;
    } else if (book.coverUrl) {
      if (book.coverUrl.startsWith('/uploads')) {
        // Формируем полный URL для серверных изображений
        return `${BACKEND_URL}${book.coverUrl}`;
      }
      return book.coverUrl;
    }
    // Если нет обложки, возвращаем заглушку
    return '/images/default-book-cover.jpg';
  }, []);

  // Отображение диалога загрузки обложки
  const renderCoverDialog = () => (
    <Dialog open={openCoverDialog} onClose={() => setOpenCoverDialog(false)}>
      <DialogTitle>{t('admin.uploadCover')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('admin.coverUploadInstructions')}
        </DialogContentText>
        <Box sx={{ mt: 2, mb: 2 }}>
          <BookCoverPreview imageUrl={selectedBook?.coverUrl} />
        </Box>
        <Button
          variant="contained"
          component="label"
          startIcon={<ImageIcon />}
        >
          {t('admin.selectFile')}
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleCoverChange}
          />
        </Button>
        {coverFile && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">
              {t('admin.selectedFile')}:
            </Typography>
            <Typography>
              {t('admin.fileName')}: {coverFile.name}
            </Typography>
            <Typography>
              {t('admin.fileSize')}: {(coverFile.size / 1024).toFixed(2)} KB
            </Typography>
          </Box>
        )}
        {coverError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <AlertTitle>{t('admin.fileError')}</AlertTitle>
            {coverError}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenCoverDialog(false)} color="primary">
          {t('common.cancel')}
        </Button>
        <Button 
          onClick={handleUploadCover} 
          color="primary" 
          disabled={!coverFile || !!coverError || uploadCoverLoading}
        >
          {uploadCoverLoading ? (
            <CircularProgress size={24} />
          ) : (
            t('admin.uploadCover')
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Container maxWidth="xl">
      <PageHeader 
        title={t('admin.books')} 
        subtitle={t('admin.booksManagement')}
      />

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">{t('admin.books')}</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={openAddBookDialog}
          >
            {t('admin.addBook')}
          </Button>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('admin.coverImage')}</TableCell>
                    <TableCell>{t('books.title')}</TableCell>
                    <TableCell>{t('books.author')}</TableCell>
                    <TableCell>{t('books.category')}</TableCell>
                    <TableCell>{t('books.language')}</TableCell>
                    <TableCell>{t('books.totalCopies')}</TableCell>
                    <TableCell>{t('books.availableCopies')}</TableCell>
                    <TableCell>Срок бронирования (дни)</TableCell>
                    <TableCell>{t('admin.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedBooks.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell>
                          <BookTableImage 
                            src={getCoverUrl(book)} 
                            alt={book.title}
                          />
                        </TableCell>
                        <TableCell>{book.title}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>
                          {book.category ? book.category.name : '-'}
                        </TableCell>
                        <TableCell>{book.language}</TableCell>
                        <TableCell>{book.totalCopies}</TableCell>
                        <TableCell>
                          <Chip 
                            label={book.availableCopies} 
                            color={book.availableCopies > 0 ? "success" : "error"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={`${book.borrowDuration || 14} дней`} 
                            color="primary"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex' }}>
                            <IconButton 
                              color="primary" 
                              onClick={() => openEditBookDialog(book)}
                              size="small"
                              title={t('common.edit')}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              color="secondary" 
                              onClick={() => openUploadCoverDialog(book)}
                              size="small"
                              title={t('admin.uploadCover')}
                            >
                              <ImageIcon />
                            </IconButton>
                            <IconButton 
                              color="error" 
                              onClick={() => openDeleteBookDialog(book)}
                              size="small"
                              title={t('common.delete')}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
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
              labelRowsPerPage={t('pagination.rowsPerPage')}
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('pagination.of')} ${count}`}
            />
          </>
        )}
      </Paper>
      
      {/* Кітап қосу диалогы */}
      <Dialog 
        open={openAddDialog} 
        onClose={() => setOpenAddDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{t('admin.addBook')}</DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                autoFocus
                margin="dense"
                id="title"
                name="title"
                label={t('books.title')}
                type="text"
                fullWidth
                variant="outlined"
                value={formData.title}
                onChange={handleFormChange}
                error={!!fieldErrors.title}
                helperText={fieldErrors.title}
                required
              />
              <TextField
                margin="dense"
                id="author"
                name="author"
                label={t('books.author')}
                type="text"
                fullWidth
                variant="outlined"
                value={formData.author}
                onChange={handleFormChange}
                error={!!fieldErrors.author}
                helperText={fieldErrors.author}
                required
              />
              <TextField
                margin="dense"
                id="publisher"
                name="publisher"
                label={t('books.publisher')}
                type="text"
                fullWidth
                variant="outlined"
                value={formData.publisher}
                onChange={handleFormChange}
                helperText={t('admin.publisherHelp')}
              />
              <TextField
                margin="dense"
                id="publishYear"
                name="publishYear"
                label={t('books.publishYear')}
                type="text"
                fullWidth
                variant="outlined"
                value={formData.publishYear}
                onChange={handleFormChange}
                error={!!fieldErrors.publishYear}
                helperText={fieldErrors.publishYear || t('admin.yearHelp')}
              />
              <TextField
                select
                margin="dense"
                id="language"
                name="language"
                label={t('books.language')}
                fullWidth
                variant="outlined"
                value={formData.language}
                onChange={handleFormChange}
              >
                <MenuItem value="Казахский">{t('languages.kazakh')}</MenuItem>
                <MenuItem value="Русский">{t('languages.russian')}</MenuItem>
                <MenuItem value="Английский">{t('languages.english')}</MenuItem>
              </TextField>
              <TextField
                select
                margin="dense"
                id="categoryId"
                name="categoryId"
                label={t('books.category')}
                fullWidth
                variant="outlined"
                value={formData.categoryId}
                onChange={handleFormChange}
                error={!!fieldErrors.categoryId}
                helperText={fieldErrors.categoryId}
                required
              >
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                id="description"
                name="description"
                label={t('books.description')}
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                value={formData.description}
                onChange={handleFormChange}
                helperText={t('admin.descriptionHelp')}
              />
              <TextField
                margin="dense"
                id="totalCopies"
                name="totalCopies"
                label={t('books.totalCopies')}
                type="text"
                fullWidth
                variant="outlined"
                value={formData.totalCopies}
                onChange={handleFormChange}
                error={!!fieldErrors.totalCopies}
                helperText={fieldErrors.totalCopies || t('admin.totalCopiesHelp')}
                required
              />
              <TextField
                margin="dense"
                id="availableCopies"
                name="availableCopies"
                label={t('books.availableCopies')}
                type="text"
                fullWidth
                variant="outlined"
                value={formData.availableCopies}
                onChange={handleFormChange}
                error={!!fieldErrors.availableCopies}
                helperText={fieldErrors.availableCopies || t('admin.availableCopiesHelp')}
                required
              />
              <TextField
                margin="dense"
                id="borrowDuration"
                name="borrowDuration"
                label="Срок бронирования (дни)"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.borrowDuration}
                onChange={handleFormChange}
                error={!!fieldErrors.borrowDuration}
                helperText={fieldErrors.borrowDuration || 'Количество дней для бронирования книги (по умолчанию 14 дней)'}
                required
              />
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {t('admin.coverImage')}
                </Typography>

                {/* Добавляем предпросмотр обложки */}
                {newBookCoverFile && (
                  <BookCoverPreview 
                    file={newBookCoverFile} 
                    title={formData.title || t('admin.newBook')}
                  />
                )}
                
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<ImageIcon />}
                >
                  {t('admin.selectFile')}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleNewBookCoverChange}
                  />
                </Button>
                
                {newBookCoverFile && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">
                      {t('admin.selectedFile')}:
                    </Typography>
                    <Typography>
                      {t('admin.fileName')}: {newBookCoverFile.name}
                    </Typography>
                    <Typography>
                      {t('admin.fileSize')}: {(newBookCoverFile.size / 1024).toFixed(2)} KB
                    </Typography>
                  </Box>
                )}
                
                {newBookCoverError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    <AlertTitle>{t('admin.fileError')}</AlertTitle>
                    {newBookCoverError}
                  </Alert>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} color="primary">
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleAddBook} 
            color="primary" 
            disabled={addBookLoading}
          >
            {addBookLoading ? (
              <CircularProgress size={24} />
            ) : (
              t('admin.addBook')
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Кітапты өңдеу диалогы */}
      <Dialog 
        open={openEditDialog} 
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{t('admin.editBook')}</DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                autoFocus
                margin="dense"
                id="title-edit"
                name="title"
                label={t('books.title')}
                type="text"
                fullWidth
                variant="outlined"
                value={formData.title}
                onChange={handleFormChange}
                error={!!fieldErrors.title}
                helperText={fieldErrors.title}
                required
              />
              <TextField
                margin="dense"
                id="author-edit"
                name="author"
                label={t('books.author')}
                type="text"
                fullWidth
                variant="outlined"
                value={formData.author}
                onChange={handleFormChange}
                error={!!fieldErrors.author}
                helperText={fieldErrors.author}
                required
              />
              <TextField
                margin="dense"
                id="publisher-edit"
                name="publisher"
                label={t('books.publisher')}
                type="text"
                fullWidth
                variant="outlined"
                value={formData.publisher}
                onChange={handleFormChange}
                helperText={t('admin.publisherHelp')}
              />
              <TextField
                margin="dense"
                id="publishYear-edit"
                name="publishYear"
                label={t('books.publishYear')}
                type="text"
                fullWidth
                variant="outlined"
                value={formData.publishYear}
                onChange={handleFormChange}
                error={!!fieldErrors.publishYear}
                helperText={fieldErrors.publishYear || t('admin.yearHelp')}
              />
              <TextField
                select
                margin="dense"
                id="language-edit"
                name="language"
                label={t('books.language')}
                fullWidth
                variant="outlined"
                value={formData.language}
                onChange={handleFormChange}
              >
                <MenuItem value="Казахский">{t('languages.kazakh')}</MenuItem>
                <MenuItem value="Русский">{t('languages.russian')}</MenuItem>
                <MenuItem value="Английский">{t('languages.english')}</MenuItem>
              </TextField>
              <TextField
                select
                margin="dense"
                id="categoryId-edit"
                name="categoryId"
                label={t('books.category')}
                fullWidth
                variant="outlined"
                value={formData.categoryId}
                onChange={handleFormChange}
                error={!!fieldErrors.categoryId}
                helperText={fieldErrors.categoryId}
                required
              >
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                id="description-edit"
                name="description"
                label={t('books.description')}
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                value={formData.description}
                onChange={handleFormChange}
                helperText={t('admin.descriptionHelp')}
              />
              <TextField
                margin="dense"
                id="totalCopies-edit"
                name="totalCopies"
                label={t('books.totalCopies')}
                type="text"
                fullWidth
                variant="outlined"
                value={formData.totalCopies}
                onChange={handleFormChange}
                error={!!fieldErrors.totalCopies}
                helperText={fieldErrors.totalCopies || t('admin.totalCopiesHelp')}
                required
              />
              <TextField
                margin="dense"
                id="availableCopies-edit"
                name="availableCopies"
                label={t('books.availableCopies')}
                type="text"
                fullWidth
                variant="outlined"
                value={formData.availableCopies}
                onChange={handleFormChange}
                error={!!fieldErrors.availableCopies}
                helperText={fieldErrors.availableCopies || t('admin.availableCopiesHelp')}
                required
              />
              <TextField
                margin="dense"
                id="borrowDuration-edit"
                name="borrowDuration"
                label="Срок бронирования (дни)"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.borrowDuration}
                onChange={handleFormChange}
                error={!!fieldErrors.borrowDuration}
                helperText={fieldErrors.borrowDuration || 'Количество дней для бронирования книги (по умолчанию 14 дней)'}
                required
              />
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {t('admin.coverImage')}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <BookCoverPreview 
                    file={editBookCoverFile} 
                    imageUrl={selectedBook?.coverUrl} 
                    title={formData.title}
                  />
                </Box>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<ImageIcon />}
                >
                  {t('admin.selectFile')}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleEditBookCoverChange}
                  />
                </Button>
                
                {editBookCoverFile && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">
                      {t('admin.selectedFile')}:
                    </Typography>
                    <Typography>
                      {t('admin.fileName')}: {editBookCoverFile.name}
                    </Typography>
                    <Typography>
                      {t('admin.fileSize')}: {(editBookCoverFile.size / 1024).toFixed(2)} KB
                    </Typography>
                  </Box>
                )}
                
                {editBookCoverError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    <AlertTitle>{t('admin.fileError')}</AlertTitle>
                    {editBookCoverError}
                  </Alert>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleEditBook} 
            color="primary" 
            disabled={editBookLoading}
          >
            {editBookLoading ? (
              <CircularProgress size={24} />
            ) : (
              t('common.save')
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Кітапты жою диалогы */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>{t('admin.deleteBook')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('admin.confirmBookDelete')}
          </DialogContentText>
          {selectedBook && (
            <Box sx={{ mt: 2 }}>
              <Typography><strong>{t('books.title')}:</strong> {selectedBook.title}</Typography>
              <Typography><strong>{t('books.author')}:</strong> {selectedBook.author}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleDeleteBook} 
            color="error" 
            disabled={deleteBookLoading}
            startIcon={deleteBookLoading ? <CircularProgress size={24} /> : <DeleteIcon />}
          >
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Мұқаба жүктеу диалогы */}
      {renderCoverDialog()}
    </Container>
  );
};

export default BooksPage;