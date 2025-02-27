# Admin User Setup Guide

This guide explains how to set up admin users in the Naxos application.

## Setting Up an Admin User

In this application, admin access is controlled by checking if a user's email is in the `NEXT_PUBLIC_ADMIN_EMAILS` environment variable.

### Adding an Admin User

1. Open your `.env.local` file
2. Find the `NEXT_PUBLIC_ADMIN_EMAILS` variable
3. Add the email address of the user you want to make an admin
4. Multiple admin emails should be separated by commas
5. Example:
   ```
   NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com,another-admin@example.com
   ```
6. Restart your development server for the changes to take effect

### Admin Access Control

- When a user signs up or logs in, the system checks if their email is in the `NEXT_PUBLIC_ADMIN_EMAILS` list
- If the email is in the list, the user will be redirected to the admin dashboard
- If the email is not in the list, the user will be redirected to the home page
- Admin users can access the `/direct-admin` page and perform CRUD operations on menu items
- Non-admin users cannot access the admin pages and will be redirected to the home page

## Verifying Admin Status

To verify that a user has admin privileges:

1. Log in with the user's credentials
2. Visit `/check-role` to see the user's current role
3. If the user has admin privileges, you'll see a confirmation message
4. Try accessing the `/direct-admin` page - you should be able to access it if you have admin privileges

## Troubleshooting

If a user can't access the admin page after being added to the admin list:

1. Make sure the user is logged in
2. Check that the email address in the `NEXT_PUBLIC_ADMIN_EMAILS` variable exactly matches the user's email address (case-sensitive)
3. Verify that the environment variable is properly formatted (comma-separated with no spaces)
4. Try clearing browser cookies and local storage, then log in again
5. Visit `/clear-session` to clear your session and log in again
6. If issues persist, check the browser console for errors 