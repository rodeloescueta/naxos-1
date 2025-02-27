'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, signOut } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminBypassPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        if (!currentUser) {
          setError('You must be logged in to use this page');
          return;
        }
        
        // Get the admin emails from environment variable
        const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
        console.log('Admin emails:', adminEmails);
        
        if (!adminEmails.includes(currentUser.email || '')) {
          setError('Your email is not in the admin list');
          return;
        }
        
        setMessage('You are authorized as an admin');
      } catch (error) {
        console.error('Error checking auth:', error);
        setError('An error occurred while checking your authentication');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleSetAdminRole = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setMessage('Setting admin role...');
      
      // Update the user's metadata to include the admin role
      const { data, error } = await supabase.auth.updateUser({
        data: { role: 'admin' }
      });
      
      if (error) throw error;
      
      setMessage('Admin role set successfully! You can now access the admin page directly.');
    } catch (error) {
      console.error('Error setting admin role:', error);
      setError('Failed to set admin role');
    } finally {
      setLoading(false);
    }
  };

  const handleClearSession = async () => {
    try {
      setLoading(true);
      setMessage('Clearing session...');
      
      // Sign out from Supabase
      await signOut();
      
      // Clear localStorage
      localStorage.clear();
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      setMessage('Session cleared successfully! You will be redirected to the login page in 3 seconds...');
      
      // Redirect after a delay
      setTimeout(() => {
        router.push('/login');
        router.refresh();
      }, 3000);
    } catch (error) {
      console.error('Error clearing session:', error);
      setError('Error clearing session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-lg text-gray-800">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-2xl bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Admin Bypass Tool</h1>
        
        {user ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-700 font-medium">✅ You are logged in as: {user.email}</p>
            </div>
            
            {message && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-blue-700 font-medium">{message}</p>
              </div>
            )}
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-800">Admin Actions:</h2>
              
              <div className="flex flex-col space-y-4 mt-4">
                <Button 
                  onClick={handleSetAdminRole}
                  disabled={loading || !!error}
                  className="w-full"
                >
                  Set Admin Role in User Metadata
                </Button>
                
                <Button 
                  onClick={handleClearSession}
                  variant="outline"
                  className="w-full"
                >
                  Clear Session & Logout
                </Button>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Button asChild variant="secondary">
                    <Link href="/admin">Try Admin Page</Link>
                  </Button>
                  
                  <Button asChild variant="outline">
                    <Link href="/">Go to Home</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 font-medium">❌ You are not logged in</p>
            </div>
            
            <div className="pt-4 space-y-2">
              <p className="text-gray-700">Please log in to use this tool:</p>
              <div className="flex space-x-4">
                <Button asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/">Go to Home</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 