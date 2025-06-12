import React from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

// Импортируем подкомпоненты
import ProfileTextField from './ProfileTextField';

/**
 * ProfileEditForm компоненті пайдаланушы профиль ақпаратын өңдеуге арналған
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {Object} props.userData - Өңделетін пайдаланушы деректері
 * @param {Function} props.onDataChange - Деректер өзгерісін басқару функциясы
 * @param {Function} props.onSave - Сақтау функциясы
 * @param {Function} props.onCancel - Болдырмау функциясы
 * @param {boolean} props.editMode - Өңдеу режимі қосылған ба
 */
const ProfileEditForm = ({ userData, onDataChange, onSave, onCancel, editMode }) => {
  const theme = useTheme();

  /**
   * Енгізу өрісінің өзгерісін өңдейді
   * 
   * @param {Event} e - Оқиға объектісі
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onDataChange(name, value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Пайдаланушы ақпараты
      </Typography>
      
      <Grid container spacing={2}>
        {/* Аты-жөні өрісі */}
        <Grid item xs={12} sm={6}>
          <ProfileTextField
            label="Аты-жөні"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            disabled={!editMode}
          />
        </Grid>
        
        {/* Email өрісі */}
        <Grid item xs={12} sm={6}>
          <ProfileTextField
            label="Электрондық пошта"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            disabled={!editMode}
          />
        </Grid>
        
        {/* Телефон өрісі */}
        <Grid item xs={12} sm={6}>
          <ProfileTextField
            label="Телефон"
            name="phone"
            value={userData.phone}
            onChange={handleInputChange}
            disabled={!editMode}
          />
        </Grid>
        
        {/* Факультет өрісі */}
        <Grid item xs={12} sm={6}>
          <ProfileTextField
            label="Факультет"
            name="faculty"
            value={userData.faculty}
            onChange={handleInputChange}
            disabled={!editMode}
          />
        </Grid>
        
        {/* Мамандық өрісі */}
        <Grid item xs={12} sm={6}>
          <ProfileTextField
            label="Мамандық"
            name="specialization"
            value={userData.specialization}
            onChange={handleInputChange}
            disabled={!editMode}
          />
        </Grid>
        
        {/* Студенттік ID өрісі */}
        <Grid item xs={12} sm={6}>
          <ProfileTextField
            label="Студенттік ID"
            name="studentId"
            value={userData.studentId}
            onChange={handleInputChange}
            disabled={true} // ID өзгертуге болмайды
          />
        </Grid>
        
        {/* Year/Course field removed */}
      </Grid>
      
      {/* Өңдеу режимінде көрсетілетін түймелер */}
      {editMode && <FormActionButtons onCancel={onCancel} onSave={onSave} />}
    </Box>
  );
};

/**
 * Форма әрекеттері түймелерінің компоненті
 */
const FormActionButtons = ({ onCancel, onSave }) => {
  const theme = useTheme();
  
  return (
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
        Болдырмау
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
        Сақтау
      </Button>
    </Box>
  );
};

export default ProfileEditForm;