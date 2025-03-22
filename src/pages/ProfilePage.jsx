// src/pages/ProfilePage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  Divider,
  IconButton,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Skeleton
} from '@mui/material';
import {
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Badge as BadgeIcon,
  School as SchoolIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';

// Fix import to use default export
import useProfile from '../hooks/useProfile';
import { useToast } from '../context/ToastContext';
import { getAvatarUrl, formatApiError } from '../utils';

// Табпанель
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ProfilePage = () => {
  const { profile, stats, loading, updateProfile, uploadAvatar, changePassword } = useProfile();
  const { success, error: showError } = useToast();
  
  // Состояние UI
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  // Состояние формы профиля
  const [profileData, setProfileData] = useState(profile ? {
    name: profile.name || '',
    email: profile.email || '',
    phone: profile.phone || '',
    faculty: profile.faculty || '',
    specialization: profile.specialization || '',
    year: profile.year || ''
  } : {});
  
  // Состояние формы смены пароля
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Если данные профиля обновились из хука, обновляем состояние формы
  React.useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        faculty: profile.faculty || '',
        specialization: profile.specialization || '',
        year: profile.year || ''
      });
    }
  }, [profile]);
  
  // Обработчик изменения вкладки
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Обработчик изменения полей формы профиля
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Очищаем ошибку поля при изменении
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Обработчик изменения полей формы смены пароля
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Очищаем ошибку поля при изменении
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Переключение видимости пароля
  const handleTogglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  
  // Включение режима редактирования
  const handleEditProfile = () => {
    setEditMode(true);
  };
  
  // Отмена редактирования
  const handleCancelEdit = () => {
    // Восстанавливаем исходные данные
    if (profile) {
      setProfileData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        faculty: profile.faculty || '',
        specialization: profile.specialization || '',
        year: profile.year || ''
      });
    }
    setFormErrors({});
    setEditMode(false);
  };
  
  // Валидация формы профиля
  const validateProfileForm = () => {
    const errors = {};
    
    if (!profileData.name) {
      errors.name = 'Аты-жөні міндетті';
    }
    
    if (!profileData.email) {
      errors.email = 'Электрондық пошта міндетті';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = 'Жарамды электрондық пошта енгізіңіз';
    }
    
    if (!profileData.faculty) {
      errors.faculty = 'Факультет міндетті';
    }
    
    if (!profileData.specialization) {
      errors.specialization = 'Мамандық міндетті';
    }
    
    if (!profileData.year) {
      errors.year = 'Оқу жылы міндетті';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Валидация формы смены пароля
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Ағымдағы құпия сөз міндетті';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'Жаңа құпия сөз міндетті';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Құпия сөз кем дегенде 6 таңбадан тұруы керек';
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Құпия сөзді растау міндетті';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Құпия сөздер сәйкес келмейді';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Сохранение профиля
  const handleSaveProfile = async () => {
    if (!validateProfileForm()) {
      return;
    }
    
    try {
      setSavingProfile(true);
      await updateProfile(profileData);
      setEditMode(false);
      success('Профиль сәтті жаңартылды');
    } catch (err) {
      console.error('Ошибка при обновлении профиля:', err);
      
      // Обработка ошибок валидации с API
      if (err.response?.data?.errors) {
        setFormErrors(formatApiError(err));
      } else {
        showError('Профильді жаңарту кезінде қате орын алды');
      }
    } finally {
      setSavingProfile(false);
    }
  };
  
  // Сохранение пароля
  const handleSavePassword = async () => {
    if (!validatePasswordForm()) {
      return;
    }
    
    try {
      setSavingPassword(true);
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      // Сбрасываем форму и закрываем диалог
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordDialogOpen(false);
      success('Құпия сөз сәтті өзгертілді');
    } catch (err) {
      console.error('Ошибка при смене пароля:', err);
      
      if (err.response?.data?.error) {
        setFormErrors({ currentPassword: err.response.data.error });
      } else {
        showError('Құпия сөзді өзгерту кезінде қате орын алды');
      }
    } finally {
      setSavingPassword(false);
    }
  };
  
  // Загрузка аватара
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Проверяем тип файла
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      showError('Тек JPEG, PNG немесе GIF форматындағы суреттерге рұқсат етіледі');
      return;
    }
    
    // Проверяем размер файла (макс. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('Сурет өлшемі 5MB-дан аспауы керек');
      return;
    }
    
    try {
      setUploading(true);
      await uploadAvatar(file);
      success('Аватар сәтті жаңартылды');
    } catch (err) {
      console.error('Ошибка при загрузке аватара:', err);
      showError('Аватарды жүктеу кезінде қате орын алды');
    } finally {
      setUploading(false);
    }
  };
  
  if (loading && !profile) {
    return (
      <Container sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Skeleton variant="circular" width={150} height={150} />
              <Skeleton variant="text" width="80%" height={40} sx={{ mt: 2 }} />
              <Skeleton variant="text" width="60%" height={30} />
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Skeleton variant="text" width="40%" height={40} />
              <Skeleton variant="text" width="100%" height={30} sx={{ mt: 3 }} />
              <Skeleton variant="text" width="100%" height={30} sx={{ my: 1 }} />
              <Skeleton variant="text" width="100%" height={30} sx={{ my: 1 }} />
              <Skeleton variant="text" width="100%" height={30} sx={{ my: 1 }} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Аватар и краткая информация */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar 
                  src={profile && getAvatarUrl(profile.avatar)} 
                  alt={profile?.name}
                  sx={{ width: 150, height: 150, mb: 2 }}
                />
                
                {/* Кнопка загрузки аватара */}
                <label htmlFor="avatar-upload">
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                  />
                  <IconButton 
                    component="span"
                    sx={{ 
                      position: 'absolute', 
                      bottom: 10, 
                      right: 10, 
                      bgcolor: 'background.paper',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                    disabled={uploading}
                  >
                    {uploading ? <CircularProgress size={24} /> : <PhotoCameraIcon />}
                  </IconButton>
                </label>
              </Box>
              
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
                {profile?.name}
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                {profile?.role === 'admin' ? 'Әкімші' : (profile?.role === 'librarian' ? 'Кітапханашы' : 'Оқырман')}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                {profile?.studentId}
              </Typography>
              
              {stats && (
                <Box sx={{ mt: 3, width: '100%' }}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Статистика
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6">{stats.bookmarks || 0}</Typography>
                        <Typography variant="caption">Бетбелгілер</Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6">{stats.activeborrows || 0}</Typography>
                        <Typography variant="caption">Белсенді қарыздар</Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6">{stats.totalBorrows || 0}</Typography>
                        <Typography variant="caption">Барлық қарыздар</Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Paper 
                        elevation={1} 
                        sx={{ 
                          p: 2, 
                          textAlign: 'center',
                          bgcolor: stats.overdueborrows > 0 ? 'error.lighter' : 'inherit'
                        }}
                      >
                        <Typography 
                          variant="h6" 
                          color={stats.overdueborrows > 0 ? 'error.main' : 'inherit'}
                        >
                          {stats.overdueborrows || 0}
                        </Typography>
                        <Typography 
                          variant="caption"
                          color={stats.overdueborrows > 0 ? 'error.main' : 'inherit'}
                        >
                          Мерзімі өткен
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}
              
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                startIcon={<LockIcon />}
                onClick={() => setPasswordDialogOpen(true)}
                sx={{ mt: 3 }}
              >
                Құпия сөзді өзгерту
              </Button>
            </Paper>
          </Grid>
          
          {/* Вкладки с информацией профиля */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" component="h1">
                  Менің профилім
                </Typography>
                
                {!editMode ? (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={handleEditProfile}
                  >
                    Өңдеу
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={handleCancelEdit}
                    >
                      Болдырмау
                    </Button>
                    
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={savingProfile ? <CircularProgress size={24} /> : <SaveIcon />}
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                    >
                      Сақтау
                    </Button>
                  </Box>
                )}
              </Box>
              
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs 
                    value={activeTab} 
                    onChange={handleTabChange}
                    variant="fullWidth"
                  >
                    <Tab label="Жеке ақпарат" />
                    <Tab label="Оқу ақпараты" />
                    <Tab label="Байланыс" />
                  </Tabs>
                </Box>
                
                {/* Вкладка с личной информацией */}
                <TabPanel value={activeTab} index={0}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Аты-жөні"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BadgeIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Студенттік ID"
                        value={profile?.studentId}
                        disabled={true}
                      />
                    </Grid>
                  </Grid>
                </TabPanel>
                
                {/* Вкладка с учебной информацией */}
                <TabPanel value={activeTab} index={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Оқу жылы"
                        name="year"
                        value={profileData.year}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                        error={!!formErrors.year}
                        helperText={formErrors.year}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Мамандық"
                        name="specialization"
                        value={profileData.specialization}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                        error={!!formErrors.specialization}
                        helperText={formErrors.specialization}
                      />
                    </Grid>
                  </Grid>
                </TabPanel>
                
                {/* Вкладка с контактной информацией */}
                <TabPanel value={activeTab} index={2}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Электрондық пошта"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Телефон"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                        error={!!formErrors.phone}
                        helperText={formErrors.phone}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </TabPanel>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      {/* Диалог смены пароля */}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Құпия сөзді өзгерту</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            {formErrors.general && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formErrors.general}
              </Alert>
            )}
            
            <TextField
              margin="normal"
              fullWidth
              label="Ағымдағы құпия сөз"
              name="currentPassword"
              type={showPassword.current ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              error={!!formErrors.currentPassword}
              helperText={formErrors.currentPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleTogglePasswordVisibility('current')}
                      edge="end"
                    >
                      {showPassword.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              margin="normal"
              fullWidth
              label="Жаңа құпия сөз"
              name="newPassword"
              type={showPassword.new ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              error={!!formErrors.newPassword}
              helperText={formErrors.newPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleTogglePasswordVisibility('new')}
                      edge="end"
                    >
                      {showPassword.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              margin="normal"
              fullWidth
              label="Жаңа құпия сөзді растау"
              name="confirmPassword"
              type={showPassword.confirm ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleTogglePasswordVisibility('confirm')}
                      edge="end"
                    >
                      {showPassword.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>
            Болдырмау
          </Button>
          <Button 
            onClick={handleSavePassword}
            color="primary"
            variant="contained"
            disabled={savingPassword}
            startIcon={savingPassword && <CircularProgress size={24} />}
          >
            Сақтау
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default ProfilePage;