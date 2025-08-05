import React, { useState } from 'react';
import { Loader2, Check } from 'lucide-react';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  success?: boolean;
  className?: string;
  successText?: string;
  loadingText?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  success = false,
  className = '',
  successText = 'Success!',
  loadingText = 'Loading...',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading || isSuccess) return;

    setIsLoading(true);
    try {
      await onClick?.(event);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    } catch (error) {
      console.error('Button action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white shadow-lg hover:shadow-xl',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
    ghost: 'text-primary-600 hover:bg-primary-50',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  const currentLoading = loading || isLoading;
  const currentSuccess = success || isSuccess;

  return (
    <button
      onClick={handleClick}
      disabled={disabled || currentLoading || currentSuccess}
      className={`
        relative inline-flex items-center justify-center font-medium rounded-lg
        transition-all duration-300 ease-out
        hover:scale-105 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${currentSuccess ? 'bg-green-600 hover:bg-green-600' : ''}
        ${className}
      `}
    >
      <span
        className={`
          flex items-center space-x-2 transition-all duration-300
          ${currentLoading || currentSuccess ? 'opacity-0' : 'opacity-100'}
        `}
      >
        {children}
      </span>

      {/* Loading State */}
      {currentLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          {loadingText}
        </span>
      )}

      {/* Success State */}
      {currentSuccess && (
        <span className="absolute inset-0 flex items-center justify-center animate-success-bounce">
          <Check className="w-5 h-5 mr-2" />
          {successText}
        </span>
      )}
    </button>
  );
};

export default AnimatedButton;