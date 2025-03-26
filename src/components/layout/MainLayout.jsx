/**
 * src/components/layout/MainLayout.jsx
 * 
 * MainLayout компоненті - сайттың негізгі макеті
 * 
 * Бұл компонент бүкіл қосымшаның құрылымын анықтайды және келесі элементтерді біріктіреді:
 * - Жоғарғы панель (Header)
 * - Бүйір панелі (Sidebar) - только на десктопных устройствах
 * - Негізгі контент аймағы (Outlet арқылы көрсетіледі)
 * - Төменгі панель (Footer)
 * 
 * @version 2.0
 * @author Нархоз Library Team
 */
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { 
  Box, 
  Container, 
  useMediaQuery, 
  useTheme, 
  Drawer, 
  Fab, 
  Zoom, 
  Slide, 
  AppBar, 
  Toolbar,
  IconButton,
  useScrollTrigger,
  CssBaseline,
  alpha
} from '@mui/material';
import { 
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

import Header from '../common/Header';
import Footer from '../common/Footer';
import Sidebar from '../common/Sidebar';
import ScrollToTop from '../common/ScrollToTop';

/**
 * Скролл позициясын бақылау функциясы
 * AppBar жасыру/көрсету үшін қолданылады
 * 
 * @param {Object} props - Свойства
 * @returns {boolean} - Скролл триггерінің күйі
 */
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    threshold: 100, // Скроллдан кейін жасыру
    disableHysteresis: false // Скролл бағытын өзгерткенде жылдам әрекет етпеу
  });
  
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

/**
 * MainLayout компоненті
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {boolean} props.darkMode - Қараңғы режим күйі
 * @param {Function} props.toggleDarkMode - Қараңғы режим күйін ауыстыру функциясы
 * @returns {JSX.Element} - MainLayout компоненті
 */
const MainLayout = ({ darkMode, toggleDarkMode }) => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Бүйір панелінің күйі - мобильді құрылғыларда әдепкі бойынша жабық
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  // Жоғары скролл түймесінің көрінуі
  const showScrollTop = useScrollTrigger({
    disableHysteresis: true,
    threshold: 400
  });
  
  /**
   * Бүйір панелінің күйін ауыстыру (ашу/жабу)
   */
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  /**
   * URL өзгергенде бүйір панелін мобильді құрылғыларда жабу
   */
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  /**
   * Экран өлшемі өзгергенде бүйір панелінің күйін жаңарту
   */
  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  // Анимация конфигурациясы
  const pageTransitionVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* ScrollToTop компоненті - URL өзгергенде беттің үстіне скролл жасайды */}
      <ScrollToTop />
      
      {/* Жоғарғы панель - анимациясы бар (скролл кезінде жоғары/төмен) */}
      <HideOnScroll>
        <AppBar 
          position="fixed" 
          elevation={0}
          sx={{
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: theme.palette.primary.main,
            backgroundImage: `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
            borderBottom: `1px solid ${alpha(theme.palette.primary.dark, 0.1)}`
          }}
        >
          <Toolbar sx={{ minHeight: { xs: 64, sm: 70 } }}>
            {/* Мобильді меню түймесі */}
            <IconButton
              color="inherit"
              aria-label={sidebarOpen ? "close menu" : "open menu"}
              edge="start"
              onClick={toggleSidebar}
              sx={{ 
                mr: 2,
                ...(sidebarOpen && !isMobile && { display: 'none' })
              }}
            >
              {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
            
            {/* Хедер мазмұны */}
            <Header 
              toggleSidebar={toggleSidebar} 
              darkMode={darkMode} 
              toggleDarkMode={toggleDarkMode} 
            />
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      
      {/* Toolbar placeholder */}
      <Toolbar sx={{ minHeight: { xs: 64, sm: 70 } }} />
      
      {/* Негізгі контент аймағы */}
      <Box sx={{ display: 'flex', flex: 1 }}>
        {/* Бүйір панелі */}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Басты контент аймағы */}
        <Box
          component="main"
          id="main-content"
          tabIndex={-1}
          sx={{
            flexGrow: 1,
            width: '100%',
            transition: theme.transitions.create(['margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            ...(sidebarOpen && !isMobile && {
              transition: theme.transitions.create(['margin'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
              }),
              marginLeft: 0,
            }),
          }}
        >
          {/* Контент контейнері - адаптивты шегіністер */}
          <Container 
            maxWidth="lg" 
            component={motion.div}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransitionVariants}
            sx={{ 
              pt: { xs: 2, sm: 3, md: 4 }, 
              pb: { xs: 4, sm: 5, md: 6 },
              px: isSmall ? 2 : 3,
              minHeight: 'calc(100vh - 200px)', // Минимальная высота для контента
            }}
          >
            {/* Outlet - бұл жерге React Router арқылы басқа компоненттер салынады */}
            <AnimatePresence mode="wait">
              <Box
                key={location.pathname}
                component={motion.div}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageTransitionVariants}
              >
                <Outlet />
              </Box>
            </AnimatePresence>
          </Container>
        </Box>
      </Box>
      
      {/* Төменгі панель - бүкіл бетте тұрақты орында болады */}
      <Footer />
    </Box>
  );
};

export default MainLayout;