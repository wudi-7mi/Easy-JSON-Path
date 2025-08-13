import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  parsedJson?: any;
}

export function useJsonValidation(jsonText: string) {
  const [result, setResult] = useState<ValidationResult>({ isValid: false });
  const debouncedJsonText = useDebounce(jsonText, 300);

  useEffect(() => {
    if (!debouncedJsonText.trim()) {
      setResult({ isValid: false });
      return;
    }

    try {
      const parsed = JSON.parse(debouncedJsonText);
      setResult({ isValid: true, parsedJson: parsed });
    } catch (error) {
      setResult({ 
        isValid: false, 
        error: error instanceof Error ? error.message : 'Invalid JSON' 
      });
    }
  }, [debouncedJsonText]);

  return result;
}