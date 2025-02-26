# Admin User Setup Guide

This guide explains how to set up admin users in the Naxos application.

## Setting Up an Admin User

There are two ways to set up an admin user:

### 1. Using the Command Line Script

We've created a script that allows you to easily set any user as an admin. To use it:

1. Make sure the user has already signed up through the application
2. Run the following command, replacing `user@example.com` with the user's email:

```bash
node src/scripts/set-admin-role.js user@example.com
```

3. You should see a success message confirming the user has been set as an admin
4. The user can now access the `/admin` page

### 2. Manually Through the Supabase Dashboard

You can also set a user as an admin directly through the Supabase dashboard:

1. Go to your [Supabase project dashboard](https://app.supabase.com)
2. Navigate to "Authentication" > "Users"
3. Find the user you want to make an admin
4. Click on the user to open their details
5. In the "User Metadata" section, add or modify the JSON to include the admin role:

```json
{
  "role": "admin"
}
```

6. Save the changes
7. The user can now access the `/admin` page

## Verifying Admin Status

To verify that a user has admin privileges:

1. Log in with the user's credentials
2. Visit `/check-role` to see the user's current role
3. If the user has admin privileges, you'll see a confirmation message
4. Try accessing the `/admin` page - you should be able to access it if you have admin privileges

## Troubleshooting

If a user can't access the admin page after being set as an admin:

1. Make sure the user is logged in
2. Check the user's role at `/check-role`
3. If the role is not showing as "admin", try setting the role again
4. Clear browser cookies and local storage, then log in again
5. If issues persist, check the browser console for errors 