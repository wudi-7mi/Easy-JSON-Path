import React from 'react';
import Editor from '@monaco-editor/react';
import { StatusIndicator } from './StatusIndicator';

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  isValid: boolean;
}

export const JsonEditor: React.FC<JsonEditorProps> = ({ value, onChange, isValid }) => {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-1">
        <Editor
          height="300px"
          defaultLanguage="json"
          value={value}
          onChange={(value) => onChange(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>
      <StatusIndicator isValid={isValid} />
    </div>
  );
};