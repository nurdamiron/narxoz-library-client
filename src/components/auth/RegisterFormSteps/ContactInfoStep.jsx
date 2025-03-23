// src/components/auth/RegisterFormSteps/ContactInfoStep.jsx
import React, { useState, useEffect } from 'react';
import { TextField, Typography, InputAdornment, Box, useTheme, useMediaQuery, Card, Tooltip, Grid, CircularProgress } from '@mui/material';
import { Email, Phone, InfoOutlined, AlternateEmail, CheckCircle } from '@mui/icons-material';
import { motion } from 'framer-motion';
import apiClient from '../../../services/api'; // Import your API client

/**
 * Байланыс ақпараты қадамы компоненті
 * ===================================
 * Бұл компонент қолданушының электрондық пошта және телефон нөмірін еңгізуге арналған.
 * Электрондық пошта жүйеде бар-жоғын тексеру функционалдығы қамтылған.
 * @param {Object} formData - Форма мәліметтері объектісі
 * @param {Object} formErrors - Форма қателері объектісі
 * @param {Function} handleInputChange - Енгізілген мәліметтерді өңдеу функциясы
 * @param {Function} setFieldError - Форма өрісіне қате орнату функциясы
 * @param {Boolean} isLoading - Жүктелу күйін көрсететін белгі
 * @param {Function} setStepIsProcessing - Қадам өңделуде екенін орнату функциясы
 * @returns {JSX.Element} Байланыс ақпараты формасы
 */
const ContactInfoStep = ({ formData, formErrors, handleInputChange, setFieldError, isLoading, setStepIsProcessing }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State for email checking
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(true);
  const [emailChecked, setEmailChecked] = useState(false);
  
  // Email check debounce timeout
  const [emailCheckTimeout, setEmailCheckTimeout] = useState(null);

  // Animation variants for staggered inputs
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Update parent component about processing state
  useEffect(() => {
    // Notify parent component about checking status
    if (setStepIsProcessing) {
      setStepIsProcessing(checkingEmail);
    }
  }, [checkingEmail, setStepIsProcessing]);

  // Check email availability when the email field is changed
  const handleEmailChange = async (e) => {
    const { name, value } = e.target;
    
    // Update the form data through the parent component's handler
    handleInputChange(e);
    
    // Reset email availability states when the user starts typing again
    setEmailChecked(false);
    
    // Clear any existing timeout
    if (emailCheckTimeout) {
      clearTimeout(emailCheckTimeout);
    }
    
    // Only check if email is valid (basic validation)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (emailRegex.test(value)) {
      // Set checking status to true immediately to prevent user from proceeding
      setCheckingEmail(true);
      
      // Set a new timeout to check email after typing stops (debounce)
      const newTimeout = setTimeout(async () => {
        try {
          // Call API to check if email exists
          const response = await apiClient.post('/auth/check-email', { email: value });
          const available = !response.data.exists;
          
          setEmailAvailable(available);
          setEmailChecked(true);
          
          // If email is not available, set an error through the form errors mechanism
          if (!available) {
            setFieldError('email', 'Бұл электрондық пошта тіркелгісі жүйеде бар. Басқа пошта мекенжайын пайдаланыңыз.');
          } else {
            // Clear error if email is available
            setFieldError('email', '');
          }
        } catch (error) {
          console.error('Error checking email availability:', error);
          // Don't show an error to the user if the check fails
          setEmailChecked(false);
        } finally {
          setCheckingEmail(false);
        }
      }, 800); // Wait 800ms after typing stops before checking
      
      setEmailCheckTimeout(newTimeout);
    } else {
      // If email is invalid, make sure we're not in checking state
      setCheckingEmail(false);
    }
  };
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (emailCheckTimeout) {
        clearTimeout(emailCheckTimeout);
      }
    };
  }, [emailCheckTimeout]);

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.5 }}
    >
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          mb: 3, 
          fontWeight: 600, 
          color: theme.palette.primary.main,
          textAlign: isMobile ? 'center' : 'left',
          fontSize: { xs: '1.1rem', sm: '1.25rem' }
        }}
      >
        Байланыс ақпараты
      </Typography>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <Card 
          elevation={2} 
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            mb: 3, 
            borderRadius: 2,
            background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '5px',
              height: '100%',
              background: theme.palette.primary.main,
              borderTopLeftRadius: '8px',
              borderBottomLeftRadius: '8px'
            }
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 2, 
              color: theme.palette.text.secondary,
              fontStyle: 'italic',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <InfoOutlined fontSize="small" sx={{ mr: 1, color: theme.palette.info.main }} />
            Сіз көрсеткен байланыс деректері арқылы сізге хабарламалар жіберіледі
          </Typography>

          <motion.div variants={itemVariants}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleEmailChange} // Use our custom handler instead
              error={!!formErrors.email || (emailChecked && !emailAvailable)}
              helperText={
                formErrors.email || 
                (emailChecked && !emailAvailable ? 'Бұл электрондық пошта тіркелгісі жүйеде бар. Басқа пошта мекенжайын пайдаланыңыз.' : '')
              }
              disabled={isLoading}
              variant="outlined"
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main + '90',
                  },
                  '&.Mui-focused fieldset': {
                    borderWidth: '2px',
                  },
                  // Add color for available email
                  ...(emailChecked && emailAvailable && {
                    '& fieldset': {
                      borderColor: theme.palette.success.main,
                      borderWidth: '2px',
                    }
                  }),
                  // Add color for unavailable email
                  ...(emailChecked && !emailAvailable && {
                    '& fieldset': {
                      borderColor: theme.palette.error.main,
                      borderWidth: '2px',
                    }
                  }),
                  // Add color for checking email
                  ...(checkingEmail && {
                    '& fieldset': {
                      borderColor: theme.palette.warning.main,
                      borderWidth: '2px',
                    }
                  })
                },
                '& .MuiFormLabel-root': {
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  ...(emailChecked && emailAvailable && {
                    color: theme.palette.success.main
                  }),
                  ...(emailChecked && !emailAvailable && {
                    color: theme.palette.error.main
                  }),
                  ...(checkingEmail && {
                    color: theme.palette.warning.main
                  })
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
                    <Email 
                      sx={{ 
                        opacity: 0.8,
                        color: checkingEmail ? 
                          theme.palette.warning.main : 
                          (emailChecked ? 
                            (emailAvailable ? theme.palette.success.main : theme.palette.error.main) : 
                            theme.palette.primary.main)
                      }} 
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {checkingEmail ? (
                      <CircularProgress size={20} color="warning" />
                    ) : emailChecked && emailAvailable ? (
                      <CheckCircle color="success" />
                    ) : (
                      <Tooltip title="Белсенді email мекенжайын көрсетіңіз" arrow>
                        <AlternateEmail sx={{ cursor: 'help', color: theme.palette.text.secondary, opacity: 0.7 }} />
                      </Tooltip>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <TextField
              margin="normal"
              fullWidth
              id="phone"
              label="Телефон"
              name="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleInputChange}
              error={!!formErrors.phone}
              helperText={formErrors.phone || "Мысалы: +77771234567"}
              disabled={isLoading}
              placeholder="+7XXXXXXXXXX"
              variant="outlined"
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
                    <Phone color="primary" sx={{ opacity: 0.8 }} />
                  </InputAdornment>
                ),
              }}
            />
          </motion.div>
        </Card>
      </motion.div>

      <Box 
        sx={{ 
          mt: 2, 
          p: 2, 
          borderRadius: 2, 
          bgcolor: theme.palette.info.main + '15',
          border: `1px dashed ${theme.palette.info.main}30`,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <InfoOutlined sx={{ mr: 1.5, color: theme.palette.info.main }} />
        <Typography variant="body2" color="info.main">
          Кітапхана жаңалықтары мен хабарландырулары үшін email жәнe телефон нөміріңіз қолданылады
        </Typography>
      </Box>
    </motion.div>
  );
};

export default ContactInfoStep;