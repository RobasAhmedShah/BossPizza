import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
}) => {
  const [isAnimating, setIsAnimating] = useState<'increment' | 'decrement' | null>(null);

  const handleIncrement = () => {
    if (value < max) {
      setIsAnimating('increment');
      onChange(value + 1);
      setTimeout(() => setIsAnimating(null), 200);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      setIsAnimating('decrement');
      onChange(value - 1);
      setTimeout(() => setIsAnimating(null), 200);
    }
  };

  const sizeClasses = {
    sm: {
      button: 'w-6 h-6',
      text: 'w-8 text-sm',
      icon: 'h-3 w-3',
    },
    md: {
      button: 'w-8 h-8',
      text: 'w-10 text-base',
      icon: 'h-4 w-4',
    },
    lg: {
      button: 'w-10 h-10',
      text: 'w-12 text-lg',
      icon: 'h-5 w-5',
    },
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleDecrement}
        disabled={value <= min}
        className={`
          ${sizeClasses[size].button}
          rounded-full border border-gray-300 flex items-center justify-center
          transition-all duration-200 ease-out
          hover:bg-gray-50 hover:scale-110 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          ${isAnimating === 'decrement' ? 'animate-micro-bounce bg-red-50 border-red-300' : ''}
        `}
      >
        <Minus className={`${sizeClasses[size].icon} text-gray-600`} />
      </button>
      
      <span 
        className={`
          ${sizeClasses[size].text} text-center font-medium text-gray-900
          transition-all duration-200 ease-out
          ${isAnimating ? 'animate-number-change' : ''}
        `}
      >
        {value}
      </span>
      
      <button
        onClick={handleIncrement}
        disabled={value >= max}
        className={`
          ${sizeClasses[size].button}
          rounded-full border border-gray-300 flex items-center justify-center
          transition-all duration-200 ease-out
          hover:bg-gray-50 hover:scale-110 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          ${isAnimating === 'increment' ? 'animate-micro-bounce bg-green-50 border-green-300' : ''}
        `}
      >
        <Plus className={`${sizeClasses[size].icon} text-gray-600`} />
      </button>
    </div>
  );
};

export default QuantitySelector;