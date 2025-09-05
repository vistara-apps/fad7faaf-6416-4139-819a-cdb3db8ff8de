'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Tabs } from '@/components/ui/Tabs';
import { HelpCircle, Plus, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import { type HelpRequest } from '@/lib/types';
import { formatRelativeTime } from '@/lib/utils';

export function StudyHelp() {
  const [activeTab, setActiveTab] = useState('browse');

  const tabs = [
    { id: 'browse', label: 'Browse Requests', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'my-requests', label: 'My Requests', icon: <MessageCircle className="w-4 h-4" />, count: 2 },
    { id: 'create', label: 'Ask for Help', icon: <Plus className="w-4 h-4" /> },
  ];

  const helpRequests: HelpRequest[] = [
    {
      requestId: '1',
      userId: 'user1',
      title: 'Need help with React useEffect cleanup',
      description: 'I\'m having trouble understanding when and how to properly clean up useEffect hooks. My component is causing memory leaks.',
      course: 'Computer Science',
      subject: 'React/JavaScript',
      urgency: 'medium',
      status: 'open',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      responses: [],
    },
    {
      requestId: '2',
      userId: 'user2',
      title: 'Calculus integration by parts',
      description: 'Can someone walk me through the integration by parts formula? I understand the concept but struggle with applying it to complex problems.',
      course: 'Mathematics',
      subject: 'Calculus',
      urgency: 'high',
      status: 'in_progress',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      responses: [
        {
          responseId: '1',
          helperId: 'helper1',
          requestId: '2',
          content: 'I can help with this! Let me break down the formula step by step...',
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
          isAccepted: true,
        },
      ],
    },
    {
      requestId: '3',
      userId: 'user3',
      title: 'Organic chemistry reaction mechanisms',
      description: 'Having trouble understanding SN1 vs SN2 reaction mechanisms. When do I use which one?',
      course: 'Chemistry',
      subject: 'Organic Chemistry',
      urgency: 'low',
      status: 'resolved',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      responses: [
        {
          responseId: '2',
          helperId: 'helper2',
          requestId: '3',
          content: 'Great question! The key difference is...',
          createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
          isAccepted: true,
        },
      ],
    },
  ];

  const myRequests = helpRequests.filter(request => request.userId === 'current-user');

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <HelpCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  const renderBrowseTab = () => (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Badge variant="outline" size="sm">All Subjects</Badge>
        <Badge variant="outline" size="sm">Computer Science</Badge>
        <Badge variant="outline" size="sm">Mathematics</Badge>
        <Badge variant="outline" size="sm">Chemistry</Badge>
        <Badge variant="outline" size="sm">Physics</Badge>
      </div>
      
      <div className="space-y-4">
        {helpRequests.map((request) => (
          <Card key={request.requestId} hover>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-text-primary">{request.title}</h3>
                    <Badge className={getUrgencyColor(request.urgency)} size="sm">
                      {request.urgency}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" size="sm">{request.course}</Badge>
                    <Badge variant="outline" size="sm">{request.subject}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(request.status)}
                  <Badge className={getStatusColor(request.status)} size="sm">
                    {request.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              
              <p className="text-sm text-text-secondary">{request.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar name="Student" size="sm" />
                  <span className="text-sm text-text-secondary">
                    {formatRelativeTime(request.createdAt)}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  {request.responses.length > 0 && (
                    <span className="text-sm text-text-secondary">
                      {request.responses.length} response{request.responses.length !== 1 ? 's' : ''}
                    </span>
                  )}
                  <Button variant="primary" size="sm">
                    {request.status === 'open' ? 'Help Out' : 'View Thread'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderMyRequestsTab = () => (
    <div className="space-y-4">
      {myRequests.length === 0 ? (
        <Card className="text-center py-8">
          <HelpCircle className="w-12 h-12 mx-auto text-text-secondary mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            No Help Requests Yet
          </h3>
          <p className="text-text-secondary mb-4">
            When you need help with your studies, create a request and get assistance from your peers!
          </p>
          <Button variant="primary" onClick={() => setActiveTab('create')}>
            Ask for Help
          </Button>
        </Card>
      ) : (
        myRequests.map((request) => (
          <Card key={request.requestId}>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-text-primary">{request.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getStatusColor(request.status)} size="sm">
                      {request.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={getUrgencyColor(request.urgency)} size="sm">
                      {request.urgency}
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
              
              <p className="text-sm text-text-secondary">{request.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">
                  Created {formatRelativeTime(request.createdAt)}
                </span>
                <div className="flex gap-2">
                  <span className="text-sm text-text-secondary">
                    {request.responses.length} response{request.responses.length !== 1 ? 's' : ''}
                  </span>
                  <Button variant="primary" size="sm">
                    View Responses
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
        Ask for Help
      </h3>
      <div className="space-y-4">
        <Input 
          label="Title" 
          placeholder="Brief description of what you need help with" 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Course" placeholder="e.g., Computer Science" />
          <Input label="Subject" placeholder="e.g., React/JavaScript" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Urgency Level
          </label>
          <select className="input-field">
            <option value="low">Low - Can wait a few days</option>
            <option value="medium">Medium - Need help within 24 hours</option>
            <option value="high">High - Need help ASAP</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Detailed Description
          </label>
          <textarea
            className="input-field min-h-[120px] resize-none"
            placeholder="Explain your question in detail. Include what you've tried and where you're stuck..."
          />
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-text-primary mb-2">💡 Tips for getting better help:</h4>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>• Be specific about what you're struggling with</li>
            <li>• Include relevant code, formulas, or examples</li>
            <li>• Mention what you've already tried</li>
            <li>• Set appropriate urgency level</li>
          </ul>
        </div>
        
        <Button variant="primary" className="w-full">
          Post Help Request
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Study Help
        </h2>
        <p className="text-text-secondary">
          Get quick help from your peers or help others with their questions
        </p>
      </div>

      <Tabs
        items={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'browse' && renderBrowseTab()}
      {activeTab === 'my-requests' && renderMyRequestsTab()}
      {activeTab === 'create' && renderCreateTab()}
    </div>
  );
}
