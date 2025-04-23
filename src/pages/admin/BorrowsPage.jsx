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

/**
 * Қарызға алуларды басқару беті
 */
const BorrowsPage = () => {
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
        showSnackbar('Қарызға алулар тізімін жүктеу қатесі', 'error');
      }
    } catch (error) {
      console.error('Error fetching borrows:', error);
      showSnackbar('Қарызға алулар тізімін жүктеу қатесі', 'error');
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
        showSnackbar(`Мерзімі өткен қарызға алулар тексерілді. ${response.updatedCount} жазба жаңартылды.`, 'success');
        fetchBorrows();
      } else {
        showSnackbar('Мерзімі өткен қарызға алуларды тексеру қатесі', 'error');
      }
    } catch (error) {
      console.error('Error checking overdue borrows:', error);
      showSnackbar('Мерзімі өткен қарызға алуларды тексеру қатесі', 'error');
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
        showSnackbar(`Еске салу хабарландырулары жіберілді. ${response.notificationsCreated} хабарландыру жасалды.`, 'success');
      } else {
        showSnackbar('Еске салу хабарландыруларын жіберу қатесі', 'error');
      }
    } catch (error) {
      console.error('Error sending reminders:', error);
      showSnackbar('Еске салу хабарландыруларын жіберу қатесі', 'error');
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
        showSnackbar('Қарызға алу сәтті бекітілді', 'success');
        fetchBorrows();
      } else {
        showSnackbar('Қарызға алуды бекіту қатесі', 'error');
      }
    } catch (error) {
      console.error('Error approving borrow:', error);
      showSnackbar('Қарызға алуды бекіту қатесі', 'error');
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
        showSnackbar('Қарызға алу қабылданбады', 'success');
        fetchBorrows();
        setOpenRejectDialog(false);
        setRejectReason('');
      } else {
        showSnackbar('Қарызға алуды қабылдамау қатесі', 'error');
      }
    } catch (error) {
      console.error('Error rejecting borrow:', error);
      showSnackbar('Қарызға алуды қабылдамау қатесі', 'error');
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
        showSnackbar('Кітап қайтару сәтті расталды', 'success');
        fetchBorrows();
        setOpenReturnDialog(false);
      } else {
        showSnackbar('Кітап қайтаруды растау қатесі', 'error');
      }
    } catch (error) {
      console.error('Error confirming return:', error);
      showSnackbar('Кітап қайтаруды растау қатесі', 'error');
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
        showSnackbar('Хабарландыру сәтті жіберілді', 'success');
        setOpenSendNotificationDialog(false);
        setNotificationText('');
      } else {
        showSnackbar('Хабарландыру жіберу қатесі', 'error');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      showSnackbar('Хабарландыру жіберу қатесі', 'error');
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
   * Статусты қазақ тіліне аудару
   */
  const getStatusTranslation = (status) => {
    switch (status) {
      case 'active':
        return 'Берілген';
      case 'returned':
        return 'Қайтарылған';
      case 'overdue':
        return 'Мерзімі өткен';
      case 'pending':
        return 'Күтуде';
      case 'rejected':
        return 'Қабылданбаған';
      default:
        return status;
    }
  };

  /**
   * Күнді форматтау
   */
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd.MM.yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Container maxWidth="lg">
      <PageHeader 
        title="Қарызға алуларды басқару" 
        subtitle="Кітап сұраныстарын, қайтаруларды және хабарландыруларды өңдеу"
      />

      <Paper elevation={3} sx={{ mb: 4, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Қарызға алулар тізімі</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              color="primary" 
              startIcon={<RefreshIcon />}
              onClick={handleCheckOverdue}
            >
              Мерзімі өткендерді тексеру
            </Button>
            <Button 
              variant="outlined" 
              color="secondary" 
              startIcon={<SendIcon />}
              onClick={handleSendReminders}
            >
              Еске салу жіберу
            </Button>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="status-filter-label">Мәртебе</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label="Мәртебе"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Барлығы</MenuItem>
                <MenuItem value="pending">Күтудегі</MenuItem>
                <MenuItem value="active">Берілген</MenuItem>
                <MenuItem value="returned">Қайтарылған</MenuItem>
                <MenuItem value="overdue">Мерзімі өткен</MenuItem>
                <MenuItem value="rejected">Қабылданбаған</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="borrows table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Пайдаланушы</TableCell>
                <TableCell>Кітап</TableCell>
                <TableCell>Берілген күні</TableCell>
                <TableCell>Қайтару мерзімі</TableCell>
                <TableCell>Мәртебесі</TableCell>
                <TableCell>Әрекеттер</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">Жүктелуде...</TableCell>
                </TableRow>
              ) : borrows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">Қарызға алулар табылмады</TableCell>
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
                        title="Мәліметтерді көру"
                      >
                        <ViewIcon />
                      </IconButton>
                      
                      {borrow.status === 'pending' && (
                        <>
                          <IconButton 
                            aria-label="approve" 
                            color="success"
                            onClick={() => handleApproveBorrow(borrow.id)}
                            title="Бекіту"
                          >
                            <ApproveIcon />
                          </IconButton>
                          <IconButton 
                            aria-label="reject" 
                            color="error"
                            onClick={() => openRejectBorrowDialog(borrow)}
                            title="Қабылдамау"
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
                          title="Қайтаруды растау"
                        >
                          <HistoryIcon />
                        </IconButton>
                      )}
                      
                      {(borrow.status === 'active' || borrow.status === 'overdue') && (
                        <IconButton 
                          aria-label="send notification" 
                          color="secondary"
                          onClick={() => openNotificationDialog(borrow)}
                          title="Хабарландыру жіберу"
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
          labelRowsPerPage="Бет сайын:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
        />
      </Paper>

      {/* Қарызға алу мәліметтерін көрсету диалогы */}
      <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)} maxWidth="md">
        <DialogTitle>Қарызға алу мәліметтері</DialogTitle>
        <DialogContent>
          {selectedBorrow && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Пайдаланушы:</Typography>
                <Typography variant="body1">{selectedBorrow.user?.firstName} {selectedBorrow.user?.lastName}</Typography>
                <Typography variant="body2" color="text.secondary">{selectedBorrow.user?.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Кітап:</Typography>
                <Typography variant="body1">{selectedBorrow.book?.title}</Typography>
                <Typography variant="body2" color="text.secondary">Автор: {selectedBorrow.book?.author}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1" fontWeight="bold">Берілген күні:</Typography>
                <Typography variant="body1">{formatDate(selectedBorrow.borrowDate) || 'Берілмеген'}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1" fontWeight="bold">Қайтару мерзімі:</Typography>
                <Typography variant="body1">{formatDate(selectedBorrow.dueDate) || 'Орнатылмаған'}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1" fontWeight="bold">Қайтарылған күні:</Typography>
                <Typography variant="body1">{formatDate(selectedBorrow.returnDate) || 'Қайтарылмаған'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">Мәртебесі:</Typography>
                <Chip 
                  label={getStatusTranslation(selectedBorrow.status)} 
                  color={getStatusColor(selectedBorrow.status)} 
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">Ескертпелер:</Typography>
                <Typography variant="body1">{selectedBorrow.notes || 'Ескертпелер жоқ'}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)}>Жабу</Button>
        </DialogActions>
      </Dialog>

      {/* Қарызға алуды қабылдамау диалогы */}
      <Dialog
        open={openRejectDialog}
        onClose={() => setOpenRejectDialog(false)}
        aria-labelledby="reject-dialog-title"
      >
        <DialogTitle id="reject-dialog-title">Қарызға алуды қабылдамау</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            "{selectedBorrow?.book?.title}" кітабына 
            {selectedBorrow?.user?.firstName} {selectedBorrow?.user?.lastName} 
            пайдаланушысының сұранысын қабылдамауға сенімдісіз бе?
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Қабылдамау себебі"
            fullWidth
            multiline
            rows={2}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRejectDialog(false)}>Бас тарту</Button>
          <Button onClick={handleRejectBorrow} color="error" autoFocus>
            Қабылдамау
          </Button>
        </DialogActions>
      </Dialog>

      {/* Кітап қайтаруды растау диалогы */}
      <Dialog
        open={openReturnDialog}
        onClose={() => setOpenReturnDialog(false)}
        aria-labelledby="return-dialog-title"
      >
        <DialogTitle id="return-dialog-title">Қайтаруды растау</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedBorrow?.user?.firstName} {selectedBorrow?.user?.lastName} 
            пайдаланушысының "{selectedBorrow?.book?.title}" кітабын 
            қайтаруын растайсыз ба?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReturnDialog(false)}>Бас тарту</Button>
          <Button onClick={handleConfirmReturn} color="primary" autoFocus>
            Растау
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
          {selectedBorrow?.user?.firstName} {selectedBorrow?.user?.lastName} пайдаланушысына хабарландыру жіберу
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            "{selectedBorrow?.book?.title}" кітабы туралы пайдаланушыға хабарландыру мәтінін жазыңыз.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Хабарландыру мәтіні"
            fullWidth
            multiline
            rows={4}
            value={notificationText}
            onChange={(e) => setNotificationText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSendNotificationDialog(false)}>Бас тарту</Button>
          <Button 
            onClick={handleSendNotification} 
            color="primary" 
            disabled={!notificationText.trim()}
          >
            Жіберу
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