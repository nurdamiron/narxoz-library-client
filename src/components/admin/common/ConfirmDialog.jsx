import React from 'react';
import { 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle,
  Button,
  Typography,
  Box,
  useTheme
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useTranslation } from 'react-i18next';

/**
 * Компонент диалога подтверждения действия
 *
 * @param {Object} props - Свойства компонента
 * @param {boolean} props.open - Флаг открытия диалога
 * @param {Function} props.onClose - Функция закрытия диалога
 * @param {Function} props.onConfirm - Функция подтверждения действия
 * @param {string} props.title - Заголовок диалога
 * @param {string} props.message - Сообщение диалога
 * @param {string} props.confirmButtonText - Текст кнопки подтверждения
 * @param {string} props.cancelButtonText - Текст кнопки отмены
 * @param {string} props.type - Тип диалога (delete, confirm, info)
 */
const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText,
  cancelButtonText,
  type = 'confirm'
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  
  // Используем значения из переводов, если не указаны явно
  const dialogTitle = title || t('common.confirm');
  const dialogMessage = message || t('common.confirmMessage', 'Вы уверены, что хотите продолжить?');
  const confirmText = confirmButtonText || t('common.confirm');
  const cancelText = cancelButtonText || t('common.cancel');
  
  // Определение иконки и цвета в зависимости от типа диалога
  const getDialogSettings = () => {
    switch (type) {
      case 'delete':
        return {
          icon: <ErrorOutlineIcon fontSize="large" color="error" />,
          color: theme.palette.error.main,
          confirmButtonColor: 'error'
        };
      case 'info':
        return {
          icon: <HelpOutlineIcon fontSize="large" color="info" />,
          color: theme.palette.info.main,
          confirmButtonColor: 'info'
        };
      case 'success':
        return {
          icon: <CheckCircleOutlineIcon fontSize="large" color="success" />,
          color: theme.palette.success.main,
          confirmButtonColor: 'success'
        };
      default:
        return {
          icon: <HelpOutlineIcon fontSize="large" color="primary" />,
          color: theme.palette.primary.main,
          confirmButtonColor: 'primary'
        };
    }
  };
  
  const { icon, color, confirmButtonColor } = getDialogSettings();
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          width: '100%',
          maxWidth: 500
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Box sx={{ mr: 1, color }}>
          {icon}
        </Box>
        <Typography variant="h6">{dialogTitle}</Typography>
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2 }}>
        <DialogContentText>
          {dialogMessage}
        </DialogContentText>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined">
          {cancelText}
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color={confirmButtonColor}
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;