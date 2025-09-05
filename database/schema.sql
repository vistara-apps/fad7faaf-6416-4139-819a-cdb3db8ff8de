-- EduConnect Database Schema
-- Run this script in your Supabase SQL editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE urgency_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE help_status AS ENUM ('open', 'in_progress', 'resolved');
CREATE TYPE message_type AS ENUM ('text', 'help_request', 'announcement');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farcaster_id TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    bio TEXT,
    interests TEXT[],
    courses TEXT[],
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study groups table
CREATE TABLE study_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    course TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    max_members INTEGER DEFAULT 10,
    schedule_link TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study group members table (many-to-many relationship)
CREATE TABLE study_group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- Circles table (interest-based communities)
CREATE TABLE circles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    topic TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_private BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Circle members table (many-to-many relationship)
CREATE TABLE circle_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(circle_id, user_id)
);

-- Help requests table
CREATE TABLE help_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    course TEXT,
    subject TEXT NOT NULL,
    urgency urgency_level DEFAULT 'medium',
    status help_status DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Help responses table
CREATE TABLE help_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    helper_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    request_id UUID NOT NULL REFERENCES help_requests(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_accepted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table (for study group chat)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    type message_type DEFAULT 'text',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_farcaster_id ON users(farcaster_id);
CREATE INDEX idx_study_groups_course ON study_groups(course);
CREATE INDEX idx_study_groups_created_by ON study_groups(created_by);
CREATE INDEX idx_study_groups_is_active ON study_groups(is_active);
CREATE INDEX idx_study_group_members_group_id ON study_group_members(group_id);
CREATE INDEX idx_study_group_members_user_id ON study_group_members(user_id);
CREATE INDEX idx_circles_topic ON circles(topic);
CREATE INDEX idx_circles_created_by ON circles(created_by);
CREATE INDEX idx_circles_is_private ON circles(is_private);
CREATE INDEX idx_circle_members_circle_id ON circle_members(circle_id);
CREATE INDEX idx_circle_members_user_id ON circle_members(user_id);
CREATE INDEX idx_help_requests_user_id ON help_requests(user_id);
CREATE INDEX idx_help_requests_status ON help_requests(status);
CREATE INDEX idx_help_requests_course ON help_requests(course);
CREATE INDEX idx_help_requests_subject ON help_requests(subject);
CREATE INDEX idx_help_responses_helper_id ON help_responses(helper_id);
CREATE INDEX idx_help_responses_request_id ON help_responses(request_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_group_id ON messages(group_id);

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
ALTER TABLE study_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can read all user profiles but only update their own
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Study groups are publicly readable, but only creators can update
CREATE POLICY "Study groups are viewable by everyone" ON study_groups FOR SELECT USING (true);
CREATE POLICY "Users can create study groups" ON study_groups FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own study groups" ON study_groups FOR UPDATE USING (created_by::text = auth.uid()::text);

-- Study group members
CREATE POLICY "Study group members are viewable by everyone" ON study_group_members FOR SELECT USING (true);
CREATE POLICY "Users can join study groups" ON study_group_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can leave study groups" ON study_group_members FOR DELETE USING (user_id::text = auth.uid()::text);

-- Circles (similar to study groups)
CREATE POLICY "Public circles are viewable by everyone" ON circles FOR SELECT USING (NOT is_private);
CREATE POLICY "Users can create circles" ON circles FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own circles" ON circles FOR UPDATE USING (created_by::text = auth.uid()::text);

-- Circle members
CREATE POLICY "Circle members are viewable for public circles" ON circle_members FOR SELECT USING (
    EXISTS (SELECT 1 FROM circles WHERE circles.id = circle_members.circle_id AND NOT circles.is_private)
);
CREATE POLICY "Users can join circles" ON circle_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can leave circles" ON circle_members FOR DELETE USING (user_id::text = auth.uid()::text);

-- Help requests are publicly readable
CREATE POLICY "Help requests are viewable by everyone" ON help_requests FOR SELECT USING (true);
CREATE POLICY "Users can create help requests" ON help_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own help requests" ON help_requests FOR UPDATE USING (user_id::text = auth.uid()::text);

-- Help responses are publicly readable
CREATE POLICY "Help responses are viewable by everyone" ON help_responses FOR SELECT USING (true);
CREATE POLICY "Users can create help responses" ON help_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own help responses" ON help_responses FOR UPDATE USING (helper_id::text = auth.uid()::text);

-- Messages are viewable by study group members
CREATE POLICY "Messages are viewable by group members" ON messages FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM study_group_members 
        WHERE study_group_members.group_id = messages.group_id 
        AND study_group_members.user_id::text = auth.uid()::text
    )
);
CREATE POLICY "Group members can send messages" ON messages FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM study_group_members 
        WHERE study_group_members.group_id = messages.group_id 
        AND study_group_members.user_id::text = auth.uid()::text
    )
);

-- Insert some sample data for development
INSERT INTO users (id, farcaster_id, display_name, bio, interests, courses, avatar) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', '12345', 'Alice Johnson', 'Computer Science student passionate about React and Web3', ARRAY['Technology', 'Programming', 'Web3'], ARRAY['Computer Science', 'Mathematics'], 'https://example.com/avatar1.jpg'),
    ('550e8400-e29b-41d4-a716-446655440001', '12346', 'Bob Smith', 'Math major who loves helping others with calculus', ARRAY['Mathematics', 'Teaching', 'Sports'], ARRAY['Mathematics', 'Physics'], 'https://example.com/avatar2.jpg'),
    ('550e8400-e29b-41d4-a716-446655440002', '12347', 'Carol Davis', 'Chemistry PhD student researching organic compounds', ARRAY['Chemistry', 'Research', 'Environment'], ARRAY['Chemistry', 'Biology'], 'https://example.com/avatar3.jpg');

-- Insert sample study groups
INSERT INTO study_groups (id, name, description, course, created_by, max_members) VALUES
    ('660e8400-e29b-41d4-a716-446655440000', 'Advanced React Patterns', 'Deep dive into React hooks, context, and advanced patterns for building scalable applications.', 'Computer Science', '550e8400-e29b-41d4-a716-446655440000', 10),
    ('660e8400-e29b-41d4-a716-446655440001', 'Calculus Study Group', 'Working through calculus problems together. Focus on derivatives and integrals.', 'Mathematics', '550e8400-e29b-41d4-a716-446655440001', 12),
    ('660e8400-e29b-41d4-a716-446655440002', 'Organic Chemistry Lab', 'Preparing for organic chemistry exams and lab work. Weekly problem-solving sessions.', 'Chemistry', '550e8400-e29b-41d4-a716-446655440002', 8);

-- Insert sample study group memberships
INSERT INTO study_group_members (group_id, user_id) VALUES
    ('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000'),
    ('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001'),
    ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001'),
    ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'),
    ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002');

-- Insert sample circles
INSERT INTO circles (id, name, description, topic, created_by) VALUES
    ('770e8400-e29b-41d4-a716-446655440000', 'Web3 Enthusiasts', 'Discussing the latest in blockchain, DeFi, and decentralized applications.', 'Technology', '550e8400-e29b-41d4-a716-446655440000'),
    ('770e8400-e29b-41d4-a716-446655440001', 'Study Abroad Planning', 'Planning and sharing experiences about studying abroad.', 'Travel', '550e8400-e29b-41d4-a716-446655440001'),
    ('770e8400-e29b-41d4-a716-446655440002', 'Environmental Science Club', 'Discussing environmental issues and sustainable practices.', 'Environment', '550e8400-e29b-41d4-a716-446655440002');

-- Insert sample help requests
INSERT INTO help_requests (id, user_id, title, description, course, subject, urgency) VALUES
    ('880e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'Need help with React useEffect', 'I''m struggling to understand when and how to use useEffect properly in my React components.', 'Computer Science', 'React Hooks', 'medium'),
    ('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Calculus integration by parts', 'Can someone explain the integration by parts method with some examples?', 'Mathematics', 'Calculus', 'high'),
    ('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Organic chemistry nomenclature', 'I need help understanding IUPAC naming conventions for organic compounds.', 'Chemistry', 'Nomenclature', 'low');
