'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminNavPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

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
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Admin Navigation</h1>
        
        {user ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-700 font-medium">✅ You are logged in as: {user.email}</p>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-800">Admin Pages:</h2>
              
              <div className="grid grid-cols-1 gap-4 mt-4">
                <Button asChild className="w-full">
                  <Link href="/admin">Standard Admin Page (Middleware Protected)</Link>
                </Button>
                
                <Button asChild variant="secondary" className="w-full">
                  <Link href="/direct-admin">Direct Admin Page (Client-Side Protected)</Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full">
                  <Link href="/admin-bypass">Admin Bypass Tool</Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full">
                  <Link href="/admin-test">Admin Test Page</Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full">
                  <Link href="/check-role">Check Role Page</Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full">
                  <Link href="/clear-session">Clear Session Page</Link>
                </Button>
              </div>
              
              <div className="mt-6">
                <Button asChild variant="default" className="w-full">
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 font-medium">❌ You are not logged in</p>
            </div>
            
            <div className="pt-4 space-y-2">
              <p className="text-gray-700">Please log in to access admin pages:</p>
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