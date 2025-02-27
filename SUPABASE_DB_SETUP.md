# Naxos Restaurant Website - Database Setup Guide

This guide provides instructions for setting up the database for the Naxos restaurant website. The database is used to store menu items and other content that can be managed through the admin interface.

## Setting Up the Database

We've simplified the database setup to work consistently across both development and production environments.

### Database Setup Steps

1. **Log in to the Supabase Dashboard**
   - Go to [https://app.supabase.com/](https://app.supabase.com/)
   - Sign in with your credentials

2. **Select Your Project**
   - From the dashboard, select the project you created for the Naxos restaurant website

3. **Navigate to the SQL Editor**
   - In the left sidebar, click on "SQL Editor"
   - Click "New Query" to create a new SQL query

4. **Run the Unified Schema SQL**
   - Copy the contents of the `supabase/unified-schema.sql` file from this project
   - Paste it into the SQL Editor
   - Click "Run" to execute the query

5. **Verify the Setup**
   - In the left sidebar, click on "Table Editor"
   - You should see the `menu_items` and `blogs` tables in the list
   - Click on the `menu_items` table to verify its structure

## Access Control

Our unified approach uses a simplified access control model:

- **Public Read Access**: Anyone can view menu items and published blog posts
- **Authenticated Write Access**: Any authenticated user can manage menu items and blog posts

This approach works well for both development and production environments where you control who has authentication credentials.

## Setting Up Admin Access

To manage content, you need to:

1. **Create an Admin User**
   - Sign up for an account on your Naxos website
   - This user will automatically have admin privileges when authenticated

2. **Access the Admin Interface**
   - After logging in, you'll be redirected to the Direct Admin page
   - You can also navigate to `/direct-admin` manually

## Testing the Setup

1. **Ensure Environment Variables**
   - Make sure your `.env.local` file contains the correct Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```

2. **Start the Development Server**
   - Run `npm run dev` to start the development server

3. **Sign In**
   - Navigate to the login page
   - Sign in with your credentials

4. **Access the Admin Interface**
   - After signing in, you'll be redirected to the Direct Admin page
   - You should be able to add, edit, and delete menu items

## Troubleshooting

If you encounter issues with database access:

1. **Check Authentication**
   - Make sure you're properly signed in
   - Check the browser console for any authentication errors

2. **Verify RLS Policies**
   - In the Supabase dashboard, go to "Authentication" > "Policies"
   - Ensure the policies for the `menu_items` table are correctly set up
   - Policies should allow public read access and authenticated write access

3. **Check Console Logs**
   - Open your browser's developer tools
   - Check the console for any error messages related to Supabase operations

4. **Restart the Development Server**
   - Sometimes, restarting the development server can resolve issues
   - Stop the server with Ctrl+C and restart it with `npm run dev`

If you continue to experience issues, please refer to the Supabase documentation or contact the development team for assistance. 