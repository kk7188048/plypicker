import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export function withAuth(requiredRoles: ('admin' | 'team member')[]) {
  return async (req: NextRequest) => {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      // Verify and decrypt the token using the secret key
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));

      // Extract user information from the payload
      const { id, role, email } = payload as { id: string, role: string, email: string };
      console.log('Decoded token:', payload);

      console.log(requiredRoles, role);
      if (!requiredRoles.includes(role as 'admin' | 'team member')) {
        return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 });
      }

      // Clone the request headers and add user information
      const requestHeaders = new Headers(req.headers);
      const userPayload = JSON.stringify({ id, role, email });
      requestHeaders.set('user', userPayload);

      // Proceed with the request and return the response
      return NextResponse.next({
        request: {
          headers: requestHeaders
        }
      });
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
  };
}

export async function middleware(req: NextRequest) {
  const urlPath = req.nextUrl.pathname;

  if (urlPath.startsWith('/dashboard/team')) {
    return withAuth(['team member'])(req); 
  } else if (urlPath.startsWith('/dashboard/admin')) {
    return withAuth(['admin'])(req);
  } else if (urlPath.startsWith('/product')) {
    // Allow both team members and admins to access product routes
    return withAuth(['admin', 'team member'])(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/product/:path*',
  ],
};