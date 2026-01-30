import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, getTranslation, formatTranslation } from '../i18n/translations';

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        // Get language from localStorage or default to Slovak
        return localStorage.getItem('language') || 'sk';
    });

    useEffect(() => {
        // Save language preference to localStorage
        localStorage.setItem('language', language);
    }, [language]);

    const t = (path, replacements = {}) => {
        const translation = getTranslation(language, path);
        return formatTranslation(translation, replacements);
    };

    const switchLanguage = (lang) => {
        if (translations[lang]) {
            setLanguage(lang);
        }
    };

    const value = {
        language,
        t,
        switchLanguage,
        translations: translations[language],
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};
