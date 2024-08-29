import { NextResponse } from 'next/server';
import { dbConnect } from '@/utils/mongoose';
import { Review } from '@/models/Review';
import { Product } from '@/models/Product';

// PUT (approve or reject) a specific review
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;
  const { status, adminId } = await request.json(); // status: 'approved' or 'rejected', adminId: user ID

  try {
    const review = await Review.findById(id);
    if (!review) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    // If approved, update the product with the suggested changes
    if (status === 'approved') {
      await Product.findByIdAndUpdate(review.productId, review.changes);
    }

    // Update the review status
    review.status = status;
    review.adminId = adminId;
    await review.save();

    return NextResponse.json({ message: `Review ${status}` });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating review status' }, { status: 500 });
  }
}
