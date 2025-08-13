import type { JsonPath } from '../types';

export function generatePythonPath(path: string[]): string {
  if (path.length === 0) return 'j';
  
  return 'j' + path.map(key => {
    // 如果是数组索引（数字）
    if (/^\d+$/.test(key)) {
      return `[${key}]`;
    }
    // 如果是对象键
    return `["${key}"]`;
  }).join('');
}

export function generateJavaScriptPath(path: string[]): string {
  if (path.length === 0) return 'j';
  
  return 'j' + path.map(key => {
    if (/^\d+$/.test(key)) {
      return `[${key}]`;
    }
    // 如果键是有效的标识符，使用点表示法
    if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)) {
      return `.${key}`;
    }
    return `["${key}"]`;
  }).join('');
}

// C++ (nlohmann::json)
// 访问对象键使用 j["key"], 数组索引使用 j[0]
export function generateCppPath(path: string[]): string {
  if (path.length === 0) return 'j';
  return 'j' + path.map(key => {
    if (/^\d+$/.test(key)) {
      return `[${key}]`;
    }
    return `["${key}"]`;
  }).join('');
}

// Go (以 map[string]any / []any 为心智模型，仅生成索引表达式，不插入类型断言)
export function generateGoPath(path: string[]): string {
  if (path.length === 0) return 'j';
  return 'j' + path.map(key => {
    if (/^\d+$/.test(key)) {
      return `[${key}]`;
    }
    return `["${key}"]`;
  }).join('');
}

// C# (Newtonsoft.Json 的 JToken/JObject/JArray 索引器风格)
export function generateCSharpPath(path: string[]): string {
  if (path.length === 0) return 'j';
  return 'j' + path.map(key => {
    if (/^\d+$/.test(key)) {
      return `[${key}]`;
    }
    return `["${key}"]`;
  }).join('');
}

// Java (Jackson JsonNode 风格：对象键用 .get("key")，数组索引用 .get(index))
export function generateJavaPath(path: string[]): string {
  if (path.length === 0) return 'j';
  return 'j' + path.map(key => {
    if (/^\d+$/.test(key)) {
      return `.get(${key})`;
    }
    return `.get("${key}")`;
  }).join('');
}

export function extractJsonPaths(obj: any, currentPath: string[] = []): JsonPath[] {
  const paths: JsonPath[] = [];
  
  if (obj === null) {
    paths.push({ path: [...currentPath], value: obj, type: 'null' });
  } else if (Array.isArray(obj)) {
    paths.push({ path: [...currentPath], value: obj, type: 'array' });
    obj.forEach((item, index) => {
      paths.push(...extractJsonPaths(item, [...currentPath, index.toString()]));
    });
  } else if (typeof obj === 'object') {
    paths.push({ path: [...currentPath], value: obj, type: 'object' });
    Object.keys(obj).forEach(key => {
      paths.push(...extractJsonPaths(obj[key], [...currentPath, key]));
    });
  } else {
    const type = typeof obj as 'string' | 'number' | 'boolean';
    paths.push({ path: [...currentPath], value: obj, type });
  }
  
  return paths;
}