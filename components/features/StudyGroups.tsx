'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Tabs } from '@/components/ui/Tabs';
import { Search, Plus, Users, Calendar, BookOpen } from 'lucide-react';
import { type StudyGroup } from '@/lib/types';

export function StudyGroups() {
  const [activeTab, setActiveTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'browse', label: 'Browse', icon: <Search className="w-4 h-4" /> },
    { id: 'my-groups', label: 'My Groups', icon: <Users className="w-4 h-4" />, count: 3 },
    { id: 'create', label: 'Create', icon: <Plus className="w-4 h-4" /> },
  ];

  const studyGroups: StudyGroup[] = [
    {
      groupId: '1',
      name: 'Advanced React Patterns',
      description: 'Deep dive into React hooks, context, and advanced patterns for building scalable applications.',
      course: 'Computer Science',
      members: ['user1', 'user2', 'user3', 'user4', 'user5'],
      createdBy: 'user1',
      createdAt: new Date('2024-01-15'),
      maxMembers: 10,
      isActive: true,
      scheduleLink: 'https://calendly.com/react-study',
    },
    {
      groupId: '2',
      name: 'Calculus Study Group',
      description: 'Working through calculus problems together. Focus on derivatives and integrals.',
      course: 'Mathematics',
      members: ['user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8'],
      createdBy: 'user2',
      createdAt: new Date('2024-01-10'),
      maxMembers: 12,
      isActive: true,
    },
    {
      groupId: '3',
      name: 'Organic Chemistry Lab',
      description: 'Preparing for organic chemistry exams and lab work. Weekly problem-solving sessions.',
      course: 'Chemistry',
      members: ['user3', 'user4', 'user5'],
      createdBy: 'user3',
      createdAt: new Date('2024-01-20'),
      maxMembers: 8,
      isActive: true,
    },
  ];

  const myGroups = studyGroups.filter(group => 
    group.members.includes('current-user') || group.createdBy === 'current-user'
  );

  const filteredGroups = studyGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderBrowseTab = () => (
    <div className="space-y-4">
      <Input
        placeholder="Search study groups..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        icon={<Search className="w-4 h-4" />}
      />
      
      <div className="space-y-4">
        {filteredGroups.map((group) => (
          <Card key={group.groupId} hover>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-text-primary">{group.name}</h3>
                  <Badge variant="primary" size="sm" className="mt-1">
                    {group.course}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-sm text-text-secondary">
                    {group.members.length}/{group.maxMembers || '∞'} members
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-text-secondary">{group.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {group.members.slice(0, 4).map((member, index) => (
                    <Avatar
                      key={member}
                      name={`Member ${index + 1}`}
                      size="sm"
                      className="border-2 border-white"
                    />
                  ))}
                  {group.members.length > 4 && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-text-secondary">
                      +{group.members.length - 4}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {group.scheduleLink && (
                    <Button variant="outline" size="sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      Schedule
                    </Button>
                  )}
                  <Button variant="primary" size="sm">
                    Join Group
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderMyGroupsTab = () => (
    <div className="space-y-4">
      {myGroups.length === 0 ? (
        <Card className="text-center py-8">
          <BookOpen className="w-12 h-12 mx-auto text-text-secondary mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            No Study Groups Yet
          </h3>
          <p className="text-text-secondary mb-4">
            Join or create your first study group to get started!
          </p>
          <Button variant="primary" onClick={() => setActiveTab('browse')}>
            Browse Groups
          </Button>
        </Card>
      ) : (
        myGroups.map((group) => (
          <Card key={group.groupId}>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-text-primary">{group.name}</h3>
                  <Badge variant="accent" size="sm" className="mt-1">
                    {group.createdBy === 'current-user' ? 'Owner' : 'Member'}
                  </Badge>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
              
              <p className="text-sm text-text-secondary">{group.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-text-secondary">
                  {group.members.length} members
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Chat
                  </Button>
                  {group.scheduleLink && (
                    <Button variant="primary" size="sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      Schedule
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );

  const renderCreateTab = () => (
    <Card>
      <h3 className="text-lg font-bold text-text-primary mb-4">
        Create New Study Group
      </h3>
      <div className="space-y-4">
        <Input label="Group Name" placeholder="e.g., Advanced React Patterns" />
        <Input label="Course/Subject" placeholder="e.g., Computer Science" />
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Description
          </label>
          <textarea
            className="input-field min-h-[100px] resize-none"
            placeholder="Describe what your study group will focus on..."
          />
        </div>
        <Input
          label="Max Members (optional)"
          type="number"
          placeholder="10"
          min="2"
          max="50"
        />
        <Input
          label="Schedule Link (optional)"
          placeholder="https://calendly.com/your-link"
        />
        <Button variant="primary" className="w-full">
          Create Study Group
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Study Groups
        </h2>
        <p className="text-text-secondary">
          Find your perfect study squad and ace your courses together
        </p>
      </div>

      <Tabs
        items={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'browse' && renderBrowseTab()}
      {activeTab === 'my-groups' && renderMyGroupsTab()}
      {activeTab === 'create' && renderCreateTab()}
    </div>
  );
}
