'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isAdmin, signOut } from '@/lib/auth';
import { User } from '@supabase/supabase-js';

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminStatus, setAdminStatus] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        if (currentUser) {
          const adminCheck = await isAdmin(currentUser);
          setAdminStatus(adminCheck);
          
          // If not admin, redirect to home
          if (!adminCheck) {
            router.push('/');
          }
        } else {
          // If not logged in, redirect to login
          router.push('/login');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!user || !adminStatus) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user.email}</h2>
          <p className="text-gray-600">
            You are logged in as an admin. Here you can manage menu items and other content.
          </p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Menu Items</h2>
          <p className="text-gray-600 mb-4">
            This is where you will be able to manage your menu items. The functionality to add, edit, and delete menu items will be implemented soon.
          </p>
          
          {/* Placeholder for menu management UI */}
          <div className="border border-dashed border-gray-300 rounded-md p-8 text-center">
            <p className="text-gray-500">Menu management interface will be added here</p>
          </div>
        </div>
      </div>
    </div>
  );
} 