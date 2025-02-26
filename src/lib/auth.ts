import { supabase } from './supabase';
import { type User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'user';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
}

export async function signUp(email: string, password: string, role: UserRole = 'user') {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
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
  
  // The role is stored in user.user_metadata.role
  return (user.user_metadata?.role as UserRole) || null;
}

export async function isAdmin(user: User | null): Promise<boolean> {
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