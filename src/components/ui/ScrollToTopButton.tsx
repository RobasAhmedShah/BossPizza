import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

interface ScrollToTopButtonProps {
  showAfter?: number;
  behavior?: 'auto' | 'smooth';
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  showAfter = 300,
  behavior = 'smooth',
  className = '',
  position = 'bottom-right'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > showAfter) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [showAfter]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: behavior
    });
  };

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 transform -translate-x-1/2'
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed ${positionClasses[position]} z-50
        w-12 h-12 bg-primary-600 hover:bg-primary-700 
        text-white rounded-full shadow-lg hover:shadow-xl
        flex items-center justify-center
        transition-all duration-300 ease-out
        hover:scale-110 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        animate-fade-in
        ${className}
      `}
      aria-label="Scroll to top"
      title="Scroll to top"
    >
      <ChevronUp className="h-6 w-6" />
    </button>
  );
};

export default ScrollToTopButton;