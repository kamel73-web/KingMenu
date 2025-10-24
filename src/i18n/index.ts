import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from './locales/en.json';
import frCommon from './locales/fr.json';
import arCommon from './locales/ar.json';
import esCommon from './locales/es.json';
import itCommon from './locales/it.json';

import enCookMode from './locales/en/cookMode.json';
import frCookMode from './locales/fr/cookMode.json';
import arCookMode from './locales/ar/cookMode.json';
import esCookMode from './locales/es/cookMode.json';
import itCookMode from './locales/it/cookMode.json';

const resources = {
  en: {
    translation: enCommon,
    cookMode: enCookMode
  },
  fr: {
    translation: frCommon,
    cookMode: frCookMode
  },
  ar: {
    translation: arCommon,
    cookMode: arCookMode
  },
  es: {
    translation: esCommon,
    cookMode: esCookMode
  },
  it: {
    translation: itCommon,
    cookMode: itCookMode
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    debug: true,
    ns: ['translation', 'cookMode'], // Ajout du namespace cookMode
    defaultNS: 'translation',
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })
  .then(() => {
    console.log('i18next initialized with language:', i18n.language);
    console.log('Resources for fr:', i18n.getResourceBundle('fr', 'translation'));
    console.log('CookMode resources for fr:', i18n.getResourceBundle('fr', 'cookMode'));
    
    if (typeof window !== 'undefined') {
      window.i18n = i18n;
      console.log('i18n exposed to window object');
    }
  })
  .catch((error) => {
    console.error('i18next initialization failed:', error);
  });

export default i18n;
