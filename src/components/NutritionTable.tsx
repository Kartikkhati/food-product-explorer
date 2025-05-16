import React from 'react';
import { Product } from '../types/productTypes';

interface NutritionTableProps {
  product: Product;
}

const NutritionTable: React.FC<NutritionTableProps> = ({ product }) => {
  const nutriments = product.nutriments;
  
  if (!nutriments) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
        No nutritional information available
      </div>
    );
  }
  
  // Define the nutrient data we want to display
  const nutritionData = [
    { 
      name: 'Energy', 
      value: nutriments['energy-kcal'] || nutriments.energy, 
      unit: nutriments['energy-kcal_unit'] || nutriments.energy_unit || 'kcal' 
    },
    { 
      name: 'Fat', 
      value: nutriments.fat, 
      unit: nutriments.fat_unit || 'g' 
    },
    { 
      name: 'Saturated Fat', 
      value: nutriments.saturated_fat, 
      unit: nutriments.saturated_fat_unit || 'g' 
    },
    { 
      name: 'Carbohydrates', 
      value: nutriments.carbohydrates, 
      unit: nutriments.carbohydrates_unit || 'g' 
    },
    { 
      name: 'Sugars', 
      value: nutriments.sugars, 
      unit: nutriments.sugars_unit || 'g' 
    },
    { 
      name: 'Fiber', 
      value: nutriments.fiber, 
      unit: nutriments.fiber_unit || 'g' 
    },
    { 
      name: 'Proteins', 
      value: nutriments.proteins, 
      unit: nutriments.proteins_unit || 'g' 
    },
    { 
      name: 'Salt', 
      value: nutriments.salt, 
      unit: nutriments.salt_unit || 'g' 
    },
    { 
      name: 'Sodium', 
      value: nutriments.sodium, 
      unit: nutriments.sodium_unit || 'g' 
    }
  ];
  
  // Filter out entries with no value
  const filteredData = nutritionData.filter(item => 
    item.value !== undefined && item.value !== null
  );
  
  if (filteredData.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
        No nutritional information available
      </div>
    );
  }
  
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nutrient
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Per 100g/100ml
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.name}
              </td>
              <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                {typeof item.value === 'number' ? item.value.toFixed(2) : item.value} {item.unit}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {product.serving_size && (
        <div className="bg-gray-50 px-6 py-3 text-xs text-gray-500 border-t border-gray-200">
          Serving size: {product.serving_size}
        </div>
      )}
    </div>
  );
};

export default NutritionTable;