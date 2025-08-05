import React from 'react';

interface ScrollIndicatorProps {
  isUserScrolling: boolean;
  isManualNavigation: boolean;
  activeSection: string;
  className?: string;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  isUserScrolling,
  isManualNavigation,
  activeSection,
  className = '',
}) => {
  if (!isUserScrolling && !isManualNavigation) return null;

  return (
    <div className={`fixed top-20 right-4 z-40 ${className}`}>
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 border border-gray-200">
        <div className="flex items-center space-x-2">
          {isUserScrolling && (
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          )}
          {isManualNavigation && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          )}
          <span className="text-xs font-medium text-gray-700 capitalize">
            {activeSection.replace(/([A-Z])/g, ' $1').trim()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScrollIndicator;