/**
 * Event Details Page
 * 
 * Page for viewing event details and registration
 */
import React, { useEffect } from 'react';
import { EventDetails } from '../components/events';
import { Container, Box } from '@mui/material';
import { useParams } from '../utils/hookUtils';

const EventDetailsPage = () => {
  const { id } = useParams();
  
  // Log the event ID for debugging
  useEffect(() => {
    console.log('EventDetailsPage rendering, id:', id);
  }, [id]);

  return (
    <Box>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <EventDetails />
      </Container>
    </Box>
  );
};

export default EventDetailsPage;