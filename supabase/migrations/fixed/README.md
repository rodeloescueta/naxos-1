# Migration Fix for Categories and Menu Sequence

## Issue

The original migration script (`../20240227_categories_and_menu_sequence.sql`) assumes that the `menu_items` table already has a `category` column, but this column might not exist in your database. This causes the following error:

```
ERROR: 42703: column "category" does not exist
HINT: Perhaps you meant to reference the column "menu_items.category_id".
```

## Solution

The fixed migration script (`20240227_categories_and_menu_sequence_fixed.sql`) addresses this issue by:

1. Creating the `categories` table first
2. Adding all required columns to the `menu_items` table (including the `category` column)
3. Setting up indexes and comments
4. Enabling Row Level Security and creating policies
5. Migrating existing category data (only after ensuring the `category` column exists)

## How to Use

Run the fixed migration script in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of 20240227_categories_and_menu_sequence_fixed.sql
```

## Changes Made

- Reordered operations to ensure columns exist before they are referenced
- Added explicit steps with comments for better clarity
- Added missing column definitions (`category` and `is_featured`)
- Simplified the PL/pgSQL block for data migration

## Note

If you've already partially run the original migration script, some objects might already exist. The fixed script uses `IF NOT EXISTS` and `DROP POLICY IF EXISTS` to handle this gracefully. 