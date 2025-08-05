import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface UseScrollRestorationOptions {
  behavior?: 'auto' | 'smooth';
  delay?: number;
  excludePaths?: string[];
}

export const useScrollRestoration = (options: UseScrollRestorationOptions = {}) => {
  const { 
    behavior = 'auto', 
    delay = 0,
    excludePaths = []
  } = options;
  
  const location = useLocation();
  const previousPathname = useRef<string>('');

  useEffect(() => {
    // Only scroll to top if the pathname actually changed (not just state or hash)
    const pathnameChanged = previousPathname.current !== location.pathname;
    
    // Update the previous pathname
    previousPathname.current = location.pathname;
    
    // Don't scroll if pathname didn't change
    if (!pathnameChanged) return;

    // Check if current path should be excluded from scroll restoration
    const shouldExclude = excludePaths.some(path => 
      location.pathname.startsWith(path)
    );

    if (shouldExclude) return;

    // Function to scroll to top
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: behavior
      });
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
  }, [location.pathname, behavior, delay, excludePaths]); // Only depend on pathname, not the full location

  // Manual scroll to top function
  const scrollToTop = (customBehavior?: 'auto' | 'smooth') => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: customBehavior || behavior
    });
  };

  return { scrollToTop };
};

// Hook for preserving scroll position within the same page
export const useScrollPreservation = () => {
  const location = useLocation();

  useEffect(() => {
    // Save scroll position before navigation
    const saveScrollPosition = () => {
      sessionStorage.setItem(
        `scroll-${location.pathname}`,
        JSON.stringify({
          x: window.scrollX,
          y: window.scrollY,
          timestamp: Date.now()
        })
      );
    };

    // Restore scroll position if available and recent (within 5 minutes)
    const restoreScrollPosition = () => {
      const saved = sessionStorage.getItem(`scroll-${location.pathname}`);
      if (saved) {
        try {
          const { x, y, timestamp } = JSON.parse(saved);
          const isRecent = Date.now() - timestamp < 5 * 60 * 1000; // 5 minutes
          
          if (isRecent) {
            window.scrollTo(x, y);
          } else {
            // Remove old scroll position
            sessionStorage.removeItem(`scroll-${location.pathname}`);
          }
        } catch (error) {
          console.warn('Failed to restore scroll position:', error);
        }
      }
    };

    // Save position when leaving page
    window.addEventListener('beforeunload', saveScrollPosition);
    
    // Restore position when entering page (with small delay for content to load)
    const timeoutId = setTimeout(restoreScrollPosition, 100);

    return () => {
      window.removeEventListener('beforeunload', saveScrollPosition);
      clearTimeout(timeoutId);
    };
  }, [location.pathname]);
};

// Hook for smooth scrolling to elements
export const useSmoothScroll = () => {
  const scrollToElement = (
    elementId: string, 
    offset: number = 0,
    behavior: 'auto' | 'smooth' = 'smooth'
  ) => {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: behavior
      });
    }
  };

  const scrollToTop = (behavior: 'auto' | 'smooth' = 'smooth') => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: behavior
    });
  };

  return { scrollToElement, scrollToTop };
};