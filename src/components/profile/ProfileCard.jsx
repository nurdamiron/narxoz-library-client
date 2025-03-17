import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

/**
 * ProfileCard component displays user information and avatar
 * 
 * @param {Object} props - Component props
 * @param {Object} props.userData - User data object
 * @param {Function} props.onEditClick - Function to handle edit button click
 */
const ProfileCard = ({ userData, onEditClick }) => {
  const theme = useTheme();

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
      <Box
        sx={{
          height: 120,
          background: 'linear-gradient(120deg, #d50032 0%, #ff5252 100%)',
        }}
      />
      
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
        
        <CardContent sx={{ width: '100%', textAlign: 'center', pt: 3 }}>
          {/* Пайдаланушы аты */}
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {userData.name}
          </Typography>
          
          {/* Пайдаланушы мәртебесі */}
          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
          >
            Студент • {userData.year}
          </Typography>
          
          {/* Пайдаланушы мамандығы */}
          <Chip
            label={userData.specialization}
            sx={{ 
              mt: 1, 
              mb: 3,
              bgcolor: alpha('#d50032', 0.1),
              color: '#d50032',
              fontWeight: 'medium',
            }}
            size="medium"
          />
          
          <Divider sx={{ my: 3 }} />
          
          {/* Пайдаланушының байланыс ақпараты */}
          <List disablePadding>
            {/* Email */}
            <ListItem disablePadding sx={{ mb: 2 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <EmailIcon sx={{ color: '#d50032' }} />
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="subtitle2" fontWeight="bold">Email</Typography>}
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
          
          {/* Профильді өңдеу түймесі */}
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
            Редактировать профиль
          </Button>
        </CardContent>
      </Box>
    </Card>
  );
};

export default ProfileCard;