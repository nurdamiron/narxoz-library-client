import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import Header from '../common/Header';
import Footer from '../common/Footer';
import Sidebar from '../common/Sidebar';

/**
 * MainLayout компоненті - сайттың негізгі макеті
 * 
 * Бұл компонент бүкіл қосымшаның құрылымын анықтайды және келесі элементтерді біріктіреді:
 * - Жоғарғы панель (Header)
 * - Бүйір панелі (Sidebar)
 * - Негізгі контент аймағы (Outlet арқылы көрсетіледі)
 * - Төменгі панель (Footer)
 * 
 * Компонент экран өлшемін қадағалап, кішкентай экрандарда бүйір панельді автоматты жасырады.
 * 
 * @returns {JSX.Element} - Құрылымдық макет компоненті
 */
const MainLayout = () => {
  const theme = useTheme(); // Material UI тақырыбын алу
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Экран өлшемін тексеру (планшет/телефон)
  
  // Бүйір панелінің күйі - мобильді құрылғыларда әдепкі бойынша жабық
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  /**
   * Бүйір панелінің күйін ауыстыру (ашу/жабу)
   * 
   * Бұл функция Header компонентіндегі меню түймесін басқанда шақырылады
   */
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Жоғарғы панель - бұл компонентке бүйір панельді ашу/жабу функциясын жібереміз */}
      <Header toggleSidebar={toggleSidebar} />
      
      {/* Негізгі контент аймағы - бүйір панельмен қатар орналасады */}
      <Box sx={{ display: 'flex', flex: 1 }}>
        {/* Бүйір панелі - ашық/жабық күйі мен жабу функциясын жібереміз */}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Басты контент аймағы 
         * - Бүйір панель ашық болғанда азырақ жер алады
         * - Бүйір панель жабық болғанда бүкіл енді алады
         */}
        <Box
          component="main"
          sx={{
            flexGrow: 1, // Қалған бос орынды толтыру
            p: 3, // Жан-жағынан шегініс (padding)
            width: { sm: `calc(100% - ${sidebarOpen ? 240 : 0}px)` }, // Экран еніне байланысты ені
            ml: { sm: sidebarOpen ? '240px' : 0 }, // Бүйір панель ашық болса, сол жақ шегініс
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          {/* Контент контейнері - максималды ені шектелген және орталықтандырылған */}
          <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
            {/* Outlet - бұл жерге React Router арқылы басқа компоненттер салынады */}
            <Outlet />
          </Container>
        </Box>
      </Box>
      
      {/* Төменгі панель - бүкіл бетте тұрақты орында болады */}
      <Footer />
    </Box>
  );
};

export default MainLayout;