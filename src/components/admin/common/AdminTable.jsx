import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Box,
  Typography,
  Toolbar,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  alpha,
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTranslation } from 'react-i18next';

/**
 * Компонент таблицы для админ-панели с поддержкой сортировки, пагинации и поиска
 * 
 * @param {Object} props - Свойства компонента
 * @param {Array} props.columns - Массив колонок таблицы
 * @param {Array} props.data - Массив данных
 * @param {string} props.title - Заголовок таблицы
 * @param {Function} props.onRowClick - Обработчик клика по строке
 * @param {Object} props.actions - Действия для таблицы
 * @param {Function} props.onSearch - Обработчик поиска
 * @param {boolean} props.loading - Флаг загрузки
 */
const AdminTable = ({
  columns = [],
  data = [],
  title,
  onRowClick,
  actions,
  onSearch,
  loading = false
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');

  // Установка заголовка таблицы с учетом локализации
  const tableTitle = title || t('admin.table', 'Таблица');

  // Обработчик изменения страницы
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Обработчик изменения количества строк на странице
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Обработчик сортировки
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Обработчик поиска
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  // Функция сортировки данных
  const sortData = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  // Компаратор для сортировки
  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  // Функция сравнения для сортировки по убыванию
  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  // Отображение состояния загрузки
  if (loading) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1">{t('common.loading', 'Загрузка...')}</Typography>
      </Paper>
    );
  }

  // Отображение пустого состояния
  if (data.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1">{t('admin.noDataToDisplay', 'Нет данных для отображения')}</Typography>
      </Paper>
    );
  }

  // Сортировка и пагинация данных
  const sortedData = orderBy
    ? sortData(data, getComparator(order, orderBy))
    : data;
  
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper elevation={3} sx={{ overflow: 'hidden' }}>
      {/* Панель инструментов таблицы */}
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {tableTitle}
        </Typography>
        
        {onSearch && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder={t('common.search', 'Поиск...')}
              value={searchQuery}
              onChange={handleSearch}
              sx={{ mr: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
            />
            
            {actions?.filter && (
              <IconButton size="small" aria-label={t('admin.filters', 'Фильтры')}>
                <FilterListIcon />
              </IconButton>
            )}
            
            {actions?.more && (
              <IconButton size="small" aria-label={t('common.more', 'Дополнительно')}>
                <MoreVertIcon />
              </IconButton>
            )}
          </Box>
        )}
      </Toolbar>

      {/* Таблица данных */}
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label={tableTitle}>
          <TableHead>
            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  padding={column.disablePadding ? 'none' : 'normal'}
                  sortDirection={orderBy === column.id ? order : false}
                  sx={{ fontWeight: 'bold' }}
                >
                  {column.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow
                hover
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                tabIndex={-1}
                key={row.id || index}
                sx={{ 
                  cursor: onRowClick ? 'pointer' : 'default',
                  '&:last-child td, &:last-child th': { border: 0 }
                }}
              >
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align || 'left'}>
                    {column.render 
                      ? column.render(row[column.id], row) 
                      : column.format 
                        ? column.format(row[column.id]) 
                        : row[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Пагинация */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t('pagination.rowsPerPage', 'Строк на странице:')}
      />
    </Paper>
  );
};

export default AdminTable;