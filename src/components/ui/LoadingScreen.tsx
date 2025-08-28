import React, { useState, useEffect } from 'react';
import { menuAPI } from '../../lib/supabase';

// Global data store for pre-fetched data
export const preloadedData = {
  categories: null as any,
  menuItems: null as any,
  deals: null as any,
  isLoaded: false,
  error: null as string | null,
  loadTime: 0
};

// Critical images to preload
const criticalImages = [
  '/BBP.svg',
  'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=400'
];

// Preload images function
const preloadImages = (imageUrls: string[]): Promise<void> => {
  return new Promise((resolve) => {
    let loadedCount = 0;
    const totalImages = imageUrls.length;

    if (totalImages === 0) {
      resolve();
      return;
    }

    const onImageLoad = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        resolve();
      }
    };

    const onImageError = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        resolve();
      }
    };

    imageUrls.forEach(url => {
      const img = new Image();
      img.onload = onImageLoad;
      img.onerror = onImageError;
      img.src = url;
    });
  });
};

// Preload menu item images
const preloadMenuImages = async (menuItemsData: any): Promise<void> => {
  if (!menuItemsData) return;
  
  const imageUrls: string[] = [];
  
  // Collect all unique image URLs from menu items
  Object.values(menuItemsData).forEach((categoryItems: any) => {
    if (Array.isArray(categoryItems)) {
      categoryItems.forEach((item: any) => {
        if (item.image_url && !imageUrls.includes(item.image_url)) {
          imageUrls.push(item.image_url);
        }
      });
    }
  });
  
  // Preload all menu images (limit to first 20 to avoid too many requests)
  const imagesToPreload = imageUrls.slice(0, 20);
  await preloadImages(imagesToPreload);
};

// Performance optimization: Add cache headers and register service worker
const addCacheHeaders = () => {
  // Register service worker for caching
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  }
  
  // Set cache headers for better performance
  if ('caches' in window) {
    caches.open('big-boss-pizza-v1').then(cache => {
      // Cache critical resources
      cache.addAll([
        '/BBP.svg',
        '/manifest.json'
      ]);
    });
  }
};

// Preload fonts for better performance
const preloadFonts = () => {
  // Preload Inter font
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'font';
  link.type = 'font/woff2';
  link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
};

interface LoadingScreenProps {
  onDataLoaded?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onDataLoaded }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');
  const [currentStep, setCurrentStep] = useState(0);

  const loadingSteps = [
    { text: 'Connecting to Big Boss Pizza...', duration: 800 },
    { text: 'Loading our legendary menu...', duration: 1200 },
    { text: 'Preparing your pizza experience...', duration: 1000 },
    { text: 'Loading images and assets...', duration: 800 },
    { text: 'Almost ready to serve...', duration: 600 }
  ];

  useEffect(() => {
    const startTime = performance.now();
    
    const preloadAllData = async () => {
      try {
        // Initialize performance optimizations
        addCacheHeaders();
        preloadFonts();
        
        setCurrentStep(0);
        setProgress(10);
        setLoadingText(loadingSteps[0].text);
        
        // Step 1: Load categories
        await new Promise(resolve => setTimeout(resolve, loadingSteps[0].duration));
        setCurrentStep(1);
        setProgress(25);
        setLoadingText(loadingSteps[1].text);
        
        const categoriesData = await menuAPI.getCategories();
        preloadedData.categories = categoriesData;
        
        // Step 2: Load menu items
        await new Promise(resolve => setTimeout(resolve, loadingSteps[1].duration));
        setCurrentStep(2);
        setProgress(50);
        setLoadingText(loadingSteps[2].text);
        
        const menuItemsData = await menuAPI.getAllMenuItems();
        preloadedData.menuItems = menuItemsData;
        
        // Step 3: Load deals
        await new Promise(resolve => setTimeout(resolve, loadingSteps[2].duration));
        setCurrentStep(3);
        setProgress(70);
        setLoadingText(loadingSteps[3].text);
        
        const dealsData = await menuAPI.getDeals();
        preloadedData.deals = dealsData;
        
        // Step 4: Preload critical images and menu images
        await new Promise(resolve => setTimeout(resolve, loadingSteps[3].duration));
        setCurrentStep(4);
        setProgress(85);
        setLoadingText(loadingSteps[4].text);
        
        await Promise.all([
          preloadImages(criticalImages),
          preloadMenuImages(menuItemsData)
        ]);
        
        // Final step
        await new Promise(resolve => setTimeout(resolve, loadingSteps[4].duration));
        setProgress(100);
        setLoadingText('Welcome to Big Boss Pizza!');
        
        // Calculate load time
        const endTime = performance.now();
        preloadedData.loadTime = endTime - startTime;
        
        // Mark as loaded
        preloadedData.isLoaded = true;
        
        // Notify parent component
        if (onDataLoaded) {
          onDataLoaded();
        }
        
        // Hide loader after a short delay
        setTimeout(() => {
          const loader = document.getElementById('loading-screen');
          if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
              loader.remove();
            }, 500);
          }
        }, 1000);
        
      } catch (error) {
        console.error('Error preloading data:', error);
        preloadedData.error = 'Failed to load data';
        setLoadingText('Error loading data. Please refresh the page.');
        
        // Still hide loader after error
        setTimeout(() => {
          const loader = document.getElementById('loading-screen');
          if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
              loader.remove();
            }, 500);
          }
        }, 3000);
      }
    };

    preloadAllData();
  }, [onDataLoaded]);

  return (
    <div id="loading-screen" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #dc2626 0%, #ea580c 50%, #fbbf24 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      fontFamily: 'Inter, sans-serif',
      transition: 'opacity 0.5s ease-out'
    }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        {/* Professional Pizza Spinner */}
        <div style={{
          width: '100px',
          height: '100px',
          margin: '0 auto 24px',
          position: 'relative',
          animation: 'spin 2s linear infinite'
        }}>
          {/* Outer ring */}
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '3px solid rgba(255,255,255,0.2)',
            borderTop: '3px solid white',
            animation: 'spin 1.5s linear infinite'
          }}></div>
          
          {/* Inner ring */}
          <div style={{
            position: 'absolute',
            top: '15px',
            left: '15px',
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.3)',
            borderTop: '2px solid white',
            animation: 'spin 1s linear infinite reverse'
          }}></div>
          
          {/* Pizza emoji */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '28px',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            🍕
          </div>
        </div>
        
        {/* Brand Text */}
        <div style={{
          fontSize: '32px',
          fontWeight: '900',
          marginBottom: '12px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          animation: 'fadeInUp 0.8s ease-out',
          letterSpacing: '1px'
        }}>
          BIG BOSS PIZZA
        </div>
        
        {/* Subtitle */}
        <div style={{
          fontSize: '14px',
          opacity: 0.8,
          marginBottom: '8px',
          animation: 'fadeInUp 0.8s ease-out 0.1s both',
          letterSpacing: '0.5px'
        }}>
          Be Your Own Big Boss
        </div>
        
        {/* Loading Text */}
        <div style={{
          fontSize: '16px',
          opacity: 0.9,
          marginBottom: '32px',
          animation: 'fadeInUp 0.8s ease-out 0.2s both',
          minHeight: '24px'
        }}>
          {loadingText}
        </div>
        
        {/* Professional Loading Dots */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '6px',
          marginBottom: '24px'
        }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: 'white',
                animation: `bounce 1.4s ease-in-out infinite both`,
                animationDelay: `${i * 0.16}s`
              }}
            />
          ))}
        </div>
        
        {/* Progress bar */}
        <div style={{
          width: '200px',
          height: '4px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: '2px',
          margin: '0 auto',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: 'white',
            borderRadius: '2px',
            transition: 'width 0.3s ease-out',
            boxShadow: '0 0 10px rgba(255,255,255,0.5)'
          }}></div>
        </div>
        
        {/* Progress percentage */}
        <div style={{
          fontSize: '12px',
          opacity: 0.7,
          marginTop: '8px',
          fontWeight: '500'
        }}>
          {progress}%
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
        }
        
        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(0);
            opacity: 0.5;
          }
          40% { 
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
