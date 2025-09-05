import { createClient } from '@supabase/supabase-js';
import { User, StudyGroup, Circle, Message, HelpRequest, HelpResponse } from '../types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// User operations
export const userService = {
  async createUser(user: Omit<User, 'createdAt'>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert([{ ...user, created_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw new Error(`Failed to create user: ${error.message}`);
    return data;
  },

  async getUserById(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get user: ${error.message}`);
    }
    return data;
  },

  async getUserByFarcasterId(farcasterId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('farcaster_id', farcasterId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get user by Farcaster ID: ${error.message}`);
    }
    return data;
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update user: ${error.message}`);
    return data;
  },

  async searchUsers(query: string, interests?: string[]): Promise<User[]> {
    let queryBuilder = supabase
      .from('users')
      .select('*')
      .or(`display_name.ilike.%${query}%, bio.ilike.%${query}%`);

    if (interests && interests.length > 0) {
      queryBuilder = queryBuilder.overlaps('interests', interests);
    }

    const { data, error } = await queryBuilder.limit(20);

    if (error) throw new Error(`Failed to search users: ${error.message}`);
    return data || [];
  },
};

// Study Group operations
export const studyGroupService = {
  async createStudyGroup(group: Omit<StudyGroup, 'createdAt'>): Promise<StudyGroup> {
    const { data, error } = await supabase
      .from('study_groups')
      .insert([{ ...group, created_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw new Error(`Failed to create study group: ${error.message}`);
    return data;
  },

  async getStudyGroups(userId?: string, course?: string): Promise<StudyGroup[]> {
    let query = supabase.from('study_groups').select('*').eq('is_active', true);

    if (course) {
      query = query.eq('course', course);
    }

    if (userId) {
      query = query.contains('members', [userId]);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to get study groups: ${error.message}`);
    return data || [];
  },

  async joinStudyGroup(groupId: string, userId: string): Promise<StudyGroup> {
    // First get the current group
    const { data: group, error: fetchError } = await supabase
      .from('study_groups')
      .select('*')
      .eq('group_id', groupId)
      .single();

    if (fetchError) throw new Error(`Failed to fetch study group: ${fetchError.message}`);

    // Check if user is already a member
    if (group.members.includes(userId)) {
      return group;
    }

    // Check max members limit
    if (group.max_members && group.members.length >= group.max_members) {
      throw new Error('Study group is full');
    }

    // Add user to members
    const updatedMembers = [...group.members, userId];
    const { data, error } = await supabase
      .from('study_groups')
      .update({ members: updatedMembers })
      .eq('group_id', groupId)
      .select()
      .single();

    if (error) throw new Error(`Failed to join study group: ${error.message}`);
    return data;
  },

  async leaveStudyGroup(groupId: string, userId: string): Promise<StudyGroup> {
    const { data: group, error: fetchError } = await supabase
      .from('study_groups')
      .select('*')
      .eq('group_id', groupId)
      .single();

    if (fetchError) throw new Error(`Failed to fetch study group: ${fetchError.message}`);

    const updatedMembers = group.members.filter((id: string) => id !== userId);
    const { data, error } = await supabase
      .from('study_groups')
      .update({ members: updatedMembers })
      .eq('group_id', groupId)
      .select()
      .single();

    if (error) throw new Error(`Failed to leave study group: ${error.message}`);
    return data;
  },

  async searchStudyGroups(query: string, course?: string): Promise<StudyGroup[]> {
    let queryBuilder = supabase
      .from('study_groups')
      .select('*')
      .eq('is_active', true)
      .or(`name.ilike.%${query}%, description.ilike.%${query}%`);

    if (course) {
      queryBuilder = queryBuilder.eq('course', course);
    }

    const { data, error } = await queryBuilder
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw new Error(`Failed to search study groups: ${error.message}`);
    return data || [];
  },
};

// Circle operations
export const circleService = {
  async createCircle(circle: Omit<Circle, 'createdAt'>): Promise<Circle> {
    const { data, error } = await supabase
      .from('circles')
      .insert([{ ...circle, created_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw new Error(`Failed to create circle: ${error.message}`);
    return data;
  },

  async getCircles(userId?: string, topic?: string): Promise<Circle[]> {
    let query = supabase.from('circles').select('*');

    if (topic) {
      query = query.eq('topic', topic);
    }

    if (userId) {
      query = query.contains('members', [userId]);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to get circles: ${error.message}`);
    return data || [];
  },

  async joinCircle(circleId: string, userId: string): Promise<Circle> {
    const { data: circle, error: fetchError } = await supabase
      .from('circles')
      .select('*')
      .eq('circle_id', circleId)
      .single();

    if (fetchError) throw new Error(`Failed to fetch circle: ${fetchError.message}`);

    if (circle.members.includes(userId)) {
      return circle;
    }

    const updatedMembers = [...circle.members, userId];
    const { data, error } = await supabase
      .from('circles')
      .update({ members: updatedMembers })
      .eq('circle_id', circleId)
      .select()
      .single();

    if (error) throw new Error(`Failed to join circle: ${error.message}`);
    return data;
  },

  async leaveCircle(circleId: string, userId: string): Promise<Circle> {
    const { data: circle, error: fetchError } = await supabase
      .from('circles')
      .select('*')
      .eq('circle_id', circleId)
      .single();

    if (fetchError) throw new Error(`Failed to fetch circle: ${fetchError.message}`);

    const updatedMembers = circle.members.filter((id: string) => id !== userId);
    const { data, error } = await supabase
      .from('circles')
      .update({ members: updatedMembers })
      .eq('circle_id', circleId)
      .select()
      .single();

    if (error) throw new Error(`Failed to leave circle: ${error.message}`);
    return data;
  },

  async searchCircles(query: string, topic?: string): Promise<Circle[]> {
    let queryBuilder = supabase
      .from('circles')
      .select('*')
      .or(`name.ilike.%${query}%, description.ilike.%${query}%`);

    if (topic) {
      queryBuilder = queryBuilder.eq('topic', topic);
    }

    const { data, error } = await queryBuilder
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw new Error(`Failed to search circles: ${error.message}`);
    return data || [];
  },
};

// Help Request operations
export const helpService = {
  async createHelpRequest(request: Omit<HelpRequest, 'createdAt' | 'responses'>): Promise<HelpRequest> {
    const { data, error } = await supabase
      .from('help_requests')
      .insert([{ ...request, created_at: new Date().toISOString(), responses: [] }])
      .select()
      .single();

    if (error) throw new Error(`Failed to create help request: ${error.message}`);
    return data;
  },

  async getHelpRequests(status?: string, course?: string): Promise<HelpRequest[]> {
    let query = supabase.from('help_requests').select('*');

    if (status) {
      query = query.eq('status', status);
    }

    if (course) {
      query = query.eq('course', course);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to get help requests: ${error.message}`);
    return data || [];
  },

  async addHelpResponse(response: Omit<HelpResponse, 'createdAt'>): Promise<HelpResponse> {
    const { data, error } = await supabase
      .from('help_responses')
      .insert([{ ...response, created_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw new Error(`Failed to add help response: ${error.message}`);
    return data;
  },

  async updateHelpRequestStatus(requestId: string, status: 'open' | 'in_progress' | 'resolved'): Promise<HelpRequest> {
    const { data, error } = await supabase
      .from('help_requests')
      .update({ status })
      .eq('request_id', requestId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update help request status: ${error.message}`);
    return data;
  },
};

// Message operations
export const messageService = {
  async sendMessage(message: Omit<Message, 'timestamp'>): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert([{ ...message, timestamp: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw new Error(`Failed to send message: ${error.message}`);
    return data;
  },

  async getMessages(groupId: string, limit = 50): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('group_id', groupId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Failed to get messages: ${error.message}`);
    return data || [];
  },
};
