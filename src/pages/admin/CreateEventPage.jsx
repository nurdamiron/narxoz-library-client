/**
 * Create Event Page
 * 
 * Page for creating a new event in the admin interface
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs, Typography, Link, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { EventForm } from '../../components/admin/events';

const CreateEventPage = () => {
  const { t } = useTranslation();
  
  return (
    <>
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
          {t('events.admin.form.createTitle')}
        </Typography>
      </Breadcrumbs>
      
      <Box sx={{ mt: 2 }}>
        <EventForm />
      </Box>
    </>
  );
};

export default CreateEventPage;