import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollToTopProps {
  behavior?: 'auto' | 'smooth';
  delay?: number;
  excludePaths?: string[];
  children?: React.ReactNode;
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ 
  behavior = 'auto',
  delay = 0,
  excludePaths = [],
  children 
}) => {
  const location = useLocation();
  const previousPathname = useRef<string>('');

  useEffect(() => {
    // Only scroll to top if the pathname actually changed (not just state or hash)
    const pathnameChanged = previousPathname.current !== location.pathname;
    
    // Update the previous pathname
    previousPathname.current = location.pathname;
    
    // Don't scroll if pathname didn't change
    if (!pathnameChanged) return;

    // Check if current path should be excluded
    const shouldExclude = excludePaths.some(path => 
      location.pathname.startsWith(path)
    );

    if (shouldExclude) return;

    // Scroll to top function
    const scrollToTop = () => {
      try {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: behavior
        });
      } catch (error) {
        // Fallback for older browsers
        window.scrollTo(0, 0);
      }
    };

    // Apply delay if specified
    if (delay > 0) {
      const timeoutId = setTimeout(scrollToTop, delay);
      return () => clearTimeout(timeoutId);
    } else {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        scrollToTop();
      });
    }
  }, [location.pathname, behavior, delay, excludePaths]); // Only depend on pathname

  return children ? <>{children}</> : null;
};

export default ScrollToTop;