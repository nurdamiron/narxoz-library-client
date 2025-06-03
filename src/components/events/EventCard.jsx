/**
 * Event Card Component
 * 
 * Displays a single event in a card format for use in grid or list views
 */
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Stack,
  Divider,
  Link,
  alpha
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Group as GroupIcon,
  ImageNotSupported as ImageNotSupportedIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { getEventImageUrl } from '../../utils/eventMediaUtils';

const EventCard = ({ event, isLoading = false }) => {
  const { t } = useTranslation();
  
  // Return loading skeleton if in loading state
  if (isLoading) {
    return (
      <Card
        elevation={2}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ height: 200, bgcolor: 'grey.200' }} />
        <CardContent>
          <Box sx={{ height: 24, width: '40%', bgcolor: 'grey.300', borderRadius: 1, mb: 2 }} />
          <Box sx={{ height: 32, bgcolor: 'grey.300', borderRadius: 1, mb: 3 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <Box sx={{ height: 24, width: 24, bgcolor: 'grey.300', borderRadius: '50%', mr: 1.5 }} />
            <Box sx={{ height: 16, width: '70%', bgcolor: 'grey.300', borderRadius: 1 }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <Box sx={{ height: 24, width: 24, bgcolor: 'grey.300', borderRadius: '50%', mr: 1.5 }} />
            <Box sx={{ height: 16, width: '50%', bgcolor: 'grey.300', borderRadius: 1 }} />
          </Box>
        </CardContent>
      </Card>
    );
  }
  
  // Format dates
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const registrationDeadline = new Date(event.registrationDeadline);
  const isRegistrationOpen = new Date() < registrationDeadline;
  const isPastEvent = new Date() > endDate;
  
  // Calculate available spots
  const registeredCount = event.registeredCount || 0;
  const availableSpots = event.capacity - registeredCount;
  
  // Get event image URL
  const eventImageUrl = getEventImageUrl(event);
  
  // Get event type color
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

  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
        opacity: !event.isActive || isPastEvent ? 0.8 : 1,
        borderTop: `4px solid`,
        borderColor: `${getTypeColor(event.type)}.main`,
      }}
    >
      {/* Event Image */}
      <CardMedia
        component="img"
        height="200"
        image={eventImageUrl}
        alt={event.title}
        sx={{
          objectFit: 'cover',
          backgroundColor: 'grey.100',
          borderBottom: `1px solid`,
          borderColor: 'divider'
        }}
        onError={(e) => {
          // If image fails to load, show placeholder
          e.target.src = '/images/event-placeholder.jpg';
        }}
      />
      
      {/* Event Content */}
      <CardContent sx={{ flexGrow: 1, pb: 1, pt: 2 }}>
        {/* Event Type Chip */}
        <Box sx={{ mb: 2 }}>
          <Chip
            label={t(`events.types.${event.type}`)}
            size="small"
            color={getTypeColor(event.type)}
            sx={{ mr: 1 }}
          />
          
          {!event.isActive && (
            <Chip
              label={t('events.inactive')}
              size="small"
              color="error"
            />
          )}
          
          {isPastEvent && (
            <Chip
              label={t('events.past')}
              size="small"
              color="default"
            />
          )}
        </Box>
        
        {/* Event Title */}
        <Link
          component={RouterLink}
          to={`/events/${event.id}`}
          color="inherit"
          underline="none"
        >
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            noWrap
            title={event.title}
            sx={{
              fontWeight: 600,
              fontSize: '1.1rem',
              lineHeight: 1.3,
              mb: 2,
              height: '2.6rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              color: 'primary.main'
            }}
          >
            {event.title}
          </Typography>
        </Link>
        
        {/* Event Details */}
        <Stack spacing={1} sx={{ mb: 2 }}>
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
          
          {/* Organizer (if available) */}
          {event.creator && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonIcon
                fontSize="small"
                color="action"
                sx={{ mr: 1, opacity: 0.7 }}
              />
              <Typography variant="body2" color="text.secondary">
                {event.creator.name}
              </Typography>
            </Box>
          )}
          
          {/* Categories */}
          {event.categories && event.categories.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <CategoryIcon
                fontSize="small"
                color="action"
                sx={{ mr: 1, opacity: 0.7, mt: 0.3 }}
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {event.categories.slice(0, 2).map(category => (
                  <Chip
                    key={category.id}
                    label={category.name}
                    size="small"
                    variant="outlined"
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                ))}
                {event.categories.length > 2 && (
                  <Chip
                    label={`+${event.categories.length - 2}`}
                    size="small"
                    variant="outlined"
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                )}
              </Box>
            </Box>
          )}
          
          {/* Capacity */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <GroupIcon
              fontSize="small"
              color="action"
              sx={{ mr: 1, opacity: 0.7 }}
            />
            <Typography
              variant="body2"
              color={availableSpots <= 3 && !isPastEvent ? 'error.main' : 'text.secondary'}
              fontWeight={availableSpots <= 3 && !isPastEvent ? 'medium' : 'normal'}
            >
              {isRegistrationOpen
                ? t('events.availableSpots', { count: availableSpots })
                : t('events.capacity', { capacity: event.capacity })}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
      
      <Divider />
      
      {/* Card Actions */}
      <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1.5 }}>
        {/* Registration Status */}
        {event.isRegistered ? (
          <Chip
            label={t(`events.status.${event.registrationStatus}`)}
            color={event.registrationStatus === 'attended' ? 'success' : 'primary'}
            size="small"
            variant="outlined"
          />
        ) : (
          <Box />
        )}
        
        {/* View Details Button */}
        <Button
          component={RouterLink}
          to={`/events/${event.id}`}
          size="small"
          sx={{ ml: 'auto' }}
        >
          {t('events.viewDetails')}
        </Button>
      </CardActions>
    </Card>
  );
};

export default EventCard;