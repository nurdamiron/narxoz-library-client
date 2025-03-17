import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
  alpha,
} from '@mui/material';

/**
 * ConfirmDialog component for confirmation dialogs
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function to handle close
 * @param {Function} props.onConfirm - Function to handle confirmation
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Dialog message
 * @param {string} [props.cancelText="Отмена"] - Text for cancel button
 * @param {string} [props.confirmText="Подтвердить"] - Text for confirm button
 */
const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  cancelText = "Отмена",
  confirmText = "Подтвердить",
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-dialog-title"
      PaperProps={{
        sx: {
          borderRadius: 3,
          padding: 1,
        }
      }}
    >
      <DialogTitle id="confirm-dialog-title" sx={{ pb: 1 }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button 
          onClick={onClose}
          sx={{ 
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: alpha('#000', 0.05),
            },
          }}
        >
          {cancelText}
        </Button>
        <Button 
          onClick={onConfirm}
          variant="contained" 
          sx={{ 
            bgcolor: '#d50032',
            '&:hover': {
              bgcolor: alpha('#d50032', 0.9),
            },
          }}
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;