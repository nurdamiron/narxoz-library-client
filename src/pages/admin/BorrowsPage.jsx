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
import { 
  CheckCircle as ApproveIcon, 
  DoDisturbOn as RejectIcon, 
  Visibility as ViewIcon,
  History as HistoryIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import PageHeader from '../../components/common/PageHeader';

const BorrowsPage = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedBorrow, setSelectedBorrow] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [openReturnDialog, setOpenReturnDialog] = useState(false);
  const [openSendNotificationDialog, setOpenSendNotificationDialog] = useState(false);
  const [notificationText, setNotificationText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Загрузка заимствований при монтировании компонента
  useEffect(() => {
    fetchBorrows();
  }, []);

  // Функция для загрузки списка заимствований
  const fetchBorrows = async () => {
    try {
      setLoading(true);
      // В реальном приложении использовали бы API, сейчас используем моки
      setTimeout(() => {
        const mockBorrows = [
          {
            id: 1,
            userId: 101,
            user: { name: 'Әсел Қасымова', email: 'asel@example.com' },
            bookId: 201,
            book: { title: 'Абай жолы', author: 'Мұхтар Әуезов' },
            borrowDate: '2023-11-01',
            dueDate: '2023-11-15',
            returnDate: null,
            status: 'borrowed',
            notes: 'Первое заимствование'
          },
          {
            id: 2,
            userId: 102,
            user: { name: 'Болат Сагинтаев', email: 'bolat@example.com' },
            bookId: 202,
            book: { title: 'Экономика негіздері', author: 'Аманжол Қозыбаев' },
            borrowDate: '2023-10-25',
            dueDate: '2023-11-08',
            returnDate: '2023-11-05',
            status: 'returned',
            notes: 'Вернул вовремя'
          },
          {
            id: 3,
            userId: 103,
            user: { name: 'Гүлнар Ахметова', email: 'gulnar@example.com' },
            bookId: 203,
            book: { title: 'Қазақ тілі', author: 'Сакен Калиев' },
            borrowDate: '2023-11-05',
            dueDate: '2023-11-19',
            returnDate: null,
            status: 'overdue',
            notes: 'Просрочена'
          },
          {
            id: 4,
            userId: 104,
            user: { name: 'Дамир Исламов', email: 'damir@example.com' },
            bookId: 204,
            book: { title: 'Информатика', author: 'Нуржан Алиев' },
            borrowDate: null,
            dueDate: null,
            returnDate: null,
            status: 'pending',
            notes: 'Ожидает подтверждения'
          }
        ];
        setBorrows(mockBorrows);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching borrows:', error);
      setLoading(false);
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

  // Одобрение заимствования
  const handleApproveBorrow = async (borrowId) => {
    try {
      console.log('Approving borrow:', borrowId);
      // В реальном приложении вызвали бы API
      fetchBorrows();
    } catch (error) {
      console.error('Error approving borrow:', error);
    }
  };

  // Отклонение заимствования
  const handleRejectBorrow = async () => {
    try {
      if (!selectedBorrow) return;
      console.log('Rejecting borrow:', selectedBorrow.id);
      // В реальном приложении вызвали бы API
      fetchBorrows();
      setOpenRejectDialog(false);
    } catch (error) {
      console.error('Error rejecting borrow:', error);
    }
  };

  // Подтверждение возврата книги
  const handleConfirmReturn = async () => {
    try {
      if (!selectedBorrow) return;
      console.log('Confirming return for borrow:', selectedBorrow.id);
      // В реальном приложении вызвали бы API
      fetchBorrows();
      setOpenReturnDialog(false);
    } catch (error) {
      console.error('Error confirming return:', error);
    }
  };

  // Отправка уведомления
  const handleSendNotification = async () => {
    try {
      if (!selectedBorrow || !notificationText) return;
      console.log('Sending notification to user:', selectedBorrow.userId, 'Text:', notificationText);
      // В реальном приложении вызвали бы API
      setOpenSendNotificationDialog(false);
      setNotificationText('');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  // Открытие диалога деталей
  const openBorrowDetailsDialog = (borrow) => {
    setSelectedBorrow(borrow);
    setOpenDetailsDialog(true);
  };

  // Открытие диалога отклонения
  const openRejectBorrowDialog = (borrow) => {
    setSelectedBorrow(borrow);
    setOpenRejectDialog(true);
  };

  // Открытие диалога возврата
  const openReturnBorrowDialog = (borrow) => {
    setSelectedBorrow(borrow);
    setOpenReturnDialog(true);
  };

  // Открытие диалога уведомления
  const openNotificationDialog = (borrow) => {
    setSelectedBorrow(borrow);
    setOpenSendNotificationDialog(true);
  };

  // Получение цвета статуса
  const getStatusColor = (status) => {
    switch (status) {
      case 'borrowed':
        return 'primary';
      case 'returned':
        return 'success';
      case 'overdue':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Перевод статуса на русский
  const getStatusTranslation = (status) => {
    switch (status) {
      case 'borrowed':
        return 'Выдана';
      case 'returned':
        return 'Возвращена';
      case 'overdue':
        return 'Просрочена';
      case 'pending':
        return 'Ожидает';
      default:
        return status;
    }
  };

  // Фильтрация заимствований по статусу
  const filteredBorrows = statusFilter === 'all' 
    ? borrows 
    : borrows.filter(borrow => borrow.status === statusFilter);

  return (
    <Container maxWidth="lg">
      <PageHeader 
        title="Управление заимствованиями" 
        subtitle="Просмотр и обработка заявок на книги, возвратов и уведомления"
      />

      <Paper elevation={3} sx={{ mb: 4, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Список заимствований</Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="status-filter-label">Статус</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="Статус"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">Все</MenuItem>
              <MenuItem value="pending">Ожидающие</MenuItem>
              <MenuItem value="borrowed">Выданные</MenuItem>
              <MenuItem value="returned">Возвращенные</MenuItem>
              <MenuItem value="overdue">Просроченные</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="borrows table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Пользователь</TableCell>
                <TableCell>Книга</TableCell>
                <TableCell>Дата выдачи</TableCell>
                <TableCell>Срок возврата</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">Загрузка...</TableCell>
                </TableRow>
              ) : filteredBorrows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">Заимствования не найдены</TableCell>
                </TableRow>
              ) : (
                filteredBorrows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((borrow) => (
                    <TableRow key={borrow.id}>
                      <TableCell>{borrow.id}</TableCell>
                      <TableCell>{borrow.user.name}</TableCell>
                      <TableCell>{borrow.book.title}</TableCell>
                      <TableCell>{borrow.borrowDate || '-'}</TableCell>
                      <TableCell>{borrow.dueDate || '-'}</TableCell>
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
                        >
                          <ViewIcon />
                        </IconButton>
                        
                        {borrow.status === 'pending' && (
                          <>
                            <IconButton 
                              aria-label="approve" 
                              color="success"
                              onClick={() => handleApproveBorrow(borrow.id)}
                            >
                              <ApproveIcon />
                            </IconButton>
                            <IconButton 
                              aria-label="reject" 
                              color="error"
                              onClick={() => openRejectBorrowDialog(borrow)}
                            >
                              <RejectIcon />
                            </IconButton>
                          </>
                        )}
                        
                        {borrow.status === 'borrowed' && (
                          <IconButton 
                            aria-label="return" 
                            color="primary"
                            onClick={() => openReturnBorrowDialog(borrow)}
                          >
                            <HistoryIcon />
                          </IconButton>
                        )}
                        
                        {(borrow.status === 'borrowed' || borrow.status === 'overdue') && (
                          <IconButton 
                            aria-label="send notification" 
                            color="secondary"
                            onClick={() => openNotificationDialog(borrow)}
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
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredBorrows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Диалог подробностей */}
      <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)} maxWidth="md">
        <DialogTitle>Детали заимствования</DialogTitle>
        <DialogContent>
          {selectedBorrow && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Пользователь:</Typography>
                <Typography variant="body1">{selectedBorrow.user.name}</Typography>
                <Typography variant="body2" color="text.secondary">{selectedBorrow.user.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Книга:</Typography>
                <Typography variant="body1">{selectedBorrow.book.title}</Typography>
                <Typography variant="body2" color="text.secondary">Автор: {selectedBorrow.book.author}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1">Дата выдачи:</Typography>
                <Typography variant="body1">{selectedBorrow.borrowDate || 'Не выдана'}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1">Срок возврата:</Typography>
                <Typography variant="body1">{selectedBorrow.dueDate || 'Не установлен'}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1">Дата возврата:</Typography>
                <Typography variant="body1">{selectedBorrow.returnDate || 'Не возвращена'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Статус:</Typography>
                <Chip 
                  label={getStatusTranslation(selectedBorrow.status)} 
                  color={getStatusColor(selectedBorrow.status)} 
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Примечания:</Typography>
                <Typography variant="body1">{selectedBorrow.notes || 'Нет примечаний'}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)}>Закрыть</Button>
        </DialogActions>
      </Dialog>

      {/* Диалог отклонения заимствования */}
      <Dialog
        open={openRejectDialog}
        onClose={() => setOpenRejectDialog(false)}
        aria-labelledby="reject-dialog-title"
      >
        <DialogTitle id="reject-dialog-title">Отклонить заимствование</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите отклонить заявку на книгу "{selectedBorrow?.book.title}" 
            от пользователя {selectedBorrow?.user.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRejectDialog(false)}>Отмена</Button>
          <Button onClick={handleRejectBorrow} color="error" autoFocus>
            Отклонить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения возврата */}
      <Dialog
        open={openReturnDialog}
        onClose={() => setOpenReturnDialog(false)}
        aria-labelledby="return-dialog-title"
      >
        <DialogTitle id="return-dialog-title">Подтвердить возврат</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы подтверждаете возврат книги "{selectedBorrow?.book.title}" 
            от пользователя {selectedBorrow?.user.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReturnDialog(false)}>Отмена</Button>
          <Button onClick={handleConfirmReturn} color="primary" autoFocus>
            Подтвердить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог отправки уведомления */}
      <Dialog
        open={openSendNotificationDialog}
        onClose={() => setOpenSendNotificationDialog(false)}
        aria-labelledby="notification-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="notification-dialog-title">
          Отправить уведомление для {selectedBorrow?.user.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Напишите текст уведомления для пользователя о книге "{selectedBorrow?.book.title}".
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Текст уведомления"
            fullWidth
            multiline
            rows={4}
            value={notificationText}
            onChange={(e) => setNotificationText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSendNotificationDialog(false)}>Отмена</Button>
          <Button 
            onClick={handleSendNotification} 
            color="primary" 
            disabled={!notificationText.trim()}
          >
            Отправить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BorrowsPage;