// Example usage in an API route
import { fetchProducts, addProductsToMongo } from '@/utils/fetchproduct'; // Assuming `products.ts` in `utils` directory
import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const products = await fetchProducts();
    await addProductsToMongo(products);
    return NextResponse.json({ message: 'Products added successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error adding products' }, { status: 500 });
  }
}