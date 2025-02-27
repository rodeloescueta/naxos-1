import { supabase } from './supabase';
import { type User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'user';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
}

// In our simplified approach, any authenticated user is considered an admin
export function isAdmin(user: User | null): boolean {
  return !!user;
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: 'admin', // All users are admins in our simplified approach
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
  
  // In our simplified approach, all authenticated users have admin role
  return 'admin';
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    throw error;
  }
  
  return data.session;
} 