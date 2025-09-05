'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'avatar' | 'card' | 'button' | 'image';
  lines?: number;
}

export function Skeleton({ className, variant = 'text', lines = 1 }: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-neutral-200 rounded';
  
  const variants = {
    text: 'h-4 w-full',
    avatar: 'h-10 w-10 rounded-full',
    card: 'h-32 w-full',
    button: 'h-10 w-24',
    image: 'h-48 w-full',
  };
  
  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variants.text,
              index === lines - 1 && 'w-3/4' // Last line is shorter
            )}
          />
        ))}
      </div>
    );
  }
  
  return (
    <div
      className={cn(baseClasses, variants[variant], className)}
      role="status"
      aria-label="Loading..."
    />
  );
}

// Specific skeleton components for common use cases
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('glass-card p-6 space-y-4', className)}>
      <div className="flex items-center space-x-4">
        <Skeleton variant="avatar" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton lines={3} />
      <div className="flex space-x-2">
        <Skeleton variant="button" />
        <Skeleton variant="button" className="w-16" />
      </div>
    </div>
  );
}

export function SkeletonStats({ className }: { className?: string }) {
  return (
    <div className={cn('grid grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="glass-card p-6 text-center space-y-3">
          <Skeleton className="h-8 w-8 mx-auto" />
          <Skeleton className="h-6 w-12 mx-auto" />
          <Skeleton className="h-4 w-16 mx-auto" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonList({ 
  items = 3, 
  className 
}: { 
  items?: number; 
  className?: string; 
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
          <Skeleton variant="avatar" className="h-8 w-8" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton variant="button" className="w-12 h-8" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonNavigation({ className }: { className?: string }) {
  return (
    <nav className={cn('glass-card rounded-lg p-2', className)}>
      <div className="flex justify-between">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex flex-col items-center gap-1 px-3 py-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-3 w-12 hidden sm:block" />
          </div>
        ))}
      </div>
    </nav>
  );
}
