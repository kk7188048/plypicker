import { IProduct } from '@/models/Product';
import Link from 'next/link';

interface ProductCardProps {
  product: IProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="border p-4 rounded-lg shadow-sm">
      <img src={product.image} alt={product.productName} className="h-40 w-full object-cover mb-4" />
      <h2 className="text-lg font-semibold">{product.productName}</h2>
      <p className="text-gray-500">{product.productDescription}</p>
      <p className="text-lg font-bold">${product.price}</p>
      <p className="text-sm text-gray-500 mb-2">Department: {product.department}</p>
      <Link href={`/product/${product.id}`}>
        <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Edit Product</button>
      </Link>
    </div>
  );
};

export default ProductCard;




// import React from 'react';
// import Button from './Button';  // Assuming the Button component is correctly implemented
// import { IProduct } from '@/models/Product';

// interface ProductCardProps {
//   product: IProduct;
// }

// const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
//   const { productName, price, image, productDescription, department } = product;

//   return (
//     <div className="card flex flex-col gap-4 md:flex-row md:items-center border rounded-lg shadow-md p-4">
//       <picture className="w-full md:w-1/2">
//         <img
//           className="object-cover h-64 md:h-auto rounded-t-lg md:rounded-l-lg"
//           src={image}
//           alt={productName}
//           decoding="async"
//         />
//       </picture>
//       <div className="content px-4 py-6 md:p-8">
//         <h1 className="text-2xl font-semibold text-gray-800 md:text-3xl">
//           {productName}
//         </h1>
//         <p className="text-lg text-gray-600 mb-6">{productDescription}</p>
//         <p className="text-sm text-gray-500 mb-2">Department: {department}</p>
//         <div className="flex items-center mb-4">
//           <span className="text-2xl font-bold text-indigo-600 mr-4">
//             ${parseFloat(price).toFixed(2)}
//           </span>
//         </div>
//         <Button /> {/* Assuming Button is a functional component */}
//       </div>
//     </div>
//   );
// };

// export default ProductCard;


