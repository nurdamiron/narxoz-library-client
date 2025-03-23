// src/components/auth/RegisterForm/StepComponents.jsx
import React from 'react';
import { StepConnector, styled, Avatar, useTheme } from '@mui/material';
import { Person, Email, MenuBook, VpnKey } from '@mui/icons-material';

/**
 * Қадамдар арасындағы градиентті байланыстырғыш компонент
 * 
 * Бұл компонент Material UI StepConnector компонентін стильдеу арқылы
 * қадамдар арасында градиентті байланыс жасайды.
 */
export const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${StepConnector.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${StepConnector.root}`]: {
    marginLeft: 12,
  },
  [`& .${StepConnector.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
  [`&.Mui-active .${StepConnector.line}`]: {
    backgroundImage: `linear-gradient(95deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.light} 100%)`,
  },
  [`&.Mui-completed .${StepConnector.line}`]: {
    backgroundImage: `linear-gradient(95deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.light} 100%)`,
  },
}));

/**
 * Әрбір қадам үшін арнайы иконка компоненті
 * 
 * Бұл компонент әр қадам үшін әртүрлі белгішелерді көрсетеді.
 * Қадамның күйіне байланысты (белсенді, аяқталған, қате) түсі өзгереді.
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {boolean} props.active - Қадам белсенді ме
 * @param {boolean} props.completed - Қадам аяқталған ба
 * @param {number} props.icon - Қадам нөмірі (1-ден басталады)
 * @param {boolean} props.error - Қадамда қателер бар ма
 * @returns {JSX.Element} - Арнайы қадам белгішесі
 */
export const ColorlibStepIcon = ({ active, completed, icon, error }) => {
  const theme = useTheme();
  
  // Әр қадам үшін белгішелер
  const icons = {
    1: <Person />,
    2: <Email />,
    3: <MenuBook />,
    4: <VpnKey />,
  };

  return (
    <Avatar
      sx={{
        backgroundColor: error
          ? theme.palette.error.main
          : completed
          ? theme.palette.success.main
          : active
          ? theme.palette.primary.main // Используется основной цвет #d50032
          : theme.palette.mode === 'dark'
          ? theme.palette.grey[700]
          : '#ccc',
        boxShadow: active 
          ? `0 4px 10px 0 rgba(213, 0, 50, 0.3)` // Тень для активного шага с цветом #d50032
          : completed 
          ? '0 4px 10px 0 rgba(0,0,0,0.1)'
          : 'none',
        width: 45,
        height: 45,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      }}
    >
      {icons[icon]}
    </Avatar>
  );
};