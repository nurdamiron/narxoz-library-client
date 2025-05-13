/**
 * src/pages/LoginPage.jsx
 * 
 * Жүйеге кіру бетінің компоненті
 * 
 * Бұл компонент аутентификация үшін жүйеге кіру формасын көрсетеді.
 * Пайдаланушы аутентификациядан өткеннен кейін басты бетке немесе
 * бұрын сұралған бетке бағытталады.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  useTheme,
  Divider
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';

// Импорт хуков
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

/**
 * LoginPage компоненті
 * 
 * @returns {JSX.Element} - Жүйеге кіру беті
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();
  const { success, error: showError } = useToast();
  const theme = useTheme();
  const { t } = useTranslation();
  
  // Форма күйі
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // UI күйі
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  // Авторизациядан кейін бағыттау
  const from = location.state?.from || '/';
  
  // Егер пайдаланушы авторизацияланған болса, ролін тексеріп бағыттау
  useEffect(() => {
    if (isAuthenticated) {
      // Егер пайдаланушы админ болса, админ панеліне бағыттау
      if (user && user.role === 'admin') {
        navigate('/admin');
      } else {
        // Басқа пайдаланушылар үшін әдеттегі бағыттау
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, navigate, from, user]);
  
  /**
   * Форма өрісін өзгерту
   * 
   * @param {Object} e - Оқиға объектісі
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Өріс қатесін өзгерту кезінде тазарту
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ''
      });
    }
  };
  
  /**
   * Құпия сөзді көрсету/жасыру
   */
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  
  /**
   * Форманы валидациялау
   * 
   * @returns {boolean} - Форманың жарамдылығы
   */
  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = t('validation.required', 'Электрондық пошта міндетті');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t('validation.email', 'Жарамды электрондық пошта енгізіңіз');
    }
    
    if (!formData.password) {
      errors.password = t('validation.required', 'Құпия сөз міндетті');
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  /**
   * Форманы жіберу
   * 
   * @param {Object} e - Оқиға объектісі
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await login(formData);
      success(t('auth.loginSuccess', 'Сіз сәтті кірдіңіз!'));
      
      // Егер пайдаланушы админ болса, админ панеліне бағыттау
      if (response.data && response.data.role === 'admin') {
        navigate('/admin');
      } else {
        // Басқа пайдаланушылар үшін әдеттегі бағыттау
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError(t('auth.loginError', 'Кіру кезінде қате орын алды. Әрекетті қайталап көріңіз.'));
      }
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Админ ретінде кіру
   */
  const loginAsAdmin = async () => {
    try {
      setLoading(true);
      setError('');
      
      const adminCredentials = {
        email: 'admin@narxoz.kz',
        password: 'admin123'
      };
      
      const response = await login(adminCredentials);
      success(t('auth.adminLoginSuccess', 'Админ ретінде сәтті кірдіңіз!'));
      
      // Админ панеліне бағыттау
      navigate('/admin');
    } catch (err) {
      console.error('Admin login error:', err);
      
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError(t('auth.adminLoginError', 'Админ ретінде кіру кезінде қате орын алды. Әрекетті қайталап көріңіз.'));
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Анимация үшін варианттар
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.3
      }
    }
  };
  
  const itemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <Container maxWidth="sm">
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <motion.div variants={itemVariants}>
          <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary">
              {t('auth.loginToLibrary', 'Нархоз кітапханасына кіру')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('auth.loginSubtitle', 'Кітапханалық қызметтерге қол жеткізу үшін кіріңіз')}
            </Typography>
          </Box>
        </motion.div>
        
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Жоғарғы түрлі-түсті жолақ */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 6,
              backgroundColor: theme.palette.primary.main,
              backgroundImage: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }}
          />
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            </motion.div>
          )}
          
          <Box component="form" onSubmit={handleSubmit}>
            <motion.div variants={itemVariants}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label={t('common.email', 'Электрондық пошта')}
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                error={!!fieldErrors.email}
                helperText={fieldErrors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label={t('common.password', 'Құпия сөз')}
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                error={!!fieldErrors.password}
                helperText={fieldErrors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={t('auth.togglePassword', 'Құпия сөзді көрсету/жасыру')}
                        onClick={handleTogglePassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ 
                  mt: 3, 
                  mb: 2,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 'bold',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: (theme) => `0 6px 12px ${theme.palette.primary.main}30`
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                    boxShadow: (theme) => `0 3px 6px ${theme.palette.primary.main}30`
                  }
                }}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
              >
                {loading ? t('auth.loggingIn', 'Кіру...') : t('common.login', 'Кіру')}
              </Button>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Grid container spacing={1} sx={{ mt: 2 }}>
                <Grid item xs>
                  <Link 
                    component={RouterLink} 
                    to="/forgot-password" 
                    variant="body3" 
                    color="primary"
                    sx={{ 
                      fontWeight: 'medium',
                      '&:hover': {
                        textDecoration: 'underline',
                      } 
                    }}
                  >
                    {t('auth.forgotPassword', 'Құпия сөзді ұмыттыңыз ба?')}
                  </Link>
                </Grid>
              </Grid>
            </motion.div>
            
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default LoginPage;