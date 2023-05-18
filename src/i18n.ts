import i18next from 'i18next';

const translation = require('./locales/en.json');

// Configure i18next
i18next.init({
  lng: 'en', // Default language
  resources: {
    en: {
      translation: translation,
    },
  },
});

export default i18next;