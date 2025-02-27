'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { adminGetAllMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, MenuItem, CreateMenuItemData } from '@/lib/menu-items';
import { signOut, isAdmin } from '@/lib/auth';

export default function DirectAdminPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<CreateMenuItemData>({
    title: '',
    description: '',
    price: 0,
    image_url: '',
    category: '',
    is_featured: false,
  });
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  // Check authentication and admin status
  useEffect(() => {
    const checkAuth = async () => {
      console.log('Admin page: Checking authentication and admin status');
      
      if (!user) {
        console.log('Admin page: No user found, attempting to refresh user data');
        await refreshUser();
      }
      
      if (!user) {
        console.log('Admin page: Still no user after refresh, redirecting to login');
        router.push('/login');
        return;
      }
      
      console.log('Admin page: User authenticated with email:', user.email);
      
      // Check if user is admin
      const adminStatus = isAdmin(user);
      console.log('Admin page: User admin status:', adminStatus);
      
      if (!adminStatus) {
        console.log('Admin page: User is not an admin, redirecting to home');
        router.push('/');
        return;
      }
      
      console.log('Admin page: User is admin, loading menu items');
      loadMenuItems();
      setAuthChecked(true);
    };
    
    checkAuth();
  }, [user, router, refreshUser]);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      console.log('Admin page: Loading menu items');
      const items = await adminGetAllMenuItems();
      console.log(`Admin page: Loaded ${items.length} menu items`);
      setMenuItems(items);
      setError(null);
    } catch (err) {
      console.error('Admin page: Error loading menu items:', err);
      setError('Failed to load menu items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      console.log('Admin page: Signing out user');
      await signOut();
      console.log('Admin page: User signed out successfully, redirecting to login');
      router.push('/login');
    } catch (err) {
      console.error('Admin page: Error signing out:', err);
      setError('Failed to sign out. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'price') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      if (editingItem) {
        console.log('Admin page: Updating menu item:', editingItem.id);
        const updatedItem = await updateMenuItem(editingItem.id, formData);
        console.log('Admin page: Menu item updated successfully:', updatedItem.id);
        setSuccess(`Menu item "${updatedItem.title}" updated successfully!`);
        setEditingItem(null);
      } else {
        console.log('Admin page: Creating new menu item:', formData.title);
        const newItem = await createMenuItem(formData);
        console.log('Admin page: Menu item created successfully:', newItem.id);
        setSuccess(`Menu item "${newItem.title}" created successfully!`);
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: 0,
        image_url: '',
        category: '',
        is_featured: false,
      });
      
      // Reload menu items
      loadMenuItems();
    } catch (err) {
      console.error('Admin page: Error saving menu item:', err);
      setError('Failed to save menu item. Please try again.');
    }
  };

  const handleEditItem = (item: MenuItem) => {
    console.log('Admin page: Editing menu item:', item.id);
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      price: item.price,
      image_url: item.image_url || '',
      category: item.category || '',
      is_featured: item.is_featured,
    });
    setError(null);
    setSuccess(null);
  };

  const handleCancelEdit = () => {
    console.log('Admin page: Canceling edit');
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      price: 0,
      image_url: '',
      category: '',
      is_featured: false,
    });
  };

  const handleDeleteItem = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }
    
    try {
      console.log('Admin page: Deleting menu item:', id);
      await deleteMenuItem(id);
      console.log('Admin page: Menu item deleted successfully');
      setSuccess(`Menu item "${title}" deleted successfully!`);
      loadMenuItems();
    } catch (err) {
      console.error('Admin page: Error deleting menu item:', err);
      setError('Failed to delete menu item. Please try again.');
    }
  };

  if (!authChecked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8 text-center">
          <h2 className="text-2xl font-bold">Checking authentication...</h2>
          <p>Please wait while we verify your access.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8 text-center">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p>You need to be logged in to access this page.</p>
          <div className="mt-4">
            <button
              onClick={() => router.push('/login')}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Logged in as: {user.email}</span>
            <button
              onClick={handleSignOut}
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Form Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              {editingItem ? `Edit Menu Item: ${editingItem.title}` : 'Add New Menu Item'}
            </h2>
            
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {success && (
              <div className="mb-4 rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">{success}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleFormSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  />
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  />
                </div>
                
                <div>
                  <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <input
                    type="text"
                    name="image_url"
                    id="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    name="category"
                    id="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  >
                    <option value="">Select a category</option>
                    <option value="appetizer">Appetizer</option>
                    <option value="main">Main Course</option>
                    <option value="dessert">Dessert</option>
                    <option value="drink">Drink</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_featured"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
                    Featured Item
                  </label>
                </div>
                
                <div className="flex justify-end space-x-3">
                  {editingItem && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </button>
                </div>
              </div>
            </form>
          </div>
          
          {/* Menu Items List */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Menu Items</h2>
            
            {loading ? (
              <p>Loading menu items...</p>
            ) : menuItems.length === 0 ? (
              <p>No menu items found. Add your first item!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Title</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Featured</th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {menuItems.map((item) => (
                      <tr key={item.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{item.title}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${item.price.toFixed(2)}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.category || 'N/A'}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.is_featured ? 'Yes' : 'No'}</td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id, item.title)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 