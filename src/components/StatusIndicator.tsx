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
    <div className={`flex items-start gap-2 px-3 py-1 rounded-md ${status.bgColor} transition-all duration-300 ease-in-out animate-in fade-in slide-in-from-top-2`}>
      <div className={`flex items-center justify-center ${status.iconColor} flex-shrink-0 w-5 h-5`}>
        <div className="animate-in zoom-in duration-200">
          {status.icon}
        </div>
      </div>
      <div className="flex flex-col min-w-0">
        <span className="font-medium whitespace-nowrap">{status.label}</span>
        {error && (
          <span className="text-sm text-red-500 break-words animate-in fade-in slide-in-from-left-2 duration-300 delay-100">
            {error}
          </span>
        )}
      </div>
    </div>
  );
};
