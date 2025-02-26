# Supabase Setup Guide

This guide will help you set up Supabase for authentication and database functionality in the Naxos project.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in.
2. Create a new project and give it a name (e.g., "naxos").
3. Choose a strong database password and save it securely.
4. Select a region closest to your target audience.
5. Wait for your project to be created (this may take a few minutes).

## 2. Set Up Environment Variables

1. In your Supabase project dashboard, go to Project Settings > API.
2. Copy the following values:
   - Project URL
   - anon/public key
   - service_role key (for admin operations)

3. Create or update your `.env.local` file with these values:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 3. Set Up Database Schema

1. In your Supabase dashboard, go to the SQL Editor.
2. Create a new query and paste the contents of the `supabase/schema.sql` file.
3. Run the query to create the necessary tables and set up Row Level Security (RLS) policies.

## 4. Configure Authentication

1. In your Supabase dashboard, go to Authentication > Settings.
2. Under Email Auth, make sure "Enable Email Signup" is turned on.
3. Configure any additional authentication providers as needed.
4. Set up redirect URLs:
   - Site URL: `http://localhost:3000` (for development) or your production URL
   - Redirect URLs: Add both `http://localhost:3000` and your production URL

## 5. Create an Admin User

To create an admin user:

1. Sign up through the application's signup page.
2. In your Supabase dashboard, go to Authentication > Users.
3. Find your user and click on it.
4. Under "User Metadata", add:
   ```json
   {
     "role": "admin"
   }
   ```
5. Save the changes.

## 6. Testing the Setup

1. Start your development server:
   ```
   pnpm dev
   ```
2. Navigate to `/signup` to create a new user.
3. Use the Supabase dashboard to assign the "admin" role to this user.
4. Sign in with this user at `/login`.
5. You should now be able to access the `/admin` page.

## 7. Row Level Security (RLS) Policies

The schema includes RLS policies that:
- Allow anyone to read menu items
- Allow only admins to create, update, or delete menu items
- For blogs: Allow public access to published blogs, but restrict management to admins

## 8. Troubleshooting

- If you encounter authentication issues, check your environment variables.
- If RLS policies are blocking operations, verify the user's role in Supabase.
- For database errors, check the SQL logs in your Supabase dashboard.

## 9. Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js with Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security) 