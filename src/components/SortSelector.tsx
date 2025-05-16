import React from 'react';
import { SortOption } from '../types/productTypes';
import { ArrowUpDown } from 'lucide-react';

interface SortSelectorProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SortSelector: React.FC<SortSelectorProps> = ({ currentSort, onSortChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-gray-700 text-sm flex items-center">
        <ArrowUpDown size={16} className="mr-2" />
        Sort by:
      </span>
      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="border border-gray-300 rounded-lg text-sm py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
      >
        <option value="name_asc">Name (A-Z)</option>
        <option value="name_desc">Name (Z-A)</option>
        <option value="grade_asc">Nutrition Grade (A-E)</option>
        <option value="grade_desc">Nutrition Grade (E-A)</option>
      </select>
    </div>
  );
};

export default SortSelector;