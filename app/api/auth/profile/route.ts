import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/utils/mongoose';
import User from '@/app/models/User';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  try {
    // Extract token from cookies
    const token = req.cookies.get('token')?.value;
    console.log('Token:', token);

    if (!token) {
      console.log('No token found, returning unauthorized');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET environment variable is not set');
      throw new Error('JWT_SECRET environment variable is not set');
    }

    // Verify token
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    console.log('Decoded token:', decoded);

    if (!decoded || !decoded.id) {
      console.log('Invalid token or missing user ID, returning unauthorized');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Connect to the database
    await dbConnect();
    console.log('Database connected successfully.');

    // Fetch user profile based on user ID from token
    const user = await User.findById(decoded.id).select('-password'); // Exclude password from response
    console.log('Fetched user:', user);

    if (!user) {
      console.log('User not found, returning 404');
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Log the user profile being returned
    console.log('Returning user profile:', {
      email: user.email,
      role: user.role,
      // Add other profile fields as needed
    });

    return NextResponse.json({
      email: user.email,
      role: user.role,
      // Add other profile fields as needed
    });
  } catch (error: any) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}