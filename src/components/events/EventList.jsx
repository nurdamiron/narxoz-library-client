/**
 * Event List Component
 * 
 * Displays a grid of event cards with filters and pagination
 */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Pagination,
  IconButton,
  Chip,
  Stack,
  Button,
  Container,
  Paper,
  Divider,
  Card
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Event as EventIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import EventCard from './EventCard';
import EmptyState from '../common/EmptyState';
import LoadingSkeleton from '../common/LoadingSkeleton';
import { useEvents } from '../../hooks';

const EventList = () => {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedFilters, setAppliedFilters] = useState([]);
  
  // Get events data and handlers from custom hook
  const {
    events,
    categories,
    loading,
    error,
    filters,
    pagination,
    fetchEvents,
    fetchCategories,
    updateFilters,
    changePage
  } = useEvents({
    page: 1,
    limit: 12
  });
  
  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  
  // Debug logging
  useEffect(() => {
    console.log('EventList - Events:', events);
    console.log('EventList - Loading:', loading);
    console.log('EventList - Error:', error);
    console.log('EventList - Filters:', filters);
    console.log('EventList - Pagination:', pagination);
  }, [events, loading, error, filters, pagination]);
  
  // Apply filters
  const handleApplyFilters = () => {
    const newFilters = {
      type: selectedType || undefined,
      category: selectedCategory || undefined,
      startDate: startDate ? startDate.toISOString() : undefined,
      endDate: endDate ? endDate.toISOString() : undefined,
      search: searchTerm || undefined,
      page: 1 // Reset to first page when applying filters
    };
    
    updateFilters(newFilters);
    
    // Update applied filters for display
    const filterChips = [];
    if (selectedType) {
      filterChips.push({ key: 'type', label: t(`events.types.${selectedType}`), value: selectedType });
    }
    if (selectedCategory) {
      const category = categories.find(cat => cat.id === parseInt(selectedCategory));
      filterChips.push({ key: 'category', label: category ? category.name : '', value: selectedCategory });
    }
    if (startDate) {
      filterChips.push({ key: 'startDate', label: `${t('events.filters.from')} ${startDate.toLocaleDateString()}`, value: startDate });
    }
    if (endDate) {
      filterChips.push({ key: 'endDate', label: `${t('events.filters.to')} ${endDate.toLocaleDateString()}`, value: endDate });
    }
    if (searchTerm) {
      filterChips.push({ key: 'search', label: `"${searchTerm}"`, value: searchTerm });
    }
    
    setAppliedFilters(filterChips);
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setSelectedType('');
    setSelectedCategory('');
    setStartDate(null);
    setEndDate(null);
    setSearchTerm('');
    setAppliedFilters([]);
    
    updateFilters({
      type: undefined,
      category: undefined,
      startDate: undefined,
      endDate: undefined,
      search: undefined,
      page: 1
    });
  };
  
  // Remove a single filter
  const handleRemoveFilter = (key) => {
    let newFilters = { ...filters, page: 1 };
    delete newFilters[key];
    
    // Update state based on filter key
    if (key === 'type') setSelectedType('');
    if (key === 'category') setSelectedCategory('');
    if (key === 'startDate') setStartDate(null);
    if (key === 'endDate') setEndDate(null);
    if (key === 'search') setSearchTerm('');
    
    // Remove from applied filters
    setAppliedFilters(prevFilters => prevFilters.filter(filter => filter.key !== key));
    
    // Update filters
    updateFilters(newFilters);
  };
  
  // Handle page change
  const handlePageChange = (event, value) => {
    changePage(value);
  };
  
  // Handle search input
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      handleApplyFilters();
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          {t('events.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {t('events.description')}
        </Typography>
      </Box>
      
      {/* Search and Filters */}
      <Paper elevation={1} sx={{ mb: 4, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {/* Search Input */}
          <TextField
            placeholder={t('events.searchPlaceholder')}
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            sx={{ maxWidth: { xs: '100%', sm: 400 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchTerm('')}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          
          {/* Filter Toggle Button */}
          <Button
            variant={showFilters ? "contained" : "outlined"}
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{ ml: 2, display: { xs: 'none', sm: 'flex' } }}
          >
            {t('events.filters.title')}
          </Button>
          
          <IconButton
            color={showFilters ? "primary" : "default"}
            onClick={() => setShowFilters(!showFilters)}
            sx={{ ml: 1, display: { xs: 'flex', sm: 'none' } }}
          >
            <FilterListIcon />
          </IconButton>
        </Box>
        
        {/* Filter Chips */}
        {appliedFilters.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {appliedFilters.map((filter) => (
              <Chip
                key={filter.key}
                label={filter.label}
                onDelete={() => handleRemoveFilter(filter.key)}
                size="small"
                variant="outlined"
              />
            ))}
            
            <Button
              variant="text"
              size="small"
              onClick={handleClearFilters}
              sx={{ ml: 1 }}
            >
              {t('events.filters.clearAll')}
            </Button>
          </Box>
        )}
        
        {/* Extended Filters */}
        {showFilters && (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {/* Event Type Filter */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl size="small" fullWidth>
                  <InputLabel id="event-type-label">{t('events.filters.type')}</InputLabel>
                  <Select
                    labelId="event-type-label"
                    value={selectedType}
                    label={t('events.filters.type')}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <MenuItem value="">{t('events.filters.allTypes')}</MenuItem>
                    <MenuItem value="workshop">{t('events.types.workshop')}</MenuItem>
                    <MenuItem value="lecture">{t('events.types.lecture')}</MenuItem>
                    <MenuItem value="exhibition">{t('events.types.exhibition')}</MenuItem>
                    <MenuItem value="meetup">{t('events.types.meetup')}</MenuItem>
                    <MenuItem value="other">{t('events.types.other')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Category Filter */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl size="small" fullWidth>
                  <InputLabel id="category-label">{t('events.filters.category')}</InputLabel>
                  <Select
                    labelId="category-label"
                    value={selectedCategory}
                    label={t('events.filters.category')}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <MenuItem value="">{t('events.filters.allCategories')}</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Date Filters */}
              <Grid item xs={12} sm={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={t('events.filters.startDate')}
                    value={startDate}
                    onChange={setStartDate}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={t('events.filters.endDate')}
                    value={endDate}
                    onChange={setEndDate}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                sx={{ mr: 1 }}
              >
                {t('events.filters.clear')}
              </Button>
              <Button
                variant="contained"
                onClick={handleApplyFilters}
              >
                {t('events.filters.apply')}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
      
      {/* Events Grid or Loading State */}
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card elevation={2} sx={{ height: '100%' }}>
                <LoadingSkeleton type="event" />
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : error ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
        </Box>
      ) : events.length === 0 ? (
        <EmptyState
          icon={<EventIcon sx={{ fontSize: 60 }} />}
          title={t('events.noEvents.title')}
          description={t('events.noEvents.description')}
        />
      ) : (
        <>
          {/* Results Count */}
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              {t('events.resultsCount', { count: pagination.count })}
            </Typography>
          </Box>
          
          {/* Events Grid */}
          <Grid container spacing={3}>
            {events.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default EventList;