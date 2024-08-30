import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/utils/mongoose';
import { Review } from '@/app/models/Review';
import { Product } from '@/app/models/Product';
import jwt from 'jsonwebtoken';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    console.log('Database connected successfully.');

    const { id } = params; // Review ID from the URL
    console.log('Received review ID:', id);

    const { status } = await req.json(); // Extract status from the request body
    console.log('Received status:', status);

    // Validate the incoming status
    if (!['approved', 'rejected'].includes(status)) {
      console.log('Invalid status received:', status);
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    // Get the JWT token from cookies
    const token = req.cookies.get('token')?.value;
    if (!token) {
      console.log('No token found, returning unauthorized');
      return NextResponse.json({ message: 'Unauthorized: No token found' }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET environment variable is not set');
      return NextResponse.json({ message: 'Internal server error: Secret not set' }, { status: 500 });
    }

    // Verify token and extract admin ID
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    console.log('Decoded token:', decoded);

    const adminId = decoded.id;
    console.log('Admin ID:', adminId);

    if (decoded.role !== 'admin') {
      console.log('User is not an admin, returning unauthorized');
      return NextResponse.json({ message: 'Unauthorized: Not an admin' }, { status: 403 });
    }

    // Find the review
    const review = await Review.findOne({ id });

    if (!review) {
      console.log('Review not found with ID:', id);
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    // Update the review status and adminId
    review.status = status;
    review.adminId = adminId;

    // If the review is approved, update the product
    if (status === 'approved') {
      console.log('Approving review:', review);
      const productUpdate = await Product.findOneAndUpdate(
        { id: review.id }, // Use the productId from the review
        { $set: review.changes }, // Update the product with the changes from the review
        { new: true, runValidators: true } // Options
      );

      if (!productUpdate) {
        console.log('Product not found with ID:', review.productId);
        return NextResponse.json({ message: 'Product not found for update' }, { status: 404 });
      }
      console.log('Product updated successfully:', productUpdate);
    } else if (status === 'rejected') {
      console.log('Rejecting review:', review);
    }

    await review.save(); // Save the updated review
    console.log('Review updated successfully:', review);

    return NextResponse.json({ message: `Review ${status} successfully`, review: review }, { status: 200 });
  } catch (error) {
    console.error('Error updating review status:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}