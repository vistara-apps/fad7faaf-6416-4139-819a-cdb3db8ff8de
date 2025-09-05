// Core data model types
export interface User {
  userId: string;
  farcasterId: string;
  displayName: string;
  bio: string;
  interests: string[];
  courses: string[];
  avatar?: string;
  createdAt: Date;
}

export interface StudyGroup {
  groupId: string;
  name: string;
  description: string;
  course: string;
  members: string[];
  scheduleLink?: string;
  createdBy: string;
  createdAt: Date;
  maxMembers?: number;
  isActive: boolean;
}

export interface Circle {
  circleId: string;
  name: string;
  description: string;
  topic: string;
  members: string[];
  createdBy: string;
  createdAt: Date;
  isPrivate: boolean;
}

export interface Message {
  messageId: string;
  senderId: string;
  groupId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'help_request' | 'announcement';
}

export interface HelpRequest {
  requestId: string;
  userId: string;
  title: string;
  description: string;
  course?: string;
  subject: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: Date;
  responses: HelpResponse[];
}

export interface HelpResponse {
  responseId: string;
  helperId: string;
  requestId: string;
  content: string;
  createdAt: Date;
  isAccepted: boolean;
}

// UI Component Props
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}
