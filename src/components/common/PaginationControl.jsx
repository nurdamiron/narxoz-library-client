/**
 * src/components/common/PaginationControl.jsx
 * 
 * Беттеу басқару компоненті
 * 
 * Бұл компонент көп беттік тізімдерді көрсету кезінде қолданылады.
 * Ол беттер арасында навигация жасауға мүмкіндік береді.
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Pagination,
  Typography,
  useMediaQuery,
  useTheme,
  Fade
} from '@mui/material';
import { motion } from 'framer-motion';

/**
 * PaginationControl компоненті
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {number} props.page - Ағымдағы бет нөмірі
 * @param {number} props.totalPages - Беттер саны
 * @param {number} props.totalItems - Элементтер саны
 * @param {Function} props.onPageChange - Бет өзгергенде шақырылатын функция
 * @param {boolean} props.showItemCount - Элементтер санын көрсету керек пе?
 * @param {string} props.itemName - Элементтің атауы (мысалы, "кітап", "элемент")
 * @param {number} props.currentItemCount - Ағымдағы беттегі элементтер саны
 * @param {Object} props.sx - Қосымша Material UI стильдері
 * @returns {JSX.Element} - Беттеу басқару компоненті
 */
const PaginationControl = ({
  page = 1,
  totalPages = 1,
  totalItems = 0,
  onPageChange,
  showItemCount = true,
  itemName = 'элемент',
  currentItemCount = 0,
  sx = {}
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Егер тек бір бет болса, пагинацияны көрсетпейміз
  if (totalPages <= 1 && totalItems <= 0) {
    return null;
  }
  
  /**
   * Элемент атауын дұрыс формада қайтарады
   * 
   * @param {number} count - Элементтер саны
   * @param {string} name - Элемент атауы
   * @returns {string} - Дұрыс формадағы атау
   */
  const getItemNameWithCount = (count, name) => {
    // Қазақ тілінің ережелеріне сәйкес
    if (name === 'кітап') {
      if (count === 1) return 'кітап';
      return 'кітап';
    }
    
    // Орыс тілінің ережелеріне сәйкес
    if (name === 'книга') {
      if (count === 1) return 'книга';
      if (count >= 2 && count <= 4) return 'книги';
      return 'книг';
    }
    
    // Басқа атаулар үшін
    return name;
  };

  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        mt: 4,
        ...sx 
      }}>
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Pagination
              page={page}
              count={totalPages}
              onChange={onPageChange}
              color="primary"
              size={isMobile ? "small" : "medium"}
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.lighter || 'rgba(213, 0, 50, 0.04)'
                  },
                },
                '& .Mui-selected': {
                  backgroundColor: `${theme.palette.primary.main} !important`,
                  color: 'white',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark
                  }
                }
              }}
            />
          </motion.div>
        )}
        
        {showItemCount && totalItems > 0 && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center" 
            sx={{ mt: 2 }}
          >
            {currentItemCount > 0 
              ? `Көрсетілген: ${currentItemCount} / ${totalItems} ${getItemNameWithCount(totalItems, itemName)}`
              : `Барлығы: ${totalItems} ${getItemNameWithCount(totalItems, itemName)}`
            }
          </Typography>
        )}
      </Box>
    </Fade>
  );
};

PaginationControl.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  totalItems: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
  showItemCount: PropTypes.bool,
  itemName: PropTypes.string,
  currentItemCount: PropTypes.number,
  sx: PropTypes.object
};

export default PaginationControl;