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
      const redirectUrl = new URL('/login', req.url);
      return NextResponse.redirect(redirectUrl);
    }
    
    // Check if the user has the admin role
    const { data: { user } } = await supabase.auth.getUser();
    const userRole = user?.user_metadata?.role;
    
    // If not an admin, redirect to home page
    if (userRole !== 'admin') {
      const redirectUrl = new URL('/', req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }
  
  // If accessing login or signup pages while already authenticated, redirect to home
  if ((pathname === '/login' || pathname === '/signup') && session) {
    const redirectUrl = new URL('/', req.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  return res;
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ['/admin/:path*', '/login', '/signup'],
}; 