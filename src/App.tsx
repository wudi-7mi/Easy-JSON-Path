import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { StatusIndicator } from './components/StatusIndicator';
import { JsonRenderer } from './components/JsonRenderer';
import { CodeViewer } from './components/CodeViewer';
import { LanguageSelector } from './components/LanguageSelector';
import { useJsonValidation } from './hooks/useJsonValidation';
import {
  generatePythonPath,
  generateJavaScriptPath,
  generateCppPath,
  generateGoPath,
  generateCSharpPath,
  generateJavaPath
} from './utils/jsonPathGenerator';
import type { JsonPath } from './types';

function App() {
  const [jsonText, setJsonText] = useState('{\n  "name": "John Doe",\n  "age": 30,\n  "hobbies": ["reading", "coding"],\n  "address": {\n    "city": "New York",\n    "zipCode": "10001"\n  }\n}');
  const [selectedPath, setSelectedPath] = useState<JsonPath | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const validation = useJsonValidation(jsonText);

  const handleAnalyze = () => {
    setIsAnalyzing(prev => !prev);
  };

  const handlePathSelect = async (path: JsonPath) => {
    setSelectedPath(path);

    let code = '';
    switch (selectedLanguage) {
      case 'python':
        code = generatePythonPath(path.path);
        break;
      case 'javascript':
        code = generateJavaScriptPath(path.path);
        break;
      case 'cpp':
        code = generateCppPath(path.path);
        break;
      case 'go':
        code = generateGoPath(path.path);
        break;
      case 'csharp':
        code = generateCSharpPath(path.path);
        break;
      case 'java':
        code = generateJavaPath(path.path);
        break;
      default:
        code = '';
    }
    setGeneratedCode(code);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    if (selectedPath) {
      handlePathSelect(selectedPath);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <div className="text-center py-4 flex-shrink-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          JSON Path Analyzer
        </h1>
        <p className="text-gray-600 text-sm">
          Analyze JSON structure and generate access code in multiple languages
        </p>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex gap-4 px-4 pb-4 min-h-0">
        {/* 左侧 JSON 编辑 / 分析区 */}
        <div className="w-1/2 bg-white rounded-xl shadow-lg p-4 flex flex-col min-w-0 overflow-hidden">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            JSON Input
          </h2>

          {/* 状态指示器 + 按钮 */}
          <div className="mb-3 flex items-center space-x-3">
            <StatusIndicator
              isValid={validation.isValid}
              error={validation.error}
            />
            {((!isAnalyzing && validation.isValid) || isAnalyzing) && (
              <button
                onClick={handleAnalyze}
                className="px-3 py-1 text-sm rounded-md font-medium text-white bg-green-600 hover:bg-green-700 hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200"
              >
                {isAnalyzing ? 'Edit JSON' : 'Analyze JSON'}
              </button>
            )}
          </div>

          {/* 编辑器 / 渲染器 */}
          <div className="flex-1 min-h-0 flex flex-col">
            {isAnalyzing ? (
              <>
                <p className="text-gray-600 mb-3 text-sm flex-shrink-0">
                  Click on any key or value to generate access code
                </p>
                {validation.isValid && validation.parsedJson ? (
                  <div className="flex-1 overflow-auto">
                    <JsonRenderer
                      jsonData={validation.parsedJson}
                      onPathSelect={handlePathSelect}
                    />
                  </div>
                ) : (
                  <div className="text-sm text-red-600 flex-shrink-0">Invalid JSON, please edit.</div>
                )}
              </>
            ) : (
              <div className="flex-1">
                <Editor
                  height="100%"
                  defaultLanguage="json"
                  value={jsonText}
                  onChange={(value) => setJsonText(value || '')}
                  theme="light"
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    formatOnPaste: true,
                    formatOnType: true,
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* 右侧 Code 区域 */}
        <div className="w-1/2 bg-white rounded-xl shadow-lg p-4 flex flex-col min-w-0 overflow-hidden">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Generated Access Code
          </h2>

          {selectedPath ? (
            <>
              {/* Selected Path Info */}
              <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Selected Path: </span>
                <code className="font-mono text-blue-600 bg-white px-2 py-1 rounded">
                  {selectedPath.path.length === 0 ? 'root' : selectedPath.path.join(' → ')}
                </code>
                <span className="ml-3 text-sm text-gray-500">
                  Type: {selectedPath.type}
                </span>
              </div>

              {/* Language Selector */}
              <div className="mb-3">
                <LanguageSelector
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={handleLanguageChange}
                />
              </div>

              {/* Code Viewer */}
              <div className="flex-1 min-h-0">
                <CodeViewer
                  code={generatedCode}
                  language={selectedLanguage}
                />
              </div>
            </>
          ) : (
            <div className="text-gray-500 text-sm italic">
              Please select a path from the JSON to generate code.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
