-- Create the user_anime_collection table
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS user_anime_collection (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
	anime_id INTEGER NOT NULL,
	anime_data JSONB NOT NULL,
	status TEXT NOT NULL CHECK (status IN ('watching', 'completed', 'on_hold', 'dropped', 'plan_to_watch')),
	episodes_watched INTEGER NOT NULL DEFAULT 0,
	rating INTEGER CHECK (rating >= 1 AND rating <= 10),
	notes TEXT,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	UNIQUE(user_id, anime_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_anime_collection_user_id ON user_anime_collection(user_id);
CREATE INDEX IF NOT EXISTS idx_user_anime_collection_status ON user_anime_collection(user_id, status);

-- Enable Row Level Security
ALTER TABLE user_anime_collection ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can only see their own collection
CREATE POLICY "Users can view their own collection"
	ON user_anime_collection
	FOR SELECT
	USING (auth.uid() = user_id);

-- Users can insert their own collection items
CREATE POLICY "Users can insert their own collection"
	ON user_anime_collection
	FOR INSERT
	WITH CHECK (auth.uid() = user_id);

-- Users can update their own collection items
CREATE POLICY "Users can update their own collection"
	ON user_anime_collection
	FOR UPDATE
	USING (auth.uid() = user_id)
	WITH CHECK (auth.uid() = user_id);

-- Users can delete their own collection items
CREATE POLICY "Users can delete their own collection"
	ON user_anime_collection
	FOR DELETE
	USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = NOW();
	RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_anime_collection_updated_at
	BEFORE UPDATE ON user_anime_collection
	FOR EACH ROW
	EXECUTE FUNCTION update_updated_at_column();

