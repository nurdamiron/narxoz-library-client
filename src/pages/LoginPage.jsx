// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Alert
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';

// Импорт хуков
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { success, error: showError } = useToast();
  
  // Состояние формы
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // Состояние UI
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  // Перенаправление после авторизации
  const from = location.state?.from || '/';
  
  // Если пользователь уже авторизован, перенаправляем на главную
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);
  
  // Изменение поля формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Очищаем ошибку поля при изменении
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ''
      });
    }
  };
  
  // Отображение/скрытие пароля
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  
  // Валидация формы
  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Электрондық пошта міндетті';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Жарамды электрондық пошта енгізіңіз';
    }
    
    if (!formData.password) {
      errors.password = 'Құпия сөз міндетті';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      await login(formData);
      success('Сіз сәтті кірдіңіз!');
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Кіру кезінде қате орын алды. Әрекетті қайталап көріңіз.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Анимации
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
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
  
  return (
    <Container maxWidth="sm">
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Нархоз кітапханасына кіру
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Кітапханалық қызметтерге қол жеткізу үшін кіріңіз
          </Typography>
        </Box>
        
        <Paper elevation={3} sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Электрондық пошта"
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
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Құпия сөз"
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
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Кіру...' : 'Кіру'}
            </Button>
            
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs>
                <Link component={RouterLink} to="/forgot-password" variant="body2">
                  Құпия сөзді ұмыттыңыз ба?
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to="/register" variant="body2">
                  Тіркелгіңіз жоқ па? Тіркелу
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default LoginPage;