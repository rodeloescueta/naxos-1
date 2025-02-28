'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  reorderCategories,
  Category
} from '@/lib/categories';
import Link from 'next/link';

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<{
    id: string;
    name: string;
    sequence: string;
  }>({
    id: '',
    name: '',
    sequence: '0'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [authChecked, setAuthChecked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const router = useRouter();
  const { user, isAdmin, isLoading, signOut } = useAuth();

  // Check authentication and admin status
  useEffect(() => {
    const checkAuth = async () => {
      console.log('Categories admin page: Checking authentication');
      
      if (isLoading) {
        console.log('Categories admin page: Auth is still loading');
        return;
      }
      
      // If no user is found, redirect to login
      if (!user) {
        console.log('Categories admin page: No user found, redirecting to login');
        router.push('/login');
        return;
      }
      
      console.log('Categories admin page: User authenticated with email:', user.email);
      
      // If user is not an admin, redirect to home
      if (!isAdmin) {
        console.log('Categories admin page: User is not an admin, redirecting to home');
        setStatusMessage('You do not have admin privileges');
        router.push('/');
        return;
      }
      
      console.log('Categories admin page: User is admin, access granted');
      setAuthChecked(true);
      loadCategories();
    };
    
    checkAuth();
  }, [user, isAdmin, isLoading, router]);

  const loadCategories = async () => {
    try {
      console.log('Categories admin page: Loading categories');
      setLoading(true);
      const items = await getCategories();
      console.log(`Categories admin page: Loaded ${items.length} categories`);
      setCategories(items);
      setStatusMessage('');
    } catch (error) {
      console.error('Categories admin page: Error loading categories:', error);
      setStatusMessage('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      sequence: '0'
    });
    setIsEditing(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setStatusMessage('Saving...');
      
      // Validate form data
      if (!formData.name) {
        setStatusMessage('Please fill in the category name');
        return;
      }
      
      // Convert sequence to number
      const sequenceValue = parseInt(formData.sequence);
      if (isNaN(sequenceValue)) {
        setStatusMessage('Sequence must be a valid number');
        return;
      }
      
      const categoryData = {
        name: formData.name,
        sequence: sequenceValue
      };
      
      if (isEditing) {
        console.log('Categories admin page: Updating category with ID:', formData.id);
        await updateCategory(formData.id, categoryData);
        console.log('Categories admin page: Category updated successfully');
        setStatusMessage('Category updated successfully');
      } else {
        console.log('Categories admin page: Creating new category');
        await createCategory(categoryData);
        console.log('Categories admin page: Category created successfully');
        setStatusMessage('Category created successfully');
      }
      
      resetForm();
      loadCategories();
    } catch (error) {
      console.error('Categories admin page: Error saving category:', error);
      setStatusMessage('Failed to save category');
    }
  };

  const handleEditCategory = (category: Category) => {
    console.log('Categories admin page: Editing category with ID:', category.id);
    setFormData({
      id: category.id,
      name: category.name,
      sequence: category.sequence.toString()
    });
    setIsEditing(true);
    setStatusMessage('');
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? This will not delete menu items in this category, but they will become uncategorized.')) {
      return;
    }
    
    try {
      console.log('Categories admin page: Deleting category with ID:', id);
      setStatusMessage('Deleting...');
      await deleteCategory(id);
      console.log('Categories admin page: Category deleted successfully');
      setStatusMessage('Category deleted successfully');
      loadCategories();
    } catch (error) {
      console.error('Categories admin page: Error deleting category:', error);
      setStatusMessage('Failed to delete category');
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

    const newCategories = [...categories];
    const draggedItem = newCategories[dragIndex];
    
    // Remove the dragged item
    newCategories.splice(dragIndex, 1);
    // Insert it at the new position
    newCategories.splice(dropIndex, 0, draggedItem);
    
    // Update the sequence values
    const updatedCategories = newCategories.map((item, index) => ({
      ...item,
      sequence: index
    }));
    
    setCategories(updatedCategories);
    setIsDragging(false);
    
    // Save the new order to the database
    saveNewOrder(updatedCategories);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const saveNewOrder = async (orderedCategories: Category[]) => {
    try {
      setStatusMessage('Saving new order...');
      const orderedIds = orderedCategories.map(category => category.id);
      await reorderCategories(orderedIds);
      setStatusMessage('Order saved successfully');
    } catch (error) {
      console.error('Categories admin page: Error saving new order:', error);
      setStatusMessage('Failed to save new order');
      // Reload the original order
      loadCategories();
    }
  };

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
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Category Management</h1>
        <div className="flex space-x-4">
          <Link href="/direct-admin" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Back to Menu Items
          </Link>
          <button
            onClick={() => signOut().then(() => router.push('/login'))}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">{isEditing ? 'Edit Category' : 'Add New Category'}</h2>
          <form onSubmit={handleFormSubmit} className="space-y-4 bg-gray-50 p-6 rounded-lg shadow">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Category Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
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
                Lower numbers appear first. You can also drag and drop categories to reorder them.
              </p>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                {isEditing ? 'Update Category' : 'Add Category'}
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
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Categories</h2>
          <p className="mb-4 text-gray-600">Drag and drop to reorder categories. The order here will be used for displaying menu items on the website.</p>
          
          {loading ? (
            <p className="text-gray-600">Loading categories...</p>
          ) : categories.length === 0 ? (
            <p className="text-gray-600">No categories found. Add your first category!</p>
          ) : (
            <div className="space-y-2">
              {categories.map((category, index) => (
                <div 
                  key={category.id} 
                  className={`border rounded-lg p-4 bg-gray-50 shadow cursor-move ${isDragging ? 'transition-transform' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="mr-2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </span>
                      <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
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