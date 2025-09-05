'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Users, BookOpen, MessageCircle, TrendingUp } from 'lucide-react';

export function Dashboard() {
  const stats = [
    { label: 'Study Groups', value: '3', icon: Users, color: 'text-primary' },
    { label: 'Courses', value: '5', icon: BookOpen, color: 'text-accent' },
    { label: 'Messages', value: '24', icon: MessageCircle, color: 'text-purple-600' },
    { label: 'Help Given', value: '12', icon: TrendingUp, color: 'text-green-600' },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'joined',
      title: 'Joined "Advanced React Patterns" study group',
      time: '2h ago',
      avatar: 'AR',
    },
    {
      id: '2',
      type: 'helped',
      title: 'Helped with JavaScript async/await question',
      time: '4h ago',
      avatar: 'JS',
    },
    {
      id: '3',
      type: 'created',
      title: 'Created "Web3 Enthusiasts" circle',
      time: '1d ago',
      avatar: 'W3',
    },
  ];

  const upcomingSessions = [
    {
      id: '1',
      title: 'React Study Session',
      time: 'Today, 3:00 PM',
      members: 5,
      course: 'Computer Science',
    },
    {
      id: '2',
      title: 'Calculus Problem Solving',
      time: 'Tomorrow, 10:00 AM',
      members: 8,
      course: 'Mathematics',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <Card>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-text-secondary mb-4">
            Ready to connect and learn with your study squad?
          </p>
          <Button variant="primary">
            Find New Study Groups
          </Button>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="text-center">
              <Icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
              <div className="text-2xl font-bold text-text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-text-secondary">{stat.label}</div>
            </Card>
          );
        })}
      </div>

      {/* Upcoming Sessions */}
      <Card>
        <h3 className="text-lg font-bold text-text-primary mb-4">
          Upcoming Study Sessions
        </h3>
        <div className="space-y-3">
          {upcomingSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <h4 className="font-medium text-text-primary">{session.title}</h4>
                <p className="text-sm text-text-secondary">{session.time}</p>
                <Badge variant="outline" size="sm" className="mt-1">
                  {session.course}
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-sm text-text-secondary mb-1">
                  {session.members} members
                </div>
                <Button variant="outline" size="sm">
                  Join
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <h3 className="text-lg font-bold text-text-primary mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3">
              <Avatar name={activity.avatar} size="sm" />
              <div className="flex-1">
                <p className="text-sm text-text-primary">{activity.title}</p>
                <p className="text-xs text-text-secondary">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
