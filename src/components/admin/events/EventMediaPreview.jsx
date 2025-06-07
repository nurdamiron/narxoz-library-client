/**
 * Event Media Preview Component
 * 
 * Handles image upload and preview for events
 */
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Stack
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon
} from '@mui/icons-material';

const EventMediaPreview = ({ 
  imageUrl, 
  onImageUpload, 
  onImageRemove, 
  loading = false, 
  error = null,
  disabled = false 
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    onImageUpload(file);
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    handleFileSelect(file);
    // Reset input value to allow re-uploading the same file
    event.target.value = '';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    
    if (disabled || loading) return;

    const files = Array.from(event.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileSelect(imageFile);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    if (!disabled && !loading) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleUploadClick = () => {
    if (!disabled && !loading) {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveImage = () => {
    if (!disabled && !loading && onImageRemove) {
      onImageRemove();
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        {t('events.admin.form.eventImage')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {imageUrl ? (
        <Card sx={{ maxWidth: 400, mb: 2 }}>
          <CardMedia
            component="img"
            height="200"
            image={imageUrl}
            alt="Event preview"
            sx={{ objectFit: 'cover' }}
          />
          <CardContent>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button
                variant="outlined"
                size="small"
                startIcon={<CloudUploadIcon />}
                onClick={handleUploadClick}
                disabled={disabled || loading}
              >
                {t('events.admin.form.changeImage')}
              </Button>
              <IconButton
                color="error"
                size="small"
                onClick={handleRemoveImage}
                disabled={disabled || loading}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Paper
          sx={{
            border: dragOver ? '2px dashed' : '2px dashed',
            borderColor: dragOver ? 'primary.main' : 'grey.400',
            bgcolor: dragOver ? 'action.hover' : 'background.paper',
            p: 4,
            textAlign: 'center',
            cursor: disabled || loading ? 'default' : 'pointer',
            opacity: disabled ? 0.6 : 1,
            transition: 'all 0.2s ease-in-out',
            '&:hover': disabled || loading ? {} : {
              borderColor: 'primary.main',
              bgcolor: 'action.hover'
            }
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleUploadClick}
        >
          {loading ? (
            <Box>
              <CircularProgress size={48} sx={{ mb: 2 }} />
              <Typography variant="body1">
                {t('events.admin.form.uploadingImage')}
              </Typography>
            </Box>
          ) : (
            <Box>
              <ImageIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {t('events.admin.form.uploadImageTitle')}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {t('events.admin.form.uploadImageDescription')}
              </Typography>
              <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                disabled={disabled}
              >
                {t('events.admin.form.selectImage')}
              </Button>
            </Box>
          )}
        </Paper>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />

      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
        {t('events.admin.form.imageUploadHint')}
      </Typography>
    </Box>
  );
};

export default EventMediaPreview;