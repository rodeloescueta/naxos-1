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

-- Allow only admin emails to insert menu items
CREATE POLICY "Allow admin insert" ON menu_items
  FOR INSERT TO authenticated
  USING (
    -- Check if the user's email is in the admin list
    EXISTS (
      SELECT 1 FROM unnest(string_to_array(current_setting('app.admin_emails', true), ',')) admin_email
      WHERE trim(admin_email) = auth.jwt() ->> 'email'
    )
  );

-- Allow only admin emails to update menu items
CREATE POLICY "Allow admin update" ON menu_items
  FOR UPDATE TO authenticated
  USING (
    -- Check if the user's email is in the admin list
    EXISTS (
      SELECT 1 FROM unnest(string_to_array(current_setting('app.admin_emails', true), ',')) admin_email
      WHERE trim(admin_email) = auth.jwt() ->> 'email'
    )
  );

-- Allow only admin emails to delete menu items
CREATE POLICY "Allow admin delete" ON menu_items
  FOR DELETE TO authenticated
  USING (
    -- Check if the user's email is in the admin list
    EXISTS (
      SELECT 1 FROM unnest(string_to_array(current_setting('app.admin_emails', true), ',')) admin_email
      WHERE trim(admin_email) = auth.jwt() ->> 'email'
    )
  );

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

-- Allow admin emails to read all blogs
CREATE POLICY "Allow admin read access to all blogs" ON blogs
  FOR SELECT TO authenticated
  USING (
    -- Check if the user's email is in the admin list
    EXISTS (
      SELECT 1 FROM unnest(string_to_array(current_setting('app.admin_emails', true), ',')) admin_email
      WHERE trim(admin_email) = auth.jwt() ->> 'email'
    )
  );

-- Allow only admin emails to insert blogs
CREATE POLICY "Allow admin insert blogs" ON blogs
  FOR INSERT TO authenticated
  USING (
    -- Check if the user's email is in the admin list
    EXISTS (
      SELECT 1 FROM unnest(string_to_array(current_setting('app.admin_emails', true), ',')) admin_email
      WHERE trim(admin_email) = auth.jwt() ->> 'email'
    )
  );

-- Allow only admin emails to update blogs
CREATE POLICY "Allow admin update blogs" ON blogs
  FOR UPDATE TO authenticated
  USING (
    -- Check if the user's email is in the admin list
    EXISTS (
      SELECT 1 FROM unnest(string_to_array(current_setting('app.admin_emails', true), ',')) admin_email
      WHERE trim(admin_email) = auth.jwt() ->> 'email'
    )
  );

-- Allow only admin emails to delete blogs
CREATE POLICY "Allow admin delete blogs" ON blogs
  FOR DELETE TO authenticated
  USING (
    -- Check if the user's email is in the admin list
    EXISTS (
      SELECT 1 FROM unnest(string_to_array(current_setting('app.admin_emails', true), ',')) admin_email
      WHERE trim(admin_email) = auth.jwt() ->> 'email'
    )
  );

-- Create a trigger to automatically update the updated_at column for blogs
CREATE TRIGGER update_blogs_updated_at
BEFORE UPDATE ON blogs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Set the admin emails from environment variable
-- This needs to be run after setting the environment variable in Supabase
-- Replace 'admin@example.com' with your actual admin email(s)
ALTER SYSTEM SET app.admin_emails = 'admin@example.com'; 