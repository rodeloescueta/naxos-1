'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { User } from '@supabase/supabase-js';
import { 
  MenuItem, 
  getMenuItems, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem,
  CreateMenuItemData,
  UpdateMenuItemData
} from '@/lib/menu-items';
import { Button } from '@/components/ui/button';
import MenuItemForm from '@/components/admin/MenuItemForm';
import MenuItemsTable from '@/components/admin/MenuItemsTable';
import { signOut } from '@/lib/auth';

export default function DirectAdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isMenuItemsLoading, setIsMenuItemsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentMenuItem, setCurrentMenuItem] = useState<MenuItem | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        if (!currentUser) {
          console.log('No user found');
          setError('You must be logged in to access this page');
          return;
        }
        
        // Check if the user is an admin
        const adminCheck = isAdmin(currentUser);
        setIsAdminUser(adminCheck);
        
        console.log('User authenticated:', currentUser.email);
        console.log('Admin status:', adminCheck);
        
        if (!adminCheck) {
          console.log('User is not an admin, redirecting to home');
          router.push('/');
          return;
        }
        
        // Load menu items for admin user
        loadMenuItems();
      } catch (error) {
        console.error('Authentication error:', error);
        setError('An error occurred while checking your authentication');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const loadMenuItems = async () => {
    setIsMenuItemsLoading(true);
    setError(null);
    
    try {
      const items = await getMenuItems();
      setMenuItems(items);
    } catch (error) {
      console.error('Error loading menu items:', error);
      setError('Failed to load menu items. Please try again.');
    } finally {
      setIsMenuItemsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleAddNewClick = () => {
    setCurrentMenuItem(undefined);
    setShowForm(true);
  };

  const handleEditClick = (menuItem: MenuItem) => {
    setCurrentMenuItem(menuItem);
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setCurrentMenuItem(undefined);
  };

  const handleFormSubmit = async (data: CreateMenuItemData | UpdateMenuItemData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (currentMenuItem) {
        // Update existing menu item
        const updatedItem = await updateMenuItem(currentMenuItem.id, data);
        setMenuItems(menuItems.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        ));
      } else {
        // Create new menu item
        const newItem = await createMenuItem(data as CreateMenuItemData);
        setMenuItems([newItem, ...menuItems]);
      }
      
      setShowForm(false);
      setCurrentMenuItem(undefined);
    } catch (error: any) {
      console.error('Error saving menu item:', error);
      setError(error.message || 'Failed to save menu item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteMenuItem(id);
      setMenuItems(menuItems.filter(item => item.id !== id));
    } catch (error: any) {
      console.error('Error deleting menu item:', error);
      setError(error.message || 'Failed to delete menu item. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-7xl">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
            <p className="text-gray-700 mb-4">{error || 'You must be logged in to access this page'}</p>
            <Button asChild>
              <a href="/login?redirect=/direct-admin">Sign In</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdminUser) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-7xl">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-700 mb-4">
              You do not have admin privileges to access this page.
              Only users with admin role can access the admin dashboard.
            </p>
            <div className="flex space-x-4">
              <Button asChild variant="default">
                <a href="/">Go to Home</a>
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Button
            variant="destructive"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user.email}</h2>
          <p className="text-gray-600">
            You have access to manage menu items and content for the Naxos restaurant website.
          </p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Menu Items</h2>
            {!showForm && (
              <Button onClick={handleAddNewClick}>
                Add New Item
              </Button>
            )}
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          
          {showForm ? (
            <MenuItemForm
              menuItem={currentMenuItem}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              isSubmitting={isSubmitting}
            />
          ) : isMenuItemsLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading menu items...</p>
            </div>
          ) : (
            <MenuItemsTable
              menuItems={menuItems}
              onEdit={handleEditClick}
              onDelete={handleDeleteItem}
            />
          )}
        </div>
      </div>
    </div>
  );
} 