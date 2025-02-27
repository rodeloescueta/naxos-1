-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow anyone to read menu items
CREATE POLICY "Allow public read access" ON menu_items
  FOR SELECT USING (true);

-- Allow authenticated users to insert, update, and delete menu items
-- This is a simplified approach that works for both development and production
CREATE POLICY "Allow authenticated insert" ON menu_items
  FOR INSERT TO authenticated USING (true);

CREATE POLICY "Allow authenticated update" ON menu_items
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated delete" ON menu_items
  FOR DELETE TO authenticated USING (true);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_menu_items_updated_at
BEFORE UPDATE ON menu_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create blogs table for future use
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  image_url TEXT,
  author_id UUID REFERENCES auth.users(id),
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for blogs
-- Allow anyone to read published blogs
CREATE POLICY "Allow public read access to published blogs" ON blogs
  FOR SELECT USING (published = true);

-- Allow authenticated users to read all blogs
CREATE POLICY "Allow authenticated read access to all blogs" ON blogs
  FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to insert blogs
CREATE POLICY "Allow authenticated insert blogs" ON blogs
  FOR INSERT TO authenticated USING (true);

-- Allow authenticated users to update blogs
CREATE POLICY "Allow authenticated update blogs" ON blogs
  FOR UPDATE TO authenticated USING (true);

-- Allow authenticated users to delete blogs
CREATE POLICY "Allow authenticated delete blogs" ON blogs
  FOR DELETE TO authenticated USING (true);

-- Create a trigger to automatically update the updated_at column for blogs
CREATE TRIGGER update_blogs_updated_at
BEFORE UPDATE ON blogs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 