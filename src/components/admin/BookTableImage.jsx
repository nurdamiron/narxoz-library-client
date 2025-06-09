import React, { memo } from 'react';
import { Box } from '@mui/material';

const BookTableImage = memo(({ src, alt, fallbackSrc = '/images/default-book-cover.jpg' }) => {
  return (
    <Box 
      component="img" 
      src={src} 
      alt={alt}
      loading="lazy"
      sx={{ 
        width: 60, 
        height: 80, 
        objectFit: 'cover',
        borderRadius: 1,
        border: '1px solid #e0e0e0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        backgroundColor: '#f5f5f5',
        '&:hover': {
          transform: 'scale(1.05)',
          transition: 'transform 0.2s ease-in-out'
        }
      }}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = fallbackSrc;
      }}
    />
  );
});

BookTableImage.displayName = 'BookTableImage';

export default BookTableImage;