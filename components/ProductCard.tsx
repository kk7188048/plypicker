// components/ProductCard.tsx
import React from 'react';
import { IProduct } from '@/app/models/Product';
import Link from 'next/link';

interface ProductCardProps {
  product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-200 hover:scale-105">
      {product.image && (
        <div className="relative w-full" style={{ paddingBottom: '75%' }}> {/* 4:3 Aspect Ratio */}
          <img
            src={product.image}
            alt={product.productName}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-xl font-bold mb-2 text-gray-800">{product.productName}</h2>
        <p className="text-gray-600 mb-2">{product.productDescription}</p>
        <p className='text-gray-600 mb-2'>Category: {product.department}</p>
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold text-blue-500">${product.price}</p>
          <Link href={`/product/${product.id}`}>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200">
              Edit Product
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;