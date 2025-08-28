import React from 'react';

const LoadingScreen: React.FC = () => {
  React.useEffect(() => {
    // Hide loader after app is fully loaded
    const timer = setTimeout(() => {
      const loader = document.getElementById('loading-screen');
      if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.remove();
        }, 500);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

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
          animation: 'fadeInUp 0.8s ease-out 0.2s both'
        }}>
          Loading your pizza experience...
        </div>
        
        {/* Professional Loading Dots */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '6px'
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
          height: '3px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: '2px',
          margin: '24px auto 0',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            borderRadius: '2px',
            animation: 'progress 2.5s ease-in-out'
          }}></div>
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
        
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
