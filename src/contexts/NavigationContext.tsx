import React, { createContext, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sessionManager } from '../lib/SessionManager';

interface NavigationContextType {
  restoreScrollPosition: (path?: string) => void;
  saveScrollPosition: (path?: string, position?: number) => void;
  restoreNavigationState: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Save current path and search params whenever location changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const paramsObject: Record<string, string> = {};
    
    searchParams.forEach((value, key) => {
      paramsObject[key] = value;
    });

    sessionManager.updateNavigation(location.pathname, paramsObject);
  }, [location.pathname, location.search]);

  // Restore navigation state on mount
  useEffect(() => {
    restoreNavigationState();
  }, []);

  // Save scroll position when user scrolls
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;
      sessionManager.updateScrollPosition(location.pathname, scrollPosition);
    };

    const throttledHandleScroll = throttle(handleScroll, 100);
    window.addEventListener('scroll', throttledHandleScroll);
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [location.pathname]);

  const restoreScrollPosition = (path?: string) => {
    const targetPath = path || location.pathname;
    const session = sessionManager.loadSession();
    
    if (session?.navigation?.scrollPositions?.[targetPath]) {
      const position = session.navigation.scrollPositions[targetPath];
      
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        window.scrollTo({
          top: position,
          behavior: 'auto' // Use auto for restoration to avoid jarring animations
        });
        console.log(`📍 Restored scroll position for ${targetPath}: ${position}px`);
      }, 100);
    }
  };

  const saveScrollPosition = (path?: string, position?: number) => {
    const targetPath = path || location.pathname;
    const scrollPosition = position !== undefined ? position : window.pageYOffset;
    
    sessionManager.updateScrollPosition(targetPath, scrollPosition);
  };

  const restoreNavigationState = () => {
    const session = sessionManager.loadSession();
    
    if (session?.navigation) {
      const { currentPath, searchParams } = session.navigation;
      
      // Only restore if we're currently on the home page and there's a different cached path
      if (location.pathname === '/' && currentPath && currentPath !== '/') {
        const searchParamsString = Object.keys(searchParams).length > 0 
          ? '?' + new URLSearchParams(searchParams).toString()
          : '';
        
        const fullPath = currentPath + searchParamsString;
        
        console.log(`🧭 Restoring navigation to: ${fullPath}`);
        
        // Use replace to avoid adding to history
        navigate(fullPath, { replace: true });
        
        // Restore scroll position after navigation
        setTimeout(() => {
          restoreScrollPosition(currentPath);
        }, 200);
      } else if (location.pathname === currentPath) {
        // Same page, just restore scroll position
        restoreScrollPosition();
      }
    }
  };

  return (
    <NavigationContext.Provider value={{
      restoreScrollPosition,
      saveScrollPosition,
      restoreNavigationState,
    }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

// Utility function to throttle scroll events
function throttle<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastExecTime = 0;
  
  return ((...args: Parameters<T>) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > wait) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, wait - (currentTime - lastExecTime));
    }
  }) as T;
}
