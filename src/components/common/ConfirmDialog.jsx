/**
 * src/components/common/ConfirmDialog.jsx
 * 
 * Растау диалогы компоненті
 * 
 * Бұл компонент пайдаланушыдан әрекетті растауды сұрауға арналған.
 * Мысалы, элементті жою, өзгерістерді сақтау немесе басқа маңызды әрекеттер үшін.
 * 
 * @version 2.0
 * @author Нархоз Library Team
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
  alpha,
  Box,
  IconButton,
  Typography,
  CircularProgress,
  Slide
} from '@mui/material';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Диалог анимациясы үшін transition компоненті
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * ConfirmDialog компоненті
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {boolean} props.open - Диалог ашық/жабық күйі
 * @param {Function} props.onClose - Диалогты жабу функциясы
 * @param {Function} props.onConfirm - Растау функциясы
 * @param {string} props.title - Диалог тақырыбы
 * @param {string|React.ReactNode} props.message - Диалог хабарламасы
 * @param {string} props.type - Диалог түрі (info, warning, error, delete, success)
 * @param {string} props.cancelText - "Болдырмау" түймесінің мәтіні
 * @param {string} props.confirmText - "Растау" түймесінің мәтіні
 * @param {boolean} props.loading - Жүктелу күйі
 * @param {boolean} props.showCancel - "Болдырмау" түймесін көрсету
 * @returns {JSX.Element} - Растау диалогы
 */
const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  type = 'info',
  cancelText = "Болдырмау",
  confirmText = "Растау",
  loading = false,
  showCancel = true
}) => {
  const theme = useTheme();

  /**
   * Диалог түріне байланысты түс, белгіше және т.б. конфигурацияларды қайтарады
   * 
   * @param {string} dialogType - Диалог түрі
   * @returns {Object} - Конфигурация объектісі
   */
  const getTypeConfig = (dialogType) => {
    switch (dialogType) {
      case 'delete':
        return {
          icon: <DeleteIcon />,
          color: theme.palette.error.main,
          bgColor: alpha(theme.palette.error.main, 0.1),
          confirmColor: 'error',
          iconColor: theme.palette.error.main
        };
      case 'warning':
        return {
          icon: <WarningIcon />,
          color: theme.palette.warning.main,
          bgColor: alpha(theme.palette.warning.main, 0.1),
          confirmColor: 'warning',
          iconColor: theme.palette.warning.main
        };
      case 'error':
        return {
          icon: <ErrorIcon />,
          color: theme.palette.error.main,
          bgColor: alpha(theme.palette.error.main, 0.1),
          confirmColor: 'error',
          iconColor: theme.palette.error.main
        };
      case 'success':
        return {
          icon: <CheckCircleIcon />,
          color: theme.palette.success.main,
          bgColor: alpha(theme.palette.success.main, 0.1),
          confirmColor: 'success',
          iconColor: theme.palette.success.main
        };
      case 'info':
      default:
        return {
          icon: <InfoIcon />,
          color: theme.palette.primary.main,
          bgColor: alpha(theme.palette.primary.main, 0.1),
          confirmColor: 'primary',
          iconColor: theme.palette.primary.main
        };
    }
  };

  // Ағымдағы типке сәйкес конфигурацияны алу
  const typeConfig = getTypeConfig(type);

  return (
    <Dialog
      open={open}
      onClose={loading ? null : onClose}
      aria-labelledby="confirm-dialog-title"
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: 3,
          padding: 0,
          overflow: 'hidden',
          boxShadow: theme.shadows[10],
          maxWidth: '450px',
          width: '100%',
          margin: { xs: 2, sm: 4 }
        }
      }}
    >
      {/* Диалог тақырыбы */}
      <DialogTitle 
        id="confirm-dialog-title" 
        sx={{ 
          pb: 1, 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: typeConfig.bgColor,
          borderBottom: `1px solid ${alpha(typeConfig.color, 0.2)}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box 
            component={motion.div}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            sx={{ 
              mr: 1.5, 
              color: typeConfig.iconColor,
              display: 'flex'
            }}
          >
            {typeConfig.icon}
          </Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        
        {!loading && showCancel && (
          <IconButton 
            size="small" 
            onClick={onClose}
            aria-label="Жабу"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1)
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </DialogTitle>

      {/* Диалог мазмұны */}
      <DialogContent sx={{ pt: 2, pb: 2, px: 3 }}>
        {typeof message === 'string' ? (
          <DialogContentText component={motion.div} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            {message}
          </DialogContentText>
        ) : (
          <Box 
            component={motion.div}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {message}
          </Box>
        )}
      </DialogContent>

      {/* Диалог түймелері */}
      <DialogActions 
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        sx={{ p: 2, pt: 1, bgcolor: alpha(theme.palette.background.paper, 0.5) }}
      >
        {showCancel && !loading && (
          <Button
            onClick={onClose}
            variant="outlined"
            color="inherit"
            sx={{
              color: 'text.secondary',
              borderColor: alpha(theme.palette.divider, 0.5),
              '&:hover': {
                backgroundColor: alpha('#000', 0.05),
                borderColor: 'text.primary',
              },
              fontWeight: 500,
              px: 2,
              py: 0.75,
              borderRadius: 1.5
            }}
          >
            {cancelText}
          </Button>
        )}
        
        <motion.div
          whileHover={loading ? {} : { scale: 1.03 }}
          whileTap={loading ? {} : { scale: 0.98 }}
        >
          <Button
            onClick={onConfirm}
            variant="contained"
            color={typeConfig.confirmColor}
            disabled={loading}
            sx={{
              fontWeight: 500,
              px: 2,
              py: 0.75,
              borderRadius: 1.5,
              minWidth: 100,
              position: 'relative',
              boxShadow: loading ? 'none' : theme.shadows[3],
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" thickness={4} />
            ) : (
              confirmText
            )}
          </Button>
        </motion.div>
      </DialogActions>
    </Dialog>
  );
};

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['info', 'warning', 'error', 'delete', 'success']),
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  loading: PropTypes.bool,
  showCancel: PropTypes.bool
};

export default ConfirmDialog;