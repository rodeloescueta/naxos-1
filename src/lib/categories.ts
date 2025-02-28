import { supabase } from './supabase';

export interface Category {
  id: string;
  name: string;
  sequence: number;
  created_at: string;
}

export interface CreateCategoryData {
  name: string;
  sequence?: number;
}

export interface UpdateCategoryData {
  name?: string;
  sequence?: number;
}

// Get all categories (public)
export async function getCategories(): Promise<Category[]> {
  console.log('Categories: Fetching all categories');
  
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sequence', { ascending: true });
    
    if (error) {
      console.error('Categories: Error fetching categories:', error.message);
      throw error;
    }
    
    console.log(`Categories: Successfully fetched ${data.length} categories`);
    return data as Category[];
  } catch (error) {
    console.error('Categories: Unexpected error fetching categories:', error);
    throw error;
  }
}

// Get a single category by ID (public)
export async function getCategory(id: string): Promise<Category | null> {
  console.log(`Categories: Fetching category with ID: ${id}`);
  
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log(`Categories: No category found with ID: ${id}`);
        return null;
      }
      console.error(`Categories: Error fetching category with ID ${id}:`, error.message);
      throw error;
    }
    
    console.log(`Categories: Successfully fetched category with ID: ${id}`);
    return data as Category;
  } catch (error) {
    console.error(`Categories: Unexpected error fetching category with ID ${id}:`, error);
    throw error;
  }
}

// Create a new category (authenticated users only)
export async function createCategory(data: CreateCategoryData): Promise<Category> {
  console.log('Categories: Creating new category:', data.name);
  
  try {
    // If sequence is not provided, get the highest sequence and add 1
    if (data.sequence === undefined) {
      const { data: categories, error: seqError } = await supabase
        .from('categories')
        .select('sequence')
        .order('sequence', { ascending: false })
        .limit(1);
      
      if (seqError) {
        console.error('Categories: Error getting highest sequence:', seqError.message);
        throw seqError;
      }
      
      data.sequence = categories.length > 0 ? categories[0].sequence + 1 : 0;
    }
    
    const { data: newCategory, error } = await supabase
      .from('categories')
      .insert([data])
      .select()
      .single();
    
    if (error) {
      console.error('Categories: Error creating category:', error.message);
      throw error;
    }
    
    console.log('Categories: Successfully created category with ID:', newCategory.id);
    return newCategory as Category;
  } catch (error) {
    console.error('Categories: Unexpected error creating category:', error);
    throw error;
  }
}

// Update an existing category (authenticated users only)
export async function updateCategory(id: string, data: UpdateCategoryData): Promise<Category> {
  console.log(`Categories: Updating category with ID: ${id}`);
  
  try {
    const { data: updatedCategory, error } = await supabase
      .from('categories')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Categories: Error updating category with ID ${id}:`, error.message);
      throw error;
    }
    
    console.log(`Categories: Successfully updated category with ID: ${id}`);
    return updatedCategory as Category;
  } catch (error) {
    console.error(`Categories: Unexpected error updating category with ID ${id}:`, error);
    throw error;
  }
}

// Delete a category (authenticated users only)
export async function deleteCategory(id: string): Promise<void> {
  console.log(`Categories: Deleting category with ID: ${id}`);
  
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Categories: Error deleting category with ID ${id}:`, error.message);
      throw error;
    }
    
    console.log(`Categories: Successfully deleted category with ID: ${id}`);
  } catch (error) {
    console.error(`Categories: Unexpected error deleting category with ID ${id}:`, error);
    throw error;
  }
}

// Reorder categories (authenticated users only)
export async function reorderCategories(orderedIds: string[]): Promise<void> {
  console.log('Categories: Reordering categories');
  
  try {
    // Start a transaction to update all sequences
    for (let i = 0; i < orderedIds.length; i++) {
      const { error } = await supabase
        .from('categories')
        .update({ sequence: i })
        .eq('id', orderedIds[i]);
      
      if (error) {
        console.error(`Categories: Error updating sequence for category ${orderedIds[i]}:`, error.message);
        throw error;
      }
    }
    
    console.log('Categories: Successfully reordered categories');
  } catch (error) {
    console.error('Categories: Unexpected error reordering categories:', error);
    throw error;
  }
} 