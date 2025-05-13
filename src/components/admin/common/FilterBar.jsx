import React, { useState } from 'react';
import { 
  Paper, 
  Box, 
  Button, 
  Chip, 
  Popover, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField, 
  Typography,
  IconButton,
  InputAdornment,
  Grid,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import TuneIcon from '@mui/icons-material/Tune';
import { useTranslation } from 'react-i18next';

/**
 * Компонент панели фильтрации для админ-панели
 * 
 * @param {Object} props - Свойства компонента
 * @param {Array} props.filters - Массив доступных фильтров
 * @param {Object} props.activeFilters - Объект с активными фильтрами
 * @param {Function} props.onFilterChange - Обработчик изменения фильтров
 * @param {Function} props.onSearch - Обработчик поиска
 * @param {Array} props.searchPlaceholder - Текст плейсхолдера поиска
 */
const FilterBar = ({
  filters = [],
  activeFilters = {},
  onFilterChange,
  onSearch,
  searchPlaceholder,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tempFilters, setTempFilters] = useState({...activeFilters});
  
  // Определение плейсхолдера поиска с учетом локализации
  const defaultSearchPlaceholder = t('common.search', 'Поиск...');
  const searchPlaceholderText = searchPlaceholder || defaultSearchPlaceholder;
  
  // Обработчик открытия попапа фильтров
  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
    setTempFilters({...activeFilters});
  };
  
  // Обработчик закрытия попапа фильтров
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  // Обработчик сброса фильтров
  const handleResetFilters = () => {
    const resetFilters = {};
    filters.forEach(filter => {
      resetFilters[filter.id] = filter.multiple ? [] : '';
    });
    
    setTempFilters(resetFilters);
    if (onFilterChange) {
      onFilterChange(resetFilters);
    }
    handleClose();
  };
  
  // Обработчик применения фильтров
  const handleApplyFilters = () => {
    if (onFilterChange) {
      onFilterChange(tempFilters);
    }
    handleClose();
  };
  
  // Обработчик изменения значения фильтра
  const handleFilterValueChange = (id, value) => {
    setTempFilters(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  // Обработчик поиска
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };
  
  // Обработчик очистки поиска
  const handleClearSearch = () => {
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
  };
  
  // Проверка наличия активных фильтров
  const hasActiveFilters = () => {
    return Object.keys(activeFilters).some(key => {
      const value = activeFilters[key];
      return Array.isArray(value) ? value.length > 0 : value !== '';
    });
  };
  
  // Открыт ли попап фильтров
  const open = Boolean(anchorEl);
  const id = open ? 'filter-popover' : undefined;
  
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 2, 
        mb: 3, 
        borderRadius: 2,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: 2
      }}
    >
      {/* Поле поиска */}
      <TextField
        placeholder={searchPlaceholderText}
        value={searchQuery}
        onChange={handleSearchChange}
        variant="outlined"
        size="small"
        fullWidth
        sx={{ flexGrow: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton
                aria-label={t('common.clearSearch', 'Очистить поиск')}
                onClick={handleClearSearch}
                edge="end"
                size="small"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      
      {/* Кнопка фильтров */}
      <Button
        variant={hasActiveFilters() ? "contained" : "outlined"}
        color="primary"
        startIcon={<TuneIcon />}
        onClick={handleFilterClick}
        aria-describedby={id}
        sx={{ minWidth: 130 }}
      >
        {t('admin.filters', 'Фильтры')}
        {hasActiveFilters() && (
          <Chip 
            label={Object.values(activeFilters).flat().filter(Boolean).length} 
            size="small" 
            color="error" 
            sx={{ ml: 1, height: 20 }} 
          />
        )}
      </Button>
      
      {/* Попап с фильтрами */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { 
            width: 400, 
            maxWidth: '100%',
            p: 3,
            mt: 1,
            borderRadius: 2
          }
        }}
      >
        <Typography variant="h6" gutterBottom>
          {t('admin.filters', 'Фильтры')}
        </Typography>
        
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={2}>
          {filters.map((filter) => (
            <Grid item xs={12} key={filter.id}>
              {filter.type === 'select' && (
                <FormControl fullWidth size="small">
                  <InputLabel id={`filter-${filter.id}-label`}>{filter.label}</InputLabel>
                  <Select
                    labelId={`filter-${filter.id}-label`}
                    id={`filter-${filter.id}`}
                    value={tempFilters[filter.id] || (filter.multiple ? [] : '')}
                    onChange={(e) => handleFilterValueChange(filter.id, e.target.value)}
                    label={filter.label}
                    multiple={filter.multiple}
                    displayEmpty
                  >
                    {!filter.multiple && (
                      <MenuItem value="">
                        <em>{t('admin.filterAll', 'Все')}</em>
                      </MenuItem>
                    )}
                    {filter.options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              
              {filter.type === 'text' && (
                <TextField
                  fullWidth
                  label={filter.label}
                  value={tempFilters[filter.id] || ''}
                  onChange={(e) => handleFilterValueChange(filter.id, e.target.value)}
                  size="small"
                />
              )}
              
              {filter.type === 'date' && (
                <TextField
                  fullWidth
                  label={filter.label}
                  type="date"
                  value={tempFilters[filter.id] || ''}
                  onChange={(e) => handleFilterValueChange(filter.id, e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  size="small"
                />
              )}
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button 
            onClick={handleResetFilters}
            variant="outlined"
            color="inherit"
          >
            {t('admin.resetFilters', 'Сбросить')}
          </Button>
          <Button 
            onClick={handleApplyFilters}
            variant="contained"
            color="primary"
          >
            {t('admin.applyFilters', 'Применить')}
          </Button>
        </Box>
      </Popover>
    </Paper>
  );
};

export default FilterBar;