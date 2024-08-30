import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/utils/mongoose';
import { Product, IProduct } from '@/app/models/Product';
import jwt from 'jsonwebtoken';

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    console.log('Database connected successfully.');

    const token = request.cookies.get('token')?.value;
    if (!token) {
      console.log('No token found, returning unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify and decrypt the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
    console.log('Decoded token:', decoded);

    if (!decoded.id) {
      console.log('Invalid token: No user ID found in token');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { id, changes }: { id: string; changes: Partial<IProduct> } = await request.json();
    console.log('Received data:', { id, changes });

    // Log the product ID being searched
    console.log('Searching for product with ID:', id);

    // Find and update the product
    const updatedProduct = await Product.findOneAndUpdate(
      { id: id }, // Use the provided product ID, not decoded.id
      { $set: changes },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      console.log('Product not found with ID:', id);
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    console.log('Product updated successfully:', updatedProduct);
    return NextResponse.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ message: 'Error updating product', status: 500 });
  }
}