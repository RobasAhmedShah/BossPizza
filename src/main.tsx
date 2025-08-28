import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import LoadingScreen, { preloadedData } from './components/ui/LoadingScreen.tsx'
import './index.css'

// Performance optimization: Preload critical resources
const preloadCriticalResources = () => {
  // Preload critical CSS
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'style';
  link.href = './index.css';
  document.head.appendChild(link);
  
  // Preload critical fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.as = 'font';
  fontLink.type = 'font/woff2';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';
  fontLink.crossOrigin = 'anonymous';
  document.head.appendChild(fontLink);
};

// Initialize performance optimizations
preloadCriticalResources();

// Create root element
const root = ReactDOM.createRoot(document.getElementById('root')!);

// Add debugging utilities to window object
(window as any).debugCart = () => {
  const { sessionManager } = require('./lib/SessionManager');
  const cartDebug = sessionManager.debugCart();
  const sessionStats = sessionManager.getSessionStats();
  
  console.log('🛒 Cart Debug Info:', cartDebug);
  console.log('📊 Session Stats:', sessionStats);
  
  // Also check localStorage
  const legacyCart = localStorage.getItem('bigBossCart');
  if (legacyCart) {
    try {
      const parsed = JSON.parse(legacyCart);
      console.log('📦 Legacy localStorage cart:', parsed);
    } catch (e) {
      console.log('❌ Invalid legacy cart data');
    }
  } else {
    console.log('📦 No legacy cart data');
  }
};

console.log('🔧 Debug utilities available:');
console.log('  - window.debugCart() - Check cart data');

// Add more debugging info on load
setTimeout(() => {
  const session = sessionManager.loadSession();
  if (session?.cart?.items?.length > 0) {
    console.log(`🛒 Initial cart check: ${session.cart.items.length} items found in session`);
  } else {
    console.log('🛒 Initial cart check: No items found in session');
  }
}, 2000);

// Render the loading screen first
root.render(<LoadingScreen onDataLoaded={() => {
  // Only render the app after data is preloaded
  if (preloadedData.isLoaded) {
    const loadType = preloadedData.fromCache ? '⚡ Cached' : '🆕 Fresh';
    console.log(`🚀 Big Boss Pizza loaded in ${preloadedData.loadTime.toFixed(0)}ms (${loadType})`);
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
  }
}} />);
