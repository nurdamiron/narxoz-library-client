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
import bookService from '../services/bookService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

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
      console.error('Қарыз тарихын жүктеу қатесі:', err);
      setError('Қарыз тарихын жүктеу кезінде қате орын алды');
    } finally {
      setLoading(false);
    }
  }, []);
  
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
   * Кітапты қайтару
   */
  const handleReturnBook = async () => {
    if (!returnBorrowId) return;
    
    try {
      setReturnLoading(true);
      
      // API арқылы кітапты қайтару
      await borrowService.returnBook(returnBorrowId);
      
      // Диалогты жабу
      setReturnDialogOpen(false);
      
      // Сәтті хабарламаны көрсету
      showMessage('Кітап сәтті қайтарылды!', 'success');
      
      // Қарыз тізімін жаңарту
      await fetchBorrows();
    } catch (err) {
      console.error('Кітапты қайтару қатесі:', err);
      showMessage('Кітапты қайтару кезінде қате орын алды', 'error');
    } finally {
      setReturnLoading(false);
      setReturnBorrowId(null);
      setSelectedBorrow(null);
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
   * Мерзімді ұзарту
   */
  const handleExtendBorrow = async () => {
    if (!extendBorrowId) return;
    
    try {
      setExtendLoading(true);
      
      // API арқылы мерзімді ұзарту
      await borrowService.extendBorrow(extendBorrowId);
      
      // Диалогты жабу
      setExtendDialogOpen(false);
      
      // Сәтті хабарламаны көрсету
      showMessage('Қайтару мерзімі сәтті ұзартылды!', 'success');
      
      // Қарыз тізімін жаңарту
      await fetchBorrows();
    } catch (err) {
      console.error('Мерзімді ұзарту қатесі:', err);
      showMessage('Мерзімді ұзарту кезінде қате орын алды', 'error');
    } finally {
      setExtendLoading(false);
      setExtendBorrowId(null);
      setSelectedBorrow(null);
    }
  };
  
  /**
   * Кітапты бетбелгіге қосу
   */
  const handleAddToBookmarks = async (bookId) => {
    try {
      await bookService.addToBookmarks(bookId);
      showMessage('Кітап бетбелгіге қосылды', 'success');
    } catch (err) {
      console.error('Бетбелгіге қосу қатесі:', err);
      showMessage('Кітапты бетбелгіге қосу кезінде қате орын алды', 'error');
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
    return book?.cover
      ? `/uploads/books/${book.cover}`
      : '/images/default-book-cover.jpg';
  };
  
  /**
   * Қарыз мәртебесін алу
   */
  const getBorrowStatus = (borrow) => {
    const currentDate = new Date();
    const dueDate = new Date(borrow.dueDate);
    
    if (borrow.status === 'returned') {
      return {
        label: 'Қайтарылды',
        color: 'success',
        icon: <CheckCircleOutline />,
        bg: alpha(theme.palette.success.main, 0.08)
      };
    } else if (borrow.status === 'overdue' || (borrow.status === 'active' && isPast(dueDate))) {
      return {
        label: 'Мерзімі өтті',
        color: 'error',
        icon: <EventBusy />,
        bg: alpha(theme.palette.error.main, 0.08)
      };
    } else {
      return {
        label: 'Белсенді',
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
      // Мерзімі өткен қарыздар
      filtered = borrows.filter(borrow => 
        borrow.status === 'overdue' || 
        (borrow.status === 'active' && isPast(new Date(borrow.dueDate)))
      );
    } else {
      // Қайтарылған қарыздар
      filtered = borrows.filter(borrow => borrow.status === 'returned');
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
        return `${days} күн бұрын мерзімі өтіп кетті`;
      } else {
        return 'Бүгін мерзімі өтіп кетті';
      }
    }
    
    // Мерзімге дейін
    const days = getDaysUntilDue(dueDate);
    if (days === 0) {
      return 'Бүгін мерзімі аяқталады';
    } else if (days === 1) {
      return 'Ертең мерзімі аяқталады';
    } else {
      return `${days} күн қалды`;
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
        {/* Беттің тақырыбы */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', md: 'center' },
          mb: 3,
          gap: 2
        }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              Қарыз тарихы
            </Typography>
            
            {overdueBorrows > 0 && (
              <Typography variant="subtitle1" color="error.main" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <Badge badgeContent={overdueBorrows} color="error" sx={{ mr: 1 }}>
                  <EventBusy />
                </Badge>
                Мерзімі өткен кітаптарды қайтарыңыз
              </Typography>
            )}
          </Box>
          
          {/* Іздеу және сұрыптау */}
          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            width: { xs: '100%', md: 'auto' }
          }}>
            <TextField
              placeholder="Іздеу..."
              value={searchTerm}
              onChange={handleSearchChange}
              size="small"
              sx={{ width: { xs: '100%', md: 200 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="clear search"
                      onClick={handleClearSearch}
                      edge="end"
                      size="small"
                    >
                      <Clear fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControl size="small" sx={{ minWidth: 120, display: { xs: 'none', sm: 'flex' } }}>
              <InputLabel id="sort-label">Сұрыптау</InputLabel>
              <Select
                labelId="sort-label"
                id="sort-select"
                value={sort}
                label="Сұрыптау"
                onChange={handleSortChange}
                startAdornment={
                  <InputAdornment position="start">
                    <Sort fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="dueDate">Мерзімі бойынша</MenuItem>
                <MenuItem value="borrowDate">Алынған күн бойынша</MenuItem>
                <MenuItem value="title">Атауы бойынша</MenuItem>
                <MenuItem value="author">Автор бойынша</MenuItem>
                <MenuItem value="status">Мәртебесі бойынша</MenuItem>
              </Select>
            </FormControl>
            
            <Tooltip title="Жаңарту">
              <IconButton 
                onClick={fetchBorrows} 
                disabled={loading}
                color="primary"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : <Refresh />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        {/* Қате хабарламасы */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2
            }}
          >
            {error}
          </Alert>
        )}
        
        {/* Таб панелі */}
        <Paper sx={{ 
          mb: 3, 
          borderRadius: 2,
          overflow: 'hidden'
        }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
            allowScrollButtonsMobile
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab 
              label={`Барлығы (${borrows.length})`} 
              icon={<BookIcon />} 
              iconPosition="start"
            />
            <Tab 
              label={`Белсенді (${activeBorrows})`} 
              icon={<EventAvailable />} 
              iconPosition="start"
            />
            <Tab 
              label={`Мерзімі өткен (${overdueBorrows})`} 
              icon={<EventBusy />} 
              iconPosition="start"
              sx={{ color: overdueBorrows > 0 ? 'error.main' : 'inherit' }}
            />
            <Tab 
              label={`Қайтарылған (${returnedBorrows})`} 
              icon={<CheckCircleOutline />} 
              iconPosition="start"
            />
          </Tabs>
        </Paper>
        
        {/* Жүктелу күйі */}
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
          // Нәтиже жоқ
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
                ? 'Қарыз тарихыңыз жоқ' 
                : tabValue === 1 
                ? 'Белсенді қарыздарыңыз жоқ' 
                : tabValue === 2 
                ? 'Мерзімі өткен қарыздарыңыз жоқ' 
                : 'Қайтарылған кітаптар жоқ'}
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
              {searchTerm 
                ? `Іздеу бойынша "${searchTerm}" нәтижелер табылмады.`
                : tabValue === 0 
                ? 'Сіз әлі кітапханадан кітап алған жоқсыз. Кітаптарды алу үшін каталогқа өтіңіз.'
                : tabValue === 1 
                ? 'Қазіргі уақытта сізде белсенді қарыздар жоқ. Кітап алу үшін каталогты қараңыз.'
                : tabValue === 2 
                ? 'Жақсы жаңалық! Сізде мерзімі өткен қарыздар жоқ.'
                : 'Сіз әлі бірде-бір кітапты қайтармадыңыз.'}
            </Typography>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<BookIcon />}
              onClick={() => navigate('/books')}
              sx={{ mb: 2 }}
            >
              Кітап каталогына өту
            </Button>
          </Paper>
        ) : (
          // Қарыздар тізімі
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
                const canExtend = borrow.status === 'active' && daysUntilDue > 0;
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
                        {/* Прогресс индикаторы */}
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
                        
                        {/* Мәртебе чипі */}
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
                        
                        {/* Кітап мұқабасы */}
                        <Box sx={{ position: 'relative', pt: '60%' }}>
                          <CardMedia
                            component="img"
                            image={getCoverUrl(borrow.book)}
                            alt={borrow.book?.title}
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
                          {/* Кітап атауы және авторы */}
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
                          
                          {/* Қарыз мерзімі туралы ақпарат */}
                          <Box sx={{ my: 1 }}>
                            {/* Алынған күн */}
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
                                Алынған: {format(new Date(borrow.borrowDate), 'dd.MM.yyyy', { locale: kk })}
                              </Typography>
                            </Box>
                            
                            {/* Қайтару мерзімі */}
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
                                Мерзімі: {format(new Date(borrow.dueDate), 'dd.MM.yyyy', { locale: kk })}
                              </Typography>
                            </Box>
                            
                            {/* Қайтарылған күн */}
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
                                  Қайтарылған: {format(new Date(borrow.returnDate), 'dd.MM.yyyy', { locale: kk })}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                          
                          {/* Мерзім жағдайы */}
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
                                    Мерзімі {daysOverdue} күнге кешіктірілді
                                  </Typography>
                                )}
                              </Box>
                            </Fade>
                          )}
                          
                          {/* Қосымша ақпарат - жайылған кезде көрінеді */}
                          <Collapse in={isExpanded}>
                            <Box sx={{ mt: 1.5 }}>
                              <Divider sx={{ mb: 1.5 }} />
                              
                              {/* Кітап туралы қосымша ақпарат */}
                              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                Кітап туралы ақпарат
                              </Typography>
                              
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1.5 }}>
                                {borrow.book?.genre && (
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Жанр:</Typography>
                                    <Typography variant="body2">{borrow.book.genre}</Typography>
                                  </Box>
                                )}
                                
                                {borrow.book?.publisher && (
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Баспа:</Typography>
                                    <Typography variant="body2">{borrow.book.publisher}</Typography>
                                  </Box>
                                )}
                                
                                {borrow.book?.publicationYear && (
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Жыл:</Typography>
                                    <Typography variant="body2">{borrow.book.publicationYear}</Typography>
                                  </Box>
                                )}
                                
                                {borrow.book?.ISBN && (
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">ISBN:</Typography>
                                    <Typography variant="body2">{borrow.book.ISBN}</Typography>
                                  </Box>
                                )}
                              </Box>
                              
                              {borrow.book?.description && (
                                <>
                                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                    Сипаттама
                                  </Typography>
                                  
                                  <Typography variant="body2" color="text.secondary" paragraph>
                                    {borrow.book.description.length > 150
                                      ? `${borrow.book.description.substring(0, 150)}...`
                                      : borrow.book.description}
                                  </Typography>
                                </>
                              )}
                              
                              {/* Кітапты бетбелгіге қосу */}
                              <Button
                                startIcon={<BookmarkBorder />}
                                variant="outlined"
                                size="small"
                                fullWidth
                                onClick={() => handleAddToBookmarks(borrow.bookId)}
                                sx={{ mt: 1 }}
                              >
                                Бетбелгіге қосу
                              </Button>
                            </Box>
                          </Collapse>
                        </CardContent>
                        
                        <CardActions sx={{ p: 2, pt: 0 }}>
                          {/* Кеңейту түймесі */}
                          <Button
                            size="small"
                            onClick={() => toggleCardExpansion(borrow.id)}
                            endIcon={isExpanded ? <ExpandLess /> : <ExpandMore />}
                            sx={{ mr: 'auto' }}
                          >
                            {isExpanded ? 'Жию' : 'Толығырақ'}
                          </Button>
                          
                          {/* Қайтару және ұзарту түймелері */}
                          {canReturn && (
                            <Button 
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={() => handleOpenReturnDialog(borrow)}
                              startIcon={<CheckCircleOutline />}
                            >
                              Қайтару
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
                              Ұзарту
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
      
      {/* Кітапты қайтару диалогы */}
      <Dialog
        open={returnDialogOpen}
        onClose={handleCloseReturnDialog}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">Кітапты қайтару</Typography>
        </DialogTitle>
        
        <DialogContent>
          {selectedBorrow && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={getCoverUrl(selectedBorrow.book)}
                alt={selectedBorrow.book?.title}
                variant="rounded"
                sx={{ width: 60, height: 80, mr: 2 }}
              />
              <Box>
                <Typography variant="subtitle1" fontWeight="medium">
                  {selectedBorrow.book?.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedBorrow.book?.author}
                </Typography>
              </Box>
            </Box>
          )}
          
          <DialogContentText>
            Бұл кітапты қайтаруды растаңыз. Бұл әрекетті кейін өзгерту мүмкін емес.
          </DialogContentText>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseReturnDialog}
            variant="outlined"
          >
            Болдырмау
          </Button>
          <Button 
            onClick={handleReturnBook} 
            color="primary" 
            variant="contained"
            disabled={returnLoading}
            startIcon={returnLoading ? <CircularProgress size={20} /> : <CheckCircleOutline />}
          >
            {returnLoading ? 'Жүктелуде...' : 'Иә, қайтару'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Мерзімді ұзарту диалогы */}
      <Dialog
        open={extendDialogOpen}
        onClose={handleCloseExtendDialog}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">Қайтару мерзімін ұзарту</Typography>
        </DialogTitle>
        
        <DialogContent>
          {selectedBorrow && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={getCoverUrl(selectedBorrow.book)}
                alt={selectedBorrow.book?.title}
                variant="rounded"
                sx={{ width: 60, height: 80, mr: 2 }}
              />
              <Box>
                <Typography variant="subtitle1" fontWeight="medium">
                  {selectedBorrow.book?.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedBorrow.book?.author}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <CalendarToday fontSize="small" sx={{ mr: 1, fontSize: '0.8rem', color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    Ағымдағы мерзім: {format(new Date(selectedBorrow.dueDate), 'dd.MM.yyyy', { locale: kk })}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
          
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Қайтару мерзімі <strong>7 күнге</strong> ұзартылады. 
              {selectedBorrow && (
                <span> Жаңа мерзім: <strong>{
                  format(addDays(new Date(selectedBorrow.dueDate), 7), 'dd.MM.yyyy', { locale: kk })
                }</strong> болады.</span>
              )}
            </Typography>
          </Alert>
          
          <DialogContentText>
            Бұл кітаптың қайтару мерзімін ұзартуды растаңыз.
          </DialogContentText>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseExtendDialog}
            variant="outlined"
          >
            Болдырмау
          </Button>
          <Button 
            onClick={handleExtendBorrow} 
            color="primary" 
            variant="contained"
            disabled={extendLoading}
            startIcon={extendLoading ? <CircularProgress size={20} /> : <ExtensionOutlined />}
          >
            {extendLoading ? 'Жүктелуде...' : 'Иә, ұзарту'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Хабарламалар */}
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
      
      {/* Жою кезіндегі жүктелу индикаторы */}
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
            {returnLoading ? 'Кітап қайтарылуда...' : 'Мерзім ұзартылуда...'}
          </Typography>
        </Paper>
      </Backdrop>
      </motion.div>
    </Container>
  );
};

export default BorrowHistoryPage;
                  