// src/components/auth/RegisterForm/FormNavigation.jsx
import React from 'react';
import { Box, Button, CircularProgress, useTheme, useMediaQuery, Tooltip } from '@mui/material';
import { ArrowBack, ArrowForward, Check, HourglassEmpty } from '@mui/icons-material';

/**
 * Тіркелу формасындағы навигациялық батырмалар компоненті
 * 
 * Бұл компонент тіркелу формасының төменгі бөлігіндегі "Артқа" және "Келесі" 
 * батырмаларын басқарады. Соңғы қадамда "Тіркелу" батырмасын көрсетеді.
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {number} props.activeStep - Ағымдағы белсенді қадам
 * @param {number} props.stepsLength - Қадамдар саны
 * @param {boolean} props.isButtonDisabled - Келесі/тіркелу батырмасы өшірілген бе
 * @param {boolean} props.isLoading - Форма жүктелу күйінде ме
 * @param {boolean} props.isSuccess - Форма жіберу сәтті болды ма
 * @param {boolean} props.isProcessing - Қадам деректерді өңдеуде ме (мысалы, email тексеру)
 * @param {Function} props.handleBack - Артқа батырмасын басқандағы функция
 * @param {Function} props.handleNext - Келесі батырмасын басқандағы функция
 * @returns {JSX.Element} - Навигациялық батырмалар компоненті
 */
const FormNavigation = ({ 
  activeStep, 
  stepsLength, 
  isButtonDisabled, 
  isLoading, 
  isSuccess,
  isProcessing,
  handleBack, 
  handleNext 
}) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));

  /**
   * Келесі батырманың мәтінін анықтау
   * Тексеру жағдайында тексерілуде мәтінін көрсетеді
   * 
   * @returns {string} - Батырманың мәтіні
   */
  const getNextButtonText = () => {
    if (isProcessing) {
      return 'Тексерілуде...';
    }
    return 'Келесі';
  };

  /**
   * Соңғы батырманың мәтінін анықтау
   * Күйіне байланысты әртүрлі мәтіндерді көрсетеді (тіркелу, тіркелуде, тіркелдіңіз)
   * 
   * @returns {string} - Батырманың мәтіні
   */
  const getFinalButtonText = () => {
    if (isSuccess) {
      return 'Тіркелдіңіз!';
    }
    if (isLoading) {
      return 'Тіркелуде...';
    }
    if (isProcessing) {
      return 'Тексерілуде...';
    }
    return 'Тіркелу';
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        mt: 4,
        pt: 2,
        borderTop: `1px solid ${theme.palette.divider}`
      }}
    >
      <Button
        onClick={handleBack}
        disabled={activeStep === 0 || isLoading || isSuccess}
        startIcon={<ArrowBack />}
        variant="outlined"
        size={isSmall ? "medium" : "large"}
        sx={{ 
          borderRadius: 2,
          px: { xs: 2, sm: 3 },
          py: { xs: 1, sm: 1.2 },
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease',
          borderColor: theme.palette.primary.main, // Добавлено для согласованности
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderColor: theme.palette.primary.dark // Добавлено для согласованности
          }
        }}
      >
        Артқа
      </Button>
      
      {activeStep === stepsLength - 1 ? (
        // Соңғы қадамның тіркелу батырмасы
        <Tooltip title={isButtonDisabled ? "Барлық қажетті өрістерді толтырыңыз" : ""}>
          <span>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isButtonDisabled || isLoading || isSuccess}
              endIcon={isLoading || isSuccess ? 
                <CircularProgress size={20} color="inherit" /> : 
                isProcessing ? <HourglassEmpty /> : <Check />
              }
              size={isSmall ? "medium" : "large"}
              sx={{ 
                borderRadius: 2,
                px: { xs: 2, sm: 3 },
                py: { xs: 1, sm: 1.2 },
                boxShadow: '0 4px 12px rgba(213, 0, 50, 0.3)', // Обновлено для использования цвета #d50032
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                bgcolor: isSuccess ? theme.palette.success.main : theme.palette.primary.main,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 15px rgba(213, 0, 50, 0.4)', // Обновлено для использования цвета #d50032
                  bgcolor: isSuccess ? theme.palette.success.dark : theme.palette.primary.dark,
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 100%)',
                  zIndex: 1,
                  transform: 'translateX(-100%)',
                  animation: (isLoading || isSuccess) ? 'none' : 'shimmer 2s infinite',
                },
                '@keyframes shimmer': {
                  '100%': {
                    transform: 'translateX(100%)',
                  },
                }
              }}
            >
              {getFinalButtonText()}
            </Button>
          </span>
        </Tooltip>
      ) : (
        // Аралық қадамдардың келесі батырмасы
        <Tooltip title={isButtonDisabled ? (isProcessing ? "Email тексерілуін күтіңіз" : "Барлық қажетті өрістерді толтырыңыз") : ""}>
          <span>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={isButtonDisabled || isLoading || isSuccess}
              endIcon={isProcessing ? <HourglassEmpty /> : <ArrowForward />}
              size={isSmall ? "medium" : "large"}
              sx={{ 
                borderRadius: 2,
                px: { xs: 2, sm: 3 },
                py: { xs: 1, sm: 1.2 },
                boxShadow: '0 4px 12px rgba(213, 0, 50, 0.3)', // Обновлено для использования цвета #d50032
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                bgcolor: isProcessing ? theme.palette.warning.main : theme.palette.primary.main,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 15px rgba(213, 0, 50, 0.4)', // Обновлено для использования цвета #d50032
                  bgcolor: isProcessing ? theme.palette.warning.dark : theme.palette.primary.dark,
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 100%)',
                  zIndex: 1,
                  transform: 'translateX(-100%)',
                  animation: 'shimmer 2s infinite',
                },
                '@keyframes shimmer': {
                  '100%': {
                    transform: 'translateX(100%)',
                  },
                }
              }}
            >
              {getNextButtonText()}
            </Button>
          </span>
        </Tooltip>
      )}
    </Box>
  );
};

export default FormNavigation;