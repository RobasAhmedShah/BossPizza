import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ActiveOrdersTab from './ActiveOrdersTab';
import ScrollToTopButton from './ui/ScrollToTopButton';
import { useOrderTracking } from '../contexts/OrderTrackingContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { hasActiveOrders } = useOrderTracking();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ActiveOrdersTab />
      
      {/* Main content with conditional spacing */}
      <main className={`flex-1 transition-all duration-300 ${
        isHomePage 
          ? '' // No padding for home page - hero section handles it
          : hasActiveOrders 
            ? 'pt-[calc(4rem+3.5rem)] md:pt-[calc(5rem+3.5rem)]' // Header + ActiveOrders
            : 'pt-16 md:pt-20' // Just header
      }`}>
        {children}
      </main>
      
      <Footer />
      
      {/* Scroll to top button */}
      <ScrollToTopButton 
        showAfter={400}
        behavior="smooth"
        position="bottom-right"
      />
    </div>
  );
};

export default Layout;