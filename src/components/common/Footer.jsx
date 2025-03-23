/**
 * src/components/common/Footer.jsx
 * 
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
 * @version 2.0
 * @author Нархоз Library Team
 * @returns {JSX.Element} - Футер компоненті
 */
import React, { useState } from 'react';
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
  TextField,
  InputAdornment,
  alpha,
  Collapse,
  Snackbar,
  Alert
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
  Send as SendIcon,
  Notifications as NotificationsIcon,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Footer компоненті - сайттың төменгі бөлігі
 * 
 * @returns {JSX.Element} - Футер компоненті
 */
const Footer = () => {
  const theme = useTheme(); // Material UI тақырыбын алу
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Мобильді құрылғыны тексеру
  const isSmall = useMediaQuery(theme.breakpoints.down('sm')); // Кішкентай экранды тексеру
  const currentYear = new Date().getFullYear(); // Ағымдағы жылды алу (авторлық құқық үшін)

  // Жазылым күйлері
  const [email, setEmail] = useState('');
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [subscribeError, setSubscribeError] = useState(false);
  
  // Мобильді көрініс үшін бөлімдер жай-күйлері
  const [sectionsOpen, setSectionsOpen] = useState({
    navigation: false,
    account: false,
    contact: true
  });

  /**
   * Беттің жоғарғы жағына скролл жасау
   */
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  /**
   * Жазылымды өңдеу
   * 
   * @param {Event} e - Форма оқиғасы
   */
  const handleSubscribe = (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setSubscribeError(true);
      return;
    }
    
    // Имитация отправки запроса на API
    setTimeout(() => {
      setSubscribeSuccess(true);
      setEmail('');
    }, 500);
  };

  /**
   * Бөлім жай-күйін ауыстыру (мобильді көрініс үшін)
   * 
   * @param {string} section - Бөлім атауы
   */
  const toggleSection = (section) => {
    setSectionsOpen(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  /**
   * Snackbar хабарламасын жабу
   */
  const handleCloseSnackbar = () => {
    setSubscribeSuccess(false);
    setSubscribeError(false);
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
    { title: 'Басты бет', path: '/' },
    { title: 'Каталог', path: '/books' },
    { title: 'Танымал кітаптар', path: '/books?popular=true' },
    { title: 'Кітапхана туралы', path: '/about' },
    { title: 'Көмек', path: '/help' },
  ];

  // Аккаунт сілтемелері
  const accountLinks = [
    { title: 'Менің профилім', path: '/profile' },
    { title: 'Тапсырыс тарихы', path: '/history' },
    { title: 'Менің бетбелгілерім', path: '/bookmarks' },
  ];

  // Контактілік ақпарат
  const contactInfo = [
    { icon: <LocationOnIcon />, text: 'Жандосов көшесі, 55, Алматы' },
    { icon: <PhoneIcon />, text: '+7 (727) 377-11-11' },
    { icon: <EmailIcon />, text: 'library@narxoz.kz' },
    { icon: <ScheduleIcon />, text: 'Дүй-Жұм: 9:00 - 20:00, Сб: 10:00 - 17:00' },
  ];

  // Анимация конфигурациясы
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        pt: { xs: 6, md: 8 },
        pb: { xs: 3, md: 4 },
        background: theme.palette.mode === 'light'
          ? `linear-gradient(to bottom, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.main, 0.1)})`
          : `linear-gradient(to bottom, ${alpha('#000', 0.8)}, ${alpha('#111', 0.9)})`,
        color: theme.palette.text.primary,
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
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <Grid container spacing={4} justifyContent="space-between" alignItems="flex-start" sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SchoolIcon sx={{ fontSize: 36, mr: 1.5, color: theme.palette.primary.main }} />
                <Typography variant="h5" fontWeight="bold" component="div">
                  НАРХОЗ Кітапханасы
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mt: 1.5, opacity: 0.9 }}>
                Нархоз Университетінің студенттері мен оқытушыларына арналған электронды кітапхана жүйесі
              </Typography>

              {/* Жазылым формасы */}
              <Paper 
                component="form"
                onSubmit={handleSubscribe}
                elevation={0}
                sx={{ 
                  mt: 3,
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  backgroundColor: alpha(theme.palette.background.paper, 0.5)
                }}
              >
                <TextField
                  size="small"
                  placeholder="Жаңалықтарға жазылу"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="standard"
                  fullWidth
                  sx={{ 
                    ml: 1,
                    '& .MuiInput-underline:before': { borderBottom: 'none' },
                    '& .MuiInput-underline:after': { borderBottom: 'none' },
                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <NotificationsIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                <IconButton 
                  color="primary" 
                  type="submit" 
                  sx={{ 
                    ml: 1,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                    }
                  }}
                >
                  <SendIcon fontSize="small" />
                </IconButton>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4} sx={{ mt: { xs: 3, sm: 0 } }}>
              <Typography 
                variant="subtitle1" 
                fontWeight="bold" 
                gutterBottom
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  ...(isMobile && {
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  })
                }}
                onClick={isMobile ? () => toggleSection('navigation') : undefined}
              >
                Навигация
                {isMobile && (
                  sectionsOpen.navigation ? <ExpandLess /> : <ExpandMore />
                )}
              </Typography>
              
              <Collapse in={!isMobile || sectionsOpen.navigation}>
                <List dense disablePadding>
                  {mainLinks.map((link, index) => (
                    <ListItem 
                      key={index} 
                      disablePadding 
                      sx={{ 
                        mb: 0.5, 
                        '&:hover': {
                          background: alpha(theme.palette.primary.main, 0.05),
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
                                color: theme.palette.primary.main
                              },
                              transition: 'all 0.2s'
                            }}
                          >
                            {link.title}
                          </Link>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Grid>

            <Grid item xs={12} sm={6} md={4} sx={{ mt: { xs: 3, md: 0 } }}>
              <Typography 
                variant="subtitle1" 
                fontWeight="bold" 
                gutterBottom
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  ...(isMobile && {
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  })
                }}
                onClick={isMobile ? () => toggleSection('account') : undefined}
              >
                Жеке кабинет
                {isMobile && (
                  sectionsOpen.account ? <ExpandLess /> : <ExpandMore />
                )}
              </Typography>
              
              <Collapse in={!isMobile || sectionsOpen.account}>
                <List dense disablePadding>
                  {accountLinks.map((link, index) => (
                    <ListItem 
                      key={index} 
                      disablePadding 
                      sx={{ 
                        mb: 0.5, 
                        '&:hover': {
                          background: alpha(theme.palette.primary.main, 0.05),
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
                                color: theme.palette.primary.main
                              },
                              transition: 'all 0.2s'
                            }}
                          >
                            {link.title}
                          </Link>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Grid>
          </Grid>
        </motion.div>

        {/* Футер контентінің төменгі бөлігі */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
        >
          <Grid container spacing={4} justifyContent="space-between">
            {/* Контакты бөлімі */}
            <Grid item xs={12} md={6}>
              <Typography 
                variant="subtitle1" 
                fontWeight="bold" 
                gutterBottom
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  ...(isMobile && {
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  })
                }}
                onClick={isMobile ? () => toggleSection('contact') : undefined}
              >
                Байланыс ақпараты
                {isMobile && (
                  sectionsOpen.contact ? <ExpandLess /> : <ExpandMore />
                )}
              </Typography>
              
              <Collapse in={!isMobile || sectionsOpen.contact}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: alpha(theme.palette.background.paper, 0.5),
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  <List dense disablePadding>
                    {contactInfo.map((item, index) => (
                      <ListItem key={index} sx={{ px: 1, py: 0.75 }}>
                        <ListItemIcon sx={{ minWidth: 36, color: theme.palette.primary.main }}>
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
                  
                  {/* Карта сілтемесі */}
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
                      borderColor: alpha(theme.palette.primary.main, 0.5),
                      color: theme.palette.text.primary,
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      },
                    }}
                  >
                    Картадан көру
                  </Button>
                </Paper>
              </Collapse>
            </Grid>
            
            {/* Әлеуметтік желілер */}
            <Grid item xs={12} md={5}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Бізді әлеуметтік желілерде бақылаңыз
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: 2, 
                justifyContent: { xs: 'center', md: 'flex-start' },
                mt: 2
              }}>
                {socialLinks.map((social, index) => (
                  <Tooltip key={index} title={social.name}>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconButton
                        component="a"
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.name}
                        sx={{
                          color: 'white',
                          backgroundColor: theme.palette.primary.main,
                          '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                            transform: 'translateY(-3px)',
                            boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.4)}`
                          },
                          transition: 'all 0.2s ease-in-out',
                        }}
                      >
                        {social.icon}
                      </IconButton>
                    </motion.div>
                  </Tooltip>
                ))}
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                Бізбен байланысты жоғалтпаңыз! Әлеуметтік желілерде ең соңғы жаңалықтар, жаңа кітаптар туралы ақпарат және арнайы іс-шаралар туралы хабарландырулар.
              </Typography>
            </Grid>
          </Grid>
        </motion.div>

        {/* Бөлгіш сызық - футердің төменгі бөлігінен бөледі */}
        <Divider sx={{ my: 4, borderColor: alpha(theme.palette.divider, 0.2) }} />

        {/* Футердің төменгі бөлігі - авторлық құқық пен қосымша сілтемелер */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ opacity: 0.8, textAlign: { xs: 'center', md: 'left' } }}>
              © {currentYear} Нархоз Университеті. Барлық құқықтар қорғалған.
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
                sx={{ opacity: 0.8, '&:hover': { opacity: 1, color: theme.palette.primary.main } }}
              >
                Құпиялылық саясаты
              </Link>
              <Link
                component={RouterLink}
                to="/terms"
                color="inherit"
                variant="body2"
                sx={{ opacity: 0.8, '&:hover': { opacity: 1, color: theme.palette.primary.main } }}
              >
                Пайдалану шарттары
              </Link>
            </Box>
          </Grid>
        </Grid>
        
        {/* Кнопка прокрутки вверх - справа внизу */}
        <Tooltip title="Жоғары">
          <IconButton
            aria-label="Жоғары"
            onClick={handleScrollToTop}
            sx={{
              position: 'absolute',
              right: isSmall ? 16 : 32,
              bottom: isSmall ? 16 : 32,
              bgcolor: theme.palette.primary.main,
              color: 'white',
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
                transform: 'translateY(-4px)',
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.5)}`
              },
              boxShadow: theme.shadows[4],
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <KeyboardArrowUpIcon />
          </IconButton>
        </Tooltip>
      </Container>
      
      {/* Жазылым сәтті болды хабарламасы */}
      <Snackbar 
        open={subscribeSuccess} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          Сіз сәтті жазылдыңыз!
        </Alert>
      </Snackbar>
      
      {/* Жазылым қате болды хабарламасы */}
      <Snackbar 
        open={subscribeError} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="error" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          Жарамды электрондық пошта мекенжайын енгізіңіз
        </Alert>
      </Snackbar>
    </Box>
  );
};