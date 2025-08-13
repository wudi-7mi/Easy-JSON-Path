import type { LanguageConfig } from '../types';
export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { id: 'python', name: 'Python', supportsNativeJson: true },
  { id: 'javascript', name: 'JavaScript', supportsNativeJson: true },
  { id: 'cpp', name: 'C++', supportsNativeJson: false },
  { id: 'java', name: 'Java', supportsNativeJson: false },
  { id: 'csharp', name: 'C#', supportsNativeJson: false },
  { id: 'go', name: 'Go', supportsNativeJson: false },
];
