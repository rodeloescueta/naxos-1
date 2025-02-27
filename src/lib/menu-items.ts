import { supabase } from './supabase';

export interface MenuItem {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateMenuItemData {
  title: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
  is_featured?: boolean;
}

export interface UpdateMenuItemData {
  title?: string;
  description?: string | null;
  price?: number;
  image_url?: string | null;
  category?: string | null;
  is_featured?: boolean;
}

// Get all menu items - public access
export async function getMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }

  return data || [];
}

// Get a single menu item by ID - public access
export async function getMenuItem(id: string): Promise<MenuItem | null> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching menu item with ID ${id}:`, error);
    throw error;
  }

  return data;
}

// Create a new menu item (requires authentication)
export async function createMenuItem(menuItem: CreateMenuItemData): Promise<MenuItem> {
  const { data, error } = await supabase
    .from('menu_items')
    .insert([menuItem])
    .select()
    .single();

  if (error) {
    console.error('Error creating menu item:', error);
    throw error;
  }

  return data;
}

// Update a menu item (requires authentication)
export async function updateMenuItem(id: string, updates: UpdateMenuItemData): Promise<MenuItem> {
  const { data, error } = await supabase
    .from('menu_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating menu item with ID ${id}:`, error);
    throw error;
  }

  return data;
}

// Delete a menu item (requires authentication)
export async function deleteMenuItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting menu item with ID ${id}:`, error);
    throw error;
  }
}

// Get featured menu items - public access
export async function getFeaturedMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching featured menu items:', error);
    throw error;
  }

  return data || [];
}

// Get menu items by category - public access
export async function getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching menu items for category ${category}:`, error);
    throw error;
  }

  return data || [];
}

// Get all menu items for admin view
export async function adminGetAllMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all menu items as admin:', error);
    throw error;
  }

  return data || [];
} 