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

/**
 * Footer компоненті - сайттың төменгі бөлігі
 * 
 * Бұл компонент сайттың төменгі бөлігін (футерін) құрайды және келесі элементтерді қамтиды:
 * - Сайт туралы қысқаша ақпарат
 * - Навигация сілтемелері (меню)
 * - Пайдаланушы аккаунты сілтемелері
 * - Контактілік ақпарат
 * - Әлеуметтік желілер иконкалары
 * - Авторлық құқық туралы ақпарат
 * - Конфиденциалдылық саясаты мен пайдалану шарттары сілтемелері
 */
const Footer = () => {
  const theme = useTheme(); // Material UI тақырыбын алу
  const currentYear = new Date().getFullYear(); // Ағымдағы жылды алу (авторлық құқық үшін)

  return (
    <Box
      component="footer" // Футер ретінде белгілеу (семантикалық HTML)
      sx={{
        py: 3, // Жоғарғы және төменгі padding
        px: 2, // Сол және оң жақ padding
        mt: 'auto', // Жоғарыдан автоматты түрде margin (футерді төменге бекіту үшін)
        backgroundColor: theme.palette.primary.main, // Негізгі түс
        color: 'white', // Мәтін түсі - ақ
      }}
    >
      <Container maxWidth="lg">
        {/* Футер контентінің торы (grid) */}
        <Grid container spacing={4} justifyContent="space-between">
          {/* Бірінші бағана - Сайт туралы ақпарат */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              НАРХОЗ Библиотека
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Электронная библиотечная система для студентов и преподавателей Университета Нархоз
            </Typography>
            {/* Әлеуметтік желілер иконкалары */}
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

          {/* Екінші бағана - Навигация сілтемелері */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Навигация
            </Typography>
            <Link
              component={RouterLink} // React Router сілтемесі ретінде рендерлеу
              to="/" // Басты бетке сілтеме
              color="inherit" // Түсті мұрагерлеу (ақ)
              variant="body2" // Шрифт өлшемі
              display="block" // Блок элементі ретінде көрсету
              sx={{ mb: 1 }} // Төменгі margin
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

          {/* Үшінші бағана - Аккаунт сілтемелері */}
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

          {/* Төртінші бағана - Контактілік ақпарат */}
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

        {/* Бөлгіш сызық - футердің төменгі бөлігінен бөледі */}
        <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

        {/* Футердің төменгі бөлігі - авторлық құқық пен қосымша сілтемелер */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          {/* Авторлық құқық туралы мәлімет - ағымдағы жылмен */}
          <Typography variant="body2">
            © {currentYear} Университет Нархоз. Все права защищены.
          </Typography>
          {/* Қосымша сілтемелер - конфиденциалдылық саясаты және пайдалану шарттары */}
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