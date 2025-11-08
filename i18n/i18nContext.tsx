import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { translations, LanguageKey } from './translations';

interface I18nContextType {
  language: LanguageKey;
  setLanguage: (lang: LanguageKey) => void;
  translate: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
  defaultLanguage?: LanguageKey;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children, defaultLanguage = 'en' }) => {
  const [language, setLanguage] = useState<LanguageKey>(defaultLanguage);

  const translate = useCallback((key: string): string => {
    return translations[language][key] || key; // Fallback to key if translation not found
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};
