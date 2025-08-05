import React, { useRef, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategoryNavigationProps {
  categories: Category[];
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
  isUserScrolling?: boolean;
  className?: string;
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  categories,
  activeCategory,
  onCategoryClick,
  isUserScrolling = false,
  className = '',
}) => {
  const navRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll active category into view
  useEffect(() => {
    if (activeButtonRef.current && navRef.current && !isUserScrolling) {
      const nav = navRef.current;
      const button = activeButtonRef.current;
      
      const navRect = nav.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      
      const isVisible = 
        buttonRect.left >= navRect.left && 
        buttonRect.right <= navRect.right;

      if (!isVisible) {
        const scrollLeft = button.offsetLeft - nav.offsetWidth / 2 + button.offsetWidth / 2;
        nav.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [activeCategory, isUserScrolling]);

  return (
    <div className={`bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-sm ${className}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={navRef}
          className="flex overflow-x-auto space-x-2 py-2 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => {
            const isActive = activeCategory === category.id;
            
            return (
              <button
                key={category.id}
                ref={isActive ? activeButtonRef : null}
                onClick={() => onCategoryClick(category.id)}
                className={`
                  flex-shrink-0 relative px-2 py-1.5 rounded-2xl font-semibold transition-all duration-300 
                  whitespace-nowrap hover:scale-105 active:scale-95 min-w-[80px] border-2
                  ${isActive
                    ? 'bg-primary-500 text-white border-primary-500 shadow-lg transform scale-105'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                  }
                  ${isUserScrolling && isActive ? 'ring-2 ring-primary-300 ring-opacity-50' : ''}
                `}
                disabled={isUserScrolling && isActive}
              >
                                  <div className="flex flex-col items-center space-y-0.5">
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-xs leading-tight">{category.name}</span>
                  </div>
                
                {/* Active indicator dot */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-sm" />
                )}
              </button>
            );
          })}
        </div>
        
        {/* Scroll indicators */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white/95 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/95 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

export default CategoryNavigation;