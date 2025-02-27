import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Define admin routes that require authentication and admin role
const ADMIN_ROUTES = ['/direct-admin', '/admin'];

export async function middleware(request: NextRequest) {
  // Initialize Supabase client with environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Middleware: Missing Supabase environment variables');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const requestUrl = new URL(request.url);
  const path = requestUrl.pathname;

  console.log(`Middleware processing path: ${path}`);

  // Skip middleware for non-admin routes and API routes
  if (!ADMIN_ROUTES.some(route => path.startsWith(route)) || path.startsWith('/api')) {
    console.log('Middleware: Not an admin route, skipping checks');
    return NextResponse.next();
  }

  try {
    // Get session from cookies
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    console.log(`Middleware: Session exists: ${!!session}`, sessionError ? `Error: ${sessionError.message}` : '');
    
    if (!session) {
      console.log('Middleware: No session found, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Get user email from session
    const userEmail = session.user?.email;
    console.log(`Middleware: User email: ${userEmail || 'unknown'}`);

    if (!userEmail) {
      console.log('Middleware: No user email found, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check if user is admin
    const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];
    console.log(`Middleware: Admin emails from env: ${adminEmails.join(', ')}`);
    
    const isAdmin = adminEmails.includes(userEmail);
    console.log(`Middleware: Is admin check for ${userEmail}: ${isAdmin}`);

    if (!isAdmin) {
      console.log(`Middleware: User ${userEmail} is not an admin, redirecting to home`);
      return NextResponse.redirect(new URL('/', request.url));
    }

    console.log(`Middleware: User ${userEmail} is admin, allowing access to ${path}`);
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}; 