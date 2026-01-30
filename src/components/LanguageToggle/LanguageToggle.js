import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

function LanguageToggle() {
    const { language, switchLanguage } = useLanguage();

    return (
        <div className="flex items-center gap-2">
          </div>
    );
}

export default LanguageToggle;
