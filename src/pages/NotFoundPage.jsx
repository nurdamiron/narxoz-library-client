import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  SentimentDissatisfied as SentimentDissatisfiedIcon,
  Home as HomeIcon,
  BookOutlined as BookOutlinedIcon,
} from '@mui/icons-material';

/**
 * NotFoundPage компоненті - 404 қате бетін көрсетеді
 * 
 * Бұл компонент пайдаланушы қате немесе жоқ URL мекенжайына кіргенде көрсетіледі.
 * Компонент пайдаланушыға не болғанын түсіндіреді және басты бетке немесе каталогқа 
 * қайту үшін түймелер ұсынады.
 * 
 * @returns {JSX.Element} - 404 қате беті
 */
const NotFoundPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          textAlign: 'center',
          p: { xs: 3, md: 6 },
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
            backgroundImage: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          }}
        />
        
        {/* 404 Иконка */}
        <SentimentDissatisfiedIcon
          color="primary"
          sx={{ fontSize: { xs: 80, md: 120 }, mb: 2, opacity: 0.8 }}
        />
        
        {/* 404 Жазуы */}
        <Typography
          variant="h1"
          fontWeight="bold"
          sx={{ 
            fontSize: { xs: '4rem', md: '6rem' },
            mb: 2,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.05em',
          }}
        >
          404
        </Typography>
        
        {/* Тақырып */}
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          gutterBottom
          sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
        >
          {t('notFound.title', 'Страница не найдена')}
        </Typography>
        
        {/* Түсіндірме */}
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ 
            mb: 4,
            maxWidth: '600px',
            mx: 'auto',
            fontSize: { xs: '0.9rem', md: '1rem' },
          }}
        >
          {t('notFound.description', 'Запрашиваемая страница не существует или была удалена. Проверьте URL-адрес или воспользуйтесь одной из ссылок ниже, чтобы вернуться на сайт.')}
        </Typography>
        
        {/* Түймелер */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            size="large"
            startIcon={<HomeIcon />}
            sx={{ 
              py: 1.5,
              px: 3,
              borderRadius: 2,
              fontWeight: 'bold',
            }}
          >
            {t('notFound.homeButton', 'На главную')}
          </Button>
          
          <Button
            component={RouterLink}
            to="/books"
            variant="outlined"
            size="large"
            startIcon={<BookOutlinedIcon />}
            sx={{ 
              py: 1.5,
              px: 3,
              borderRadius: 2,
              fontWeight: 'bold',
            }}
          >
            {t('notFound.catalogButton', 'В каталог книг')}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFoundPage;