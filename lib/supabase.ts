import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client for browser usage
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Admin client for server-side operations (if needed)
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Helper functions for common operations
export const supabaseHelpers = {
  // User operations
  async createUser(userData: {
    farcaster_id: string;
    display_name: string;
    bio?: string;
    interests?: string[];
    courses?: string[];
    avatar?: string;
  }) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserByFarcasterId(farcasterId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('farcaster_id', farcasterId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Study Group operations
  async getStudyGroups(filters?: { course?: string; search?: string }) {
    let query = supabase
      .from('study_groups')
      .select(`
        *,
        creator:users!study_groups_created_by_fkey(display_name, avatar),
        members:study_group_members(
          user:users(display_name, avatar)
        )
      `)
      .eq('is_active', true);

    if (filters?.course) {
      query = query.eq('course', filters.course);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createStudyGroup(groupData: {
    name: string;
    description: string;
    course: string;
    created_by: string;
    max_members?: number;
    schedule_link?: string;
  }) {
    const { data, error } = await supabase
      .from('study_groups')
      .insert([groupData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async joinStudyGroup(groupId: string, userId: string) {
    const { data, error } = await supabase
      .from('study_group_members')
      .insert([{ group_id: groupId, user_id: userId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Circle operations
  async getCircles(filters?: { topic?: string; search?: string }) {
    let query = supabase
      .from('circles')
      .select(`
        *,
        creator:users!circles_created_by_fkey(display_name, avatar),
        members:circle_members(
          user:users(display_name, avatar)
        )
      `)
      .eq('is_private', false);

    if (filters?.topic) {
      query = query.eq('topic', filters.topic);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createCircle(circleData: {
    name: string;
    description: string;
    topic: string;
    created_by: string;
    is_private?: boolean;
  }) {
    const { data, error } = await supabase
      .from('circles')
      .insert([circleData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Help Request operations
  async getHelpRequests(filters?: { status?: string; course?: string }) {
    let query = supabase
      .from('help_requests')
      .select(`
        *,
        requester:users!help_requests_user_id_fkey(display_name, avatar),
        responses:help_responses(
          *,
          helper:users!help_responses_helper_id_fkey(display_name, avatar)
        )
      `);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.course) {
      query = query.eq('course', filters.course);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createHelpRequest(requestData: {
    user_id: string;
    title: string;
    description: string;
    course?: string;
    subject: string;
    urgency: 'low' | 'medium' | 'high';
  }) {
    const { data, error } = await supabase
      .from('help_requests')
      .insert([requestData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async createHelpResponse(responseData: {
    helper_id: string;
    request_id: string;
    content: string;
  }) {
    const { data, error } = await supabase
      .from('help_responses')
      .insert([responseData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};
