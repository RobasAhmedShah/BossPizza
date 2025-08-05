import React, { useState, useRef, useEffect } from 'react';

interface FloatingLabelProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
}

const FloatingLabel: React.FC<FloatingLabelProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
  suggestions = [],
  onSuggestionSelect,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isFloating = isFocused || value.length > 0;

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(value.toLowerCase())
  ).slice(0, 5);

  useEffect(() => {
    setShowSuggestions(isFocused && filteredSuggestions.length > 0 && value.length > 0);
  }, [isFocused, filteredSuggestions.length, value.length]);

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    onSuggestionSelect?.(suggestion);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          placeholder={isFocused ? placeholder : ''}
          className={`
            w-full px-4 pt-6 pb-2 border-2 rounded-lg transition-all duration-300 ease-out
            focus:outline-none focus:ring-0 peer
            ${error 
              ? 'border-red-300 focus:border-red-500 animate-shake' 
              : 'border-gray-300 focus:border-primary-500 hover:border-gray-400'
            }
            ${isFloating ? 'pt-6 pb-2' : 'py-4'}
          `}
        />
        
        <label
          className={`
            absolute left-4 transition-all duration-300 ease-out pointer-events-none
            ${isFloating 
              ? 'top-2 text-xs text-primary-600 font-medium' 
              : 'top-1/2 -translate-y-1/2 text-gray-500'
            }
            ${error && isFloating ? 'text-red-500' : ''}
          `}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-1 text-sm text-red-600 animate-slide-down">
          {error}
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-slide-down">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FloatingLabel;