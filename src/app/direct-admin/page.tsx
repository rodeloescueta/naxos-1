'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { 
  getMenuItems, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem, 
  MenuItem,
  CreateMenuItemData
} from '@/lib/menu-items';

export default function AdminPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<{
    id: string;
    title: string;
    description: string;
    price: string;
    photo_url: string;
  }>({
    id: '',
    title: '',
    description: '',
    price: '',
    photo_url: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [authChecked, setAuthChecked] = useState(false);
  
  const router = useRouter();
  const { user, isAdmin, isLoading, signOut, refreshUser } = useAuth();

  // Check authentication and admin status
  useEffect(() => {
    const checkAuth = async () => {
      console.log('Admin page: Checking authentication');
      
      if (isLoading) {
        console.log('Admin page: Auth is still loading');
        return;
      }
      
      // If no user is found, redirect to login
      if (!user) {
        console.log('Admin page: No user found, redirecting to login');
        router.push('/login');
        return;
      }
      
      console.log('Admin page: User authenticated with email:', user.email);
      
      // If user is not an admin, redirect to home
      if (!isAdmin) {
        console.log('Admin page: User is not an admin, redirecting to home');
        setStatusMessage('You do not have admin privileges');
        router.push('/');
        return;
      }
      
      console.log('Admin page: User is admin, access granted');
      setAuthChecked(true);
      loadMenuItems();
    };
    
    checkAuth();
  }, [user, isAdmin, isLoading, router, refreshUser]);

  const loadMenuItems = async () => {
    try {
      console.log('Admin page: Loading menu items');
      setLoading(true);
      const items = await getMenuItems();
      console.log(`Admin page: Loaded ${items.length} menu items`);
      setMenuItems(items);
      setStatusMessage('');
    } catch (error) {
      console.error('Admin page: Error loading menu items:', error);
      setStatusMessage('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      console.log('Admin page: Signing out');
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Admin page: Error signing out:', error);
      setStatusMessage('Failed to sign out');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      description: '',
      price: '',
      photo_url: '',
    });
    setIsEditing(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setStatusMessage('Saving...');
      
      // Validate form data
      if (!formData.title || !formData.description || !formData.price) {
        setStatusMessage('Please fill in all required fields');
        return;
      }
      
      // Convert price to number
      const priceValue = parseFloat(formData.price);
      if (isNaN(priceValue)) {
        setStatusMessage('Price must be a valid number');
        return;
      }
      
      const itemData: CreateMenuItemData = {
        title: formData.title,
        description: formData.description,
        price: priceValue,
        photo_url: formData.photo_url || undefined,
      };
      
      if (isEditing) {
        console.log('Admin page: Updating menu item with ID:', formData.id);
        await updateMenuItem(formData.id, itemData);
        console.log('Admin page: Menu item updated successfully');
        setStatusMessage('Menu item updated successfully');
      } else {
        console.log('Admin page: Creating new menu item');
        await createMenuItem(itemData);
        console.log('Admin page: Menu item created successfully');
        setStatusMessage('Menu item created successfully');
      }
      
      resetForm();
      loadMenuItems();
    } catch (error) {
      console.error('Admin page: Error saving menu item:', error);
      setStatusMessage('Failed to save menu item');
    }
  };

  const handleEditItem = (item: MenuItem) => {
    console.log('Admin page: Editing menu item with ID:', item.id);
    setFormData({
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price.toString(),
      photo_url: item.photo_url || '',
    });
    setIsEditing(true);
    setStatusMessage('');
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }
    
    try {
      console.log('Admin page: Deleting menu item with ID:', id);
      setStatusMessage('Deleting...');
      await deleteMenuItem(id);
      console.log('Admin page: Menu item deleted successfully');
      setStatusMessage('Menu item deleted successfully');
      loadMenuItems();
    } catch (error) {
      console.error('Admin page: Error deleting menu item:', error);
      setStatusMessage('Failed to delete menu item');
    }
  };

  // Show loading state while checking authentication
  if (isLoading || !authChecked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Loading...
          </h1>
          <p className="text-sm text-gray-600">
            Checking authentication and loading data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Admin Dashboard</h1>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>

      {statusMessage && (
        <div className={`p-4 mb-6 rounded ${statusMessage.includes('Failed') || statusMessage.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {statusMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                step="0.01"
                min="0"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="photo_url" className="block text-sm font-medium text-gray-700">
                Photo URL
              </label>
              <input
                type="url"
                id="photo_url"
                name="photo_url"
                value={formData.photo_url}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                {isEditing ? 'Update Item' : 'Add Item'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Menu Items</h2>
          {loading ? (
            <p>Loading menu items...</p>
          ) : menuItems.length === 0 ? (
            <p>No menu items found.</p>
          ) : (
            <div className="space-y-4">
              {menuItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 bg-white shadow">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <span className="font-bold">${item.price.toFixed(2)}</span>
                  </div>
                  <p className="text-gray-600 mt-2">{item.description}</p>
                  {item.photo_url && (
                    <div className="mt-2">
                      <img
                        src={item.photo_url}
                        alt={item.title}
                        className="h-40 w-full object-cover rounded"
                      />
                    </div>
                  )}
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 