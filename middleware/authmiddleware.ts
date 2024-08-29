import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // Attach user role to request
    req.headers.set('x-role', (decoded as any).role);
  } catch (error) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'], // Define routes that require authentication
};
