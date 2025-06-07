/**
 * Event Form Component
 * 
 * Form for creating or editing events in the admin interface
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Chip,
  OutlinedInput,
  Paper,
  Divider,
  Alert,
  Switch,
  FormControlLabel,
  Stack
} from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import eventService from '../../../services/eventService';
import useAdminEvents from '../../../hooks/useAdminEvents';
import EventMediaPreview from './EventMediaPreview';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const EventForm = ({ event = null, onSuccess }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(event?.image || null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState(null);
  const { createEvent, updateEvent } = useAdminEvents();
  
  // Check if editing or creating
  const isEditing = !!event;
  
  // State management
  
  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await eventService.getEventCategories();
        if (response.success) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Setup form validation schema
  const validationSchema = Yup.object({
    title: Yup.string()
      .required(t('events.admin.form.errors.titleRequired'))
      .min(3, t('events.admin.form.errors.titleMin'))
      .max(200, t('events.admin.form.errors.titleMax')),
    description: Yup.string()
      .required(t('events.admin.form.errors.descriptionRequired')),
    type: Yup.string()
      .required(t('events.admin.form.errors.typeRequired'))
      .oneOf(['workshop', 'lecture', 'exhibition', 'meetup', 'other'], t('events.admin.form.errors.typeInvalid')),
    location: Yup.string()
      .required(t('events.admin.form.errors.locationRequired')),
    startDate: Yup.date()
      .required(t('events.admin.form.errors.startDateRequired'))
      .when('$isEditing', {
        is: true,
        then: (schema) => schema,
        otherwise: (schema) => schema.min(new Date(), t('events.admin.form.errors.startDateFuture'))
      }),
    endDate: Yup.date()
      .required(t('events.admin.form.errors.endDateRequired'))
      .when('startDate', (startDate, schema) => {
        return startDate ? schema.min(startDate, t('events.admin.form.errors.endDateAfterStart')) : schema;
      }),
    registrationDeadline: Yup.date()
      .required(t('events.admin.form.errors.registrationDeadlineRequired'))
      .when('startDate', (startDate, schema) => {
        return startDate ? schema.max(startDate, t('events.admin.form.errors.registrationDeadlineBeforeStart')) : schema;
      }),
    capacity: Yup.number()
      .required(t('events.admin.form.errors.capacityRequired'))
      .integer(t('events.admin.form.errors.capacityInteger'))
      .min(1, t('events.admin.form.errors.capacityMin')),
    isActive: Yup.boolean(),
    categories: Yup.array()
      .of(Yup.number())
  });

  // Form initialization and handling
  const formik = useFormik({
    initialValues: {
      title: event?.title || '',
      description: event?.description || '',
      type: event?.type || 'workshop',
      location: event?.location || '',
      startDate: event?.startDate ? new Date(event.startDate) : isEditing ? null : new Date(),
      endDate: event?.endDate ? new Date(event.endDate) : isEditing ? null : new Date(Date.now() + 7200000), // Default to 2 hours after start time
      registrationDeadline: event?.registrationDeadline ? new Date(event.registrationDeadline) : isEditing ? null : new Date(),
      capacity: event?.capacity || 30,
      isActive: event?.isActive ?? true,
      categories: event?.categories?.map(cat => cat.id) || [],
      imageFile: null
    },
    validationSchema,
    context: { isEditing },
    onSubmit: () => {} // Will be replaced with custom handler
  });

  // Handle image upload
  const handleImageUpload = async (file) => {
    setImageUploading(true);
    setImageError(null);

    try {
      // If we're editing an existing event, upload immediately
      if (isEditing && event?.id) {
        const result = await eventService.uploadEventImage(event.id, file);
        if (result.success) {
          setImageUrl(result.data.media);
        } else {
          setImageError(result.error || t('events.admin.form.errors.imageUploadFailed'));
        }
      } else {
        // For new events, store the file temporarily and create a preview URL
        const previewUrl = URL.createObjectURL(file);
        setImageUrl(previewUrl);
        // Store the file for later upload when the event is created
        formik.setFieldValue('imageFile', file);
      }
    } catch (err) {
      setImageError(err.message || t('events.admin.form.errors.imageUploadFailed'));
    } finally {
      setImageUploading(false);
    }
  };

  // Handle image removal
  const handleImageRemove = () => {
    setImageUrl(null);
    setImageError(null);
    formik.setFieldValue('imageFile', null);
  };

  // Custom submit handler to handle image upload for new events
  const handleFormSubmit = async (values) => {
    setLoading(true);
    setError(null);
    
    try {
      // Format dates for API
      const formattedValues = {
        ...values,
        startDate: values.startDate?.toISOString(),
        endDate: values.endDate?.toISOString(),
        registrationDeadline: values.registrationDeadline?.toISOString()
      };
      
      // Remove imageFile from form data as it's not part of the API
      const { imageFile, ...apiValues } = formattedValues;
      
      let result;
      
      if (isEditing) {
        result = await updateEvent(event.id, apiValues);
      } else {
        result = await createEvent(apiValues);
        
        // If event was created successfully and we have an image file, upload it
        if (result.success && imageFile) {
          try {
            const imageResult = await eventService.uploadEventImage(result.data.id, imageFile);
            if (!imageResult.success) {
              console.warn('Event created but image upload failed:', imageResult.error);
            }
          } catch (imageErr) {
            console.warn('Event created but image upload failed:', imageErr);
          }
        }
      }
      
      if (result.success) {
        if (onSuccess) {
          onSuccess(result.data);
        } else {
          navigate('/admin/events');
        }
      } else {
        setError(result.error || t('events.admin.form.errors.submitError'));
      }
    } catch (err) {
      setError(err.message || t('events.admin.form.errors.submitError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
        {isEditing 
          ? t('events.admin.form.editTitle') 
          : t('events.admin.form.createTitle')}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={(e) => { e.preventDefault(); handleFormSubmit(formik.values); }} noValidate sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          {/* Event Title */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="title"
              name="title"
              label={t('events.admin.form.title')}
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              required
            />
          </Grid>

          {/* Event Image Upload */}
          <Grid item xs={12}>
            <EventMediaPreview
              imageUrl={imageUrl}
              onImageUpload={handleImageUpload}
              onImageRemove={handleImageRemove}
              loading={imageUploading}
              error={imageError}
              disabled={loading}
            />
          </Grid>
          
          {/* Event Type */}
          <Grid item xs={12} md={6}>
            <FormControl 
              fullWidth
              error={formik.touched.type && Boolean(formik.errors.type)}
            >
              <InputLabel id="type-label" required>
                {t('events.admin.form.type')}
              </InputLabel>
              <Select
                labelId="type-label"
                id="type"
                name="type"
                value={formik.values.type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label={t('events.admin.form.type')}
              >
                <MenuItem value="workshop">{t('events.types.workshop')}</MenuItem>
                <MenuItem value="lecture">{t('events.types.lecture')}</MenuItem>
                <MenuItem value="exhibition">{t('events.types.exhibition')}</MenuItem>
                <MenuItem value="meetup">{t('events.types.meetup')}</MenuItem>
                <MenuItem value="other">{t('events.types.other')}</MenuItem>
              </Select>
              {formik.touched.type && formik.errors.type && (
                <FormHelperText>{formik.errors.type}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          
          {/* Event Categories */}
          <Grid item xs={12} md={6}>
            <FormControl 
              fullWidth
              error={formik.touched.categories && Boolean(formik.errors.categories)}
            >
              <InputLabel id="categories-label">
                {t('events.admin.form.categories')}
              </InputLabel>
              <Select
                labelId="categories-label"
                id="categories"
                name="categories"
                multiple
                value={formik.values.categories}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                input={<OutlinedInput label={t('events.admin.form.categories')} />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const category = categories.find(cat => cat.id === value);
                      return (
                        <Chip 
                          key={value} 
                          label={category ? category.name : value} 
                          size="small" 
                        />
                      );
                    })}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.categories && formik.errors.categories && (
                <FormHelperText>{formik.errors.categories}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          
          {/* Location */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="location"
              name="location"
              label={t('events.admin.form.location')}
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.location && Boolean(formik.errors.location)}
              helperText={formik.touched.location && formik.errors.location}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider>
              <Typography variant="body2" color="text.secondary">
                {t('events.admin.form.dateTimeSection')}
              </Typography>
            </Divider>
          </Grid>
          
          {/* Start Date */}
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label={t('events.admin.form.startDate')}
                value={formik.values.startDate}
                onChange={(value) => formik.setFieldValue('startDate', value)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    onBlur: formik.handleBlur,
                    error: formik.touched.startDate && Boolean(formik.errors.startDate),
                    helperText: formik.touched.startDate && formik.errors.startDate,
                    name: 'startDate'
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          
          {/* End Date */}
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label={t('events.admin.form.endDate')}
                value={formik.values.endDate}
                onChange={(value) => formik.setFieldValue('endDate', value)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    onBlur: formik.handleBlur,
                    error: formik.touched.endDate && Boolean(formik.errors.endDate),
                    helperText: formik.touched.endDate && formik.errors.endDate,
                    name: 'endDate'
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          
          {/* Registration Deadline */}
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label={t('events.admin.form.registrationDeadline')}
                value={formik.values.registrationDeadline}
                onChange={(value) => formik.setFieldValue('registrationDeadline', value)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    onBlur: formik.handleBlur,
                    error: formik.touched.registrationDeadline && Boolean(formik.errors.registrationDeadline),
                    helperText: formik.touched.registrationDeadline && formik.errors.registrationDeadline,
                    name: 'registrationDeadline'
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12}>
            <Divider>
              <Typography variant="body2" color="text.secondary">
                {t('events.admin.form.detailsSection')}
              </Typography>
            </Divider>
          </Grid>
          
          {/* Capacity */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="capacity"
              name="capacity"
              label={t('events.admin.form.capacity')}
              type="number"
              value={formik.values.capacity}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.capacity && Boolean(formik.errors.capacity)}
              helperText={formik.touched.capacity && formik.errors.capacity}
              required
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Grid>
          
          {/* Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="description"
              name="description"
              label={t('events.admin.form.description')}
              multiline
              rows={5}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              required
            />
          </Grid>
          
          {/* Active Status */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.isActive}
                  onChange={formik.handleChange}
                  name="isActive"
                />
              }
              label={t('events.admin.form.isActive')}
            />
            <Typography variant="body2" color="text.secondary">
              {t('events.admin.form.isActiveHint')}
            </Typography>
          </Grid>
          
          {/* Form Actions */}
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => navigate('/admin/events')}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading 
                  ? t('common.submitting')
                  : isEditing 
                    ? t('common.update') 
                    : t('common.create')}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default EventForm;