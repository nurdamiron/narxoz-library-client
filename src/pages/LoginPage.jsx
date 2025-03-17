import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
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
  useTheme,
  useMediaQuery,
  Slide,
  Fade,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  School,
  Lock,
  Email,
  Login as LoginIcon,
  PersonAdd,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

/**
 * LoginPage компоненті - аутентификация беті
 * 
 * Бұл компонент пайдаланушының жүйеге кіруі немесе тіркелуі үшін форманы көрсетеді.
 * Компонент екі режимде жұмыс істейді:
 * - Жүйеге кіру режимі (isLogin = true)
 * - Тіркелу режимі (isLogin = false)
 * 
 * Пайдаланушы екі режимді де ауыстыра алады.
 */
const LoginPage = () => {
  const theme = useTheme(); // Material UI тақырыбын алу
  const navigate = useNavigate(); // Навигация функциясы
  const location = useLocation(); // URL мекенжайы туралы ақпарат
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Мобильді құрылғыны анықтау
  const { login } = useAuth(); // Аутентификация контекстінен login функциясын алу
  
  // Redirect URL - бұрын болған бетке қайту үшін
  const from = location.state?.from?.pathname || '/';
  
  // Компонент күйлері (state)
  const [isLogin, setIsLogin] = useState(true); // Кіру/тіркелу режимі
  const [showPassword, setShowPassword] = useState(false); // Құпия сөзді көрсету/жасыру
  const [loading, setLoading] = useState(false); // Жүктелу күйі
  const [error, setError] = useState(''); // Қате хабарламасы
  const [rememberMe, setRememberMe] = useState(false); // "Мені есте сақтау" күйі
  
  // Форма деректерінің күйлері
  const [email, setEmail] = useState(''); // Email
  const [password, setPassword] = useState(''); // Құпия сөз
  const [name, setName] = useState(''); // Аты-жөні (тіркелу үшін)
  const [studentId, setStudentId] = useState(''); // Студенттік ID (тіркелу үшін)
  
  // Валидация қателері
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    name: '',
    studentId: '',
  });
  
  /**
   * Құпия сөзді көрсету/жасыру функциясы
   * 
   * Құпия сөз өрісінің көріну режимін ауыстырады (text/password)
   */
  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  /**
   * Кіру/тіркелу режимін ауыстыру функциясы
   * 
   * Компоненттің isLogin күйін ауыстырады және қате хабарламасын тазалайды
   */
  const handleToggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError(''); // Режим ауысқанда қате хабарламасын тазалау
    setErrors({ email: '', password: '', name: '', studentId: '' }); // Валидация қателерін тазалау
  };
  
  /**
   * "Мені есте сақтау" күйін өзгерту функциясы
   */
  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };
  
  /**
   * Email өрісінің валидациясы
   * 
   * @param {string} value - Email мәні
   * @returns {string} - Қате хабарламасы немесе бос жол
   */
  const validateEmail = (value) => {
    if (!value) return 'Email обязателен';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Введите корректный email';
    return '';
  };
  
  /**
   * Құпия сөз өрісінің валидациясы
   * 
   * @param {string} value - Құпия сөз мәні
   * @returns {string} - Қате хабарламасы немесе бос жол
   */
  const validatePassword = (value) => {
    if (!value) return 'Пароль обязателен';
    if (value.length < 6) return 'Пароль должен содержать не менее 6 символов';
    return '';
  };
  
  /**
   * Email өрісінің өзгерісін өңдеу функциясы
   * 
   * @param {Event} e - Оқиға объектісі
   */
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrors({ ...errors, email: validateEmail(value) });
  };
  
  /**
   * Құпия сөз өрісінің өзгерісін өңдеу функциясы
   * 
   * @param {Event} e - Оқиға объектісі
   */
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setErrors({ ...errors, password: validatePassword(value) });
  };
  
  /**
   * Аты-жөні өрісінің өзгерісін өңдеу функциясы
   * 
   * @param {Event} e - Оқиға объектісі
   */
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setErrors({ ...errors, name: value ? '' : 'ФИО обязательно' });
  };
  
  /**
   * Студенттік ID өрісінің өзгерісін өңдеу функциясы
   * 
   * @param {Event} e - Оқиға объектісі
   */
  const handleStudentIdChange = (e) => {
    const value = e.target.value;
    setStudentId(value);
    setErrors({ ...errors, studentId: value ? '' : 'Студенческий ID обязателен' });
  };
  
  /**
   * Форманы жіберу функциясы
   * 
   * Форма деректерін тексереді және сервермен тексеруді имитациялайды.
   * Егер барлығы дұрыс болса, пайдаланушыны басты бетке бағыттайды.
   * 
   * @param {Event} e - Форма жіберу оқиғасы
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Беттің қайта жүктелуін болдырмау
    
    // Форма деректерін валидациялау
    let formErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    
    // Тіркелу режимінде қосымша өрістерді тексеру
    if (!isLogin) {
      formErrors.name = name ? '' : 'ФИО обязательно';
      formErrors.studentId = studentId ? '' : 'Студенческий ID обязателен';
    }
    
    // Қателер бар-жоғын тексеру
    const hasErrors = Object.values(formErrors).some(error => error);
    if (hasErrors) {
      setErrors(formErrors);
      return;
    }
    
    setLoading(true); // Жүктелу күйін қосу
    setError(''); // Қателерді тазалау
    
    try {
      if (isLogin) {
        // Жүйеге кіру
        await login({ email, password });
        navigate(from); // Бұрын болған бетке қайту
      } else {
        // Тіркелуді имитациялау (кідіріс қосу)
        await new Promise((resolve) => setTimeout(resolve, 1500));
        navigate('/'); // Тіркелу сәтті аяқталғанда басты бетке өту
      }
    } catch (err) {
      // Қате болған жағдайда қате хабарламасын көрсету
      setError(
        isLogin 
          ? 'Неверные данные для входа. Пожалуйста, проверьте email и пароль.' 
          : 'Ошибка при регистрации. Пожалуйста, попробуйте позже или обратитесь в службу поддержки.'
      );
    } finally {
      setLoading(false); // Жүктелу күйін өшіру
    }
  };
  
  /**
   * Форманың бапталған немесе толтырылған екендігін тексеру
   * 
   * @returns {boolean} - Форма бапталған ба
   */
  const isFormDirty = () => {
    return email || password || (!isLogin && (name || studentId));
  };
  
  /**
   * Бетті ауыстырмас бұрын пайдаланушыға ескерту көрсету
   */
  useEffect(() => {
    // Егер форма толтырылған болса және пайдаланушы беттен кетпек болса
    if (isFormDirty()) {
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = '';
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [email, password, name, studentId]);
  
  return (
    <Container maxWidth="md">
      <Grid
        container
        spacing={0}
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '80vh' }}
      >
        <Grid item xs={12} sm={10} md={8} lg={6}>
          {/* Форма контейнері */}
          <Fade in={true} timeout={800}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 3,
                overflow: 'hidden',
                position: 'relative',
                boxShadow: theme.shadows[6],
                backgroundColor: 'background.paper',
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
              
              {/* Тақырып және сипаттама */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                {/* Университет иконкасы */}
                <School
                  sx={{
                    fontSize: 60,
                    color: theme.palette.primary.main,
                    mb: 1,
                  }}
                />
                {/* Тақырып (Кіру немесе Тіркелу) */}
                <Typography
                  variant="h5"
                  component="h1"
                  fontWeight="bold"
                  gutterBottom
                >
                  {isLogin ? 'Вход в систему' : 'Регистрация'}
                </Typography>
                {/* Тақырыпша */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  {isLogin
                    ? 'Войдите в свою учетную запись библиотеки Нархоз'
                    : 'Создайте учетную запись для доступа к библиотеке Нархоз'}
                </Typography>
              </Box>
              
              {/* Қате хабарламасы (егер бар болса) */}
              <Slide direction="down" in={!!error} mountOnEnter unmountOnExit>
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              </Slide>
              
              {/* Аутентификация формасы */}
              <form onSubmit={handleSubmit} noValidate>
                {/* Аты-жөні өрісі (тек тіркелу режимінде көрсетіледі) */}
                {!isLogin && (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="ФИО"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={handleNameChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    disabled={loading}
                    sx={{ mb: 2 }}
                    inputProps={{
                      maxLength: 100,
                    }}
                  />
                )}
                
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
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                
                {/* Студенттік ID өрісі (тек тіркелу режимінде көрсетіледі) */}
                {!isLogin && (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="studentId"
                    label="Студенческий ID"
                    name="studentId"
                    value={studentId}
                    onChange={handleStudentIdChange}
                    error={!!errors.studentId}
                    helperText={errors.studentId}
                    disabled={loading}
                    sx={{ mb: 2 }}
                  />
                )}
                
                {/* Құпия сөз өрісі */}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Пароль"
                  id="password"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  disabled={loading}
                  InputProps={{
                    // Құлып иконкасы
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    // Көз иконкасы - құпия сөзді көрсету/жасыру түймесі
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleToggleShowPassword}
                          edge="end"
                          size="large"
                          disabled={loading}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                
                {/* Мені есте сақтау опциясы (тек кіру режимінде көрсетіледі) */}
                {isLogin && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={rememberMe}
                          onChange={handleRememberMeChange}
                          color="primary"
                          disabled={loading}
                        />
                      }
                      label="Запомнить меня"
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
                      Забыли пароль?
                    </Link>
                  </Box>
                )}
                
                {/* Кіру/Тіркелу түймесі */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : (isLogin ? <LoginIcon /> : <PersonAdd />)}
                  sx={{ 
                    mt: 2, 
                    mb: 2, 
                    py: 1.5, 
                    borderRadius: 2,
                    fontWeight: 'bold',
                    position: 'relative',
                  }}
                >
                  {isLogin ? 'Войти' : 'Зарегистрироваться'}
                </Button>
                
                {/* Бөлгіш сызық */}
                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    ИЛИ
                  </Typography>
                </Divider>
                
                {/* Режимді ауыстыру блогы */}
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {isLogin
                      ? 'Ещё нет аккаунта?'
                      : 'Уже есть аккаунт?'}
                  </Typography>
                  {/* Кіру/Тіркелу режиміне ауысу түймесі */}
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={handleToggleAuthMode}
                    sx={{ 
                      borderRadius: 2,
                      py: 1.2,
                      fontWeight: 'bold',
                    }}
                    disabled={loading}
                  >
                    {isLogin ? 'Зарегистрироваться' : 'Войти'}
                  </Button>
                </Box>
              </form>
            </Paper>
          </Fade>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginPage;