import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Database } from 'lucide-react';
import CacheManager from './ui/CacheManager';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useOrderTracking } from '../contexts/OrderTrackingContext';
import { useScrollRestoration } from '../hooks/useScrollRestoration';
import AuthModal from './AuthModal';
import clsx from 'clsx';

// Constants
const SCROLL_THRESHOLD = 50;

// TypeScript interfaces
interface User {
  phone: string;
  [key: string]: any;
}

interface NavigationItem {
  name: string;
  href: string;
}

interface UserDropdownProps {
  isHomePage: boolean;
  user: User | null;
  onLogout: () => void;
  onCacheManagerOpen: () => void;
}

interface MobileMenuProps {
  isOpen: boolean;
  navigation: NavigationItem[];
  isHomePage: boolean;
  isAuthenticated: boolean;
  user: User | null;
  onLinkClick: (href: string) => void;
  onAuthClick: () => void;
  onLogout: () => void;
}

// Sub-components
const UserDropdown: React.FC<UserDropdownProps> = ({ isHomePage, user, onLogout, onCacheManagerOpen }) => (
  <div className="relative group">
    <button className={`flex items-center space-x-2 p-2 rounded-full transition-all duration-300 touch-manipulation min-h-[44px] group ${
      isHomePage 
        ? 'hover:bg-white/10 text-white' 
        : 'hover:bg-gray-100 text-gray-700'
    }`}>
      <User className="h-6 w-6 group-hover:scale-110 transition-transform" />
      <span className="text-sm hidden lg:block">
        {user?.phone}
      </span>
    </button>
    <div className={`absolute top-full left-0 mt-1 w-48 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 ${
      isHomePage ? 'bg-black/90 backdrop-blur-lg border border-white/20' : 'bg-white border border-gray-200'
    }`}>
      <button
        onClick={onCacheManagerOpen}
        className={`flex items-center space-x-2 w-full text-left px-4 py-3 text-sm transition-colors touch-manipulation min-h-[44px] ${
          isHomePage 
            ? 'text-white hover:bg-white/10' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Database className="h-4 w-4" />
        <span>Cache Manager</span>
      </button>
      <button
        onClick={onLogout}
        className={`block w-full text-left px-4 py-3 text-sm transition-colors touch-manipulation min-h-[44px] ${
          isHomePage 
            ? 'text-white hover:bg-white/10' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        Logout
      </button>
    </div>
  </div>
);

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  navigation,
  isHomePage,
  isAuthenticated,
  user,
  onLinkClick,
  onAuthClick,
  onLogout
}) => {
  if (!isOpen) return null;

  return (
    <div className={`md:hidden transition-all duration-300 animate-slide-down ${
      isHomePage 
        ? 'bg-black/95 backdrop-blur-lg border-t border-white/10' 
        : 'bg-white border-t border-gray-200'
    }`}>
      <div className="px-4 py-2 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => onLinkClick(item.href)}
            className={clsx(
              'block px-3 py-3 text-base font-medium rounded-xl transition-all duration-300 touch-manipulation min-h-[48px] flex items-center',
              isHomePage 
                ? 'text-white hover:text-orange-400 hover:bg-white/5'
                : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
            )}
          >
            {item.name}
          </Link>
        ))}
        
        {/* Mobile User Section */}
        <div className={`border-t pt-2 mt-2 ${
          isHomePage ? 'border-white/10' : 'border-gray-200'
        }`}>
          {isAuthenticated ? (
            <div className="space-y-1">
              <div className={`px-3 py-2 text-sm ${
                isHomePage ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Signed in as {user?.phone}
              </div>
              <button
                onClick={onLogout}
                className={clsx(
                  'block w-full text-left px-3 py-3 text-base font-medium rounded-xl transition-all duration-300 touch-manipulation min-h-[48px]',
                  isHomePage 
                    ? 'text-white hover:text-orange-400 hover:bg-white/5'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                )}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onAuthClick}
              className={clsx(
                'block w-full text-left px-3 py-3 text-base font-medium rounded-xl transition-all duration-300 touch-manipulation min-h-[48px]',
                isHomePage 
                  ? 'text-white hover:text-orange-400 hover:bg-white/5'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
              )}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCacheManagerOpen, setIsCacheManagerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const { hasActiveOrders } = useOrderTracking();
  const location = useLocation();
  const { scrollToTop } = useScrollRestoration();

  const navigation: NavigationItem[] = [
    { name: 'Menu', href: '/menu' },
    { name: 'About', href: '/about' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Blog', href: '/blog' },
    { name: 'Branches', href: '/branches' },
    { name: 'Contact', href: '/contact' },
  ];

  const isHomePage = useMemo(() => location.pathname === '/', [location.pathname]);

  // Memoized style calculations
  const headerStyles = useMemo(() => {
    const baseClasses = 'fixed top-0 left-0 right-0 z-50 transition-all duration-500';
    
    if (isHomePage) {
      return isScrolled 
        ? `${baseClasses} bg-black/95 backdrop-blur-lg border-b border-white/10 shadow-2xl ${hasActiveOrders ? 'shadow-primary-500/20' : ''}` 
        : `${baseClasses} bg-transparent`;
    }
    
    return `${baseClasses} bg-white shadow-lg ${hasActiveOrders ? 'shadow-primary-500/10' : ''}`;
  }, [isHomePage, isScrolled, hasActiveOrders]);

  // Memoized utility functions
  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > SCROLL_THRESHOLD);
    };

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Auto-close mobile menu on route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Enhanced link click handler - simplified approach
  const handleLinkClick = useCallback((href: string) => {
    setIsMenuOpen(false);
    
    // Only scroll to top if navigating to the same page
    if (location.pathname === href) {
      scrollToTop('smooth');
    }
  }, [location.pathname, scrollToTop]);

  // Enhanced logo click handler
  const handleLogoClick = useCallback(() => {
    setIsMenuOpen(false);
    
    // Only scroll to top if already on home page
    if (location.pathname === '/') {
      scrollToTop('smooth');
    }
  }, [location.pathname, scrollToTop]);

  // Auth handlers
  const handleAuthModalOpen = useCallback(() => {
    setIsAuthModalOpen(true);
    setIsMenuOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setIsMenuOpen(false);
  }, [logout]);

  const handleAuthModalClose = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const handleCacheManagerOpen = useCallback(() => {
    setIsCacheManagerOpen(true);
    setIsMenuOpen(false);
  }, []);

  const handleCacheManagerClose = useCallback(() => {
    setIsCacheManagerOpen(false);
  }, []);

  // Cart button component
  const CartButton = useCallback(({ className }: { className: string }) => (
    <Link
      to="/cart"
      onClick={() => handleLinkClick('/cart')}
      className={className}
      data-cart-icon
      aria-label={`Shopping cart with ${totalItems} items`}
    >
      <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform" />
      {totalItems > 0 && (
        <span className={`absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold cart-badge shadow-lg ${
          isHomePage ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-primary-600'
        }`}>
          {totalItems}
        </span>
      )}
    </Link>
  ), [totalItems, isHomePage, handleLinkClick]);

  // User button component
  const UserButton = useCallback(({ className, onClick }: { className: string; onClick?: () => void }) => (
    <button
      onClick={onClick}
      className={className}
      aria-label={isAuthenticated ? `User menu for ${user?.phone}` : 'Sign in'}
    >
      <User className="h-6 w-6 group-hover:scale-110 transition-transform" />
    </button>
  ), [isAuthenticated, user]);

  return (
    <>
      <header className={headerStyles}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Left - Cart & Login (Desktop: Visible, Mobile: Hidden) */}
            <div className="hidden md:flex items-center space-x-4">
              <CartButton className={`relative p-2 rounded-full transition-all duration-300 touch-manipulation group ${
                isHomePage 
                  ? 'hover:bg-white/10 text-white' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`} />
              
              {isAuthenticated ? (
                <UserDropdown 
                  isHomePage={isHomePage}
                  user={user}
                  onLogout={handleLogout}
                  onCacheManagerOpen={handleCacheManagerOpen}
                />
              ) : (
                <UserButton 
                  className={`p-2 rounded-full transition-all duration-300 touch-manipulation min-h-[44px] min-w-[44px] group ${
                    isHomePage 
                      ? 'hover:bg-white/10 text-white' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  onClick={handleAuthModalOpen}
                />
              )}
            </div>

            {/* Mobile Left - Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded-md transition-all duration-300 touch-manipulation min-h-[44px] min-w-[44px] group ${
                isHomePage 
                  ? 'hover:bg-white/10 text-white' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 group-hover:scale-110 transition-transform" />
              ) : (
                <Menu className="h-6 w-6 group-hover:scale-110 transition-transform" />
              )}
            </button>

            {/* Logo - Enhanced and Larger */}
            <div className="flex-1 flex justify-center md:justify-start md:ml-8">
              <Link 
                to="/" 
                onClick={handleLogoClick}
                className="flex items-center touch-manipulation group"
                aria-label="Big Boss Pizza - Go to homepage"
              >
                <div className={`relative p-2 rounded-xl transition-all duration-300 ${
                  isHomePage 
                    ? 'hover:bg-white/10' 
                    : 'hover:bg-gray-50'
                }`}>
                  <img 
                    src="/BBP.jpg" 
                    alt="Big Boss Pizza" 
                    className={`h-10 md:h-12 lg:h-14 w-auto transition-all duration-300 group-hover:scale-110 ${
                      isHomePage 
                        ? 'drop-shadow-2xl filter contrast-125 saturate-110' 
                        : 'drop-shadow-sm'
                    }`}
                  />
                  {isHomePage && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </div>
                
                {/* Optional: Add text logo next to image on larger screens */}
                <div className={`hidden lg:block ml-3 transition-all duration-300 ${
                  isHomePage ? 'text-white' : 'text-gray-900'
                }`}>
                  <div className="text-xl font-bold tracking-tight">
                    Big Boss Pizza
                  </div>
                  <div className={`text-xs font-medium ${
                    isHomePage ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Authentic Italian Taste
                  </div>
                </div>
              </Link>
            </div>

            {/* Right - Navigation (Desktop) / Cart (Mobile) */}
            <div className="flex items-center space-x-4">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8" role="navigation">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => handleLinkClick(item.href)}
                    className={clsx(
                      'text-sm font-medium transition-all duration-300 category-tab touch-manipulation min-h-[44px] flex items-center relative group',
                      isHomePage 
                        ? isActive(item.href)
                          ? 'text-orange-400'
                          : 'text-white hover:text-orange-400'
                        : isActive(item.href)
                          ? 'text-primary-600 active'
                          : 'text-gray-700 hover:text-primary-600'
                    )}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                  >
                    <span className="relative z-10">{item.name}</span>
                    {isHomePage && (
                      <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-95 group-hover:scale-100" />
                    )}
                    {isActive(item.href) && isHomePage && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
                    )}
                  </Link>
                ))}
              </nav>

              {/* Mobile Cart & User */}
              <div className="md:hidden flex items-center space-x-2">
                <CartButton className={`relative p-2 rounded-full transition-all duration-300 touch-manipulation min-h-[44px] min-w-[44px] group ${
                  isHomePage 
                    ? 'hover:bg-white/10 text-white' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`} />
                
                <UserButton 
                  className={`p-2 rounded-full transition-all duration-300 touch-manipulation min-h-[44px] min-w-[44px] group ${
                    isHomePage 
                      ? 'hover:bg-white/10 text-white' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  onClick={isAuthenticated ? handleLogout : handleAuthModalOpen}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <MobileMenu
          isOpen={isMenuOpen}
          navigation={navigation}
          isHomePage={isHomePage}
          isAuthenticated={isAuthenticated}
          user={user}
          onLinkClick={handleLinkClick}
          onAuthClick={handleAuthModalOpen}
          onLogout={handleLogout}
        />
      </header>

      

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleAuthModalClose}
      />

      {/* Cache Manager */}
      <CacheManager
        isOpen={isCacheManagerOpen}
        onClose={handleCacheManagerClose}
      />
    </>
  );
};

export default Header;