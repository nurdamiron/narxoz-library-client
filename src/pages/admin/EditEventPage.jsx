/**
 * Edit Event Page
 * 
 * Page for editing an existing event in the admin interface
 */
import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Breadcrumbs, 
  Typography, 
  Link, 
  CircularProgress, 
  Box,
  Alert
} from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { EventForm } from '../../components/admin/events';
import eventService from '../../services/eventService';

const EditEventPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        
        const response = await eventService.getEvent(id);
        
        if (response.success) {
          setEvent(response.data);
        } else {
          setError(response.error || t('events.admin.form.fetchError'));
        }
      } catch (err) {
        setError(err.message || t('events.admin.form.fetchError'));
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchEvent();
    }
  }, [id, t]);
  
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
          {t('events.admin.form.editTitle')}
        </Typography>
      </Breadcrumbs>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : event ? (
        <Box sx={{ mt: 2 }}>
          <EventForm event={event} />
        </Box>
      ) : (
        <Alert severity="info" sx={{ mt: 2 }}>
          {t('events.admin.form.eventNotFound')}
        </Alert>
      )}
    </>
  );
};

export default EditEventPage;