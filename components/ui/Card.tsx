'use client';

import { cn } from '@/lib/utils';
import { type CardProps } from '@/lib/types';
import { forwardRef } from 'react';

export const Card = forwardRef<HTMLDivElement, CardProps>(({ 
  children, 
  className = '',
  variant = 'default',
  padding = 'md',
  interactive = false,
  hover = false, // Legacy support
  ...props 
}, ref) => {
  const variants = {
    default: 'bg-white border border-neutral-200 shadow-sm',
    glass: 'glass-card',
    elevated: 'glass-card-elevated',
    outline: 'bg-transparent border-2 border-neutral-200',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const isInteractive = interactive || hover;

  return (
    <div 
      ref={ref}
      className={cn(
        'rounded-lg transition-all duration-200',
        variants[variant],
        paddings[padding],
        isInteractive && 'hover:shadow-md cursor-pointer transform hover:scale-[1.02]',
        hover && 'hover:bg-white/90', // Legacy support
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';
