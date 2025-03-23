// src/components/auth/RegisterFormSteps/PasswordStep.jsx
import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Typography, 
  InputAdornment, 
  IconButton, 
  Box, 
  useTheme, 
  useMediaQuery, 
  Card,
  LinearProgress,
  Tooltip,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper
} from '@mui/material';
import { 
  Lock, 
  Visibility, 
  VisibilityOff, 
  CheckCircleOutline,
  ErrorOutline,
  InfoOutlined,
  SecurityOutlined,
  VpnKey,
  CheckCircle
} from '@mui/icons-material';
import { motion } from 'framer-motion';

/**
 * Құпия сөз құру қадамы компоненті - Enhanced with better UI and animations
 */
const PasswordStep = ({ 
  formData, 
  formErrors, 
  handleInputChange, 
  isLoading,
  showPassword,
  showConfirmPassword,
  handleToggleShowPassword,
  handleToggleShowConfirmPassword
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State for password strength
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  // Check password strength
  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength({
        score: 0,
        hasMinLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false
      });
      return;
    }

    const password = formData.password;
    const hasMinLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Calculate score (0-4)
    let score = 0;
    if (hasMinLength) score++;
    if (hasUpperCase) score++;
    if (hasLowerCase) score++;
    if (hasNumber) score++;
    if (hasSpecialChar) score++;

    // Normalize score to 0-100 for progress bar
    const normalizedScore = Math.min(Math.floor((score / 5) * 100), 100);

    setPasswordStrength({
      score: normalizedScore,
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar
    });
  }, [formData.password]);

  // Get strength color
  const getStrengthColor = (score) => {
    if (score < 40) return theme.palette.error.main;
    if (score < 70) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  // Get strength text
  const getStrengthText = (score) => {
    if (score < 40) return "Әлсіз";
    if (score < 70) return "Орташа";
    return "Күшті";
  };

  // Animation variants
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
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      key="step3"
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
          <VpnKey 
            sx={{ 
              color: theme.palette.primary.main,
              fontSize: { xs: 32, sm: 40 },
              mr: isMobile ? 0 : 1.5,
              mb: isMobile ? 1 : 0
            }} 
          />
        </motion.div>
        
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            color: theme.palette.primary.main,
            textAlign: isMobile ? 'center' : 'left',
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}
        >
          Құпия сөз құру
        </Typography>
      </Box>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <Card 
          elevation={3} 
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            borderRadius: 3,
            mb: 3,
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
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 3,
              p: 1.5,
              borderRadius: 2,
              bgcolor: theme.palette.info.main + '10',
            }}
          >
            <SecurityOutlined sx={{ mr: 1.5, color: theme.palette.info.main }} />
            <Typography variant="body2" color="text.secondary">
              Күшті құпия сөз кем дегенде 6 символдан тұруы керек және оның ішінде әріптер мен сандар болғаны жөн
            </Typography>
          </Box>

          <motion.div variants={itemVariants}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Құпия сөз"
              id="password"
              autoComplete="new-password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
              disabled={isLoading}
              variant="outlined"
              sx={{
                mb: 1,
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
                    <Lock color="primary" sx={{ opacity: 0.8 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleToggleShowPassword}
                      edge="end"
                      disabled={isLoading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </motion.div>

          {/* Password strength indicator */}
          <Collapse in={!!formData.password}>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ mb: 3, mt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    Құпия сөз күші: 
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontWeight: 700, 
                      color: getStrengthColor(passwordStrength.score),
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}
                  >
                    {getStrengthText(passwordStrength.score)}
                    {passwordStrength.score >= 70 && <CheckCircle fontSize="small" />}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={passwordStrength.score} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: theme.palette.grey[200],
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getStrengthColor(passwordStrength.score)
                    }
                  }}
                />

                <List dense sx={{ mt: 1 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0, md: 1 } }}>
                    <ListItem 
                      sx={{ 
                        width: 'auto', 
                        minWidth: { xs: '100%', sm: '48%', md: 'auto' },
                        p: 0.5
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        {passwordStrength.hasMinLength ? 
                          <CheckCircleOutline fontSize="small" color="success" /> : 
                          <ErrorOutline fontSize="small" color="error" />
                        }
                      </ListItemIcon>
                      <ListItemText 
                        primary="Мин. 6 таңба" 
                        primaryTypographyProps={{ 
                          variant: 'caption',
                          color: passwordStrength.hasMinLength ? 'success.main' : 'text.secondary'
                        }} 
                      />
                    </ListItem>

                    <ListItem 
                      sx={{ 
                        width: 'auto', 
                        minWidth: { xs: '100%', sm: '48%', md: 'auto' },
                        p: 0.5
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        {passwordStrength.hasUpperCase ? 
                          <CheckCircleOutline fontSize="small" color="success" /> : 
                          <ErrorOutline fontSize="small" color="error" />
                        }
                      </ListItemIcon>
                      <ListItemText 
                        primary="Бас әріп" 
                        primaryTypographyProps={{ 
                          variant: 'caption',
                          color: passwordStrength.hasUpperCase ? 'success.main' : 'text.secondary'
                        }} 
                      />
                    </ListItem>

                    <ListItem 
                      sx={{ 
                        width: 'auto', 
                        minWidth: { xs: '100%', sm: '48%', md: 'auto' },
                        p: 0.5
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        {passwordStrength.hasNumber ? 
                          <CheckCircleOutline fontSize="small" color="success" /> : 
                          <ErrorOutline fontSize="small" color="error" />
                        }
                      </ListItemIcon>
                      <ListItemText 
                        primary="Сандар" 
                        primaryTypographyProps={{ 
                          variant: 'caption',
                          color: passwordStrength.hasNumber ? 'success.main' : 'text.secondary'
                        }} 
                      />
                    </ListItem>

                    <ListItem 
                      sx={{ 
                        width: 'auto', 
                        minWidth: { xs: '100%', sm: '48%', md: 'auto' },
                        p: 0.5
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        {passwordStrength.hasSpecialChar ? 
                          <CheckCircleOutline fontSize="small" color="success" /> : 
                          <ErrorOutline fontSize="small" color="error" />
                        }
                      </ListItemIcon>
                      <ListItemText 
                        primary="Арнайы таңбалар" 
                        primaryTypographyProps={{ 
                          variant: 'caption',
                          color: passwordStrength.hasSpecialChar ? 'success.main' : 'text.secondary'
                        }} 
                      />
                    </ListItem>
                  </Box>
                </List>
              </Box>
            </motion.div>
          </Collapse>

          <motion.div variants={itemVariants}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Құпия сөзді растау"
              id="confirmPassword"
              autoComplete="new-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
              disabled={isLoading}
              variant="outlined"
              sx={{
                mt: 2,
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
                    <Lock color="primary" sx={{ opacity: 0.8 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleToggleShowConfirmPassword}
                      edge="end"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </motion.div>
        </Card>
      </motion.div>

      {/* Success indicator when passwords match */}
      <Collapse in={formData.password && formData.confirmPassword && formData.password === formData.confirmPassword}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper 
            elevation={0}
            sx={{ 
              p: 2, 
              borderRadius: 2, 
              bgcolor: theme.palette.success.light + '20',
              border: `1px solid ${theme.palette.success.light}`,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}
          >
            <CheckCircleOutline color="success" />
            <Typography variant="body2" color="success.dark" fontWeight={500}>
              Құпия сөздер сәйкес келеді
            </Typography>
          </Paper>
        </motion.div>
      </Collapse>
    </motion.div>
  );
};

export default PasswordStep;