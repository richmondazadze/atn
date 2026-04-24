import * as React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  className = '', 
  label 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-6 ${className}`}>
      <div className={`${sizeClasses[size]} lds-dual-ring text-primary`} />
      {label && (
        <p className="text-sm font-medium text-muted tracking-wide animate-pulse text-center max-w-[200px]">
          {label}
        </p>
      )}
    </div>
  );
}

export function FullPageLoader({ label = 'Loading your experience...' }: { label?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <LoadingSpinner size="lg" label={label} />
    </div>
  );
}
