/**
 * Admin Events Page
 * 
 * Page for managing events in the admin interface
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Paper, Typography } from '@mui/material';
import { EventsTable } from '../../components/admin/events';

const EventsPage = () => {
  const { t } = useTranslation();
  
  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {t('events.admin.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('events.admin.description')}
        </Typography>
      </Box>
      <Paper sx={{ p: 3 }}>
        <EventsTable />
      </Paper>
    </>
  );
};

export default EventsPage;