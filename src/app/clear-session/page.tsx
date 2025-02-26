'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ClearSessionPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const router = useRouter();

  const handleClearSession = async () => {
    setIsClearing(true);
    setMessage('Clearing session...');
    
    try {
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
      setMessage('Error clearing session. Please try again.');
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-2xl bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Clear Session</h1>
        
        <div className="space-y-4">
          <p className="text-gray-700">
            If you're having trouble accessing the admin page after being assigned the admin role,
            clearing your session and logging in again may help.
          </p>
          
          {message && (
            <div className={`p-4 rounded-md ${
              message.includes('Error') 
                ? 'bg-red-50 border border-red-200 text-red-700' 
                : message.includes('successfully') 
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-blue-50 border border-blue-200 text-blue-700'
            }`}>
              <p className="font-medium">{message}</p>
            </div>
          )}
          
          <div className="flex space-x-4 pt-4">
            <Button 
              onClick={handleClearSession}
              disabled={isClearing}
            >
              {isClearing ? 'Clearing...' : 'Clear Session & Logout'}
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