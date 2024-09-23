
import { NextResponse } from 'next/server';
import { getAccessToken } from '@auth0/nextjs-auth0/edge'; 

export async function middleware(req) {
  // Get the access token from Auth0
  const { accessToken } = await getAccessToken(req);

  if (!accessToken) {
    console.error('No access token available');
    return NextResponse.redirect('/signin'); // Proceed without modification if no token is found
  }

  // Clone the request headers and add the Authorization header
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('Authorization', `Bearer ${accessToken}`);
  
  console.log('Outgoing Request Headers:', [...requestHeaders]);

  // Proceed with the modified request headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/dashboard', '/admin'], // Matches routes for middleware
};