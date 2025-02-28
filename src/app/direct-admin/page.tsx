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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      {!authChecked ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : !user ? (
        <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-white">Admin Access Required</h1>
          <p className="mb-6 text-gray-300">Please log in to access the admin dashboard.</p>
          <Link 
            href="/login" 
            className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-center transition-colors"
          >
            Go to Login
          </Link>
        </div>
      ) : !isAdmin ? (
        <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-white">Admin Access Required</h1>
          <p className="mb-6 text-gray-300">Your account does not have admin privileges.</p>
          <button 
            onClick={handleSignOut} 
            className="block w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md text-center transition-colors"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <div className="flex gap-4">
              <Link 
                href="/direct-admin/categories" 
                className="py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors"
              >
                Manage Categories
              </Link>
              <button 
                onClick={handleSignOut} 
                className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-white">Filter by Category</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeCategory === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Add/Edit Menu Item Form */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-6 text-white">
                {isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h2>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                    Title *
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">
                    Price *
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="category_id" className="block text-sm font-medium text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="sequence" className="block text-sm font-medium text-gray-300 mb-1">
                    Display Order
                  </label>
                  <input
                    id="sequence"
                    name="sequence"
                    type="number"
                    value={formData.sequence}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Lower numbers appear first. You can also drag and drop items to reorder them.</p>
                </div>

                <div>
                  <label htmlFor="photo_url" className="block text-sm font-medium text-gray-300 mb-1">
                    Photo URL
                  </label>
                  <input
                    id="photo_url"
                    name="photo_url"
                    type="text"
                    value={formData.photo_url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="is_featured"
                    name="is_featured"
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-300">
                    Featured Item
                  </label>
                </div>

                {statusMessage && (
                  <div className={`p-3 rounded-md ${
                    statusMessage.includes('Error') 
                      ? 'bg-red-900/50 text-red-200' 
                      : 'bg-green-900/50 text-green-200'
                  }`}>
                    {statusMessage}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : isEditing ? 'Update Item' : 'Add Item'}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Menu Items List */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-6 text-white">All Menu Items</h2>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
              ) : filteredMenuItems.length === 0 ? (
                <p className="text-gray-400 text-center py-12">No menu items found in this category. Add your first item!</p>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {filteredMenuItems.map((item, index) => (
                    <div 
                      key={item.id}
                      draggable={!isDragging}
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`p-4 bg-gray-700 rounded-md transition-all ${
                        isDragging ? 'cursor-grabbing' : 'cursor-grab'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-white">{item.title}</h3>
                          <p className="text-sm text-gray-300 line-clamp-2 mt-1">{item.description}</p>
                          <div className="flex gap-2 mt-2">
                            <span className="text-sm font-medium text-blue-300">${parseFloat(item.price.toString()).toFixed(2)}</span>
                            {item.is_featured && (
                              <span className="text-xs bg-yellow-600 text-yellow-100 px-2 py-0.5 rounded-full">Featured</span>
                            )}
                            {item.category_id && (
                              <span className="text-xs bg-purple-600 text-purple-100 px-2 py-0.5 rounded-full">
                                {categories.find(c => c.id === item.category_id)?.name || 'Unknown Category'}
                              </span>
                            )}
                            <span className="text-xs bg-gray-600 text-gray-100 px-2 py-0.5 rounded-full">
                              Order: {item.sequence}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
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
      )}
    </div>
  );
} 