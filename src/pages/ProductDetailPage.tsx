import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { fetchProductDetails } from '../api/foodApi';
import { Product } from '../types/productTypes';
import LoadingSpinner from '../components/LoadingSpinner';
import NutritionGradeBadge from '../components/NutritionGradeBadge';
import NutritionTable from '../components/NutritionTable';
import IngredientsSection from '../components/IngredientsSection';

const ProductDetailPage: React.FC = () => {
  const { barcode } = useParams<{ barcode: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'nutrition'>('ingredients');
  
  useEffect(() => {
    const loadProductDetails = async () => {
      if (!barcode) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetchProductDetails(barcode);
        
        if (response.status === 0) {
          setError('Product not found. Please check the barcode and try again.');
        } else {
          setProduct(response.product);
          
          // Update page title
          document.title = response.product.product_name 
            ? `${response.product.product_name} | FoodFinder`
            : 'Product Details | FoodFinder';
        }
      } catch (err) {
        setError('Failed to load product details. Please try again later.');
        console.error('Error loading product details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProductDetails();
    
    // Reset title when unmounting
    return () => {
      const defaultTitle = document.querySelector('title[data-default]')?.textContent;
      if (defaultTitle) document.title = defaultTitle;
    };
  }, [barcode]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700 mb-6">{error || 'Product not found'}</p>
          <Link 
            to="/" 
            className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  // Format and prepare data
  const productName = product.product_name || 'Unnamed Product';
  const brands = product.brands || 'Unknown Brand';
  const quantity = product.quantity || '';
  const categories = product.categories || '';
  const nutritionGrade = product.nutrition_grade_fr || product.nutriscore_grade || 'unknown';
  
  // Get all available images
  const images = {
    front: product.image_front_url,
    product: product.image_url,
    ingredients: product.image_ingredients_url,
    nutrition: product.image_nutrition_url,
  };
  
  // Find the first available image
  const mainImage = images.front || images.product || 'https://placehold.co/600x400/e5e7eb/a3a3a3?text=No+Image';
  
  // Get all product labels
  const labels = product.labels_tags?.map(label => 
    label.replace('en:', '').replace(/-/g, ' ')
  ) || [];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-emerald-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-xl font-bold truncate">{productName}</h1>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="md:flex">
            {/* Product image */}
            <div className="md:w-1/3 bg-gray-100 flex items-center justify-center">
              <img 
                src={mainImage}
                alt={productName}
                className="w-full object-contain max-h-96"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://placehold.co/600x400/e5e7eb/a3a3a3?text=No+Image';
                }}
              />
            </div>
            
            {/* Product info */}
            <div className="md:w-2/3 p-6">
              <div className="flex flex-wrap items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">{productName}</h1>
                  <p className="text-gray-600 mb-2">{brands} {quantity && `- ${quantity}`}</p>
                  {categories && <p className="text-sm text-gray-500">Categories: {categories}</p>}
                </div>
                <div className="ml-4">
                  <NutritionGradeBadge grade={nutritionGrade} size="lg" />
                </div>
              </div>
              
              {/* Product labels */}
              {labels.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-lg font-medium text-gray-800 mb-2">Labels</h2>
                  <div className="flex flex-wrap gap-2">
                    {labels.map((label, index) => (
                      <span 
                        key={index} 
                        className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-full"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Additional info like country, brands, etc. could go here */}
              {product.countries && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Countries:</span> {product.countries}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-t border-gray-200">
            <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 py-3 text-center font-medium ${
                  activeTab === 'ingredients' 
                    ? 'text-emerald-600 border-b-2 border-emerald-600' 
                    : 'text-gray-600 hover:text-emerald-500'
                }`}
                onClick={() => setActiveTab('ingredients')}
              >
                Ingredients
              </button>
              <button
                className={`flex-1 py-3 text-center font-medium ${
                  activeTab === 'nutrition' 
                    ? 'text-emerald-600 border-b-2 border-emerald-600' 
                    : 'text-gray-600 hover:text-emerald-500'
                }`}
                onClick={() => setActiveTab('nutrition')}
              >
                Nutrition
              </button>
            </div>
            
            <div className="p-6">
              {activeTab === 'ingredients' ? (
                <IngredientsSection product={product} />
              ) : (
                <NutritionTable product={product} />
              )}
            </div>
          </div>
        </div>
        
        {/* Additional images */}
        <div className="mt-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Additional Images</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(images).map(([key, url]) => 
              url && url !== mainImage ? (
                <div key={key} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-2 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 capitalize">{key} Image</h3>
                  </div>
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    <img 
                      src={url} 
                      alt={`${key} of ${productName}`}
                      className="max-h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailPage;