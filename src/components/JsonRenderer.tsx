import React, { useState, useCallback } from 'react';
import type { JsonPath } from '../types';

interface JsonRendererProps {
  jsonData: any;
  onPathSelect: (path: JsonPath) => void;
}

export const JsonRenderer: React.FC<JsonRendererProps> = ({ jsonData, onPathSelect }) => {
  const [hoveredPath, setHoveredPath] = useState<string>('');
  const [selectedPath, setSelectedPath] = useState<string>('');

  const renderValue = useCallback((
    value: any,
    path: string[] = [],
    depth: number = 0
  ): React.ReactNode => {
    const pathKey = path.join('.');
    const isHovered = hoveredPath === pathKey;
    const isSelected = selectedPath === pathKey;

    const handleClick = (e: React.MouseEvent, type?: string) => {
      e.stopPropagation();
      setSelectedPath(pathKey);
      onPathSelect({
        path,
        value,
        type: type || (Array.isArray(value) ? 'array' : typeof value as any)
      });
    };

    const baseClasses = `
      transition-all duration-200 rounded px-1 py-0.5 cursor-pointer
      ${isHovered ? 'shadow-md transform scale-105' : ''}
      ${isSelected ? 'ring-2 ring-offset-1' : ''}
    `;

    // 基本类型
    if (value === null) return (
      <span
        className={`${baseClasses} text-gray-500 italic ${isHovered ? 'bg-green-50' : ''} ${isSelected ? 'bg-green-100 ring-green-300' : ''}`}
        onClick={(e) => handleClick(e, 'null')}
        onMouseEnter={() => setHoveredPath(pathKey)}
        onMouseLeave={() => setHoveredPath('')}
      >null</span>
    );

    if (typeof value === 'string') return (
      <span
        className={`${baseClasses} text-green-700 ${isHovered ? 'bg-green-50' : ''} ${isSelected ? 'bg-green-100 ring-green-300' : ''}`}
        onClick={(e) => handleClick(e, 'string')}
        onMouseEnter={() => setHoveredPath(pathKey)}
        onMouseLeave={() => setHoveredPath('')}
      >"{value}"</span>
    );

    if (typeof value === 'number') return (
      <span
        className={`${baseClasses} text-red-600 font-mono ${isHovered ? 'bg-green-50' : ''} ${isSelected ? 'bg-green-100 ring-green-300' : ''}`}
        onClick={(e) => handleClick(e, 'number')}
        onMouseEnter={() => setHoveredPath(pathKey)}
        onMouseLeave={() => setHoveredPath('')}
      >{value}</span>
    );

    if (typeof value === 'boolean') return (
      <span
        className={`${baseClasses} text-purple-600 font-mono ${isHovered ? 'bg-green-50' : ''} ${isSelected ? 'bg-green-100 ring-green-300' : ''}`}
        onClick={(e) => handleClick(e, 'boolean')}
        onMouseEnter={() => setHoveredPath(pathKey)}
        onMouseLeave={() => setHoveredPath('')}
      >{value.toString()}</span>
    );

    const isRoot = path.length === 0;

    // 数组
    if (Array.isArray(value)) {
      const pathStart = path.join('.') + '_start';
      const pathEnd = path.join('.') + '_end';

      return (
        <div className={isRoot ? '' : 'ml-2'}>
          <span
            className={`${baseClasses} text-gray-600 font-bold ${isHovered ? 'bg-blue-50' : ''} ${isSelected ? 'bg-blue-100 ring-blue-300' : ''}`}
            style={isRoot ? { paddingLeft: 2 } : undefined}
            onClick={(e) => { e.stopPropagation(); setSelectedPath(pathStart); onPathSelect({ path, value, type: 'array' }); }}
            onMouseEnter={() => setHoveredPath(pathStart)}
            onMouseLeave={() => setHoveredPath('')}
          >[</span>

          <div className="ml-2 relative">
            {/* 左边竖线 */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300"></div>
            {value.map((item, index) => (
              <div key={index} className="my-1 relative pl-3">
                {/* 每个项目的连接线 */}
                <div className="absolute left-0 top-2 w-2 h-px bg-gray-300"></div>
                {renderValue(item, [...path, index.toString()], depth + 1)}
              </div>
            ))}
          </div>

          <span
            className={`${baseClasses} text-gray-600 font-bold ${isHovered ? 'bg-blue-50' : ''} ${isSelected ? 'bg-blue-100 ring-blue-300' : ''}`}
            style={isRoot ? { paddingLeft: 2 } : undefined}
            onClick={(e) => { e.stopPropagation(); setSelectedPath(pathEnd); onPathSelect({ path, value, type: 'array' }); }}
            onMouseEnter={() => setHoveredPath(pathEnd)}
            onMouseLeave={() => setHoveredPath('')}
          >]</span>
        </div>
      );
    }

    // 对象
    if (typeof value === 'object' && value !== null) {
      const entries = Object.entries(value);
      const pathStart = path.join('.') + '_start';
      const pathEnd = path.join('.') + '_end';

      return (
        <div className={isRoot ? '' : 'ml-2'}>
          <span
            className={`${baseClasses} text-gray-600 font-bold ${isHovered ? 'bg-blue-50' : ''} ${isSelected ? 'bg-blue-100 ring-blue-300' : ''}`}
            style={isRoot ? { paddingLeft: 2 } : undefined}
            onClick={(e) => { e.stopPropagation(); setSelectedPath(pathStart); onPathSelect({ path, value, type: 'object' }); }}
            onMouseEnter={() => setHoveredPath(pathStart)}
            onMouseLeave={() => setHoveredPath('')}
          >{'{'}</span>

          <div className="ml-2 relative">
            {/* 左边竖线 */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300"></div>
            {entries.map(([key, val]) => {
              const keyPath = [...path, key].join('.');
              const isKeyHovered = hoveredPath === keyPath;
              const isKeySelected = selectedPath === keyPath;
              const isComplex = typeof val === 'object' && val !== null;

              return (
                <div key={key} className="my-1 relative pl-3">
                  {/* 每个项目的连接线 */}
                  <div className="absolute left-0 top-2 w-2 h-px bg-gray-300"></div>
                  {/* key */}
                  <span
                    className={`text-blue-600 font-medium transition-all duration-200 rounded px-1 py-0.5 cursor-pointer
                      ${isKeyHovered ? 'bg-blue-50 shadow-md transform scale-105' : ''}
                      ${isKeySelected ? 'bg-blue-100 ring-2 ring-blue-300' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPath(keyPath);
                      onPathSelect({ path: [...path, key], value: val, type: Array.isArray(val) ? 'array' : typeof val as any });
                    }}
                    onMouseEnter={() => setHoveredPath(keyPath)}
                    onMouseLeave={() => setHoveredPath('')}
                  >
                    "{key}":
                  </span>

                  {/* value */}
                  {isComplex ? (
                    <div className="ml-2">{renderValue(val, [...path, key], depth + 1)}</div>
                  ) : (
                    <span className="ml-1">
                      {renderValue(val, [...path, key], depth + 1)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <span
            className={`${baseClasses} text-gray-600 font-bold ${isHovered ? 'bg-blue-50' : ''} ${isSelected ? 'bg-blue-100 ring-blue-300' : ''}`}
            style={isRoot ? { paddingLeft: 2 } : undefined}
            onClick={(e) => { e.stopPropagation(); setSelectedPath(pathEnd); onPathSelect({ path, value, type: 'object' }); }}
            onMouseEnter={() => setHoveredPath(pathEnd)}
            onMouseLeave={() => setHoveredPath('')}
          >{'}'}</span>
        </div>
      );
    }

    return null;
  }, [hoveredPath, selectedPath, onPathSelect]);

  return (
    <div className="bg-white p-2 lg:p-4 rounded-lg shadow-sm border border-gray-200 font-mono text-xs overflow-auto h-full">
      <div className="whitespace-nowrap min-w-0">
        {renderValue(jsonData)}
      </div>
    </div>
  );
};
