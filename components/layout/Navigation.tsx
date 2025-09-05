'use client';

import { cn } from '@/lib/utils';
import { Home, Users, Circle, HelpCircle, User } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, shortLabel: 'Home' },
  { id: 'study-groups', label: 'Study Groups', icon: Users, shortLabel: 'Groups' },
  { id: 'circles', label: 'Circles', icon: Circle, shortLabel: 'Circles' },
  { id: 'help', label: 'Get Help', icon: HelpCircle, shortLabel: 'Help' },
  { id: 'profile', label: 'Profile', icon: User, shortLabel: 'Profile' },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <nav 
      className="glass-card rounded-lg p-2 mb-6 sticky top-4 z-10"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'flex flex-col items-center gap-1 px-2 sm:px-3 py-2.5 rounded-lg text-xs font-medium',
                'transition-all duration-200 ease-out',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                'min-h-[44px] min-w-[44px]', // Touch target
                'relative overflow-hidden',
                isActive
                  ? 'text-primary-500 bg-primary-100 shadow-sm'
                  : 'text-neutral-600 hover:text-primary-500 hover:bg-primary-50'
              )}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-500 animate-slide-up" />
              )}
              
              <Icon className={cn(
                'w-5 h-5 transition-transform duration-200',
                isActive && 'scale-110'
              )} />
              
              {/* Responsive labels */}
              <span className={cn(
                'transition-opacity duration-200',
                'block sm:block', // Always show on mobile now for better UX
                isMobile ? 'text-[10px] leading-tight' : 'text-xs'
              )}>
                {isMobile ? item.shortLabel : item.label}
              </span>
              
              {/* Hover effect */}
              <div className={cn(
                'absolute inset-0 bg-primary-500/5 rounded-lg opacity-0',
                'transition-opacity duration-200',
                'hover:opacity-100'
              )} />
            </button>
          );
        })}
      </div>
      
      {/* Mobile swipe indicator */}
      {isMobile && (
        <div className="flex justify-center mt-2">
          <div className="w-8 h-1 bg-neutral-300 rounded-full" />
        </div>
      )}
    </nav>
  );
}
