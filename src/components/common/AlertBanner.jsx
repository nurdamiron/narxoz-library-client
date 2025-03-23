/**
 * src/components/common/AlertBanner.jsx
 * 
 * Хабарландыру баннері компоненті
 * 
 * Бұл компонент маңызды хабарламаларды немесе ескертулерді көрсетуге арналған.
 * Ол әртүрлі түстермен және иконкалармен жабдықталған, сонымен қатар жабу мүмкіндігі бар.
 * 
 * @version 1.0
 * @author Нархоз Library Team
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Collapse,
  useTheme,
  alpha
} from '@mui/material';
import {
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AlertBanner компоненті
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {string} props.severity - Хабарламаның маңыздылық деңгейі (info, warning, error, success)
 * @param {string} props.title - Хабарлама тақырыбы
 * @param {string|React.ReactNode} props.message - Хабарлама мәтіні
 * @param {string} props.action - Әрекет түймесінің мәтіні
 * @param {Function} props.onActionClick - Әрекет түймесіне басқанда шақырылатын функция
 * @param {boolean} props.closable - Хабарламаны жабу мүмкіндігі
 * @param {Function} props.onClose - Хабарламаны жапқанда шақырылатын функция
 * @param {Object} props.sx - Қосымша стильдер
 * @param {boolean} props.showIcon - Иконканы көрсету
 * @param {boolean} props.bordered - Шекарасы бар ма
 * @param {boolean} props.elevated - Көтеріңкі эффект қолдану
 * @returns {JSX.Element|null} - AlertBanner компоненті
 */
const AlertBanner = ({
  severity = 'info',
  title,
  message,
  action,
  onActionClick,
  closable = true,
  onClose,
  sx = {},
  showIcon = true,
  bordered = false,
  elevated = false
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);

  /**
   * Маңыздылық деңгейіне байланысты түс пен белгішені анықтау
   * 
   * @param {string} type - Маңыздылық деңгейі
   * @returns {Object} - Түс және белгіше
   */
  const getSeverityConfig = (type) => {
    switch (type) {
      case 'warning':
        return {
          icon: <WarningIcon />,
          color: theme.palette.warning.main,
          lightColor: alpha(theme.palette.warning.main, 0.1),
          darkColor: theme.palette.warning.dark,
          textColor: theme.palette.warning.contrastText
        };
      case 'error':
        return {
          icon: <ErrorIcon />,
          color: theme.palette.error.main,
          lightColor: alpha(theme.palette.error.main, 0.1),
          darkColor: theme.palette.error.dark,
          textColor: theme.palette.error.contrastText
        };
      case 'success':
        return {
          icon: <SuccessIcon />,
          color: theme.palette.success.main,
          lightColor: alpha(theme.palette.success.main, 0.1),
          darkColor: theme.palette.success.dark,
          textColor: theme.palette.success.contrastText
        };
      case 'info':
      default:
        return {
          icon: <InfoIcon />,
          color: theme.palette.primary.main,
          lightColor: alpha(theme.palette.primary.main, 0.1),
          darkColor: theme.palette.primary.dark,
          textColor: theme.palette.primary.contrastText
        };
    }
  };

  const config = getSeverityConfig(severity);

  /**
   * Хабарламаны жабу
   */
  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
  };

  /**
   * Әрекет батырмасын басқанда
   */
  const handleActionClick = () => {
    if (onActionClick) {
      onActionClick();
    }
  };

  // Жабылған хабарламаны көрсетпеу
  if (!open) return null;

  // Анимация параметрлері
  const variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } }
  };

  return (
    <AnimatePresence>
      <Collapse in={open}>
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
        >
          <Paper
            elevation={elevated ? 2 : 0}
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'flex-start',
              p: 2,
              mb: 3,
              overflow: 'hidden',
              backgroundColor: config.lightColor,
              borderRadius: 2,
              ...(bordered && {
                borderLeft: `4px solid ${config.color}`,
              }),
              ...sx
            }}
          >
            {/* Белгіше */}
            {showIcon && (
              <Box
                sx={{
                  mr: 2,
                  mt: 0.5,
                  color: config.color,
                  display: 'flex'
                }}
              >
                {config.icon}
              </Box>
            )}

            {/* Мазмұны */}
            <Box sx={{ flex: 1 }}>
              {/* Тақырып */}
              {title && (
                <Typography
                  variant="subtitle1"
                  component="div"
                  sx={{
                    fontWeight: 'bold',
                    color: config.darkColor,
                    mb: 0.5
                  }}
                >
                  {title}
                </Typography>
              )}

              {/* Хабарлама */}
              {typeof message === 'string' ? (
                <Typography variant="body2" color="text.secondary">
                  {message}
                </Typography>
              ) : (
                message
              )}

              {/* Әрекет түймесі */}
              {action && (
                <Button
                  size="small"
                  color={severity}
                  onClick={handleActionClick}
                  sx={{
                    mt: 1.5,
                    fontWeight: 'medium',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: alpha(config.color, 0.1),
                    }
                  }}
                >
                  {action}
                </Button>
              )}
            </Box>

            {/* Жабу түймесі */}
            {closable && (
              <IconButton
                size="small"
                aria-label="close"
                onClick={handleClose}
                sx={{
                  color: alpha(theme.palette.text.primary, 0.6),
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  '&:hover': {
                    color: theme.palette.text.primary,
                    backgroundColor: alpha(theme.palette.text.primary, 0.1),
                  }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Paper>
        </motion.div>
      </Collapse>
    </AnimatePresence>
  );
};

AlertBanner.propTypes = {
  severity: PropTypes.oneOf(['info', 'warning', 'error', 'success']),
  title: PropTypes.string,
  message: PropTypes.node.isRequired,
  action: PropTypes.string,
  onActionClick: PropTypes.func,
  closable: PropTypes.bool,
  onClose: PropTypes.func,
  sx: PropTypes.object,
  showIcon: PropTypes.bool,
  bordered: PropTypes.bool,
  elevated: PropTypes.bool
};

export default AlertBanner;