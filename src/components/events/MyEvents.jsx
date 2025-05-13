/**
 * My Events Component
 * 
 * Displays events the user is registered for, separated into upcoming and past events
 */
import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Grid,
  Button,
  Divider,
  Card,
  CardContent,
  CardActions,
  Chip,
  Stack,
  Alert
} from '@mui/material';
import {
  Event as EventIcon,
  Today as TodayIcon,
  History as HistoryIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useEvents } from '../../hooks';
import LoadingSkeleton from '../common/LoadingSkeleton';
import EmptyState from '../common/EmptyState';

const MyEvents = () => {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = React.useState(0);
  
  // Get events data and handlers from custom hook
  const {
    myEvents,
    loading,
    error,
    fetchMyEvents,
    cancelRegistration
  } = useEvents();
  
  // Fetch user's events on component mount
  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle registration cancellation
  const handleCancelRegistration = async (eventId) => {
    const success = await cancelRegistration(eventId);
    
    if (success) {
      fetchMyEvents(); // Refresh events data
    }
  };
  
  // Render event card
  const renderEventCard = (event) => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const isPastEvent = new Date() > endDate;
    const statusColor = event.registrationStatus === 'attended' 
      ? 'success' 
      : event.registrationStatus === 'cancelled' 
        ? 'error' 
        : 'primary';
    
    return (
      <Card 
        elevation={2} 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%',
          opacity: event.registrationStatus === 'cancelled' ? 0.7 : 1,
          position: 'relative'
        }}
        key={event.id}
      >
        {/* Status badge */}
        {event.registrationStatus && (
          <Chip
            label={t(`events.status.${event.registrationStatus}`)}
            color={statusColor}
            size="small"
            sx={{ 
              position: 'absolute', 
              top: 10, 
              right: 10,
              zIndex: 1
            }}
          />
        )}
        
        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          <Typography 
            variant="h6" 
            component="h3" 
            gutterBottom
            sx={{
              fontWeight: 600,
              fontSize: '1.1rem',
              mr: 4 // Space for the status chip
            }}
          >
            {event.title}
          </Typography>
          
          <Stack spacing={1} sx={{ mb: 2 }}>
            {/* Event type */}
            <Chip
              label={t(`events.types.${event.type}`)}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ alignSelf: 'flex-start' }}
            />
            
            {/* Date & Time */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EventIcon
                fontSize="small"
                color="action"
                sx={{ mr: 1, opacity: 0.7 }}
              />
              <Typography variant="body2" color="text.secondary">
                {format(startDate, 'd MMM yyyy, HH:mm')}
                {startDate.toDateString() !== endDate.toDateString() && (
                  ` - ${format(endDate, 'd MMM yyyy')}`
                )}
              </Typography>
            </Box>
            
            {/* Location */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationIcon
                fontSize="small"
                color="action"
                sx={{ mr: 1, opacity: 0.7 }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                noWrap
                title={event.location}
              >
                {event.location}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
        
        <Divider />
        
        <CardActions sx={{ p: 2 }}>
          <Button
            component={RouterLink}
            to={`/events/${event.id}`}
            size="small"
          >
            {t('events.viewDetails')}
          </Button>
          
          {!isPastEvent && event.registrationStatus === 'registered' && (
            <Button
              size="small"
              color="error"
              onClick={() => handleCancelRegistration(event.id)}
              sx={{ ml: 'auto' }}
            >
              {t('events.registration.cancel')}
            </Button>
          )}
        </CardActions>
      </Card>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        {t('events.myEvents.title')}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        {t('events.myEvents.description')}
      </Typography>
      
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab 
            icon={<TodayIcon />} 
            iconPosition="start"
            label={t('events.myEvents.upcoming')} 
          />
          <Tab 
            icon={<HistoryIcon />}
            iconPosition="start" 
            label={t('events.myEvents.past')} 
          />
        </Tabs>
      </Paper>
      
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(3)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <LoadingSkeleton type="event" />
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
        <>
          {/* Upcoming Events Tab */}
          {tabValue === 0 && (
            <>
              {myEvents.upcomingEvents && myEvents.upcomingEvents.length > 0 ? (
                <Grid container spacing={3}>
                  {myEvents.upcomingEvents.map(event => (
                    <Grid item xs={12} sm={6} md={4} key={event.id}>
                      {renderEventCard(event)}
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <EmptyState
                  icon={<EventIcon sx={{ fontSize: 60 }} />}
                  title={t('events.myEvents.noUpcoming')}
                  description={t('events.myEvents.registerPrompt')}
                  action={
                    <Button
                      component={RouterLink}
                      to="/events"
                      variant="contained"
                      color="primary"
                      startIcon={<EventIcon />}
                    >
                      {t('events.browseEvents')}
                    </Button>
                  }
                />
              )}
            </>
          )}
          
          {/* Past Events Tab */}
          {tabValue === 1 && (
            <>
              {myEvents.pastEvents && myEvents.pastEvents.length > 0 ? (
                <Grid container spacing={3}>
                  {myEvents.pastEvents.map(event => (
                    <Grid item xs={12} sm={6} md={4} key={event.id}>
                      {renderEventCard(event)}
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <EmptyState
                  icon={<HistoryIcon sx={{ fontSize: 60 }} />}
                  title={t('events.myEvents.noPast')}
                  description={t('events.myEvents.noPastDescription')}
                />
              )}
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default MyEvents;