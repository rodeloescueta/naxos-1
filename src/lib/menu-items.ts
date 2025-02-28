import { supabase } from './supabase';

export interface MenuItem {
  id: string;
  title: string;
  description: string;
  price: number;
  photo_url: string | null;
  category: string | null;
  is_featured: boolean;
  created_at: string;
}

export interface CreateMenuItemData {
  title: string;
  description: string;
  price: number;
  photo_url?: string;
  category?: string;
  is_featured?: boolean;
}

export interface UpdateMenuItemData {
  title?: string;
  description?: string | null;
  price?: number;
  photo_url?: string | null;
  category?: string | null;
  is_featured?: boolean;
}

// Get all menu items (public)
export async function getMenuItems(): Promise<MenuItem[]> {
  console.log('Menu items: Fetching all menu items');
  
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Menu items: Error fetching menu items:', error.message);
      throw error;
    }
    
    console.log(`Menu items: Successfully fetched ${data.length} menu items`);
    return data as MenuItem[];
  } catch (error) {
    console.error('Menu items: Unexpected error fetching menu items:', error);
    throw error;
  }
}

// Get a single menu item by ID (public)
export async function getMenuItem(id: string): Promise<MenuItem | null> {
  console.log(`Menu items: Fetching menu item with ID: ${id}`);
  
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log(`Menu items: No menu item found with ID: ${id}`);
        return null;
      }
      console.error(`Menu items: Error fetching menu item with ID ${id}:`, error.message);
      throw error;
    }
    
    console.log(`Menu items: Successfully fetched menu item with ID: ${id}`);
    return data as MenuItem;
  } catch (error) {
    console.error(`Menu items: Unexpected error fetching menu item with ID ${id}:`, error);
    throw error;
  }
}

// Create a new menu item (authenticated users only)
export async function createMenuItem(data: CreateMenuItemData): Promise<MenuItem> {
  console.log('Menu items: Creating new menu item:', data.title);
  
  try {
    const { data: newItem, error } = await supabase
      .from('menu_items')
      .insert([data])
      .select()
      .single();
    
    if (error) {
      console.error('Menu items: Error creating menu item:', error.message);
      throw error;
    }
    
    console.log('Menu items: Successfully created menu item with ID:', newItem.id);
    return newItem as MenuItem;
  } catch (error) {
    console.error('Menu items: Unexpected error creating menu item:', error);
    throw error;
  }
}

// Update an existing menu item (authenticated users only)
export async function updateMenuItem(id: string, data: Partial<CreateMenuItemData>): Promise<MenuItem> {
  console.log(`Menu items: Updating menu item with ID: ${id}`);
  
  try {
    const { data: updatedItem, error } = await supabase
      .from('menu_items')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Menu items: Error updating menu item with ID ${id}:`, error.message);
      throw error;
    }
    
    console.log(`Menu items: Successfully updated menu item with ID: ${id}`);
    return updatedItem as MenuItem;
  } catch (error) {
    console.error(`Menu items: Unexpected error updating menu item with ID ${id}:`, error);
    throw error;
  }
}

// Delete a menu item (authenticated users only)
export async function deleteMenuItem(id: string): Promise<void> {
  console.log(`Menu items: Deleting menu item with ID: ${id}`);
  
  try {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Menu items: Error deleting menu item with ID ${id}:`, error.message);
      throw error;
    }
    
    console.log(`Menu items: Successfully deleted menu item with ID: ${id}`);
  } catch (error) {
    console.error(`Menu items: Unexpected error deleting menu item with ID ${id}:`, error);
    throw error;
  }
}

// Get featured menu items - public access
export async function getFeaturedMenuItems(): Promise<MenuItem[]> {
  console.log('Fetching featured menu items');
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching featured menu items:', error);
    throw error;
  }

  console.log(`Retrieved ${data?.length || 0} featured menu items`);
  return data || [];
}

// Get menu items by category - public access
export async function getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
  console.log(`Fetching menu items for category: ${category}`);
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching menu items for category ${category}:`, error);
    throw error;
  }

  console.log(`Retrieved ${data?.length || 0} menu items for category ${category}`);
  return data || [];
}

// Get all menu items for admin view
export async function adminGetAllMenuItems(): Promise<MenuItem[]> {
  console.log('Fetching all menu items for admin view');
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all menu items as admin:', error);
    throw error;
  }

  console.log(`Retrieved ${data?.length || 0} menu items for admin view`);
  return data || [];
} 