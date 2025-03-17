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
  IconButton
} from '@mui/material';
import { 
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import Header from '../common/Header';
import Footer from '../common/Footer';
import Sidebar from '../common/Sidebar';

/**
 * MainLayout компоненті - сайттың негізгі макеті
 * 
 * Бұл компонент бүкіл қосымшаның құрылымын анықтайды және келесі элементтерді біріктіреді:
 * - Жоғарғы панель (Header)
 * - Бүйір панелі (Sidebar) - только на десктопных устройствах
 * - Негізгі контент аймағы (Outlet арқылы көрсетіледі)
 * - Төменгі панель (Footer)
 */
const MainLayout = ({ darkMode, toggleDarkMode }) => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Бүйір панелінің күйі - мобильді құрылғыларда әдепкі бойынша жабық
  const [sidebarOpen, setSidebarOpen] = useState(false); // Изменено на false для всех устройств по умолчанию
  
  // Жоғары скролл түймесінің көрінуі
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Хедердің көрінуі (мобильді құрылғыларда скролл кезінде жасыру)
  const [showHeader, setShowHeader] = useState(true);
  
  // Соңғы скролл позициясы
  const [lastScrollY, setLastScrollY] = useState(0);

  /**
   * Бүйір панелінің күйін ауыстыру (ашу/жабу)
   */
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  /**
   * Беттің жоғарғы бөлігіне скролл жасау
   */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  /**
   * Скролл оқиғасын өңдеу
   */
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    
    // Жоғары скролл түймесін көрсету/жасыру
    if (currentScrollY > 400) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
    
    // Хедерді скролл бағытына байланысты көрсету/жасыру (тек мобильді құрылғыларда)
    if (isMobile) {
      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setShowHeader(false); // Төмен скролл - хедерді жасыру
      } else {
        setShowHeader(true); // Жоғары скролл - хедерді көрсету
      }
    } else {
      setShowHeader(true); // Десктопта әрқашан көрсету
    }
    
    setLastScrollY(currentScrollY);
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
   * Скролл оқиғасын тіркеу және тазалау
   */
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Жоғарғы панель - анимациясы бар (скролл кезінде жоғары/төмен) */}
      <Slide appear={false} direction="down" in={showHeader}>
        <AppBar 
          position="fixed" 
          elevation={showHeader && lastScrollY > 50 ? 4 : 0}
          sx={{
            transition: theme.transitions.create(['box-shadow'], {
              duration: theme.transitions.duration.standard,
            }),
            backgroundColor: theme.palette.primary.main,
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            {/* Мобильді меню түймесі */}
            <IconButton
              color="inherit"
              aria-label={sidebarOpen ? "close menu" : "open menu"}
              edge="start"
              onClick={toggleSidebar}
              sx={{ mr: 2 }}
            >
              {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
            
            {/* Хедер мазмұны */}
            <Header toggleSidebar={toggleSidebar} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </Toolbar>
        </AppBar>
      </Slide>
      
      {/* Негізгі контент аймағы - боковая панель теперь во временном Drawer */}
      <Box sx={{ display: 'flex', flex: 1 }}>
        {/* Бүйір панелі - только через Drawer */}
        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 240,
              borderRadius: { xs: 0, sm: '0 16px 16px 0' } 
            },
          }}
        >
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </Drawer>
        
        {/* Басты контент аймағы - всегда на полной ширине */}
        <Box
          component="main"
          id="main-content"
          tabIndex={-1}
          sx={{
            flexGrow: 1,
            width: '100%',
            pt: { xs: 7, sm: 8 }, // Toolbar биіктігіне байланысты жоғарғы шегініс
          }}
        >
          {/* Контент контейнері - адаптивные отступы */}
          <Container 
            maxWidth="lg" 
            sx={{ 
              pt: { xs: 2, sm: 3, md: 4 }, 
              pb: { xs: 4, sm: 5, md: 6 },
              px: isSmall ? 1 : 2, // Кішкентай экранда padding азырақ
              minHeight: 'calc(100vh - 200px)', // Минимальная высота для контента
            }}
          >
            {/* Outlet - бұл жерге React Router арқылы басқа компоненттер салынады */}
            <Outlet />
          </Container>
        </Box>
      </Box>
      
      {/* Төменгі панель - бүкіл бетте тұрақты орында болады */}
      <Footer />
      
      {/* Жоғары скролл түймесі - беттің төменгі жағында орналасқан */}
      <Zoom in={showScrollTop}>
        <Fab 
          color="primary" 
          size="small" 
          aria-label="scroll back to top"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            right: isSmall ? 16 : 32,
            bottom: isSmall ? 16 : 32,
            zIndex: 1000,
            boxShadow: theme.shadows[3],
            '&:hover': {
              boxShadow: theme.shadows[6],
            }
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>
    </Box>
  );
};

export default MainLayout;