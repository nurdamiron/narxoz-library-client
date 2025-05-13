import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// Создаем контекст языка
const LanguageContext = createContext();

// Хук для использования контекста языка в компонентах
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage должен использоваться внутри LanguageProvider');
  }
  return context;
};

// Провайдер языка
export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  
  // Получаем сохраненный язык из localStorage или используем казахский по умолчанию
  const savedLanguage = localStorage.getItem('language') || 'kz';
  const [language, setLanguage] = useState(savedLanguage);
  
  // Список доступных языков
  const languages = useMemo(() => [
    { code: 'kz', name: 'Қазақша' },
    { code: 'ru', name: 'Русский' },
    { code: 'en', name: 'English' }
  ], []);
  
  // Изменение языка
  const changeLanguage = (langCode) => {
    if (langCode && languages.some(lang => lang.code === langCode)) {
      setLanguage(langCode);
      i18n.changeLanguage(langCode);
      localStorage.setItem('language', langCode);
    }
  };
  
  // Инициализация языка при загрузке приложения
  useEffect(() => {
    changeLanguage(savedLanguage);
  }, []);
  
  // Значение контекста
  const value = {
    language,
    languages,
    changeLanguage
  };
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext; 