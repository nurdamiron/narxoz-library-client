// src/pages/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Link,
  InputAdornment,
  IconButton,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  NavigateNext as NextIcon,
  NavigateBefore as BackIcon
} from '@mui/icons-material';

// Импорт хуков
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Шаги регистрации
const steps = ['Жеке ақпарат', 'Байланыс ақпараты', 'Оқу ақпараты', 'Құпия сөз'];

// Факультеты
const faculties = [
  'Бизнес мектебі',
  'Құқық және мемлекеттік басқару мектебі',
  'Цифрлық технологиялар мектебі',
  'Экономика мектебі'
];

// Года обучения
const years = ['1 курс', '2 курс', '3 курс', '4 курс', 'Магистратура', 'Докторантура'];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const { success, error: showError } = useToast();
  
  // Состояние UI
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });
  
  // Состояние формы
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    faculty: '',
    specialization: '',
    studentId: '',
    year: '',
    password: '',
    confirmPassword: ''
  });
  
  // Если пользователь уже авторизован, перенаправляем на главную
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
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
  const handleTogglePassword = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };
  
  // Переход к следующему шагу
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };
  
  // Возврат к предыдущему шагу
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // Валидация текущего шага
  const validateStep = (step) => {
    const errors = {};
    
    switch (step) {
      case 0: // Жеке ақпарат
        if (!formData.name) {
          errors.name = 'Аты-жөні міндетті';
        }
        break;
        
      case 1: // Байланыс ақпараты
        if (!formData.email) {
          errors.email = 'Электрондық пошта міндетті';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          errors.email = 'Жарамды электрондық пошта енгізіңіз';
        }
        break;
        
      case 2: // Оқу ақпараты
        if (!formData.faculty) {
          errors.faculty = 'Факультет міндетті';
        }
        if (!formData.specialization) {
          errors.specialization = 'Мамандық міндетті';
        }
        if (!formData.studentId) {
          errors.studentId = 'Студенттік ID міндетті';
        }
        if (!formData.year) {
          errors.year = 'Оқу жылы міндетті';
        }
        break;
        
      case 3: // Құпия сөз
        if (!formData.password) {
          errors.password = 'Құпия сөз міндетті';
        } else if (formData.password.length < 6) {
          errors.password = 'Құпия сөз кем дегенде 6 таңбадан тұруы керек';
        }
        
        if (!formData.confirmPassword) {
          errors.confirmPassword = 'Құпия сөзді растау міндетті';
        } else if (formData.password !== formData.confirmPassword) {
          errors.confirmPassword = 'Құпия сөздер сәйкес келмейді';
        }
        break;
        
      default:
        break;
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(activeStep)) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Подготавливаем данные для отправки (без confirmPassword)
      const { confirmPassword, ...registrationData } = formData;
      
      await register(registrationData);
      success('Сіз сәтті тіркелдіңіз!');
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        // Обработка ошибок валидации с бэкенда
        const backendErrors = {};
        err.response.data.errors.forEach(error => {
          backendErrors[error.param] = error.msg;
        });
        setFieldErrors(backendErrors);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Тіркелу кезінде қате орын алды. Әрекетті қайталап көріңіз.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Рендеринг полей формы для текущего шага
  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Жеке ақпарат
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Аты-жөні"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!fieldErrors.name}
                helperText={fieldErrors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );
        
      case 1: // Байланыс ақпараты
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Электрондық пошта"
                name="email"
                type="email"
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Телефон"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!fieldErrors.phone}
                helperText={fieldErrors.phone}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );
        
      case 2: // Оқу ақпараты
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Факультет"
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
                error={!!fieldErrors.faculty}
                helperText={fieldErrors.faculty}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SchoolIcon />
                    </InputAdornment>
                  ),
                }}
              >
                {faculties.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Оқу жылы"
                name="year"
                value={formData.year}
                onChange={handleChange}
                error={!!fieldErrors.year}
                helperText={fieldErrors.year}
              >
                {years.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Мамандық"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                error={!!fieldErrors.specialization}
                helperText={fieldErrors.specialization}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Студенттік ID"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                error={!!fieldErrors.studentId}
                helperText={fieldErrors.studentId}
              />
            </Grid>
          </Grid>
        );
        
      case 3: // Құпия сөз
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Құпия сөз"
                name="password"
                type={showPassword.password ? 'text' : 'password'}
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
                        onClick={() => handleTogglePassword('password')}
                        edge="end"
                      >
                        {showPassword.password ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Құпия сөзді растау"
                name="confirmPassword"
                type={showPassword.confirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!fieldErrors.confirmPassword}
                helperText={fieldErrors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleTogglePassword('confirmPassword')}
                        edge="end"
                      >
                        {showPassword.confirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );
        
      default:
        return null;
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
    <Container maxWidth="md">
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Нархоз кітапханасына тіркелу
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Кітапханалық қызметтерге қол жеткізу үшін тіркеліңіз
          </Typography>
        </Box>
        
        <Paper elevation={3} sx={{ p: 4 }}>
          {/* Stepper */}
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit}>
            {/* Форма */}
            {renderStepContent(activeStep)}
            
            {/* Кнопки навигации */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                variant="outlined"
                disabled={activeStep === 0}
                onClick={handleBack}
                startIcon={<BackIcon />}
              >
                Артқа
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} />}
                >
                  {loading ? 'Тіркелу...' : 'Тіркелу'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  endIcon={<NextIcon />}
                >
                  Келесі
                </Button>
              )}
            </Box>
          </Box>
          
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2">
              Тіркелгіңіз бар ма?{' '}
              <Link component={RouterLink} to="/login" variant="body2">
                Кіру
              </Link>
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default RegisterPage;