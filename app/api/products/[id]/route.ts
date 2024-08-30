import { NextResponse, NextRequest } from 'next/server';
import { dbConnect } from '@/utils/mongoose';
import { Product } from '@/app/models/Product';

// GET a specific product
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;

  try {
    const product = await Product.findOne({ id });
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching product' }, { status: 500 });
  }
}



