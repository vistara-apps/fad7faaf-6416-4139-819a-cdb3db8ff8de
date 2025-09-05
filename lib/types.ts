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
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'elevated' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
  hover?: boolean; // Legacy support
}

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}
