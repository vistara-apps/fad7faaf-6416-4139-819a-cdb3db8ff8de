'use client';

import { cn } from '@/lib/utils';
import { type TabItem } from '@/lib/types';

interface TabsProps {
  items: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ items, activeTab, onTabChange, className = '' }: TabsProps) {
  return (
    <div className={cn('flex space-x-1 bg-gray-100 p-1 rounded-lg', className)}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
            activeTab === item.id
              ? 'bg-white text-primary shadow-sm'
              : 'text-text-secondary hover:text-text-primary'
          )}
        >
          {item.icon}
          {item.label}
          {item.count !== undefined && (
            <span className={cn(
              'px-2 py-0.5 rounded-full text-xs',
              activeTab === item.id
                ? 'bg-primary/10 text-primary'
                : 'bg-gray-200 text-text-secondary'
            )}>
              {item.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
