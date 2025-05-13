import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { 
  IconButton, 
  Menu, 
  MenuItem, 
  Typography, 
  Box,
  ListItemIcon,
  Tooltip,
  ButtonBase,
  Paper,
  Chip
} from '@mui/material';
import { Language as LanguageIcon, Check as CheckIcon, KeyboardArrowDown as ArrowDownIcon } from '@mui/icons-material';

/**
 * Компонент переключения языка интерфейса
 * Отображает кнопку с иконкой глобуса и выпадающее меню с выбором языка
 */
const LanguageSwitcher = () => {
  const { language, languages, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // Обработчик открытия меню
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Обработчик закрытия меню
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Обработчик выбора языка
  const handleLanguageSelect = (langCode) => {
    changeLanguage(langCode);
    handleClose();
  };

  // Получение текущего языка для отображения
  const getCurrentLanguageLabel = () => {
    const currentLang = languages.find(lang => lang.code === language);
    return currentLang ? t(`languages.${currentLang.code}`) : '';
  };

  return (
    <>
      <ButtonBase
        onClick={handleClick}
        aria-controls={open ? 'language-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: 1,
          px: 1.5,
          py: 0.5,
          color: 'white',
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          transition: 'all 0.2s',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.2)',
          }
        }}
      >
        <Typography 
          variant="body2" 
          component="span"
          sx={{ 
            mr: 0.5,
            fontWeight: 'medium'
          }}
        >
          {getCurrentLanguageLabel()}
        </Typography>
        <ArrowDownIcon sx={{ fontSize: 16 }} />
      </ButtonBase>
      
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
        PaperProps={{
          elevation: 3,
          sx: { minWidth: 150, mt: 0.5, borderRadius: 1 }
        }}
      >
        {languages.map((lang) => (
          <MenuItem 
            key={lang.code} 
            onClick={() => handleLanguageSelect(lang.code)}
            selected={language === lang.code}
            sx={{
              py: 1,
              borderRadius: 0.5,
              mx: 0.5,
              width: 'calc(100% - 8px)',
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                '&:hover': {
                  bgcolor: 'primary.light',
                }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: '30px' }}>
              {language === lang.code && <CheckIcon fontSize="small" />}
            </ListItemIcon>
            <Typography variant="body2">
              {t(`languages.${lang.code}`)}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSwitcher; 