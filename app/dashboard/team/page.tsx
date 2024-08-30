// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { IProduct } from '@/app/models/Product';
import Header from '@/components/mainheader';

const Dashboard = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/product');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          throw new Error('Expected an array of products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products.');
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-6 bg-gradient-to-r from-blue-50 to-indigo-50 min-h-screen">
      <Header />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Team Memeber Dashboard</h1>
        <p className="text-lg text-gray-600">Role: Team Memeber</p>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error message */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: IProduct) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;