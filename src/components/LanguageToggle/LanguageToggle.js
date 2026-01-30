import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

function LanguageToggle() {
    const { language, switchLanguage } = useLanguage();

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => switchLanguage('sk')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-300 ${
                    language === 'sk'
                        ? 'bg-blue-600 text-white dark:bg-blue-500'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
                title="Slovenčina"
            >
                SK
            </button>
            <button
                onClick={() => switchLanguage('en')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-300 ${
                    language === 'en'
                        ? 'bg-blue-600 text-white dark:bg-blue-500'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
                title="English"
            >
                EN
            </button>
        </div>
    );
}

export default LanguageToggle;
