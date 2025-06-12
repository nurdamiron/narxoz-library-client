import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Edit as EditIcon,
} from '@mui/icons-material';

// Импортируем подкомпоненты
import ProfileContactInfo from './ProfileContactInfo';

/**
 * ProfileCard компоненті пайдаланушы ақпараты мен аватарын көрсетеді
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {Object} props.userData - Пайдаланушы деректері
 * @param {Function} props.onEditClick - Өңдеу түймесін басқан кезде шақырылатын функция
 */
const ProfileCard = ({ userData, onEditClick }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  if (!userData) {
    return null;
  }

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: theme.shadows[2],
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          boxShadow: theme.shadows[5],
        },
        height: '100%',
      }}
    >
      {/* Профиль бетінің жоғарғы түсті аймағы */}
      <ProfileHeader />
      
      {/* Профиль ақпараты */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          mt: -8, // Аватарды жоғарғы аймаққа қабаттастыру үшін
        }}
      >
        {/* Пайдаланушы аватары */}
        <ProfileAvatar userData={userData} />
        
        <CardContent sx={{ width: '100%', textAlign: 'center', pt: 3 }}>
          {/* Пайдаланушы аты */}
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {userData.name}
          </Typography>
          
          {/* Year field removed - no longer showing user's year */}
          
          {/* Пайдаланушы мамандығы */}
          <ProfileSpecialization specialization={userData.specialization} />
          
          <Divider sx={{ my: 3 }} />
          
          {/* Пайдаланушының байланыс ақпараты */}
          <ProfileContactInfo userData={userData} />
          
          {/* Профильді өңдеу түймесі */}
          <EditProfileButton onEditClick={onEditClick} />
        </CardContent>
      </Box>
    </Card>
  );
};

/**
 * Профиль бетінің жоғарғы түсті аймағы
 */
const ProfileHeader = () => (
  <Box
    sx={{
      height: 120,
      background: 'linear-gradient(120deg, #d50032 0%, #ff5252 100%)',
    }}
  />
);

/**
 * Пайдаланушы аватары компоненті
 */
const ProfileAvatar = ({ userData }) => {
  const theme = useTheme();
  
  return (
    <Avatar
      src={userData.avatar}
      alt={userData.name}
      sx={{
        width: 120,
        height: 120,
        border: '5px solid white',
        backgroundColor: alpha('#d50032', 0.8),
        fontSize: 48,
        fontWeight: 'bold',
        boxShadow: theme.shadows[3],
      }}
    >
      {userData.name?.charAt(0)} {/* Аватар болмаса, атының бірінші әрпі көрсетіледі */}
    </Avatar>
  );
};

/**
 * Пайдаланушы мамандығы компоненті
 */
const ProfileSpecialization = ({ specialization }) => {
  const theme = useTheme();
  
  if (!specialization) return null;
  
  return (
    <Chip
      label={specialization}
      sx={{ 
        mt: 1, 
        mb: 3,
        bgcolor: alpha('#d50032', 0.1),
        color: '#d50032',
        fontWeight: 'medium',
      }}
      size="medium"
    />
  );
};

/**
 * Профильді өңдеу түймесі компоненті
 */
const EditProfileButton = ({ onEditClick }) => {
  const { t } = useTranslation();
  
  return (
    <Button
      variant="outlined"
      startIcon={<EditIcon />}
      onClick={onEditClick}
      fullWidth
      sx={{ 
        mt: 3,
        borderColor: '#d50032',
        color: '#d50032',
        borderRadius: 2,
        '&:hover': {
          borderColor: '#d50032',
          backgroundColor: alpha('#d50032', 0.05),
        },
      }}
    >
      {t('profile.editProfile')}
    </Button>
  );
};

export default ProfileCard;