export interface JsonPath {
  path: string[];
  value: any;
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
}

export interface LanguageConfig {
  id: string;
  name: string;
  icon: string;
  supportsNativeJson: boolean;
}

export interface LLMRequest {
  jsonPath: string[];
  targetLanguage: string;
  jsonExample: any;
}

export interface LLMResponse {
  code: string;
  explanation?: string;
}