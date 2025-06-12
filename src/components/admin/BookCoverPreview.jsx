import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { getBookCoverUrl, getDefaultBookCover } from '../../utils';
import { useTranslation } from 'react-i18next';

/**
 * Компонент для предварительного просмотра обложки книги
 * 
 * @param {Object} props - Свойства компонента
 * @param {File|null} props.file - Файл обложки или null, если обложка не выбрана
 * @param {string|null} props.imageUrl - URL существующей обложки (для редактирования)
 * @param {string} props.title - Название книги (для alt текста)
 * @returns {JSX.Element} Компонент предпросмотра обложки
 */
const BookCoverPreview = ({ file, imageUrl, title }) => {
  const { t } = useTranslation();
  
  // Создаем URL из File объекта, если он есть
  const fileUrl = file ? URL.createObjectURL(file) : null;
  
  // Используем URL из файла, если он есть, иначе используем imageUrl, если он есть
  // В противном случае используем заглушку
  const previewUrl = fileUrl || (imageUrl ? getBookCoverUrl(imageUrl) : getDefaultBookCover());

  // Эффект для очистки URL объекта при размонтировании компонента
  React.useEffect(() => {
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl]);

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
          alt={title || t('admin.noCover')}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            // В случае ошибки загрузки изображения заменяем на заглушку
            if (e.target && e.target.src && !e.target.src.includes('no-image.png')) {
              e.target.src = getDefaultBookCover();
              e.target.onerror = null;
            }
          }}
        />
      </Paper>
      <Typography variant="caption" color="text.secondary">
        {file ? t('admin.coverPreview', 'Алдын ала қарау') : t('admin.coverImage', 'Мұқаба сурет')}
      </Typography>
    </Box>
  );
};

export default BookCoverPreview; 