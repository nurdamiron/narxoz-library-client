/**
 * src/components/auth/LoginForm.jsx
 * 
 * Форма входа
 * 
 * Этот компонент предоставляет форму для входа пользователя в систему.
 * Он проверяет email и пароль, и выполняет процесс аутентификации.
 */
import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
 * Компонент формы входа
 * 
 * @returns {JSX.Element} - Форма входа
 */
const LoginForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();
  
  // Получение необходимых функций из AuthContext
  const { login, loading: authLoading, error: authError, clearError } = useAuth();
  
  // Получение пути для перенаправления (если пользователь был перенаправлен на страницу входа)
  const from = location.state?.from?.pathname || '/';
  
  // Состояния компонента
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Ошибки валидации
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  
  // Очистка ошибок при открытии компонента и изменении AuthContext
  useEffect(() => {
    clearError();
    setError('');
  }, [clearError]);
  
  // При изменении ошибки в AuthContext, копируем её в состояние компонента
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);
  
  /**
   * Функция переключения видимости пароля
   */
  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  /**
   * Валидация поля электронной почты
   * 
   * @param {string} value - Значение email
   * @returns {string} - Сообщение об ошибке или пустая строка
   */
  const validateEmail = (value) => {
    if (!value) return t('validation.required', 'Email міндетті түрде енгізілуі керек');
    
    // Простая регулярка для проверки формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return t('validation.email', 'Жарамды email мекенжайын енгізіңіз');
    
    return '';
  };
  
  /**
   * Валидация поля пароля
   * 
   * @param {string} value - Значение пароля
   * @returns {string} - Сообщение об ошибке или пустая строка
   */
  const validatePassword = (value) => {
    if (!value) return t('validation.required', 'Құпия сөз міндетті түрде енгізілуі керек');
    if (value.length < 6) return t('validation.minLength', {min: 6}, 'Құпия сөз кемінде 6 таңбадан тұруы керек');
    return '';
  };
  
  /**
   * Обработчик изменения поля email
   */
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrors(prev => ({ ...prev, email: validateEmail(value) }));
  };
  
  /**
   * Обработчик изменения поля пароля
   */
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setErrors(prev => ({ ...prev, password: validatePassword(value) }));
  };
  
  /**
   * Обработчик изменения состояния "Запомнить меня"
   */
  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };
  
  /**
   * Обработчик отправки формы
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация полей формы
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    // Если есть ошибки валидации, показываем их
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
      // Вход через AuthContext
      await login({ email, password, rememberMe });
      
      // Если успешно, перенаправляем на предыдущую страницу
      navigate(from, { replace: true });
    } catch (err) {
      // В случае ошибки, сохраняем её в состоянии (будет отображена через useEffect)
      console.error('Ошибка входа:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Состояние загрузки (компонента или аутентификации)
  const isLoading = loading || authLoading;
  
  // Варианты анимации
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
          {/* Верхняя цветная полоса */}
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
          
          {/* Заголовок формы */}
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
            
            <motion.div variants={itemVariants}>
              <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                {t('auth.loginToLibrary', 'Нархоз кітапханасына кіру')}
              </Typography>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Typography variant="body2" color="text.secondary" align="center">
                {t('auth.loginSubtitle', 'Кітапханалық қызметтерге қол жеткізу үшін кіріңіз')}
              </Typography>
            </motion.div>
          </Box>
          
          {/* Сообщение об ошибке */}
          {error && (
            <Fade in={!!error}>
              <Alert 
                severity="error" 
                sx={{ mb: 2 }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            </Fade>
          )}
          
          {/* Форма */}
          <motion.form onSubmit={handleSubmit} variants={itemVariants}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t('common.email', 'Электрондық пошта')}
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={handleEmailChange}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t('common.password', 'Құпия сөз')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={t('auth.togglePassword', 'Құпия сөзді көрсету/жасыру')}
                      onClick={handleToggleShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 1 }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                    color="primary"
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2">
                    {t('auth.rememberMe', 'Мені есте сақтау')}
                  </Typography>
                }
              />
              <Link 
                component={RouterLink} 
                to="/forgot-password" 
                variant="body2"
                color="primary"
                sx={{ 
                  fontWeight: 'medium',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                {t('auth.forgotPassword', 'Құпия сөзді ұмыттыңыз ба?')}
              </Link>
            </Box>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : <LoginIcon />}
              sx={{ 
                mt: 2, 
                mb: 2,
                py: 1.5,
                fontWeight: 'bold',
                borderRadius: 2,
                boxShadow: 1,
                '&:hover': {
                  boxShadow: 2
                }
              }}
            >
              {isLoading ? t('auth.loggingIn', 'Кіру...') : t('common.login', 'Кіру')}
            </Button>
            
          </motion.form>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default LoginForm;