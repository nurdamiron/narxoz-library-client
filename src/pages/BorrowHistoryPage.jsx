/**
 * src/pages/BorrowHistoryPage.jsx
 * 
 * Кітап қарыздары тарихының беті
 * 
 * Бұл компонент пайдаланушының кітап қарыздары тарихын көрсетеді және
 * қарызға алынған кітаптарды қайтару функционалын қамтамасыз етеді.
 * Ол borrowController.js бэкенд контроллерімен интеграцияланады.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  Tooltip
} from '@mui/material';
import {
  Book as BookIcon,
  CalendarToday,
  EventAvailable,
  EventBusy,
  ArrowBack,
  Refresh,
  ExtensionOutlined,
  CheckCircleOutline
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format, isPast, isFuture, addDays, differenceInDays } from 'date-fns';
import { kk } from 'date-fns/locale';

// Fix import to use methods from the default export
import borrowService from '../services/borrowService';

/**
 * BorrowHistoryPage компоненті
 * 
 * @returns {JSX.Element} - Кітап қарыздары тарихының беті
 */
const BorrowHistoryPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Күйлер
  const [tabValue, setTabValue] = useState(0);
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
  
  useEffect(() => {
    fetchBorrows();
  }, [fetchBorrows]);
  
  /**
   * Таб өзгерісін өңдеу
   */
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
      setReturnSuccess(true);
      
      // Қарыз тізімін жаңарту
      await fetchBorrows();
    } catch (err) {
      console.error('Кітапты қайтару қатесі:', err);
      setError('Кітапты қайтару кезінде қате орын алды');
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
      setExtendSuccess(true);
      
      // Қарыз тізімін жаңарту
      await fetchBorrows();
    } catch (err) {
      console.error('Мерзімді ұзарту қатесі:', err);
      setError('Мерзімді ұзарту кезінде қате орын алды');
    } finally {
      setExtendLoading(false);
      setExtendBorrowId(null);
      setSelectedBorrow(null);
    }
  };
  
  /**
   * Сәтті қайтару хабарламасын жабу
   */
  const handleCloseReturnSuccess = () => {
    setReturnSuccess(false);
  };
  
  /**
   * Сәтті ұзарту хабарламасын жабу
   */
  const handleCloseExtendSuccess = () => {
    setExtendSuccess(false);
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
        icon: <CheckCircleOutline />
      };
    } else if (borrow.status === 'overdue' || (borrow.status === 'active' && isPast(dueDate))) {
      return {
        label: 'Мерзімі өтті',
        color: 'error',
        icon: <EventBusy />
      };
    } else {
      return {
        label: 'Белсенді',
        color: 'primary',
        icon: <EventAvailable />
      };
    }
  };
  
  /**
   * Белгілі бір мәртебедегі қарыздарды алу
   */
  const getFilteredBorrows = () => {
    if (tabValue === 0) {
      // Барлық қарыздар
      return borrows;
    } else if (tabValue === 1) {
      // Белсенді қарыздар
      return borrows.filter(borrow => borrow.status === 'active');
    } else if (tabValue === 2) {
      // Мерзімі өткен қарыздар
      return borrows.filter(borrow => 
        borrow.status === 'overdue' || 
        (borrow.status === 'active' && isPast(new Date(borrow.dueDate)))
      );
    } else {
      // Қайтарылған қарыздар
      return borrows.filter(borrow => borrow.status === 'returned');
    }
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
  
  // Сұрыпталған қарыздар
  const filteredBorrows = getFilteredBorrows();
  
  // Мәртебелер бойынша қарыздар саны
  const activeBorrows = borrows.filter(borrow => borrow.status === 'active').length;
  const overdueBorrows = borrows.filter(borrow => 
    borrow.status === 'overdue' || 
    (borrow.status === 'active' && isPast(new Date(borrow.dueDate)))
  ).length;
  const returnedBorrows = borrows.filter(borrow => borrow.status === 'returned').length;

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
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Қарыз тарихы
          </Typography>
          
          <Tooltip title="Жаңарту">
            <IconButton onClick={fetchBorrows} disabled={loading}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
        
        {/* Қате хабарламасы */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
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
          <Box sx={{ p: 4 }}>
            <Grid container spacing={3}>
              {[1, 2, 3].map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item}>
                  <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 1 }} />
                  <Skeleton variant="text" height={30} width="80%" />
                  <Skeleton variant="text" height={20} width="60%" />
                  <Skeleton variant="text" height={20} width="50%" />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : filteredBorrows.length === 0 ? (
          // Нәтиже жоқ
          <Alert severity="info" sx={{ mt: 2 }}>
            {tabValue === 0 ? 'Қарыз тарихыңыз жоқ.' : 
             tabValue === 1 ? 'Қазіргі уақытта белсенді қарыздарыңыз жоқ.' :
             tabValue === 2 ? 'Мерзімі өткен қарыздарыңыз жоқ.' :
             'Қайтарылған кітаптар тарихы жоқ.'}
          </Alert>
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
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={borrow.id}>
                    <motion.div variants={itemVariants}>
                      <Card sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: theme.shadows[3],
                        position: 'relative'
                      }}>
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
                            fontWeight: 'medium'
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
                              objectFit: 'cover'
                            }}
                          />
                        </Box>
                        
                        <CardContent sx={{ flexGrow: 1 }}>
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
                          
                          <Divider sx={{ my: 1 }} />
                          
                          {/* Қарыз күндері */}
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CalendarToday fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              Алынған күн: {format(new Date(borrow.borrowDate), 'dd.MM.yyyy', { locale: kk })}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarToday fontSize="small" sx={{ 
                              mr: 1, 
                              color: isPast(new Date(borrow.dueDate)) && borrow.status !== 'returned' 
                                ? 'error.main' 
                                : 'text.secondary' 
                            }} />
                            <Typography 
                              variant="body2"
                              color={isPast(new Date(borrow.dueDate)) && borrow.status !== 'returned' 
                                ? 'error' 
                                : 'inherit'
                              }
                            >
                              Қайтару мерзімі: {format(new Date(borrow.dueDate), 'dd.MM.yyyy', { locale: kk })}
                            </Typography>
                          </Box>
                          
                          {/* Қайтару күні, егер қайтарылған болса */}
                          {borrow.returnDate && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <CheckCircleOutline fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
                              <Typography variant="body2" color="success.main">
                                Қайтарылған: {format(new Date(borrow.returnDate), 'dd.MM.yyyy', { locale: kk })}
                              </Typography>
                            </Box>
                          )}
                          
                          {/* Мерзім туралы ақпарат */}
                          {borrow.status === 'active' && (
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                mt: 1,
                                fontWeight: 'medium',
                                color: daysUntilDue <= 3 ? 'warning.main' : 'info.main'
                              }}
                            >
                              {daysUntilDue > 0 
                                ? `Қайтаруға ${daysUntilDue} күн қалды` 
                                : 'Бүгін қайтару қажет'}
                            </Typography>
                          )}
                          
                          {/* Мерзімі өтіп кетсе */}
                          {(borrow.status === 'overdue' || (borrow.status === 'active' && daysUntilDue < 0)) && (
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                mt: 1,
                                fontWeight: 'bold',
                                color: 'error.main'
                              }}
                            >
                              Мерзімі {daysOverdue} күнге кешіктірілді
                            </Typography>
                          )}
                        </CardContent>
                        
                        <CardActions sx={{ p: 2, pt: 0 }}>
                          {/* Қайтару түймесі */}
                          {canReturn && (
                            <Button 
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={() => handleOpenReturnDialog(borrow)}
                              fullWidth
                            >
                              Қайтару
                            </Button>
                          )}
                          
                          {/* Мерзімді ұзарту түймесі */}
                          {canExtend && (
                            <Button 
                              variant="outlined"
                              color="secondary"
                              size="small"
                              startIcon={<ExtensionOutlined />}
                              onClick={() => handleOpenExtendDialog(borrow)}
                              fullWidth
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
      </motion.div>
      
      {/* Кітапты қайтару диалогы */}
      <Dialog
        open={returnDialogOpen}
        onClose={handleCloseReturnDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Кітапты қайтару</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedBorrow?.book?.title} кітабын қайтаруды растаңыз. Бұл әрекетті кейін өзгерту мүмкін емес.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReturnDialog}>
            Жоқ
          </Button>
          <Button 
            onClick={handleReturnBook} 
            color="primary" 
            variant="contained"
            disabled={returnLoading}
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
      >
        <DialogTitle>Қайтару мерзімін ұзарту</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedBorrow?.book?.title} кітабының қайтару мерзімін ұзартуды растаңыз. Мерзім 7 күнге ұзартылады.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseExtendDialog}>
            Жоқ
          </Button>
          <Button 
            onClick={handleExtendBorrow} 
            color="primary" 
            variant="contained"
            disabled={extendLoading}
          >
            {extendLoading ? 'Жүктелуде...' : 'Иә, ұзарту'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Сәтті қайтару хабарламасы */}
      <Snackbar
        open={returnSuccess}
        autoHideDuration={6000}
        onClose={handleCloseReturnSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseReturnSuccess}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Кітап сәтті қайтарылды!
        </Alert>
      </Snackbar>
      
      {/* Сәтті ұзарту хабарламасы */}
      <Snackbar
        open={extendSuccess}
        autoHideDuration={6000}
        onClose={handleCloseExtendSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseExtendSuccess}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Қайтару мерзімі сәтті ұзартылды!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BorrowHistoryPage;