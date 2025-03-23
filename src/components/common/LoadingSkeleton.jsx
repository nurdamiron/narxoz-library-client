/**
 * src/components/common/LoadingSkeleton.jsx
 * 
 * Жүктелу индикаторы компоненті
 * 
 * Бұл компонент деректер жүктелу кезінде пайдаланушыға көрсетіледі.
 * Контент жүктелу кезінде "скелетон" эффектін көрсетеді.
 * 
 * @version 2.0
 * @author Нархоз Library Team
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Skeleton,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Avatar,
  Chip,
  Divider,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import { motion } from 'framer-motion';

/**
 * LoadingSkeleton компоненті
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {string} props.type - Жүктелу түрі: 'book', 'list', 'detail', 'card', 'text', 'profile'
 * @param {number} props.count - Элементтер саны
 * @param {Object} props.height - Элемент биіктігі
 * @param {Object} props.width - Элемент ені
 * @param {Object} props.sx - Қосымша Material UI стильдері
 * @returns {JSX.Element} - Жүктелу индикаторы
 */
const LoadingSkeleton = ({ 
  type = 'card', 
  count = 1, 
  height,
  width,
  sx = {} 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Скелетон түсі анимация үшін градиент жасау
  const getGradient = () => {
    const baseColor = theme.palette.mode === 'light' 
      ? alpha(theme.palette.grey[300], 0.8)
      : alpha(theme.palette.grey[900], 0.8);
    
    const highlightColor = theme.palette.mode === 'light'
      ? alpha(theme.palette.grey[100], 0.8)
      : alpha(theme.palette.grey[800], 0.8);
      
    return `linear-gradient(90deg, ${baseColor} 25%, ${highlightColor} 50%, ${baseColor} 75%)`;
  };
  
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
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };
  
  /**
   * Кітап карточкасының скелетонын көрсету
   * 
   * @returns {JSX.Element} Кітап карточкасының скелетоны
   */
  const renderBookSkeleton = () => (
    <Card 
      elevation={1}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <Skeleton 
        variant="rectangular" 
        height={200} 
        animation="wave" 
        sx={{ 
          background: getGradient(),
          backgroundSize: '200% 100%',
          animation: 'pulse 1.5s infinite ease-in-out',
          '@keyframes pulse': {
            '0%': {
              backgroundPosition: '0% 0%',
            },
            '100%': {
              backgroundPosition: '200% 0%',
            },
          },
        }}
      />
      <CardContent sx={{ flex: 1 }}>
        <Skeleton variant="text" height={28} animation="wave" />
        <Skeleton variant="text" width="60%" height={20} animation="wave" />
        <Box sx={{ mt: 2 }}>
          <Skeleton variant="rectangular" width={80} height={24} animation="wave" sx={{ borderRadius: 4 }}/>
        </Box>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
        <Skeleton variant="rectangular" width={80} height={30} animation="wave" sx={{ borderRadius: 1 }}/>
        <Skeleton variant="circular" width={24} height={24} animation="wave" />
      </CardActions>
    </Card>
  );
  
  /**
   * Тізім элементінің скелетонын көрсету
   * 
   * @returns {JSX.Element} Тізім элементінің скелетоны
   */
  const renderListSkeleton = () => (
    <Card 
      elevation={1}
      sx={{ 
        display: 'flex', 
        height: height || (isMobile ? 'auto' : 140), 
        flexDirection: isMobile ? 'column' : 'row',
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      <Skeleton 
        variant="rectangular"
        width={isMobile ? '100%' : (width || 120)}
        height={isMobile ? 140 : '100%'}
        animation="wave"
        sx={{ 
          background: getGradient(),
          backgroundSize: '200% 100%',
          animation: 'pulse 1.5s infinite ease-in-out',
          '@keyframes pulse': {
            '0%': {
              backgroundPosition: '0% 0%',
            },
            '100%': {
              backgroundPosition: '200% 0%',
            },
          },
        }}
      />
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box>
          <Skeleton variant="text" height={28} animation="wave" />
          <Skeleton variant="text" width="70%" height={20} animation="wave" />
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Skeleton variant="rectangular" width={60} height={24} animation="wave" sx={{ borderRadius: 4 }}/>
            <Skeleton variant="rectangular" width={80} height={24} animation="wave" sx={{ borderRadius: 4 }}/>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Skeleton variant="rectangular" width={100} height={30} animation="wave" sx={{ borderRadius: 1 }}/>
          <Skeleton variant="circular" width={30} height={30} animation="wave" />
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
    <Card 
      elevation={1} 
      sx={{ 
        p: 3,
        borderRadius: 2 
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Skeleton 
            variant="rectangular" 
            height={400} 
            width="100%" 
            animation="wave" 
            sx={{ 
              borderRadius: 2,
              background: getGradient(),
              backgroundSize: '200% 100%',
              animation: 'pulse 1.5s infinite ease-in-out',
              '@keyframes pulse': {
                '0%': {
                  backgroundPosition: '0% 0%',
                },
                '100%': {
                  backgroundPosition: '200% 0%',
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="text" height={40} width="70%" animation="wave" />
            <Skeleton variant="circular" width={36} height={36} animation="wave" />
          </Box>
          <Skeleton variant="text" height={30} width="40%" animation="wave" sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="rectangular" width={120} height={24} animation="wave" sx={{ mr: 1, borderRadius: 1 }}/>
            <Skeleton variant="text" height={24} width={60} animation="wave" />
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              {[1, 2, 3, 4].map((_, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <Skeleton variant="rectangular" height={60} animation="wave" sx={{ borderRadius: 1 }}/>
                </Grid>
              ))}
            </Grid>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Skeleton variant="text" height={24} width="30%" animation="wave" sx={{ mb: 1 }}/>
            <Skeleton variant="rectangular" height={120} width="100%" animation="wave" sx={{ borderRadius: 1 }}/>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Skeleton variant="rectangular" height={40} width={150} animation="wave" sx={{ borderRadius: 2 }}/>
          </Box>
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
    <Card 
      elevation={1} 
      sx={{ 
        p: 2,
        borderRadius: 2 
      }}
    >
      <Skeleton variant="text" height={32} animation="wave" />
      <Skeleton variant="text" height={24} width="80%" animation="wave" />
      <Skeleton variant="text" height={24} width="60%" animation="wave" sx={{ mb: 2 }} />
      <Skeleton 
        variant="rectangular" 
        height={height || 120} 
        animation="wave" 
        sx={{ 
          mb: 2, 
          borderRadius: 1,
          background: getGradient(),
          backgroundSize: '200% 100%',
          animation: 'pulse 1.5s infinite ease-in-out',
          '@keyframes pulse': {
            '0%': {
              backgroundPosition: '0% 0%',
            },
            '100%': {
              backgroundPosition: '200% 0%',
            },
          },
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Skeleton variant="rectangular" width={100} height={36} animation="wave" sx={{ borderRadius: 1 }}/>
      </Box>
    </Card>
  );

  /**
   * Мәтін скелетонын көрсету
   * 
   * @returns {JSX.Element} Мәтін скелетоны
   */
  const renderTextSkeleton = () => (
    <Box sx={{ width: width || '100%' }}>
      <Skeleton variant="text" height={24} animation="wave" />
      <Skeleton variant="text" height={24} width="90%" animation="wave" />
      <Skeleton variant="text" height={24} width="95%" animation="wave" />
      <Skeleton variant="text" height={24} width="80%" animation="wave" />
      <Skeleton variant="text" height={24} width="85%" animation="wave" />
    </Box>
  );

  /**
   * Профиль скелетонын көрсету
   * 
   * @returns {JSX.Element} Профиль скелетоны
   */
  const renderProfileSkeleton = () => (
    <Card 
      elevation={1} 
      sx={{ 
        p: 3,
        borderRadius: 2 
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Skeleton 
          variant="circular" 
          width={80} 
          height={80} 
          animation="wave" 
          sx={{ 
            mr: 2,
            background: getGradient(),
            backgroundSize: '200% 100%',
            animation: 'pulse 1.5s infinite ease-in-out',
            '@keyframes pulse': {
              '0%': {
                backgroundPosition: '0% 0%',
              },
              '100%': {
                backgroundPosition: '200% 0%',
              },
            },
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" height={32} width="60%" animation="wave" />
          <Skeleton variant="text" height={24} width="40%" animation="wave" />
          <Box sx={{ display: 'flex', mt: 1, gap: 1 }}>
            <Skeleton variant="rectangular" width={80} height={24} animation="wave" sx={{ borderRadius: 4 }}/>
            <Skeleton variant="rectangular" width={100} height={24} animation="wave" sx={{ borderRadius: 4 }}/>
          </Box>
        </Box>
        <Skeleton variant="rectangular" width={100} height={36} animation="wave" sx={{ borderRadius: 1 }}/>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Grid container spacing={2}>
        {[1, 2, 3, 4].map((_, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
              <Skeleton variant="text" height={20} width="30%" animation="wave" sx={{ mb: 1 }}/>
              <Skeleton variant="rectangular" height={40} animation="wave" sx={{ borderRadius: 1 }}/>
            </Box>
          </Grid>
        ))}
      </Grid>
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
      case 'text':
        return renderTextSkeleton();
      case 'profile':
        return renderProfileSkeleton();
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
  
  // Анимация для основного контейнера
  const pulseAnimation = {
    animate: {
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
  
  return (
    <motion.div 
      animate={pulseAnimation.animate}
      sx={{ ...sx }}
    >
      {renderSkeletons()}
    </motion.div>
  );
};

LoadingSkeleton.propTypes = {
  type: PropTypes.oneOf(['book', 'list', 'detail', 'card', 'text', 'profile']),
  count: PropTypes.number,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  sx: PropTypes.object
};

export default LoadingSkeleton;