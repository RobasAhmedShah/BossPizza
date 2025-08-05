import React from 'react';
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ActiveOrdersTab />
      <div className={`transition-all duration-300 ${hasActiveOrders ? 'mt-16 md:mt-20' : ''}`}>
        <main className="flex-1">
          {children}
        </main>
      </div>
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