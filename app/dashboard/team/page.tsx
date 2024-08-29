''
import { GetStaticProps } from 'next';
import ProductCard from '@/components/ProductCard';
import { Product, IProduct } from '@/models/Product';
import { dbConnect } from '@/utils/mongoose';
interface DashboardProps {
  products: IProduct[];
}

const Dashboard = async () => {
  let data = await fetch(' http://localhost:3000/api/product')
  let products = await data.json()
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product: IProduct) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default Dashboard;
