# Cloudinary Image Upload Guide

This guide explains how to upload images to Cloudinary and get URLs for use in the Naxos restaurant app.

## Prerequisites

1. You need a Cloudinary account. If you don't have one, sign up at [Cloudinary](https://cloudinary.com/users/register/free).
2. Make sure your Cloudinary credentials are set in your `.env.local` file:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

## Method 1: Upload via Admin Interface (Recommended)

The admin interface has built-in image upload functionality:

1. Log in to the admin dashboard at `/direct-admin`
2. When creating or editing a menu item, click the "Choose File" button in the Photo URL field
3. Select an image from your computer
4. The image will be automatically uploaded to Cloudinary, and the URL will be filled in the form
5. Save the menu item to store the Cloudinary URL in the database

## Method 2: Manual Upload via Cloudinary Dashboard

If you prefer to upload images manually:

1. Log in to your [Cloudinary Dashboard](https://cloudinary.com/console)
2. Navigate to Media Library
3. Click "Upload" button
4. Upload your images
5. For each uploaded image:
   - Click on the image to view details
   - Find the "Secure URL" field
   - Copy this URL to use in your app

## Method 3: Programmatic Upload (For Developers)

You can use the Cloudinary API to upload images programmatically:

```javascript
// Example using the existing uploadImageToCloudinary function
import { uploadImageToCloudinary } from '@/lib/cloudinary';

async function handleImageUpload(file) {
  try {
    const result = await uploadImageToCloudinary(file);
    console.log('Uploaded image URL:', result.secure_url);
    // Use result.secure_url in your app
  } catch (error) {
    console.error('Error uploading image:', error);
  }
}
```

## Image Optimization Tips

1. **Use appropriate formats**: JPEG for photos, PNG for images with transparency, WebP for better compression
2. **Optimize image size**: Aim for images around 800-1200px wide for menu items
3. **Keep file sizes small**: Ideally under 200KB per image for fast loading
4. **Use descriptive filenames**: e.g., "greek-salad.jpg" instead of "IMG_12345.jpg"

## Cloudinary Transformations

You can modify images on-the-fly by adding parameters to the URL:

- Resize: Add `/w_500,h_300,c_fill/` before the filename
- Crop: Add `/c_crop,g_face/` for face-focused cropping
- Quality: Add `/q_auto/` for automatic quality optimization

Example:
```
https://res.cloudinary.com/your-cloud-name/image/upload/w_500,h_300,c_fill/v1234567890/your-image.jpg
```

## Updating Seeded Images

After uploading your real images to Cloudinary:

1. Go to the admin dashboard
2. Edit each menu item
3. Replace the placeholder URL with your actual Cloudinary URL
4. Save the changes

Alternatively, you can update the database directly with a SQL query:

```sql
UPDATE menu_items 
SET photo_url = 'your-new-cloudinary-url' 
WHERE id = 'item-id';
``` 