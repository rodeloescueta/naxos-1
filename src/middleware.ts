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
  
  // If accessing admin routes, check authentication
  if (pathname.startsWith('/admin') && 
      !pathname.includes('/admin-test') && 
      !pathname.includes('/admin-bypass') &&
      !pathname.includes('/admin-nav') &&
      !pathname.includes('/direct-admin')) {
    // If not authenticated, redirect to login
    if (!session) {
      console.log('No session found, redirecting to login');
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    
    console.log('User is authenticated, allowing access to admin page');
  }
  
  // If accessing login or signup pages while already authenticated, redirect to direct-admin
  if ((pathname === '/login' || pathname === '/signup') && session) {
    // Check if there's a redirect parameter
    const redirectTo = req.nextUrl.searchParams.get('redirect');
    if (redirectTo) {
      console.log('Redirecting authenticated user to:', redirectTo);
      const redirectUrl = new URL(redirectTo, req.url);
      return NextResponse.redirect(redirectUrl);
    }
    
    console.log('Redirecting authenticated user to direct-admin');
    const redirectUrl = new URL('/direct-admin', req.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  return res;
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ['/admin/:path*', '/login', '/signup'],
}; 