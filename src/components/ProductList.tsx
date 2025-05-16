import React from 'react';
import { Product } from '../types/productTypes';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

const ProductList: React.FC<ProductListProps> = ({ products, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm h-80 animate-pulse">
            <div className="bg-gray-200 h-48 rounded-t-lg"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p>Error: {error}</p>
        <p className="text-sm mt-2">Please try again later or refresh the page.</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
        <p>No products found matching your criteria.</p>
        <p className="text-sm mt-2">Try changing your search terms or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.code} product={product} />
      ))}
    </div>
  );
};

export default ProductList;