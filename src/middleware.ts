import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Check if the user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  // Get the pathname from the request
  const { pathname } = req.nextUrl;
  
  // If accessing admin routes, check authentication and role
  if (pathname.startsWith('/admin')) {
    // If not authenticated, redirect to login
    if (!session) {
      console.log('No session found, redirecting to login');
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    
    // Check if the user has the admin role
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('No user found, redirecting to login');
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    
    const userRole = user.user_metadata?.role;
    console.log('User role:', userRole);
    
    // If not an admin, redirect to home page
    if (userRole !== 'admin') {
      console.log('User is not admin, redirecting to home');
      const redirectUrl = new URL('/', req.url);
      return NextResponse.redirect(redirectUrl);
    }
    
    console.log('User is admin, allowing access to admin page');
  }
  
  // If accessing login or signup pages while already authenticated, redirect to home
  if ((pathname === '/login' || pathname === '/signup') && session) {
    // Check if there's a redirect parameter
    const redirectTo = req.nextUrl.searchParams.get('redirect');
    if (redirectTo) {
      const redirectUrl = new URL(redirectTo, req.url);
      return NextResponse.redirect(redirectUrl);
    }
    
    const redirectUrl = new URL('/', req.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  return res;
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ['/admin/:path*', '/login', '/signup'],
}; 