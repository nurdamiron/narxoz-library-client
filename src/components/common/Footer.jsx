import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  YouTube as YouTubeIcon,
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.primary.main,
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              НАРХОЗ Библиотека
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Электронная библиотечная система для студентов и преподавателей Университета Нархоз
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Link href="#" color="inherit">
                <FacebookIcon />
              </Link>
              <Link href="#" color="inherit">
                <InstagramIcon />
              </Link>
              <Link href="#" color="inherit">
                <TwitterIcon />
              </Link>
              <Link href="#" color="inherit">
                <YouTubeIcon />
              </Link>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Навигация
            </Typography>
            <Link
              component={RouterLink}
              to="/"
              color="inherit"
              variant="body2"
              display="block"
              sx={{ mb: 1 }}
            >
              Главная
            </Link>
            <Link
              component={RouterLink}
              to="/books"
              color="inherit"
              variant="body2"
              display="block"
              sx={{ mb: 1 }}
            >
              Каталог
            </Link>
            <Link
              component={RouterLink}
              to="/about"
              color="inherit"
              variant="body2"
              display="block"
              sx={{ mb: 1 }}
            >
              О библиотеке
            </Link>
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Аккаунт
            </Typography>
            <Link
              component={RouterLink}
              to="/profile"
              color="inherit"
              variant="body2"
              display="block"
              sx={{ mb: 1 }}
            >
              Мой профиль
            </Link>
            <Link
              component={RouterLink}
              to="/history"
              color="inherit"
              variant="body2"
              display="block"
              sx={{ mb: 1 }}
            >
              История заказов
            </Link>
            <Link
              component={RouterLink}
              to="/help"
              color="inherit"
              variant="body2"
              display="block"
              sx={{ mb: 1 }}
            >
              Помощь
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Контакты
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Адрес: ул. Жандосова, 55, Алматы
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Телефон: +7 (727) 377-11-11
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Email: library@narxoz.kz
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Typography variant="body2">
            © {currentYear} Университет Нархоз. Все права защищены.
          </Typography>
          <Box>
            <Link
              component={RouterLink}
              to="/privacy"
              color="inherit"
              variant="body2"
              sx={{ mx: 1 }}
            >
              Политика конфиденциальности
            </Link>
            <Link
              component={RouterLink}
              to="/terms"
              color="inherit"
              variant="body2"
              sx={{ mx: 1 }}
            >
              Условия использования
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;