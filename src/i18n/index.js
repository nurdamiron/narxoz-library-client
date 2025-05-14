import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import kzTranslations from './locales/kz.json';
import ruTranslations from './locales/ru.json';
import enTranslations from './locales/en.json';

// Конфигурация i18next
i18n
  // Подключаем обнаружение языка пользователя
  .use(LanguageDetector)
  // Подключаем React компоненты
  .use(initReactI18next)
  // Инициализация i18next
  .init({
    // Доступные языки
    resources: {
      kz: {
        translation: kzTranslations
      },
      ru: {
        translation: ruTranslations
      },
      en: {
        translation: enTranslations
      }
    },
    // Язык по умолчанию (для России используем русский, иначе казахский)
    fallbackLng: (lng) => {
      if (lng && lng.startsWith('ru')) return 'ru';
      return 'kz';
    },
    // Если ключ не найден, вернуть сам ключ
    keySeparator: '.',
    interpolation: {
      // Не экранировать HTML в значениях
      escapeValue: false,
    },
    // Обнаружение и сохранение языка в localStorage
    detection: {
      order: ['localStorage', 'navigator', 'querystring', 'htmlTag'],
      lookupLocalStorage: 'language',
      lookupQuerystring: 'lng',
      caches: ['localStorage'],
      // Ensure changes in language also update HTML lang attribute
      htmlTag: document.documentElement
    },
  });

export default i18n; 