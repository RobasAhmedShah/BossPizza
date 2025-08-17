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
    <div className={`bg-white/95 backdrop-blur-md ${className}`}>
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6">
        <div 
          ref={navRef}
          className="flex overflow-x-auto space-x-1 py-1 scrollbar-hide scroll-smooth"
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
                  flex-shrink-0 relative px-2 py-1 rounded-lg font-medium transition-all duration-200 
                  whitespace-nowrap hover:scale-105 active:scale-95 min-w-[60px] text-xs
                  ${isActive
                    ? 'bg-primary-500 text-white shadow-md transform scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                  ${isUserScrolling && isActive ? 'ring-1 ring-primary-300' : ''}
                `}
                disabled={isUserScrolling && isActive}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-sm">{category.icon}</span>
                  <span className="hidden sm:inline leading-tight">{category.name}</span>
                </div>
                
                {/* Active indicator dot */}
                {isActive && (
                  <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryNavigation;