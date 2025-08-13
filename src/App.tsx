import { useState, useEffect } from 'react';
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
  const [resetKey, setResetKey] = useState(0);

  const validation = useJsonValidation(jsonText);

  // 生成默认代码的函数
  const getDefaultCode = (language: string) => {
    switch (language) {
      case 'python':
        return '# Select a JSON path to generate access code';
      case 'javascript':
        return '// Select a JSON path to generate access code';
      case 'cpp':
        return '// Select a JSON path to generate access code';
      case 'go':
        return '// Select a JSON path to generate access code';
      case 'csharp':
        return '// Select a JSON path to generate access code';
      case 'java':
        return '// Select a JSON path to generate access code';
      default:
        return '// Select a JSON path to generate access code';
    }
  };

  // 初始化默认代码
  useEffect(() => {
    setGeneratedCode(getDefaultCode(selectedLanguage));
  }, []);

  // 当语言改变时，如果没有选中的路径，显示对应语言的默认代码
  useEffect(() => {
    if (!selectedPath && selectedLanguage) {
      setGeneratedCode(getDefaultCode(selectedLanguage));
    }
  }, [selectedLanguage, selectedPath]); // 恢复selectedPath依赖，但添加条件检查

  const handleAnalyze = () => {
    if (isAnalyzing) {
      // 当从分析模式切换到编辑模式时，重置右侧Code区域的状态
      setSelectedPath(null);
      setSelectedLanguage('python'); // 重置语言选择器为默认语言
      setGeneratedCode(getDefaultCode('python')); // 使用Python的默认代码
      setResetKey(prev => prev + 1); // 重置CodeViewer组件的状态
    }
    setIsAnalyzing(prev => !prev);
  };

  const handlePathSelect = async (path: JsonPath, language?: string) => {
    setSelectedPath(path);

    const targetLanguage = language || selectedLanguage;
    
    let code = '';
    switch (targetLanguage) {
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
      handlePathSelect(selectedPath, language);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <div className="text-center py-4 flex-shrink-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          Easy Json Path
        </h1>
        <p className="text-gray-600 text-sm">
          Analyze JSON structure and generate access code to any node by one-click. 
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

          {/* Language Selector */}
          <div className="mb-3">
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={handleLanguageChange}
            />
          </div>

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
            </>
          ) : (
            <div className="mb-3 p-2 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Selected Path: </span>
              <span className="text-gray-400 italic"></span>
              <span className="ml-3 text-sm text-gray-500">
                Type: <span className="text-gray-400 italic"></span>
              </span>
            </div>
          )}

          {/* Code Viewer */}
          <div className="flex-1 min-h-0">
            <CodeViewer
              code={generatedCode}
              language={selectedLanguage}
              resetKey={resetKey}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
