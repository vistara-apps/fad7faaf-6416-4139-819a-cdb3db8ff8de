export const APP_CONFIG = {
  name: 'EduConnect',
  tagline: 'Find your study squad and connect over shared interests',
  version: '1.0.0',
} as const;

export const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'Home' },
  { id: 'study-groups', label: 'Study Groups', icon: 'Users' },
  { id: 'circles', label: 'Circles', icon: 'Circle' },
  { id: 'help', label: 'Get Help', icon: 'HelpCircle' },
  { id: 'profile', label: 'Profile', icon: 'User' },
] as const;

export const STUDY_SUBJECTS = [
  'Mathematics',
  'Computer Science',
  'Physics',
  'Chemistry',
  'Biology',
  'Engineering',
  'Business',
  'Economics',
  'Psychology',
  'Literature',
  'History',
  'Art',
  'Music',
  'Languages',
  'Other',
] as const;

export const INTEREST_CATEGORIES = [
  'Technology',
  'Arts & Design',
  'Sports & Fitness',
  'Music',
  'Gaming',
  'Entrepreneurship',
  'Travel',
  'Cooking',
  'Photography',
  'Reading',
  'Volunteering',
  'Environment',
  'Health & Wellness',
  'Finance',
  'Other',
] as const;

export const URGENCY_LEVELS = [
  { value: 'low', label: 'Low', color: 'text-green-600' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
  { value: 'high', label: 'High', color: 'text-red-600' },
] as const;
