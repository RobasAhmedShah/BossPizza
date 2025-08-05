import { useEffect, useRef, useState, useCallback } from 'react';

interface UseSmartScrollProps {
  sections: Record<string, HTMLElement>;
  threshold?: number;
  debounceDelay?: number;
  scrollOffset?: number;
}

export const useSmartScroll = ({
  sections,
  threshold = 0.3,
  debounceDelay = 250,
  scrollOffset = 180,
}: UseSmartScrollProps) => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isManualNavigation, setIsManualNavigation] = useState(false);
  
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  const lastScrollY = useRef(0);
  const scrollDirection = useRef<'up' | 'down'>('down');

  // Debounced function to update active section
  const updateActiveSection = useCallback(() => {
    if (isManualNavigation) return;

    const scrollPosition = window.scrollY + scrollOffset;
    let currentSection = '';
    let maxVisibility = 0;

    // Find the section with maximum visibility
    Object.entries(sections).forEach(([sectionId, element]) => {
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + window.scrollY;
      const elementBottom = elementTop + rect.height;
      
      // Calculate visibility percentage
      const visibleTop = Math.max(scrollPosition, elementTop);
      const visibleBottom = Math.min(scrollPosition + window.innerHeight, elementBottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const visibility = visibleHeight / rect.height;

      // Use threshold-based detection with scroll direction consideration
      if (visibility > threshold && visibility > maxVisibility) {
        maxVisibility = visibility;
        currentSection = sectionId;
      }
    });

    // Fallback: if no section meets threshold, use position-based detection
    if (!currentSection) {
      Object.entries(sections).forEach(([sectionId, element]) => {
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + window.scrollY;
        const elementBottom = elementTop + rect.height;

        if (scrollDirection.current === 'down') {
          // When scrolling down, activate section when its top crosses the threshold
          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            currentSection = sectionId;
          }
        } else {
          // When scrolling up, activate section when its bottom is visible
          if (scrollPosition + window.innerHeight > elementTop && scrollPosition < elementBottom) {
            currentSection = sectionId;
          }
        }
      });
    }

    if (currentSection && currentSection !== activeSection) {
      setActiveSection(currentSection);
    }
  }, [sections, threshold, scrollOffset, activeSection, isManualNavigation]);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine scroll direction
      if (currentScrollY > lastScrollY.current) {
        scrollDirection.current = 'down';
      } else if (currentScrollY < lastScrollY.current) {
        scrollDirection.current = 'up';
      }
      lastScrollY.current = currentScrollY;

      // Set user scrolling flag
      setIsUserScrolling(true);

      // Clear existing timeouts
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Reset user scrolling flag after scroll stops
      scrollTimeoutRef.current = setTimeout(() => {
        setIsUserScrolling(false);
        
        // Update active section after debounce delay
        debounceTimeoutRef.current = setTimeout(() => {
          updateActiveSection();
        }, debounceDelay);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial section detection
    updateActiveSection();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [updateActiveSection, debounceDelay]);

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = sections[sectionId];
    if (!element) return;

    // Set manual navigation flag to prevent auto-updates during scroll
    setIsManualNavigation(true);
    setActiveSection(sectionId);

    const elementPosition = element.offsetTop - scrollOffset;
    
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });

    // Reset manual navigation flag after scroll completes
    setTimeout(() => {
      setIsManualNavigation(false);
    }, 1000);
  }, [sections, scrollOffset]);

  return {
    activeSection,
    isUserScrolling,
    isManualNavigation,
    scrollToSection,
  };
};