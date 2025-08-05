import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  lines = 1,
}) => {
  const baseClasses = 'bg-gray-200 animate-pulse';
  
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
  };

  const style = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1rem' : undefined),
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${variantClasses[variant]} h-4`}
            style={{
              width: index === lines - 1 ? '75%' : '100%',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

// Menu Item Skeleton
export const MenuItemSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
    <div className="flex">
      <Skeleton variant="rectangular" className="w-1/3 h-32" />
      <div className="flex-1 p-4 space-y-3">
        <Skeleton variant="text" width="80%" height="1.25rem" />
        <Skeleton variant="text" lines={2} />
        <div className="flex items-center justify-between">
          <Skeleton variant="text" width="60px" height="1.5rem" />
          <Skeleton variant="rectangular" width="80px" height="32px" className="rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

// Cart Item Skeleton
export const CartItemSkeleton: React.FC = () => (
  <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
    <Skeleton variant="rectangular" className="w-12 h-12 rounded-lg" />
    <div className="flex-1 space-y-2">
      <Skeleton variant="text" width="70%" />
      <Skeleton variant="text" width="40%" />
    </div>
    <div className="flex items-center space-x-2">
      <Skeleton variant="circular" className="w-6 h-6" />
      <Skeleton variant="text" width="20px" />
      <Skeleton variant="circular" className="w-6 h-6" />
    </div>
  </div>
);

export default Skeleton;