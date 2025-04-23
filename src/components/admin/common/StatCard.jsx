import React from 'react';
import { Paper, Box, Typography, Avatar, useTheme, alpha } from '@mui/material';

/**
 * Компонент карточки статистики для админ-панели
 * 
 * @param {Object} props - Свойства компонента
 * @param {string} props.title - Заголовок карточки
 * @param {string|number} props.value - Значение статистики
 * @param {string} props.subtitle - Подзаголовок (опционально)
 * @param {React.ReactNode} props.icon - Иконка
 * @param {string} props.color - Цвет (primary, secondary, success, error, warning, info)
 * @param {Function} props.onClick - Обработчик клика (опционально)
 */
const StatCard = ({ title, value, subtitle, icon, color = 'primary', onClick }) => {
  const theme = useTheme();
  
  // Определяем цвет на основе переданного параметра
  const getColor = () => {
    switch (color) {
      case 'secondary': return theme.palette.secondary.main;
      case 'success': return theme.palette.success.main;
      case 'error': return theme.palette.error.main;
      case 'warning': return theme.palette.warning.main;
      case 'info': return theme.palette.info.main;
      default: return theme.palette.primary.main;
    }
  };
  
  const cardColor = getColor();
  
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        transition: 'transform 0.3s, box-shadow 0.3s',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? {
          transform: 'translateY(-5px)',
          boxShadow: 6
        } : {}
      }}
      onClick={onClick}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar
          sx={{
            bgcolor: alpha(cardColor, 0.1),
            color: cardColor,
            width: 50,
            height: 50,
            mr: 2
          }}
        >
          {icon}
        </Avatar>
        <Box>
          <Typography variant="h6" color="text.secondary" fontSize={'0.875rem'}>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold" color={cardColor}>
            {value}
          </Typography>
        </Box>
      </Box>
      
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {subtitle}
        </Typography>
      )}
    </Paper>
  );
};

export default StatCard;