import React from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

/**
 * ProfileContactInfo компоненті пайдаланушының байланыс ақпаратын көрсетеді
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {Object} props.userData - Пайдаланушы деректері
 */
const ProfileContactInfo = ({ userData }) => {
  if (!userData) return null;

  return (
    <List disablePadding>
      {/* Email */}
      <ListItem disablePadding sx={{ mb: 2 }}>
        <ListItemIcon sx={{ minWidth: 40 }}>
          <EmailIcon sx={{ color: '#d50032' }} />
        </ListItemIcon>
        <ListItemText
          primary={<Typography variant="subtitle2" fontWeight="bold">Электрондық пошта</Typography>}
          secondary={userData.email}
        />
      </ListItem>
      
      {/* Телефон */}
      <ListItem disablePadding sx={{ mb: 2 }}>
        <ListItemIcon sx={{ minWidth: 40 }}>
          <PhoneIcon sx={{ color: '#d50032' }} />
        </ListItemIcon>
        <ListItemText
          primary={<Typography variant="subtitle2" fontWeight="bold">Телефон</Typography>}
          secondary={userData.phone}
        />
      </ListItem>
      
      {/* Факультет */}
      <ListItem disablePadding>
        <ListItemIcon sx={{ minWidth: 40 }}>
          <SchoolIcon sx={{ color: '#d50032' }} />
        </ListItemIcon>
        <ListItemText
          primary={<Typography variant="subtitle2" fontWeight="bold">Факультет</Typography>}
          secondary={userData.faculty}
        />
      </ListItem>
    </List>
  );
};

export default ProfileContactInfo;