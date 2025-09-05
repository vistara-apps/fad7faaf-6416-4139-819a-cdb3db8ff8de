'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { SkeletonStats, SkeletonCard, SkeletonList } from '@/components/ui/SkeletonLoader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Users, BookOpen, MessageCircle, TrendingUp, Plus, Calendar, Clock, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [userName] = useState('Alex'); // This would come from user context

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { 
      label: 'Study Groups', 
      value: '3', 
      icon: Users, 
      color: 'text-primary-500',
      bgColor: 'bg-primary-50',
      change: '+2 this week',
      trend: 'up'
    },
    { 
      label: 'Courses', 
      value: '5', 
      icon: BookOpen, 
      color: 'text-secondary-500',
      bgColor: 'bg-secondary-50',
      change: '+1 this month',
      trend: 'up'
    },
    { 
      label: 'Messages', 
      value: '24', 
      icon: MessageCircle, 
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      change: '+12 today',
      trend: 'up'
    },
    { 
      label: 'Help Given', 
      value: '12', 
      icon: TrendingUp, 
      color: 'text-success-500',
      bgColor: 'bg-success-50',
      change: '+3 this week',
      trend: 'up'
    },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'joined',
      title: 'Joined "Advanced React Patterns" study group',
      time: '2h ago',
      avatar: 'AR',
      color: 'bg-primary-100 text-primary-600',
    },
    {
      id: '2',
      type: 'helped',
      title: 'Helped with JavaScript async/await question',
      time: '4h ago',
      avatar: 'JS',
      color: 'bg-success-100 text-success-600',
    },
    {
      id: '3',
      type: 'created',
      title: 'Created "Web3 Enthusiasts" circle',
      time: '1d ago',
      avatar: 'W3',
      color: 'bg-secondary-100 text-secondary-600',
    },
  ];

  const upcomingSessions = [
    {
      id: '1',
      title: 'React Study Session',
      time: 'Today, 3:00 PM',
      members: 5,
      course: 'Computer Science',
      status: 'starting-soon',
      avatar: 'RS',
    },
    {
      id: '2',
      title: 'Calculus Problem Solving',
      time: 'Tomorrow, 10:00 AM',
      members: 8,
      course: 'Mathematics',
      status: 'upcoming',
      avatar: 'CP',
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <SkeletonCard />
        <SkeletonStats />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="glass-card-elevated rounded-xl p-6 text-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-neutral-600 text-lg">
            Ready to connect and learn with your study squad?
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary" size="lg" className="animate-bounce-in">
            <Plus className="w-5 h-5 mr-2" />
            Find New Study Groups
          </Button>
          <Button variant="outline" size="lg">
            <Calendar className="w-5 h-5 mr-2" />
            View Schedule
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={cn(
                'glass-card p-6 text-center hover:shadow-lg transition-all duration-300',
                'animate-slide-up'
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={cn('w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center', stat.bgColor)}>
                <Icon className={cn('w-6 h-6', stat.color)} />
              </div>
              <div className="text-2xl font-bold text-neutral-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-neutral-600 mb-2">{stat.label}</div>
              <div className="text-xs text-success-600 font-medium">
                {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming Sessions */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-900">
            Upcoming Study Sessions
          </h2>
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        {upcomingSessions.length > 0 ? (
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  'flex items-center justify-between p-4 rounded-lg border transition-all duration-200',
                  'hover:shadow-md hover:border-primary-200',
                  session.status === 'starting-soon' 
                    ? 'bg-primary-50 border-primary-200' 
                    : 'bg-neutral-50 border-neutral-200'
                )}
              >
                <div className="flex items-center gap-4">
                  <Avatar name={session.avatar} size="md" />
                  <div>
                    <h3 className="font-semibold text-neutral-900">{session.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Clock className="w-4 h-4" />
                      {session.time}
                    </div>
                    <Badge variant="outline" size="sm" className="mt-1">
                      {session.course}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-neutral-600 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    {session.members} members
                  </div>
                  <Button 
                    variant={session.status === 'starting-soon' ? 'primary' : 'outline'} 
                    size="sm"
                  >
                    {session.status === 'starting-soon' ? 'Join Now' : 'Join'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No upcoming sessions"
            description="Join a study group to see upcoming sessions here."
            size="sm"
          />
        )}
      </div>

      {/* Recent Activity */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-900">
            Recent Activity
          </h2>
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        {recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                <div className={cn('w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold', activity.color)}>
                  {activity.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-900">{activity.title}</p>
                  <p className="text-xs text-neutral-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No recent activity"
            description="Your activity will appear here as you engage with study groups."
            size="sm"
          />
        )}
      </div>
    </div>
  );
}
