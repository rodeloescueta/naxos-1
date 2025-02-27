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
-- This is a simplified approach - in production, you'd want more granular control
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