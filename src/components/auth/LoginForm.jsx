/**
 * src/components/auth/LoginForm.jsx
 * 
 * Жүйеге кіру формасы компоненті
 * 
 * Бұл компонент пайдаланушының жүйеге кіруі үшін қажетті форманы ұсынады.
 * Ол email және құпиясөзді тексеріп, аутентификация процесін жүзеге асырады.
 */
import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Checkbox,
  FormControlLabel,
  Slide,
  Fade,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  School,
  Lock,
  Email,
  Login as LoginIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

/**
 * LoginForm компоненті
 * 
 * @returns {JSX.Element} - Жүйеге кіру формасы
 */
const LoginForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // AuthContext-тен қажетті функцияларды алу
  const { login, loading: authLoading, error: authError, clearError } = useAuth();
  
  // Бұрын келген беттен жолдауды алу (қайта бағыттау үшін)
  const from = location.state?.from?.pathname || '/';
  
  // Компонент күйлері
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Валидация қателері
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  
  // Компонент ашылғанда және AuthContext ауысқанда қателерді тазарту
  useEffect(() => {
    clearError();
    setError('');
  }, [clearError]);
  
  // AuthContext қатесі өзгергенде оны компонент қатесіне көшіру
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);
  
  /**
   * Құпия сөзді көрсету/жасыру функциясы
   */
  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  /**
   * Email өрісінің валидациясы
   * 
   * @param {string} value - Email мәні
   * @returns {string} - Қате хабарламасы немесе бос жол
   */
  const validateEmail = (value) => {
    if (!value) return 'Email міндетті түрде енгізілуі керек';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Жарамды email енгізіңіз';
    return '';
  };
  
  /**
   * Құпия сөз өрісінің валидациясы
   * 
   * @param {string} value - Құпия сөз мәні
   * @returns {string} - Қате хабарламасы немесе бос жол
   */
  const validatePassword = (value) => {
    if (!value) return 'Құпия сөз міндетті түрде енгізілуі керек';
    if (value.length < 6) return 'Құпия сөз кемінде 6 таңбадан тұруы керек';
    return '';
  };
  
  /**
   * Email өрісінің өзгерісін өңдеу функциясы
   */
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrors(prev => ({ ...prev, email: validateEmail(value) }));
  };
  
  /**
   * Құпия сөз өрісінің өзгерісін өңдеу функциясы
   */
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setErrors(prev => ({ ...prev, password: validatePassword(value) }));
  };
  
  /**
   * "Мені есте сақтау" күйін өзгерту функциясы
   */
  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };
  
  /**
   * Форманы жіберу функциясы
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Форма өрістерін валидациялау
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    // Валидация қателері болса, оларды көрсету
    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError
      });
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // AuthContext арқылы жүйеге кіру
      await login({ email, password, rememberMe });
      
      // Егер сәтті болса, бұрын келген бетке бағыттау
      navigate(from, { replace: true });
    } catch (err) {
      // Қате жағдайында оны күйге сақтау (AuthEffect арқылы көрсетіледі)
      console.error('Жүйеге кіру қатесі:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Жүктелу күйі (компонент немесе аутентификация)
  const isLoading = loading || authLoading;
  
  // Анимация вариантары
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <Container maxWidth="xs">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            mt: 8,
            mb: 4,
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
              height: 8,
              backgroundColor: theme.palette.primary.main,
              backgroundImage: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }}
          />
          
          {/* Форма тақырыбы */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            mb: 3 
          }}>
            <motion.div
              variants={itemVariants}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <School
                sx={{
                  fontSize: 60,
                  color: theme.palette.primary.main,
                  mb: 1,
                }}
              />
            </motion.div>
            
            <Typography
              variant="h5"
              component="h1"
              fontWeight="bold"
              gutterBottom
            >
              Жүйеге кіру
            </Typography>
            
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
            >
              Нархоз кітапхана жүйесіне қош келдіңіз
            </Typography>
          </Box>
          
          {/* Қате хабарламасы */}
          <Slide direction="down" in={!!error} mountOnEnter unmountOnExit>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          </Slide>
          
          {/* Кіру формасы */}
          <form onSubmit={handleSubmit}>
            <motion.div variants={itemVariants}>
              {/* Email өрісі */}
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={handleEmailChange}
                error={!!errors.email}
                helperText={errors.email}
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              {/* Құпия сөз өрісі */}
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Құпия сөз"
                id="password"
                autoComplete="current-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                error={!!errors.password}
                helperText={errors.password}
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
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
                sx={{ mb: 2 }}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              {/* Қосымша опциялар */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 2 
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={handleRememberMeChange}
                      color="primary"
                      disabled={isLoading}
                    />
                  }
                  label="Мені есте сақтау"
                />
                
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  variant="body2"
                  color="primary"
                  sx={{ 
                    '&:hover': {
                      textDecoration: 'underline',
                    }
                  }}
                >
                  Құпия сөзді ұмыттыңыз ба?
                </Link>
              </Box>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              {/* Кіру түймесі */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                sx={{ 
                  mt: 2, 
                  py: 1.5, 
                  borderRadius: 2,
                  fontWeight: 'bold',
                  position: 'relative',
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
              >
                {isLoading ? 'Жүктелуде...' : 'Кіру'}
              </Button>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              {/* Тіркелу сілтемесі */}
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2">
                  Аккаунтыңыз жоқ па?{' '}
                  <Link 
                    component={RouterLink} 
                    to="/register" 
                    color="primary"
                    sx={{ 
                      fontWeight: 'medium',
                      '&:hover': {
                        textDecoration: 'underline',
                      } 
                    }}
                  >
                    Тіркелу
                  </Link>
                </Typography>
              </Box>
            </motion.div>
          </form>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default LoginForm;