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
  Snackbar
} from '@mui/material';
import { 
  CheckCircle as ApproveIcon, 
  DoDisturbOn as RejectIcon, 
  Visibility as ViewIcon,
  History as HistoryIcon,
  Send as SendIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import PageHeader from '../../components/common/PageHeader';
import adminBorrowService from '../../services/adminBorrowService';
import { useTranslation } from 'react-i18next';

/**
 * Қарызға алуларды басқару беті
 */
const BorrowsPage = () => {
  const { t } = useTranslation();
  // Күй айнымалылары
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedBorrow, setSelectedBorrow] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [openReturnDialog, setOpenReturnDialog] = useState(false);
  const [openSendNotificationDialog, setOpenSendNotificationDialog] = useState(false);
  const [notificationText, setNotificationText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Компонент монтаждалған кезде қарызға алуларды жүктеу
  useEffect(() => {
    fetchBorrows();
  }, [page, rowsPerPage, statusFilter]);

  /**
   * Қарызға алулар тізімін жүктеу
   */
  const fetchBorrows = async () => {
    try {
      setLoading(true);
      
      // Сұраныс параметрлерін құру
      const params = {
        page: page + 1,
        limit: rowsPerPage
      };
      
      // Статус сүзгісін қосу
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      // API сұранысын жіберу
      const response = await adminBorrowService.getAllBorrows(params);
      
      if (response.success) {
        setBorrows(response.data);
        setTotalCount(response.total || response.count);
      } else {
        showSnackbar(t('admin.borrowsLoadError', 'Қарызға алулар тізімін жүктеу қатесі'), 'error');
      }
    } catch (error) {
      console.error(t('admin.errorFetchingBorrows', 'Error fetching borrows:'), error);
      showSnackbar(t('admin.borrowsLoadError', 'Қарызға алулар тізімін жүктеу қатесі'), 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Мерзімі өткен қарызға алуларды тексеру
   */
  const handleCheckOverdue = async () => {
    try {
      setLoading(true);
      const response = await adminBorrowService.checkOverdueBorrows();
      
      if (response.success) {
        showSnackbar(
          t('admin.overdueChecked', { count: response.updatedCount }, 'Мерзімі өткен қарызға алулар тексерілді. {{count}} жазба жаңартылды.'),
          'success'
        );
        fetchBorrows();
      } else {
        showSnackbar(t('admin.errorCheckingOverdue', 'Мерзімі өткен қарызға алуларды тексеру қатесі'), 'error');
      }
    } catch (error) {
      console.error(t('admin.errorCheckingOverdue', 'Error checking overdue borrows:'), error);
      showSnackbar(t('admin.errorCheckingOverdue', 'Мерзімі өткен қарызға алуларды тексеру қатесі'), 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Еске салу хабарландыруларын жіберу
   */
  const handleSendReminders = async () => {
    try {
      setLoading(true);
      const response = await adminBorrowService.sendDueReminders();
      
      if (response.success) {
        let message = '';
        
        // Детальное сообщение о результатах
        if (response.count === 0) {
          message = t('admin.noRemindersNeeded', 'Нет заимствований, требующих напоминания.');
        } else if (response.notificationsCreated > 0 || response.emailsSent > 0) {
          const parts = [];
          
          if (response.notificationsCreated > 0) {
            parts.push(t('admin.notificationsCreatedCount', { count: response.notificationsCreated }, '{{count}} уведомлений создано'));
          }
          
          if (response.emailsSent > 0) {
            parts.push(t('admin.emailsSentCount', { count: response.emailsSent }, '{{count}} email отправлено'));
          }
          
          message = t('admin.remindersSentDetails', 'Напоминания отправлены: ') + parts.join(', ');
        } else if (response.count > 0 && response.notificationsCreated === 0) {
          message = t('admin.remindersAlreadySent', 'Напоминания уже были отправлены для всех найденных заимствований.');
        } else {
          message = t('admin.remindersProcessed', { count: response.count }, 'Обработано {{count}} заимствований.');
        }
        
        showSnackbar(message, 'success');
      } else {
        showSnackbar(t('admin.errorSendingReminders', 'Еске салу хабарландыруларын жіберу қатесі'), 'error');
      }
    } catch (error) {
      console.error(t('admin.errorSendingReminders', 'Error sending reminders:'), error);
      showSnackbar(t('admin.errorSendingReminders', 'Еске салу хабарландыруларын жіберу қатесі'), 'error');
    } finally {
      setLoading(false);
    }
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
   * Қарызға алуды бекіту
   */
  const handleApproveBorrow = async (borrowId) => {
    try {
      setLoading(true);
      const response = await adminBorrowService.updateBorrow(borrowId, { status: 'active' });
      
      if (response.success) {
        showSnackbar(t('admin.borrowApproveSuccess', 'Қарызға алу сәтті бекітілді'), 'success');
        fetchBorrows();
      } else {
        showSnackbar(t('admin.borrowApproveError', 'Қарызға алуды бекіту қатесі'), 'error');
      }
    } catch (error) {
      console.error(t('admin.errorApprovingBorrow', 'Error approving borrow:'), error);
      showSnackbar(t('admin.borrowApproveError', 'Қарызға алуды бекіту қатесі'), 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Қарызға алуды қабылдамау
   */
  const handleRejectBorrow = async () => {
    try {
      if (!selectedBorrow) return;
      
      setLoading(true);
      const response = await adminBorrowService.updateBorrow(
        selectedBorrow.id, 
        { status: 'rejected', notes: rejectReason }
      );
      
      if (response.success) {
        showSnackbar(t('admin.borrowRejectSuccess', 'Қарызға алу қабылданбады'), 'success');
        fetchBorrows();
        setOpenRejectDialog(false);
        setRejectReason('');
      } else {
        showSnackbar(t('admin.borrowRejectError', 'Қарызға алуды қабылдамау қатесі'), 'error');
      }
    } catch (error) {
      console.error(t('admin.errorRejectingBorrow', 'Error rejecting borrow:'), error);
      showSnackbar(t('admin.borrowRejectError', 'Қарызға алуды қабылдамау қатесі'), 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Кітап қайтаруды растау
   */
  const handleConfirmReturn = async () => {
    try {
      if (!selectedBorrow) return;
      
      setLoading(true);
      const response = await adminBorrowService.updateBorrow(
        selectedBorrow.id, 
        { status: 'returned', returnDate: new Date().toISOString() }
      );
      
      if (response.success) {
        showSnackbar(t('admin.borrowReturnSuccess', 'Кітап қайтару сәтті расталды'), 'success');
        fetchBorrows();
        setOpenReturnDialog(false);
      } else {
        showSnackbar(t('admin.borrowReturnError', 'Кітап қайтаруды растау қатесі'), 'error');
      }
    } catch (error) {
      console.error(t('admin.errorReturningBorrow', 'Error confirming return:'), error);
      showSnackbar(t('admin.borrowReturnError', 'Кітап қайтаруды растау қатесі'), 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Хабарландыру жіберу
   */
  const handleSendNotification = async () => {
    try {
      if (!selectedBorrow || !notificationText.trim()) return;
      
      setLoading(true);
      const response = await adminBorrowService.sendNotification(
        selectedBorrow.userId,
        selectedBorrow.id,
        notificationText
      );
      
      if (response.success) {
        showSnackbar(t('admin.notificationSentSuccess', 'Хабарландыру сәтті жіберілді'), 'success');
        setOpenSendNotificationDialog(false);
        setNotificationText('');
      } else {
        showSnackbar(t('admin.notificationSentError', 'Хабарландыру жіберу қатесі'), 'error');
      }
    } catch (error) {
      console.error(t('admin.errorSendingNotification', 'Error sending notification:'), error);
      showSnackbar(t('admin.notificationSentError', 'Хабарландыру жіберу қатесі'), 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Қарызға алу мәліметтерін көрсету
   */
  const openBorrowDetailsDialog = (borrow) => {
    setSelectedBorrow(borrow);
    setOpenDetailsDialog(true);
  };

  /**
   * Қарызға алуды қабылдамау диалогын ашу
   */
  const openRejectBorrowDialog = (borrow) => {
    setSelectedBorrow(borrow);
    setRejectReason('');
    setOpenRejectDialog(true);
  };

  /**
   * Кітап қайтару диалогын ашу
   */
  const openReturnBorrowDialog = (borrow) => {
    setSelectedBorrow(borrow);
    setOpenReturnDialog(true);
  };

  /**
   * Хабарландыру жіберу диалогын ашу
   */
  const openNotificationDialog = (borrow) => {
    setSelectedBorrow(borrow);
    setNotificationText('');
    setOpenSendNotificationDialog(true);
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

  /**
   * Статус түсін алу
   */
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'primary';
      case 'returned':
        return 'success';
      case 'overdue':
        return 'error';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  /**
   * Статусты аудару
   */
  const getStatusTranslation = (status) => {
    switch (status) {
      case 'pending':
        return t('admin.statusPending', 'Күтуде');
      case 'active':
        return t('admin.statusActive', 'Берілген');
      case 'overdue':
        return t('admin.statusOverdue', 'Мерзімі өткен');
      case 'returned':
        return t('admin.statusReturned', 'Қайтарылған');
      case 'rejected':
        return t('admin.statusRejected', 'Қабылданбаған');
      default:
        return status;
    }
  };

  /**
   * Күнді форматтау
   */
  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), 'dd.MM.yyyy');
    } catch (error) {
      console.error(t('admin.errorFormattingDate', 'Күнді форматтау қатесі:'), error);
      return dateString;
    }
  };

  return (
    <Container maxWidth="xl">
      <PageHeader 
        title={t('admin.borrows', 'Заимствования')} 
        subtitle={t('admin.borrowsDescription', 'Обработка запросов на книги, возвратов и уведомлений')}
      />
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 1 }}>
          <Box>
            <Typography variant="h6">{t('admin.borrowsList', 'Список заимствований')}</Typography>
            {process.env.NODE_ENV === 'development' && (
              <Typography variant="caption" color="text.secondary">
                {process.env.REACT_APP_DISABLE_EMAIL === 'true' 
                  ? t('admin.emailMode.disabled', 'Email отправка отключена (режим разработки)')
                  : t('admin.emailMode.enabled', 'Email отправка включена')
                }
              </Typography>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<HistoryIcon />}
              onClick={handleCheckOverdue}
              disabled={loading}
            >
              {t('admin.borrowActions.checkOverdue', 'Проверить просроченные')}
            </Button>
            
            <Button
              variant="outlined"
              color="info"
              startIcon={<SendIcon />}
              onClick={handleSendReminders}
              disabled={loading}
            >
              {t('admin.borrowActions.sendReminders', 'Отправить напоминания')}
            </Button>
            
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<RefreshIcon />}
              onClick={fetchBorrows}
              disabled={loading}
            >
              {t('admin.borrowActions.refresh', 'Обновить')}
            </Button>
            
            <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="status-filter-label">{t('admin.borrowStatus', 'Статус')}</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label={t('admin.borrowStatus', 'Статус')}
              >
                <MenuItem value="all">{t('admin.filterAll', 'Все')}</MenuItem>
                <MenuItem value="pending">{t('admin.statusPending', 'Ожидание')}</MenuItem>
                <MenuItem value="active">{t('admin.statusActive', 'Выдано')}</MenuItem>
                <MenuItem value="overdue">{t('admin.statusOverdue', 'Просрочено')}</MenuItem>
                <MenuItem value="returned">{t('admin.statusReturned', 'Возвращено')}</MenuItem>
                <MenuItem value="rejected">{t('admin.statusRejected', 'Отклонено')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="borrows table">
            <TableHead>
              <TableRow>
                <TableCell>{t('admin.id', 'ID')}</TableCell>
                <TableCell>{t('admin.borrowUser', 'Пайдаланушы')}</TableCell>
                <TableCell>{t('admin.borrowBook', 'Кітап')}</TableCell>
                <TableCell>{t('admin.borrowDate', 'Берілген күні')}</TableCell>
                <TableCell>{t('admin.dueDate', 'Қайтару мерзімі')}</TableCell>
                <TableCell>{t('admin.borrowStatus', 'Мәртебесі')}</TableCell>
                <TableCell>{t('admin.actions', 'Әрекеттер')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">{t('common.loading', 'Жүктелуде...')}</TableCell>
                </TableRow>
              ) : borrows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">{t('admin.noBorrows', 'Қарызға алулар табылмады')}</TableCell>
                </TableRow>
              ) : (
                borrows.map((borrow) => (
                  <TableRow key={borrow.id}>
                    <TableCell>{borrow.id}</TableCell>
                    <TableCell>{borrow.user?.firstName} {borrow.user?.lastName}</TableCell>
                    <TableCell>{borrow.book?.title}</TableCell>
                    <TableCell>{formatDate(borrow.borrowDate)}</TableCell>
                    <TableCell>{formatDate(borrow.dueDate)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={getStatusTranslation(borrow.status)} 
                        color={getStatusColor(borrow.status)} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        aria-label="view details" 
                        color="info"
                        onClick={() => openBorrowDetailsDialog(borrow)}
                        title={t('admin.viewReview', 'Мәліметтерді көру')}
                      >
                        <ViewIcon />
                      </IconButton>
                      
                      {borrow.status === 'pending' && (
                        <>
                          <IconButton 
                            aria-label="approve" 
                            color="success"
                            onClick={() => handleApproveBorrow(borrow.id)}
                            title={t('admin.approve', 'Бекіту')}
                          >
                            <ApproveIcon />
                          </IconButton>
                          <IconButton 
                            aria-label="reject" 
                            color="error"
                            onClick={() => openRejectBorrowDialog(borrow)}
                            title={t('admin.reject', 'Қабылдамау')}
                          >
                            <RejectIcon />
                          </IconButton>
                        </>
                      )}
                      
                      {borrow.status === 'active' && (
                        <IconButton 
                          aria-label="return" 
                          color="primary"
                          onClick={() => openReturnBorrowDialog(borrow)}
                          title={t('admin.return', 'Қайтаруды растау')}
                        >
                          <HistoryIcon />
                        </IconButton>
                      )}
                      
                      {(borrow.status === 'active' || borrow.status === 'overdue') && (
                        <IconButton 
                          aria-label="send notification" 
                          color="secondary"
                          onClick={() => openNotificationDialog(borrow)}
                          title={t('admin.sendNotification', 'Хабарландыру жіберу')}
                        >
                          <SendIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t('pagination.rowsPerPage', 'Бет сайын:')}
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('pagination.of', '/')} ${count}`}
        />
      </Paper>

      {/* Қарызға алу мәліметтерін көрсету диалогы */}
      <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)} maxWidth="md">
        <DialogTitle>{t('admin.borrowDetails', 'Қарызға алу мәліметтері')}</DialogTitle>
        <DialogContent>
          {selectedBorrow && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {t('admin.borrowUser', 'Пайдаланушы')}:
                </Typography>
                <Typography variant="body1">{selectedBorrow.user?.firstName} {selectedBorrow.user?.lastName}</Typography>
                <Typography variant="body2" color="text.secondary">{selectedBorrow.user?.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {t('admin.borrowBook', 'Кітап')}:
                </Typography>
                <Typography variant="body1">{selectedBorrow.book?.title}</Typography>
                <Typography variant="body2" color="text.secondary">{t('books.author', 'Автор')}: {selectedBorrow.book?.author}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {t('admin.borrowDate', 'Берілген күні')}:
                </Typography>
                <Typography variant="body1">{formatDate(selectedBorrow.borrowDate) || t('admin.notIssued', 'Берілмеген')}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {t('admin.dueDate', 'Қайтару мерзімі')}:
                </Typography>
                <Typography variant="body1">{formatDate(selectedBorrow.dueDate) || t('admin.notSet', 'Орнатылмаған')}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {t('admin.returnDate', 'Қайтарылған күні')}:
                </Typography>
                <Typography variant="body1">{formatDate(selectedBorrow.returnDate) || t('admin.notReturned', 'Қайтарылмаған')}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {t('admin.borrowStatus', 'Мәртебесі')}:
                </Typography>
                <Chip 
                  label={getStatusTranslation(selectedBorrow.status)} 
                  color={getStatusColor(selectedBorrow.status)} 
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {t('admin.notes', 'Ескертпелер')}:
                </Typography>
                <Typography variant="body1">{selectedBorrow.notes || t('admin.noNotes', 'Ескертпелер жоқ')}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)}>{t('common.close', 'Жабу')}</Button>
        </DialogActions>
      </Dialog>

      {/* Қарызға алуды қабылдамау диалогы */}
      <Dialog
        open={openRejectDialog}
        onClose={() => setOpenRejectDialog(false)}
        aria-labelledby="reject-dialog-title"
      >
        <DialogTitle id="reject-dialog-title">{t('admin.reject', 'Қарызға алуды қабылдамау')}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {t('admin.rejectConfirm', {
              book: selectedBorrow?.book?.title,
              user: `${selectedBorrow?.user?.firstName} ${selectedBorrow?.user?.lastName}`
            }, '"{{book}}" кітабына {{user}} пайдаланушысының сұранысын қабылдамауға сенімдісіз бе?')}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label={t('admin.rejectReason', 'Қабылдамау себебі')}
            fullWidth
            multiline
            rows={2}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRejectDialog(false)}>{t('common.cancel', 'Бас тарту')}</Button>
          <Button onClick={handleRejectBorrow} color="error" autoFocus>
            {t('admin.reject', 'Қабылдамау')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Кітап қайтаруды растау диалогы */}
      <Dialog
        open={openReturnDialog}
        onClose={() => setOpenReturnDialog(false)}
        aria-labelledby="return-dialog-title"
      >
        <DialogTitle id="return-dialog-title">{t('admin.returnConfirmation', 'Қайтаруды растау')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('admin.returnConfirm', {
              user: `${selectedBorrow?.user?.firstName} ${selectedBorrow?.user?.lastName}`,
              book: selectedBorrow?.book?.title
            }, '{{user}} пайдаланушысының "{{book}}" кітабын қайтаруын растайсыз ба?')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReturnDialog(false)}>{t('common.cancel', 'Бас тарту')}</Button>
          <Button onClick={handleConfirmReturn} color="primary" autoFocus>
            {t('common.confirm', 'Растау')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Хабарландыру жіберу диалогы */}
      <Dialog
        open={openSendNotificationDialog}
        onClose={() => setOpenSendNotificationDialog(false)}
        aria-labelledby="notification-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="notification-dialog-title">
          {t('admin.sendNotificationTo', {
            user: `${selectedBorrow?.user?.firstName} ${selectedBorrow?.user?.lastName}`
          }, '{{user}} пайдаланушысына хабарландыру жіберу')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {t('admin.notificationForBook', {
              book: selectedBorrow?.book?.title
            }, '"{{book}}" кітабы туралы пайдаланушыға хабарландыру мәтінін жазыңыз.')}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label={t('admin.notificationText', 'Хабарландыру мәтіні')}
            fullWidth
            multiline
            rows={4}
            value={notificationText}
            onChange={(e) => setNotificationText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSendNotificationDialog(false)}>{t('common.cancel', 'Бас тарту')}</Button>
          <Button 
            onClick={handleSendNotification} 
            color="primary" 
            disabled={!notificationText.trim()}
          >
            {t('common.send', 'Жіберу')}
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

export default BorrowsPage;