import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { StatusIndicator } from './components/StatusIndicator';
import { JsonRenderer } from './components/JsonRenderer';
import { CodeViewer } from './components/CodeViewer';
import { LanguageSelector } from './components/LanguageSelector';
import { useJsonValidation } from './hooks/useJsonValidation';
import { generatePythonPath, generateJavaScriptPath, generateCppPath, generateGoPath, generateCSharpPath, generateJavaPath } from './utils/jsonPathGenerator';
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
    // 如果已经选择了路径，重新生成代码
    if (selectedPath) {
      handlePathSelect(selectedPath);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              JSON Path Analyzer
            </h1>
            <p className="text-gray-600 text-lg">
              Analyze JSON structure and generate access code in multiple languages
            </p>
          </div>

          {/* JSON Editor + Renderer Combined Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {isAnalyzing ? 'Interactive JSON View' : 'JSON Input'}
            </h2>
            {!isAnalyzing && (
              <div className="mb-4 flex justify-center">
                <StatusIndicator
                  isValid={validation.isValid}
                  error={validation.error}
                />
              </div>
            )}

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
              <div className="flex items-start space-x-4">
                <div className="flex-1">
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
                </div>
              </div>
            )}

            {/* Analyze/Edit Button */}
            <div className="mt-4 flex items-center justify-center space-x-4">
              <button
                onClick={handleAnalyze}
                disabled={!isAnalyzing && !validation.isValid}
                className={`
                  px-6 py-3 rounded-lg font-medium text-white transition-all duration-200
                  ${(!isAnalyzing && validation.isValid) || isAnalyzing
                    ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
                    : 'bg-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {isAnalyzing ? 'Edit JSON' : 'Analyze JSON'}
              </button>
            </div>
          </div>

          {/* Code Generation Section */}
          {isAnalyzing && selectedPath && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Generated Access Code
              </h2>

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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;