import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
  text?: string;
  progress?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  text,
  progress,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'text-primary-600',
    white: 'text-white',
    gray: 'text-gray-600',
  };

  if (progress !== undefined) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              className={colorClasses[color]}
              style={{
                strokeDasharray: `${2 * Math.PI * 28}`,
                strokeDashoffset: `${2 * Math.PI * 28 * (1 - progress / 100)}`,
                transition: 'stroke-dashoffset 0.3s ease-out',
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-700">{Math.round(progress)}%</span>
          </div>
        </div>
        {text && (
          <p className="text-sm text-gray-600 animate-pulse">{text}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}>
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="32"
            strokeDashoffset="32"
            className="animate-spin-dash"
          />
        </svg>
      </div>
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;