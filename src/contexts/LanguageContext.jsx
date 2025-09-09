import { createContext, useContext } from 'react'
import { useTranslation } from 'react-i18next'

const LanguageContext = createContext()

// Provider component
export function LanguageProvider({ children }) {
  const { i18n, t } = useTranslation()

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'hi' : 'en'
    i18n.changeLanguage(newLanguage)
  }

  const value = {
    language: i18n.language,
    setLanguage: (lang) => i18n.changeLanguage(lang),
    toggleLanguage,
    t,
    isHindi: i18n.language === 'hi'
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

// Custom hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export default LanguageContext
