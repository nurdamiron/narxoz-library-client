// src/pages/ProfilePage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
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
import { useAuth } from '../context/AuthContext';
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
  const { profile, stats, loading, updateProfile, uploadAvatar, changePassword, fetchProfile } = useProfile();
  const { updateUserData } = useAuth();
  const { success, error: showError } = useToast();
  const { t } = useTranslation();
  
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
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    email: profile.email || '',
    phone: profile.phoneNumber || profile.phone || '',
    faculty: profile.faculty || '',
    specialization: profile.specialization || ''
    // year field removed
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
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phoneNumber || profile.phone || '',
        faculty: profile.faculty || '',
        specialization: profile.specialization || ''
        // year field removed
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
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phoneNumber || profile.phone || '',
        faculty: profile.faculty || '',
        specialization: profile.specialization || '',
        year: profile.year || profile.course || ''
      });
    }
    setFormErrors({});
    setEditMode(false);
  };
  
  // Валидация формы профиля
  const validateProfileForm = () => {
    const errors = {};
    
    if (!profileData.firstName) {
      errors.firstName = t('validation.required', 'Аты міндетті');
    }
    
    if (!profileData.lastName) {
      errors.lastName = t('validation.required', 'Тегі міндетті');
    }
    
    if (!profileData.email) {
      errors.email = t('validation.required', 'Электрондық пошта міндетті');
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = t('validation.email', 'Жарамды электрондық пошта енгізіңіз');
    }
    
    // Faculty, specialization и year необязательные поля
    // Убираем их из обязательной валидации
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Валидация формы смены пароля
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = t('validation.required');
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = t('validation.required');
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = t('validation.minLength', { min: 6 });
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = t('validation.required');
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = t('validation.passwordMatch');
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
      
      // Подготавливаем данные для отправки
      const dataToSend = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phoneNumber: profileData.phone, // Backend expects phoneNumber, not phone
        faculty: profileData.faculty,
        specialization: profileData.specialization
        // year field removed
      };
      
      // Удаляем пустые поля
      Object.keys(dataToSend).forEach(key => {
        if (!dataToSend[key] || dataToSend[key].toString().trim() === '') {
          delete dataToSend[key];
        }
      });
      
      console.log('Sending profile data:', dataToSend);
      
      const response = await updateProfile(dataToSend);
      console.log('Profile update response:', response);
      
      if (response && response.success) {
        // Обновляем локальное состояние профиля новыми данными
        if (response.data) {
          setProfileData({
            firstName: response.data.firstName || '',
            lastName: response.data.lastName || '',
            email: response.data.email || '',
            phone: response.data.phoneNumber || response.data.phone || '',
            faculty: response.data.faculty || '',
            specialization: response.data.specialization || ''
            // year field removed
          });
        }
        
        // Принудительно обновляем профиль из API
        await fetchProfile();
        
        // Также обновляем данные в AuthContext
        await updateUserData();
        
        setEditMode(false);
        success(t('profile.updateSuccess'));
      }
    } catch (err) {
      console.error(`${t('profile.updateError')}:`, err);
      
      // Обработка ошибок валидации с API
      if (err.response?.data?.errors) {
        setFormErrors(formatApiError(err));
      } else if (err.response?.data?.error) {
        showError(err.response.data.error);
      } else {
        showError(t('profile.updateError'));
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
      success(t('profile.passwordChanged'));
    } catch (err) {
      console.error(`${t('profile.passwordError')}:`, err);
      
      if (err.response?.data?.error) {
        setFormErrors({ currentPassword: err.response.data.error });
      } else {
        showError(t('profile.passwordError'));
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
      showError(t('admin.fileTypeError'));
      return;
    }
    
    // Проверяем размер файла (макс. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError(t('admin.fileSizeError'));
      return;
    }
    
    try {
      setUploading(true);
      await uploadAvatar(file);
      success(t('profile.avatarSuccess'));
    } catch (err) {
      console.error(`${t('profile.avatarError')}:`, err);
      showError(t('profile.avatarError'));
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
                {profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : ''}
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                {profile?.role === 'admin' ? t('roles.admin') : (profile?.role === 'librarian' ? t('roles.librarian') : t('roles.reader'))}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                {profile?.studentId}
              </Typography>
              
              {stats && (
                <Box sx={{ mt: 3, width: '100%' }}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    {t('admin.statistics')}
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6">{stats.bookmarks || 0}</Typography>
                        <Typography variant="caption">{t('bookmarks.title')}</Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6">{stats.activeborrows || 0}</Typography>
                        <Typography variant="caption">{t('borrowHistory.active')}</Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6">{stats.totalBorrows || 0}</Typography>
                        <Typography variant="caption">{t('borrowHistory.title')}</Typography>
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
                          {t('borrowHistory.overdue')}
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
                {t('profile.changePassword')}
              </Button>
            </Paper>
          </Grid>
          
          {/* Вкладки с информацией профиля */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" component="h1">
                  {t('profile.title')}
                </Typography>
                
                {!editMode ? (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={handleEditProfile}
                  >
                    {t('profile.editProfile')}
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={handleCancelEdit}
                    >
                      {t('common.cancel')}
                    </Button>
                    
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={savingProfile ? <CircularProgress size={24} /> : <SaveIcon />}
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                    >
                      {t('common.save')}
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
                    <Tab label={t('profile.personalInfo')} />
                    <Tab label={t('auth.educationInfo', 'Оқу ақпараты')} />
                    <Tab label={t('auth.contactInfo', 'Байланыс')} />
                  </Tabs>
                </Box>
                
                {/* Вкладка с личной информацией */}
                <TabPanel value={activeTab} index={0}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label={t('profile.firstName', 'Аты')}
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                        error={!!formErrors.firstName}
                        helperText={formErrors.firstName}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BadgeIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label={t('profile.lastName', 'Тегі')}
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                        error={!!formErrors.lastName}
                        helperText={formErrors.lastName}
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
                        label={t('user.studentId')}
                        value={profile?.studentId}
                        disabled={true}
                      />
                    </Grid>
                  </Grid>
                </TabPanel>
                
                {/* Вкладка с учебной информацией */}
                <TabPanel value={activeTab} index={1}>
                  <Grid container spacing={3}>
                    {/* Year field removed */}
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label={t('user.faculty')}
                        name="faculty"
                        value={profileData.faculty}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                        error={!!formErrors.faculty}
                        helperText={formErrors.faculty}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label={t('profile.specialization')}
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
                        label={t('common.email')}
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
                        label={t('profile.phone')}
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
        <DialogTitle>{t('profile.changePassword')}</DialogTitle>
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
              label={t('profile.oldPassword')}
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
              label={t('profile.newPassword')}
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
              label={t('profile.confirmPassword')}
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
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleSavePassword}
            color="primary"
            variant="contained"
            disabled={savingPassword}
            startIcon={savingPassword && <CircularProgress size={24} />}
          >
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default ProfilePage;