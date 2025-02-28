'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { MenuItem, CreateMenuItemData, UpdateMenuItemData } from '@/lib/menu-items';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface MenuItemFormProps {
  menuItem?: MenuItem;
  onSubmit: (data: CreateMenuItemData | UpdateMenuItemData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function MenuItemForm({ 
  menuItem, 
  onSubmit, 
  onCancel, 
  isSubmitting 
}: MenuItemFormProps) {
  const [title, setTitle] = useState(menuItem?.title || '');
  const [description, setDescription] = useState(menuItem?.description || '');
  const [price, setPrice] = useState(menuItem?.price?.toString() || '');
  const [imageUrl, setImageUrl] = useState(menuItem?.photo_url || '');
  const [category, setCategory] = useState(menuItem?.category || '');
  const [isFeatured, setIsFeatured] = useState(menuItem?.is_featured || false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const formData: CreateMenuItemData | UpdateMenuItemData = {
      title,
      description: description || null,
      price: parseFloat(price),
      photo_url: imageUrl || null,
      category: category || null,
      is_featured: isFeatured,
    };
    
    await onSubmit(formData);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const result = await uploadImageToCloudinary(file);
      setImageUrl(result.secure_url);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setUploadError(error.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{menuItem ? 'Edit Menu Item' : 'Add New Menu Item'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter item title"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter item description"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              className={errors.price ? 'border-red-500' : ''}
            />
            {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <div className="flex items-center space-x-4">
              <Input
                id="image"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                disabled={isUploading}
                className="flex-1"
              />
              {isUploading && <p className="text-sm text-blue-500">Uploading...</p>}
            </div>
            {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
            
            {imageUrl && (
              <div className="mt-2">
                <div className="relative h-40 w-40 overflow-hidden rounded-md">
                  <Image
                    src={imageUrl}
                    alt={title || 'Menu item image'}
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setImageUrl('')}
                >
                  Remove Image
                </Button>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <Label htmlFor="isFeatured">Featured Item</Label>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting || isUploading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? 'Saving...' : menuItem ? 'Update Item' : 'Add Item'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 
