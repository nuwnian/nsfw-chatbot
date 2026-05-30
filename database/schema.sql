-- Nian Chat Database Schema for Supabase
-- Safe to run multiple times (uses IF NOT EXISTS + DO $$ exception blocks)

-- ─── CHARACTERS TABLE ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.characters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name VARCHAR(255) NOT NULL,
    tagline TEXT,
    color VARCHAR(7) DEFAULT '#8B6FBF',
    personality TEXT NOT NULL,
    scenario TEXT NOT NULL,
    traits TEXT[] DEFAULT '{}',
    greeting TEXT,
    messages_count INTEGER DEFAULT 0,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT characters_name_check CHECK (char_length(name) >= 1)
);

CREATE INDEX IF NOT EXISTS characters_created_at_idx ON public.characters(created_at DESC);
CREATE INDEX IF NOT EXISTS characters_user_id_idx ON public.characters(user_id);

ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Enable all access for all users" ON public.characters FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.characters
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ─── MESSAGES TABLE ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
    role VARCHAR(10) NOT NULL CHECK (role IN ('user', 'ai')),
    content TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS messages_character_id_created_at_idx
    ON public.messages (character_id, created_at ASC);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Allow all on messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ─── DEFAULT CHARACTER ────────────────────────────────────────────────────────
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


-- ─── CHARACTERS TABLE (skip if already exists) ───────────────────────────────
CREATE TABLE IF NOT EXISTS public.characters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name VARCHAR(255) NOT NULL,
    tagline TEXT,
    color VARCHAR(7) DEFAULT '#8B6FBF',
    personality TEXT NOT NULL,
    scenario TEXT NOT NULL,
    traits TEXT[] DEFAULT '{}',
    greeting TEXT,
    messages_count INTEGER DEFAULT 0,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT characters_name_check CHECK (char_length(name) >= 1)
);

CREATE INDEX IF NOT EXISTS characters_created_at_idx ON public.characters(created_at DESC);
CREATE INDEX IF NOT EXISTS characters_user_id_idx ON public.characters(user_id);
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Enable all access for all users" ON public.characters FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ─── MESSAGES TABLE (new — run this if adding persistence) ───────────────────
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
    role VARCHAR(10) NOT NULL CHECK (role IN ('user', 'ai')),
    content TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS messages_character_id_created_at_idx
    ON public.messages (character_id, created_at ASC);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Allow all on messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

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
