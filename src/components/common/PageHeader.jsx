/**
 * src/components/common/PageHeader.jsx
 * 
 * Бет тақырыбы компоненті
 * 
 * Бұл компонент әр беттің жоғарғы бөлігінде орналасып, бет туралы негізгі ақпаратты көрсетеді:
 * - Бет тақырыбы
 * - Қысқаша сипаттама
 * - Бэджиктер/чиптер
 * - Қосымша әрекеттер (түймелер)
 * - Нан қиқымдары (breadcrumbs)
 * 
 * @version 1.0
 * @author Нархоз Library Team
 */
import React from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Typography, 
  Breadcrumbs, 
  Link, 
  Chip, 
  Divider, 
  Paper,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Home as HomeIcon, NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

/**
 * PageHeader компоненті
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {string} props.title - Бет тақырыбы (міндетті)
 * @param {string} props.description - Бет сипаттамасы
 * @param {Array} props.breadcrumbs - Нан қиқымдары массиві
 * @param {Array} props.chips - Чиптер массиві
 * @param {React.ReactNode} props.actions - Әрекеттер (түймелер)
 * @param {Object} props.sx - Қосымша стильдер
 * @param {boolean} props.elevated - Көтеріңкі эффект қолдану
 * @param {boolean} props.divider - Бөлгіш сызық көрсету
 * @param {React.ReactNode} props.startAdornment - Басында көрсетілетін элемент
 * @param {React.ReactNode} props.endAdornment - Соңында көрсетілетін элемент
 * @param {React.ReactNode} props.icon - Тақырып қасында көрсетілетін белгіше
 * @returns {JSX.Element} - PageHeader компоненті
 */
const PageHeader = ({
  title,
  description,
  breadcrumbs = [],
  chips = [],
  actions,
  sx = {},
  elevated = false,
  divider = true,
  startAdornment,
  endAdornment,
  icon
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Анимация variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const childVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Нан қиқымдары (breadcrumbs) компоненті
  const renderBreadcrumbs = () => {
    if (breadcrumbs.length === 0) return null;
    
    return (
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 2 }}
      >
        {/* Басты бет әрқашан бірінші элемент */}
        <Link 
          component={RouterLink} 
          to="/" 
          color="inherit"
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            '&:hover': {
              color: theme.palette.primary.main
            }
          }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
          Басты бет
        </Link>
        
        {/* Қалған нан қиқымдар элементтерін көрсету */}
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          // Соңғы элемент - сілтеме емес, тек мәтін
          if (isLast) {
            return (
              <Typography key={index} color="text.primary" sx={{ fontWeight: 'medium' }}>
                {crumb.label}
              </Typography>
            );
          }
          
          // Аралық элементтер - сілтеме
          return (
            <Link
              key={index}
              component={RouterLink}
              to={crumb.path}
              color="inherit"
              sx={{ 
                '&:hover': {
                  color: theme.palette.primary.main
                }
              }}
            >
              {crumb.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    );
  };
  
  // Чиптер (chips) компонентін көрсету
  const renderChips = () => {
    if (chips.length === 0) return null;
    
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 1,
          mb: description ? 2 : 0
        }}
      >
        {chips.map((chip, index) => (
          <Chip
            key={index}
            label={chip.label}
            icon={chip.icon}
            color={chip.color || 'default'}
            variant={chip.variant || 'outlined'}
            size={chip.size || 'small'}
            onClick={chip.onClick}
            sx={{
              ...chip.sx,
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: chip.onClick ? 'translateY(-2px)' : 'none',
                boxShadow: chip.onClick ? theme.shadows[2] : 'none',
                ...chip.sx?.['&:hover']
              }
            }}
          />
        ))}
      </Box>
    );
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Paper 
        elevation={elevated ? 1 : 0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 3,
          borderRadius: 2,
          backgroundImage: elevated ? 'none' : 'unset',
          backgroundColor: elevated 
            ? (theme.palette.mode === 'light' ? 'white' : alpha(theme.palette.background.paper, 0.8))
            : 'transparent',
          ...sx
        }}
      >
        {/* Нан қиқымдары */}
        {renderBreadcrumbs()}
        
        {/* Контент жоғарғы бөлігі */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: isTablet ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isTablet ? 'flex-start' : 'center',
            flexWrap: 'wrap',
            mb: 2
          }}
        >
          {/* Сол жақ бөлік - тақырып, сипаттама және т.б. */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {startAdornment && (
              <motion.div variants={childVariants}>
                {startAdornment}
              </motion.div>
            )}
            
            {/* Тақырып */}
            <motion.div variants={childVariants}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {icon && (
                  <Box 
                    sx={{ 
                      mr: 1.5, 
                      color: theme.palette.primary.main,
                      display: 'flex'
                    }}
                  >
                    {icon}
                  </Box>
                )}
                <Typography 
                  variant={isMobile ? 'h5' : 'h4'} 
                  component="h1" 
                  gutterBottom={false}
                  sx={{ 
                    fontWeight: 'bold',
                    color: theme.palette.text.primary,
                    lineHeight: 1.2
                  }}
                >
                  {title}
                </Typography>
              </Box>
            </motion.div>
            
            {/* Сипаттама */}
            {description && (
              <motion.div variants={childVariants}>
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  gutterBottom={Boolean(chips.length) || Boolean(actions)}
                  sx={{ 
                    mb: chips.length ? 2 : 0
                  }}
                >
                  {description}
                </Typography>
              </motion.div>
            )}
            
            {/* Чиптер (tags, badges) */}
            <motion.div variants={childVariants}>
              {renderChips()}
            </motion.div>
          </Box>
          
          {/* Оң жақ бөлік - қосымша әрекеттер */}
          {actions && (
            <Box
              sx={{
                display: 'flex',
                mt: isTablet ? 2 : 0,
                alignItems: 'center',
                gap: 1,
                flexWrap: 'wrap',
                justifyContent: isTablet ? 'flex-start' : 'flex-end',
                width: isTablet ? '100%' : 'auto'
              }}
            >
              <motion.div 
                variants={childVariants}
                style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}
              >
                {actions}
              </motion.div>
            </Box>
          )}
          
          {/* Қосымша элемент */}
          {endAdornment && (
            <motion.div variants={childVariants}>
              {endAdornment}
            </motion.div>
          )}
        </Box>
        
        {/* Бөлгіш сызық */}
        {divider && (
          <Divider sx={{ 
            borderColor: alpha(theme.palette.divider, 0.6),
            opacity: elevated ? 1 : 0.6
          }} />
        )}
      </Paper>
    </motion.div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string
    })
  ),
  chips: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
      color: PropTypes.string,
      variant: PropTypes.oneOf(['filled', 'outlined']),
      size: PropTypes.oneOf(['small', 'medium']),
      onClick: PropTypes.func,
      sx: PropTypes.object
    })
  ),
  actions: PropTypes.node,
  sx: PropTypes.object,
  elevated: PropTypes.bool,
  divider: PropTypes.bool,
  startAdornment: PropTypes.node,
  endAdornment: PropTypes.node,
  icon: PropTypes.node
};

export default PageHeader;