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
    <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-lg">
      {SUPPORTED_LANGUAGES.map((lang: LanguageConfig) => (
        <button
          key={lang.id}
          onClick={() => onLanguageChange(lang.id)}
          className={`
            flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium 
            transition-all duration-200 border
            ${selectedLanguage === lang.id
              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
            }
          `}
        >
          <span className="text-base">{lang.icon}</span>
          <span>{lang.name}</span>
        </button>
      ))}
    </div>
  );
};