-- Nian Chat Database Schema for Supabase
-- Run this in your Supabase SQL Editor to set up the characters table

-- Create characters table
CREATE TABLE IF NOT EXISTS public.characters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Basic info
    name VARCHAR(255) NOT NULL,
    tagline TEXT,
    color VARCHAR(7) DEFAULT '#8B6FBF',
    
    -- Character details
    personality TEXT NOT NULL,
    scenario TEXT NOT NULL,
    traits TEXT[] DEFAULT '{}',
    greeting TEXT,
    
    -- Metadata
    messages_count INTEGER DEFAULT 0,
    
    -- User association (if you want to add authentication later)
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Make sure name is indexed for faster queries
    CONSTRAINT characters_name_check CHECK (char_length(name) >= 1)
);

-- Create messages table for persisting conversation history
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
    role VARCHAR(10) NOT NULL CHECK (role IN ('user', 'ai')),
    content TEXT NOT NULL
);

-- Index for fast lookup of a character's messages in order
CREATE INDEX IF NOT EXISTS messages_character_id_created_at_idx
    ON public.messages (character_id, created_at ASC);

-- Enable Row Level Security (open policy for personal use)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS characters_created_at_idx ON public.characters(created_at DESC);

-- Create index on user_id for user-specific queries
CREATE INDEX IF NOT EXISTS characters_user_id_idx ON public.characters(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (you can restrict this later)
CREATE POLICY "Enable all access for all users" ON public.characters
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Optional: Create a function to automatically update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.characters
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Insert a default character for testing
INSERT INTO public.characters (name, tagline, color, personality, scenario, traits, greeting)
VALUES (
    'Aria',
    'A quiet soul who listens without judgment',
    '#8B6FBF',
    'Thoughtful, calm, and deeply empathetic. Aria has a gift for making people feel heard and understood. She speaks softly but with intention, choosing her words carefully.',
    'We''ve been friends for years, though we lost touch after high school. Now we''ve reconnected, and there''s so much left unsaid between us.',
    ARRAY['Empathetic', 'Gentle', 'Thoughtful'],
    'Hey... you came back. I was wondering if you would.'
)
ON CONFLICT DO NOTHING;
