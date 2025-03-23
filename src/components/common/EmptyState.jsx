/**
 * src/components/common/EmptyState.jsx
 * 
 * Бос күй компоненті
 * 
 * Бұл компонент деректер болмаған жағдайда көрсетіледі.
 * Мысалы, іздеу нәтижелері болмаған кезде немесе бетбелгілер тізімі бос болған кезде.
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import { motion } from 'framer-motion';

/**
 * EmptyState компоненті
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {React.ReactNode} props.icon - Көрсетілетін белгіше
 * @param {string} props.title - Бас тақырып
 * @param {string} props.description - Қосымша сипаттама
 * @param {string} props.actionText - Әрекет түймесінің мәтіні
 * @param {React.ReactNode} props.actionIcon - Әрекет түймесінің белгішесі
 * @param {Function} props.onAction - Түйме басылған кездегі әрекет
 * @param {Object} props.sx - Қосымша Material UI стильдері
 * @returns {JSX.Element} - Бос күй компоненті
 */
const EmptyState = ({
  icon,
  title,
  description,
  actionText,
  actionIcon,
  onAction,
  sx = {}
}) => {
  const theme = useTheme();
  
  // Анимация конфигурациясы
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };
  
  const iconVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Paper 
        elevation={2} 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          borderRadius: 3,
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
          ...sx
        }}
      >
        {icon && (
          <motion.div variants={iconVariants}>
            <Box 
              sx={{ 
                mb: 2, 
                color: 'primary.main',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              {React.cloneElement(icon, { 
                sx: { 
                  fontSize: 60,
                  ...icon.props.sx
                } 
              })}
            </Box>
          </motion.div>
        )}
        
        {title && (
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            {title}
          </Typography>
        )}
        
        {description && (
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ mb: actionText ? 3 : 0 }}
          >
            {description}
          </Typography>
        )}
        
        {actionText && onAction && (
          <Button
            variant="contained"
            color="primary"
            onClick={onAction}
            startIcon={actionIcon}
            sx={{
              mt: 2,
              px: 3,
              py: 1,
              borderRadius: 2,
              boxShadow: theme.shadows[3],
              '&:hover': {
                boxShadow: theme.shadows[5],
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            {actionText}
          </Button>
        )}
      </Paper>
    </motion.div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actionText: PropTypes.string,
  actionIcon: PropTypes.node,
  onAction: PropTypes.func,
  sx: PropTypes.object
};

export default EmptyState;