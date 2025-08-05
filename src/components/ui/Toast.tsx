import React, { useEffect, useState } from 'react';
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 4000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto-close timer
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertCircle,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };

  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    info: 'text-blue-500',
    warning: 'text-yellow-500',
  };

  const Icon = icons[type];

  return (
    <div
      className={`
        fixed top-4 right-4 max-w-sm w-full bg-white border rounded-lg shadow-lg z-50
        transition-all duration-300 ease-out
        ${isVisible && !isLeaving 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
        }
        ${colors[type]}
      `}
    >
      <div className="p-4">
        <div className="flex items-start">
          <Icon className={`h-5 w-5 mt-0.5 mr-3 ${iconColors[type]}`} />
          
          <div className="flex-1">
            <h4 className="font-semibold">{title}</h4>
            {message && (
              <p className="mt-1 text-sm opacity-90">{message}</p>
            )}
          </div>
          
          <button
            onClick={handleClose}
            className="ml-3 p-1 hover:bg-black/10 rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="h-1 bg-black/10 rounded-b-lg overflow-hidden">
        <div 
          className="h-full bg-current opacity-50 animate-progress"
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
};

export default Toast;