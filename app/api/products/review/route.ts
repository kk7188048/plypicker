import { NextResponse, NextRequest } from 'next/server';
import { dbConnect } from '@/utils/mongoose';
import { Product } from '@/models/Product';
import { Review } from '@/models/Review';

// PUT (submit changes for review) a specific product
export async function PUT(request: NextRequest) {
  await dbConnect();

  const { id, changes, author } = await request.json(); // id, changes: {productName, price, ...}, author: user ID
  console.log('Received data:', { id, changes, author });

  try {
    const product = await Product.findOne({ id });
    if (!product) {
      console.log('Product not found with ID:', id);
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    console.log('Found product:', product);

    // Create a new review document with the changes and set status to 'pending'
    const review = new Review({
      id: id,
      changes,
      status: 'pending',
      author,
      adminId: null // Will be assigned later by an admin
    });
    console.log('Review object before saving:', review);

    // Attempt to save the review
    await review.save();
    console.log('Review created successfully:', review);
    return NextResponse.json({ message: 'Changes submitted for review' });
  }catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Error submitting changes for review', error: error.message }, { status: 500 });
    } else {
      // Handle other types of errors
      return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
    }
  }
}