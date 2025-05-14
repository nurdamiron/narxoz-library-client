import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * Component for previewing event media images
 * 
 * @param {Object} props - Component properties
 * @param {File|null} props.file - Media file or null if not selected
 * @param {string|null} props.imageUrl - URL of existing image (for editing)
 * @param {string} props.title - Event title (for alt text)
 * @returns {JSX.Element} Media preview component
 */
const EventMediaPreview = ({ file, imageUrl, title }) => {
  const { t } = useTranslation();
  
  // Create URL from File object if it exists
  const fileUrl = file ? URL.createObjectURL(file) : null;
  
  // Use the file URL if it exists, otherwise use the provided imageUrl
  // Fall back to a placeholder if neither exists
  const previewUrl = fileUrl || (imageUrl || '/images/event-placeholder.jpg');

  // Clean up object URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mb: 2
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: 300,
          height: 180,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          mb: 1
        }}
      >
        <Box
          component="img"
          src={previewUrl}
          alt={title || t('events.noImage')}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            // Replace with placeholder if image fails to load
            e.target.src = '/images/event-placeholder.jpg';
          }}
        />
      </Paper>
      <Typography variant="caption" color="text.secondary">
        {file ? t('events.mediaPreview', 'Алдын ала қарау') : t('events.eventImage', 'Іс-шара суреті')}
      </Typography>
    </Box>
  );
};

export default EventMediaPreview;