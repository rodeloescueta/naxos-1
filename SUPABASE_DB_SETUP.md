# Supabase Database Setup Guide

This guide provides instructions for setting up the database tables for the Naxos restaurant website.

## Setting Up the Menu Items Table

### Option 1: Simple Setup (Recommended for Development)

For a quick setup that allows any authenticated user to manage menu items:

1. Log in to your Supabase dashboard at https://app.supabase.com
2. Select your project
3. Go to the "SQL Editor" section
4. Create a new query
5. Copy and paste the SQL from the `supabase/simple-schema.sql` file
6. Run the query

This setup will:
- Create the `menu_items` table with all necessary columns
- Enable Row Level Security (RLS)
- Allow public read access to menu items
- Allow any authenticated user to create, update, and delete menu items
- Set up automatic updating of the `updated_at` timestamp

### Option 2: Email-Based Access Control (Recommended for Production)

For a more secure setup that only allows specific admin emails to manage menu items:

1. Log in to your Supabase dashboard
2. Go to the "SQL Editor" section
3. Create a new query
4. Copy and paste the SQL from the `supabase/schema.sql` file
5. Before running the query, replace `'admin@example.com'` in the `ALTER SYSTEM SET app.admin_emails` line with your actual admin email(s), comma-separated
6. Run the query

This setup will:
- Create the `menu_items` and `blogs` tables with all necessary columns
- Enable Row Level Security (RLS)
- Allow public read access to menu items and published blogs
- Allow only specified admin emails to create, update, and delete menu items and blogs
- Set up automatic updating of the `updated_at` timestamp

## Testing the Setup

After setting up the database:

1. Make sure your `.env.local` file has the correct Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_ADMIN_EMAILS=your_admin_email@example.com
   ```

2. Start your development server:
   ```
   npm run dev
   ```

3. Sign in with your admin email at `/login`
4. Navigate to `/direct-admin` to manage menu items

## Troubleshooting

If you encounter issues with database access:

1. Check that your RLS policies are correctly set up in Supabase
2. Verify that your admin email is correctly set in both:
   - The Supabase `app.admin_emails` setting (if using Option 2)
   - The `NEXT_PUBLIC_ADMIN_EMAILS` environment variable in your `.env.local` file
3. Make sure you're signed in with the correct admin email
4. Check the browser console for any error messages

For more detailed troubleshooting, you can use the `/admin-test` page to verify your admin status. 