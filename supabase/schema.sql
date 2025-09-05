-- EduConnect Database Schema
-- This file contains the complete database schema for the EduConnect application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farcaster_id TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    bio TEXT DEFAULT '',
    interests TEXT[] DEFAULT '{}',
    courses TEXT[] DEFAULT '{}',
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study Groups table
CREATE TABLE IF NOT EXISTS study_groups (
    group_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    course TEXT NOT NULL,
    members TEXT[] DEFAULT '{}',
    schedule_link TEXT,
    created_by UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    max_members INTEGER DEFAULT 20,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Circles table
CREATE TABLE IF NOT EXISTS circles (
    circle_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    topic TEXT NOT NULL,
    members TEXT[] DEFAULT '{}',
    created_by UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    is_private BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Help Requests table
CREATE TABLE IF NOT EXISTS help_requests (
    request_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    course TEXT,
    subject TEXT NOT NULL,
    urgency TEXT NOT NULL CHECK (urgency IN ('low', 'medium', 'high')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Help Responses table
CREATE TABLE IF NOT EXISTS help_responses (
    response_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    helper_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    request_id UUID NOT NULL REFERENCES help_requests(request_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_accepted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    message_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    group_id UUID NOT NULL, -- Can reference either study_groups or circles
    content TEXT NOT NULL,
    message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'help_request', 'announcement')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Activity Log table (for analytics and engagement tracking)
CREATE TABLE IF NOT EXISTS user_activity (
    activity_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    activity_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    notification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    related_id UUID, -- Can reference various entities
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_farcaster_id ON users(farcaster_id);
CREATE INDEX IF NOT EXISTS idx_study_groups_course ON study_groups(course);
CREATE INDEX IF NOT EXISTS idx_study_groups_created_by ON study_groups(created_by);
CREATE INDEX IF NOT EXISTS idx_study_groups_is_active ON study_groups(is_active);
CREATE INDEX IF NOT EXISTS idx_circles_topic ON circles(topic);
CREATE INDEX IF NOT EXISTS idx_circles_created_by ON circles(created_by);
CREATE INDEX IF NOT EXISTS idx_circles_is_private ON circles(is_private);
CREATE INDEX IF NOT EXISTS idx_help_requests_user_id ON help_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_help_requests_status ON help_requests(status);
CREATE INDEX IF NOT EXISTS idx_help_requests_course ON help_requests(course);
CREATE INDEX IF NOT EXISTS idx_help_requests_subject ON help_requests(subject);
CREATE INDEX IF NOT EXISTS idx_help_responses_request_id ON help_responses(request_id);
CREATE INDEX IF NOT EXISTS idx_help_responses_helper_id ON help_responses(helper_id);
CREATE INDEX IF NOT EXISTS idx_messages_group_id ON messages(group_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON user_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_groups_updated_at BEFORE UPDATE ON study_groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_circles_updated_at BEFORE UPDATE ON circles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_help_requests_updated_at BEFORE UPDATE ON help_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Study Groups policies
CREATE POLICY "Anyone can view active study groups" ON study_groups FOR SELECT USING (is_active = true);
CREATE POLICY "Users can create study groups" ON study_groups FOR INSERT WITH CHECK (auth.uid()::text = created_by::text);
CREATE POLICY "Creators can update their study groups" ON study_groups FOR UPDATE USING (auth.uid()::text = created_by::text);

-- Circles policies
CREATE POLICY "Anyone can view public circles" ON circles FOR SELECT USING (is_private = false);
CREATE POLICY "Members can view private circles" ON circles FOR SELECT USING (
    is_private = true AND auth.uid()::text = ANY(members)
);
CREATE POLICY "Users can create circles" ON circles FOR INSERT WITH CHECK (auth.uid()::text = created_by::text);
CREATE POLICY "Creators can update their circles" ON circles FOR UPDATE USING (auth.uid()::text = created_by::text);

-- Help Requests policies
CREATE POLICY "Anyone can view open help requests" ON help_requests FOR SELECT USING (status = 'open');
CREATE POLICY "Users can view their own help requests" ON help_requests FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can create help requests" ON help_requests FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own help requests" ON help_requests FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Help Responses policies
CREATE POLICY "Anyone can view help responses" ON help_responses FOR SELECT USING (true);
CREATE POLICY "Users can create help responses" ON help_responses FOR INSERT WITH CHECK (auth.uid()::text = helper_id::text);
CREATE POLICY "Helpers can update their responses" ON help_responses FOR UPDATE USING (auth.uid()::text = helper_id::text);

-- Messages policies
CREATE POLICY "Group members can view messages" ON messages FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM study_groups sg 
        WHERE sg.group_id::text = messages.group_id::text 
        AND auth.uid()::text = ANY(sg.members)
    ) OR EXISTS (
        SELECT 1 FROM circles c 
        WHERE c.circle_id::text = messages.group_id::text 
        AND auth.uid()::text = ANY(c.members)
    )
);
CREATE POLICY "Users can send messages to their groups" ON messages FOR INSERT WITH CHECK (
    auth.uid()::text = sender_id::text AND (
        EXISTS (
            SELECT 1 FROM study_groups sg 
            WHERE sg.group_id::text = messages.group_id::text 
            AND auth.uid()::text = ANY(sg.members)
        ) OR EXISTS (
            SELECT 1 FROM circles c 
            WHERE c.circle_id::text = messages.group_id::text 
            AND auth.uid()::text = ANY(c.members)
        )
    )
);

-- User Activity policies
CREATE POLICY "Users can view their own activity" ON user_activity FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert their own activity" ON user_activity FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Functions for common operations
CREATE OR REPLACE FUNCTION get_user_study_groups(user_uuid UUID)
RETURNS TABLE (
    group_id UUID,
    name TEXT,
    description TEXT,
    course TEXT,
    members TEXT[],
    schedule_link TEXT,
    created_by UUID,
    max_members INTEGER,
    is_active BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT sg.group_id, sg.name, sg.description, sg.course, sg.members, 
           sg.schedule_link, sg.created_by, sg.max_members, sg.is_active,
           sg.created_at, sg.updated_at
    FROM study_groups sg
    WHERE sg.is_active = true 
    AND user_uuid::text = ANY(sg.members);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_circles(user_uuid UUID)
RETURNS TABLE (
    circle_id UUID,
    name TEXT,
    description TEXT,
    topic TEXT,
    members TEXT[],
    created_by UUID,
    is_private BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT c.circle_id, c.name, c.description, c.topic, c.members,
           c.created_by, c.is_private, c.created_at, c.updated_at
    FROM circles c
    WHERE user_uuid::text = ANY(c.members);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search study groups
CREATE OR REPLACE FUNCTION search_study_groups(search_query TEXT, course_filter TEXT DEFAULT NULL)
RETURNS TABLE (
    group_id UUID,
    name TEXT,
    description TEXT,
    course TEXT,
    members TEXT[],
    schedule_link TEXT,
    created_by UUID,
    max_members INTEGER,
    is_active BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT sg.group_id, sg.name, sg.description, sg.course, sg.members,
           sg.schedule_link, sg.created_by, sg.max_members, sg.is_active,
           sg.created_at, sg.updated_at
    FROM study_groups sg
    WHERE sg.is_active = true
    AND (
        sg.name ILIKE '%' || search_query || '%' OR
        sg.description ILIKE '%' || search_query || '%'
    )
    AND (course_filter IS NULL OR sg.course = course_filter)
    ORDER BY sg.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search circles
CREATE OR REPLACE FUNCTION search_circles(search_query TEXT, topic_filter TEXT DEFAULT NULL)
RETURNS TABLE (
    circle_id UUID,
    name TEXT,
    description TEXT,
    topic TEXT,
    members TEXT[],
    created_by UUID,
    is_private BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT c.circle_id, c.name, c.description, c.topic, c.members,
           c.created_by, c.is_private, c.created_at, c.updated_at
    FROM circles c
    WHERE c.is_private = false
    AND (
        c.name ILIKE '%' || search_query || '%' OR
        c.description ILIKE '%' || search_query || '%'
    )
    AND (topic_filter IS NULL OR c.topic = topic_filter)
    ORDER BY c.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample data for development (optional)
-- This can be removed in production
INSERT INTO users (user_id, farcaster_id, display_name, bio, interests, courses, avatar) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', '12345', 'Alice Johnson', 'Computer Science student passionate about AI and machine learning', ARRAY['Technology', 'AI', 'Programming'], ARRAY['Computer Science', 'Mathematics'], 'https://example.com/avatar1.jpg'),
    ('550e8400-e29b-41d4-a716-446655440001', '12346', 'Bob Smith', 'Physics major interested in quantum computing and research', ARRAY['Physics', 'Research', 'Quantum Computing'], ARRAY['Physics', 'Mathematics'], 'https://example.com/avatar2.jpg'),
    ('550e8400-e29b-41d4-a716-446655440002', '12347', 'Carol Davis', 'Business student with interests in entrepreneurship and finance', ARRAY['Business', 'Entrepreneurship', 'Finance'], ARRAY['Business', 'Economics'], 'https://example.com/avatar3.jpg')
ON CONFLICT (farcaster_id) DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
