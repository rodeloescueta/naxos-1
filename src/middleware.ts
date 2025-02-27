import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  console.log('Middleware running for path:', req.nextUrl.pathname);
  
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Check if the user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  // Get the pathname from the request
  const { pathname } = req.nextUrl;
  
  console.log('Session exists:', !!session);
  
  // If accessing admin routes, check authentication and admin role
  if (pathname.startsWith('/admin') || pathname === '/direct-admin') {
    // If not authenticated, redirect to login
    if (!session) {
      console.log('No session found, redirecting to login');
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    
    // Check if user is an admin by examining their email
    const { data: { user } } = await supabase.auth.getUser();
    const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];
    const isAdmin = adminEmails.some(email => 
      email.trim().toLowerCase() === user?.email?.toLowerCase()
    );
    
    // If not an admin, redirect to home page
    if (!isAdmin) {
      console.log('User is not an admin, redirecting to home page');
      return NextResponse.redirect(new URL('/', req.url));
    }
    
    console.log('User is authenticated and is an admin, allowing access to admin page');
  }
  
  // If accessing login or signup pages while already authenticated
  if ((pathname === '/login' || pathname === '/signup') && session) {
    // Check if there's a redirect parameter
    const redirectTo = req.nextUrl.searchParams.get('redirect');
    if (redirectTo) {
      console.log('Redirecting authenticated user to:', redirectTo);
      const redirectUrl = new URL(redirectTo, req.url);
      return NextResponse.redirect(redirectUrl);
    }
    
    // Check if user is an admin
    const { data: { user } } = await supabase.auth.getUser();
    const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];
    const isAdmin = adminEmails.some(email => 
      email.trim().toLowerCase() === user?.email?.toLowerCase()
    );
    
    if (isAdmin) {
      console.log('Redirecting admin user to direct-admin');
      return NextResponse.redirect(new URL('/direct-admin', req.url));
    } else {
      console.log('Redirecting non-admin user to home page');
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  
  return res;
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ['/admin/:path*', '/direct-admin', '/login', '/signup'],
}; 