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
    _: boolean = true,
    depth: number = 0
  ): React.ReactNode => {
    const pathKey = path.join('.');
    const isHovered = hoveredPath === pathKey;
    const isSelected = selectedPath === pathKey;

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedPath(pathKey);
      onPathSelect({
        path,
        value,
        type: Array.isArray(value) ? 'array' : typeof value as any
      });
    };

    const baseClasses = `
      transition-all duration-200 rounded px-1 py-0.5 cursor-pointer
      ${isHovered ? 'bg-blue-50 shadow-md transform scale-105' : ''}
      ${isSelected ? 'bg-blue-100 ring-2 ring-blue-300' : ''}
    `;

    if (value === null) {
      return (
        <span 
          className={`${baseClasses} text-gray-500 italic`}
          onClick={handleClick}
          onMouseEnter={() => setHoveredPath(pathKey)}
          onMouseLeave={() => setHoveredPath('')}
        >
          null
        </span>
      );
    }

    if (typeof value === 'string') {
      return (
        <span 
          className={`${baseClasses} text-green-700`}
          onClick={handleClick}
          onMouseEnter={() => setHoveredPath(pathKey)}
          onMouseLeave={() => setHoveredPath('')}
        >
          "{value}"
        </span>
      );
    }

    if (typeof value === 'number') {
      return (
        <span 
          className={`${baseClasses} text-red-600 font-mono`}
          onClick={handleClick}
          onMouseEnter={() => setHoveredPath(pathKey)}
          onMouseLeave={() => setHoveredPath('')}
        >
          {value}
        </span>
      );
    }

    if (typeof value === 'boolean') {
      return (
        <span 
          className={`${baseClasses} text-purple-600 font-mono`}
          onClick={handleClick}
          onMouseEnter={() => setHoveredPath(pathKey)}
          onMouseLeave={() => setHoveredPath('')}
        >
          {value.toString()}
        </span>
      );
    }

    if (Array.isArray(value)) {
      return (
        <div className="inline-block">
          <span 
            className={`${baseClasses} text-gray-600 font-bold inline-block`}
            onClick={handleClick}
            onMouseEnter={() => setHoveredPath(pathKey)}
            onMouseLeave={() => setHoveredPath('')}
          >
            [
          </span>
          <div className="ml-4 border-l-2 border-gray-200 pl-4">
            {value.map((item, index) => (
              <div key={index} className="my-1">
                <span className="text-gray-400 text-sm mr-2">{index}:</span>
                {renderValue(item, [...path, index.toString()], index === value.length - 1, depth + 1)}
                {index < value.length - 1 && <span className="text-gray-600">,</span>}
              </div>
            ))}
          </div>
          <span className="text-gray-600 font-bold">]</span>
        </div>
      );
    }

    if (typeof value === 'object') {
      const entries = Object.entries(value);
      return (
        <div className="inline-block">
          <span 
            className={`${baseClasses} text-gray-600 font-bold inline-block`}
            onClick={handleClick}
            onMouseEnter={() => setHoveredPath(pathKey)}
            onMouseLeave={() => setHoveredPath('')}
          >
            {'{'}
          </span>
          <div className="ml-4 border-l-2 border-gray-200 pl-4">
            {entries.map(([key, val], index) => (
              <div key={key} className="my-1 flex flex-wrap items-start">
                <span 
                  className={`text-blue-600 font-medium mr-2 transition-all duration-200 rounded px-1 py-0.5 cursor-pointer
                    ${hoveredPath === [...path, key].join('.') ? 'bg-blue-50 shadow-md transform scale-105' : ''}
                    ${selectedPath === [...path, key].join('.') ? 'bg-blue-100 ring-2 ring-blue-300' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const keyPath = [...path, key];
                    const keyPathKey = keyPath.join('.');
                    setSelectedPath(keyPathKey);
                    onPathSelect({
                      path: keyPath,
                      value: val,
                      type: Array.isArray(val) ? 'array' : typeof val as any
                    });
                  }}
                  onMouseEnter={() => setHoveredPath([...path, key].join('.'))}
                  onMouseLeave={() => setHoveredPath('')}
                >
                  "{key}":
                </span>
                {renderValue(val, [...path, key], index === entries.length - 1, depth + 1)}
                {index < entries.length - 1 && <span className="text-gray-600">,</span>}
              </div>
            ))}
          </div>
          <span className="text-gray-600 font-bold">{'}'}</span>
        </div>
      );
    }

    return null;
  }, [hoveredPath, selectedPath, onPathSelect]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 font-mono text-sm overflow-auto max-h-96">
      <div className="whitespace-pre-wrap break-words">
        {renderValue(jsonData)}
      </div>
    </div>
  );
};