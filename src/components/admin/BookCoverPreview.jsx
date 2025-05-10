import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

/**
 * Компонент для предварительного просмотра обложки книги
 * 
 * @param {Object} props - Свойства компонента
 * @param {File|null} props.file - Файл обложки или null, если обложка не выбрана
 * @param {string|null} props.imageUrl - URL существующей обложки (для редактирования)
 * @param {string} props.title - Название книги (для alt текста)
 * @returns {JSX.Element} Компонент предпросмотра обложки
 */
const BookCoverPreview = ({ file, imageUrl, title = 'Кітап мұқабасы' }) => {
  // Обработка URL обложки, чтобы добавить домен сервера, если путь начинается с /uploads
  const processImageUrl = (url) => {
    if (url && url.startsWith('/uploads')) {
      return `${window.location.protocol}//${window.location.host.replace(/:\d+/, ':5001')}${url}`;
    }
    return url;
  };

  // Сначала используем выбранный файл, если он есть, иначе существующий URL
  const previewUrl = file 
    ? URL.createObjectURL(file) 
    : processImageUrl(imageUrl) || 'https://via.placeholder.com/200x300?text=Мұқаба+жоқ';

  // Эффект для очистки URL объекта при размонтировании компонента
  React.useEffect(() => {
    return () => {
      if (file) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [file, previewUrl]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mb: 2
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: 200,
          height: 300,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          mb: 1
        }}
      >
        <Box
          component="img"
          src={previewUrl}
          alt={title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </Paper>
      <Typography variant="caption" color="text.secondary">
        {file ? 'Алдын ала қарау' : 'Мұқаба сурет'}
      </Typography>
    </Box>
  );
};

export default BookCoverPreview; 