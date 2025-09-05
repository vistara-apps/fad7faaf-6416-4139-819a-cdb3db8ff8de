'use client';

import { cn } from '@/lib/utils';
import { type ButtonProps } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { forwardRef } from 'react';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  children,
  className = '',
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = cn(
    'inline-flex items-center justify-center font-medium rounded-lg',
    'transition-all duration-200 ease-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    'min-h-[44px] min-w-[44px]', // Touch target accessibility
    'active:scale-95' // Micro-interaction
  );
  
  const variants = {
    primary: cn(
      'bg-primary-500 text-white shadow-lg',
      'hover:bg-primary-600 hover:shadow-xl',
      'active:bg-primary-700',
      'focus:ring-primary-500/50'
    ),
    secondary: cn(
      'bg-secondary-500 text-white shadow-lg',
      'hover:bg-secondary-600 hover:shadow-xl',
      'active:bg-secondary-700',
      'focus:ring-secondary-500/50'
    ),
    outline: cn(
      'bg-transparent text-primary-500 border-2 border-primary-500',
      'hover:bg-primary-50 hover:border-primary-600',
      'active:bg-primary-100',
      'focus:ring-primary-500/50'
    ),
    ghost: cn(
      'bg-transparent text-primary-500',
      'hover:bg-primary-50',
      'active:bg-primary-100',
      'focus:ring-primary-500/50'
    ),
    danger: cn(
      'bg-error-500 text-white shadow-lg',
      'hover:bg-error-600 hover:shadow-xl',
      'active:bg-error-700',
      'focus:ring-error-500/50'
    ),
    success: cn(
      'bg-success-500 text-white shadow-lg',
      'hover:bg-success-600 hover:shadow-xl',
      'active:bg-success-700',
      'focus:ring-success-500/50'
    ),
  };
  
  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs min-h-[32px] min-w-[32px]',
    sm: 'px-3 py-2 text-sm min-h-[36px] min-w-[36px]',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg min-h-[48px]',
    xl: 'px-8 py-4 text-xl min-h-[52px]',
  };
  
  const isDisabled = disabled || loading;
  
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <Loader2 className={cn(
          'animate-spin mr-2',
          size === 'xs' ? 'w-3 h-3' : 
          size === 'sm' ? 'w-4 h-4' : 
          size === 'lg' ? 'w-5 h-5' :
          size === 'xl' ? 'w-6 h-6' : 'w-4 h-4'
        )} />
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
