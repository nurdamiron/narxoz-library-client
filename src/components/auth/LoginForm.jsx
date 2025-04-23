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
    if (!value) return 'Email міндетті түрде енгізілуі керек';
    
    // Простая регулярка для проверки формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Жарамды email мекенжайын енгізіңіз';
    
    return '';
  };
  
  /**
   * Валидация поля пароля
   * 
   * @param {string} value - Значение пароля
   * @returns {string} - Сообщение об ошибке или пустая строка
   */
  const validatePassword = (value) => {
    if (!value) return 'Құпия сөз міндетті түрде енгізілуі керек';
    if (value.length < 6) return 'Құпия сөз кемінде 6 таңбадан тұруы керек';
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
          
          {/* Сообщение об ошибке */}
          <Slide direction="down" in={!!error} mountOnEnter unmountOnExit>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          </Slide>
          
          {/* Форма входа */}
          <form onSubmit={handleSubmit}>
            <motion.div variants={itemVariants}>
              {/* Поле email */}
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
              {/* Поле пароля */}
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
              {/* Дополнительные опции */}
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
              {/* Кнопка входа */}
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
          </form>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default LoginForm;