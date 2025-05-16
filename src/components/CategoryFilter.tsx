import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Category } from '../types/productTypes';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  isLoading: boolean;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory,
  isLoading
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleSelectCategory = (category: string | null) => {
    onSelectCategory(category);
    setIsOpen(false);
  };
  
  // Sort and limit categories display
  const displayCategories = categories
    .sort((a, b) => b.products - a.products)
    .slice(0, 20); // Only show top 20 categories
  
  return (
    <div className="relative inline-block text-left w-full md:w-64" ref={dropdownRef}>
      <div 
        className="flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-gray-700 truncate">
          {isLoading ? 'Loading categories...' : (selectedCategory || 'All Categories')}
        </span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto animate-fadeIn">
          <div 
            className="px-4 py-2 hover:bg-emerald-50 cursor-pointer border-b border-gray-100"
            onClick={() => handleSelectCategory(null)}
          >
            All Categories
          </div>
          
          {isLoading ? (
            <div className="px-4 py-3 text-gray-500 text-center">Loading categories...</div>
          ) : (
            displayCategories.map((category) => (
              <div 
                key={category.id}
                className="px-4 py-2 hover:bg-emerald-50 cursor-pointer text-sm"
                onClick={() => handleSelectCategory(category.id)}
              >
                <span className="block truncate">{category.name}</span>
                <span className="text-xs text-gray-500">{category.products.toLocaleString()} products</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;