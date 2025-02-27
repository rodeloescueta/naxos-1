import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware is no longer needed with our simplified authentication approach
// We're keeping this file as a placeholder in case we need to add middleware functionality in the future
export function middleware(request: NextRequest) {
  // Simply pass through all requests
  return NextResponse.next();
}

export const config = {
  matcher: [], // Empty matcher means this middleware won't run on any routes
}; 