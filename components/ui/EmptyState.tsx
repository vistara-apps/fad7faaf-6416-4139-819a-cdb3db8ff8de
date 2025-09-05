'use client';

import { cn } from '@/lib/utils';
import { Button } from './Button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  size = 'md',
}: EmptyStateProps) {
  const sizes = {
    sm: {
      container: 'py-8',
      icon: 'w-12 h-12',
      title: 'text-lg',
      description: 'text-sm',
    },
    md: {
      container: 'py-12',
      icon: 'w-16 h-16',
      title: 'text-xl',
      description: 'text-base',
    },
    lg: {
      container: 'py-16',
      icon: 'w-20 h-20',
      title: 'text-2xl',
      description: 'text-lg',
    },
  };

  const sizeConfig = sizes[size];

  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center',
      sizeConfig.container,
      className
    )}>
      {Icon && (
        <div className="mb-4">
          <Icon 
            className={cn(
              sizeConfig.icon,
              'text-neutral-400 mx-auto'
            )} 
          />
        </div>
      )}
      
      <h3 className={cn(
        'font-semibold text-neutral-900 mb-2',
        sizeConfig.title
      )}>
        {title}
      </h3>
      
      {description && (
        <p className={cn(
          'text-neutral-600 mb-6 max-w-md text-balance',
          sizeConfig.description
        )}>
          {description}
        </p>
      )}
      
      {action && (
        <Button
          variant={action.variant || 'primary'}
          onClick={action.onClick}
          className="animate-bounce-in"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Predefined empty states for common scenarios
export function EmptyStudyGroups({ onCreateGroup }: { onCreateGroup: () => void }) {
  return (
    <EmptyState
      title="No study groups yet"
      description="Create your first study group to start connecting with fellow learners who share your interests."
      action={{
        label: "Create Study Group",
        onClick: onCreateGroup,
        variant: "primary"
      }}
    />
  );
}

export function EmptySearchResults({ onClearSearch }: { onClearSearch: () => void }) {
  return (
    <EmptyState
      title="No results found"
      description="Try adjusting your search terms or filters to find what you're looking for."
      action={{
        label: "Clear Search",
        onClick: onClearSearch,
        variant: "outline"
      }}
      size="sm"
    />
  );
}

export function EmptyNotifications() {
  return (
    <EmptyState
      title="All caught up!"
      description="You don't have any new notifications right now."
      size="sm"
    />
  );
}

export function EmptyMessages({ onStartConversation }: { onStartConversation: () => void }) {
  return (
    <EmptyState
      title="No messages yet"
      description="Start a conversation with your study group members or reach out for help."
      action={{
        label: "Start Conversation",
        onClick: onStartConversation,
        variant: "primary"
      }}
    />
  );
}
