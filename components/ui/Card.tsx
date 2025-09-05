'use client';

import { cn } from '@/lib/utils';
import { type CardProps } from '@/lib/types';

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'glass-card rounded-lg p-6',
        hover && 'hover:bg-white/90 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}
