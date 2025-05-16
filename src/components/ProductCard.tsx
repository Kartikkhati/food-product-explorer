import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/productTypes';
import NutritionGradeBadge from './NutritionGradeBadge';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Default placeholder image if no image is available
  const imageUrl = product.image_front_url || product.image_url || product.image_small_url || 'https://placehold.co/400x300/e5e7eb/a3a3a3?text=No+Image';
  
  // Extract the first category if available
  const category = product.categories_tags?.length > 0 
    ? product.categories_tags[0].split(':').pop()?.replace(/-/g, ' ') 
    : (product.categories?.split(',')[0] || 'Uncategorized');
  
  // Limit ingredients text to avoid overflowing
  const truncatedIngredients = product.ingredients_text 
    ? product.ingredients_text.slice(0, 80) + (product.ingredients_text.length > 80 ? '...' : '')
    : 'No ingredients information available';
  
  // Get nutrition grade or default value if missing
  const nutritionGrade = product.nutrition_grade_fr || product.nutriscore_grade || 'unknown';
  
  return (
    <Link to={`/product/${product.code}`} className="group">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col overflow-hidden border border-gray-200">
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img 
            src={imageUrl} 
            alt={product.product_name || 'Food product'} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://placehold.co/400x300/e5e7eb/a3a3a3?text=No+Image';
            }}
          />
          <div className="absolute top-2 right-2">
            <NutritionGradeBadge grade={nutritionGrade} />
          </div>
        </div>
        
        <div className="p-4 flex-grow flex flex-col">
          <div className="mb-1">
            <span className="text-xs text-emerald-600 font-medium uppercase tracking-wide">{category}</span>
          </div>
          <h3 className="text-gray-900 font-medium text-lg mb-2 line-clamp-2">
            {product.product_name || 'Unnamed Product'}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
            {truncatedIngredients}
          </p>
          <div className="text-gray-500 text-xs">
            {product.brands && <span className="block">Brand: {product.brands}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;