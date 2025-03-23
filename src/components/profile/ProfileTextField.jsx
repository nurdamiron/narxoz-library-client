import React from 'react';
import {
  TextField,
} from '@mui/material';

/**
 * ProfileTextField компоненті - профильді өңдеу формасындағы TextField компонентінің стильденген нұсқасы
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {string} props.label - Өріс белгісі
 * @param {string} props.name - Өріс аты
 * @param {string} props.value - Өріс мәні
 * @param {Function} props.onChange - Өзгеріс болған кезде шақырылатын функция
 * @param {boolean} props.disabled - Өріс өшірілген бе
 * @param {Object} props.error - Қате объектісі
 * @param {string} props.helperText - Көмекші мәтін
 * @param {Object} props.rest - Басқа параметрлер
 */
const ProfileTextField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  disabled = false, 
  error = false, 
  helperText = '', 
  ...rest 
}) => {
  return (
    <TextField
      fullWidth
      margin="normal"
      label={label}
      name={name}
      value={value || ''}
      onChange={onChange}
      disabled={disabled}
      error={error}
      helperText={helperText}
      variant="outlined"
      sx={{
        '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#d50032',
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: '#d50032',
        },
        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: disabled ? undefined : 'rgba(213, 0, 50, 0.5)',
        },
      }}
      {...rest}
    />
  );
};

export default ProfileTextField;