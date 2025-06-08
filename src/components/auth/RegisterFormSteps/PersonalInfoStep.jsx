// src/components/auth/RegisterFormSteps/PersonalInfoStep.jsx
import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Typography, 
  InputAdornment, 
  Box, 
  useTheme, 
  useMediaQuery, 
  Card, 
  Avatar, 
  Divider,
  Collapse,
  Tooltip,
  IconButton,
  Paper
} from '@mui/material';
import { 
  AccountCircle, 
  BadgeOutlined, 
  Person, 
  Help as HelpIcon,
  Visibility,
  VisibilityOff,
  Info as InfoIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/**
 * Жеке ақпарат қадамы компоненті - Enhanced with better UI and animations
 */
const PersonalInfoStep = ({ formData, formErrors, handleInputChange, isLoading }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isExtraSmall = useMediaQuery(theme.breakpoints.down('xs'));
  
  // For showing/hiding helper information
  const [showHelp, setShowHelp] = useState(false);
  
  // For animation when name is entered
  const [nameEntered, setNameEntered] = useState(!!formData.name);

  // Check if name is entered
  useEffect(() => {
    setNameEntered(!!formData.name && formData.name.trim().length > 0);
  }, [formData.name]);

  // Toggle help information
  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  return (
    <motion.div
      key="step0"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.5 }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          flexDirection: isMobile ? 'column' : 'row',
          mb: 3,
          gap: 1
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              width: { xs: 48, sm: 56 },
              height: { xs: 48, sm: 56 },
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              mb: isMobile ? 1 : 0,
              mr: isMobile ? 0 : 2
            }}
          >
            <Person sx={{ fontSize: { xs: 28, sm: 32 } }} />
          </Avatar>
        </motion.div>
        
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            fontWeight: 600, 
            color: theme.palette.primary.main,
            textAlign: isMobile ? 'center' : 'left',
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            background: nameEntered ? `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)` : 'inherit',
            WebkitBackgroundClip: nameEntered ? 'text' : 'none',
            WebkitTextFillColor: nameEntered ? 'transparent' : 'inherit',
            transition: 'all 0.5s ease'
          }}
        >
          {t('auth.register.personalInfoTitle')}
        </Typography>
      </Box>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <Card 
          elevation={3} 
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            mb: 3, 
            borderRadius: 3,
            background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease-in-out',
            border: nameEntered ? `1px solid ${theme.palette.primary.main}20` : 'none',
            '&:hover': {
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              transform: 'translateY(-3px)'
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '5px',
              height: '100%',
              background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              borderTopLeftRadius: '8px',
              borderBottomLeftRadius: '8px'
            }
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center', 
              mb: 2 
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                color: theme.palette.text.secondary,
                fontStyle: 'italic',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <InfoIcon fontSize="small" sx={{ mr: 1, color: theme.palette.info.main }} />
              {t('auth.register.personalInfoSubtitle')}
            </Typography>
            
            <Tooltip title={t('auth.register.howToWriteName')}>
              <IconButton 
                size="small" 
                onClick={toggleHelp}
                color="info"
                sx={{ 
                  p: 0.5,
                  bgcolor: theme.palette.info.main + '10',
                  '&:hover': {
                    bgcolor: theme.palette.info.main + '20',
                  }
                }}
              >
                <HelpIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Collapse in={showHelp}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 1.5, 
                mb: 2, 
                bgcolor: theme.palette.info.main + '08',
                border: `1px dashed ${theme.palette.info.main}30`,
                borderRadius: 2
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {t('auth.register.nameExample')}
              </Typography>
            </Paper>
          </Collapse>

          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label={t('auth.register.fullName')}
            name="name"
            autoComplete="name"
            value={formData.name}
            onChange={handleInputChange}
            error={!!formErrors.name}
            helperText={formErrors.name}
            disabled={isLoading}
            variant="outlined"
            placeholder={t('auth.register.fullNamePlaceholder')}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main + '90',
                },
                '&.Mui-focused fieldset': {
                  borderWidth: '2px',
                },
                animation: nameEntered ? `${theme.transitions.create('box-shadow', {
                  duration: theme.transitions.duration.short,
                })} 0.3s ease` : 'none',
                boxShadow: nameEntered ? '0 0 0 3px rgba(25, 118, 210, 0.1)' : 'none',
              },
              '& .MuiFormLabel-root': {
                fontSize: { xs: '0.9rem', sm: '1rem' },
              },
              '& .MuiInputBase-input': {
                fontSize: { xs: '0.95rem', sm: '1rem' },
                padding: { xs: '12px 14px', sm: '15px 14px' },
              },
              '& .MuiFormHelperText-root': {
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                marginLeft: 1,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle 
                    color="primary" 
                    sx={{ 
                      opacity: 0.8,
                      transform: nameEntered ? 'scale(1.1)' : 'scale(1)',
                      transition: 'transform 0.3s ease'
                    }} 
                  />
                </InputAdornment>
              ),
            }}
          />

          <Divider 
            sx={{ 
              my: 2, 
              opacity: 0.6,
              background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.1), transparent)'
            }} 
          />

          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              mt: 1,
              p: 1.5,
              borderRadius: 2,
              bgcolor: theme.palette.info.main + '08',
              border: `1px solid ${theme.palette.info.main}15`
            }}
          >
            <BadgeOutlined 
              fontSize="small" 
              sx={{ 
                color: theme.palette.info.main, 
                mr: 1,
                mt: 0.3
              }} 
            />
            <Typography variant="caption" color="info" sx={{ lineHeight: 1.5 }}>
              {t('auth.register.nameSystemNote')}
            </Typography>
          </Box>
        </Card>
      </motion.div>

      <AnimatePresence>
        {nameEntered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                p: 2,
                bgcolor: theme.palette.success.main + '15',
                borderRadius: 2,
                border: `1px dashed ${theme.palette.success.main}30`
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 500, 
                  color: theme.palette.success.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%'
                }}
              >
                <BadgeOutlined sx={{ mr: 1 }} />
                {t('auth.register.welcomeReadyToNext', { name: formData.name.split(' ')[0] })}
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PersonalInfoStep;