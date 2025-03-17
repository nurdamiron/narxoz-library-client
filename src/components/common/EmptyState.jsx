import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  useTheme,
  alpha,
} from '@mui/material';

/**
 * EmptyState component for displaying when no items are available
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {string} props.title - Title text
 * @param {string} [props.description] - Optional description text
 * @param {string} [props.buttonText] - Optional button text
 * @param {string} [props.buttonLink] - Optional button link path
 * @param {Function} [props.buttonAction] - Optional button click handler
 */
const EmptyState = ({ 
  icon, 
  title, 
  description, 
  buttonText, 
  buttonLink,
  buttonAction
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 5,
        textAlign: 'center',
        border: '1px dashed',
        borderColor: alpha('#000', 0.1),
        borderRadius: 3,
      }}
    >
      {/* Icon */}
      {React.cloneElement(icon, {
        sx: {
          fontSize: 60,
          color: alpha('#000', 0.2),
          mb: 2,
        }
      })}
      
      {/* Title */}
      <Typography variant="h6" color="text.secondary">
        {title}
      </Typography>
      
      {/* Description (if provided) */}
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: buttonText ? 3 : 0 }}>
          {description}
        </Typography>
      )}
      
      {/* Button (if provided) */}
      {buttonText && (
        buttonLink ? (
          <Button
            variant="contained"
            component={RouterLink}
            to={buttonLink}
            sx={{ 
              mt: description ? 0 : 3,
              borderRadius: 2,
              bgcolor: '#d50032',
              '&:hover': {
                bgcolor: alpha('#d50032', 0.9),
              }
            }}
          >
            {buttonText}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={buttonAction}
            sx={{ 
              mt: description ? 0 : 3,
              borderRadius: 2,
              bgcolor: '#d50032',
              '&:hover': {
                bgcolor: alpha('#d50032', 0.9),
              }
            }}
          >
            {buttonText}
          </Button>
        )
      )}
    </Box>
  );
};

export default EmptyState;