'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isAdmin, signOut } from '@/lib/auth';
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

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminStatus, setAdminStatus] = useState(false);
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
          console.log('No user found, redirecting to login');
          router.push('/login?redirect=/admin');
          return;
        }
        
        // In our unified approach, any authenticated user is an admin
        const adminCheck = isAdmin(currentUser);
        setAdminStatus(adminCheck);
        
        console.log('User email:', currentUser.email);
        console.log('Admin status:', adminCheck);
        
        // If not admin, redirect to home
        if (!adminCheck) {
          console.log('User is not admin, redirecting to home');
          router.push('/');
        } else {
          console.log('User is admin, loading menu items');
          // Load menu items if admin
          loadMenuItems();
        }
      } catch (error) {
        console.error('Authentication error:', error);
        router.push('/login?redirect=/admin');
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

  if (!user || !adminStatus) {
    return null; // Will be redirected by the useEffect
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
            You are logged in as an admin. Here you can manage menu items and other content.
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