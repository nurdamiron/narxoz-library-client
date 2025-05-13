/**
 * Event Registrations Page
 * 
 * Page for managing registrations for a specific event
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Paper, Typography, Box } from '@mui/material';
import { EventRegistrationsTable } from '../../components/admin/events';

const EventRegistrationsPage = () => {
  const { t } = useTranslation();
  
  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {t('events.admin.registrations.title')}
        </Typography>
      </Box>
      <Paper sx={{ p: 3 }}>
        <EventRegistrationsTable />
      </Paper>
    </>
  );
};

export default EventRegistrationsPage;