import React from 'react';

interface NutritionGradeBadgeProps {
  grade: string;
  size?: 'sm' | 'md' | 'lg';
}

const NutritionGradeBadge: React.FC<NutritionGradeBadgeProps> = ({ grade, size = 'md' }) => {
  // Normalize grade to lowercase and handle unknown values
  const normalizedGrade = grade?.toLowerCase() || 'unknown';
  
  // Define colors for each grade
  const gradeColors = {
    a: 'bg-green-500',
    b: 'bg-lime-500',
    c: 'bg-yellow-500',
    d: 'bg-orange-500',
    e: 'bg-red-500',
    unknown: 'bg-gray-400'
  };
  
  // Get the color for this grade
  const bgColor = gradeColors[normalizedGrade as keyof typeof gradeColors] || gradeColors.unknown;
  
  // Set size classes
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  };
  
  return (
    <div className={`${bgColor} ${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-bold`}>
      {normalizedGrade === 'unknown' ? '?' : normalizedGrade.toUpperCase()}
    </div>
  );
};

export default NutritionGradeBadge;