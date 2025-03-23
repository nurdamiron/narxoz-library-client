// src/components/auth/RegisterForm.jsx
import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  Divider,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  School,
  Lock,
  Email,
  Person,
  Phone,
  ArrowBack,
  ArrowForward,
  Check,
  AccountCircle
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

/**
 * RegisterForm компоненті
 * 
 * @returns {JSX.Element} - Тіркелу формасы
 */
const RegisterForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // AuthContext-тен қажетті функцияларды алу
  const { register, loading: authLoading, error: authError, clearError } = useAuth();
  
  // Stepper күйі
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Жеке ақпарат', 'Байланыс ақпараты', 'Оқу ақпараты', 'Құпия сөз құру'];
  
  // Форма күйі
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Құпия сөз көрсету/жасыру
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Әр қадамның валидация күйі
  const [formValid, setFormValid] = useState({
    step0: false,
    step1: false,
    step2: false,
    step3: false,
  });
  
  // Форма деректері
  const [formData, setFormData] = useState({
    name: '',
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
    name: '',
    email: '',
    phone: '',
    faculty: '',
    specialization: '',
    studentId: '',
    year: '',
    password: '',
    confirmPassword: '',
  });

  // Компонент ашылғанда және AuthContext ауысқанда қателерді тазарту
  useEffect(() => {
    if (clearError) clearError();
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
   * Құпия сөзді растауды көрсету/жасыру функциясы
   */
  const handleToggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  /**
   * Формаға енгізілген деректерді өңдеу
   * 
   * @param {Event} e - Өзгерту оқиғасы
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

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
      case 'name':
        error = value.trim() === '' ? 'Аты-жөні міндетті' : '';
        break;
      
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value.trim() === '') {
          error = 'Email міндетті түрде енгізілуі керек';
        } else if (!emailRegex.test(value)) {
          error = 'Жарамды email енгізіңіз';
        }
        break;
      
      case 'phone':
        const phoneRegex = /^\+?[0-9]{10,13}$/;
        if (value && !phoneRegex.test(value)) {
          error = 'Жарамды телефон нөмірін енгізіңіз';
        }
        break;
      
      case 'faculty':
      case 'specialization':
      case 'studentId':
      case 'year':
        error = value.trim() === '' ? 'Бұл өріс міндетті' : '';
        break;
      
      case 'password':
        if (value.trim() === '') {
          error = 'Құпия сөз міндетті түрде енгізілуі керек';
        } else if (value.length < 6) {
          error = 'Құпия сөз кемінде 6 таңбадан тұруы керек';
        }
        
        // Егер құпия сөз өзгерсе, растауды да тексеру
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          setFormErrors(prev => ({
            ...prev,
            confirmPassword: 'Құпия сөздер сәйкес келмейді'
          }));
        } else if (formData.confirmPassword) {
          setFormErrors(prev => ({
            ...prev,
            confirmPassword: ''
          }));
        }
        break;
      
      case 'confirmPassword':
        error = value !== formData.password ? 'Құпия сөздер сәйкес келмейді' : '';
        break;
      
      default:
        break;
    }

    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));

    // Ағымдағы қадам валидациясын тексеру
    setTimeout(() => updateStepValidation(), 0);
  };
  
  /**
   * Ағымдағы қадамды валидациялау
   */
  const updateStepValidation = () => {
    switch (activeStep) {
      case 0:
        setFormValid(prev => ({
          ...prev,
          step0: formData.name.trim() !== '' && !formErrors.name
        }));
        break;
      
      case 1:
        setFormValid(prev => ({
          ...prev,
          step1: 
            formData.email.trim() !== '' && 
            !formErrors.email && 
            !formErrors.phone
        }));
        break;
      
      case 2:
        setFormValid(prev => ({
          ...prev,
          step2: 
            formData.faculty.trim() !== '' && 
            formData.specialization.trim() !== '' && 
            formData.studentId.trim() !== '' && 
            formData.year.trim() !== '' && 
            !formErrors.faculty && 
            !formErrors.specialization && 
            !formErrors.studentId && 
            !formErrors.year
        }));
        break;
      
      case 3:
        setFormValid(prev => ({
          ...prev,
          step3: 
            formData.password.trim() !== '' && 
            formData.confirmPassword.trim() !== '' && 
            !formErrors.password && 
            !formErrors.confirmPassword
        }));
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
      setActiveStep(prevStep => prevStep + 1);
    }
  };

  /**
   * Алдыңғы қадамға қайту функциясы
   */
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prevStep => prevStep - 1);
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
      setError('Барлық міндетті өрістерді толтырып, қателерді түзетіңіз');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Бэкендке жіберілетін деректерді дайындау
      const { confirmPassword, ...userData } = formData;
      
      // AuthContext арқылы тіркелу
      await register(userData);
      
      // Сәтті тіркелгеннен кейін басты бетке бағыттау
      navigate('/', { replace: true });
    } catch (err) {
      // Қате жағдайында оны күйге сақтау
      console.error('Тіркелу қатесі:', err);
      
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Тіркелу кезінде қате орын алды. Әрекетті қайталап көріңіз.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Жүктелу күйі (компонент немесе аутентификация)
  const isLoading = loading || authLoading;

  /**
   * Ағымдағы қадамның мазмұнын көрсету функциясы
   * 
   * @returns {JSX.Element} - Қадам мазмұны
   */
  const getStepContent = () => {
    const formVariants = {
      hidden: { opacity: 0, x: 30 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
      exit: { opacity: 0, x: -30, transition: { duration: 0.3 } }
    };
    
    switch (activeStep) {
      case 0:
        return (
          <motion.div
            key="step0"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={formVariants}
          >
            <Typography variant="h6" gutterBottom>
              Жеке ақпарат
            </Typography>
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Аты-жөні"
              name="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleInputChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </motion.div>
        );
      
      case 1:
        return (
          <motion.div
            key="step1"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={formVariants}
          >
            <Typography variant="h6" gutterBottom>
              Байланыс ақпараты
            </Typography>
            
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
              disabled={isLoading}
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
              fullWidth
              id="phone"
              label="Телефон"
              name="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleInputChange}
              error={!!formErrors.phone}
              helperText={formErrors.phone || "Мысалы: +77771234567"}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </motion.div>
        );
      
      case 2:
        return (
          <motion.div
            key="step2"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={formVariants}
          >
            <Typography variant="h6" gutterBottom>
              Оқу ақпараты
            </Typography>
            
            <FormControl fullWidth margin="normal" required error={!!formErrors.faculty}>
              <InputLabel id="faculty-label">Факультет</InputLabel>
              <Select
                labelId="faculty-label"
                id="faculty"
                name="faculty"
                value={formData.faculty}
                label="Факультет"
                onChange={handleInputChange}
                disabled={isLoading}
              >
                <MenuItem value="Бизнес мектебі">Бизнес мектебі</MenuItem>
                <MenuItem value="Құқық және мемлекеттік басқару мектебі">Құқық және мемлекеттік басқару мектебі</MenuItem>
                <MenuItem value="Цифрлық технологиялар мектебі">Цифрлық технологиялар мектебі</MenuItem>
                <MenuItem value="Экономика мектебі">Экономика мектебі</MenuItem>
              </Select>
              {formErrors.faculty && <FormHelperText>{formErrors.faculty}</FormHelperText>}
            </FormControl>
            
            <FormControl fullWidth margin="normal" required error={!!formErrors.specialization}>
              <InputLabel id="specialization-label">Мамандық</InputLabel>
              <Select
                labelId="specialization-label"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                label="Мамандық"
                onChange={handleInputChange}
                disabled={isLoading}
              >
                <MenuItem value="Қаржы">Қаржы</MenuItem>
                <MenuItem value="Бухгалтерлік есеп">Бухгалтерлік есеп</MenuItem>
                <MenuItem value="Маркетинг">Маркетинг</MenuItem>
                <MenuItem value="Менеджмент">Менеджмент</MenuItem>
                <MenuItem value="Заңтану">Заңтану</MenuItem>
                <MenuItem value="Ақпараттық жүйелер">Ақпараттық жүйелер</MenuItem>
              </Select>
              {formErrors.specialization && <FormHelperText>{formErrors.specialization}</FormHelperText>}
            </FormControl>
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="studentId"
              label="Студенттік ID"
              name="studentId"
              value={formData.studentId}
              onChange={handleInputChange}
              error={!!formErrors.studentId}
              helperText={formErrors.studentId}
              disabled={isLoading}
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
                disabled={isLoading}
              >
                <MenuItem value="1">1 курс</MenuItem>
                <MenuItem value="2">2 курс</MenuItem>
                <MenuItem value="3">3 курс</MenuItem>
                <MenuItem value="4">4 курс</MenuItem>
                <MenuItem value="Магистратура">Магистратура</MenuItem>
                <MenuItem value="Докторантура">Докторантура</MenuItem>
              </Select>
              {formErrors.year && <FormHelperText>{formErrors.year}</FormHelperText>}
            </FormControl>
          </motion.div>
        );
      
      case 3:
        return (
          <motion.div
            key="step3"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={formVariants}
          >
            <Typography variant="h6" gutterBottom>
              Құпия сөз құру
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Құпия сөз кемінде 6 таңбадан тұруы керек.
            </Typography>
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Құпия сөз"
              id="password"
              autoComplete="new-password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
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
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Құпия сөзді растау"
              id="confirmPassword"
              autoComplete="new-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
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
                      aria-label="toggle confirm password visibility"
                      onClick={handleToggleShowConfirmPassword}
                      edge="end"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </motion.div>
        );
      
      default:
        return <Typography>Белгісіз қадам</Typography>;
    }
  };

  // Ағымдағы қадам үшін келесі қадамға өту түймесінің күйін анықтау
  const getNextButtonDisabled = () => {
    switch (activeStep) {
      case 0:
        return !formValid.step0;
      case 1:
        return !formValid.step1;
      case 2:
        return !formValid.step2;
      case 3:
        return !formValid.step3;
      default:
        return true;
    }
  };

  return (
    <Container maxWidth="md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            mt: 4,
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
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            }}
          />
          
          {/* Форма тақырыбы */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              mb: 4 
            }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <School
                sx={{
                  fontSize: 50,
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
              Нархоз кітапханасына тіркелу
            </Typography>
            
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
            >
              Кітапханалық қызметтерге қол жеткізу үшін тіркеліңіз
            </Typography>
          </Box>
          
          {/* Stepper */}
          <Stepper 
            activeStep={activeStep} 
            alternativeLabel={!isMobile}
            orientation={isMobile ? "vertical" : "horizontal"}
            sx={{ mb: 4 }}
          >
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Қате хабарламасы */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {/* Тіркелу формасы */}
          <form onSubmit={handleSubmit}>
            {/* Әртүрлі қадам мазмұны */}
            <Box sx={{ minHeight: '250px', mb: 3 }}>
              <AnimatePresence mode="wait">
                {getStepContent()}
              </AnimatePresence>
            </Box>
            
            {/* Навигация түймелері */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0 || isLoading}
                startIcon={<ArrowBack />}
                variant="outlined"
              >
                Артқа
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={getNextButtonDisabled() || isLoading}
                  endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Check />}
                >
                  {isLoading ? 'Тіркелуде...' : 'Тіркелу'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={getNextButtonDisabled() || isLoading}
                  endIcon={<ArrowForward />}
                >
                  Келесі
                </Button>
              )}
            </Box>
          </form>
          
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              НЕМЕСЕ
            </Typography>
          </Divider>
          
          {/* Кіру бетіне сілтеме */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Аккаунтыңыз бар ма?
            </Typography>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              fullWidth
              disabled={isLoading}
              sx={{ borderRadius: 2 }}
            >
              Жүйеге кіру
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default RegisterForm;