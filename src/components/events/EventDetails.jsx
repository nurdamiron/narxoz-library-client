/**
 * Event Details Component
 * 
 * Displays detailed information about an event and allows registration
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from '../../utils/hookUtils';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  Chip,
  Divider,
  Card,
  CardMedia,
  Avatar,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Group as GroupIcon,
  Category as CategoryIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useEvents } from '../../hooks';
import { useAuth } from '../../context/AuthContext';
import LoadingSkeleton from '../common/LoadingSkeleton';

const EventDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  
  // Get event data and handlers from custom hook
  const {
    event,
    loading,
    error,
    fetchEvent,
    registerForEvent,
    cancelRegistration
  } = useEvents();
  
  // Fetch event data on component mount
  useEffect(() => {
    if (id) {
      // id is already sanitized by our custom useParams hook
      fetchEvent(id);
    }
  }, [id, fetchEvent]);
  
  // Handle registration
  const handleRegister = async () => {
    setConfirmOpen(false);
    
    if (!isAuthenticated) {
      // id is already sanitized by our custom useParams hook
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }
    
    // id is already sanitized by our custom useParams hook
    const success = await registerForEvent(id);
    if (success) {
      fetchEvent(id); // Refresh event data
    }
  };
  
  // Handle cancellation
  const handleCancelRegistration = async () => {
    setCancelOpen(false);
    
    // id is already sanitized by our custom useParams hook
    const success = await cancelRegistration(id);
    if (success) {
      fetchEvent(id); // Refresh event data
    }
  };
  
  if (loading) {
    return <LoadingSkeleton type="eventDetails" />;
  }
  
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }
  
  if (!event) {
    return <Alert severity="info">{t('events.notFound')}</Alert>;
  }
  
  // Format dates
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const registrationDeadline = new Date(event.registrationDeadline);
  const now = new Date();
  
  // Check registration status
  const isRegistrationOpen = now < registrationDeadline;
  const isPastEvent = now > endDate;
  const isFull = event.availableSpots <= 0;
  const canRegister = isAuthenticated && event.isActive && isRegistrationOpen && !isPastEvent && !isFull && !event.isRegistered;
  const canCancel = isAuthenticated && event.isRegistered && event.registrationStatus === 'registered' && now < startDate;

  return (
    <>
      {/* Status alert */}
      {(!event.isActive || isPastEvent) && (
        <Alert 
          severity={isPastEvent ? "info" : "warning"} 
          sx={{ mb: 3 }}
          icon={isPastEvent ? <EventIcon /> : <WarningIcon />}
        >
          {isPastEvent 
            ? t('events.alerts.pastEvent') 
            : t('events.alerts.inactive')}
        </Alert>
      )}
      
      {/* Registration status alert */}
      {event.isRegistered && (
        <Alert 
          severity={event.registrationStatus === 'cancelled' ? "warning" : "success"} 
          sx={{ mb: 3 }}
          icon={event.registrationStatus === 'cancelled' ? <CancelIcon /> : <CheckCircleIcon />}
        >
          {t(`events.alerts.${event.registrationStatus}`)}
        </Alert>
      )}
      
      <Grid container spacing={4}>
        {/* Left column - Main content */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ mb: 3, overflow: 'hidden', borderTop: '6px solid', borderColor: 'primary.main' }}>
            <Box sx={{ p: 3, pt: 3 }}>
              {/* Event type chip */}
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={t(`events.types.${event.type}`)}
                  color="primary"
                  sx={{ fontWeight: 'medium' }}
                />
              </Box>
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                {event.title}
              </Typography>
              
              {/* Categories */}
              {event.categories && event.categories.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {event.categories.map(category => (
                    <Chip
                      key={category.id}
                      label={category.name}
                      size="small"
                      variant="outlined"
                      icon={<CategoryIcon fontSize="small" />}
                    />
                  ))}
                </Box>
              )}
              
              <Divider sx={{ my: 3 }} />
              
              {/* Event description */}
              <Typography variant="body1" paragraph>
                {event.description}
              </Typography>
            </Box>
          </Paper>
          
          {/* Organizer info if available */}
          {event.creator && (
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('events.organizer')}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  alt={event.creator.name}
                  src={event.creator.avatar}
                  sx={{ width: 48, height: 48, mr: 2 }}
                />
                
                <Box>
                  <Typography fontWeight="medium">
                    {`${event.creator.firstName} ${event.creator.lastName}` || event.creator.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(`roles.${event.creator.role}`, event.creator.role)}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          )}
        </Grid>
        
        {/* Right column - Event details and registration */}
        <Grid item xs={12} md={4}>
          {/* Event details card */}
          <Card elevation={2} sx={{ mb: 3 }}>
            <List>
              {/* Date and time */}
              <ListItem>
                <ListItemIcon>
                  <EventIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={t('events.dateAndTime')}
                  secondary={
                    <>
                      <Typography variant="body2">
                        {format(startDate, 'EEEE, d MMMM yyyy')}
                      </Typography>
                      <Typography variant="body2">
                        {format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')}
                        {startDate.toDateString() !== endDate.toDateString() && (
                          ` (${t('events.untilDate', { date: format(endDate, 'd MMMM') })})`
                        )}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              
              <Divider variant="inset" component="li" />
              
              {/* Location */}
              <ListItem>
                <ListItemIcon>
                  <LocationIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={t('events.location')}
                  secondary={event.location}
                />
              </ListItem>
              
              <Divider variant="inset" component="li" />
              
              {/* Registration deadline */}
              <ListItem>
                <ListItemIcon>
                  <TimeIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={t('events.registrationDeadline')}
                  secondary={
                    isPastEvent
                      ? t('events.registrationClosed')
                      : isRegistrationOpen
                        ? format(registrationDeadline, 'd MMMM yyyy, HH:mm')
                        : t('events.registrationClosed')
                  }
                />
              </ListItem>
              
              <Divider variant="inset" component="li" />
              
              {/* Capacity */}
              <ListItem>
                <ListItemIcon>
                  <GroupIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={t('events.capacity', { capacity: event.capacity })}
                  secondary={
                    <>
                      <Typography 
                        variant="body2" 
                        color={isFull && !isPastEvent ? 'error.main' : 'text.secondary'}
                      >
                        {t('events.registeredCount', { 
                          registered: event.registeredCount || 0, 
                          total: event.capacity 
                        })}
                      </Typography>
                      
                      {!isPastEvent && (
                        <Typography 
                          variant="body2" 
                          color={isFull ? 'error.main' : 'success.main'}
                          fontWeight="medium"
                        >
                          {isFull 
                            ? t('events.noSpotsAvailable') 
                            : t('events.spotsAvailable', { count: event.availableSpots })}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
            </List>
          </Card>
          
          {/* Registration card */}
          <Card elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('events.registration.title')}
            </Typography>
            
            {event.isRegistered ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      bgcolor: event.registrationStatus === 'cancelled' 
                        ? 'warning.light' 
                        : 'success.light',
                      color: event.registrationStatus === 'cancelled' 
                        ? 'warning.dark' 
                        : 'success.dark',
                      borderRadius: 1,
                      px: 1.5,
                      py: 0.75,
                      display: 'flex',
                      alignItems: 'center',
                      mr: 1
                    }}
                  >
                    {event.registrationStatus === 'cancelled' 
                      ? <CancelIcon fontSize="small" sx={{ mr: 0.5 }} /> 
                      : <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />}
                    <Typography variant="body2" fontWeight="medium">
                      {t(`events.status.${event.registrationStatus}`)}
                    </Typography>
                  </Box>
                </Box>
                
                {canCancel && (
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={() => setCancelOpen(true)}
                    sx={{ mt: 1 }}
                  >
                    {t('events.registration.cancel')}
                  </Button>
                )}
              </>
            ) : (
              <>
                {!isAuthenticated ? (
                  <>
                    <Typography variant="body2" paragraph>
                      {t('events.registration.loginRequired')}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => navigate('/login', { state: { from: `/events/${id}` } })}
                    >
                      {t('common.login')}
                    </Button>
                  </>
                ) : canRegister ? (
                  <>
                    <Typography variant="body2" paragraph>
                      {t('events.registration.prompt')}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => setConfirmOpen(true)}
                    >
                      {t('events.registration.register')}
                    </Button>
                  </>
                ) : (
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                  >
                    {isFull 
                      ? t('events.registration.full') 
                      : isPastEvent 
                        ? t('events.registration.past')
                        : !isRegistrationOpen 
                          ? t('events.registration.closed')
                          : !event.isActive 
                            ? t('events.registration.inactive')
                            : t('events.registration.unavailable')}
                  </Typography>
                )}
              </>
            )}
          </Card>
        </Grid>
      </Grid>
      
      {/* Registration confirmation dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>{t('events.registration.confirmTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('events.registration.confirmText', { title: event.title })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleRegister} variant="contained" autoFocus>
            {t('events.registration.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Cancellation confirmation dialog */}
      <Dialog open={cancelOpen} onClose={() => setCancelOpen(false)}>
        <DialogTitle>{t('events.registration.cancelTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('events.registration.cancelText', { title: event.title })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelOpen(false)}>
            {t('common.back')}
          </Button>
          <Button onClick={handleCancelRegistration} color="error" variant="contained">
            {t('events.registration.confirmCancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EventDetails;