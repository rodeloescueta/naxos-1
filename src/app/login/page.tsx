'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn, isAdmin, AuthResult } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        setStatusMessage('Checking current session...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const userEmail = session.user?.email;
          console.log('Login page: User already logged in with email:', userEmail);
          
          // Check if user is admin
          const adminStatus = isAdmin(session.user);
          console.log('Login page: User admin status:', adminStatus);
          
          if (adminStatus) {
            console.log('Login page: Redirecting admin user to admin dashboard');
            setStatusMessage('You are logged in as admin. Redirecting to admin dashboard...');
            router.push('/direct-admin');
          } else {
            console.log('Login page: Redirecting non-admin user to home page');
            setStatusMessage('You are logged in. Redirecting to home page...');
            router.push('/');
          }
        } else {
          console.log('Login page: No active session found');
          setStatusMessage(null);
        }
      } catch (error) {
        console.error('Login page: Error checking session:', error);
        setStatusMessage(null);
      }
    };
    
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatusMessage('Attempting to sign in...');

    try {
      console.log('Login page: Attempting to sign in with email:', email);
      const result: AuthResult = await signIn(email, password);

      if (result.error) {
        console.error('Login page: Sign in error:', result.error.message);
        setError(result.error.message);
        setStatusMessage(null);
        return;
      }

      const { session, user } = result;

      if (!session || !user) {
        console.error('Login page: No session or user returned after sign in');
        setError('Authentication failed. Please try again.');
        setStatusMessage(null);
        return;
      }

      console.log('Login page: Sign in successful for user:', user.email);
      setStatusMessage('Sign in successful! Checking admin status...');

      // Check if user is admin
      const adminStatus = isAdmin(user);
      console.log('Login page: User admin status after login:', adminStatus);

      if (adminStatus) {
        console.log('Login page: Redirecting admin user to admin dashboard');
        setStatusMessage('You are logged in as admin. Redirecting to admin dashboard...');
        router.push('/direct-admin');
      } else {
        console.log('Login page: Redirecting non-admin user to home page');
        setStatusMessage('You are logged in. Redirecting to home page...');
        router.push('/');
      }
    } catch (err) {
      console.error('Login page: Unexpected error during sign in:', err);
      setError('An unexpected error occurred. Please try again.');
      setStatusMessage(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              create a new account
            </Link>
          </p>
        </div>
        
        {statusMessage && (
          <div className="rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">{statusMessage}</p>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 