/**
 * src/components/common/AlertDialog.jsx
 * 
 * Хабарлама диалог компоненті
 * 
 * Бұл компонент түрлі хабарламалар мен растауларды көрсетуге арналған.
 * Ол әртүрлі түрдегі хабарламаларды қолдайды: ақпараттық, ескерту, қате, сәтті.
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  useTheme,
  alpha,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

/**
 * AlertDialog компоненті
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {boolean} props.open - Диалог ашық/жабық күйі
 * @param {Function} props.onClose - Диалогты жабу функциясы
 * @param {string} props.title - Диалог тақырыбы
 * @param {string|React.ReactNode} props.content - Диалог мазмұны
 * @param {string} props.type - Диалог түрі (info, warning, error, success)
 * @param {string} props.confirmText - Растау түймесінің мәтіні
 * @param {string} props.cancelText - Болдырмау түймесінің мәтіні
 * @param {Function} props.onConfirm - Растау түймесін басқанда шақырылатын функция
 * @param {boolean} props.closeOnConfirm - Растаудан кейін диалогты жабу керек пе?
 * @param {boolean} props.loading - Жүктелу индикаторын көрсету
 * @param {boolean} props.fullWidth - Толық енді қолдану
 * @param {string} props.maxWidth - Максималды ені (xs, sm, md, lg, xl)
 * @returns {JSX.Element} - Диалог компоненті
 */
const AlertDialog = ({
  open,
  onClose,
  title,
  content,
  type = 'info',
  confirmText = 'OK',
  cancelText = 'Болдырмау',
  onConfirm,
  closeOnConfirm = true,
  loading = false,
  fullWidth = true,
  maxWidth = 'sm'
}) => {
  const theme = useTheme();
  
  /**
   * Диалог түріне байланысты түс пен белгішені анықтау
   * 
   * @param {string} dialogType - Диалог түрі
   * @returns {Object} - Түс және белгіше
   */
  const getTypeConfig = (dialogType) => {
    switch (dialogType) {
      case 'warning':
        return {
          color: theme.palette.warning.main,
          icon: <WarningIcon fontSize="large" />
        };
      case 'error':
        return {
          color: theme.palette.error.main,
          icon: <ErrorIcon fontSize="large" />
        };
      case 'success':
        return {
          color: theme.palette.success.main,
          icon: <SuccessIcon fontSize="large" />
        };
      case 'info':
      default:
        return {
          color: theme.palette.info.main,
          icon: <InfoIcon fontSize="large" />
        };
    }
  };
  
  const typeConfig = getTypeConfig(type);
  
  /**
   * Растау түймесін басу оқиғасын өңдеу
   */
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    
    if (closeOnConfirm && !loading) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? null : onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      {/* Диалог тақырыбы */}
      <DialogTitle 
        id="alert-dialog-title"
        sx={{ 
          pt: 2,
          backgroundColor: alpha(typeConfig.color, 0.05),
          color: 'text.primary',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box 
            sx={{ 
              mr: 1.5, 
              color: typeConfig.color,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {typeConfig.icon}
          </Box>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Box>
        
        {!loading && (
          <IconButton
            edge="end"
            onClick={onClose}
            aria-label="close"
            size="small"
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      
      {/* Диалог мазмұны */}
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        {typeof content === 'string' ? (
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        ) : (
          <Box>{content}</Box>
        )}
      </DialogContent>
      
      {/* Диалог түймелері */}
      <DialogActions sx={{ px: 3, pb: 2 }}>
        {onClose && cancelText && !loading && (
          <Button 
            onClick={onClose} 
            color="inherit"
            variant="text"
          >
            {cancelText}
          </Button>
        )}
        
        <motion.div
          whileHover={{ scale: loading ? 1 : 1.03 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          <Button
            onClick={handleConfirm}
            color={type === 'info' ? 'primary' : type}
            variant="contained"
            disabled={loading}
            sx={{ 
              minWidth: 100,
              borderRadius: 1.5
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              confirmText
            )}
          </Button>
        </motion.div>
      </DialogActions>
    </Dialog>
  );
};

AlertDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['info', 'warning', 'error', 'success']),
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  onConfirm: PropTypes.func,
  closeOnConfirm: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl'])
};

export default AlertDialog;