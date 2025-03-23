// src/components/auth/RegisterForm/index.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';

// Импорт пользовательских компонентов
import FormHeader from './FormHeader';
import FormAlerts from './FormAlerts';
import FormNavigation from './FormNavigation';
import LoginLink from './LoginLink';
import { ColorlibConnector, ColorlibStepIcon } from './StepComponents';
import { 
  validateField, 
  validateStep, 
  calculateCompletionPercentage, 
  getValidationSummary 
} from '../../../utils/validationUtils';

// Импорт компонентов шагов
import {
  PersonalInfoStep,
  ContactInfoStep,
  EducationInfoStep,
  PasswordStep
} from '../RegisterFormSteps';

/**
 * Тіркелу формасы компоненті
 * 
 * Бұл компонент пайдаланушыларға тіркелуге арналған форманы көрсетеді.
 * Ол бірнеше қадамнан тұрады және анимациялар, валидация және UI 
 * жақсартулармен толықтырылған.
 * 
 * @returns {JSX.Element} - Тіркелу формасы компоненті
 */
const RegisterForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  /**
   * AuthContext-тен қажетті функцияларды алу
   * Бұл функциялар тіркелу процесін басқару үшін қолданылады
   */
  const { register, loading: authLoading, error: authError, clearError } = useAuth();
  
  /**
   * Қадамдар күйі
   * activeStep - ағымдағы белсенді қадам
   * steps - қадамдар атауларының массиві
   */
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Жеке ақпарат', 'Байланыс ақпараты', 'Оқу ақпараты', 'Құпия сөз құру'];
  
  /**
   * Форма күйі
   * loading - форма жүктелу күйінде ме
   * error - қате хабарламасы
   * success - тіркелу сәтті аяқталды ма
   */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  /**
   * Құпия сөз көрсету/жасыру күйі
   * showPassword - құпия сөзді көрсету
   * showConfirmPassword - құпия сөзді растауды көрсету
   */
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /**
   * Анимация күйі
   * pageAnimation - беттің анимациясы белсенді ме
   */
  const [pageAnimation, setPageAnimation] = useState(false);

  /**
   * Қадам өңдеу күйі
   * stepIsProcessing - қадам деректерді өңдеуде ме (мысалы, email тексеру)
   */
  const [stepIsProcessing, setStepIsProcessing] = useState(false);

  /**
   * Әр қадамның валидация күйі
   * Әр қадам үшін жеке валидация статусы сақталады
   */
  const [formValid, setFormValid] = useState({
    step0: false,
    step1: false,
    step2: false,
    step3: false,
  });
  
  /**
   * Форма деректері
   * Бұл объектте пайдаланушы енгізген барлық деректер сақталады
   */
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

  /**
   * Валидация қателері
   * Әр өріс үшін қате хабарламалары сақталады
   */
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

  /**
   * Бет анимациясын іске қосу
   * Компонент көрсетілгеннен кейін анимацияны іске қосады
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      setPageAnimation(true);
    }, 300);
    
    return () => clearTimeout(timeout);
  }, []);

  /**
   * Компонент ашылғанда және AuthContext өзгергенде қателерді тазарту
   */
  useEffect(() => {
    if (clearError) clearError();
    setError('');
  }, [clearError]);
  
  /**
   * AuthContext қатесі өзгергенде оны компонент қатесіне көшіру
   */
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  /**
   * Қадам валидациясын жаңарту функциясы
   * Бұл функция әр қадамның валидациясын тексереді және жаңартады
   */
  const updateStepValidation = useCallback(() => {
    // Ағымдағы қадамның валидациясын тексеру
    const currentStepValid = validateStep(activeStep, formData, formErrors);
    
    // Барлық қадамдардың валидация күйін алу
    const validationSummary = getValidationSummary(formData, formErrors);
    
    // Валидация жөнінде ақпаратты консольге шығару (тек әзірлеу кезінде)
    console.debug('Form validation:', {
      step: activeStep,
      currentStepValid,
      validationSummary,
      formData,
      formErrors
    });
    
    // Форма валидациясының күйін жаңарту
    setFormValid(prev => ({
      ...prev,
      [`step${activeStep}`]: currentStepValid,
      // Басқа өзгерген қадамдарды да жаңарту
      ...validationSummary
    }));
  }, [activeStep, formData, formErrors]);

  /**
   * Форма деректері, қателері немесе белсенді қадам өзгергенде валидацияны жүргізу
   */
  useEffect(() => {
    updateStepValidation();
  }, [formData, formErrors, activeStep, updateStepValidation]);

  /**
   * Құпия сөзді көрсету/жасыру функциясы
   * Құпия сөз өрісінің көрінуін басқарады
   */
  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Құпия сөзді растауды көрсету/жасыру функциясы
   * Құпия сөзді растау өрісінің көрінуін басқарады
   */
  const handleToggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  /**
   * Формаға енгізілген деректерді өңдеу функциясы
   * Пайдаланушы деректерді енгізгенде немесе өзгерткенде шақырылады
   * 
   * @param {Event} e - Өзгерту оқиғасы
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Форма деректерін жаңарту
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Өзгертілген өрісті валидациялау
    const errorMessage = validateField(name, value, {
      ...formData,
      [name]: value // Басқа өрістермен байланысты валидация үшін жаңартылған мәнді қолдану
    });
    
    // Форма қателерін жаңарту
    setFormErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));

    // Құпия сөз өзгергенде оны растау өрісін де тексеру
    if (name === 'password' && formData.confirmPassword) {
      const confirmError = validateField(
        'confirmPassword', 
        formData.confirmPassword, 
        { ...formData, password: value }
      );
      
      setFormErrors(prev => ({
        ...prev,
        confirmPassword: confirmError
      }));
    }
  };

  /**
   * Келесі қадамға өту функциясы
   * Пайдаланушы "Келесі" батырмасын басқанда шақырылады
   */
  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prevStep => prevStep + 1);
    }
  };

  /**
   * Алдыңғы қадамға қайту функциясы
   * Пайдаланушы "Артқа" батырмасын басқанда шақырылады
   */
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prevStep => prevStep - 1);
    }
  };

  /**
   * Тіркелу формасын жіберу функциясы
   * Пайдаланушы соңғы қадамда "Тіркелу" батырмасын басқанда шақырылады
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
      
      // Жіберілетін деректер туралы ақпаратты консольге шығару (тек әзірлеу кезінде)
      console.log('Sending registration data:', userData);
      
      // AuthContext арқылы тіркелу
      await register(userData);
      
      // Тек сәтті тіркелу жағдайында орындалады
      setSuccess(true);
      
      // Анимация аяқталғанша күту
      setTimeout(() => {
        // Сәтті тіркелгеннен кейін басты бетке бағыттау
        navigate('/', { replace: true });
      }, 2000);
      
    } catch (err) {
      // Қате жағдайында оны күйге сақтау
      console.error('Тіркелу қатесі:', err);
      
      // Нақты қате хабарламаларын тексеру және пайдаланушыға ыңғайлы хабарлама көрсету
      if (err.message === 'Email address already in use') {
        setError('Бұл электрондық пошта тіркелгісі жүйеде бар. Басқа пошта мекенжайын пайдаланыңыз немесе кіру бетіне өтіңіз.');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Тіркелу кезінде қате орын алды. Әрекетті қайталап көріңіз.');
      }
      
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Форма қателерін тікелей орнату функциясы
   * Бұл функция баланың компоненттеріне қателерді тікелей орнатуға мүмкіндік береді
   * 
   * @param {string} field - Өріс атауы
   * @param {string} message - Қате хабарламасы
   */
  const setFieldError = (field, message) => {
    setFormErrors(prev => ({
      ...prev,
      [field]: message
    }));
  };

  // Жүктелу күйі (компонент немесе аутентификация)
  const isLoading = loading || authLoading;

  /**
   * Ағымдағы қадамның мазмұнын көрсету функциясы
   * Белсенді қадам нөміріне байланысты тиісті компонентті қайтарады
   * 
   * @returns {JSX.Element} - Қадам мазмұны
   */
  const getStepContent = () => {
    const commonProps = {
      formData,
      formErrors,
      handleInputChange,
      setFieldError,
      isLoading
    };
    
    switch (activeStep) {
      case 0:
        return <PersonalInfoStep {...commonProps} />;
      case 1:
        return <ContactInfoStep 
                 {...commonProps} 
                 setStepIsProcessing={setStepIsProcessing} 
               />;
      case 2:
        return <EducationInfoStep {...commonProps} />;
      case 3:
        return (
          <PasswordStep 
            {...commonProps}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            handleToggleShowPassword={handleToggleShowPassword}
            handleToggleShowConfirmPassword={handleToggleShowConfirmPassword}
          />
        );
      default:
        return null;
    }
  };

  // Толтыру пайызын есептеу
  const completionPercentage = calculateCompletionPercentage(formValid);
  
  /**
   * Келесі/тіркелу батырмасы өшірілген болуы керек пе соны тексеру
   * Егер ағымдағы қадам валидацияланбаса немесе қадам өңделуде болса, батырма өшірілген
   * 
   * @returns {boolean} - Батырма өшірілген болуы керек пе
   */
  const isNextButtonDisabled = () => {
    return !formValid[`step${activeStep}`] || stepIsProcessing;
  };

  // Анимация варианттары
  const formContainerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  // Әзірлеу режимінде қосымша ақпарат консольге шығару
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.debug('RegisterForm state:', {
        activeStep,
        formValid,
        stepIsProcessing, 
        isNextButtonDisabled: isNextButtonDisabled(),
        completionPercentage
      });
    }
  }, [activeStep, formValid, stepIsProcessing, completionPercentage]);

  return (
    <Container maxWidth="md">
      <motion.div
        initial="hidden"
        animate={pageAnimation ? "visible" : "hidden"}
        variants={formContainerVariants}
      >
        <Paper
          elevation={5}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 3,
            mt: { xs: 2, sm: 3, md: 4 },
            mb: { xs: 2, sm: 3, md: 4 },
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(213, 0, 50, 0.1)', // Обновлено с использованием #d50032
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 12px 40px rgba(213, 0, 50, 0.15)', // Обновлено с использованием #d50032
            }
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
          
          {/* Форма тақырыбы компоненті */}
          <FormHeader 
            activeStep={activeStep} 
            steps={steps} 
            completionPercentage={completionPercentage}
          />
          
          {/* Қадамдар индикаторы */}
          <Box sx={{ mb: 5 }}>
            <Stepper 
              activeStep={activeStep} 
              alternativeLabel={!isMobile}
              orientation={isMobile ? "vertical" : "horizontal"}
              connector={<ColorlibConnector />}
              sx={{
                '& .MuiStepLabel-label': {
                  mt: 1,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                  '&.Mui-active': {
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                  },
                  '&.Mui-completed': {
                    color: theme.palette.success.main,
                    fontWeight: 600,
                  },
                },
              }}
            >
              {steps.map((label, index) => {
                const stepError = index === 0 && formErrors.name ||
                                index === 1 && (formErrors.email || formErrors.phone) ||
                                index === 2 && (formErrors.faculty || formErrors.specialization || formErrors.studentId || formErrors.year) ||
                                index === 3 && (formErrors.password || formErrors.confirmPassword);
                
                return (
                  <Step key={label} completed={activeStep > index}>
                    <StepLabel 
                      StepIconComponent={(props) => 
                        <ColorlibStepIcon 
                          {...props} 
                          error={stepError && activeStep === index} 
                        />
                      }
                    >
                      {label}
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </Box>

          {/* Хабарламалар (сәтті және қателер) */}
          <FormAlerts success={success} error={error} />
          
          {/* Тіркелу формасы */}
          <form onSubmit={handleSubmit}>
            {/* Ағымдағы қадамның мазмұны */}
            <Box 
              sx={{ 
                minHeight: { xs: '350px', sm: '300px' },
                transition: 'min-height 0.3s ease'
              }}
            >
              <AnimatePresence mode="wait">
                {getStepContent()}
              </AnimatePresence>
            </Box>
            
            {/* Навигация батырмалары */}
            <FormNavigation 
              activeStep={activeStep}
              stepsLength={steps.length}
              isButtonDisabled={isNextButtonDisabled()}
              isLoading={isLoading}
              isSuccess={success}
              isProcessing={stepIsProcessing}
              handleBack={handleBack}
              handleNext={handleNext}
            />
          </form>
          
          {/* Жүйеге кіру сілтемесі */}
          <LoginLink isLoading={isLoading} />
        </Paper>
      </motion.div>
    </Container>
  );
};

export default RegisterForm;