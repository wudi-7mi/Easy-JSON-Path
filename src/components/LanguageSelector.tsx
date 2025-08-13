import React from 'react';
import { SUPPORTED_LANGUAGES } from '../utils/constants';
import type { LanguageConfig } from '../types';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange
}) => {
  return (
    <div className="flex gap-1 flex-wrap">
      {SUPPORTED_LANGUAGES.map((lang: LanguageConfig) => (
        <button
          key={lang.id}
          onClick={() => onLanguageChange(lang.id)}
          className={`
            px-2 lg:px-3 py-1 lg:py-1.5 text-xs lg:text-sm font-medium rounded-md transition-all duration-200
            ${selectedLanguage === lang.id
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
          title={lang.name}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
};