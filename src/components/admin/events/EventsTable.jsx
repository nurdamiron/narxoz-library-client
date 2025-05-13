/**
 * Events Table Component
 * 
 * Displays a table of events with management options in the admin interface
 */
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Badge,
  TextField,
  InputAdornment,
  Stack
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  GroupAdd as RegistrationsIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import useAdminEvents from '../../../hooks/useAdminEvents';
import AdminTable from '../common/AdminTable';

const EventsTable = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user && user.role === 'admin';
  const isModerator = user && user.role === 'moderator';
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  
  const { 
    myCreatedEvents, 
    loading, 
    error, 
    fetchMyCreatedEvents, 
    deleteEvent 
  } = useAdminEvents();
  
  // Fetch events on component mount
  useEffect(() => {
    fetchMyCreatedEvents();
  }, [fetchMyCreatedEvents]);
  
  // Filter events based on search term
  const filteredEvents = myCreatedEvents.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Handle delete dialog
  const handleOpenDeleteDialog = (event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setEventToDelete(null);
  };
  
  // Handle event deletion
  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;
    
    const result = await deleteEvent(eventToDelete.id);
    
    if (result.success) {
      fetchMyCreatedEvents();
    }
    
    handleCloseDeleteDialog();
  };
  
  // Get type color
  const getTypeColor = (type) => {
    switch (type) {
      case 'workshop':
        return 'primary';
      case 'lecture':
        return 'secondary';
      case 'exhibition':
        return 'success';
      case 'meetup':
        return 'warning';
      default:
        return 'default';
    }
  };
  
  // Table columns definition
  const columns = [
    {
      id: 'title',
      label: t('events.admin.table.title'),
      render: (event) => (
        <Box>
          <Typography variant="subtitle2" noWrap sx={{ maxWidth: 250 }}>
            {event.title}
          </Typography>
          {!event.isActive && (
            <Chip
              label={t('events.inactive')}
              size="small"
              color="error"
              variant="outlined"
              sx={{ mt: 0.5 }}
            />
          )}
        </Box>
      ),
    },
    {
      id: 'type',
      label: t('events.admin.table.type'),
      render: (event) => (
        <Chip
          label={t(`events.types.${event.type}`)}
          size="small"
          color={getTypeColor(event.type)}
        />
      ),
    },
    {
      id: 'date',
      label: t('events.admin.table.date'),
      render: (event) => {
        if (!event || !event.startDate || !event.endDate) {
          return (
            <Box>
              <Typography variant="body2" color="error">
                {t('common.error')}
              </Typography>
            </Box>
          );
        }
        
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);
        const isPastEvent = new Date() > endDate;
        
        return (
          <Box>
            <Typography variant="body2">
              {format(startDate, 'd MMM yyyy')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')}
            </Typography>
            {isPastEvent && (
              <Chip
                label={t('events.past')}
                size="small"
                variant="outlined"
                sx={{ ml: 1, height: 20 }}
              />
            )}
          </Box>
        );
      },
    },
    {
      id: 'location',
      label: t('events.admin.table.location'),
      render: (event) => (
        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
          {event.location}
        </Typography>
      ),
    },
    {
      id: 'capacity',
      label: t('events.admin.table.capacity'),
      render: (event) => {
        const registeredCount = event.registrations?.length || 0;
        const availableSpots = event.capacity - registeredCount;
        
        return (
          <Box>
            <Typography variant="body2">
              {registeredCount}/{event.capacity}
            </Typography>
            <Typography 
              variant="caption" 
              color={availableSpots <= 3 ? 'error.main' : 'text.secondary'}
            >
              {availableSpots} {t('events.admin.table.available')}
            </Typography>
          </Box>
        );
      },
    },
    {
      id: 'actions',
      label: t('events.admin.table.actions'),
      render: (event) => (
        <Box sx={{ display: 'flex' }}>
          <Tooltip title={t('events.admin.viewEvent')}>
            <IconButton
              component={RouterLink}
              to={`/events/${event.id}`}
              size="small"
            >
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={t('events.admin.manageRegistrations')}>
            <IconButton
              component={RouterLink}
              to={`/admin/events/${event.id}/registrations`}
              size="small"
              color="primary"
            >
              <Badge 
                badgeContent={event.registrations?.length || 0}
                color="primary"
                max={99}
              >
                <RegistrationsIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <Tooltip title={t('events.admin.editEvent')}>
            <IconButton
              component={RouterLink}
              to={`/admin/events/edit/${event.id}`}
              size="small"
              color="primary"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          {/* Show delete button for admins or for moderators who created the event */}
          {(isAdmin || (isModerator && parseInt(event.createdBy) === parseInt(user.id))) && (
            <Tooltip title={t('events.admin.deleteEvent')}>
              <IconButton
                onClick={() => handleOpenDeleteDialog(event)}
                size="small"
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <TextField
            placeholder={t('events.admin.search')}
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={RouterLink}
            to="/admin/events/create"
          >
            {t('events.admin.createEvent')}
          </Button>
        </Box>
      </Box>
      
      <AdminTable
        columns={columns}
        data={filteredEvents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
        loading={loading}
        error={error}
        emptyMessage={t('events.admin.noEvents')}
        pagination={
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={filteredEvents.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        }
      />
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>{t('events.admin.deleteConfirmation.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('events.admin.deleteConfirmation.message', { title: eventToDelete?.title })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleDeleteEvent} 
            color="error" 
            variant="contained"
          >
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EventsTable;