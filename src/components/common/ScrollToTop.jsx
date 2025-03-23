/**
 * src/components/common/ScrollToTop.jsx
 * 
 * ScrollToTop компоненті - беттер арасындағы ауысулар кезінде
 * автоматты түрде беттің жоғарғы бөлігіне скролл жасайды.
 * 
 * Бұл компонент React Router v6-мен жұмыс істейді және 
 * беттің location.pathname өзгерген кезде іске қосылады.
 * 
 * Компонент ешқандай визуалды элементтерді көрсетпейді,
 * тек функционалдық логиканы қамтамасыз етеді.
 * 
 * @version 2.0
 * @author Нархоз Library Team
 * @returns {null} - Компонент ештеңе көрсетпейді
 */
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Fab, useScrollTrigger, Zoom, Box, Tooltip, useTheme, alpha } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';

/**
 * ScrollToTop компоненті
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {boolean} props.showButton - Жоғарыға көтерілу түймесін көрсету керек пе
 * @param {string} props.position - Түйменің орналасуы
 * @param {number} props.threshold - Түйменің көрсетілу шегі (px)
 * @param {string} props.color - Түйме түсі
 * @param {string} props.size - Түйме өлшемі
 * @param {string} props.tooltip - Түйме қалқымасы
 * @returns {JSX.Element | null} - ScrollToTop компоненті
 */
const ScrollToTop = ({
  showButton = true,
  position = 'right',
  threshold = 400,
  color = 'primary',
  size = 'medium',
  tooltip = 'Жоғарыға'
}) => {
  const { pathname, hash, search } = useLocation();
  const theme = useTheme();
  const [scrollTarget, setScrollTarget] = useState(null);
  
  // Скролл позициясын бақылау
  const trigger = useScrollTrigger({
    target: scrollTarget,
    disableHysteresis: true,
    threshold: threshold
  });

  /**
   * Location өзгерген кезде беттің жоғарғы бөлігіне скролл жасау
   */
  useEffect(() => {
    // Кеңейтілген сілтемелер (URL hash fragment) үшін тексеру жасау
    if (hash) {
      // Хэш бөлігі бар болса, оған скролл жасау
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    
    // Хэш бөлігі жоқ болса, жоғарыға скролл жасау
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
  }, [pathname, hash, search]);

  /**
   * Скролл мақсатын компонент монтаж болғанда орнату
   */
  useEffect(() => {
    setScrollTarget(window);
  }, []);

  /**
   * Жоғарыға скролл жасау функциясы
   */
  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Фокусты бірінші элементке қайтару (accessibility үшін)
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
    }
  };

  /**
   * Жоғарыға көтерілу түймесінің стилі
   */
  const getPositionStyle = () => {
    const base = {
      position: 'fixed',
      bottom: 20,
      zIndex: theme.zIndex.snackbar - 1
    };
    
    if (position === 'left') {
      return { ...base, left: 20 };
    } else if (position === 'center') {
      return { ...base, left: '50%', transform: 'translateX(-50%)' };
    } else {
      return { ...base, right: 20 };
    }
  };

  // Егер түйме қажет болмаса, ештеңе қайтармау
  if (!showButton) {
    return null;
  }

  return (
    <Zoom in={trigger}>
      <Box sx={getPositionStyle()}>
        <Tooltip title={tooltip} placement="top">
          <Fab
            color={color}
            size={size}
            aria-label={tooltip}
            onClick={handleClick}
            sx={{
              boxShadow: theme.shadows[4],
              '&:hover': {
                boxShadow: theme.shadows[8],
                transform: 'translateY(-4px)',
                bgcolor: theme.palette[color].dark
              },
              transition: 'all 0.3s ease-in-out',
              animation: trigger ? 'pulse 2s infinite' : 'none',
              '@keyframes pulse': {
                '0%': {
                  boxShadow: `0 0 0 0 ${alpha(theme.palette[color].main, 0.7)}`
                },
                '70%': {
                  boxShadow: `0 0 0 10px ${alpha(theme.palette[color].main, 0)}`
                },
                '100%': {
                  boxShadow: `0 0 0 0 ${alpha(theme.palette[color].main, 0)}`
                }
              }
            }}
          >
            <KeyboardArrowUp />
          </Fab>
        </Tooltip>
      </Box>
    </Zoom>
  );
};

export default ScrollToTop;