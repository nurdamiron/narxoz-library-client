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
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  useMediaQuery,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  School,
  Lock,
  Email,
  Person,
  ArrowBack,
  ArrowForward,
  Check,
} from '@mui/icons-material';

/**
 * RegisterPage компоненті - тіркелу беті
 * 
 * Бұл компонент пайдаланушының тіркелуі үшін форманы көрсетеді.
 * Тіркелу процесі бірнеше қадамдарға бөлінген:
 * - Жеке ақпарат (аты-жөні, туған күні, т.б.)
 * - Байланыс ақпараты (email, телефон)
 * - Оқу ақпараты (факультет, мамандық, т.б.)
 * - Құпия сөз құру
 */
const RegisterPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Stepper күйі
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Личная информация', 'Контактные данные', 'Учебная информация', 'Создание пароля'];
  
  // Қате хабарламасы
  const [error, setError] = useState('');
  
  // Құпия сөзді көрсету/жасыру
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Валидация күйлері
  const [formValid, setFormValid] = useState({
    step0: false,
    step1: false,
    step2: false,
    step3: false,
  });
  
  // Форма деректері
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    birthDate: '',
    gender: '',
    
    email: '',
    phone: '',
    
    faculty: '',
    specialization: '',
    studentId: '',
    year: '',
    
    password: '',
    confirmPassword: '',
  });

  // Валидация қателері
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    
    email: '',
    phone: '',
    
    faculty: '',
    specialization: '',
    studentId: '',
    year: '',
    
    password: '',
    confirmPassword: '',
  });

  /**
   * Құпия сөзді көрсету/жасыру функциясы
   */
  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Растау құпия сөзін көрсету/жасыру функциясы
   */
  const handleToggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  /**
   * Формаға енгізілген деректерді өңдеу
   * 
   * @param {Event} e - Input өзгеру оқиғасы
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Енгізілген мәнді валидациялау
    validateField(name, value);
  };

  /**
   * Өрісті валидациялау функциясы
   * 
   * @param {string} name - Өріс аты
   * @param {string} value - Өріс мәні
   */
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'firstName':
      case 'lastName':
        error = value.trim() === '' ? 'Поле обязательно для заполнения' : '';
        break;
      
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        error = !emailRegex.test(value) ? 'Введите корректный email' : '';
        break;
      
      case 'phone':
        const phoneRegex = /^\+?[0-9]{10,13}$/;
        error = !phoneRegex.test(value) ? 'Введите корректный номер телефона' : '';
        break;
      
      case 'faculty':
      case 'specialization':
      case 'studentId':
      case 'year':
        error = value.trim() === '' ? 'Поле обязательно для заполнения' : '';
        break;
      
      case 'password':
        if (value.length < 8) {
          error = 'Пароль должен содержать не менее 8 символов';
        } else if (!/[A-Z]/.test(value)) {
          error = 'Пароль должен содержать хотя бы одну заглавную букву';
        } else if (!/[0-9]/.test(value)) {
          error = 'Пароль должен содержать хотя бы одну цифру';
        } else if (!/[!@#$%^&*]/.test(value)) {
          error = 'Пароль должен содержать хотя бы один специальный символ (!@#$%^&*)';
        }
        break;
      
      case 'confirmPassword':
        error = value !== formData.password ? 'Пароли не совпадают' : '';
        break;
      
      default:
        break;
    }

    setFormErrors({
      ...formErrors,
      [name]: error,
    });

    // Ағымдағы қадам валидациясын тексеру
    updateStepValidation();
  };
  
  /**
   * Ағымдағы қадамды валидациялау
   */
  const updateStepValidation = () => {
    switch (activeStep) {
      case 0:
        setFormValid({
          ...formValid,
          step0: 
            formData.firstName.trim() !== '' && 
            formData.lastName.trim() !== '' && 
            !formErrors.firstName && 
            !formErrors.lastName
        });
        break;
      
      case 1:
        setFormValid({
          ...formValid,
          step1: 
            formData.email.trim() !== '' && 
            formData.phone.trim() !== '' && 
            !formErrors.email && 
            !formErrors.phone
        });
        break;
      
      case 2:
        setFormValid({
          ...formValid,
          step2: 
            formData.faculty.trim() !== '' && 
            formData.specialization.trim() !== '' && 
            formData.studentId.trim() !== '' && 
            formData.year.trim() !== '' && 
            !formErrors.faculty && 
            !formErrors.specialization && 
            !formErrors.studentId && 
            !formErrors.year
        });
        break;
      
      case 3:
        setFormValid({
          ...formValid,
          step3: 
            formData.password.trim() !== '' && 
            formData.confirmPassword.trim() !== '' && 
            !formErrors.password && 
            !formErrors.confirmPassword
        });
        break;
      
      default:
        break;
    }
  };

  /**
   * Келесі қадамға өту функциясы
   */
  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  /**
   * Алдыңғы қадамға қайту функциясы
   */
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  /**
   * Тіркелу формасын жіберу функциясы
   * 
   * @param {Event} e - Форма жіберу оқиғасы
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Барлық қажетті өрістерді тексеру
    if (!formValid.step3) {
      setError('Пожалуйста, заполните все обязательные поля и исправьте ошибки');
      return;
    }

    try {
      // Тіркелуді имитациялау (кідіріс қосу)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Тіркеу сәтті аяқталған жағдайда кіру бетіне бағыттау
      navigate('/login');
    } catch (err) {
      // Қате болған жағдайда қате хабарламасын көрсету
      setError('Ошибка регистрации. Пожалуйста, попробуйте еще раз.');
    }
  };

  /**
   * Ағымдағы қадамның мазмұнын көрсету функциясы
   * 
   * @returns {JSX.Element} - Қадам мазмұны
   */
  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="firstName"
                  label="Имя"
                  name="firstName"
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={!!formErrors.firstName}
                  helperText={formErrors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="lastName"
                  label="Фамилия"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={!!formErrors.lastName}
                  helperText={formErrors.lastName}
                />
              </Grid>
            </Grid>
            <TextField
              margin="normal"
              fullWidth
              id="middleName"
              label="Отчество (если есть)"
              name="middleName"
              autoComplete="middle-name"
              value={formData.middleName}
              onChange={handleInputChange}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="birthDate"
                  label="Дата рождения"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="gender-label">Пол</InputLabel>
                  <Select
                    labelId="gender-label"
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    label="Пол"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="male">Мужской</MenuItem>
                    <MenuItem value="female">Женский</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </>
        );
      
      case 1:
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="phone"
              label="Телефон"
              name="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleInputChange}
              error={!!formErrors.phone}
              helperText={formErrors.phone || "Например: +77771234567"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </>
        );
      
      case 2:
        return (
          <>
            <FormControl fullWidth margin="normal" required error={!!formErrors.faculty}>
              <InputLabel id="faculty-label">Факультет</InputLabel>
              <Select
                labelId="faculty-label"
                id="faculty"
                name="faculty"
                value={formData.faculty}
                label="Факультет"
                onChange={handleInputChange}
              >
                <MenuItem value="economic">Экономический факультет</MenuItem>
                <MenuItem value="law">Юридический факультет</MenuItem>
                <MenuItem value="business">Высшая школа бизнеса</MenuItem>
                <MenuItem value="it">Факультет информационных технологий</MenuItem>
              </Select>
              {formErrors.faculty && <FormHelperText>{formErrors.faculty}</FormHelperText>}
            </FormControl>
            
            <FormControl fullWidth margin="normal" required error={!!formErrors.specialization}>
              <InputLabel id="specialization-label">Специализация</InputLabel>
              <Select
                labelId="specialization-label"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                label="Специализация"
                onChange={handleInputChange}
              >
                <MenuItem value="finance">Финансы и кредит</MenuItem>
                <MenuItem value="accounting">Бухгалтерский учет</MenuItem>
                <MenuItem value="marketing">Маркетинг</MenuItem>
                <MenuItem value="management">Менеджмент</MenuItem>
                <MenuItem value="law">Юриспруденция</MenuItem>
                <MenuItem value="it">Информационные системы</MenuItem>
              </Select>
              {formErrors.specialization && <FormHelperText>{formErrors.specialization}</FormHelperText>}
            </FormControl>
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="studentId"
              label="Студенческий ID"
              name="studentId"
              value={formData.studentId}
              onChange={handleInputChange}
              error={!!formErrors.studentId}
              helperText={formErrors.studentId}
            />
            
            <FormControl fullWidth margin="normal" required error={!!formErrors.year}>
              <InputLabel id="year-label">Курс</InputLabel>
              <Select
                labelId="year-label"
                id="year"
                name="year"
                value={formData.year}
                label="Курс"
                onChange={handleInputChange}
              >
                <MenuItem value="1">1 курс</MenuItem>
                <MenuItem value="2">2 курс</MenuItem>
                <MenuItem value="3">3 курс</MenuItem>
                <MenuItem value="4">4 курс</MenuItem>
                <MenuItem value="masters">Магистратура</MenuItem>
                <MenuItem value="phd">Докторантура</MenuItem>
              </Select>
              {formErrors.year && <FormHelperText>{formErrors.year}</FormHelperText>}
            </FormControl>
          </>
        );
      
      case 3:
        return (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Создайте надежный пароль, содержащий минимум 8 символов, включая заглавные буквы, цифры и специальные символы.
            </Typography>
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Пароль"
              id="password"
              autoComplete="new-password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
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
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Подтвердите пароль"
              id="confirmPassword"
              autoComplete="new-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleToggleShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </>
        );
      
      default:
        return 'Unknown step';
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
        <Grid item xs={12} md={10}>
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
                mb: 4,
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
                Регистрация
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
              >
                Создайте учетную запись для доступа к библиотеке Нархоз
              </Typography>
            </Box>
            
            {/* Stepper компоненті */}
            <Stepper 
              activeStep={activeStep} 
              alternativeLabel={!isMobile}
              orientation={isMobile ? "vertical" : "horizontal"}
              sx={{ mb: 4 }}
            >
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{!isMobile && label}</StepLabel>
                  {isMobile && (
                    <Typography variant="body2" sx={{ ml: 2 }}>
                      {label}
                    </Typography>
                  )}
                </Step>
              ))}
            </Stepper>

            {/* Қате хабарламасы (егер бар болса) */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {/* Тіркелу формасы */}
            <form onSubmit={handleSubmit}>
              {/* Қадам мазмұны */}
              <Box sx={{ mb: 3 }}>
                {getStepContent()}
              </Box>
              
              {/* Навигация түймелері */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  startIcon={<ArrowBack />}
                >
                  Назад
                </Button>
                
                <Box>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={!formValid.step3}
                      endIcon={<Check />}
                    >
                      Зарегистрироваться
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      disabled={
                        (activeStep === 0 && !formValid.step0) ||
                        (activeStep === 1 && !formValid.step1) ||
                        (activeStep === 2 && !formValid.step2)
                      }
                      endIcon={<ArrowForward />}
                    >
                      Далее
                    </Button>
                  )}
                </Box>
              </Box>
            </form>
            
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                ИЛИ
              </Typography>
            </Divider>
            
            {/* Кіру бетіне сілтеме */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Уже есть аккаунт?
              </Typography>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                fullWidth
                sx={{ borderRadius: 2 }}
              >
                Войти
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RegisterPage;