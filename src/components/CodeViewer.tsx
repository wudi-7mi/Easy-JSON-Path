import React from 'react';
import Editor from '@monaco-editor/react';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodeViewerProps {
  code: string;
  language: string;
  isLoading?: boolean;
  error?: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ 
  code, 
  language
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const getMonacoLanguage = (lang: string): string => {
    const languageMap: Record<string, string> = {
      'python': 'python',
      'javascript': 'javascript',
      'cpp': 'cpp',
      'java': 'java',
      'csharp': 'csharp',
      'go': 'go',
    };
    return languageMap[lang] || 'text';
  };

  if (!code) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <p className="text-gray-500">Select a JSON path to generate access code</p>
      </div>
    );
  }

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-gray-300 text-sm font-medium">
          {language.charAt(0).toUpperCase() + language.slice(1)} Code
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
          title="Copy to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span className="text-sm">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="text-sm">Copy</span>
            </>
          )}
        </button>
      </div>
      <Editor
        height="200px"
        language={getMonacoLanguage(language)}
        value={code}
        theme="vs-dark"
        options={{
          readOnly: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          lineNumbers: 'on',
          glyphMargin: false,
          folding: false,
        }}
      />
    </div>
  );
};