import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translation resources
import enTranslations from './locales/en.json'
import hiTranslations from './locales/hi.json'

const resources = {
  en: {
    translation: enTranslations
  },
  hi: {
    translation: hiTranslations
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'app_language'
    },

    interpolation: {
      escapeValue: false // React already does escaping
    }
  })

export default i18n
