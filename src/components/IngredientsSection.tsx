import React from 'react';
import { Product } from '../types/productTypes';

interface IngredientsSectionProps {
  product: Product;
}

const IngredientsSection: React.FC<IngredientsSectionProps> = ({ product }) => {
  const ingredientsText = product.ingredients_text || '';
  const allergensArray = product.allergens_tags || [];
  const tracesArray = product.traces_tags || [];
  
  // Process allergens to remove prefix
  const allergens = allergensArray
    .map(allergen => allergen.replace('en:', '').replace(/-/g, ' '))
    .filter(allergen => allergen);
  
  // Process traces to remove prefix
  const traces = tracesArray
    .map(trace => trace.replace('en:', '').replace(/-/g, ' '))
    .filter(trace => trace);
  
  // Format ingredients text with proper line breaks
  const formattedIngredients = ingredientsText
    .split(/,(?![^(]*\))/)
    .map(ingredient => ingredient.trim())
    .filter(ingredient => ingredient);
  
  if (!ingredientsText && allergens.length === 0 && traces.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
        No ingredients information available
      </div>
    );
  }
  
  // Handle case where only ingredient image is available
  if (!ingredientsText && product.image_ingredients_url) {
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <img 
            src={product.image_ingredients_url} 
            alt="Ingredients" 
            className="mx-auto max-h-80 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
        {(allergens.length > 0 || traces.length > 0) && (
          <div className="mt-4 space-y-2">
            {allergens.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-red-600">Allergens:</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {allergens.map((allergen, index) => (
                    <span 
                      key={index} 
                      className="inline-block px-2 py-1 bg-red-50 text-red-700 text-xs rounded-md"
                    >
                      {allergen}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {traces.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-amber-600">May contain traces of:</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {traces.map((trace, index) => (
                    <span 
                      key={index} 
                      className="inline-block px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-md"
                    >
                      {trace}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {formattedIngredients.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {formattedIngredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
      )}
      
      {(allergens.length > 0 || traces.length > 0) && (
        <div className="space-y-3">
          {allergens.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-red-600">Allergens:</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {allergens.map((allergen, index) => (
                  <span 
                    key={index} 
                    className="inline-block px-2 py-1 bg-red-50 text-red-700 text-xs rounded-md"
                  >
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {traces.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-amber-600">May contain traces of:</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {traces.map((trace, index) => (
                  <span 
                    key={index} 
                    className="inline-block px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-md"
                  >
                    {trace}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IngredientsSection;