import { NextResponse, NextRequest } from 'next/server';
import { dbConnect } from '@/utils/mongoose';
import jwt from 'jsonwebtoken';
import { Product } from '@/app/models/Product';

export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();
    console.log('Database connected successfully.');

    // Extract token from cookies
    const token = req.cookies.get('token')?.value;
    console.log('Token:', token);

    if (!token) {
      console.log('No token found, returning unauthorized');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify and decrypt the token using the secret key
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
    console.log('Decoded token:', decodedToken);

    const { id, role, email } = decodedToken;

    // Check user role and fetch products accordingly
    if (role === 'admin') {
      console.log('User role is admin. Fetching all products.');
      const products = await Product.find({});
      return NextResponse.json({ products });
    } else if (role === 'team member') {
      console.log('User role is team_member. Fetching all products.');
      const products = await Product.find({});
      return NextResponse.json({ products });
    } else {
      console.log('User role is not authorized, returning forbidden');
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
  } catch (error: any) {
    console.error('Error in GET request:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}