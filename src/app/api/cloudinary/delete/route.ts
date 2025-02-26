import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { isAdmin, getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: You must be logged in' },
        { status: 401 }
      );
    }

    const adminStatus = await isAdmin(user);
    if (!adminStatus) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Get the public ID from the request body
    const { publicId } = await request.json();
    
    if (!publicId) {
      return NextResponse.json(
        { error: 'Bad Request: Public ID is required' },
        { status: 400 }
      );
    }

    // Delete the image from Cloudinary
    // This would typically use the Cloudinary SDK, but for simplicity we'll use fetch
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'Server Error: Missing Cloudinary credentials' },
        { status: 500 }
      );
    }

    // Create a timestamp for the signature
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // Create a signature string
    const signature = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    
    // Create a SHA-1 hash of the signature string
    const crypto = require('crypto');
    const sha1Signature = crypto.createHash('sha1').update(signature).digest('hex');

    // Create the form data for the Cloudinary API
    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', apiKey);
    formData.append('signature', sha1Signature);

    // Send the request to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: `Cloudinary Error: ${error.message || 'Failed to delete image'}` },
        { status: 500 }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error deleting image from Cloudinary:', error);
    return NextResponse.json(
      { error: `Server Error: ${error.message || 'An unexpected error occurred'}` },
      { status: 500 }
    );
  }
} 