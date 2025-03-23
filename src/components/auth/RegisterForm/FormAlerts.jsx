// src/components/auth/RegisterForm/FormAlerts.jsx
import React from 'react';
import { Alert, Box, Typography, useTheme } from '@mui/material';
import { Celebration } from '@mui/icons-material';
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
                bgcolor: theme.palette.success.main, // Уверяемся, что используется правильный цвет
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
      
      {/* Қате хабарламасы */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Alert 
              severity="error" 
              variant="filled" 
              sx={{ 
                mb: 3,
                alignItems: 'center',
                bgcolor: theme.palette.error.main, // Используем цвет ошибки из темы
              }}
            >
              {error}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FormAlerts;