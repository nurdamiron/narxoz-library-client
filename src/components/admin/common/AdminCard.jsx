import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardActions, 
  Typography, 
  IconButton, 
  Box, 
  Divider, 
  useTheme,
  alpha
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTranslation } from 'react-i18next';

/**
 * Компонент карточки для админ-панели
 * 
 * @param {Object} props - Свойства компонента
 * @param {string} props.title - Заголовок карточки
 * @param {React.ReactNode} props.icon - Иконка заголовка (опционально)
 * @param {React.ReactNode} props.children - Дочерние элементы
 * @param {React.ReactNode} props.actions - Кнопки действий (опционально)
 * @param {boolean} props.noPadding - Флаг отключения внутренних отступов (опционально)
 * @param {function} props.onMoreClick - Обработчик клика по кнопке "Ещё" (опционально)
 * @param {string} props.subtitle - Подзаголовок (опционально)
 * @param {string} props.titleKey - Ключ для локализации заголовка (опционально)
 * @param {string} props.subtitleKey - Ключ для локализации подзаголовка (опционально)
 */
const AdminCard = ({ 
  title, 
  icon, 
  children, 
  actions, 
  noPadding = false,
  onMoreClick,
  subtitle,
  titleKey,
  subtitleKey,
  ...rest
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  
  // Определяем отображаемые тексты с учетом локализации
  const displayTitle = titleKey ? t(titleKey) : title;
  const displaySubtitle = subtitleKey ? t(subtitleKey) : subtitle;
  
  return (
    <Card 
      elevation={2} 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'visible'
      }}
      {...rest}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {icon && <Box sx={{ mr: 1, color: theme.palette.primary.main }}>{icon}</Box>}
            <Typography variant="h6" component="div">
              {displayTitle}
            </Typography>
          </Box>
        }
        subheader={displaySubtitle ? <Typography variant="body2" color="text.secondary">{displaySubtitle}</Typography> : null}
        action={
          onMoreClick && (
            <IconButton 
              aria-label={t('common.more', 'Дополнительно')} 
              onClick={onMoreClick}
              sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) } }}
            >
              <MoreVertIcon />
            </IconButton>
          )
        }
        sx={{
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          pb: 1.5,
        }}
      />
      
      <CardContent 
        sx={{ 
          flexGrow: 1,
          padding: noPadding ? 0 : 2,
          '&:last-child': { paddingBottom: noPadding ? 0 : 2 }
        }}
      >
        {children}
      </CardContent>
      
      {actions && (
        <>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end', p: 1.5 }}>
            {actions}
          </CardActions>
        </>
      )}
    </Card>
  );
};

export default AdminCard;