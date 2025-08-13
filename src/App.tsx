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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          JSON Path Analyzer
        </h1>
        <p className="text-gray-600 text-lg">
          Analyze JSON structure and generate access code in multiple languages
        </p>
      </div>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* 左侧 JSON 编辑 / 分析区 */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-start">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            JSON Input
          </h2>

          {/* 状态指示器 + 按钮 */}
          <div className="mb-4 flex items-center space-x-4">
            <StatusIndicator
              isValid={validation.isValid}
              error={validation.error}
            />
            {((!isAnalyzing && validation.isValid) || isAnalyzing) && (
              <button
                onClick={handleAnalyze}
                className="px-4 py-2 text-sm rounded-md font-medium text-white bg-green-600 hover:bg-green-700 hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200"
              >
                {isAnalyzing ? 'Edit JSON' : 'Analyze JSON'}
              </button>
            )}
          </div>

          {/* 编辑器 / 渲染器 */}
          <div className="w-[600px] max-w-full">
            {isAnalyzing ? (
              <>
                <p className="text-gray-600 mb-4 text-sm">
                  Click on any key or value to generate access code
                </p>
                {validation.isValid && validation.parsedJson ? (

                  <JsonRenderer
                    jsonData={validation.parsedJson}
                    onPathSelect={handlePathSelect}
                  />
                ) : (
                  <div className="text-sm text-red-600">Invalid JSON, please edit.</div>
                )}
              </>
            ) : (
              <Editor
                height="300px"
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
            )}
          </div>
        </div>

        {/* 右侧 Code 区域 */}
        <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Generated Access Code
          </h2>

          {selectedPath ? (
            <>
              {/* Selected Path Info */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Selected Path: </span>
                <code className="font-mono text-blue-600 bg-white px-2 py-1 rounded">
                  {selectedPath.path.length === 0 ? 'root' : selectedPath.path.join(' → ')}
                </code>
                <span className="ml-3 text-sm text-gray-500">
                  Type: {selectedPath.type}
                </span>
              </div>

              {/* Language Selector */}
              <div className="mb-4">
                <LanguageSelector
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={handleLanguageChange}
                />
              </div>

              {/* Code Viewer */}
              <CodeViewer
                code={generatedCode}
                language={selectedLanguage}
              />
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
