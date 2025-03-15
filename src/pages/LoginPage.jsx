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

const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  // Состояния для данных форм
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  
  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleToggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация полей
    if (!email || !password) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    if (!isLogin && (!name || !studentId)) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    try {
      // Имитация авторизации/регистрации
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Мы просто перенаправляем пользователя без реальной авторизации
      navigate('/');
    } catch (err) {
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
        sx={{ minHeight: '80vh' }}
      >
        <Grid item xs={12} sm={8} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
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
            
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <School
                sx={{
                  fontSize: 50,
                  color: theme.palette.primary.main,
                  mb: 1,
                }}
              />
              <Typography
                variant="h5"
                component="h1"
                fontWeight="bold"
                gutterBottom
              >
                {isLogin ? 'Вход в систему' : 'Регистрация'}
              </Typography>
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
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
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
                onChange={(e) => setPassword(e.target.value)}
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
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 2, mb: 2, py: 1.5, borderRadius: 2 }}
              >
                {isLogin ? 'Войти' : 'Зарегистрироваться'}
              </Button>
              
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
              
              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  ИЛИ
                </Typography>
              </Divider>
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {isLogin
                    ? 'Ещё нет аккаунта?'
                    : 'Уже есть аккаунт?'}
                </Typography>
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