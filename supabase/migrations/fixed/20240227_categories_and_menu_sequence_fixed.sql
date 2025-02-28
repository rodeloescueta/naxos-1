-- Migration: Add categories table and sequence fields (FIXED VERSION)
-- Date: 2024-02-27

-- Step 1: Create categories table
CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "name" text NOT NULL,
    "sequence" integer NOT NULL DEFAULT 0,
    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- Step 2: Add new columns to menu_items table
-- Add category field to menu_items table if it doesn't exist (for backward compatibility)
ALTER TABLE "public"."menu_items" 
ADD COLUMN IF NOT EXISTS "category" text;

-- Add is_featured field to menu_items table if it doesn't exist
ALTER TABLE "public"."menu_items" 
ADD COLUMN IF NOT EXISTS "is_featured" boolean NOT NULL DEFAULT false;

-- Add sequence field to menu_items table if it doesn't exist
ALTER TABLE "public"."menu_items" 
ADD COLUMN IF NOT EXISTS "sequence" integer NOT NULL DEFAULT 0;

-- Add category_id field to menu_items table if it doesn't exist
ALTER TABLE "public"."menu_items" 
ADD COLUMN IF NOT EXISTS "category_id" uuid REFERENCES "public"."categories"("id") ON DELETE SET NULL;

-- Step 3: Create indexes for better performance
CREATE INDEX IF NOT EXISTS "menu_items_category_id_idx" ON "public"."menu_items" ("category_id");
CREATE INDEX IF NOT EXISTS "menu_items_sequence_idx" ON "public"."menu_items" ("sequence");
CREATE INDEX IF NOT EXISTS "categories_sequence_idx" ON "public"."categories" ("sequence");

-- Step 4: Add comments to explain the relationship between menu_items and categories
COMMENT ON COLUMN "public"."menu_items"."category_id" IS 'Foreign key to categories table. Replaces the text-based category field.';
COMMENT ON COLUMN "public"."menu_items"."category" IS 'Legacy text-based category field. Kept for backward compatibility.';
COMMENT ON COLUMN "public"."menu_items"."sequence" IS 'Order in which the menu item should be displayed within its category.';
COMMENT ON COLUMN "public"."categories"."sequence" IS 'Order in which the category should be displayed on the menu.';

-- Step 5: Enable Row Level Security on categories
ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;

-- Step 6: Drop existing policies for categories if they exist
DROP POLICY IF EXISTS "Allow public read access" ON "public"."categories";
DROP POLICY IF EXISTS "Allow authenticated users to create categories" ON "public"."categories";
DROP POLICY IF EXISTS "Allow authenticated users to update categories" ON "public"."categories";
DROP POLICY IF EXISTS "Allow authenticated users to delete categories" ON "public"."categories";

-- Step 7: Create policies for categories
-- Create policy for public read access to categories
CREATE POLICY "Allow public read access"
ON "public"."categories"
FOR SELECT
TO public
USING (true);

-- Create policy for authenticated users to create categories
CREATE POLICY "Allow authenticated users to create categories"
ON "public"."categories"
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create policy for authenticated users to update categories
CREATE POLICY "Allow authenticated users to update categories"
ON "public"."categories"
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Create policy for authenticated users to delete categories
CREATE POLICY "Allow authenticated users to delete categories"
ON "public"."categories"
FOR DELETE
TO authenticated
USING (true);

-- Step 8: Migrate existing category names to the new categories table
-- This step should only be run after the category column exists
DO $$
DECLARE
    category_name text;
    category_id uuid;
BEGIN
    -- Get distinct category names from menu_items
    FOR category_name IN 
        SELECT DISTINCT category FROM menu_items 
        WHERE category IS NOT NULL AND category != ''
    LOOP
        -- Check if category already exists in categories table
        SELECT id INTO category_id FROM categories WHERE name = category_name;
        
        -- If category doesn't exist, create it
        IF category_id IS NULL THEN
            INSERT INTO categories (name, sequence)
            VALUES (category_name, 0)
            RETURNING id INTO category_id;
        END IF;
        
        -- Update menu_items to use the category_id
        UPDATE menu_items
        SET category_id = category_id
        WHERE category = category_name;
    END LOOP;
END $$; 