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

// Render the loading screen first
root.render(<LoadingScreen onDataLoaded={() => {
  // Only render the app after data is preloaded
  if (preloadedData.isLoaded) {
    console.log(`🚀 Big Boss Pizza loaded in ${preloadedData.loadTime.toFixed(0)}ms`);
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
  }
}} />);
