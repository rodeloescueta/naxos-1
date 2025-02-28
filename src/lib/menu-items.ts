import { supabase } from './supabase';
import { Category } from './categories';

export interface MenuItem {
  id: string;
  title: string;
  description: string;
  price: number;
  photo_url: string | null;
  category: string | null; // Keeping for backward compatibility
  category_id: string | null;
  is_featured: boolean;
  sequence: number;
  created_at: string;
}

export interface CreateMenuItemData {
  title: string;
  description: string;
  price: number;
  photo_url?: string;
  category?: string; // Keeping for backward compatibility
  category_id?: string;
  is_featured?: boolean;
  sequence?: number;
}

export interface UpdateMenuItemData {
  title?: string;
  description?: string | null;
  price?: number;
  photo_url?: string | null;
  category?: string | null; // Keeping for backward compatibility
  category_id?: string | null;
  is_featured?: boolean;
  sequence?: number;
}

// Get all menu items (public)
export async function getMenuItems(): Promise<MenuItem[]> {
  console.log('Menu items: Fetching all menu items');
  
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('sequence', { ascending: true });
    
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

// Get menu items with category information
export async function getMenuItemsWithCategories(): Promise<(MenuItem & { category_info: Category | null })[]> {
  console.log('Menu items: Fetching all menu items with category information');
  
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        category_info:categories(*)
      `)
      .order('sequence', { ascending: true });
    
    if (error) {
      console.error('Menu items: Error fetching menu items with categories:', error.message);
      throw error;
    }
    
    console.log(`Menu items: Successfully fetched ${data.length} menu items with categories`);
    return data as (MenuItem & { category_info: Category | null })[];
  } catch (error) {
    console.error('Menu items: Unexpected error fetching menu items with categories:', error);
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
    // If sequence is not provided, get the highest sequence for the category and add 1
    if (data.sequence === undefined) {
      const { data: menuItems, error: seqError } = await supabase
        .from('menu_items')
        .select('sequence')
        .eq('category_id', data.category_id || null)
        .order('sequence', { ascending: false })
        .limit(1);
      
      if (seqError) {
        console.error('Menu items: Error getting highest sequence:', seqError.message);
        throw seqError;
      }
      
      data.sequence = menuItems.length > 0 ? menuItems[0].sequence + 1 : 0;
    }
    
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
export async function updateMenuItem(id: string, data: UpdateMenuItemData): Promise<MenuItem> {
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
    .order('sequence', { ascending: true });

  if (error) {
    console.error('Error fetching featured menu items:', error);
    throw error;
  }

  console.log(`Retrieved ${data?.length || 0} featured menu items`);
  return data || [];
}

// Get menu items by category - public access
export async function getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]> {
  console.log(`Fetching menu items for category ID: ${categoryId}`);
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('category_id', categoryId)
    .order('sequence', { ascending: true });

  if (error) {
    console.error(`Error fetching menu items for category ID ${categoryId}:`, error);
    throw error;
  }

  console.log(`Retrieved ${data?.length || 0} menu items for category ID ${categoryId}`);
  return data || [];
}

// Get all menu items for admin view
export async function adminGetAllMenuItems(): Promise<MenuItem[]> {
  console.log('Fetching all menu items for admin view');
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('sequence', { ascending: true });

  if (error) {
    console.error('Error fetching all menu items as admin:', error);
    throw error;
  }

  console.log(`Retrieved ${data?.length || 0} menu items for admin view`);
  return data || [];
}

// Reorder menu items within a category (authenticated users only)
export async function reorderMenuItems(categoryId: string | null, orderedIds: string[]): Promise<void> {
  console.log(`Menu items: Reordering menu items for category ID: ${categoryId || 'uncategorized'}`);
  
  try {
    // Start a transaction to update all sequences
    for (let i = 0; i < orderedIds.length; i++) {
      const { error } = await supabase
        .from('menu_items')
        .update({ sequence: i })
        .eq('id', orderedIds[i]);
      
      if (error) {
        console.error(`Menu items: Error updating sequence for menu item ${orderedIds[i]}:`, error.message);
        throw error;
      }
    }
    
    console.log('Menu items: Successfully reordered menu items');
  } catch (error) {
    console.error('Menu items: Unexpected error reordering menu items:', error);
    throw error;
  }
} 