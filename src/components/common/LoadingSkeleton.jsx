/**
 * src/components/common/LoadingSkeleton.jsx
 * 
 * Жүктелу индикаторы компоненті
 * 
 * Бұл компонент деректер жүктелу кезінде пайдаланушыға көрсетіледі.
 * Контент жүктелу кезінде "скелетон" эффектін көрсетеді.
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Skeleton,
  Card,
  CardContent,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { motion } from 'framer-motion';

/**
 * LoadingSkeleton компоненті
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {string} props.type - Жүктелу түрі: 'book', 'list', 'detail', 'card'
 * @param {number} props.count - Элементтер саны
 * @param {Object} props.sx - Қосымша Material UI стильдері
 * @returns {JSX.Element} - Жүктелу индикаторы
 */
const LoadingSkeleton = ({ type = 'card', count = 1, sx = {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Анимация параметрлері
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };
  
  /**
   * Кітап карточкасының скелетонын көрсету
   * 
   * @returns {JSX.Element} Кітап карточкасының скелетоны
   */
  const renderBookSkeleton = () => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Skeleton variant="rectangular" height={200} animation="wave" />
      <CardContent>
        <Skeleton variant="text" height={32} animation="wave" />
        <Skeleton variant="text" width="60%" height={24} animation="wave" />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="text" width="40%" height={24} animation="wave" />
          <Skeleton variant="circular" width={24} height={24} animation="wave" />
        </Box>
      </CardContent>
    </Card>
  );
  
  /**
   * Тізім элементінің скелетонын көрсету
   * 
   * @returns {JSX.Element} Тізім элементінің скелетоны
   */
  const renderListSkeleton = () => (
    <Card sx={{ display: 'flex', height: isMobile ? 'auto' : 140, flexDirection: isMobile ? 'column' : 'row' }}>
      <Skeleton 
        variant="rectangular"
        width={isMobile ? '100%' : 100}
        height={isMobile ? 140 : '100%'}
        animation="wave"
      />
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box>
          <Skeleton variant="text" height={28} animation="wave" />
          <Skeleton variant="text" width="70%" height={20} animation="wave" />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Skeleton variant="text" width="30%" height={24} animation="wave" />
          <Skeleton variant="text" width="20%" height={24} animation="wave" />
        </Box>
      </CardContent>
    </Card>
  );
  
  /**
   * Толық мәліметтер скелетонын көрсету
   * 
   * @returns {JSX.Element} Толық мәліметтер скелетоны
   */
  const renderDetailSkeleton = () => (
    <Card sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Skeleton variant="rectangular" height={400} width="100%" animation="wave" sx={{ borderRadius: 2 }} />
        </Grid>
        <Grid item xs={12} md={8}>
          <Skeleton variant="text" height={60} width="80%" animation="wave" />
          <Skeleton variant="text" height={30} width="60%" sx={{ mb: 2 }} animation="wave" />
          <Skeleton variant="text" height={24} width="40%" sx={{ mb: 1 }} animation="wave" />
          <Skeleton variant="text" height={24} width="30%" sx={{ mb: 2 }} animation="wave" />
          <Skeleton variant="rectangular" height={200} width="100%" sx={{ mb: 2 }} animation="wave" />
          <Skeleton variant="rectangular" height={50} width={150} animation="wave" />
        </Grid>
      </Grid>
    </Card>
  );
  
  /**
   * Жалпы карточка скелетонын көрсету
   * 
   * @returns {JSX.Element} Жалпы карточка скелетоны
   */
  const renderCardSkeleton = () => (
    <Card sx={{ p: 2 }}>
      <Skeleton variant="text" height={32} animation="wave" />
      <Skeleton variant="text" height={24} width="80%" animation="wave" />
      <Skeleton variant="text" height={24} width="60%" animation="wave" sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={120} animation="wave" sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Skeleton variant="rectangular" width={100} height={36} animation="wave" />
      </Box>
    </Card>
  );
  
  /**
   * Скелетон түріне байланысты тиісті компонентті таңдау
   * 
   * @param {string} skeletonType - Скелетон түрі
   * @returns {JSX.Element} Таңдалған скелетон
   */
  const renderSkeletonByType = (skeletonType) => {
    switch (skeletonType) {
      case 'book':
        return renderBookSkeleton();
      case 'list':
        return renderListSkeleton();
      case 'detail':
        return renderDetailSkeleton();
      case 'card':
      default:
        return renderCardSkeleton();
    }
  };
  
  /**
   * Бірнеше скелетонды Grid контейнерінде көрсету
   * 
   * @returns {JSX.Element} Скелетон элементтері Grid-де
   */
  const renderSkeletons = () => {
    if (count === 1) {
      return renderSkeletonByType(type);
    }
    
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={2}>
          {Array.from(new Array(count)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <motion.div variants={itemVariants}>
                {renderSkeletonByType(type)}
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    );
  };
  
  return (
    <Box sx={{ ...sx }}>
      {renderSkeletons()}
    </Box>
  );
};

LoadingSkeleton.propTypes = {
  type: PropTypes.oneOf(['book', 'list', 'detail', 'card']),
  count: PropTypes.number,
  sx: PropTypes.object
};

export default LoadingSkeleton;