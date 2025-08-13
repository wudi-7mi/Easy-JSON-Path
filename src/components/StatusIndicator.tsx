import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface StatusIndicatorProps {
  isValid: boolean;
  isValidating?: boolean;
  error?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  isValid,
  isValidating = false,
  error
}) => {
  const getStatusContent = () => {
    if (isValidating) {
      return {
        icon: <Clock className="w-5 h-5" />,
        bgColor: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        label: 'Validating...'
      };
    }
    if (isValid) {
      return {
        icon: <CheckCircle className="w-5 h-5" />,
        bgColor: 'bg-green-100',
        iconColor: 'text-green-600',
        label: 'Valid JSON'
      };
    }
    return {
      icon: <XCircle className="w-5 h-5" />,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      label: 'Invalid JSON'
    };
  };

  const status = getStatusContent();

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-md ${status.bgColor}`}>
      <div className={`flex items-center ${status.iconColor}`}>
        {status.icon}
      </div>
      <span className="font-medium">{status.label}</span>
      {error && (
        <span className="text-sm text-red-500 ml-2 whitespace-nowrap">
          {error}
        </span>
      )}
    </div>
  );
};
