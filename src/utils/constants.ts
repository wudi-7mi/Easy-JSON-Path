import type { LanguageConfig } from '../types';
export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { id: 'python', name: 'Python', icon: '🐍', supportsNativeJson: true },
  { id: 'javascript', name: 'JavaScript', icon: '🟨', supportsNativeJson: true },
  { id: 'cpp', name: 'C++', icon: '⚡', supportsNativeJson: false },
  { id: 'java', name: 'Java', icon: '☕', supportsNativeJson: false },
  { id: 'csharp', name: 'C#', icon: '#️⃣', supportsNativeJson: false },
  { id: 'go', name: 'Go', icon: '🐹', supportsNativeJson: false },
];

export const LLM_CONFIG = {
  binding: 'openai',
  model: 'gpt-4o',
  host: 'http://localhost:8899/v1',
  apiKey: 'sk-fastapi-proxy-key-12345',
};