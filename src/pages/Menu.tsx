import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, ShoppingCart, X, ArrowRight, Filter, Grid, List } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../hooks/useToast';
import { useSmartScroll } from '../hooks/useSmartScroll';
import { useMenu } from '../hooks/useMenu';
import { MenuItem, MenuItemSize, Deal } from '../lib/supabase';
import CreateYourOwnPizza from '../components/CreateYourOwnPizza';
import PizzaSizeSelector from '../components/PizzaSizeSelector';
import DealCustomizer from '../components/DealCustomizer';
import CategoryNavigation from '../components/ui/CategoryNavigation';
import ScrollIndicator from '../components/ui/ScrollIndicator';
import QuantitySelector from '../components/ui/QuantitySelector';
import AnimatedButton from '../components/ui/AnimatedButton';
import ScrollReveal from '../components/ui/ScrollReveal';
import { MenuItemSkeleton } from '../components/ui/SkeletonLoader';
import ToastContainer from '../components/ui/ToastContainer';
import Confetti from '../components/ui/Confetti';

const Menu: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreatePizza, setShowCreatePizza] = useState(false);
  const [selectedPizza, setSelectedPizza] = useState<MenuItem | null>(null);
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showDealCustomizer, setShowDealCustomizer] = useState(false);
  const [animatingItems, setAnimatingItems] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState<'all' | 'under15' | '15to25' | 'over25'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedPizzaId, setSelectedPizzaId] = useState<string | null>(null);
  const [hasScrolledToPizza, setHasScrolledToPizza] = useState(false);
  
  const { addItem, items, totalItems, totalPrice, updateQuantity, removeItem, generateItemKey } = useCart();
  const { toasts, addToast } = useToast();
  const { categories, menuItems, deals, isLoading, error } = useMenu();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const menuSectionsRef = useRef<{ [key: string]: HTMLElement }>({});

  // Check if mobile and set initial view mode - Optimized to prevent unnecessary re-renders
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(prev => {
        if (prev !== mobile) {
          // Only update view mode if it's actually changing
          if (mobile && viewMode === 'grid') {
            setViewMode('list');
          }
          return mobile;
        }
        return prev;
      });
    };
    
    checkMobile();
    setIsInitialized(true);
    
    // Debounced resize handler to prevent excessive updates
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkMobile, 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [viewMode]);

  // Initialize smart scroll hook - Memoized to prevent unnecessary re-initialization
  const { activeSection, isUserScrolling, isManualNavigation, scrollToSection } = useSmartScroll({
    sections: menuSectionsRef.current,
    threshold: 0.3,
    debounceDelay: 250,
    scrollOffset: isMobile ? 200 : 200, // Increased offset to account for sticky header
  });

  // Handle URL parameter for pizza selection
  useEffect(() => {
    const pizzaId = searchParams.get('pizza');
    
    // Reset scroll state when URL changes
    if (pizzaId !== selectedPizzaId) {
      setHasScrolledToPizza(false);
    }
    
    if (pizzaId && !isLoading && Object.keys(menuItems).length > 0 && !hasScrolledToPizza) {
      setSelectedPizzaId(pizzaId);
      
      // Flatten menuItems to search through all items
      const allMenuItems = Object.values(menuItems).flat();
      const pizza = allMenuItems.find((item: MenuItem) => item.id === pizzaId);
      if (pizza) {
        setHasScrolledToPizza(true);
        
        // Wait for DOM to be ready and then scroll
        const scrollToPizza = () => {
          // First scroll to the category
          const categorySlug = pizza.category.slug;
          scrollToSection(categorySlug);
          
          // Then scroll to the specific pizza with a longer delay
          setTimeout(() => {
            const pizzaElement = document.getElementById(`pizza-${pizzaId}`);
            if (pizzaElement) {
              pizzaElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              });
              
              // Add highlight effect
              pizzaElement.classList.add('highlight-pizza');
              setTimeout(() => {
                pizzaElement.classList.remove('highlight-pizza');
              }, 3000);
            } else {
              // If element not found, try again after a short delay
              setTimeout(scrollToPizza, 200);
            }
          }, 1000);
        };
        
        // Start the scroll process with a longer initial delay
        setTimeout(scrollToPizza, 500);
      }
    }
  }, [searchParams, menuItems, isLoading, scrollToSection, hasScrolledToPizza, selectedPizzaId]);

  // Transform categories for navigation - Memoized to prevent unnecessary re-computation
  const navigationCategories = React.useMemo(() => 
    categories
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      .map(cat => ({
        id: cat.slug,
        name: cat.name,
        icon: cat.icon
      })), [categories]
  );

  // Handle category navigation
  const handleCategoryClick = (categoryId: string) => {
    // Try the smart scroll first
    scrollToSection(categoryId);
    
    // Fallback: Use browser's native scrollIntoView if smart scroll fails
    setTimeout(() => {
      const element = menuSectionsRef.current[categoryId];
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 100);
  };

  // Handle pizza selection - show size selector for signature pizzas
  const handlePizzaClick = (item: MenuItem) => {
    // Check if it's a signature pizza (has multiple sizes)
    if (item.category.slug === 'signature-pizzas' && item.sizes.length > 1) {
      setSelectedPizza(item);
      setShowSizeSelector(true);
    } else {
      // For items with single size, add directly
      handleDirectAddToCart(item, item.sizes[0]);
    }
  };

  // Handle deal selection - show deal customizer
  const handleDealClick = (deal: Deal) => {
    setSelectedDeal(deal);
    setShowDealCustomizer(true);
  };

  // Enhanced add to cart with size selection
  const handleAddToCartWithSize = (item: MenuItem, selectedSize: MenuItemSize) => {
    handleDirectAddToCart(item, selectedSize);
  };

  // Direct add to cart for items without size selection
  const handleDirectAddToCart = async (item: MenuItem, selectedSize: MenuItemSize, event?: React.MouseEvent) => {
    let rect = { left: 0, top: 0 };
    
    // Only get button position if event is provided
    if (event?.currentTarget) {
      const button = event.currentTarget as HTMLElement;
      rect = button.getBoundingClientRect();
    }
    
    // Create floating animation element
    const floatingItem = document.createElement('div');
    floatingItem.className = 'floating-cart-item';
    floatingItem.innerHTML = `<img src="${item.image_url}" alt="${item.name}" />`;
    floatingItem.style.cssText = `
      position: fixed;
      left: ${rect.left}px;
      top: ${rect.top}px;
      width: 40px;
      height: 40px;
      z-index: 1000;
      pointer-events: none;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(floatingItem);
    
    // Animate to cart area
    const cartArea = totalItems > 0 && !isMobile ? 
      document.querySelector('.fixed-cart-panel') : 
      document.querySelector('[data-cart-icon]');
    
    if (cartArea) {
      const cartRect = cartArea.getBoundingClientRect();
      
      floatingItem.animate([
        { 
          transform: 'translate(0, 0) scale(1)',
          opacity: 1
        },
        { 
          transform: `translate(${cartRect.left - rect.left + 50}px, ${cartRect.top - rect.top + 100}px) scale(0.3)`,
          opacity: 0.8
        }
      ], {
        duration: 800,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }).onfinish = () => {
        document.body.removeChild(floatingItem);
      };
    }

    // Add visual feedback to button
    setAnimatingItems(prev => [...prev, item.id]);
    setTimeout(() => {
      setAnimatingItems(prev => prev.filter(id => id !== item.id));
    }, 600);

    // Add item to cart
    addItem({
      id: item.id,
      name: item.name,
      price: selectedSize.price,
      image: item.image_url,
      category: item.category.slug,
      options: {
        size: selectedSize.size_name,
        price: selectedSize.price
      }
    });

    // Show success toast
    addToast({
      type: 'success',
      title: 'Added to Cart!',
      message: `${item.name} has been added to your cart`,
      duration: 3000,
    });

    // Show confetti for first item
    if (totalItems === 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  // Handle deal add to cart
  const handleDealAddToCart = (deal: Deal, selectedPizzas: { [key: string]: MenuItem }) => {
    addItem({
      id: deal.id,
      name: deal.name,
      price: deal.price,
      image: 'https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'deals',
      options: {
        dealItems: deal.items_included,
        selectedPizzas: selectedPizzas
      }
    });

    addToast({
      type: 'success',
      title: 'Deal Added to Cart!',
      message: `${deal.name} has been added to your cart`,
      duration: 3000,
    });

    if (totalItems === 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  // Memoized filtered items function to prevent unnecessary re-computation
  const filteredItems = React.useCallback((categoryItems: MenuItem[]) => {
    let filtered = categoryItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply price filter
    if (priceFilter !== 'all') {
      filtered = filtered.filter(item => {
        const minPrice = Math.min(...item.sizes.map(s => s.price));
        switch (priceFilter) {
          case 'under15':
            return minPrice < 200;
          case '15to25':
            return minPrice >= 200 && minPrice <= 500;
          case 'over25':
            return minPrice > 500;
          default:
            return true;
        }
      });
    }

    // Apply sorting - but maintain original sort_order if no specific sorting is applied
    if (sortBy === 'name' && !searchTerm && priceFilter === 'all') {
      // Keep original sort_order from database
      filtered.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    } else {
      // Apply user-selected sorting
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'price':
            const aMinPrice = Math.min(...a.sizes.map(s => s.price));
            const bMinPrice = Math.min(...b.sizes.map(s => s.price));
            return aMinPrice - bMinPrice;
          case 'rating':
            return b.rating - a.rating;
          case 'name':
          default:
            return a.name.localeCompare(b.name);
        }
      });
    }

    return filtered;
  }, [searchTerm, priceFilter, sortBy]);

  const handleSliderCheckout = () => {
    navigate('/cart');
  };

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Failed to load menu</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }



  // Get signature pizzas for deal customizer - Memoized
  const signaturePizzas = React.useMemo(() => 
    menuItems['signature-pizzas'] || [], [menuItems]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} />
      
      {/* Confetti */}
      <Confetti active={showConfetti} />

      {/* Pizza Size Selector Modal */}
      {selectedPizza && (
        <PizzaSizeSelector
          pizza={selectedPizza}
          isOpen={showSizeSelector}
          onClose={() => {
            setShowSizeSelector(false);
            setSelectedPizza(null);
          }}
          onAddToCart={handleAddToCartWithSize}
        />
      )}

      {/* Deal Customizer Modal */}
      {selectedDeal && (
        <DealCustomizer
          deal={selectedDeal}
          availablePizzas={signaturePizzas}
          isOpen={showDealCustomizer}
          onClose={() => {
            setShowDealCustomizer(false);
            setSelectedDeal(null);
          }}
          onAddToCart={handleDealAddToCart}
        />
      )}

      {/* Create Your Own Pizza Modal */}
      {showCreatePizza && (
        <CreateYourOwnPizza
          onClose={() => setShowCreatePizza(false)}
        />
      )}

      {/* Scroll Indicator */}
      <ScrollIndicator
        isUserScrolling={isUserScrolling}
        isManualNavigation={isManualNavigation}
        activeSection={activeSection}
      />

      {/* Main Layout Container */}
      <div className="flex min-h-screen">
        {/* Main Content Area - Full width on mobile, adjusted for cart on desktop */}
        <div className={`w-full transition-all duration-300 ${
          totalItems > 0 && !isMobile ? 'lg:mr-96' : ''
        }`}>
                     {/* Compact Menu Header */}
           <div className="bg-white/95 backdrop-blur-md shadow-sm sticky top-16 md:top-20 z-40 border-b border-gray-100">
             <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-1">
               {/* Compact Title and Controls Row */}
               <div className="flex items-center justify-between gap-4 mb-1">
                 <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 flex-shrink-0">Our Menu</h1>
                 
                 {/* Compact Search Bar */}
                 <div className="flex-1 max-w-md relative">
                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                   <input
                     type="text"
                     placeholder="Search menu..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-9 pr-8 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm bg-gray-50 focus:bg-white"
                     style={{ fontSize: '16px' }}
                     autoComplete="off"
                     spellCheck="false"
                   />
                   {searchTerm && (
                     <button
                       onClick={() => setSearchTerm('')}
                       className="absolute right-2 top-1/2 transform -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600"
                     >
                       <X className="h-3 w-3" />
                     </button>
                   )}
                 </div>

                 {/* Compact Controls */}
                 <div className="flex items-center gap-2">
                   <button
                     onClick={() => setShowFilters(!showFilters)}
                     className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                       showFilters 
                         ? 'bg-primary-500 text-white' 
                         : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                     }`}
                   >
                     <Filter className="h-3 w-3" />
                     <span className="hidden sm:inline">Filter</span>
                   </button>

                   <select
                     value={sortBy}
                     onChange={(e) => setSortBy(e.target.value as any)}
                     className="px-2 py-1 bg-gray-100 border-0 rounded-lg text-xs font-medium text-gray-600 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary-500 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHN2Zz4=')] bg-no-repeat bg-right-2 bg-center pr-6"
                   >
                     <option value="name">Name</option>
                     <option value="price">Price</option>
                     <option value="rating">Rating</option>
                   </select>

                   {/* Desktop View Mode Toggle */}
                   <div className="hidden lg:flex items-center space-x-1">
                     <button
                       onClick={() => setViewMode('grid')}
                       className={`p-1 rounded transition-colors ${
                         viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'
                       }`}
                     >
                       <Grid className="h-3 w-3" />
                     </button>
                     <button
                       onClick={() => setViewMode('list')}
                       className={`p-1 rounded transition-colors ${
                         viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'
                       }`}
                     >
                       <List className="h-3 w-3" />
                     </button>
                   </div>
                 </div>
               </div>

               {/* Compact Expandable Filters */}
               {showFilters && (
                 <div className="bg-gray-50 rounded-lg p-2 mb-1 border border-gray-200">
                   <div className="flex items-center gap-2 flex-wrap">
                     <span className="text-xs font-medium text-gray-700 mr-2">Price:</span>
                     {[
                       { value: 'all', label: 'All' },
                       { value: 'under15', label: '<PKR 200' },
                       { value: '15to25', label: 'PKR 200-500' },
                       { value: 'over25', label: '>PKR 500' }
                     ].map((option) => (
                       <button
                         key={option.value}
                         onClick={() => setPriceFilter(option.value as any)}
                         className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                           priceFilter === option.value
                             ? 'bg-primary-500 text-white'
                             : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                         }`}
                       >
                         {option.label}
                       </button>
                     ))}
                   </div>
                 </div>
               )}

               {/* Search Results Count */}
               {searchTerm && (
                 <div className="text-xs text-gray-500 mb-1">
                   {Object.values(menuItems).flat().filter(item =>
                     item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     item.description.toLowerCase().includes(searchTerm.toLowerCase())
                   ).length} results for "{searchTerm}"
                 </div>
               )}
             </div>

             {/* Compact Category Navigation */}
             <div className="border-t border-gray-100">
               <CategoryNavigation
                 categories={navigationCategories}
                 activeCategory={activeSection}
                 onCategoryClick={handleCategoryClick}
                 isUserScrolling={isUserScrolling}
               />
             </div>
           </div>

                     {/* Menu Content - Compact spacing */}
           <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4">
                         {/* Create Your Own Pizza Section - Compact */}
             {!isLoading && isInitialized && (
               <ScrollReveal delay={50}>
                 <section className="mb-4 sm:mb-6 lg:mb-8">
                   <div className="bg-gradient-to-br from-primary-50 to-orange-50 rounded-xl p-3 sm:p-4 lg:p-5 border border-primary-200 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                    {/* Animated background elements */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-200/20 to-orange-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary-300/30 to-orange-300/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-orange-300/30 to-red-300/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
                      <div className="flex-1 text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start mb-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-orange-500 rounded-xl flex items-center justify-center mr-3">
                            <span className="text-xl sm:text-2xl">🍕</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                                Create Your Own Pizza
                              </h2>
                              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-0.5 rounded-full text-xs font-bold animate-pulse">
                                NEW
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">
                              Design your perfect pizza with premium ingredients
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                            <span>Choose your base</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span>Add your toppings</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span>Customize size</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => setShowCreatePizza(true)}
                          className="group bg-gradient-to-r from-primary-600 to-orange-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center space-x-2"
                        >
                          <span>Start Creating</span>
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                    </div>
                  </div>
                </section>
              </ScrollReveal>
            )}
            
            {isLoading || !isInitialized ? (
              // Loading Skeletons
              <div className="space-y-8 sm:space-y-12 lg:space-y-16">
                {navigationCategories.slice(0, 3).map((category) => (
                  <div key={category.id} className="space-y-4 sm:space-y-6">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded animate-pulse" />
                      <div className="h-5 sm:h-6 lg:h-8 w-24 sm:w-32 lg:w-48 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className={`grid gap-3 sm:gap-4 lg:gap-6 ${
                      viewMode === 'grid' 
                        ? 'grid-cols-1 sm:grid-cols-2' 
                        : 'grid-cols-1'
                    }`}>
                      {Array.from({ length: 4 }).map((_, index) => (
                        <MenuItemSkeleton key={index} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              [
                // Sort categories by their sort_order and then map through them
                ...categories
                  .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                  .map((category) => {
                    const categoryItems = menuItems[category.slug] || [];
                    const items = filteredItems(categoryItems);
                    
                    if (items.length === 0 && searchTerm) return null;
                    
                    // Special handling for drinks category - use database sort order
                    if (category.slug === 'drinks') {
                      // Use the database sort order which is already organized by category
                      const sortedDrinks = categoryItems.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
                    
                    return (
                      <ScrollReveal key={category.slug} delay={100}>
                        <section
                          ref={(el) => {
                            if (el) menuSectionsRef.current[category.slug] = el;
                          }}
                          className="mb-3 sm:mb-4 lg:mb-6 scroll-mt-52 md:scroll-mt-56"
                          id={`section-${category.slug}`}
                        >
                        {/* Section Header */}
                        <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4 px-1">
                          <div className="flex items-center min-w-0 flex-1">
                            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center mr-3">
                              <span className="text-lg sm:text-xl lg:text-2xl">{category.icon}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 truncate">
                                {category.name}
                              </h2>
                                  <p className="text-sm text-gray-500 mt-1">All {sortedDrinks.length} drinks organized by type</p>
                                </div>
                              </div>
                              <div className="flex-shrink-0 ml-2">
                                <span className="inline-flex items-center px-2.5 py-1 bg-gray-50 text-gray-600 rounded-full text-xs sm:text-sm font-medium border border-gray-200">
                                  {sortedDrinks.length}
                                </span>
                              </div>
                            </div>

                            {/* Menu Items Grid/List - All drinks in organized order */}
                            <div className={`grid gap-2 sm:gap-2 lg:gap-3 ${
                              viewMode === 'grid' 
                                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                                : 'grid-cols-1'
                            }`}>
                              {sortedDrinks.map((item: MenuItem, index: number) => (
                                <ScrollReveal key={item.id} delay={index * 10}>
                                  <div 
                                    id={`pizza-${item.id}`}
                                    className={`
                                    bg-white rounded-2xl shadow-sm hover:shadow-xl active:shadow-lg
                                    transition-all duration-500 overflow-hidden group 
                                    hover:-translate-y-1 active:translate-y-0 menu-item-card
                                    border border-gray-100 hover:border-primary-300
                                    ${viewMode === 'list' ? 'flex' : 'flex flex-col'}
                                    relative cursor-pointer transform-gpu
                                  `}>
                                    {/* Image Section */}
                                    <div className={`relative overflow-hidden bg-gray-50 ${
                                      viewMode === 'list' 
                                        ? 'w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 flex-shrink-0' 
                                        : 'w-full aspect-[4/3] sm:aspect-[3/2]'
                                    }`} style={{ contain: 'layout' }}>
                                      <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 menu-item-image"
                                        loading="lazy"
                                        sizes={viewMode === 'list' ? '80px' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.style.display = 'none';
                                          target.nextElementSibling?.classList.remove('hidden');
                                        }}
                                      />
                                      {/* Fallback placeholder */}
                                      <div className="hidden absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                        <span className="text-gray-500 text-2xl">🥤</span>
                                      </div>
                                      
                                      {/* Enhanced overlay with better gradient */}
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                      
                                      {/* Shimmer effect on hover */}
                                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%]" />
                                      
                                      {/* Quick add button overlay */}
                                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handlePizzaClick(item);
                                          }}
                                          className="bg-white/95 backdrop-blur-sm text-primary-600 p-3 rounded-full shadow-xl hover:scale-110 transition-transform duration-200 flex items-center justify-center"
                                        >
                                          <Plus className="h-5 w-5" />
                                        </button>
                                      </div>
                                    </div>
                                    
                                    {/* Content Section */}
                                    <div className={`p-3 sm:p-4 flex flex-col justify-between flex-1 ${
                                      viewMode === 'list' ? 'min-w-0' : ''
                                    }`}>
                                      <div className="flex-1 mb-3">
                                        <h3 className={`font-bold text-gray-900 mb-2 leading-tight ${
                                          viewMode === 'list' 
                                            ? 'text-sm sm:text-base line-clamp-2' 
                                            : 'text-base sm:text-lg lg:text-xl'
                                        }`}>
                                          {item.name}
                                        </h3>
                                        <p className={`text-gray-600 leading-relaxed ${
                                          viewMode === 'list' 
                                            ? 'text-xs line-clamp-1' 
                                            : 'text-sm mb-2 line-clamp-2'
                                        }`}>
                                          {item.description}
                                        </p>
                                      </div>
                                      
                                      {/* Price and Add Button */}
                                      <div className={`flex items-center justify-between ${
                                        viewMode === 'list' ? 'mt-2' : 'mt-auto'
                                      }`}>
                                        <div className="flex-1">
                                          <div className="flex items-baseline space-x-2">
                                            <span className={`font-bold text-primary-600 ${
                                              viewMode === 'list' 
                                                ? 'text-base' 
                                                : 'text-lg sm:text-xl'
                                            }`}>
                                              PKR {item.sizes[0]?.price.toLocaleString() || 'N/A'}
                                            </span>
                                          </div>
                                          
                                          <div className="flex items-center space-x-1 mt-1">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span className="text-xs text-green-600 font-medium">25-30 min</span>
                                          </div>
                                        </div>
                                        
                                        <button
                                          onClick={() => handlePizzaClick(item)}
                                          className={`
                                            relative overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 
                                            text-white rounded-2xl font-bold shadow-lg
                                            hover:from-primary-600 hover:to-primary-700 hover:shadow-xl
                                            active:scale-95 transition-all duration-300 
                                            flex items-center justify-center
                                            touch-manipulation focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                                            ${animatingItems.includes(item.id) ? 'animate-pulse bg-gradient-to-r from-green-500 to-green-600' : ''}
                                            ${viewMode === 'list' 
                                              ? 'w-9 h-9 rounded-full' 
                                              : 'px-3 py-2.5 min-h-[44px]'
                                            }
                                            hover:scale-105 group/btn
                                          `}
                                        >
                                          {/* Animated background */}
                                          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                                          
                                          {viewMode === 'list' ? (
                                            <Plus className="relative z-10 transition-transform duration-200 h-3.5 w-3.5 group-hover/btn:rotate-90" />
                                          ) : (
                                            <div className="relative z-10 flex items-center space-x-2">
                                              <Plus className="h-4 w-4 group-hover/btn:rotate-90 transition-transform duration-200" />
                                              <span className="text-sm font-bold">Add</span>
                                            </div>
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </ScrollReveal>
                              ))}
                            </div>
                          </section>
                        </ScrollReveal>
                      );
                    }
                    
                    return (
                      <ScrollReveal key={category.slug} delay={100}>
                        <section
                          ref={(el) => {
                            if (el) menuSectionsRef.current[category.slug] = el;
                          }}
                          className="mb-3 sm:mb-4 lg:mb-6 scroll-mt-52 md:scroll-mt-56"
                          id={`section-${category.slug}`}
                        >
                        {/* Section Header */}
                        <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4 px-1">
                          <div className="flex items-center min-w-0 flex-1">
                            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center mr-3">
                              <span className="text-lg sm:text-xl lg:text-2xl">{category.icon}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 truncate">
                                {category.name}
                              </h2>
                              

                            </div>
                          </div>

                          {/* Item count - More compact on mobile */}
                          <div className="flex-shrink-0 ml-2">
                            <span className="inline-flex items-center px-2.5 py-1 bg-gray-50 text-gray-600 rounded-full text-xs sm:text-sm font-medium border border-gray-200">
                              {items.length}
                            </span>
                          </div>
                        </div>

                        {/* Menu Items Grid/List - Enhanced mobile layout */}
                        <div className={`grid gap-2 sm:gap-2 lg:gap-3 ${
                          viewMode === 'grid' 
                            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                            : 'grid-cols-1'
                        }`}>
                          {items.map((item, index) => (
                            <ScrollReveal key={item.id} delay={index * 20}>
                              <div 
                                id={`pizza-${item.id}`}
                                className={`
                                bg-white rounded-2xl shadow-sm hover:shadow-xl active:shadow-lg
                                transition-all duration-500 overflow-hidden group 
                                hover:-translate-y-1 active:translate-y-0 menu-item-card
                                border border-gray-100 hover:border-primary-300
                                ${viewMode === 'list' ? 'flex' : 'flex flex-col'}
                                relative cursor-pointer transform-gpu
                              `}>
                                {/* Image Section - Optimized aspect ratios */}
                                <div className={`relative overflow-hidden bg-gray-50 ${
                                  viewMode === 'list' 
                                    ? 'w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 flex-shrink-0' 
                                    : 'w-full aspect-[4/3] sm:aspect-[3/2]'
                                }`} style={{ contain: 'layout' }}>
                                  <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 menu-item-image"
                                    loading="lazy"
                                    sizes={viewMode === 'list' ? '80px' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      target.nextElementSibling?.classList.remove('hidden');
                                    }}
                                  />
                                  {/* Fallback placeholder */}
                                  <div className="hidden absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                    <span className="text-gray-500 text-2xl">🍕</span>
                                  </div>
                                  
                                  {/* Enhanced overlay with better gradient */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                  
                                  {/* Shimmer effect on hover */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%]" />
                                  
                                  
                                 
                                  {/* Quick add button overlay */}
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePizzaClick(item);
                                      }}
                                      className="bg-white/95 backdrop-blur-sm text-primary-600 p-3 rounded-full shadow-xl hover:scale-110 transition-transform duration-200 flex items-center justify-center"
                                    >
                                      <Plus className="h-5 w-5" />
                                    </button>
                                  </div>
                                </div>
                                
                                {/* Content Section - Foodpanda style */}
                                <div className={`p-3 sm:p-4 flex flex-col justify-between flex-1 ${
                                  viewMode === 'list' ? 'min-w-0' : ''
                                }`}>
                                  <div className="flex-1 mb-3">
                                    <h3 className={`font-bold text-gray-900 mb-2 leading-tight ${
                                      viewMode === 'list' 
                                        ? 'text-sm sm:text-base line-clamp-2' 
                                        : 'text-base sm:text-lg lg:text-xl'
                                    }`}>
                                      {item.name}
                                    </h3>
                                    <p className={`text-gray-600 leading-relaxed ${
                                      viewMode === 'list' 
                                        ? 'text-xs line-clamp-1' 
                                        : 'text-sm mb-2 line-clamp-2'
                                    }`}>
                                      {item.description}
                                    </p>
                                    
                                    {/* Ingredients/Features tags */}
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {item.is_popular && (
                                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                                          Popular
                                        </span>
                                      )}
                                      {item.rating >= 4.5 && (
                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                          Top Rated
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Price and Add Button - Foodpanda style */}
                                  <div className={`flex items-center justify-between ${
                                    viewMode === 'list' ? 'mt-2' : 'mt-auto'
                                  }`}>
                                    <div className="flex-1">
                                      {/* Price display */}
                                      <div className="flex items-baseline space-x-2">
                                        <span className={`font-bold text-primary-600 ${
                                          viewMode === 'list' 
                                            ? 'text-base' 
                                            : 'text-lg sm:text-xl'
                                        }`}>
                                          PKR {item.sizes.length === 1 ? item.sizes[0].price.toLocaleString() : Math.min(...item.sizes.map(s => s.price)).toLocaleString()}
                                        </span>
                                        {item.sizes.length > 1 && (
                                          <span className="text-xs text-gray-500 font-medium">onwards</span>
                                        )}
                                      </div>
                                      
                                      {/* Delivery time estimate */}
                                      <div className="flex items-center space-x-1 mt-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-xs text-green-600 font-medium">25-30 min</span>
                                      </div>
                                    </div>
                                    
                                    <button
                                      onClick={() => handlePizzaClick(item)}
                                      className={`
                                        relative overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 
                                        text-white rounded-2xl font-bold shadow-lg
                                        hover:from-primary-600 hover:to-primary-700 hover:shadow-xl
                                        active:scale-95 transition-all duration-300 
                                        flex items-center justify-center
                                        touch-manipulation focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                                        ${animatingItems.includes(item.id) ? 'animate-pulse bg-gradient-to-r from-green-500 to-green-600' : ''}
                                        ${viewMode === 'list' 
                                          ? 'w-9 h-9 rounded-full' 
                                          : 'px-3 py-2.5 min-h-[44px]'
                                        }
                                        hover:scale-105 group/btn
                                      `}
                                    >
                                      {/* Animated background */}
                                      <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                                      
                                      {viewMode === 'list' ? (
                                        <Plus className="relative z-10 transition-transform duration-200 h-3.5 w-3.5 group-hover/btn:rotate-90" />
                                      ) : (
                                        <div className="relative z-10 flex items-center space-x-2">
                                          <Plus className="h-4 w-4 group-hover/btn:rotate-90 transition-transform duration-200" />
                                          <span className="text-sm font-bold">
                                          {item.sizes.length > 1 ? 'Choose' : 'Add'}
                                        </span>
                                        </div>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </ScrollReveal>
                          ))}
                        </div>

                        {/* Enhanced No Results Message */}
                        {searchTerm && Object.values(menuItems).every(items => filteredItems(items).length === 0) && (
                          <div className="text-center py-8 sm:py-12 px-4">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-2xl sm:text-3xl">🔍</span>
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No items found</h3>
                            <p className="text-sm sm:text-base text-gray-500 mb-6 max-w-sm mx-auto leading-relaxed">
                              We couldn't find any items matching your search. Try different keywords or clear your filters.
                            </p>
                            <button
                              onClick={() => {
                                setSearchTerm('');
                                setPriceFilter('all');
                              }}
                              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 touch-manipulation focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                            >
                              <span className="mr-2">✨</span>
                              Clear Filters
                            </button>
                          </div>
                        )}

                        {/* Enhanced Mobile Bottom Padding */}
                        {totalItems > 0 && isMobile && (
                          <div className="h-20 sm:h-24" />
                        )}
                      </section>
                    </ScrollReveal>
                  );
                }),
                
                // Add Deals Section
                deals.length > 0 && (
                  <ScrollReveal key="deals" delay={100}>
                    <section
                      ref={(el) => {
                        if (el) menuSectionsRef.current['deals'] = el;
                      }}
                                               className="mb-3 sm:mb-4 lg:mb-6 scroll-mt-52 md:scroll-mt-56"
                      id="section-deals"
                    >
                      {/* Section Header */}
                                              <div className="flex items-center justify-between mb-1 sm:mb-2 lg:mb-3 px-1">
                        <div className="flex items-center min-w-0 flex-1">
                          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center mr-3">
                            <span className="text-lg sm:text-xl lg:text-2xl">🔥</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 truncate">
                              Special Deals
                            </h2>
                            

                          </div>
                        </div>

                        <div className="flex-shrink-0 ml-2">
                          <span className="inline-flex items-center px-2.5 py-1 bg-gray-50 text-gray-600 rounded-full text-xs sm:text-sm font-medium border border-gray-200">
                            {deals.length}
                          </span>
                        </div>
                      </div>

                      {/* Deals Grid */}
                      <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
                        {deals.map((deal, index) => (
                          <ScrollReveal key={deal.id} delay={index * 100}>
                                                          <div className="bg-gradient-to-br from-primary-50 to-orange-50 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border-2 border-primary-100 hover:border-primary-200">
                                <div className="p-4 sm:p-5">
                                                                  <div className="flex items-start justify-between mb-3">
                                  <div>
                                                                      <h3 className="text-lg font-bold text-gray-900 mb-1">{deal.name}</h3>
                                  <p className="text-xl font-black text-primary-600">PKR {deal.price}</p>
                                  </div>
                                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                    DEAL
                                  </div>
                                </div>
                                
                                <p className="text-gray-600 mb-3">{deal.description}</p>
                                
                                {/* Deal Contents */}
                                <div className="bg-white/70 rounded-xl p-3 mb-3">
                                  <h4 className="font-semibold text-gray-900 mb-1">Includes:</h4>
                                  <ul className="space-y-1 text-sm text-gray-600">
                                    {Object.entries(deal.items_included as any).map(([key, value]: [string, any]) => (
                                      <li key={key} className="flex items-center space-x-2">
                                        <div className="w-1.5 h-1.5 bg-primary-600 rounded-full"></div>
                                        <span>
                                          {typeof value === 'object' && value.count
                                            ? `${value.count} ${value.type || key}${value.size ? ` (${value.size})` : ''}`
                                            : `${value} ${key}`
                                          }
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                
                                <button
                                  onClick={() => handleDealClick(deal)}
                                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-2.5 px-4 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                                >
                                  Customize Deal
                                </button>
                              </div>
                            </div>
                          </ScrollReveal>
                        ))}
                      </div>
                      
                      {/* Enhanced Mobile Bottom Padding for Deals */}
                      {totalItems > 0 && isMobile && (
                        <div className="h-20 sm:h-24" />
                      )}
                    </section>
                  </ScrollReveal>
                )
              ]
            )}
            
            {/* Global Mobile Bottom Padding */}
            {totalItems > 0 && isMobile && (
              <div className="h-20 sm:h-24" />
            )}
          </div>
        </div>

        {/* Enhanced Fixed Cart Panel - Desktop Only */}
        {totalItems > 0 && !isMobile && (
          <div className="fixed top-20 right-0 w-96 h-[calc(100vh-5rem)] bg-white shadow-2xl z-50 border-l border-gray-200 animate-slide-in hidden lg:block">
            <div className="flex flex-col h-full">
              {/* Cart Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <ShoppingCart className="h-6 w-6 text-primary-600" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Your Cart</h3>
                    <p className="text-sm text-gray-600">{totalItems} items</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary-600">PKR {totalPrice.toFixed(2)}</p>
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto scroll-smooth">
                <div className="p-4 space-y-3">
                  {items.map((item) => {
                    const itemKey = generateItemKey(item);
                    return (
                      <div key={itemKey} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cart-item">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        {/* Fallback for cart item images */}
                        <div className="hidden w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500">🍕</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm truncate">{item.name}</h4>
                          {item.options && (
                            <div className="text-xs text-gray-500 mt-1">
                              {item.options.size && `Size: ${item.options.size}`}
                              {item.options.sauce && ` • Sauce: ${item.options.sauce}`}
                            </div>
                          )}
                          <p className="text-primary-600 font-bold text-sm">PKR{item.price.toFixed(2)}</p>
                        </div>

                        <QuantitySelector
                          value={item.quantity}
                          onChange={(newQuantity) => updateQuantity(itemKey, newQuantity)}
                          size="sm"
                        />

                        <button
                          onClick={() => removeItem(itemKey)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors hover:scale-110 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                  
                  {/* Bottom padding to ensure last item is fully visible */}
                  <div className="h-4"></div>
                </div>
              </div>

              {/* Cart Footer */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-primary-600">PKR {totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="space-y-3">
                    <AnimatedButton
                      onClick={handleSliderCheckout}
                      className="w-full btn-primary text-white py-3 rounded-xl font-semibold text-center flex items-center justify-center space-x-2 hover:scale-105 transition-transform btn-enhanced touch-manipulation"
                    >
                      <span>View Cart & Checkout</span>
                      <ArrowRight className="h-5 w-5" />
                    </AnimatedButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Mobile Cart Summary - Foodpanda Style */}
      {totalItems > 0 && isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 p-3 z-[55] shadow-2xl safe-area-bottom">
          <div className="max-w-sm mx-auto">
            <div className="flex items-center space-x-2">
            <AnimatedButton
              onClick={handleSliderCheckout}
                className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-3 rounded-xl font-bold flex items-center justify-between shadow-lg hover:shadow-xl transition-all duration-300 group min-h-[48px] touch-manipulation"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{totalItems}</span>
                  </div>
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold">View Cart</span>
                  <p className="text-xs opacity-90">{totalItems} item{totalItems > 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black">PKR {totalPrice.toFixed(0)}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </AnimatedButton>
              
              {/* Close Cart Button */}
              <button
                onClick={() => {
                  // Clear all items from cart
                  items.forEach((item) => {
                    const itemKey = generateItemKey(item);
                    removeItem(itemKey);
                  });
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-3 rounded-xl transition-colors duration-200 min-h-[48px] min-w-[48px] flex items-center justify-center touch-manipulation"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;