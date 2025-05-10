// src/components/auth/RegisterForm/FormAlerts.jsx
import React from 'react';
import { Alert, Box, Typography, useTheme, Paper, Divider, Link } from '@mui/material';
import { 
  Celebration, 
  ErrorOutline, 
  Warning, 
  Info,
  AccountCircle,
  Email as EmailIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Форма хабарламаларын көрсететін компонент
 * 
 * Бұл компонент тіркелу формасындағы сәтті және қате хабарламаларын көрсетеді.
 * Хабарламалар анимациямен пайда болады және жоғалады.
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {boolean} props.success - Сәтті хабарламаны көрсету керек пе
 * @param {string} props.error - Көрсетілетін қате хабарламасы (бос жол болса қате жоқ)
 * @returns {JSX.Element} - Хабарламалар компоненті
 */
const FormAlerts = ({ success, error }) => {
  const theme = useTheme();

  // Распознавание разных типов ошибок
  const errorType = React.useMemo(() => {
    if (!error) return null;
    
    // Логирование для отладки
    console.log('FormAlerts received error:', error);
    
    if (error === '[object Object]') {
      return 'unknown';
    }
    
    if (error.includes('email') || error.includes('электрондық пошта')) {
      return 'email';
    }
    
    if (error.includes('логин') || error.includes('username')) {
      return 'username';
    }
    
    if (error.includes('құпия сөз') || error.includes('password')) {
      return 'password';
    }
    
    return 'general';
  }, [error]);
  
  // Получение соответствующей иконки для типа ошибки
  const getErrorIcon = (type) => {
    switch (type) {
      case 'email':
        return <EmailIcon color="error" sx={{ mr: 1 }} />;
      case 'username':
        return <AccountCircle color="error" sx={{ mr: 1 }} />;
      case 'unknown':
        return <Info color="error" sx={{ mr: 1 }} />;
      default:
        return <ErrorOutline color="error" sx={{ mr: 1 }} />;
    }
  };
  
  // Получение заголовка ошибки
  const getErrorTitle = (type) => {
    switch (type) {
      case 'email':
        return 'Email қатесі';
      case 'username':
        return 'Логин қатесі';
      case 'password':
        return 'Құпия сөз қатесі';
      case 'unknown':
        return 'Белгісіз қате';
      default:
        return 'Тіркеу қатесі';
    }
  };
  
  // Получение рекомендации по исправлению ошибки
  const getErrorSolution = (type) => {
    switch (type) {
      case 'email':
        return 'Басқа email пайдаланыңыз немесе кіру бетіне өтіңіз.';
      case 'username':
        return 'Басқа логин таңдаңыз.';
      case 'password':
        return 'Күрделі құпия сөз пайдаланыңыз (кемінде 6 таңба).';
      case 'unknown':
        return 'Браузерді жаңартып, қайталап көріңіз немесе әкімшіге хабарласыңыз.';
      default:
        return 'Барлық өрістерді тексеріп, қайталап көріңіз.';
    }
  };

  return (
    <>
      {/* Сәтті тіркелу хабарламасы */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Alert 
              icon={<Celebration />}
              severity="success" 
              variant="filled" 
              sx={{ 
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                bgcolor: theme.palette.success.main,
                borderRadius: 2,
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Сіз сәтті тіркелдіңіз! Нархоз кітапханасына қош келдіңіз!
                </Typography>
              </Box>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Қате хабарламасы - улучшенная версия */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            {error === '[object Object]' ? (
              <Alert 
                severity="error" 
                variant="filled" 
                sx={{ 
                  mb: 3,
                  alignItems: 'center',
                  bgcolor: theme.palette.error.main,
                  borderRadius: 2,
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Typography variant="body2">
                  Белгісіз қате орын алды. Әрекетті қайталап көріңіз.
                </Typography>
              </Alert>
            ) : (
              <Paper
                elevation={3}
                sx={{
                  mb: 3,
                  p: 2,
                  border: `1px solid ${theme.palette.error.main}`,
                  borderRadius: 2,
                  bgcolor: `${theme.palette.error.light}15`
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {getErrorIcon(errorType)}
                  <Typography variant="subtitle1" color="error.main" fontWeight={600}>
                    {getErrorTitle(errorType)}
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 1.5 }} />
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {error}
                </Typography>
                
                <Box sx={{ p: 1, bgcolor: `${theme.palette.warning.light}30`, borderRadius: 1, mt: 1 }}>
                  <Typography variant="body2" display="flex" alignItems="center">
                    <Warning sx={{ fontSize: 18, mr: 1, color: theme.palette.warning.main }} />
                    <span><strong>Шешім:</strong> {getErrorSolution(errorType)}</span>
                  </Typography>
                </Box>
                
                {errorType === 'email' && (
                  <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <Link href="/login" color="primary" underline="hover">
                      Кіру бетіне өту
                    </Link>
                  </Box>
                )}
              </Paper>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FormAlerts;