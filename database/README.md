# Nian Chat Database Setup

This directory contains the database schema for Nian Chat.

## Supabase Setup

1. Go to [Supabase](https://supabase.com) and create a new project
2. Once your project is created, go to the SQL Editor
3. Copy the contents of `schema.sql` and run it in the SQL Editor
4. Copy your project URL and anon key from Project Settings > API
5. Update the configuration in:
   - `frontend/src/config.js` - Update `SUPABASE_URL` and `SUPABASE_ANON_KEY`
   - Create `frontend/.env` based on `frontend/.env.example`

## Database Schema

### Characters Table

Stores all AI character definitions created by users.

**Fields:**
- `id`: UUID primary key
- `created_at`: Timestamp when character was created
- `updated_at`: Timestamp when character was last updated
- `name`: Character name (required)
- `tagline`: Short description
- `color`: Hex color code for UI theming
- `personality`: Detailed personality description (required)
- `scenario`: Context and backstory (required)
- `traits`: Array of personality trait tags
- `greeting`: First message the character sends
- `messages_count`: Number of messages sent (for stats)
- `user_id`: Reference to auth.users (for future authentication)

## Optional: Authentication

If you want to add user authentication later:

1. Enable authentication in your Supabase project
2. Update the RLS policies to restrict access based on `user_id`
3. Update the frontend to use Supabase auth

Example policy for authenticated users:
```sql
-- Only allow users to see their own characters
CREATE POLICY "Users can only see their own characters"
ON public.characters
FOR SELECT
USING (auth.uid() = user_id);

-- Only allow users to insert their own characters
CREATE POLICY "Users can only insert their own characters"
ON public.characters
FOR INSERT
WITH CHECK (auth.uid() = user_id);
```
