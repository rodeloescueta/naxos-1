import { supabase } from './supabase';
import { type User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'user';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
}

// Check if user is an admin by examining their email
export function isAdmin(user: User | null): boolean {
  if (!user || !user.email) return false;
  
  // Check if the user's email is in the admin list from environment variable
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];
  return adminEmails.some(email => email.trim().toLowerCase() === user.email?.toLowerCase());
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw error;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function getUserRole(user: User | null): Promise<UserRole | null> {
  if (!user) return null;
  
  // Check if the user is an admin
  if (isAdmin(user)) {
    return 'admin';
  }
  
  return 'user';
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    throw error;
  }
  
  return data.session;
} 