'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getUserRole } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CheckRolePage() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        if (currentUser) {
          const userRole = await getUserRole(currentUser);
          setRole(userRole);
        }
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
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Authentication Status</h1>
        
        {user ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-700 font-medium">✅ You are logged in</p>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-800">User Details:</h2>
              <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
              <p className="text-gray-700"><strong>User ID:</strong> {user.id}</p>
              <p className="text-gray-700"><strong>Role:</strong> {role || 'No role assigned'}</p>
              
              {role === 'admin' ? (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md mt-2">
                  <p className="text-blue-700 font-medium">
                    ✅ You have admin privileges
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mt-2">
                  <p className="text-yellow-700 font-medium">
                    ⚠️ You do not have admin privileges
                  </p>
                </div>
              )}
            </div>
            
            <div className="pt-4 space-y-2">
              <p className="text-gray-700">Try accessing the admin page:</p>
              <div className="flex space-x-4">
                <Button asChild>
                  <Link href="/admin">Go to Admin Page</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/">Go to Home</Link>
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
              <p className="text-gray-700">Please log in to check your role:</p>
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