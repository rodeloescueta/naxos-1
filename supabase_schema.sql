-- Ensure the menu_items table has the correct structure
CREATE TABLE IF NOT EXISTS "public"."menu_items" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "title" text NOT NULL,
    "description" text NOT NULL,
    "price" numeric NOT NULL,
    "photo_url" text,
    "category" text,
    "is_featured" boolean DEFAULT false,
    CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id")
);

-- Enable Row Level Security
ALTER TABLE "public"."menu_items" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access" ON "public"."menu_items";
DROP POLICY IF EXISTS "Allow authenticated users to create menu items" ON "public"."menu_items";
DROP POLICY IF EXISTS "Allow authenticated users to update menu items" ON "public"."menu_items";
DROP POLICY IF EXISTS "Allow authenticated users to delete menu items" ON "public"."menu_items";

-- Create policy for public read access
CREATE POLICY "Allow public read access"
ON "public"."menu_items"
FOR SELECT
TO public
USING (true);

-- Create policy for authenticated users to create menu items
CREATE POLICY "Allow authenticated users to create menu items"
ON "public"."menu_items"
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create policy for authenticated users to update menu items
CREATE POLICY "Allow authenticated users to update menu items"
ON "public"."menu_items"
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Create policy for authenticated users to delete menu items
CREATE POLICY "Allow authenticated users to delete menu items"
ON "public"."menu_items"
FOR DELETE
TO authenticated
USING (true); 