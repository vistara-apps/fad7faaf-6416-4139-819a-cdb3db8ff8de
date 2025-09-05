'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Tabs } from '@/components/ui/Tabs';
import { User, Settings2, Award, BookOpen, Users, MessageCircle } from 'lucide-react';
import { Name, Address } from '@coinbase/onchainkit/identity';

export function Profile() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings2 className="w-4 h-4" /> },
  ];

  const userStats = [
    { label: 'Study Groups', value: '3', icon: Users, color: 'text-primary' },
    { label: 'Circles', value: '2', icon: MessageCircle, color: 'text-accent' },
    { label: 'Help Given', value: '12', icon: Award, color: 'text-green-600' },
    { label: 'Courses', value: '5', icon: BookOpen, color: 'text-purple-600' },
  ];

  const interests = [
    'Web Development', 'Machine Learning', 'Photography', 'Blockchain',
    'UI/UX Design', 'Data Science', 'Mobile Development'
  ];

  const courses = [
    'Advanced React Patterns', 'Calculus II', 'Organic Chemistry',
    'Data Structures', 'Digital Marketing'
  ];

  const achievements = [
    { title: 'Helpful Helper', description: 'Helped 10+ students', icon: '🏆' },
    { title: 'Study Squad Leader', description: 'Created 3 study groups', icon: '👥' },
    { title: 'Knowledge Sharer', description: 'Active in 5+ circles', icon: '💡' },
  ];

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <div className="flex items-center gap-4 mb-4">
          <Avatar name="John Doe" size="lg" />
          <div className="flex-1">
            <Name className="text-xl font-bold text-text-primary" />
            <Address className="text-sm text-text-secondary" />
            <p className="text-sm text-text-secondary mt-1">
              Computer Science student passionate about Web3 and AI
            </p>
          </div>
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>
        
        {isEditing && (
          <div className="space-y-4 pt-4 border-t">
            <Input label="Display Name" defaultValue="John Doe" />
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Bio
              </label>
              <textarea
                className="input-field min-h-[80px] resize-none"
                defaultValue="Computer Science student passionate about Web3 and AI"
              />
            </div>
            <Button variant="primary">Save Changes</Button>
          </div>
        )}
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {userStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="text-center">
              <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
              <div className="text-xl font-bold text-text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-text-secondary">{stat.label}</div>
            </Card>
          );
        })}
      </div>

      {/* Interests */}
      <Card>
        <h3 className="text-lg font-bold text-text-primary mb-4">Interests</h3>
        <div className="flex flex-wrap gap-2">
          {interests.map((interest) => (
            <Badge key={interest} variant="primary" size="sm">
              {interest}
            </Badge>
          ))}
        </div>
        {isEditing && (
          <div className="mt-4 pt-4 border-t">
            <Input placeholder="Add new interest..." />
          </div>
        )}
      </Card>

      {/* Current Courses */}
      <Card>
        <h3 className="text-lg font-bold text-text-primary mb-4">Current Courses</h3>
        <div className="space-y-2">
          {courses.map((course) => (
            <div key={course} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <span className="text-sm text-text-primary">{course}</span>
              {isEditing && (
                <Button variant="outline" size="sm">Remove</Button>
              )}
            </div>
          ))}
        </div>
        {isEditing && (
          <div className="mt-4 pt-4 border-t">
            <Input placeholder="Add new course..." />
          </div>
        )}
      </Card>

      {/* Achievements */}
      <Card>
        <h3 className="text-lg font-bold text-text-primary mb-4">Achievements</h3>
        <div className="space-y-3">
          {achievements.map((achievement) => (
            <div key={achievement.title} className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg">
              <span className="text-2xl">{achievement.icon}</span>
              <div>
                <h4 className="font-medium text-text-primary">{achievement.title}</h4>
                <p className="text-sm text-text-secondary">{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      {/* Notification Settings */}
      <Card>
        <h3 className="text-lg font-bold text-text-primary mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-text-primary">Study Group Messages</h4>
              <p className="text-sm text-text-secondary">Get notified when someone messages in your study groups</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-text-primary">Help Requests</h4>
              <p className="text-sm text-text-secondary">Get notified about new help requests in your subjects</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-text-primary">Circle Updates</h4>
              <p className="text-sm text-text-secondary">Get notified about new posts in your circles</p>
            </div>
            <input type="checkbox" className="rounded" />
          </div>
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <h3 className="text-lg font-bold text-text-primary mb-4">Privacy</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-text-primary">Profile Visibility</h4>
              <p className="text-sm text-text-secondary">Allow others to see your profile and activity</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-text-primary">Show Online Status</h4>
              <p className="text-sm text-text-secondary">Let others know when you're online</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
        </div>
      </Card>

      {/* Account Settings */}
      <Card>
        <h3 className="text-lg font-bold text-text-primary mb-4">Account</h3>
        <div className="space-y-4">
          <Button variant="outline" className="w-full">
            Export My Data
          </Button>
          <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Profile
        </h2>
        <p className="text-text-secondary">
          Manage your profile and account settings
        </p>
      </div>

      <Tabs
        items={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'settings' && renderSettingsTab()}
    </div>
  );
}
