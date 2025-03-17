import React from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

/**
 * ProfileEditForm component for editing user profile information
 * 
 * @param {Object} props - Component props
 * @param {Object} props.userData - User data to edit
 * @param {Function} props.onDataChange - Function to handle data changes
 * @param {Function} props.onSave - Function to handle save
 * @param {Function} props.onCancel - Function to handle cancel
 * @param {boolean} props.editMode - Whether the form is in edit mode
 */
const ProfileEditForm = ({ userData, onDataChange, onSave, onCancel, editMode }) => {
  const theme = useTheme();

  /**
   * Handle input change
   * 
   * @param {Event} e - Event object
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onDataChange(name, value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Информация о пользователе
      </Typography>
      
      <Grid container spacing={2}>
        {/* Аты-жөні өрісі */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            margin="normal"
            label="ФИО"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            disabled={!editMode} // Өңдеу режимінде ғана өзгертуге болады
            variant="outlined"
            sx={{
              '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#d50032',
              },
            }}
          />
        </Grid>
        
        {/* Email өрісі */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            disabled={!editMode}
            variant="outlined"
            sx={{
              '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#d50032',
              },
            }}
          />
        </Grid>
        
        {/* Телефон өрісі */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            margin="normal"
            label="Телефон"
            name="phone"
            value={userData.phone}
            onChange={handleInputChange}
            disabled={!editMode}
            variant="outlined"
            sx={{
              '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#d50032',
              },
            }}
          />
        </Grid>
        
        {/* Факультет өрісі */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            margin="normal"
            label="Факультет"
            name="faculty"
            value={userData.faculty}
            onChange={handleInputChange}
            disabled={!editMode}
            variant="outlined"
            sx={{
              '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#d50032',
              },
            }}
          />
        </Grid>
        
        {/* Мамандық өрісі */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            margin="normal"
            label="Специализация"
            name="specialization"
            value={userData.specialization}
            onChange={handleInputChange}
            disabled={!editMode}
            variant="outlined"
            sx={{
              '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#d50032',
              },
            }}
          />
        </Grid>
        
        {/* Студенттік ID өрісі */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            margin="normal"
            label="Студенческий ID"
            name="studentId"
            value={userData.studentId}
            onChange={handleInputChange}
            disabled={true} // ID өзгертуге болмайды
            variant="outlined"
          />
        </Grid>
        
        {/* Курс өрісі */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            margin="normal"
            label="Курс"
            name="year"
            value={userData.year}
            onChange={handleInputChange}
            disabled={!editMode}
            variant="outlined"
            sx={{
              '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#d50032',
              },
            }}
          />
        </Grid>
      </Grid>
      
      {/* Өңдеу режимінде көрсетілетін түймелер */}
      {editMode && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 4,
            gap: 2,
          }}
        >
          {/* Бас тарту түймесі */}
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={onCancel}
            sx={{ 
              borderRadius: 2,
            }}
          >
            Отмена
          </Button>
          {/* Сақтау түймесі */}
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={onSave}
            sx={{ 
              borderRadius: 2,
              bgcolor: '#d50032',
              '&:hover': {
                bgcolor: alpha('#d50032', 0.9),
              }
            }}
          >
            Сохранить
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ProfileEditForm;