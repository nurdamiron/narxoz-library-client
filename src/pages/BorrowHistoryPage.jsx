import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Tabs,
  Tab,
  Skeleton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  History as HistoryIcon,
  LocalLibrary as LibraryIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';

// Import mock data
import { mockBorrows, delay } from '../data/mockData';

/**
 * BorrowHistoryPage компоненті - пайдаланушының кітап беру тарихын көрсететін бет
 * 
 * Бұл компонент пайдаланушының кітап беру тарихын көрсетеді және оны фильтрлеу мүмкіндігін ұсынады:
 * - Барлық кітаптар
 * - Белсенді (әлі қайтарылмаған) кітаптар
 * - Қайтарылған кітаптар
 * - Мерзімі өткен кітаптар
 * 
 * Сонымен қатар, компонент кітапхананы пайдалану ережелері мен статистиканы көрсетеді.
 */
const BorrowHistoryPage = () => {
  const theme = useTheme(); // Material UI тақырыбын алу
  const [loading, setLoading] = useState(true); // Жүктелу күйі
  const [borrows, setBorrows] = useState([]); // Кітап беру тарихы
  const [tab, setTab] = useState('all'); // Таңдалған қойынды (фильтр)
  const [page, setPage] = useState(0); // Ағымдағы бет (пагинация)
  const [rowsPerPage, setRowsPerPage] = useState(5); // Бетте көрсетілетін жазбалар саны

  /**
   * Деректерді жүктеу эффекті
   * 
   * Компонент жүктелгенде деректерді жүктейді (бұл жағдайда тестілік деректерді)
   */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Жүктелу күйін қосу
      // Деректерді жүктеу имитациясы (нақты қосымшада API сұрауы болар еді)
      await delay(1000);
      setBorrows(mockBorrows); // Деректерді күйге сақтау
      setLoading(false); // Жүктелу күйін өшіру
    };

    fetchData(); // Функцияны шақыру
  }, []); // Компонент алғаш жүктелгенде бір рет шақырылады

  /**
   * Қойынды өзгеру функциясы
   * 
   * @param {Event} event - Оқиға объектісі
   * @param {string} newValue - Жаңа қойынды мәні ('all', 'active', 'returned', 'overdue')
   */
  const handleTabChange = (event, newValue) => {
    setTab(newValue); // Қойынды күйін жаңарту
    setPage(0); // Беттеуді бастапқы бетке қайтару
  };

  /**
   * Бетті өзгерту функциясы (пагинация)
   * 
   * @param {Event} event - Оқиға объектісі
   * @param {number} newPage - Жаңа бет нөмірі
   */
  const handleChangePage = (event, newPage) => {
    setPage(newPage); // Бет күйін жаңарту
  };

  /**
   * Бетте көрсетілетін жазбалар санын өзгерту функциясы
   * 
   * @param {Event} event - Оқиға объектісі
   */
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10)); // Жазбалар санын жаңарту
    setPage(0); // Беттеуді бастапқы бетке қайтару
  };

  /**
   * Таңдалған фильтрге сәйкес жазбаларды фильтрлеу функциясы
   * 
   * @returns {Array} - Фильтрленген жазбалар тізімі
   */
  const getFilteredBorrows = () => {
    if (tab === 'all') {
      return borrows; // 'all' фильтрі үшін барлық жазбаларды қайтару
    }
    // Белгілі бір күй үшін жазбаларды фильтрлеу
    return borrows.filter((borrow) => borrow.status === tab);
  };

  // Фильтрленген жазбалар тізімі
  const filteredBorrows = getFilteredBorrows();
  
  // Ағымдағы бетте көрсетілетін жазбалар тізімі
  const paginatedBorrows = filteredBorrows.slice(
    page * rowsPerPage, // Бастапқы индекс
    page * rowsPerPage + rowsPerPage // Соңғы индекс
  );

  /**
   * Кітап берудің күйіне сәйкес Chip компонентін қайтару функциясы
   * 
   * @param {string} status - Кітап берудің күйі ('active', 'returned', 'overdue')
   * @returns {JSX.Element} - Chip компоненті
   */
  const getStatusChip = (status) => {
    switch (status) {
      case 'active': // Белсенді (алынған, қайтарылмаған)
        return (
          <Chip
            icon={<LibraryIcon />}
            label="Активна"
            color="primary"
            size="small"
            sx={{ 
              bgcolor: alpha('#2e7d32', 0.1), 
              color: '#2e7d32',
              fontWeight: 'medium'
            }}
          />
        );
      case 'returned': // Қайтарылған
        return (
          <Chip
            icon={<CheckCircleIcon />}
            label="Возвращена"
            color="success"
            size="small"
            sx={{ 
              bgcolor: alpha('#2e7d32', 0.1), 
              color: '#2e7d32',
              fontWeight: 'medium'
            }}
          />
        );
      case 'overdue': // Мерзімі өткен
        return (
          <Chip
            icon={<WarningIcon />}
            label="Просрочена"
            color="error"
            size="small"
            sx={{ 
              bgcolor: alpha('#d32f2f', 0.1), 
              color: '#d32f2f',
              fontWeight: 'medium'
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Беттің тақырыбы */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <HistoryIcon sx={{ mr: 1.5, color: '#d50032', fontSize: 34 }} />
          История заимствований
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Просмотр и управление информацией о взятых книгах
        </Typography>
      </Box>

      {/* Қойындылар (фильтрлер) */}
      <Paper sx={{ borderRadius: 3, overflow: 'hidden', mb: 5, boxShadow: theme.shadows[2] }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="fullWidth"
          aria-label="history tabs"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#d50032',
              height: 3,
            },
            '& .Mui-selected': {
              color: '#d50032',
              fontWeight: 'bold',
            },
          }}
        >
          <Tab label="Все" value="all" /> {/* Барлық жазбалар */}
          <Tab label="Активные" value="active" /> {/* Белсенді жазбалар */}
          <Tab label="Возвращенные" value="returned" /> {/* Қайтарылған жазбалар */}
          <Tab label="Просроченные" value="overdue" /> {/* Мерзімі өткен жазбалар */}
        </Tabs>
      </Paper>

      {/* Жазбалар кестесі */}
      <Paper sx={{ borderRadius: 3, overflow: 'hidden', mb: 5, boxShadow: theme.shadows[2] }}>
        {loading ? ( // Жүктелу кезінде скелетондарды көрсету
          <Box sx={{ p: 3 }}>
            <Skeleton height={60} />
            <Skeleton height={60} />
            <Skeleton height={60} />
            <Skeleton height={60} />
            <Skeleton height={60} />
          </Box>
        ) : ( // Жүктелу аяқталғаннан кейін деректерді көрсету
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: alpha('#f5f5f5', 0.5) }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Книга</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Дата взятия</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Срок возврата</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Дата возврата</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Статус</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedBorrows.length > 0 ? ( // Егер жазбалар болса, оларды көрсету
                    paginatedBorrows.map((borrow) => (
                      <TableRow
                        key={borrow.id}
                        sx={{ 
                          '&:last-child td, &:last-child th': { border: 0 },
                          '&:hover': { backgroundColor: alpha('#f5f5f5', 0.5) },
                          transition: 'background-color 0.2s',
                        }}
                      >
                        <TableCell component="th" scope="row">
                          <Typography variant="body2" fontWeight="medium" color="#d50032">
                            {borrow.bookTitle}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {borrow.author}
                          </Typography>
                        </TableCell>
                        <TableCell>{borrow.borrowDate}</TableCell>
                        <TableCell>{borrow.dueDate}</TableCell>
                        <TableCell>
                          {borrow.returnDate || (
                            <Typography variant="body2" color="text.secondary">
                              -
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>{getStatusChip(borrow.status)}</TableCell>
                      </TableRow>
                    ))
                  ) : ( // Егер жазбалар болмаса, хабарлама көрсету
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                          Нет записей для отображения
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {/* Беттеу (пагинация) */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]} // Бетте көрсетілетін жазбалар саны нұсқалары
              component="div"
              count={filteredBorrows.length} // Жазбалардың жалпы саны
              rowsPerPage={rowsPerPage} // Бетте көрсетілетін жазбалар саны
              page={page} // Ағымдағы бет
              onPageChange={handleChangePage} // Бетті өзгерту функциясы
              onRowsPerPageChange={handleChangeRowsPerPage} // Жазбалар санын өзгерту функциясы
              labelRowsPerPage="Записей на странице:" // "Бетте қанша жазба" жазуы
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} из ${count !== -1 ? count : `более чем ${to}`}`
              } // "Жазба статистикасы" жазуы
              sx={{
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  margin: 0,
                },
              }}
            />
          </>
        )}
      </Paper>

      {/* Қосымша ақпарат блоктары */}
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* Пайдалану ережелері */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: alpha('#d50032', 0.03),
              height: '100%',
              boxShadow: theme.shadows[2],
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[4],
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <LibraryIcon sx={{ color: '#d50032', mr: 1.5, fontSize: 28 }} />
              <Typography variant="h5" fontWeight="bold">
                Правила пользования
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ px: 1 }}>
              <Typography variant="body1" paragraph>
                1. Книги выдаются на срок до 14 дней с возможностью продления, если на них нет очереди.
              </Typography>
              <Typography variant="body1" paragraph>
                2. Для продления срока необходимо обратиться в библиотеку или воспользоваться личным кабинетом.
              </Typography>
              <Typography variant="body1" paragraph>
                3. При несвоевременном возврате книг начисляется штраф согласно правилам библиотеки.
              </Typography>
              <Typography variant="body1">
                4. Бережно относитесь к библиотечным материалам. В случае порчи или утери требуется возмещение.
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Статистика блогы */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: alpha('#2e7d32', 0.03),
              height: '100%',
              boxShadow: theme.shadows[2],
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[4],
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <ReceiptIcon sx={{ color: '#2e7d32', mr: 1.5, fontSize: 28 }} />
              <Typography variant="h5" fontWeight="bold">
                Статистика
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              {/* Барлық алынған кітаптар саны */}
              <Grid item xs={6}>
                <Paper
                  elevation={0}
                  sx={{ 
                    p: 3, 
                    textAlign: 'center', 
                    height: '100%',
                    borderRadius: 2,
                    backgroundColor: alpha('#f5f5f5', 0.5),
                  }}
                >
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="#d50032"
                    gutterBottom
                  >
                    {loading ? <Skeleton width={40} /> : borrows.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Всего взятых книг
                  </Typography>
                </Paper>
              </Grid>
              {/* Қайтарылған кітаптар саны */}
              <Grid item xs={6}>
                <Paper
                  elevation={0}
                  sx={{ 
                    p: 3, 
                    textAlign: 'center', 
                    height: '100%',
                    borderRadius: 2,
                    backgroundColor: alpha('#f5f5f5', 0.5),
                  }}
                >
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="#2e7d32"
                    gutterBottom
                  >
                    {loading ? (
                      <Skeleton width={40} />
                    ) : (
                      borrows.filter((b) => b.status === 'returned').length
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Возвращенные книги
                  </Typography>
                </Paper>
              </Grid>
              {/* Белсенді (қайтарылмаған) кітаптар саны */}
              <Grid item xs={6}>
                <Paper
                  elevation={0}
                  sx={{ 
                    p: 3, 
                    textAlign: 'center', 
                    height: '100%',
                    borderRadius: 2,
                    backgroundColor: alpha('#f5f5f5', 0.5),
                  }}
                >
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="#1976d2"
                    gutterBottom
                  >
                    {loading ? (
                      <Skeleton width={40} />
                    ) : (
                      borrows.filter((b) => b.status === 'active').length
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Активные заказы
                  </Typography>
                </Paper>
              </Grid>
              {/* Мерзімі өткен кітаптар саны */}
              <Grid item xs={6}>
                <Paper
                  elevation={0}
                  sx={{ 
                    p: 3, 
                    textAlign: 'center', 
                    height: '100%',
                    borderRadius: 2,
                    backgroundColor: alpha('#f5f5f5', 0.5),
                  }}
                >
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="#d32f2f"
                    gutterBottom
                  >
                    {loading ? (
                      <Skeleton width={40} />
                    ) : (
                      borrows.filter((b) => b.status === 'overdue').length
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Просроченные
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BorrowHistoryPage;