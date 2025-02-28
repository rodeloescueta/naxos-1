'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { 
  getMenuItems, 
  getMenuItemsWithCategories,
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem,
  reorderMenuItems,
  MenuItem,
  CreateMenuItemData
} from '@/lib/menu-items';
import { getCategories, Category } from '@/lib/categories';
import Link from 'next/link';

export default function AdminPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<{
    id: string;
    title: string;
    description: string;
    price: string;
    photo_url: string;
    category: string; // Keeping for backward compatibility
    category_id: string;
    is_featured: boolean;
    sequence: string;
  }>({
    id: '',
    title: '',
    description: '',
    price: '',
    photo_url: '',
    category: '',
    category_id: '',
    is_featured: false,
    sequence: '0'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [authChecked, setAuthChecked] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
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
      loadData();
    };
    
    checkAuth();
  }, [user, isAdmin, isLoading, router, refreshUser]);

  const loadData = async () => {
    try {
      console.log('Admin page: Loading data');
      setLoading(true);
      
      // Load categories first
      const categoriesData = await getCategories();
      console.log(`Admin page: Loaded ${categoriesData.length} categories`);
      setCategories(categoriesData);
      
      // Then load menu items
      const items = await getMenuItems();
      console.log(`Admin page: Loaded ${items.length} menu items`);
      setMenuItems(items);
      
      setStatusMessage('');
    } catch (error) {
      console.error('Admin page: Error loading data:', error);
      setStatusMessage('Failed to load data');
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else if (name === 'category_id') {
      // When category_id changes, also update the category field for backward compatibility
      const selectedCategory = categories.find(cat => cat.id === value);
      setFormData({ 
        ...formData, 
        [name]: value,
        category: selectedCategory ? selectedCategory.name : ''
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      description: '',
      price: '',
      photo_url: '',
      category: '',
      category_id: '',
      is_featured: false,
      sequence: '0'
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
      
      // Convert price and sequence to numbers
      const priceValue = parseFloat(formData.price);
      if (isNaN(priceValue)) {
        setStatusMessage('Price must be a valid number');
        return;
      }
      
      const sequenceValue = parseInt(formData.sequence);
      if (isNaN(sequenceValue)) {
        setStatusMessage('Sequence must be a valid number');
        return;
      }
      
      const itemData: any = {
        title: formData.title,
        description: formData.description,
        price: priceValue,
        photo_url: formData.photo_url || undefined,
        category: formData.category || undefined,
        category_id: formData.category_id || null,
        is_featured: formData.is_featured,
        sequence: sequenceValue
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
      loadData();
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
      category: item.category || '',
      category_id: item.category_id || '',
      is_featured: item.is_featured || false,
      sequence: item.sequence?.toString() || '0'
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
      loadData();
    } catch (error) {
      console.error('Admin page: Error deleting menu item:', error);
      setStatusMessage('Failed to delete menu item');
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex === dropIndex) return;

    // Filter items by the active category
    const filteredItems = activeCategory 
      ? menuItems.filter(item => item.category_id === activeCategory)
      : menuItems.filter(item => !item.category_id);

    const newItems = [...filteredItems];
    const draggedItem = newItems[dragIndex];
    
    // Remove the dragged item
    newItems.splice(dragIndex, 1);
    // Insert it at the new position
    newItems.splice(dropIndex, 0, draggedItem);
    
    // Update the sequence values
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      sequence: index
    }));
    
    // Update the full menu items list
    const updatedMenuItems = [...menuItems];
    updatedItems.forEach(updatedItem => {
      const index = updatedMenuItems.findIndex(item => item.id === updatedItem.id);
      if (index !== -1) {
        updatedMenuItems[index] = updatedItem;
      }
    });
    
    setMenuItems(updatedMenuItems);
    setIsDragging(false);
    
    // Save the new order to the database
    saveNewOrder(activeCategory, updatedItems.map(item => item.id));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const saveNewOrder = async (categoryId: string | null, orderedIds: string[]) => {
    try {
      setStatusMessage('Saving new order...');
      await reorderMenuItems(categoryId, orderedIds);
      setStatusMessage('Order saved successfully');
    } catch (error) {
      console.error('Admin page: Error saving new order:', error);
      setStatusMessage('Failed to save new order');
      // Reload the original order
      loadData();
    }
  };

  // Filter menu items by category
  const filteredMenuItems = activeCategory 
    ? menuItems.filter(item => item.category_id === activeCategory)
    : activeCategory === null 
      ? menuItems // Show all items when no category is selected
      : menuItems.filter(item => !item.category_id); // Show uncategorized items

  // Sort menu items by sequence
  const sortedMenuItems = [...filteredMenuItems].sort((a, b) => 
    (a.sequence || 0) - (b.sequence || 0)
  );

  // Show loading state while checking authentication
  if (isLoading || !authChecked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-white">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 lg:text-5xl mb-6">
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
    <div className="flex min-h-screen flex-col p-8 bg-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Admin Dashboard</h1>
        <div className="flex space-x-4">
          <Link href="/direct-admin/categories" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Manage Categories
          </Link>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className={`p-4 mb-6 rounded ${statusMessage.includes('Failed') || statusMessage.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {statusMessage}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2 text-gray-800">Filter by Category</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1 rounded ${activeCategory === null ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            All
          </button>
          <button
            onClick={() => setActiveCategory('')}
            className={`px-3 py-1 rounded ${activeCategory === '' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Uncategorized
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-3 py-1 rounded ${activeCategory === category.id ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">{isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
          <form onSubmit={handleFormSubmit} className="space-y-4 bg-gray-50 p-6 rounded-lg shadow">
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
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Uncategorized</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sequence" className="block text-sm font-medium text-gray-700">
                Display Order
              </label>
              <input
                type="number"
                id="sequence"
                name="sequence"
                value={formData.sequence}
                onChange={handleInputChange}
                min="0"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Lower numbers appear first. You can also drag and drop items to reorder them.
              </p>
            </div>

            <div>
              <label htmlFor="photo_url" className="block text-sm font-medium text-gray-700">
                Photo URL
              </label>
              <input
                type="text"
                id="photo_url"
                name="photo_url"
                value={formData.photo_url}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_featured"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
                Featured Item
              </label>
            </div>

            <div className="flex space-x-4 pt-4">
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
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            {activeCategory === null 
              ? 'All Menu Items' 
              : activeCategory === '' 
                ? 'Uncategorized Menu Items' 
                : `Menu Items in ${categories.find(c => c.id === activeCategory)?.name || 'Category'}`}
          </h2>
          <p className="mb-4 text-gray-600">
            {activeCategory !== null && 'Drag and drop to reorder items within this category.'}
          </p>
          
          {loading ? (
            <p className="text-gray-600">Loading menu items...</p>
          ) : sortedMenuItems.length === 0 ? (
            <p className="text-gray-600">No menu items found in this category. Add your first item!</p>
          ) : (
            <div className="space-y-4">
              {sortedMenuItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`border rounded-lg p-4 bg-gray-50 shadow ${activeCategory !== null ? 'cursor-move' : ''} ${isDragging ? 'transition-transform' : ''}`}
                  draggable={activeCategory !== null}
                  onDragStart={activeCategory !== null ? (e) => handleDragStart(e, index) : undefined}
                  onDragOver={activeCategory !== null ? handleDragOver : undefined}
                  onDrop={activeCategory !== null ? (e) => handleDrop(e, index) : undefined}
                  onDragEnd={activeCategory !== null ? handleDragEnd : undefined}
                >
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        {activeCategory !== null && (
                          <span className="mr-2 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                          </span>
                        )}
                        <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                      </div>
                      <div className="text-lg font-bold text-indigo-600 mt-1">${parseFloat(item.price.toString()).toFixed(2)}</div>
                      <p className="text-gray-600 mt-1">{item.description}</p>
                      
                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.category && (
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {item.category}
                          </span>
                        )}
                        {item.is_featured && (
                          <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                            Featured
                          </span>
                        )}
                        <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          Order: {item.sequence || 0}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
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