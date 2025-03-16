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
} from '@mui/material';
import {
  History as HistoryIcon,
  LocalLibrary as LibraryIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';

/**
 * Жүктеу кідірісін имитациялау функциясы
 * 
 * Бұл функция серверден мәліметтер жүктеуді имитациялау үшін қолданылады
 * 
 * @param {number} ms - Миллисекундпен көрсетілген кідіріс уақыты
 * @returns {Promise<void>} - Кідіріс аяқталғаннан кейін орындалатын Promise
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Кітап беру тарихының тестілік деректері
 * 
 * Бұл массив пайдаланушының кітап беру тарихын сақтайды. Әр жазба келесі қасиеттерден тұрады:
 * - id: Жазбаның бірегей идентификаторы
 * - bookTitle: Кітаптың атауы
 * - author: Кітаптың авторы
 * - borrowDate: Кітапты алған күні
 * - dueDate: Кітапты қайтару мерзімі
 * - returnDate: Кітапты қайтарған күні (егер қайтарылмаған болса, null)
 * - status: Кітап берудің күйі ('active' - белсенді, 'returned' - қайтарылған, 'overdue' - мерзімі өткен)
 */
const mockBorrows = [
  {
    id: 1,
    bookTitle: 'Основы финансового менеджмента',
    author: 'Джеймс С. Ван Хорн, Джон М. Вахович',
    borrowDate: '01.03.2025',
    dueDate: '15.03.2025',
    returnDate: null,
    status: 'active',
  },
  {
    id: 2,
    bookTitle: 'Маркетинг 5.0: Технологии следующего поколения',
    author: 'Филип Котлер, Хермаван Картаджайя',
    borrowDate: '15.02.2025',
    dueDate: '01.03.2025',
    returnDate: '28.02.2025',
    status: 'returned',
  },
  {
    id: 3,
    bookTitle: 'Python для анализа данных',
    author: 'Уэс Маккинни',
    borrowDate: '10.01.2025',
    dueDate: '24.01.2025',
    returnDate: '22.01.2025',
    status: 'returned',
  },
  {
    id: 4,
    bookTitle: 'Введение в экономическую теорию',
    author: 'Пол Самуэльсон, Уильям Нордхаус',
    borrowDate: '05.12.2024',
    dueDate: '19.12.2024',
    returnDate: '18.12.2024',
    status: 'returned',
  },
  {
    id: 5,
    bookTitle: 'Корпоративное право: Учебник',
    author: 'Ивана Сергеева',
    borrowDate: '20.11.2024',
    dueDate: '04.12.2024',
    returnDate: '05.12.2024',
    status: 'overdue',
  },
];

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
          />
        );
      case 'returned': // Қайтарылған
        return (
          <Chip
            icon={<CheckCircleIcon />}
            label="Возвращена"
            color="success"
            size="small"
          />
        );
      case 'overdue': // Мерзімі өткен
        return (
          <Chip
            icon={<WarningIcon />}
            label="Просрочена"
            color="error"
            size="small"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      {/* Беттің тақырыбы */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          <HistoryIcon sx={{ mr: 1, verticalAlign: 'text-bottom' }} />
          История заимствований
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Просмотр и управление информацией о взятых книгах
        </Typography>
      </Box>

      {/* Қойындылар (фильтрлер) */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden', mb: 4 }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="fullWidth"
          aria-label="history tabs"
        >
          <Tab label="Все" value="all" /> {/* Барлық жазбалар */}
          <Tab label="Активные" value="active" /> {/* Белсенді жазбалар */}
          <Tab label="Возвращенные" value="returned" /> {/* Қайтарылған жазбалар */}
          <Tab label="Просроченные" value="overdue" /> {/* Мерзімі өткен жазбалар */}
        </Tabs>
      </Paper>

      {/* Жазбалар кестесі */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {loading ? ( // Жүктелу кезінде скелетондарды көрсету
          <Box sx={{ p: 2 }}>
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
                  <TableRow>
                    <TableCell>Книга</TableCell>
                    <TableCell>Дата взятия</TableCell>
                    <TableCell>Срок возврата</TableCell>
                    <TableCell>Дата возврата</TableCell>
                    <TableCell>Статус</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedBorrows.length > 0 ? ( // Егер жазбалар болса, оларды көрсету
                    paginatedBorrows.map((borrow) => (
                      <TableRow
                        key={borrow.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          <Typography variant="body2" fontWeight="medium">
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
                      <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
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
            />
          </>
        )}
      </Paper>

      {/* Қосымша ақпарат блоктары */}
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {/* Пайдалану ережелері */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: 'rgba(25, 118, 210, 0.05)', // Көк түсті фон
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <LibraryIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Правила пользования
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" paragraph>
              1. Книги выдаются на срок до 14 дней с возможностью продления, если на них нет очереди.
            </Typography>
            <Typography variant="body2" paragraph>
              2. Для продления срока необходимо обратиться в библиотеку или воспользоваться личным кабинетом.
            </Typography>
            <Typography variant="body2" paragraph>
              3. При несвоевременном возврате книг начисляется штраф согласно правилам библиотеки.
            </Typography>
            <Typography variant="body2">
              4. Бережно относитесь к библиотечным материалам. В случае порчи или утери требуется возмещение.
            </Typography>
          </Paper>
        </Grid>

        {/* Статистика блогы */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: 'rgba(76, 175, 80, 0.05)', // Жасыл түсті фон
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <ReceiptIcon color="success" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Статистика
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {/* Барлық алынған кітаптар саны */}
              <Grid item xs={6}>
                <Paper
                  elevation={0}
                  sx={{ p: 2, textAlign: 'center', height: '100%' }}
                >
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="primary"
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
                  sx={{ p: 2, textAlign: 'center', height: '100%' }}
                >
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="success.main"
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
                  sx={{ p: 2, textAlign: 'center', height: '100%' }}
                >
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="primary"
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
                  sx={{ p: 2, textAlign: 'center', height: '100%' }}
                >
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="error"
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