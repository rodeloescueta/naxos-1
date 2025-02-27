'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { isAdmin, signOut as authSignOut } from './auth';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isLoading: true,
  signOut: async () => {},
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      console.log('Auth context: Refreshing user data');
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (currentUser) {
        console.log('Auth context: User refreshed with email:', currentUser.email);
        setUser(currentUser);
        
        // Check if user is admin
        const adminStatus = isAdmin(currentUser);
        console.log('Auth context: User admin status:', adminStatus);
        setIsAdminUser(adminStatus);
      } else {
        console.log('Auth context: No user found during refresh');
        setUser(null);
        setIsAdminUser(false);
      }
    } catch (error) {
      console.error('Auth context: Error refreshing user:', error);
      setUser(null);
      setIsAdminUser(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('Auth context: Signing out user');
      await authSignOut();
      setUser(null);
      setIsAdminUser(false);
    } catch (error) {
      console.error('Auth context: Error signing out:', error);
    }
  };

  useEffect(() => {
    console.log('Auth context: Initializing');
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        setIsLoading(true);
        console.log('Auth context: Getting initial session');
        
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log('Auth context: Initial session exists:', !!session);
        
        if (session?.user) {
          console.log('Auth context: Initial user email:', session.user.email);
          setUser(session.user);
          
          // Check if user is admin
          const adminStatus = isAdmin(session.user);
          console.log('Auth context: Initial user admin status:', adminStatus);
          setIsAdminUser(adminStatus);
        } else {
          setUser(null);
          setIsAdminUser(false);
        }
      } catch (error) {
        console.error('Auth context: Error getting initial session:', error);
        setUser(null);
        setIsAdminUser(false);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth context: Auth state changed, event:', event);
        console.log('Auth context: Session exists:', !!session);
        
        if (session?.user) {
          console.log('Auth context: User email from session:', session.user.email);
          setUser(session.user);
          
          // Check if user is admin
          const adminStatus = isAdmin(session.user);
          console.log('Auth context: User admin status after state change:', adminStatus);
          setIsAdminUser(adminStatus);
        } else {
          setUser(null);
          setIsAdminUser(false);
          console.log('Auth context: No user in session after state change');
        }
        
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      console.log('Auth context: Cleaning up auth state subscription');
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAdmin: isAdminUser, 
      isLoading, 
      signOut,
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 
