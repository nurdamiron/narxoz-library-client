import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  Paper,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  YouTube as YouTubeIcon,
  Language as LanguageIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  School as SchoolIcon,
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
 * 
 * @returns {JSX.Element} - Футер компоненті
 */
const Footer = () => {
  const theme = useTheme(); // Material UI тақырыбын алу
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Мобильді құрылғыны тексеру
  const isSmall = useMediaQuery(theme.breakpoints.down('sm')); // Кішкентай экранды тексеру
  const currentYear = new Date().getFullYear(); // Ағымдағы жылды алу (авторлық құқық үшін)

  /**
   * Беттің жоғарғы жағына скролл жасау
   */
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Әлеуметтік желі сілтемелері (мокап)
  const socialLinks = [
    { icon: <FacebookIcon />, name: 'Facebook', url: 'https://facebook.com' },
    { icon: <InstagramIcon />, name: 'Instagram', url: 'https://instagram.com' },
    { icon: <TwitterIcon />, name: 'Twitter', url: 'https://twitter.com' },
    { icon: <YouTubeIcon />, name: 'YouTube', url: 'https://youtube.com' },
  ];

  // Негізгі навигация сілтемелері
  const mainLinks = [
    { title: 'Главная', path: '/' },
    { title: 'Каталог', path: '/books' },
    { title: 'Популярные книги', path: '/books?popular=true' },
    { title: 'О библиотеке', path: '/about' },
    { title: 'Помощь', path: '/help' },
  ];

  // Аккаунт сілтемелері
  const accountLinks = [
    { title: 'Мой профиль', path: '/profile' },
    { title: 'История заказов', path: '/history' },
    { title: 'Мои закладки', path: '/bookmarks' },
  ];

  // Контактілік ақпарат
  const contactInfo = [
    { icon: <LocationOnIcon />, text: 'ул. Жандосова, 55, Алматы' },
    { icon: <PhoneIcon />, text: '+7 (727) 377-11-11' },
    { icon: <EmailIcon />, text: 'library@narxoz.kz' },
    { icon: <ScheduleIcon />, text: 'Пн-Пт: 9:00 - 20:00, Сб: 10:00 - 17:00' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        pt: { xs: 6, md: 8 },
        pb: { xs: 3, md: 4 },
        bgcolor: theme.palette.primary.main,
        color: 'white',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        },
      }}
    >
      <Container maxWidth="lg">
        {/* Жоғарғы бөлігі - бренд және әлеуметтік желілер */}
        <Grid container spacing={4} justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SchoolIcon sx={{ fontSize: 36, mr: 1.5 }} />
              <Typography variant="h5" fontWeight="bold" component="div">
                НАРХОЗ Библиотека
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mt: 1.5, opacity: 0.9 }}>
              Электронная библиотечная система для студентов и преподавателей Университета Нархоз
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {/* Әлеуметтік желі иконкалары */}
              {socialLinks.map((social, index) => (
                <Tooltip key={index} title={social.name}>
                  <IconButton
                    component="a"
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    color="inherit"
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        transform: 'translateY(-3px)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {social.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Футер контентінің торы (grid) */}
        <Grid container spacing={4} justifyContent="space-between">
          {/* Навигация бөлімі */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Навигация
            </Typography>
            <List dense disablePadding>
              {mainLinks.map((link, index) => (
                <ListItem 
                  key={index} 
                  disablePadding 
                  sx={{ 
                    mb: 0.5, 
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 1,
                    }
                  }}
                >
                  <ListItemText 
                    primary={
                      <Link
                        component={RouterLink}
                        to={link.path}
                        color="inherit"
                        underline="none"
                        sx={{
                          display: 'block',
                          py: 0.75,
                          opacity: 0.9,
                          '&:hover': {
                            opacity: 1,
                          }
                        }}
                      >
                        {link.title}
                      </Link>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Личный кабинет бөлімі */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Личный кабинет
            </Typography>
            <List dense disablePadding>
              {accountLinks.map((link, index) => (
                <ListItem 
                  key={index} 
                  disablePadding 
                  sx={{ 
                    mb: 0.5, 
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 1,
                    }
                  }}
                >
                  <ListItemText 
                    primary={
                      <Link
                        component={RouterLink}
                        to={link.path}
                        color="inherit"
                        underline="none"
                        sx={{
                          display: 'block',
                          py: 0.75,
                          opacity: 0.9,
                          '&:hover': {
                            opacity: 1,
                          }
                        }}
                      >
                        {link.title}
                      </Link>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Контакты бөлімі */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Контактная информация
              </Typography>
              <List dense disablePadding>
                {contactInfo.map((item, index) => (
                  <ListItem key={index} sx={{ px: 1, py: 0.75 }}>
                    <ListItemIcon sx={{ minWidth: 36, color: 'white' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text}
                      primaryTypographyProps={{ 
                        variant: 'body2',
                        sx: { opacity: 0.9 }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
              
              {/* Карта на сайт кнопка */}
              <Button
                component="a"
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<LanguageIcon />}
                variant="outlined"
                fullWidth
                sx={{
                  mt: 2,
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.08)',
                  },
                }}
              >
                Открыть на карте
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* Бөлгіш сызық - футердің төменгі бөлігінен бөледі */}
        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

        {/* Футердің төменгі бөлігі - авторлық құқық пен қосымша сілтемелер */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ opacity: 0.8, textAlign: { xs: 'center', md: 'left' } }}>
              © {currentYear} Университет Нархоз. Все права защищены.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: { xs: 'center', md: 'flex-end' },
              flexWrap: 'wrap'
            }}>
              <Link
                component={RouterLink}
                to="/privacy"
                color="inherit"
                variant="body2"
                sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
              >
                Политика конфиденциальности
              </Link>
              <Link
                component={RouterLink}
                to="/terms"
                color="inherit"
                variant="body2"
                sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
              >
                Условия использования
              </Link>
            </Box>
          </Grid>
        </Grid>
        
        {/* Кнопка прокрутки вверх - справа внизу */}
        <Tooltip title="Наверх">
          <IconButton
            aria-label="Наверх"
            onClick={handleScrollToTop}
            sx={{
              position: 'absolute',
              right: isSmall ? 16 : 32,
              bottom: isSmall ? 16 : 32,
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.25)',
              },
              boxShadow: theme.shadows[4],
            }}
          >
            <KeyboardArrowUpIcon />
          </IconButton>
        </Tooltip>
      </Container>
    </Box>
  );
};

export default Footer;