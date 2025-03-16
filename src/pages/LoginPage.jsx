import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
  useTheme,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  School,
  Lock,
  Email,
} from '@mui/icons-material';

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
  
  // Компонент күйлері (state)
  const [isLogin, setIsLogin] = useState(true); // Кіру/тіркелу режимі
  const [showPassword, setShowPassword] = useState(false); // Құпия сөзді көрсету/жасыру
  const [error, setError] = useState(''); // Қате хабарламасы
  
  // Форма деректерінің күйлері
  const [email, setEmail] = useState(''); // Email
  const [password, setPassword] = useState(''); // Құпия сөз
  const [name, setName] = useState(''); // Аты-жөні (тіркелу үшін)
  const [studentId, setStudentId] = useState(''); // Студенттік ID (тіркелу үшін)
  
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
    
    // Міндетті өрістерді тексеру
    if (!email || !password) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    // Тіркелу режимінде қосымша өрістерді тексеру
    if (!isLogin && (!name || !studentId)) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    try {
      // Аутентификацияны имитациялау (кідіріс қосу)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Нақты аутентификациясыз пайдаланушыны басты бетке бағыттау
      navigate('/');
    } catch (err) {
      // Қате болған жағдайда қате хабарламасын көрсету
      setError('Ошибка авторизации. Пожалуйста, проверьте введенные данные');
    }
  };
  
  return (
    <Container maxWidth="md">
      <Grid
        container
        spacing={0}
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '80vh' }} // Беттің минималды биіктігі
      >
        <Grid item xs={12} sm={8} md={6}>
          {/* Форма контейнері */}
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              overflow: 'hidden',
              position: 'relative',
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
                  fontSize: 50,
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
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {/* Аутентификация формасы */}
            <form onSubmit={handleSubmit}>
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
                  onChange={(e) => setName(e.target.value)}
                  sx={{ mb: 2 }}
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
                onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setStudentId(e.target.value)}
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
                type={showPassword ? 'text' : 'password'} // Құпия сөзді көрсету/жасыру
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              
              {/* Кіру/Тіркелу түймесі */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 2, mb: 2, py: 1.5, borderRadius: 2 }}
              >
                {isLogin ? 'Войти' : 'Зарегистрироваться'}
              </Button>
              
              {/* Құпия сөзді ұмыттым сілтемесі (тек кіру режимінде көрсетіледі) */}
              {isLogin && (
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Link
                    component={RouterLink}
                    to="/forgot-password"
                    variant="body2"
                  >
                    Забыли пароль?
                  </Link>
                </Box>
              )}
              
              {/* Бөлгіш сызық */}
              <Divider sx={{ my: 2 }}>
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
                  sx={{ borderRadius: 2 }}
                >
                  {isLogin ? 'Зарегистрироваться' : 'Войти'}
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginPage;