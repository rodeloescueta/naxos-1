'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, isAdmin, refreshUser } = useAuth();

  useEffect(() => {
    // Check if user is already logged in
    if (user) {
      console.log('Login page: User already logged in:', user.email);
      console.log('Login page: User is admin:', isAdmin);
      
      // Always redirect to home page after login
      console.log('Login page: Redirecting to home page');
      router.push('/');
    }
  }, [user, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage('Signing in...');

    try {
      console.log('Login page: Attempting to sign in with email:', email);
      const { user, error } = await signIn(email, password);

      if (error) {
        console.error('Login page: Sign in error:', error.message);
        setStatusMessage(`Error: ${error.message}`);
        return;
      }

      if (!user) {
        console.error('Login page: No user returned after sign in');
        setStatusMessage('Error: Failed to sign in');
        return;
      }

      console.log('Login page: Sign in successful for user:', user.email);
      setStatusMessage('Sign in successful! Redirecting...');
      
      // Refresh user data to ensure we have the latest info
      await refreshUser();
      
      // Always redirect to home page after login
      console.log('Login page: Redirecting to home page');
      router.push('/');
    } catch (error) {
      console.error('Login page: Unexpected error during sign in:', error);
      setStatusMessage('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-black">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-900 rounded-lg shadow-xl border border-gray-800">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white lg:text-5xl mb-6">
            Login
          </h1>
          <p className="text-sm text-gray-300 mb-8">
            Sign in to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {statusMessage && (
            <div className={`text-sm ${statusMessage.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
              {statusMessage}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 