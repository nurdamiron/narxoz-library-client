/**
 * Event Registrations Table Component
 * 
 * Displays and manages registrations for a specific event in the admin interface
 */
import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Chip,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
  Breadcrumbs,
  Link,
  FormControl,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  NavigateNext as NavigateNextIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import useAdminEvents from '../../../hooks/useAdminEvents';
import eventService from '../../../services/eventService';
import AdminTable from '../common/AdminTable';
import EventRegistrationStats from './EventRegistrationStats';

const EventRegistrationsTable = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [event, setEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [eventError, setEventError] = useState(null);
  
  const { 
    eventRegistrations, 
    loading, 
    error, 
    fetchEventRegistrations, 
    updateRegistrationStatus 
  } = useAdminEvents();
  
  // Fetch event and registrations data on component mount
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoadingEvent(true);
        
        const response = await eventService.getEvent(id);
        
        if (response.success) {
          setEvent(response.data);
        } else {
          setEventError(response.error || t('events.admin.registrations.eventFetchError'));
        }
      } catch (err) {
        setEventError(err.message || t('events.admin.registrations.eventFetchError'));
      } finally {
        setLoadingEvent(false);
      }
    };
    
    if (id) {
      fetchEventData();
      fetchEventRegistrations(id);
    }
  }, [id, fetchEventRegistrations, t]);
  
  // Enhanced filtering for registrations
  const filteredRegistrations = eventRegistrations.filter(registration => {
    if (!registration.user) return false;
    
    // Enhanced search - check multiple fields
    const searchMatch = !searchTerm || [
      registration.user.firstName,
      registration.user.lastName,
      registration.user.username,
      registration.user.email,
      registration.user.id?.toString()
    ].some(field => 
      field && field.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const statusMatch = statusFilter === 'all' || registration.status === statusFilter;
    
    return searchMatch && statusMatch;
  });
  
  // Handle status change
  const handleStatusChange = async (registrationId, newStatus) => {
    const result = await updateRegistrationStatus(registrationId, newStatus);
    
    if (result.success) {
      fetchEventRegistrations(id);
    }
  };
  
  // Handle export to CSV
  const handleExportRegistrations = () => {
    if (filteredRegistrations.length === 0) return;
    
    const csvHeaders = [
      'ID',
      'Имя',
      'Email',
      'Имя пользователя',
      'Роль',
      'Статус регистрации',
      'Дата регистрации'
    ];
    
    const csvData = filteredRegistrations.map(registration => [
      registration.user.id,
      registration.user.firstName && registration.user.lastName 
        ? `${registration.user.firstName} ${registration.user.lastName}`
        : registration.user.username || registration.user.name || '',
      registration.user.email,
      registration.user.username,
      registration.user.role || '',
      registration.status,
      format(new Date(registration.registrationDate), 'dd.MM.yyyy HH:mm')
    ]);
    
    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `event-${event.id}-registrations-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Get status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case 'registered':
        return 'primary';
      case 'attended':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };
  
  // Table columns
  const columns = [
    {
      id: 'user',
      label: t('events.admin.registrations.user'),
      render: (registration) => (
        <Box>
          <Typography variant="subtitle2">
            {registration.user.firstName && registration.user.lastName 
              ? `${registration.user.firstName} ${registration.user.lastName}`
              : registration.user.username || registration.user.name
            }
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {registration.user.email}
          </Typography>
          {registration.user.role && (
            <Chip
              label={t(`users.roles.${registration.user.role}`)}
              size="small"
              variant="outlined"
              sx={{ mt: 0.5, fontSize: '0.65rem' }}
            />
          )}
        </Box>
      ),
    },
    {
      id: 'userInfo',
      label: t('events.admin.registrations.userDetails'),
      render: (registration) => (
        <Box>
          <Typography variant="body2">
            ID: {registration.user.id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            @{registration.user.username}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'registrationDate',
      label: t('events.admin.registrations.registrationDate'),
      render: (registration) => {
        const regDate = new Date(registration.registrationDate);
        const now = new Date();
        const timeDiff = now - regDate;
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        
        return (
          <Box>
            <Typography variant="body2">
              {format(regDate, 'd MMM yyyy, HH:mm')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {daysDiff === 0 
                ? t('events.admin.registrations.today')
                : daysDiff === 1
                ? t('events.admin.registrations.yesterday')
                : daysDiff < 7
                ? t('events.admin.registrations.daysAgo', { days: daysDiff })
                : null
              }
            </Typography>
          </Box>
        );
      },
    },
    {
      id: 'status',
      label: t('events.admin.registrations.status'),
      render: (registration) => (
        <Chip
          label={t(`events.status.${registration.status}`)}
          size="small"
          color={getStatusColor(registration.status)}
        />
      ),
    },
    {
      id: 'actions',
      label: t('events.admin.registrations.actions'),
      render: (registration) => (
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={registration.status}
            onChange={(e) => handleStatusChange(registration.id, e.target.value)}
            displayEmpty
          >
            <MenuItem value="registered">{t('events.status.registered')}</MenuItem>
            <MenuItem value="attended">{t('events.status.attended')}</MenuItem>
            <MenuItem value="cancelled">{t('events.status.cancelled')}</MenuItem>
          </Select>
        </FormControl>
      ),
    },
  ];

  if (loadingEvent) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (eventError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {eventError}
      </Alert>
    );
  }

  if (!event) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        {t('events.admin.registrations.eventNotFound')}
      </Alert>
    );
  }

  return (
    <>
      {/* Breadcrumbs navigation */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        sx={{ mb: 3 }}
      >
        <Link 
          component={RouterLink} 
          to="/admin/events"
          underline="hover"
          color="inherit"
        >
          {t('events.admin.events')}
        </Link>
        <Typography color="text.primary">
          {t('events.admin.registrations.title')}
        </Typography>
      </Breadcrumbs>
      
      <Box sx={{ mb: 3 }}>
        <Button
          component={RouterLink}
          to="/admin/events"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          {t('events.admin.backToEvents')}
        </Button>
        
        <Typography variant="h5" component="h1" gutterBottom>
          {t('events.admin.registrations.titleWithEvent', { title: event.title })}
        </Typography>
        
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          alignItems={{ sm: 'center' }}
          sx={{ mt: 3, mb: 2 }}
        >
          {/* Search input */}
          <TextField
            placeholder={t('events.admin.registrations.searchPlaceholder')}
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            sx={{ flexGrow: 1, maxWidth: { sm: 300 } }}
          />
          
          {/* Status filter */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              displayEmpty
              startAdornment={
                <InputAdornment position="start">
                  <FilterIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                </InputAdornment>
              }
            >
              <MenuItem value="all">{t('events.admin.registrations.allStatuses')}</MenuItem>
              <MenuItem value="registered">{t('events.status.registered')}</MenuItem>
              <MenuItem value="attended">{t('events.status.attended')}</MenuItem>
              <MenuItem value="cancelled">{t('events.status.cancelled')}</MenuItem>
            </Select>
          </FormControl>
          
          {/* Export and Refresh buttons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon />}
              onClick={() => handleExportRegistrations()}
              disabled={filteredRegistrations.length === 0}
            >
              Экспорт CSV
            </Button>
            
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={() => fetchEventRegistrations(id)}
              disabled={loading}
            >
              Обновить
            </Button>
          </Box>
        </Stack>
        
        {/* Event summary with enhanced statistics */}
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.paper' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} divider={<Box component="span" sx={{ border: '0.5px solid #eee', mx: 2 }} />}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('events.admin.registrations.totalCapacity')}
              </Typography>
              <Typography variant="h6">
                {event.capacity}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('events.admin.registrations.registeredCount')}
              </Typography>
              <Typography variant="h6" color="primary.main">
                {eventRegistrations.filter(r => r.status === 'registered' || r.status === 'attended').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {((eventRegistrations.filter(r => r.status === 'registered' || r.status === 'attended').length / event.capacity) * 100).toFixed(0)}% заполненности
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('events.admin.registrations.attendedCount')}
              </Typography>
              <Typography variant="h6" color="success.main">
                {eventRegistrations.filter(r => r.status === 'attended').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {eventRegistrations.filter(r => r.status === 'registered' || r.status === 'attended').length > 0 
                  ? ((eventRegistrations.filter(r => r.status === 'attended').length / eventRegistrations.filter(r => r.status === 'registered' || r.status === 'attended').length) * 100).toFixed(0) + '% посещаемость'
                  : '0% посещаемость'
                }
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('events.admin.registrations.cancelledCount')}
              </Typography>
              <Typography variant="h6" color="error.main">
                {eventRegistrations.filter(r => r.status === 'cancelled').length}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">
                Доступно мест
              </Typography>
              <Typography 
                variant="h6" 
                color={event.capacity - eventRegistrations.filter(r => r.status === 'registered' || r.status === 'attended').length <= 3 ? 'error.main' : 'text.primary'}
              >
                {event.capacity - eventRegistrations.filter(r => r.status === 'registered' || r.status === 'attended').length}
              </Typography>
            </Box>
          </Stack>
        </Paper>
        
        {/* Registration Statistics */}
        <EventRegistrationStats 
          event={event}
          registrations={eventRegistrations}
        />
      </Box>
      
      <AdminTable
        columns={columns}
        data={filteredRegistrations}
        loading={loading}
        error={error}
        emptyMessage={
          eventRegistrations.length === 0
            ? t('events.admin.registrations.noRegistrations')
            : t('events.admin.registrations.noMatchingRegistrations')
        }
      />
    </>
  );
};

export default EventRegistrationsTable;