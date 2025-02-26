'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser, getUserRole } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DebugAuthPage() {
  const [sessionData, setSessionData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        
        // Get session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        setSessionData(session);
        
        // Get user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        setUserData(user);
        
        // Get user role
        if (user) {
          const role = await getUserRole(user);
          setUserRole(role);
        }
      } catch (err: any) {
        console.error('Error checking auth:', err);
        setError(err.message || 'An error occurred while checking authentication');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleRefreshSession = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      setSessionData(data.session);
      setUserData(data.user);
      
      if (data.user) {
        const role = await getUserRole(data.user);
        setUserRole(role);
      }
      
      alert('Session refreshed successfully!');
    } catch (err: any) {
      console.error('Error refreshing session:', err);
      setError(err.message || 'Failed to refresh session');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-lg text-gray-800">Loading authentication data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-4xl bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Authentication Debug</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 font-medium">Error: {error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Session</h2>
            {sessionData ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-700 font-medium mb-2">✅ Active session found</p>
                <div className="bg-white p-3 rounded-md overflow-auto max-h-60">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify({
                      access_token: sessionData.access_token ? '[REDACTED]' : null,
                      refresh_token: sessionData.refresh_token ? '[REDACTED]' : null,
                      expires_at: sessionData.expires_at,
                      user: {
                        id: sessionData.user?.id,
                        email: sessionData.user?.email,
                        role: sessionData.user?.user_metadata?.role,
                      }
                    }, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 font-medium">❌ No active session</p>
              </div>
            )}
            
            <Button onClick={handleRefreshSession} disabled={loading}>
              Refresh Session
            </Button>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">User</h2>
            {userData ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-700 font-medium mb-2">✅ User authenticated</p>
                <div className="space-y-2">
                  <p className="text-gray-700"><strong>ID:</strong> {userData.id}</p>
                  <p className="text-gray-700"><strong>Email:</strong> {userData.email}</p>
                  <p className="text-gray-700"><strong>Role:</strong> {userRole || 'No role assigned'}</p>
                  
                  <div className="bg-white p-3 rounded-md overflow-auto max-h-60">
                    <p className="text-sm text-gray-700 font-medium mb-1">User Metadata:</p>
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(userData.user_metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 font-medium">❌ No user authenticated</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Navigation</h2>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/check-role">Check Role</Link>
            </Button>
            <Button asChild>
              <Link href="/admin">Go to Admin</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/clear-session">Clear Session</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Go to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 