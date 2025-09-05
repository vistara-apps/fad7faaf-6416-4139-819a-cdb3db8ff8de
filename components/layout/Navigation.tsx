'use client';

import { cn } from '@/lib/utils';
import { Home, Users, Circle, CreditCard, HelpCircle, User } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'study-groups', label: 'Study Groups', icon: Users },
  { id: 'circles', label: 'Circles', icon: Circle },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'help', label: 'Get Help', icon: HelpCircle },
  { id: 'profile', label: 'Profile', icon: User },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="glass-card rounded-lg p-2 mb-6">
      <div className="flex justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200',
                activeTab === item.id
                  ? 'text-primary bg-primary/10'
                  : 'text-text-secondary hover:text-primary hover:bg-primary/5'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="hidden sm:block">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
