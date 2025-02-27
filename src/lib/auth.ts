import { supabase } from './supabase';
import { User, Session, AuthError } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'user';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthResult {
  session: Session | null;
  user: User | null;
  error: AuthError | null;
}

// Check if user is an admin by examining their email
export function isAdmin(user: User | null): boolean {
  if (!user) {
    console.log('Auth: isAdmin check - No user provided');
    return false;
  }
  
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];
  console.log('Auth: Admin emails from env:', adminEmails);
  console.log('Auth: Checking if user email is admin:', user.email);
  
  const isAdminUser = adminEmails.includes(user.email || '');
  console.log('Auth: isAdmin check result:', isAdminUser);
  
  return isAdminUser;
}

export async function signUp(email: string, password: string): Promise<AuthResult> {
  console.log('Auth: Signing up user with email:', email);
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Auth: Sign up error:', error.message);
      return { session: null, user: null, error };
    }

    const { session, user } = data;
    
    if (user) {
      console.log('Auth: User signed up successfully:', user.email);
      
      // Check if user is admin
      const adminStatus = isAdmin(user);
      console.log('Auth: New user admin status:', adminStatus);
    }

    return { session, user, error: null };
  } catch (err) {
    console.error('Auth: Unexpected error during sign up:', err);
    return { 
      session: null, 
      user: null, 
      error: new AuthError('An unexpected error occurred during sign up') 
    };
  }
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  console.log('Auth: Signing in user with email:', email);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Auth: Sign in error:', error.message);
      return { session: null, user: null, error };
    }

    const { session, user } = data;
    
    if (user) {
      console.log('Auth: User signed in successfully:', user.email);
      
      // Check if user is admin
      const adminStatus = isAdmin(user);
      console.log('Auth: User admin status:', adminStatus);
    }

    return { session, user, error: null };
  } catch (err) {
    console.error('Auth: Unexpected error during sign in:', err);
    return { 
      session: null, 
      user: null, 
      error: new AuthError('An unexpected error occurred during sign in') 
    };
  }
}

export async function signOut(): Promise<{ error: AuthError | null }> {
  console.log('Auth: Signing out user');
  
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Auth: Sign out error:', error.message);
      return { error };
    }
    
    console.log('Auth: User signed out successfully');
    return { error: null };
  } catch (err) {
    console.error('Auth: Unexpected error during sign out:', err);
    return { error: new AuthError('An unexpected error occurred during sign out') };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      console.log('Auth: Current user retrieved:', user.email);
    } else {
      console.log('Auth: No current user found');
    }
    
    return user;
  } catch (error) {
    console.error('Auth: Error getting current user:', error);
    return null;
  }
}

export async function getUserRole(): Promise<'admin' | 'user'> {
  const user = await getCurrentUser();
  return isAdmin(user) ? 'admin' : 'user';
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    throw error;
  }
  
  return data.session;
} 