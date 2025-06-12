/**
 * src/pages/BorrowHistoryPage.jsx
 * 
 * Кітап қарыздары тарихының беті - жақсартылған нұсқа
 * 
 * Бұл компонент пайдаланушының кітап қарыздары тарихын көрсетеді және
 * қарызға алынған кітаптарды қайтару функционалын қамтамасыз етеді.
 * Жетілдірілген дизайн, анимациялар және интерактивтілік қосылған.
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Skeleton,
  Link,
  useMediaQuery,
  useTheme,
  IconButton,
  Tooltip,
  Avatar,
  Badge,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  alpha,
  Fade,
  Grow,
  Backdrop,
  LinearProgress,
  Collapse,
  
} from '@mui/material';
import {
  Book as BookIcon,
  CalendarToday,
  EventAvailable,
  EventBusy,
  ArrowBack,
  Refresh,
  BookmarkBorder,
  ExtensionOutlined,
  CheckCircleOutline,
  DeleteOutline,
  FilterList,
  Sort,
  Search,
  Clear,
  MoreVert,
  Info,
  Star,
  StarBorder,
  ExpandMore,
  ExpandLess,
  NewReleases,
  Menu as MenuIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isPast, isFuture, addDays, differenceInDays, formatDistanceToNow } from 'date-fns';
import { kk } from 'date-fns/locale';

// Импорт сервисов
import borrowService from '../services/borrowService';
import bookmarkService from '../services/bookmarkService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getBookCoverUrl, getDefaultBookCover } from '../utils';

/**
 * BorrowHistoryPage компоненті - жақсартылған нұсқа
 * 
 * @returns {JSX.Element} - Қарыз тарихы беті
 */
const BorrowHistoryPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();
  
  // Күйлер
  const [tabValue, setTabValue] = useState(0);
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('dueDate');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);
  const [highlightOverdue, setHighlightOverdue] = useState(true);
  
  // Кітап қайтару күйлері
  const [returnBorrowId, setReturnBorrowId] = useState(null);
  const [returnLoading, setReturnLoading] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [returnSuccess, setReturnSuccess] = useState(false);
  
  // Мерзімді ұзарту күйлері
  const [extendBorrowId, setExtendBorrowId] = useState(null);
  const [extendLoading, setExtendLoading] = useState(false);
  const [extendDialogOpen, setExtendDialogOpen] = useState(false);
  const [extendSuccess, setExtendSuccess] = useState(false);
  
  // Таңдалған қарыз
  const [selectedBorrow, setSelectedBorrow] = useState(null);
  
  // Хабарлама күйі
  const [message, setMessage] = useState({
    open: false,
    text: '',
    severity: 'info'
  });
  
  /**
   * Хабарламаны көрсету
   * 
   * @param {string} text - Хабарлама мәтіні
   * @param {string} severity - Хабарлама түрі (success, error, info, warning)
   */
  const showMessage = (text, severity = 'info') => {
    setMessage({
      open: true,
      text,
      severity
    });
  };
  
  /**
   * Хабарламаны жабу
   */
  const handleCloseMessage = () => {
    setMessage((prev) => ({
      ...prev,
      open: false
    }));
  };
  
  /**
   * Кітап қарыздарын жүктеу функциясы
   */
  const fetchBorrows = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Бэкендтен қарыз тарихын алу
      const response = await borrowService.getUserBorrows();
      setBorrows(response.data);
    } catch (err) {
      console.error(t('borrowHistory.loadErrorLog'), err);
      setError(t('borrowHistory.loadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);
  
  // Бетті жүктегенде қарыздарды алу
  useEffect(() => {
    fetchBorrows();
  }, [fetchBorrows]);
  
  /**
   * Таб өзгерісін өңдеу
   */
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setExpandedCard(null); // Таб өзгергенде карточканы жабу
  };
  
  /**
   * Кітап қайтару диалогын ашу
   */
  const handleOpenReturnDialog = (borrow) => {
    setSelectedBorrow(borrow);
    setReturnBorrowId(borrow.id);
    setReturnDialogOpen(true);
  };
  
  /**
   * Кітап қайтару диалогын жабу
   */
  const handleCloseReturnDialog = () => {
    setReturnDialogOpen(false);
    setReturnBorrowId(null);
    setSelectedBorrow(null);
  };
  
  /**
   * Кітапты қайтаруды өңдеу
   */
  const handleReturnBook = async () => {
    try {
      setReturnLoading(true);
      
      // Бэкендке қайтару сұранысын жіберу
      const response = await borrowService.returnBook(returnBorrowId);
      
      if (response.success) {
        setReturnSuccess(true);
        success(t('borrowHistory.returnSuccess'));
        
        // Қарыздарды қайта жүктеу
        fetchBorrows();
        
        // Диалогтағы "жабу" түймесіне автоматты түрде басуды кешіктіру
        setTimeout(() => {
          handleCloseReturnDialog();
          setReturnSuccess(false);
        }, 2000);
      } else {
        showError(t('borrowHistory.returnError'));
      }
    } catch (err) {
      console.error(t('borrowHistory.returnErrorLog'), err);
      showError(t('borrowHistory.returnErrorDetails') + err.message);
    } finally {
      setReturnLoading(false);
    }
  };
  
  /**
   * Мерзімді ұзарту диалогын ашу
   */
  const handleOpenExtendDialog = (borrow) => {
    setSelectedBorrow(borrow);
    setExtendBorrowId(borrow.id);
    setExtendDialogOpen(true);
  };
  
  /**
   * Мерзімді ұзарту диалогын жабу
   */
  const handleCloseExtendDialog = () => {
    setExtendDialogOpen(false);
    setExtendBorrowId(null);
    setSelectedBorrow(null);
  };
  
  /**
   * Мерзімді ұзартуды өңдеу
   */
  const handleExtendBorrow = async () => {
    try {
      setExtendLoading(true);
      
      // Бэкендке ұзарту сұранысын жіберу
      const response = await borrowService.extendBorrow(extendBorrowId);
      
      if (response.success) {
        setExtendSuccess(true);
        success(t('borrowHistory.extendSuccess'));
        
        // Қарыздарды қайта жүктеу
        fetchBorrows();
        
        // Диалогты автоматты түрде жабу
        setTimeout(() => {
          handleCloseExtendDialog();
          setExtendSuccess(false);
        }, 2000);
      } else {
        showError(t('borrowHistory.extendError'));
      }
    } catch (err) {
      console.error(t('borrowHistory.extendErrorLog'), err);
      showError(t('borrowHistory.extendErrorDetails') + err.message);
    } finally {
      setExtendLoading(false);
    }
  };
  
  /**
   * Кітапты бетбелгіге қосу
   */
  const handleAddToBookmarks = async (bookId) => {
    try {
      console.log('Adding bookmark for bookId:', bookId);
      
      if (!bookId) {
        showMessage(t('books.bookmarkError'), 'error');
        return;
      }
      
      const response = await bookmarkService.addBookmark({ bookId });
      console.log('Bookmark response:', response);
      
      showMessage(t('books.bookmarkAdded'), 'success');
    } catch (err) {
      console.error(`${t('books.bookmarkError')}:`, err);
      showMessage(t('books.bookmarkError'), 'error');
    }
  };
  
  /**
   * Іздеу сұранысын өңдеу
   */
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  /**
   * Іздеу сұранысын тазалау
   */
  const handleClearSearch = () => {
    setSearchTerm('');
  };
  
  /**
   * Сұрыптау өзгерісін өңдеу
   */
  const handleSortChange = (event) => {
    setSort(event.target.value);
  };
  
  /**
   * Карточка кеңейтімділігін ауыстыру
   */
  const toggleCardExpansion = (borrowId) => {
    setExpandedCard(expandedCard === borrowId ? null : borrowId);
  };
  
  /**
   * Кітап мұқабасының URL-ін алу
   */
  const getCoverUrl = (book) => {
    // Use the global utility function for all cases
    return getBookCoverUrl(book?.cover);
  };
  
  /**
   * Қарыз мәртебесін алу
   */
  const getBorrowStatus = (borrow) => {
    const currentDate = new Date();
    const dueDate = new Date(borrow.dueDate);
    
    if (borrow.status === 'returned') {
      // Check if the book was returned late
      const returnDate = new Date(borrow.returnDate);
      const wasOverdue = returnDate > dueDate;
      
      if (wasOverdue) {
        return {
          label: t('borrowHistory.returnedLate'),
          color: 'warning',
          icon: <CheckCircleOutline />,
          bg: alpha(theme.palette.warning.main, 0.08)
        };
      }
      
      return {
        label: t('borrowHistory.returned'),
        color: 'success',
        icon: <CheckCircleOutline />,
        bg: alpha(theme.palette.success.main, 0.08)
      };
    } else if (borrow.status === 'overdue' || (borrow.status === 'active' && isPast(dueDate))) {
      return {
        label: t('borrowHistory.overdue'),
        color: 'error',
        icon: <EventBusy />,
        bg: alpha(theme.palette.error.main, 0.08)
      };
    } else {
      return {
        label: t('borrowHistory.active'),
        color: 'primary',
        icon: <EventAvailable />,
        bg: alpha(theme.palette.primary.main, 0.08)
      };
    }
  };
  
  /**
   * Белгілі бір мәртебедегі қарыздарды сүзгілеу
   */
  const getFilteredBorrows = () => {
    let filtered = [];
    
    // Таб бойынша сүзгілеу
    if (tabValue === 0) {
      // Барлық қарыздар
      filtered = borrows;
    } else if (tabValue === 1) {
      // Белсенді қарыздар
      filtered = borrows.filter(borrow => borrow.status === 'active');
    } else if (tabValue === 2) {
      // Қайтарылған қарыздар
      filtered = borrows.filter(borrow => borrow.status === 'returned');
    } else {
      // Мерзімі өткен қарыздар
      filtered = borrows.filter(borrow => 
        borrow.status === 'overdue' || 
        (borrow.status === 'active' && isPast(new Date(borrow.dueDate)))
      );
    }
    
    // Іздеу
    if (searchTerm.trim() !== '') {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(borrow => 
        (borrow.book?.title && borrow.book.title.toLowerCase().includes(searchTermLower)) ||
        (borrow.book?.author && borrow.book.author.toLowerCase().includes(searchTermLower))
      );
    }
    
    // Сұрыптау
    const sorted = [...filtered];
    switch (sort) {
      case 'title':
        sorted.sort((a, b) => a.book?.title.localeCompare(b.book?.title));
        break;
      case 'author':
        sorted.sort((a, b) => a.book?.author.localeCompare(b.book?.author));
        break;
      case 'borrowDate':
        sorted.sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate));
        break;
      case 'dueDate':
        sorted.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        break;
      case 'status':
        sorted.sort((a, b) => {
          // Сортировка: сначала просроченные, затем активные, затем возвращенные
          if (a.status === 'overdue' || (a.status === 'active' && isPast(new Date(a.dueDate)))) return -1;
          if (b.status === 'overdue' || (b.status === 'active' && isPast(new Date(b.dueDate)))) return 1;
          if (a.status === 'active' && b.status === 'returned') return -1;
          if (a.status === 'returned' && b.status === 'active') return 1;
          return 0;
        });
        break;
      default:
        break;
    }
    
    return sorted;
  };
  
  /**
   * Қайтару мерзіміне дейінгі күндер санын анықтау
   */
  const getDaysUntilDue = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    return differenceInDays(due, now);
  };
  
  /**
   * Мерзімі өткен күндер санын анықтау
   */
  const getDaysOverdue = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    return differenceInDays(now, due);
  };
  
  /**
   * Мерзімге дейінгі уақытты форматтау
   */
  const formatDueTime = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    
    // Егер мерзім өтіп кетсе
    if (isPast(due)) {
      const days = getDaysOverdue(dueDate);
      if (days > 0) {
        return t('borrowHistory.overdueText', {days: days});
      } else {
        return t('borrowHistory.overdueToday');
      }
    }
    
    // Мерзімге дейін
    const days = getDaysUntilDue(dueDate);
    if (days === 0) {
      return t('borrowHistory.dueToday');
    } else if (days === 1) {
      return t('borrowHistory.dueTomorrow');
    } else {
      return t('borrowHistory.daysRemaining', {days: days});
    }
  };
  
  /**
   * Мерзім күйінің түсін анықтау
   */
  const getDueDateColor = (dueDate) => {
    const days = getDaysUntilDue(dueDate);
    
    if (days < 0) return theme.palette.error.main;
    if (days <= 3) return theme.palette.warning.main;
    return theme.palette.info.main;
  };
  
  /**
   * Мерзім күйінің фонын анықтау
   */
  const getDueDateBg = (dueDate) => {
    const days = getDaysUntilDue(dueDate);
    
    if (days < 0) return alpha(theme.palette.error.main, 0.08);
    if (days <= 3) return alpha(theme.palette.warning.main, 0.08);
    return alpha(theme.palette.info.main, 0.08);
  };
  
  // Сұрыпталған және сүзгіленген қарыздар
  const filteredBorrows = useMemo(() => getFilteredBorrows(), [borrows, tabValue, searchTerm, sort]);
  
  // Мәртебелер бойынша қарыздар саны
  const activeBorrows = borrows.filter(borrow => borrow.status === 'active').length;
  const overdueBorrows = borrows.filter(borrow => 
    borrow.status === 'overdue' || 
    (borrow.status === 'active' && isPast(new Date(borrow.dueDate)))
  ).length;
  const returnedBorrows = borrows.filter(borrow => borrow.status === 'returned').length;
  
  // Картаның үстіндегі индикатор мәні
  const getProgressValue = (borrow) => {
    const borrowDate = new Date(borrow.borrowDate);
    const dueDate = new Date(borrow.dueDate);
    const now = new Date();
    
    // Қайтарылған кітаптар үшін
    if (borrow.status === 'returned') {
      return 100;
    }
    
    // Белсенді кітаптар үшін
    const totalDuration = dueDate - borrowDate;
    const elapsedDuration = now - borrowDate;
    
    // Пайызды есептеу
    let percentage = (elapsedDuration / totalDuration) * 100;
    
    // Теріс мән болмауы керек
    percentage = Math.max(0, percentage);
    
    // 100% шектеуі
    percentage = Math.min(100, percentage);
    
    return percentage;
  };
  
  // Прогресс жолының түсі
  const getProgressColor = (borrow) => {
    // Қайтарылған кітаптар үшін жасыл
    if (borrow.status === 'returned') {
      return theme.palette.success.main;
    }
    
    const dueDate = new Date(borrow.dueDate);
    const now = new Date();
    
    // Мерзімі өткен кітаптар үшін қызыл
    if (isPast(dueDate)) {
      return theme.palette.error.main;
    }
    
    const daysUntilDue = getDaysUntilDue(borrow.dueDate);
    
    // Мерзіміне 3 күннен аз қалған кітаптар үшін сары
    if (daysUntilDue <= 3) {
      return theme.palette.warning.main;
    }
    
    // Басқа кітаптар үшін көк
    return theme.palette.info.main;
  };
  
  // Анимация варианттары
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isTablet ? 'column' : 'row',
          alignItems: isTablet ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          mb: 3 
        }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {t('borrowHistory.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('borrowHistory.description')}
            </Typography>
          </Box>
          
          <Button 
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchBorrows}
            disabled={loading}
            sx={{ mt: isTablet ? 2 : 0 }}
          >
            {loading ? t('common.loading') : t('borrowHistory.refresh')}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper elevation={1} sx={{ mb: 4 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant={isMobile ? 'fullWidth' : 'standard'}
          >
            <Tab label={t('borrowHistory.all')} />
            <Tab label={t('borrowHistory.active')} />
            <Tab label={t('borrowHistory.returned')} />
            <Tab label={t('borrowHistory.overdue')} />
          </Tabs>
        </Paper>

        {loading ? (
          <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
              {[1, 2, 3].map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item}>
                  <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 2, mb: 1 }} />
                  <Skeleton variant="text" height={30} width="80%" />
                  <Skeleton variant="text" height={20} width="60%" />
                  <Skeleton variant="text" height={20} width="50%" />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : filteredBorrows.length === 0 ? (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              textAlign: 'center', 
              bgcolor: alpha(theme.palette.background.paper, 0.7),
              borderRadius: 4,
              backdropFilter: 'blur(10px)'
            }}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.grey[200], 0.5),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                mx: 'auto'
              }}
            >
              <BookIcon 
                sx={{ 
                  fontSize: 60, 
                  color: alpha(theme.palette.text.secondary, 0.5)
                }}
              />
            </Box>
            
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
              {tabValue === 0 
                ? t('borrowHistory.noBorrows')
                : tabValue === 1 
                ? t('borrowHistory.noActiveBorrows')
                : tabValue === 2 
                ? t('borrowHistory.noReturnedBooks')
                : t('borrowHistory.noOverdueBorrows')}
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
              {searchTerm 
                ? t('books.noSearchResults', {term: searchTerm})
                : tabValue === 0 
                ? t('borrowHistory.noBorrowsDesc')
                : tabValue === 1 
                ? t('borrowHistory.noActiveBorrowsDesc')
                : tabValue === 2 
                ? t('borrowHistory.noReturnedBooksDesc')
                : t('borrowHistory.noOverdueBorrowsDesc')}
            </Typography>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<BookIcon />}
              onClick={() => navigate('/books')}
              sx={{ mb: 2 }}
            >
              {t('home.browseCatalog')}
            </Button>
          </Paper>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3}>
              {filteredBorrows.map((borrow) => {
                const status = getBorrowStatus(borrow);
                const daysUntilDue = getDaysUntilDue(borrow.dueDate);
                const daysOverdue = getDaysOverdue(borrow.dueDate);
                const canExtend = borrow.status === 'active' && daysUntilDue >= 0;
                const canReturn = borrow.status === 'active' || borrow.status === 'overdue';
                const progressValue = getProgressValue(borrow);
                const progressColor = getProgressColor(borrow);
                const isExpanded = expandedCard === borrow.id;
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={borrow.id}>
                    <motion.div variants={itemVariants}>
                      <Card 
                        sx={{ 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: 2,
                          overflow: 'hidden',
                          boxShadow: theme.shadows[2],
                          position: 'relative',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            boxShadow: theme.shadows[8],
                            transform: 'translateY(-4px)'
                          },
                          bgcolor: (borrow.status === 'overdue' || (borrow.status === 'active' && isPast(new Date(borrow.dueDate)))) && highlightOverdue 
                            ? alpha(theme.palette.error.main, 0.03)
                            : 'background.paper'
                        }}
                      >
                        <LinearProgress 
                          variant="determinate" 
                          value={progressValue} 
                          sx={{ 
                            height: 4,
                            '& .MuiLinearProgress-bar': {
                              bgcolor: progressColor
                            }
                          }}
                        />
                        
                        <Chip
                          label={status.label}
                          color={status.color}
                          icon={status.icon}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            zIndex: 1,
                            fontWeight: 'medium',
                            boxShadow: theme.shadows[2]
                          }}
                        />
                        
                        <Box sx={{ position: 'relative', pt: '60%' }}>
                          <CardMedia
                            component="img"
                            image={getCoverUrl(borrow.book)}
                            alt={borrow.book?.title}
                            crossOrigin="anonymous" // Add crossOrigin prop for CORS support
                            onError={(e) => {
                              if (e.target && e.target.src && !e.target.src.includes('no-image.png')) {
                                e.target.src = getDefaultBookCover();
                                e.target.onerror = null; // Prevent infinite loop
                              }
                            }}
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              bgcolor: alpha(theme.palette.grey[100], 0.5),
                              transition: 'transform 0.3s ease-in-out',
                              '&:hover': {
                                transform: 'scale(1.05)'
                              }
                            }}
                          />
                        </Box>
                        
                        <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                          <Link
                            component={RouterLink}
                            to={`/books/${borrow.bookId}`}
                            underline="hover"
                            color="inherit"
                            sx={{ fontWeight: 'bold' }}
                          >
                            <Typography variant="h6" component="div" gutterBottom noWrap>
                              {borrow.book?.title}
                            </Typography>
                          </Link>
                          
                          <Typography variant="body2" color="text.secondary" noWrap gutterBottom>
                            {borrow.book?.author}
                          </Typography>
                          
                          <Divider sx={{ my: 1.5 }} />
                          
                          <Box sx={{ my: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: '50%',
                                  bgcolor: alpha(theme.palette.info.main, 0.1),
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  mr: 1.5
                                }}
                              >
                                <CalendarToday fontSize="small" sx={{ color: theme.palette.info.main, fontSize: '0.8rem' }} />
                              </Box>
                              <Typography variant="body2">
                                {t('borrowHistory.borrowDate')}: {format(new Date(borrow.borrowDate), 'dd.MM.yyyy', { locale: kk })}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: borrow.returnDate ? 1 : 0 }}>
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: '50%',
                                  bgcolor: isPast(new Date(borrow.dueDate)) && borrow.status !== 'returned'
                                    ? alpha(theme.palette.error.main, 0.1)
                                    : alpha(theme.palette.warning.main, 0.1),
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  mr: 1.5
                                }}
                              >
                                <CalendarToday 
                                  fontSize="small" 
                                  sx={{ 
                                    color: isPast(new Date(borrow.dueDate)) && borrow.status !== 'returned'
                                      ? theme.palette.error.main
                                      : theme.palette.warning.main,
                                    fontSize: '0.8rem'
                                  }} 
                                />
                              </Box>
                              <Typography 
                                variant="body2"
                                color={isPast(new Date(borrow.dueDate)) && borrow.status !== 'returned' 
                                  ? 'error' 
                                  : 'inherit'
                                }
                              >
                                {t('borrowHistory.dueDate')}: {format(new Date(borrow.dueDate), 'dd.MM.yyyy', { locale: kk })}
                              </Typography>
                            </Box>
                            
                            {borrow.returnDate && (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box
                                  sx={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: '50%',
                                    bgcolor: alpha(theme.palette.success.main, 0.1),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 1.5
                                  }}
                                >
                                  <CheckCircleOutline fontSize="small" sx={{ color: theme.palette.success.main, fontSize: '0.8rem' }} />
                                </Box>
                                <Typography variant="body2" color="success.main">
                                  {t('borrowHistory.returnDate')}: {format(new Date(borrow.returnDate), 'dd.MM.yyyy', { locale: kk })}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                          
                          {borrow.status !== 'returned' && (
                            <Fade in={true}>
                              <Box 
                                sx={{ 
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  p: 1,
                                  mt: 1,
                                  mb: 0.5,
                                  borderRadius: 2,
                                  bgcolor: getDueDateBg(borrow.dueDate),
                                  color: getDueDateColor(borrow.dueDate),
                                  fontWeight: 'medium'
                                }}
                              >
                                {borrow.status === 'active' && daysUntilDue > 0 ? (
                                  <Typography variant="body2" fontWeight="medium">
                                    {formatDueTime(borrow.dueDate)}
                                  </Typography>
                                ) : (
                                  <Typography variant="body2" fontWeight="medium" color="error">
                                    {t('borrowHistory.overdueBy', {days: daysOverdue})}
                                  </Typography>
                                )}
                              </Box>
                            </Fade>
                          )}
                          
                          <Collapse in={isExpanded}>
                            <Box sx={{ mt: 1.5 }}>
                              <Divider sx={{ mb: 1.5 }} />
                              
                              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                {t('books.bookDetails')}
                              </Typography>
                              
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1.5 }}>
                                {borrow.book?.genre && (
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">{t('books.genre')}:</Typography>
                                    <Typography variant="body2">{borrow.book.genre}</Typography>
                                  </Box>
                                )}
                                
                                {borrow.book?.publisher && (
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">{t('books.publisher')}:</Typography>
                                    <Typography variant="body2">{borrow.book.publisher}</Typography>
                                  </Box>
                                )}
                                
                                {borrow.book?.publicationYear && (
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">{t('books.publishYear')}:</Typography>
                                    <Typography variant="body2">{borrow.book.publicationYear}</Typography>
                                  </Box>
                                )}
                                
                                {borrow.book?.ISBN && (
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">{t('books.details.isbn')}:</Typography>
                                    <Typography variant="body2">{borrow.book.ISBN}</Typography>
                                  </Box>
                                )}
                              </Box>
                              
                              {borrow.book?.description && (
                                <>
                                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                    {t('books.description')}
                                  </Typography>
                                  
                                  <Typography variant="body2" color="text.secondary" paragraph>
                                    {borrow.book.description.length > 150
                                      ? `${borrow.book.description.substring(0, 150)}...`
                                      : borrow.book.description}
                                  </Typography>
                                </>
                              )}
                              
                              <Button
                                startIcon={<BookmarkBorder />}
                                variant="outlined"
                                size="small"
                                fullWidth
                                onClick={() => handleAddToBookmarks(borrow.bookId)}
                                sx={{ mt: 1 }}
                              >
                                {t('books.addToBookmarks')}
                              </Button>
                            </Box>
                          </Collapse>
                        </CardContent>
                        
                        <CardActions sx={{ p: 2, pt: 0 }}>
                          <Button
                            size="small"
                            onClick={() => toggleCardExpansion(borrow.id)}
                            endIcon={isExpanded ? <ExpandLess /> : <ExpandMore />}
                            sx={{ mr: 'auto' }}
                          >
                            {isExpanded ? t('books.details.showLess') : t('books.details.showMore')}
                          </Button>
                          
                          {canReturn && (
                            <Button 
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={() => handleOpenReturnDialog(borrow)}
                              startIcon={<CheckCircleOutline />}
                            >
                              {t('borrowHistory.return')}
                            </Button>
                          )}
                          
                          {canExtend && (
                            <Button 
                              variant="outlined"
                              color="secondary"
                              size="small"
                              startIcon={<ExtensionOutlined />}
                              onClick={() => handleOpenExtendDialog(borrow)}
                              sx={{ ml: canReturn ? 1 : 0 }}
                            >
                              {t('borrowHistory.extend')}
                            </Button>
                          )}
                         </CardActions>
                         </Card>
                    </motion.div>
                   </Grid>
                 );
                })}
              </Grid>
            </motion.div>
            
      )}
      
      <Dialog
        open={returnDialogOpen}
        onClose={handleCloseReturnDialog}
        aria-labelledby="return-dialog-title"
      >
        <DialogTitle id="return-dialog-title">
          {t('borrowHistory.returnBookTitle')}
        </DialogTitle>
        <DialogContent>
          {selectedBorrow && (
            <Box sx={{ mb: 2 }}>
              <DialogContentText>
                {t('borrowHistory.returnBookQuestion')}
              </DialogContentText>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mt: 2,
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: 1
              }}>
                <Avatar 
                  variant="rounded" 
                  src={getCoverUrl(selectedBorrow.book)}
                  sx={{ width: 60, height: 80, mr: 2 }}
                  imgProps={{ 
                    crossOrigin: "anonymous", // Add crossOrigin prop for CORS support
                    onError: (e) => {
                      if (e.target && e.target.src && !e.target.src.includes('no-image.png')) {
                        e.target.src = getDefaultBookCover();
                        e.target.onerror = null; // Prevent infinite loop
                      }
                    }
                  }}
                >
                  <BookIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {selectedBorrow.book?.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedBorrow.book?.author}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {t('borrowHistory.borrowedOn')}: {format(new Date(selectedBorrow.borrowDate), 'dd.MM.yyyy')}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
          
          {returnSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {t('borrowHistory.returnSuccess')}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseReturnDialog} 
            color="primary"
            disabled={returnLoading}
          >
            {returnSuccess ? t('common.close') : t('common.cancel')}
          </Button>
          {!returnSuccess && (
            <Button 
              onClick={handleReturnBook} 
              color="primary" 
              variant="contained"
              disabled={returnLoading}
              startIcon={returnLoading ? <CircularProgress size={20} /> : null}
            >
              {returnLoading ? t('borrowHistory.returning') : t('borrowHistory.return')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
      
      {/* Диалог продления книги */}
      <Dialog
        open={extendDialogOpen}
        onClose={handleCloseExtendDialog}
        aria-labelledby="extend-dialog-title"
      >
        <DialogTitle id="extend-dialog-title">
          {t('borrowHistory.extendDialogTitle', { defaultValue: 'Продлить срок возврата' })}
        </DialogTitle>
        <DialogContent>
          {selectedBorrow && (
            <Box sx={{ mb: 2 }}>
              <DialogContentText>
                {t('borrowHistory.extendDialogQuestion', { defaultValue: 'Вы хотите продлить срок возврата следующей книги?' })}
              </DialogContentText>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mt: 2,
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: 1
              }}>
                <Avatar 
                  variant="rounded" 
                  src={getCoverUrl(selectedBorrow.book)}
                  sx={{ width: 60, height: 80, mr: 2 }}
                  imgProps={{ 
                    crossOrigin: "anonymous",
                    onError: (e) => {
                      if (e.target && e.target.src && !e.target.src.includes('no-image.png')) {
                        e.target.src = getDefaultBookCover();
                        e.target.onerror = null;
                      }
                    }
                  }}
                >
                  <BookIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {selectedBorrow.book?.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedBorrow.book?.author}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {t('borrowHistory.currentDueDate', { defaultValue: 'Текущий срок возврата' })}: {format(new Date(selectedBorrow.dueDate), 'dd.MM.yyyy')}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
          
          {extendSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {t('borrowHistory.extendSuccess')}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseExtendDialog} 
            color="primary"
            disabled={extendLoading}
          >
            {extendSuccess ? t('common.close') : t('common.cancel')}
          </Button>
          {!extendSuccess && (
            <Button 
              onClick={handleExtendBorrow} 
              color="primary" 
              variant="contained"
              disabled={extendLoading}
              startIcon={extendLoading ? <CircularProgress size={20} /> : null}
            >
              {extendLoading ? t('borrowHistory.extending') : t('borrowHistory.extend')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={message.open}
        autoHideDuration={6000}
        onClose={handleCloseMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseMessage}
          severity={message.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            boxShadow: theme.shadows[6],
            borderRadius: 2
          }}
        >
          {message.text}
        </Alert>
      </Snackbar>
      
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(4px)'
        }}
        open={returnLoading || extendLoading}
      >
        <Paper
          elevation={4}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 3,
            borderRadius: 3
          }}
        >
          <CircularProgress color="primary" sx={{ mb: 2 }} />
          <Typography variant="body2">
            {returnLoading ? t('borrowHistory.returning') : t('borrowHistory.extending')}
          </Typography>
        </Paper>
      </Backdrop>
      </motion.div>
    </Container>
  );
};

export default BorrowHistoryPage;
                  