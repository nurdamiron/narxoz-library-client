// src/components/auth/RegisterForm/LoginLink.jsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography, Divider, useTheme } from '@mui/material';

/**
 * Жүйеге кіру сілтемесі бар бөлім компоненті
 * 
 * Бұл компонент тіркелу формасының төменгі бөлігіндегі жүйеге кіру
 * сілтемесін көрсетеді. Ол бөлгіш сызық пен сілтеме батырмасынан тұрады.
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {boolean} props.isLoading - Форма жүктелу күйінде ме
 * @returns {JSX.Element} - Кіру сілтемесі бар бөлім
 */
const LoginLink = ({ isLoading }) => {
  const theme = useTheme();
  
  return (
    <>
      {/* Тіркелу мен кіру арасындағы бөлгіш сызық */}
      <Divider 
        sx={{ 
          my: 4,
          '&::before, &::after': {
            borderColor: `${theme.palette.divider}`,
          }
        }}
      >
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            px: 2,
            bgcolor: theme.palette.background.paper
          }}
        >
          НЕМЕСЕ
        </Typography>
      </Divider>
      
      {/* Жүйеге кіру бөлімі */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Аккаунтыңыз бар ма?
        </Typography>
        <Button
          component={RouterLink}
          to="/login"
          variant="outlined"
          fullWidth
          disabled={isLoading}
          sx={{ 
            borderRadius: 2,
            py: 1.2,
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
            borderColor: theme.palette.primary.main, // Используем основной цвет для границы
            color: theme.palette.primary.main, // Используем основной цвет для текста
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              borderColor: theme.palette.primary.dark, // Более темный оттенок при наведении
              backgroundColor: `${theme.palette.primary.main}10`, // Легкий оттенок основного цвета с прозрачностью
            }
          }}
        >
          Жүйеге кіру
        </Button>
      </Box>
    </>
  );
};

export default LoginLink;