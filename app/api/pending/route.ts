// /app/api/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/utils/mongoose';
import { Review } from '@/app/models/Review';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const pendingReviews = await Review.find({ status: 'pending' })
    return NextResponse.json(pendingReviews);
  } catch (error) {
    console.error('Failed to fetch pending reviews:', error);
    return NextResponse.json({ message: 'Failed to fetch pending reviews', error }, { status: 500 });
  }
}
