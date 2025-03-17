import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop компоненті - беттер арасындағы ауысулар кезінде
 * автоматты түрде беттің жоғарғы бөлігіне скролл жасайды.
 * 
 * Бұл компонент React Router v6-мен жұмыс істейді және 
 * беттің location.pathname өзгерген кезде іске қосылады.
 * 
 * Компонент ешқандай визуалды элементтерді көрсетпейді,
 * тек функционалдық логиканы қамтамасыз етеді.
 * 
 * @returns {null} - Компонент ештеңе көрсетпейді
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  // location.pathname өзгерген кезде беттің жоғарғы бөлігіне скролл жасау
  useEffect(() => {
    // Жай скролл
    // window.scrollTo(0, 0);
    
    // Анимацияланған скролл
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    
    // Фокусты бірінші элементке қайтару (accessibility үшін)
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;