'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Tabs } from '@/components/ui/Tabs';
import { Search, Plus, Users, Lock, Globe } from 'lucide-react';
import { type Circle } from '@/lib/types';

export function Circles() {
  const [activeTab, setActiveTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'browse', label: 'Browse', icon: <Search className="w-4 h-4" /> },
    { id: 'my-circles', label: 'My Circles', icon: <Users className="w-4 h-4" />, count: 2 },
    { id: 'create', label: 'Create', icon: <Plus className="w-4 h-4" /> },
  ];

  const circles: Circle[] = [
    {
      circleId: '1',
      name: 'Web3 Enthusiasts',
      description: 'Discussing the latest in blockchain technology, DeFi, and Web3 development.',
      topic: 'Technology',
      members: ['user1', 'user2', 'user3', 'user4', 'user5', 'user6'],
      createdBy: 'user1',
      createdAt: new Date('2024-01-15'),
      isPrivate: false,
    },
    {
      circleId: '2',
      name: 'Digital Art Collective',
      description: 'Sharing and critiquing digital artwork, discussing techniques and tools.',
      topic: 'Arts & Design',
      members: ['user2', 'user3', 'user4', 'user5'],
      createdBy: 'user2',
      createdAt: new Date('2024-01-10'),
      isPrivate: false,
    },
    {
      circleId: '3',
      name: 'Startup Founders',
      description: 'Private group for discussing entrepreneurship, funding, and startup challenges.',
      topic: 'Entrepreneurship',
      members: ['user3', 'user4', 'user5', 'user6', 'user7'],
      createdBy: 'user3',
      createdAt: new Date('2024-01-20'),
      isPrivate: true,
    },
    {
      circleId: '4',
      name: 'Photography Club',
      description: 'Share your photos, get feedback, and learn new photography techniques.',
      topic: 'Photography',
      members: ['user4', 'user5', 'user6', 'user7', 'user8', 'user9', 'user10'],
      createdBy: 'user4',
      createdAt: new Date('2024-01-12'),
      isPrivate: false,
    },
  ];

  const myCircles = circles.filter(circle => 
    circle.members.includes('current-user') || circle.createdBy === 'current-user'
  );

  const filteredCircles = circles.filter(circle =>
    circle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    circle.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    circle.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTopicColor = (topic: string) => {
    const colors: Record<string, string> = {
      'Technology': 'bg-blue-100 text-blue-800',
      'Arts & Design': 'bg-purple-100 text-purple-800',
      'Entrepreneurship': 'bg-green-100 text-green-800',
      'Photography': 'bg-yellow-100 text-yellow-800',
      'Music': 'bg-pink-100 text-pink-800',
      'Sports & Fitness': 'bg-orange-100 text-orange-800',
    };
    return colors[topic] || 'bg-gray-100 text-gray-800';
  };

  const renderBrowseTab = () => (
    <div className="space-y-4">
      <Input
        placeholder="Search circles..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        icon={<Search className="w-4 h-4" />}
      />
      
      <div className="space-y-4">
        {filteredCircles.map((circle) => (
          <Card key={circle.circleId} hover>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-text-primary">{circle.name}</h3>
                    {circle.isPrivate ? (
                      <Lock className="w-4 h-4 text-text-secondary" />
                    ) : (
                      <Globe className="w-4 h-4 text-text-secondary" />
                    )}
                  </div>
                  <Badge className={`mt-1 ${getTopicColor(circle.topic)}`} size="sm">
                    {circle.topic}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-sm text-text-secondary">
                    {circle.members.length} members
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-text-secondary">{circle.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {circle.members.slice(0, 5).map((member, index) => (
                    <Avatar
                      key={member}
                      name={`Member ${index + 1}`}
                      size="sm"
                      className="border-2 border-white"
                    />
                  ))}
                  {circle.members.length > 5 && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-text-secondary">
                      +{circle.members.length - 5}
                    </div>
                  )}
                </div>
                
                <Button variant="primary" size="sm">
                  {circle.isPrivate ? 'Request to Join' : 'Join Circle'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderMyCirclesTab = () => (
    <div className="space-y-4">
      {myCircles.length === 0 ? (
        <Card className="text-center py-8">
          <Users className="w-12 h-12 mx-auto text-text-secondary mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            No Circles Yet
          </h3>
          <p className="text-text-secondary mb-4">
            Join or create your first circle to connect with like-minded people!
          </p>
          <Button variant="primary" onClick={() => setActiveTab('browse')}>
            Browse Circles
          </Button>
        </Card>
      ) : (
        myCircles.map((circle) => (
          <Card key={circle.circleId}>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-text-primary">{circle.name}</h3>
                    {circle.isPrivate ? (
                      <Lock className="w-4 h-4 text-text-secondary" />
                    ) : (
                      <Globe className="w-4 h-4 text-text-secondary" />
                    )}
                  </div>
                  <Badge variant="accent" size="sm" className="mt-1">
                    {circle.createdBy === 'current-user' ? 'Owner' : 'Member'}
                  </Badge>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
              
              <p className="text-sm text-text-secondary">{circle.description}</p>
              
              <div className="flex items-center justify-between">
                <Badge className={getTopicColor(circle.topic)} size="sm">
                  {circle.topic}
                </Badge>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Posts
                  </Button>
                  <Button variant="primary" size="sm">
                    Chat
                  </Button>
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
        Create New Circle
      </h3>
      <div className="space-y-4">
        <Input label="Circle Name" placeholder="e.g., Web3 Enthusiasts" />
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Topic Category
          </label>
          <select className="input-field">
            <option value="">Select a topic...</option>
            <option value="Technology">Technology</option>
            <option value="Arts & Design">Arts & Design</option>
            <option value="Sports & Fitness">Sports & Fitness</option>
            <option value="Music">Music</option>
            <option value="Gaming">Gaming</option>
            <option value="Entrepreneurship">Entrepreneurship</option>
            <option value="Photography">Photography</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Description
          </label>
          <textarea
            className="input-field min-h-[100px] resize-none"
            placeholder="Describe what your circle is about..."
          />
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="private" className="rounded" />
          <label htmlFor="private" className="text-sm text-text-primary">
            Make this circle private (members need approval to join)
          </label>
        </div>
        <Button variant="primary" className="w-full">
          Create Circle
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Interest Circles
        </h2>
        <p className="text-text-secondary">
          Connect with people who share your passions and interests
        </p>
      </div>

      <Tabs
        items={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'browse' && renderBrowseTab()}
      {activeTab === 'my-circles' && renderMyCirclesTab()}
      {activeTab === 'create' && renderCreateTab()}
    </div>
  );
}
