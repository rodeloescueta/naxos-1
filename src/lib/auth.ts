import { supabase } from './supabase';
import { type User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'user';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
}

// Function to check if an email is in the admin list
export function isEmailInAdminList(email: string | undefined | null): boolean {
  if (!email) return false;
  
  const adminEmails = process.env.ADMIN_EMAILS || '';
  const adminEmailList = adminEmails.split(',').map(e => e.trim().toLowerCase());
  
  return adminEmailList.includes(email.toLowerCase());
}

export async function signUp(email: string, password: string, role: UserRole = 'user') {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: isEmailInAdminList(email) ? 'admin' : role,
      },
    },
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
  
  // First check if the email is in the admin list
  if (isEmailInAdminList(user.email)) {
    return 'admin';
  }
  
  // Fallback to checking user metadata
  return (user.user_metadata?.role as UserRole) || null;
}

export async function isAdmin(user: User | null): Promise<boolean> {
  if (!user) return false;
  
  // First check if the email is in the admin list
  if (isEmailInAdminList(user.email)) {
    return true;
  }
  
  // Fallback to checking user role in metadata
  const role = await getUserRole(user);
  return role === 'admin';
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    throw error;
  }
  
  return data.session;
} 