import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../locales/translations';

const LanguageContext = createContext();

export const useLanguage = () => {
    return useContext(LanguageContext);
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        const savedLanguage = localStorage.getItem('language');
        return savedLanguage || 'en';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const t = (key, params = {}) => {
        let text = translations[language]?.[key] || translations['en'][key] || key;
        
        // Replace parameters in the translation string
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });
        
        return text;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
