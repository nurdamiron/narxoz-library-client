// src/components/auth/RegisterForm/FormHeader.jsx
import React from 'react';
import { Box, Typography, Avatar, Badge, Tooltip, useTheme, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LibraryBooks, BookmarkBorder } from '@mui/icons-material';
import { motion } from 'framer-motion';

/**
 * Тіркелу формасының тақырып бөлігінің компоненті
 * 
 * Бұл компонент тіркелу формасының жоғарғы бөлігін көрсетеді.
 * Онда аватар, тақырып және қадамдар жайлы ақпарат болады.
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {number} props.activeStep - Ағымдағы белсенді қадам
 * @param {string[]} props.steps - Қадамдар атауларының массиві
 * @param {number} props.completionPercentage - Форманы толтыру пайызы
 * @returns {JSX.Element} - Тіркелу формасының тақырып бөлігі
 */
const FormHeader = ({ activeStep, steps, completionPercentage }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Анимация варианттары
  const formHeaderVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div variants={formHeaderVariants}>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          mb: 4 
        }}
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <Tooltip title={t('auth.register.completed', { percentage: completionPercentage })}>
              <Avatar 
                sx={{ 
                  width: 28, 
                  height: 28, 
                  bgcolor: theme.palette.primary.main, // Изменено на основной цвет
                  boxShadow: '0 3px 6px rgba(0,0,0,0.16)',
                  border: `2px solid ${theme.palette.background.paper}`,
                  fontSize: '0.7rem',
                  fontWeight: 'bold'
                }}
              >
                {completionPercentage}%
              </Avatar>
            </Tooltip>
          }
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.2,
              type: "spring",
              stiffness: 200
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: theme.palette.primary.main, // Изменено на основной цвет
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                mb: 2
              }}
            >
              <LibraryBooks sx={{ fontSize: 40 }} />
            </Avatar>
          </motion.div>
        </Badge>
        
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          gutterBottom
          textAlign="center"
          sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' }
          }}
        >
          {t('auth.register.title')}
        </Typography>
        
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ 
            maxWidth: '80%',
            mb: 1
          }}
        >
          {t('auth.register.subtitle')}
        </Typography>

        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: 0.5,
            bgcolor: theme.palette.primary.main + '15', // Изменено на основной цвет с прозрачностью
            py: 0.5,
            px: 1.5,
            borderRadius: 5,
            mt: 1
          }}
        >
          <BookmarkBorder fontSize="small" color="primary" />
          <Typography variant="caption" color="primary.main" fontWeight={500}>
            {t('auth.register.stepProgress', { current: activeStep + 1, total: steps.length })}
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};

export default FormHeader;