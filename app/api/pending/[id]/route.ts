// /app/api/reviews/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/utils/mongoose';
import { Review } from '@/app/models/Review';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const review = await Review.findOne({ id: params.id });
    if (!review) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }
    return NextResponse.json(review);
  } catch (error) {
    console.error('Failed to fetch review details:', error);
    return NextResponse.json({ message: 'Failed to fetch review details', error }, { status: 500 });
  }
}
