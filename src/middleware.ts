import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Function to check if an email is in the admin list
function isEmailInAdminList(email: string | undefined | null): boolean {
  if (!email) return false;
  
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
  console.log('Middleware - Admin emails from env:', adminEmails);
  const adminEmailList = adminEmails.split(',').map(e => e.trim().toLowerCase());
  console.log('Middleware - Admin email list:', adminEmailList);
  console.log('Middleware - Checking email:', email?.toLowerCase());
  
  const isAdmin = adminEmailList.includes(email.toLowerCase());
  console.log('Middleware - Is admin result:', isAdmin);
  return isAdmin;
}

export async function middleware(req: NextRequest) {
  console.log('Middleware running for path:', req.nextUrl.pathname);
  
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Check if the user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  // Get the pathname from the request
  const { pathname } = req.nextUrl;
  
  console.log('Session exists:', !!session);
  
  // If accessing admin routes, check authentication and role
  if (pathname.startsWith('/admin') && 
      !pathname.includes('/admin-test') && 
      !pathname.includes('/admin-bypass') &&
      !pathname.includes('/admin-nav')) {
    // If not authenticated, redirect to login
    if (!session) {
      console.log('No session found, redirecting to login');
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    
    // Get the user's email
    const userEmail = session.user?.email;
    console.log('User email from session:', userEmail);
    
    // Check if the user's email is in the admin list
    const isAdmin = isEmailInAdminList(userEmail);
    
    console.log('Final admin check result:', isAdmin);
    
    // If not an admin, redirect to home page
    if (!isAdmin) {
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
      console.log('Redirecting authenticated user to:', redirectTo);
      const redirectUrl = new URL(redirectTo, req.url);
      return NextResponse.redirect(redirectUrl);
    }
    
    console.log('Redirecting authenticated user to home');
    const redirectUrl = new URL('/', req.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  return res;
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ['/admin/:path*', '/login', '/signup'],
}; 