import axios from 'axios';
import { IProduct, Product } from '@/app/models/Product';

export async function fetchProducts(): Promise<IProduct[]> {
  try {
    const response = await axios.get('https://64e0caef50713530432cafa1.mockapi.io/api/products');
    return response.data as IProduct[];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error; // Re-throw error for handling in `addProductsToMongo`
  }
}

export async function addProductsToMongo(products: IProduct[]) {
  try {
    await Promise.all(
      products.map(async (product) => {
        const newProduct = new Product(product);
        await newProduct.save();
      })
    );
    console.log('Products added successfully to MongoDB');
  } catch (error) {
    console.error('Error adding products to MongoDB:', error);
  }
}